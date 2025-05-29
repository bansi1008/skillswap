import styles from "./about.module.css";
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className={styles.aboutWrapper}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Empowering Professionals Through
                <span className={styles.gradient}> Skill Exchange</span>
              </h1>
              <p className={styles.heroSubtitle}>
                SkillSwap revolutionizes professional development by connecting
                talented individuals worldwide, creating a community where
                knowledge knows no boundaries.
              </p>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>10K+</span>
                  <span className={styles.statLabel}>Active Members</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>500+</span>
                  <span className={styles.statLabel}>Skills Shared</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>50+</span>
                  <span className={styles.statLabel}>Countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className={styles.visionSection}>
          <div className={styles.container}>
            <div className={styles.visionGrid}>
              <div className={styles.visionContent}>
                <h2 className={styles.sectionTitle}>Our Vision</h2>
                <p className={styles.largeText}>
                  We envision a world where professional growth isn't limited by
                  geography, financial barriers, or traditional educational
                  constraints.
                </p>
                <p>
                  At SkillSwap, we believe that every professional has unique
                  expertise to share and valuable skills to learn. Our platform
                  bridges this gap, creating meaningful connections that drive
                  mutual growth and innovation.
                </p>
                <div className={styles.highlight}>
                  <span className={styles.quote}>"</span>
                  <p>
                    Learning never stops, and neither should the opportunities
                    to grow professionally.
                  </p>
                </div>
              </div>
              <div className={styles.visionImage}>
                <div className={styles.imageCard}>
                  <div className={styles.cardIcon}>🌍</div>
                  <h3>Global Network</h3>
                  <p>Connect with professionals across continents</p>
                </div>
                <div className={styles.imageCard}>
                  <div className={styles.cardIcon}>🚀</div>
                  <h3>Career Growth</h3>
                  <p>Accelerate your professional development</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.processSection}>
          <div className={styles.container}>
            <h2 className={styles.centerTitle}>How SkillSwap Works</h2>
            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <h3>Create Profile</h3>
                <p>
                  Showcase your skills and define what you want to learn. Our
                  detailed profiles help find perfect matches.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <h3>Smart Matching</h3>
                <p>
                  Our AI-powered algorithm connects you with professionals who
                  complement your skill set perfectly.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <h3>Start Learning</h3>
                <p>
                  Engage in skill exchanges, mentorship sessions, and
                  collaborative projects with your matches.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <h3>Grow Together</h3>
                <p>
                  Build lasting professional relationships while continuously
                  developing new expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className={styles.featuresSection}>
          <div className={styles.container}>
            <h2 className={styles.centerTitle}>
              Why Professionals Choose SkillSwap
            </h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Precision Matching</h3>
                <p>
                  Advanced algorithms ensure you connect with the right people
                  for meaningful skill exchanges.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💡</div>
                <h3>Real-World Learning</h3>
                <p>
                  Learn from practitioners who use these skills daily in their
                  professional environments.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤝</div>
                <h3>Mutual Benefits</h3>
                <p>
                  Every interaction provides value to both parties, creating
                  win-win learning relationships.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📈</div>
                <h3>Career Impact</h3>
                <p>
                  Gain skills that directly translate to career advancement and
                  professional opportunities.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🌐</div>
                <h3>Global Reach</h3>
                <p>
                  Access expertise from professionals worldwide, breaking
                  geographical learning barriers.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚡</div>
                <h3>Flexible Learning</h3>
                <p>
                  Learn at your own pace with scheduling that fits your
                  professional and personal life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <div className={styles.container}>
            <h2 className={styles.centerTitle}>Meet the Developer</h2>
            <div className={styles.founderCard}>
              <div className={styles.founderInfo}>
                <h3>SkillSwap Developer</h3>
                <p className={styles.founderTitle}>Full Stack Developer</p>
                <p>
                  Passionate about democratizing professional development, our
                  developer created SkillSwap to solve the global challenge of
                  skill gaps and professional isolation. With a vision of
                  connecting talented individuals worldwide, building the future
                  of collaborative learning.
                </p>
                <div className={styles.founderQuote}>
                  "Every professional has something valuable to teach and
                  something important to learn. SkillSwap makes these
                  connections possible."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2>Ready to Transform Your Career?</h2>
              <p>
                Join thousands of professionals who are already growing their
                skills and expanding their networks through SkillSwap.
              </p>
              <div className={styles.ctaButtons}>
                <a href="/signup" className={styles.primaryBtn}>
                  Get Started Free
                </a>
                <a href="/signin" className={styles.secondaryBtn}>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
