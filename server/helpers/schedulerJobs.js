const mongoose = require("mongoose");
const { REvent } = require("../models/REvent");
const models = require("../models");
const isEqualToCurrentDate = (d) => {
  let date1 = new Date(d.getTime());
  date1.setHours(0, 0, 0, 0);

  let date2 = new Date();
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() === date2.getTime()) {
    return true;
  }
  return false;
};

const isEqualToCurrentTime = (d) => {
  if (
    new Date(d).getUTCHours() === new Date().getHours() &&
    new Date(d).getMinutes() === new Date().getMinutes()
  ) {
    return true;
  }

  return false;
};

const isGreaterToCurrentDate = (d) => {
  let date1 = new Date(d.getTime());
  date1.setHours(0, 0, 0, 0);

  let date2 = new Date();
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() > date2.getTime()) {
    return true;
  }
  return false;
};

const updateREventStatus = async () => {
  REvent.find().then((result) => {
    result.map((item1) => {
      let currentObject = item1.rEventDates;
      let currentEventId = mongoose.Types.ObjectId(item1.eventId);
      currentObject.map((item2) => {
        item2.REventTimes.map((item3) => {
          //check start date
          if (isEqualToCurrentDate(item2.startDate)) {
            // console.log("Date Matched");
            if (isEqualToCurrentTime(item3.startTime)) {
              console.log("Time Matched", "  =  " + currentEventId);

              //    DO SOMETHING...

              models.Event.updateOne(
                {
                  $and: [
                    { id: currentEventId },
                    { event_status: "EVENT_CREATED" },
                  ],
                },
                {
                  $set: {
                    event_status: "EVENT_RUNNING",
                  },
                }
              ).then((eventObj) => {
                console.log(eventObj);
              });
            }
          }

          // check end date
          if (isEqualToCurrentDate(item2.endDate)) {
            // console.log("Date Matched");
            if (isEqualToCurrentTime(item3.endTime)) {
              console.log("Time Matched", "  =  " + currentEventId);

              //    DO SOMETHING...

              models.Event.updateOne(
                {
                  $and: [
                    { id: currentEventId },
                    { event_status: "EVENT_RUNNING" },
                  ],
                },
                {
                  $set: {
                    event_status: "EVENT_END",
                  },
                }
              ).then((eventObj) => {
                console.log(eventObj);
              });
            }
          }
        });
      });
    });
  });
};

module.exports = {
  updateREventStatus,
  isGreaterToCurrentDate,
};
