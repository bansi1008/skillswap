const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: function () {
        return this.isNew || this.isModified("password");
      },
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "Passwords do not match",
      },
    },

    location: {
      type: String,
    },
    skillsOffered: {
      type: [String],
    },

    skillsWanted: {
      type: [String],
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectionRequestsSent: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    connectionRequestsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bycrypt.hash(this.password, 10);
    this.password = hashedPassword;

    this.confirmPassword = undefined;
  } catch (error) {
    console.error("Error hashing password:", error);
  }

  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
