import styles from "./DashboardStats.module.css";

export default function DashboardStats({ userData }) {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>
              {userData.skillsWanted?.length || 0}
            </h3>
            <p className={styles.statLabel}>Skills Wanted</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>
              {userData.skillsOffered?.length || 0}
            </h3>
            <p className={styles.statLabel}>Skills Offered</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📍</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{userData.location ? 1 : 0}</h3>
            <p className={styles.statLabel}>Active Location</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🤝</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{userData.connections.length}</h3>
            <p className={styles.statLabel}>Connections</p>
          </div>
        </div>
      </div>
    </section>
  );
}
