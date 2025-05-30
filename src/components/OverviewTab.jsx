import styles from "./OverviewTab.module.css";
import Allconnectionmodel from "./Allconnectionmodel";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import { set } from "mongoose";
import { database } from "../model/firebase";
import { ref, onValue, off } from "firebase/database";

export default function OverviewTab({ userData, onProfileUpdate }) {
  const [form, setForm] = useState({
    name: userData.name || "",
    location: userData.location || "",
    bio: userData.bio || "",
    portfolioLinks: userData.portfolioLinks || [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ActiveTab, setActiveTab] = useState(false);
  const [user, setuser] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [invitationCount, setInvitationCount] = useState(0);
  const [chat, setChat] = useState(false);

  const handlechat = async () => {
    if (!chat) {
      // Opening chat - fetch connections data if not already available
      if (!user || user.length === 0) {
        try {
          const response = await fetch("/api/conncetion/allconnection");
          if (response.ok) {
            const data = await response.json();
            const alluser = data.users;
            setuser(alluser || []);
          } else {
            console.error("Failed to fetch connections for chat");
          }
        } catch (error) {
          console.error("Error fetching connections for chat:", error);
        }
      }
    }
    setChat(!chat);
  };

  // Fetch counts when component mounts
  useEffect(() => {
    fetchConnectionCount();
    fetchInvitationCount();
  }, []);

  const fetchConnectionCount = async () => {
    try {
      const response = await fetch("/api/conncetion/allconnection");
      if (response.ok) {
        const data = await response.json();
        const alluser = data.users;
        setConnectionCount(alluser ? alluser.length : 0);
      }
    } catch (error) {
      console.error("Error fetching connection count:", error);
    }
  };

  const fetchInvitationCount = async () => {
    try {
      const response = await fetch("/api/conncetion/allrequest");
      if (response.ok) {
        const data = await response.json();
        const users = data.users;
        setInvitationCount(users ? users.length : 0);
      }
    } catch (error) {
      console.error("Error fetching invitation count:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePortfolioLinkChange = (index, field, value) => {
    const updatedLinks = [...form.portfolioLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setForm((prev) => ({ ...prev, portfolioLinks: updatedLinks }));
  };

  const addPortfolioLink = () => {
    setForm((prev) => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, { name: "", url: "" }],
    }));
  };

  const removePortfolioLink = (index) => {
    const updatedLinks = form.portfolioLinks.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, portfolioLinks: updatedLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: form.location,
          bio: form.bio,
          portfolioLinks: form.portfolioLinks.filter(
            (link) => link.name && link.url
          ),
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert("Error updating profile: " + errorData.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleconnection = async () => {
    try {
      const response = await fetch("/api/conncetion/allconnection");
      if (!response.ok) {
        console.log("Failed to fetch connections");
        throw new Error("Failed to fetch connections");
      }
      const data = await response.json();
      const alluser = data.users;

      // Always open the modal - let AllConnectionModel handle empty state
      setuser(alluser || []);

      setActiveTab(true);
    } catch (error) {
      console.error("Error fetching connections:", error);
      alert("Failed to fetch connections. Please try again later.");
    } finally {
    }
  };

  const handleinvitatin = async () => {
    try {
      setIsLoading(true);
      // Close the edit modal if it's open
      setShowEditModal(false);

      const response = await fetch("/api/conncetion/allrequest");
      if (!response.ok) {
        throw new Error("Failed to fetch connection requests");
      }
      const data = await response.json();
      const users = data.users;

      // Always show the modal - let it handle empty state
      setShowInvitationsModal(true);
      setSelectedUser(users || []);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      alert("Failed to fetch connection requests. Please try again later.");
      setShowInvitationsModal(false);
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (userId) => {
    try {
      const response = await fetch("/api/conncetion/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromUserId: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept invitation");
      }

      const data = await response.json();

      // Refresh both counts since accepting creates a connection and removes an invitation
      fetchConnectionCount();
      fetchInvitationCount();

      // Refresh the invitations list
      handleinvitatin();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert(error.message || "Failed to accept invitation");
    }
  };

  const handleRejectInvitation = async (userId) => {
    try {
      const response = await fetch("/api/conncetion/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromUserId: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject invitation");
      }

      const data = await response.json();
      alert(data.message || "Connection request rejected successfully!");

      // Refresh invitation count since rejecting removes an invitation
      fetchInvitationCount();

      // Refresh the invitations list
      handleinvitatin();
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert(error.message || "Failed to reject invitation");
    }
  };

  const toggleForm = () => {
    if (!showEditModal) {
      // Close invitations if they're open
      setShowInvitationsModal(false);
      setSelectedUser(null);

      // Reset form when opening
      setForm({
        name: userData.name || "",
        location: userData.location || "",
        bio: userData.bio || "",
        portfolioLinks: userData.portfolioLinks || [],
      });
    }
    setShowEditModal(!showEditModal);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const closeInvitationsModal = () => {
    setShowInvitationsModal(false);
    setSelectedUser(null);
  };

  return (
    <div className={styles.overviewContent}>
      <div className={styles.contentGrid}>
        {/* Profile Summary */}
        <div className={styles.profileCard}>
          <h2 className={styles.cardTitle}>Your Profile</h2>
          <div className={styles.profileInfo}>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Name:</span>
              <span className={styles.profileValue}>
                {userData.name || "N/A"}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Email:</span>
              <span className={styles.profileValue}>
                {userData.email || "N/A"}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Location:</span>
              <span className={styles.profileValue}>
                {userData.location || "N/A"}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Member Since:</span>
              <span className={styles.profileValue}>
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Bio:</span>
              <span className={styles.profileValue}>
                {userData.bio || "N/A"}
              </span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Portfolio Links:</span>
              <div className={styles.profileValue}>
                {userData.portfolioLinks && userData.portfolioLinks.length > 0
                  ? userData.portfolioLinks.map((link, index) => (
                      <div key={index} className={styles.portfolioLink}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.portfolioLinkAnchor}
                        >
                          {link.name}
                        </a>
                      </div>
                    ))
                  : "No portfolio links added"}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsCard}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={toggleForm}>
              <div className={styles.actionButtonContent}>
                <span className={styles.actionIcon}>📝</span>
                {showEditModal ? "Cancel Edit" : "Update Profile"}
              </div>
            </button>
            <button className={styles.actionButton} onClick={handleconnection}>
              <div className={styles.actionButtonContent}>
                <span className={styles.actionIcon}>👥</span>
                My connection
                {connectionCount > 0 && (
                  <span className={styles.badge}>{connectionCount}</span>
                )}
              </div>
            </button>
            <button className={styles.actionButton} onClick={handleinvitatin}>
              <div className={styles.actionButtonContent}>
                <span className={styles.actionIcon}>📨</span>
                {isLoading ? "Loading..." : "Invitations"}
                {invitationCount > 0 && (
                  <span className={styles.badge}>{invitationCount}</span>
                )}
              </div>
            </button>
            <button className={styles.actionButton} onClick={handlechat}>
              <div className={styles.actionButtonContent}>
                <span className={styles.actionIcon}>💬</span>
                {isLoading ? "Loading..." : "Messages"}
              </div>
            </button>
          </div>
        </div>

        {/* Invitations Modal */}
        {showInvitationsModal && selectedUser && (
          <div className={styles.modalOverlay} onClick={closeInvitationsModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Connection Requests</h2>
                <div className={styles.headerActions}>
                  <div className={styles.invitationsCount}>
                    {selectedUser.length}{" "}
                    {selectedUser.length === 1 ? "request" : "requests"}
                  </div>
                  <button
                    className={styles.closeButton}
                    onClick={closeInvitationsModal}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className={styles.modalBody}>
                {selectedUser.length === 0 ? (
                  <div className={styles.emptyInvitations}>
                    <div className={styles.emptyIcon}>📨</div>
                    <h3>No connection requests</h3>
                    <p>
                      You don't have any pending connection requests at the
                      moment.
                    </p>
                  </div>
                ) : (
                  <div className={styles.invitationsGrid}>
                    {selectedUser.map((user) => (
                      <div key={user._id} className={styles.invitationCard}>
                        {/* User Header */}
                        <div className={styles.invitationHeader}>
                          <div className={styles.userAvatar}>
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div className={styles.userBasicInfo}>
                            <h3 className={styles.invitationUserName}>
                              {user.name || "Unknown User"}
                            </h3>
                            {user.location && (
                              <p className={styles.invitationUserLocation}>
                                📍 {user.location}
                              </p>
                            )}
                            <div className={styles.connectionsCount}>
                              👥{" "}
                              {user.connections ? user.connections.length : 0}{" "}
                              connections
                            </div>
                          </div>
                        </div>

                        {/* Bio Section */}
                        {user.bio && (
                          <div className={styles.invitationSection}>
                            <h4 className={styles.invitationSectionTitle}>
                              About
                            </h4>
                            <p className={styles.invitationBio}>{user.bio}</p>
                          </div>
                        )}

                        {/* Skills Offered */}
                        {user.skillsOffered &&
                          user.skillsOffered.length > 0 && (
                            <div className={styles.invitationSection}>
                              <h4 className={styles.invitationSectionTitle}>
                                💡 Skills They Offer
                              </h4>
                              <div className={styles.invitationSkillsTags}>
                                {user.skillsOffered.map((skill, index) => (
                                  <span
                                    key={index}
                                    className={styles.invitationSkillTag}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Skills Wanted */}
                        {user.skillsWanted && user.skillsWanted.length > 0 && (
                          <div className={styles.invitationSection}>
                            <h4 className={styles.invitationSectionTitle}>
                              🎯 Skills They Want
                            </h4>
                            <div className={styles.invitationSkillsTags}>
                              {user.skillsWanted.map((skill, index) => (
                                <span
                                  key={index}
                                  className={styles.invitationSkillTag}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Portfolio Links */}
                        {user.portfolioLinks &&
                          user.portfolioLinks.length > 0 && (
                            <div className={styles.invitationSection}>
                              <h4 className={styles.invitationSectionTitle}>
                                🔗 Portfolio
                              </h4>
                              <div className={styles.invitationPortfolioLinks}>
                                {user.portfolioLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.invitationPortfolioLink}
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Action Buttons */}
                        <div className={styles.invitationActions}>
                          <button
                            className={styles.acceptButton}
                            onClick={() => handleAcceptInvitation(user._id)}
                          >
                            ✅ Accept
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleRejectInvitation(user._id)}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/*all connections modal
         */}

        {/* Profile Update Modal */}
        {showEditModal && (
          <div className={styles.modalOverlay} onClick={closeEditModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Update Profile</h2>
                <button className={styles.closeButton} onClick={closeEditModal}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      disabled
                      title="Name cannot be changed"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Bio:</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Tell others about yourself"
                      rows="4"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.portfolioHeader}>
                      <label className={styles.formLabel}>
                        Portfolio Links:
                      </label>
                      <button
                        type="button"
                        onClick={addPortfolioLink}
                        className={styles.addButton}
                      >
                        + Add Link
                      </button>
                    </div>

                    {form.portfolioLinks.map((link, index) => (
                      <div key={index} className={styles.portfolioLinkForm}>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) =>
                            handlePortfolioLinkChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Link name (e.g., GitHub, Portfolio)"
                          className={styles.formInput}
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            handlePortfolioLinkChange(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="https://example.com"
                          className={styles.formInput}
                        />
                        <button
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                          className={styles.removeButton}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Allconnectionmodel
        ActiveTab={ActiveTab}
        user={user}
        currentUserId={userData._id || userData.id}
      />
      {chat && (
        <Chat
          user={user}
          onClose={() => setChat(false)}
          currentUserId={userData._id || userData.id}
        />
      )}
    </div>
  );
}
