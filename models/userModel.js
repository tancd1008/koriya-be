import { createHmac } from "crypto";
import mongoose from "mongoose";

const secretKey = process.env.SECRETKEY;

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
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    roles: {
      type: [String],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt:{
      type: Date,
      default: Date.now(),
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamps: true }
);
userSchema.pre("save", function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hmac = createHmac("sha256", secretKey);

    this.password = hmac.update(this.password).digest("hex");
    next();
  } catch (error) {
    next(error);
  }
});
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
