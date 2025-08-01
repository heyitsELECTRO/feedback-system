const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Form = require("../models/Form");


router.post("/", async (req, res) => {
  try {
    const { fields, comments, username } = req.body;

const activeForm = await Form.findOne({ active: true });
if (!activeForm) return res.status(400).json({ error: "No active form available" });

const feedback = new Feedback({
  username,
  comments,
  fields, 
  formId: activeForm._id,
  formName: activeForm.title,
  formVersion: activeForm.version
});

    const saved = await feedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.username = req.query.user;
    if (req.query.formId) filter.formId = req.query.formId;
    const feedbacks = await Feedback.find(filter).sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/by-form/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    
    
    const formExists = await Form.exists({ _id: formId });
    if (!formExists) {
      return res.status(404).json({ error: "Form not found" });
    }

    
    const feedbacks = await Feedback.find({ formId })
      .sort({ submittedAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Feedback fetch error:", err);
    res.status(500).json({ 
      error: "Failed to fetch feedback",
      details: err.message 
    });
  }
});
module.exports = router;
