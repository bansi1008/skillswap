import styles from "./MatchesTab.module.css";

export default function MatchesTab({ setActiveTab }) {
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
