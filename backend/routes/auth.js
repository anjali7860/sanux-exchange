import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fetch from "node-fetch"; 
import User from "../User.js";
const router = express.Router();

function sha256(text) {
  return crypto.createHash("sha256").update(String(text)).digest("hex");
}

async function sendSmsFast2Sms(mobile, message) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const url = "https://www.fast2sms.com/dev/bulkV2";
  const payload = {
    route: "v3",
    sender_id: "FSTSMS",
    message: message,
    language: "english",
    flash: 0,
    numbers: mobile
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "authorization": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

router.post("/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    const phone = String(identifier);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hashed = sha256(code);

    let user = await User.findOne({ phone });
    if (!user) user = new User({ full_name: phone, phone });

    user.phone_otp = {
      code_hash: hashed,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0
    };

    await user.save();

    const smsText = `Your SANUX OTP is ${code}. It expires in 5 minutes.`;
    await sendSmsFast2Sms(phone, smsText);

    res.json({ ok: true, message: "OTP sent" });
  } catch (e) {
    res.status(500).json({ error: "OTP error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = await User.findOne({ phone: identifier });

    if (!user.phone_otp) return res.status(400).json({ error: "No OTP" });

    if (new Date(user.phone_otp.expires_at) < new Date())
      return res.status(400).json({ error: "OTP expired" });

    if (sha256(otp) !== user.phone_otp.code_hash)
      return res.status(400).json({ error: "Invalid OTP" });

    user.is_phone_verified = true;
    user.phone_otp = undefined;
    await user.save();

    res.json({ ok: true, message: "Phone verified" });
  } catch (e) {
    res.status(500).json({ error: "Verify error" });
  }
});

export default router;
