"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./Hero.module.css";

const Hero = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Dynamically import ScrollTrigger to prevent SSR issues
    const registerScrollTrigger = async () => {
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animation sequence
      tl.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          subheadingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          imageRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          statsRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
          "-=0.6"
        );

      // Optional scroll animation
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        backgroundPosition: "0 50%",
        ease: "none",
      });
    };

    registerScrollTrigger();

    return () => {
      // Cleanup will be handled by the browser when component unmounts
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={headingRef} className={styles.heading}>
            Connect, Learn & Share{" "}
            <span className={styles.highlight}>Skills</span>
          </h1>
          <p ref={subheadingRef} className={styles.subheading}>
            Join the community where your skills become opportunities and your
            interests become expertise. Find your perfect skill match today!
          </p>
          <div ref={ctaRef} className={styles.ctaButtons}>
            <Link href="/find-skills" className={styles.primaryButton}>
              Find Skills
            </Link>
            <Link href="/offer-skills" className={styles.secondaryButton}>
              Offer Your Skills
            </Link>
          </div>

          <div ref={statsRef} className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5K+</span>
              <span className={styles.statLabel}>Skills Offered</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15K+</span>
              <span className={styles.statLabel}>Successful Matches</span>
            </div>
          </div>
        </div>

        <div ref={imageRef} className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageBackground}></div>
            <div className={styles.imageForeground}>
              <Image
                src="/hero-image.jpg"
                alt="People connecting and sharing skills"
                width={600}
                height={500}
                priority
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll to explore</span>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
};

export default Hero;
