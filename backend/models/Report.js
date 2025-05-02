const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["sales", "performance"] },
  date: { type: Date, default: Date.now },
  data: { type: Object, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Report", ReportSchema);
