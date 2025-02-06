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

    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Common"],
      required: true,
    },

    type: {
      type: String,
      enum: ["objective", "subjective"],
      required: true,
    },

    objectiveAnswers: {
      type: [optionSchema],
      required: function () {
        return this.type === "objective";
      },
      default: [],
    },

    subjectiveAnswer: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "subjective";
      },
    },
  },
  { timestamps: true }
);

export const AssessmentQuestion = mongoose.model("AssessmentQuestion", assessmentQuestionSchema);