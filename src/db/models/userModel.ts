import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  profile_image: string;
  favorites?: string[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    profile_image: {
      type: String,
      default: "/images/profiles/default.jpg",
      required: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }
  // Generate a salt
  const salt = await bcrypt.genSalt(process.env.NODE_ENV === "test" ? 1 : 10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password verify method
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
