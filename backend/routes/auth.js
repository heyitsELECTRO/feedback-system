const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Hardcoded admin bypass
    if (username === "administrator" && password === "admin") {
      return res.json({ 
        username: "administrator", 
        role: "admin" 
      });
    }


    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      username: user.username,
      role: user.role || "user"
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "administrator") {
      return res.status(403).json({ error: "Admin account is protected" });
    }

  
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: "Username already exists" });
    }


    const user = new User({
      username,
      password: await bcrypt.hash(password, 10),
      role: "user"
    });

    await user.save();
    res.status(201).json({ username, role: "user" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

module.exports = router;