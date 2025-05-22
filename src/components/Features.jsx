"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Features.module.css";

const Features = () => {
  const featuresRef = useRef(null);
  const featureRefs = useRef([]);

  useEffect(() => {
    // Dynamically import ScrollTrigger to prevent SSR issues
    const initAnimations = async () => {
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      if (featuresRef.current) {
        const elements = featureRefs.current;

        elements.forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              delay: index * 0.2,
            }
          );
        });
      }
    };

    initAnimations();

    return () => {
      // Cleanup will be handled when component unmounts
    };
  }, []);

  const features = [
    {
      title: "Intelligent Matching",
      description:
        "Our advanced algorithm matches users based on complementary skills, ensuring meaningful connections.",
      icon: "🔄",
    },
    {
      title: "Skill Verification",
      description:
        "Build trust with verified skills through peer reviews and endorsements.",
      icon: "✅",
    },
    {
      title: "Secure Messaging",
      description:
        "Connect directly with potential skill swappers through our secure messaging platform.",
      icon: "💬",
    },
    {
      title: "Progress Tracking",
      description:
        "Track your learning journey and skill development over time.",
      icon: "📈",
    },
    {
      title: "Community Events",
      description:
        "Join virtual and local skill-sharing events to enhance your learning experience.",
      icon: "👥",
    },
    {
      title: "Personalized Recommendations",
      description:
        "Discover new skills to learn based on your interests and current skillset.",
      icon: "🎯",
    },
  ];

  return (
    <section className={styles.features} ref={featuresRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Why Choose <span className={styles.highlight}>SkillSwap</span>?
          </h2>
          <p className={styles.subtitle}>
            Our platform offers unique features designed to make skill sharing
            effective and enjoyable.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={styles.featureCard}
              ref={(el) => (featureRefs.current[index] = el)}
            >
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
