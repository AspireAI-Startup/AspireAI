import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },

    academicLevel: {
      type: String,
      enum: ["Class 10th", "Class 12th"],
      required: true,
    },

    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Common"],
      required: true,
    },

    interest: {
      type: String,
      enum: ["Mathematics", "Commerce", "Arts", "Common", "Any"],
      required: true,
    },

    objectiveAnswers: {
      type: [optionSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one objective answer is required.",
      },
      default: [],
    },
  },
  { timestamps: true }
);

export const AssessmentQuestion = mongoose.model("AssessmentQuestion", assessmentQuestionSchema);