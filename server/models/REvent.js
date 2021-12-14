const mongoose = require("mongoose");
const Joi = require("joi");

const REvent = mongoose.model(
  "REvent",
  new mongoose.Schema(
    {
      rEventDates: [],
      eventId: {
        type: String,
        required: true,
      },
      event: {
        type: mongoose.Types.ObjectId,
        ref: "Event",
      },
    },
    { timestamps: true }
  )
);

const RECURRENCE_TYPE = ["Day", "Week", "Month", "Year"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DATES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

const schemasREvent = Joi.object({
  numOfRecurrence: Joi.string().min(1).max(100).required(),
  recurrenceType: Joi.string().valid(...RECURRENCE_TYPE),
  timeInputs: Joi.array().items(
    Joi.object().keys({
      startTime: Joi.date().required(),
      endTime: Joi.date().required(),
    })
  ),
  selectedDays: Joi.array().items(
    Joi.object().keys({
      day: Joi.string().valid(...DAYS),
      isSelected: Joi.boolean().required(),
    })
  ),
  selectedDatesForMonth: Joi.array().items(
    Joi.object().keys({
      date: Joi.string().valid(...DATES),
      isSelected: Joi.boolean().required(),
    })
  ),
  selectedMonths: Joi.array().items(
    Joi.object().keys({
      month: Joi.string().valid(...MONTHS),
      isSelected: Joi.boolean().required(),
    })
  ),
  selectedDatesForYear: Joi.array().items(
    Joi.object().keys({
      date: Joi.string().valid(...DATES),
      isSelected: Joi.boolean().required(),
    })
  ),
});
module.exports = { REvent, schemasREvent };
