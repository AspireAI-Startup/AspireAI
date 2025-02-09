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
      enum: ["class 10", "class 12"],
      required: true,
    },

    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Common"],
      required: true,
    },

    interest : {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Common", "Any"],
      required: true,
    },

    // type: {
    //   type: String,
    //   enum: ["objective", "subjective"],
    //   required: true,
    // },

    objectiveAnswers: {
      type: [optionSchema],
      required: function () {
        return this.type === "objective";
      },
      default: [],
    },
  },
  { timestamps: true }
);

export const AssessmentQuestion = mongoose.model("AssessmentQuestion", assessmentQuestionSchema);