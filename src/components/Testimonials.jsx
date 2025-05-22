"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Testimonials.module.css";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Graphic Designer",
    avatar: "/av2.jpg",
    content:
      "SkillSwap connected me with a web developer who taught me coding basics while I helped him with design principles. It's been an incredible exchange of knowledge!",
    skillsOffered: ["Graphic Design", "UI/UX"],
    skillsLearned: ["HTML", "CSS", "JavaScript Basics"],
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "/av1.jpg",
    content:
      "I've been teaching programming while learning photography. The platform made it easy to find someone with complementary skills. Now I can code AND take great photos!",
    skillsOffered: ["Python", "Data Science"],
    skillsLearned: ["Photography", "Photo Editing"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Language Teacher",
    avatar: "/av3.jpg",
    content:
      "As a Spanish teacher looking to learn piano, SkillSwap matched me perfectly! I've improved my musical abilities while helping someone become fluent in Spanish.",
    skillsOffered: ["Spanish", "Teaching Methods"],
    skillsLearned: ["Piano", "Music Theory"],
  },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRefs = useRef([]);
  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle touch swipe for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    // Minimum swipe distance
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX.current - touchStartX.current;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous
        setActiveTestimonial((prev) =>
          prev === 0 ? testimonials.length - 1 : prev - 1
        );
      } else {
        // Swipe left - go to next
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate testimonial change
    gsap.fromTo(
      testimonialRefs.current[activeTestimonial],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    );
  }, [activeTestimonial]);

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Success <span className={styles.highlight}>Stories</span>
          </h2>
          <p className={styles.subtitle}>
            Hear from our community members who have transformed their skills
            through SkillSwap.
          </p>
        </div>

        <div
          className={styles.testimonialWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`${styles.testimonialCard} ${
                index === activeTestimonial ? styles.active : ""
              }`}
              ref={(el) => (testimonialRefs.current[index] = el)}
              style={{ display: index === activeTestimonial ? "flex" : "none" }}
            >
              <div className={styles.testimonialContent}>
                <div className={styles.quote}>"</div>
                <p className={styles.testimonialText}>{testimonial.content}</p>

                <div className={styles.skillsExchange}>
                  <div className={styles.skillsColumn}>
                    <h4 className={styles.skillsTitle}>Skills Offered</h4>
                    <ul className={styles.skillsList}>
                      {testimonial.skillsOffered.map((skill, i) => (
                        <li key={i} className={styles.skill}>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.exchangeIcon}>↔️</div>
                  <div className={styles.skillsColumn}>
                    <h4 className={styles.skillsTitle}>Skills Learned</h4>
                    <ul className={styles.skillsList}>
                      {testimonial.skillsLearned.map((skill, i) => (
                        <li key={i} className={styles.skill}>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialFooter}>
                <div className={styles.userInfo}>
                  <div className={styles.avatarPlaceholder}>
                    <Image
                      src={`${testimonial.avatar}`}
                      width={43}
                      height={43}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.userDetails}>
                    <h4 className={styles.userName}>{testimonial.name}</h4>
                    <p className={styles.userRole}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.testimonialDots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === activeTestimonial ? styles.activeDot : ""
              }`}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
