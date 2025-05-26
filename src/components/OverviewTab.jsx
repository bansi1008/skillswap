import styles from "./OverviewTab.module.css";

export default function OverviewTab({ userData }) {
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsCard}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🔍</span>
              Find Skills
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📝</span>
              Update Profile
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>💬</span>
              Messages
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🎯</span>
              Browse Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
