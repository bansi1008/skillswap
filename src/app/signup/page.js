"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import { useMutation } from "@tanstack/react-query";

async function signupUser(formData) {
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      router.push("/signin");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      const message = error.message || "An error occurred. Please try again.";
      setErrors({ general: message });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <Link href="/" className={styles.backButton}>
              ← Back to Home
            </Link>
            <h1 className={styles.title}>
              Join <span className={styles.highlight}>SkillSwap</span>
            </h1>
            <p className={styles.subtitle}>
              Create your account and start connecting with others to share and
              learn new skills
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {errors.general && (
              <div className={styles.errorMessage}>{errors.general}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <span className={styles.fieldError}>{errors.name}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <span className={styles.fieldError}>{errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                placeholder="Create a strong password"
                required
              />
              {errors.password && (
                <span className={styles.fieldError}>{errors.password}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.inputError : ""
                }`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <span className={styles.fieldError}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.loginLink}>
              Already have an account?{" "}
              <Link href="/signin" className={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageContent}>
            <h2 className={styles.imageTitle}>Start Your Skill Journey</h2>
            <p className={styles.imageText}>
              Join thousands of learners and teachers who are already sharing
              their knowledge and growing together.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔄</span>
                <span>Smart Skill Matching</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>👥</span>
                <span>Community Learning</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📈</span>
                <span>Track Your Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
