import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },

    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },

    password: { type: String },

    // Email verification
    is_email_verified: { type: Boolean, default: false },
    email_verification_token: {
      token: String,
      expires_at: Date,
    },

    // Phone OTP verification
    is_phone_verified: { type: Boolean, default: false },
    phone_otp: {
      code_hash: String,
      expires_at: Date,
      attempts: { type: Number, default: 0 },
    },

    // KYC system
    kyc_status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    kyc_level: { type: Number, default: 0 }, // 0–3
    kyc_documents: [
      {
        type: String,
        url: String,
        uploaded_at: Date,
      },
    ],

    // 2FA
    two_fa_enabled: { type: Boolean, default: false },
    two_fa_secret: { type: String, default: null },

    // Login security
    failed_login_attempts: { type: Number, default: 0 },
    locked_until: { type: Date, default: null },

    created_at: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

export default mongoose.model("User", UserSchema);
