import mongoose from "mongoose";
import bcrypt from "bcrypt";


const saltRounds = 10;


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profile_img: {
    data: Buffer,
    contentType: String,
  },

  unit_pref: {
    type: String,
    default: "metric",
  },

  liked_recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const User = mongoose.model("Users", userSchema, "Users");

export default User;
