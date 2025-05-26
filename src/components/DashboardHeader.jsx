import Link from "next/link";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({
  userData,
  activeTab,
  setActiveTab,
  handleLogout,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>SkillSwap</span>
        </Link>

        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "skills" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("skills")}
          >
            My Skills
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "matches" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("matches")}
          >
            Matches
          </button>
        </nav>

        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userData.name}</span>
            <div className={styles.userAvatar}>
              {userData.name?.charAt(0).toUpperCase() || ""}
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
