import styles from "./MatchesTab.module.css";
import { useState, useEffect } from "react";
import ViewProfile from "./Viewprofile";

export default function MatchesTab({ setActiveTab }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const fetchUserProfile = async (userId) => {
    try {
      setProfileLoading(true);

      const response = await fetch(`/api/oneuser/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      if (data.user) {
        setSelectedUser(data.user);
        setShowProfile(true);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      showNotification("Failed to load user profile", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedUser(null);
  };

  const handleConnect = async (userId) => {
    try {
      const response = await fetch("api/conncetion/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: userId }),
      });
      console.log("Sending connection request to user ID:", userId);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send connection request"
        );
      }
      const data = await response.json();
      showNotification(
        data.message || "Connection request sent successfully!",
        "success"
      );
    } catch (err) {
      console.error("Error sending connection request:", err);
      showNotification(
        err.message || "Failed to send connection request",
        "error"
      );
    }
  };

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/match");

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.matchwiths || []);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 3) return styles.highMatch;
    if (score >= 2) return styles.mediumMatch;
    return styles.lowMatch;
  };

  const getMatchScoreText = (score) => {
    if (score >= 3) return "High Match";
    if (score >= 2) return "Good Match";
    return "Potential Match";
  };

  if (isLoading) {
    return (
      <div className={styles.matchesContent}>
        <div className={styles.matchesCard}>
          <h2 className={styles.cardTitle}>Potential Matches</h2>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Finding your perfect matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.matchesContent}>
        <div className={styles.matchesCard}>
          <h2 className={styles.cardTitle}>Potential Matches</h2>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Error loading matches</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={fetchMatches}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={styles.matchesContent}>
        <div className={styles.matchesCard}>
          <h2 className={styles.cardTitle}>Potential Matches</h2>
          <div className={styles.emptyMatches}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No matches found yet</h3>
            <p>Once you add skills, we'll help you find perfect matches!</p>
            <button
              className={styles.findMatchesButton}
              onClick={() => setActiveTab("skills")}
            >
              Add Skills First
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.matchesContent}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <span className={styles.notificationIcon}>
              {notification.type === "success"
                ? "✅"
                : notification.type === "error"
                ? "❌"
                : "ℹ️"}
            </span>
            <span className={styles.notificationMessage}>
              {notification.message}
            </span>
            <button
              className={styles.notificationClose}
              onClick={dismissNotification}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={styles.matchesHeader}>
        <h2 className={styles.pageTitle}>Potential Matches</h2>
        <div className={styles.matchesCount}>
          {matches.length} {matches.length === 1 ? "match" : "matches"} found
        </div>
      </div>

      <div className={styles.matchesGrid}>
        {matches.map((match, index) => (
          <div key={index} className={styles.matchCard}>
            <div className={styles.matchHeader}>
              <div className={styles.matchInfo}>
                <h3 className={styles.matchName}>{match.name}</h3>

                {match.location && (
                  <p className={styles.matchLocation}>📍 {match.location}</p>
                )}
              </div>
              <div
                className={`${styles.matchScore} ${getMatchScoreColor(
                  match.matchScore
                )}`}
              >
                <span className={styles.scoreNumber}>{match.matchScore}</span>
                <span className={styles.scoreText}>
                  {getMatchScoreText(match.matchScore)}
                </span>
              </div>
            </div>

            <div className={styles.skillsSection}>
              <div className={styles.skillsOffered}>
                <h4 className={styles.skillsTitle}>💡 Skills They Offer</h4>
                <div className={styles.skillsTags}>
                  {match.skillsOffered.map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.skillsWanted}>
                <h4 className={styles.skillsTitle}>🎯 Skills They Want</h4>
                <div className={styles.skillsTags}>
                  {match.skillsWanted.map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.matchActions}>
              <button
                className={styles.connectButton}
                onClick={() => handleConnect(match._id || match.id)}
              >
                🤝 Connect
              </button>
              <button
                className={styles.viewProfileButton}
                onClick={() => fetchUserProfile(match._id || match.id)}
                disabled={profileLoading}
              >
                {profileLoading === (match._id || match.id)
                  ? "⏳ Loading..."
                  : "👤 View Profile"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {showProfile && selectedUser && (
        <ViewProfile
          user={selectedUser}
          onClose={closeProfile}
          handleConnect={handleConnect}
        />
      )}
    </div>
  );
}
