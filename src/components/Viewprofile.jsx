import styles from "./ViewProfile.module.css";

export default function ViewProfile({ user, onClose }) {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>User Profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Profile Content */}
        <div className={styles.profileContent}>
          {/* Basic Info */}
          <div className={styles.basicInfo}>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user.name || "Unknown User"}</h3>

              {user.location && (
                <p className={styles.userLocation}>📍 {user.location}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>About</h4>
              <p className={styles.bioText}>{user.bio}</p>
            </div>
          )}

          {/* Skills Offered */}
          {user.skillsOffered && user.skillsOffered.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>💡 Skills They Offer</h4>
              <div className={styles.skillsTags}>
                {user.skillsOffered.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Wanted */}
          {user.skillsWanted && user.skillsWanted.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>🎯 Skills They Want</h4>
              <div className={styles.skillsTags}>
                {user.skillsWanted.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Links */}
          {user.portfolioLinks && user.portfolioLinks.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>🔗 Portfolio Links</h4>
              <div className={styles.portfolioLinks}>
                {user.portfolioLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.portfolioLink}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Member Since */}
          {user.createdAt && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>📅 Member Since</h4>
              <p className={styles.memberSince}>
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button className={styles.connectButton}>
            🤝 Send Connection Request
          </button>
          <button className={styles.messageButton}>💬 Send Message</button>
        </div>
      </div>
    </div>
  );
}
