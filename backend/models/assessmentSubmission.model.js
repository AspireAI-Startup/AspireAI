import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssessmentQuestion",
    required: true,
  },

  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const assessmentSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    responses: {
      type: [responseSchema],
      required: true,
    },

  },
  { timestamps: true }
);

export const AssessmentSubmission = mongoose.model("AssessmentSubmission", assessmentSubmissionSchema);