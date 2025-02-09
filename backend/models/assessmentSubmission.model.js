import mongoose from "mongoose";

const responseSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "AssessmentQuestion",
    required: true,
  },

  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const assessmentSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    responses: {
      type: [responseSchema],
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const AssessmentSubmission = mongoose.model("AssessmentSubmission", assessmentSubmissionSchema);