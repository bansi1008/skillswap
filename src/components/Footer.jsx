import Link from "next/link";
import styles from "./Footer.module.css";
import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.branding}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>
                Skill<span className={styles.logoHighlight}>Swap</span>
              </span>
            </Link>
            <p className={styles.tagline}>Connect, Learn & Share Skills</p>
            <div className={styles.socialLinks}>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialIcon}>𝕏</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialIcon}>📸</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialIcon}>in</span>
              </a>
            </div>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>Platform</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/find-skills" className={styles.link}>
                    Find Skills
                  </Link>
                </li>
                <li>
                  <Link href="/offer-skills" className={styles.link}>
                    Offer Skills
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className={styles.link}>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className={styles.link}>
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>Company</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/about" className={styles.link}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className={styles.link}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={styles.link}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className={styles.link}>
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>Support</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/help" className={styles.link}>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.link}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/community" className={styles.link}>
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className={styles.link}>
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/terms" className={styles.link}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={styles.link}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className={styles.link}>
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className={styles.link}>
                    Safety Tips
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.newsletter}>
          <h3 className={styles.newsletterTitle}>Join our newsletter</h3>
          <p className={styles.newsletterText}>
            Stay updated with the latest skills and opportunities.
          </p>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.newsletterInput}
              aria-label="Email for newsletter"
              required
            />
            <button type="submit" className={styles.newsletterButton}>
              Subscribe
            </button>
          </form>
        </div>

        <div className={styles.bottomSection} suppressHydrationWarning={true}>
          <p className={styles.copyright}>
            © {year} SkillSwap. All rights reserved.
          </p>
          <p className={styles.madeWith}>Made by{" Bansi"}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
