import styles from "./AllConnectionModel.module.css";

export default function AllConnectionModel({ ActiveTab, user }) {
  if (!ActiveTab || !user) return null;

  const closeModal = () => {
    // This would need to be passed from parent to close the modal
    window.location.reload(); // Temporary solution
  };

  const handleremove = async (connectionId) => {
    try {
      const response = await fetch("/api/conncetion/removecon", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connectionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove connection");
      }

      const data = await response.json();

      window.location.reload(); // Refresh to reflect changes
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>My Connections</h2>
          <div className={styles.headerActions}>
            <div className={styles.connectionsCount}>
              {user.length} {user.length === 1 ? "connection" : "connections"}
            </div>
            <button className={styles.closeButton} onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {user.length === 0 ? (
            <div className={styles.emptyConnections}>
              <div className={styles.emptyIcon}>👥</div>
              <h3>No connections yet</h3>
              <p>Start connecting with other users to build your network!</p>
            </div>
          ) : (
            <div className={styles.connectionsGrid}>
              {user.map((connection) => (
                <div key={connection._id} className={styles.connectionCard}>
                  {/* User Header */}
                  <div className={styles.connectionHeader}>
                    <div className={styles.userAvatar}>
                      {connection.name
                        ? connection.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className={styles.userBasicInfo}>
                      <h3 className={styles.connectionUserName}>
                        {connection.name || "Unknown User"}
                      </h3>
                      {connection.location && (
                        <p className={styles.connectionUserLocation}>
                          📍 {connection.location}
                        </p>
                      )}
                      <div className={styles.connectionsCount}>
                        👥{" "}
                        {connection.connections
                          ? connection.connections.length
                          : 0}{" "}
                        connections
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {connection.bio && (
                    <div className={styles.connectionSection}>
                      <h4 className={styles.connectionSectionTitle}>About</h4>
                      <p className={styles.connectionBio}>{connection.bio}</p>
                    </div>
                  )}
                  {connection.bio && (
                    <div className={styles.connectionSection}>
                      <h4 className={styles.connectionSectionTitle}>email</h4>
                      <p className={styles.connectionBio}>{connection.email}</p>
                    </div>
                  )}

                  {/* Skills Offered */}
                  {connection.skillsOffered &&
                    connection.skillsOffered.length > 0 && (
                      <div className={styles.connectionSection}>
                        <h4 className={styles.connectionSectionTitle}>
                          💡 Skills They Offer
                        </h4>
                        <div className={styles.connectionSkillsTags}>
                          {connection.skillsOffered.map((skill, index) => (
                            <span
                              key={index}
                              className={styles.connectionSkillTag}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Skills Wanted */}
                  {connection.skillsWanted &&
                    connection.skillsWanted.length > 0 && (
                      <div className={styles.connectionSection}>
                        <h4 className={styles.connectionSectionTitle}>
                          🎯 Skills They Want
                        </h4>
                        <div className={styles.connectionSkillsTags}>
                          {connection.skillsWanted.map((skill, index) => (
                            <span
                              key={index}
                              className={styles.connectionSkillTag}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Portfolio Links */}
                  {connection.portfolioLinks &&
                    connection.portfolioLinks.length > 0 && (
                      <div className={styles.connectionSection}>
                        <h4 className={styles.connectionSectionTitle}>
                          🔗 Portfolio
                        </h4>
                        <div className={styles.connectionPortfolioLinks}>
                          {connection.portfolioLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.connectionPortfolioLink}
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Member Since */}
                  {connection.createdAt && (
                    <div className={styles.connectionSection}>
                      <h4 className={styles.connectionSectionTitle}>
                        📅 Member Since
                      </h4>
                      <p className={styles.memberSince}>
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Connection Actions */}
                  <div className={styles.connectionActions}>
                    <button
                      className={styles.viewProfileButton}
                      onClick={() => handleremove(connection._id)}
                    >
                      👤 Remove Connection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
