"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./../../components/DashboardLayout.module.css";

// Import all the new components
import DashboardHeader from "../../components/DashboardHeader";
import DashboardStats from "../../components/DashboardStats";
import OverviewTab from "../../components/OverviewTab";
import SkillsTab from "../../components/SkillsTab";
import MatchesTab from "../../components/MatchesTab";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();
        console.log("User data:", data.user);
        setUserData(data.user);
      } catch (err) {
        setError(err.message);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/signin");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  async function addSkills({ skillsOffered, skillsWanted }) {
    try {
      // Get current skills and add new skill to the appropriate array
      const currentOffered = userData?.skillsOffered || [];
      const currentWanted = userData?.skillsWanted || [];

      // Build payload with complete arrays
      const body = {};

      if (skillsOffered) {
        // Add new skill to existing offered skills
        body.skillsOffered = [...currentOffered, skillsOffered.trim()];
      }

      if (skillsWanted) {
        // Add new skill to existing wanted skills
        body.skillsWanted = [...currentWanted, skillsWanted.trim()];
      }

      // Always include current location if it exists
      if (userData?.location) {
        body.location = userData.location;
      }

      if (Object.keys(body).length === 0) {
        throw new Error("No skills provided");
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Failed to add skill: ${res.status} - ${errorData}`);
      }

      const data = await res.json();
      console.log("Skills updated:", data);

      // Update userData with new skills
      setUserData((prev) => ({
        ...prev,
        skillsOffered: body.skillsOffered || prev?.skillsOffered || [],
        skillsWanted: body.skillsWanted || prev?.skillsWanted || [],
      }));

      setError(null);
    } catch (err) {
      console.error("Error adding skill:", err);
      setError(err.message);
    }
  }

  async function removeSkill(skillToRemove, skillType) {
    try {
      const res = await fetch("/api/profile/remove-skill", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          skillToRemove,
          skillType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to remove skill: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("Skill removed:", data);

      // Update userData by removing the skill from the appropriate array
      setUserData((prev) => ({
        ...prev,
        [skillType]: prev[skillType].filter((skill) => skill !== skillToRemove),
      }));

      setError(null);
    } catch (err) {
      console.error("Error removing skill:", err);
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <Link href="/signin" className={styles.errorButton}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h2>No data available</h2>
          <p>We couldn't find your profile information.</p>
          <Link href="/signin" className={styles.errorButton}>
            Sign In Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header Component */}
      <DashboardHeader
        userData={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Welcome Section */}
          <section className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Welcome back,{" "}
              <span className={styles.highlight}>{userData.name}</span>!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Here's what's happening in your skill-sharing journey
            </p>
          </section>

          {/* Stats Component */}
          <DashboardStats userData={userData} />

          {/* Tab Content */}
          <section className={styles.contentSection}>
            {activeTab === "overview" && <OverviewTab userData={userData} />}

            {activeTab === "skills" && (
              <SkillsTab
                userData={userData}
                error={error}
                addSkills={addSkills}
                removeSkill={removeSkill}
                setError={setError}
              />
            )}

            {activeTab === "matches" && (
              <MatchesTab setActiveTab={setActiveTab} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
