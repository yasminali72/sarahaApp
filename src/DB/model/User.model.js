import mongoose, { Schema, model } from "mongoose";
import { userRoles } from "../../middleware/auth.middleware.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minLength: 2,
      maxLength: 25,
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     if (v == "admin") {
      //       return false;
      //     } else if (v == "user") {
      //       throw new Error("userName can not be user");
      //     }
      //     return true;
      //   },
      //   message: "userName can not be admin",
      // },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email exist"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    phone: String,
    DOB: Date,
    address: String,
    image: String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default:userRoles.user,
      enum: Object.values(userRoles),
    },
    changePasswordTime:Date,
    isDeleted:{
      type:Boolean,
      default:false
    },reActiveProfileOTP:String,
    verifyCode:String,
    resetPassword:{
      type:Boolean
      ,default:false
    }
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
