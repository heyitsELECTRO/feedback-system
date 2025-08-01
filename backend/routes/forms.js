const express = require("express");
const router = express.Router();
const Form = require("../models/Form");


router.get("/", async (req, res) => {
  try {
    if (req.query.active === "true") {
      const activeForm = await Form.findOne({ active: true });
      return res.json(activeForm ? [activeForm] : []);
    }
    const forms = await Form.find().sort({ version: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { title, fields, active } = req.body;
    if (active) await Form.updateMany({}, { active: false });

    const newForm = new Form({
      title,
      fields,
      version: 1,
      active: !!active
    });

    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, fields } = req.body;
    const oldForm = await Form.findById(id);
    
    if (!oldForm) return res.status(404).json({ error: "Form not found" });

    
    await Form.findByIdAndUpdate(id, { active: false });

    const newForm = new Form({
      title: title || oldForm.title,
      fields: fields || oldForm.fields,
      version: oldForm.version + 1,
      active: false 
    });

    await newForm.save();
    res.status(201).json({ message: "New version created", form: newForm });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:id/activate", async (req, res) => {
  try {
    const { id } = req.params; 
    await Form.updateMany({}, { active: false });
    const activated = await Form.findByIdAndUpdate(
      id, 
      { active: true }, 
      { new: true }
    );
    res.json(activated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id/deactivate", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Form.findByIdAndUpdate(
      id, 
      { active: false }, 
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/deactivate-all", async (req, res) => {
  try {
    await Form.updateMany({}, { active: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Form.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;








