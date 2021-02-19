const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Pls add a course"], trim: true },
  description: {
    type: String,
    required: [true, "Pls add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Pls add number of weeks"],
  },
  tuition: {
    type: String,
    required: [true, "Pls add a tution cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Pls add a min skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

//sec 6 video 42
//Static method to get average of course tuition
CourseSchema.statics.getAverageCourse = async function (bootcampId) {
  console.log(`Calculating the average cost`.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  console.log(obj);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getAverage Cost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCourse(this.bootcamp);
});

// Call getAverage Cost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCourse(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
