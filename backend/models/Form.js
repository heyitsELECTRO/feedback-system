const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [{ type: String, required: true }], 
  version: { type: Number, required: true, default: 1 },
  active: { type: Boolean, default: true}
});

module.exports = mongoose.model('Form', FormSchema);
