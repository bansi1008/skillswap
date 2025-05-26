import { useState } from "react";
import styles from "./SkillsTab.module.css";

export default function SkillsTab({
  userData,
  error,
  addSkills,
  removeSkill,
  setError,
}) {
  const [showOfferedForm, setShowOfferedForm] = useState(false);
  const [showWantedForm, setShowWantedForm] = useState(false);
  const [skills, setSkills] = useState({
    skillsOffered: "",
    skillsWanted: "",
  });

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setSkills((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (skillType) => {
    const skillValue = skills[skillType];
    if (skillValue.trim()) {
      addSkills({ [skillType]: skillValue });
      setSkills((prev) => ({ ...prev, [skillType]: "" }));
      if (skillType === "skillsOffered") {
        setShowOfferedForm(false);
      } else {
        setShowWantedForm(false);
      }
    } else {
      setError("Skill name cannot be empty");
    }
  };

  const handleCancelForm = (skillType) => {
    setSkills((prev) => ({ ...prev, [skillType]: "" }));
    if (skillType === "skillsOffered") {
      setShowOfferedForm(false);
    } else {
      setShowWantedForm(false);
    }
  };

  return (
    <div className={styles.skillsContent}>
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.skillsGrid}>
        {/* Skills Offered */}
        <div className={styles.skillsCard}>
          <h2 className={styles.cardTitle}>Skills I Offer</h2>
          <div className={styles.skillsList}>
            {userData.skillsOffered?.length > 0 ? (
              userData.skillsOffered.map((skill, index) => (
                <div key={index} className={styles.skillTagContainer}>
                  <span className={styles.skillTag}>{skill}</span>
                  <button
                    className={styles.removeSkillButton}
                    onClick={() => removeSkill(skill, "skillsOffered")}
                    title="Remove this skill"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>
                No skills offered yet. Add some skills to start helping others!
              </p>
            )}
          </div>
          <button
            className={styles.addSkillButton}
            onClick={() => setShowOfferedForm(true)}
          >
            + Add Skills
          </button>
          {showOfferedForm && (
            <div className={styles.skillForm}>
              <h3>Add a New Skill to Offer</h3>
              <input
                type="text"
                placeholder="Enter skill name"
                className={styles.skillInput}
                name="skillsOffered"
                value={skills.skillsOffered}
                onChange={handleSkillsChange}
              />
              <div className={styles.formButtons}>
                <button
                  className={styles.submitSkillButton}
                  onClick={() => handleAddSkill("skillsOffered")}
                >
                  Submit
                </button>
                <button
                  className={styles.cancelSkillButton}
                  onClick={() => handleCancelForm("skillsOffered")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Wanted */}
        <div className={styles.skillsCard}>
          <h2 className={styles.cardTitle}>Skills I Want to Learn</h2>
          <div className={styles.skillsList}>
            {userData.skillsWanted?.length > 0 ? (
              userData.skillsWanted.map((skill, index) => (
                <div key={index} className={styles.skillTagContainer}>
                  <span className={styles.skillTag}>{skill}</span>
                  <button
                    className={styles.removeSkillButton}
                    onClick={() => removeSkill(skill, "skillsWanted")}
                    title="Remove this skill"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>
                No skills requested yet. Add skills you'd like to learn!
              </p>
            )}
          </div>
          <button
            className={styles.addSkillButton}
            onClick={() => setShowWantedForm(true)}
          >
            + Add Skills
          </button>
          {showWantedForm && (
            <div className={styles.skillForm}>
              <h3>Add a New Skill to Learn</h3>
              <input
                type="text"
                placeholder="Enter skill name"
                className={styles.skillInput}
                name="skillsWanted"
                value={skills.skillsWanted}
                onChange={handleSkillsChange}
              />
              <div className={styles.formButtons}>
                <button
                  className={styles.submitSkillButton}
                  onClick={() => handleAddSkill("skillsWanted")}
                >
                  Submit
                </button>
                <button
                  className={styles.cancelSkillButton}
                  onClick={() => handleCancelForm("skillsWanted")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
