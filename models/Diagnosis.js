const mongoose = require("mongoose");

const DiagnosisSchema = new mongoose.Schema(
  {
    diagnosisId: {
      type: String,
      required: true,
      immutable: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      immutable: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      immutable: true,
    },
    symptoms: {
      type: String,
      required: true,
      immutable: true,
    },
    report: {
      type: String,
      immutable: true,
    },
    image: {
      type: String,
      immutable: true,
    },
    doctorDiagnosis: {
      type: String,
      required: true,
      immutable: true,
    },
    prescription: {
      type: String,
      immutable: true,
    },
  },
  { timestamps: true }
);

// Prevent document modifications through save operations
DiagnosisSchema.pre("save", function (next) {
  if (!this.isNew) {
    next(
      new Error(
        "Cannot modify existing diagnosis records - documents are immutable"
      )
    );
  }
  next();
});

// Prevent document updates through various update methods
DiagnosisSchema.pre("updateOne", function (next) {
  next(new Error("Cannot update diagnosis records - documents are immutable"));
});

DiagnosisSchema.pre("findOneAndUpdate", function (next) {
  next(new Error("Cannot update diagnosis records - documents are immutable"));
});

DiagnosisSchema.pre("updateMany", function (next) {
  next(new Error("Cannot perform bulk updates - documents are immutable"));
});

// Prevent document deletions through various delete methods
DiagnosisSchema.pre("deleteOne", function (next) {
  next(new Error("Cannot delete diagnosis records - documents are immutable"));
});

DiagnosisSchema.pre("findOneAndDelete", function (next) {
  next(new Error("Cannot delete diagnosis records - documents are immutable"));
});

DiagnosisSchema.pre("deleteMany", function (next) {
  next(new Error("Cannot perform bulk deletions - documents are immutable"));
});

// Add additional protection against remove operations
DiagnosisSchema.pre("remove", function (next) {
  next(new Error("Cannot remove diagnosis records - documents are immutable"));
});

// Prevent document replacements
DiagnosisSchema.pre("replaceOne", function (next) {
  next(new Error("Cannot replace diagnosis records - documents are immutable"));
});

// Static method for safely finding documents
DiagnosisSchema.statics.findDiagnosis = function (query) {
  return this.find(query);
};

const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);

module.exports = Diagnosis;
