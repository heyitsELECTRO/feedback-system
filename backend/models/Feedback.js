const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  username: String,
  comments: String,
  fields: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form"
  },
  formName: String,
  formVersion: Number,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Feedback", feedbackSchema);



