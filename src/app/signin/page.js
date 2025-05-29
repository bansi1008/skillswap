"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import { useMutation } from "@tanstack/react-query";
import AuthChecker from "@/components/AuthChecker";

async function loginUser(formData) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {

      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      setErrors({ general: "Invalid email or password. Please try again." });
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate({ ...formData, rememberMe });
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password clicked");
  };

  return (
    <>
      <AuthChecker />
      <div className={styles.signinPage}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <Link href="/" className={styles.backButton}>
                ← Back to Home
              </Link>
              <h1 className={styles.title}>
                Welcome back to{" "}
                <span className={styles.highlight}>SkillSwap</span>
              </h1>
              <p className={styles.subtitle}>
                Sign in to your account and continue your skill-sharing journey
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {errors.general && (
                <div className={styles.errorMessage}>{errors.general}</div>
              )}

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
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <span className={styles.fieldError}>{errors.password}</span>
                )}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxLabel}>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={styles.forgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div> */}

            {/* <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <span className={styles.socialIcon}>🔍</span>
              Continue with Google
            </button>
            <button className={styles.socialButton}>
              <span className={styles.socialIcon}>📘</span>
              Continue with Facebook
            </button>
          </div> */}

            <div className={styles.footer}>
              <p className={styles.signupLink}>
                Don't have an account?{" "}
                <Link href="/signup" className={styles.link}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContent}>
              <h2 className={styles.imageTitle}>Continue Your Journey</h2>
              <p className={styles.imageText}>
                Welcome back! Your skill-sharing community is waiting for you.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>10K+</span>
                  <span className={styles.statLabel}>Active Members</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>5K+</span>
                  <span className={styles.statLabel}>Skills Available</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>15K+</span>
                  <span className={styles.statLabel}>
                    Successful Connections
                  </span>
                </div>
              </div>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  "SkillSwap has completely transformed how I learn and teach.
                  The community is amazing!"
                </p>
                <p className={styles.testimonialAuthor}>
                  - Sarah J., Community Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
