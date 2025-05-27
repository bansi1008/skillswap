import styles from "./MatchesTab.module.css";
import { useState, useEffect } from "react";

export default function MatchesTab({ setActiveTab }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

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
              <button className={styles.connectButton}>🤝 Connect</button>
              <button className={styles.viewProfileButton}>
                👤 View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
