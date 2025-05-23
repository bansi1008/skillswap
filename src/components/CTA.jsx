"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import styles from "./CTA.module.css";

const CTA = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Dynamically import ScrollTrigger to prevent SSR issues
    const initAnimations = async () => {
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current) {
        // Parallax effect for background
        gsap.to(sectionRef.current, {
          backgroundPosition: "50% 30%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Animate content when in view
        gsap.fromTo(
          textRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          buttonRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    };

    initAnimations();

    return () => {
      // Cleanup will be handled when component unmounts
    };
  }, []);

  return (
    <section className={styles.cta} ref={sectionRef}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.content} ref={textRef}>
          <h2 className={styles.title}>
            Ready to Start Your Skill-Swapping Journey?
          </h2>
          <p className={styles.description}>
            thousands of users already connecting, learning, and sharing skills
            on our platform. Sign up today and unlock your potential!
          </p>
        </div>
        <div className={styles.buttonContainer} ref={buttonRef}>
          <Link href="/signup" className={styles.button}>
            Get Started Now
          </Link>
          <Link href="/how-it-works" className={styles.secondaryLink}>
            Learn How It Works →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
