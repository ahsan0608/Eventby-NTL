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

const isGreaterThanOrEqualToEventStartDate = (eventStartDate) => {
  let date1 = new Date();
  date1.setHours(0, 0, 0, 0);

  let date2 = new Date(eventStartDate.getTime());
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() >= date2.getTime()) {
    return true;
  }
  return false;
};

const isLessThanToEventEndTime = (eventEndTime) => {
  if (new Date().getHours() <= new Date(eventEndTime).getUTCHours()) {
    if (new Date().getMinutes() < new Date(eventEndTime).getMinutes()) {
      return true;
    }
  }
  return false;
};

const updateEventStatusByEventId = (
  currentEventId,
  currentStatus,
  updatedStatus
) => {
  models.Event.updateOne(
    {
      $and: [{ id: currentEventId }, { event_status: currentStatus }],
    },
    {
      $set: {
        event_status: updatedStatus,
      },
    }
  ).then((eventObj) => {
    console.log(updatedStatus);
  });
};

const checkEventIsRunning = (dateObj, timeObj, currentEventId) => {
  if (
    isEqualToCurrentDate(dateObj.startDate) &&
    isEqualToCurrentTime(timeObj.startTime)
  ) {
    updateEventStatusByEventId(
      currentEventId,
      "EVENT_CREATED",
      "EVENT_RUNNING"
    );
    return true;
  }
};

const checkEventIsEnd = (dateObj, timeObj, currentEventId) => {
  if (
    isEqualToCurrentDate(dateObj.endDate) &&
    isEqualToCurrentTime(timeObj.endTime)
  ) {
    updateEventStatusByEventId(currentEventId, "EVENT_RUNNING", "EVENT_END");
    return true;
  }
};

const checkEventIsPause = (
  eventStartDate,
  eventEndTime,
  dateObj,
  timeObj,
  currentEventId
) => {
  if (
    isGreaterThanOrEqualToEventStartDate(eventStartDate) &&
    !isEqualToCurrentDate(dateObj.startDate) &&
    isLessThanToEventEndTime(eventEndTime) &&
    !isEqualToCurrentTime(timeObj.startTime)
  ) {
    updateEventStatusByEventId(currentEventId, "EVENT_RUNNING", "EVENT_PAUSE");
    return true;
  }
};

const updateREventStatus = async () => {
  REvent.find()
    .then((result) => {
      if (result[0]) {
        const currentEventId = mongoose.Types.ObjectId(result[0].eventId);
        const rDates = result[0].rEventDates;
        const eventStartDate = rDates[0].startDate;
        const eventEndTime = rDates[0].REventTimes[0].endTime;

        rDates.map((dateObj) => {
          dateObj.REventTimes.map((timeObj) => {
            checkEventIsRunning(dateObj, timeObj, currentEventId);

            checkEventIsPause(
              eventStartDate,
              eventEndTime,
              dateObj,
              timeObj,
              currentEventId
            );

            checkEventIsEnd(dateObj, timeObj, currentEventId);
          });
        });
      }
    })
    .catch((err) => console.log(err));
};

module.exports = {
  updateREventStatus,
  isGreaterToCurrentDate,
};

/* 

RECURRING EVENT LOGIC FOR EVENT STATUS

startDate: 2021-11-08,
endDate: 2021-12-08,


Recurring Date & Time:

1.
startDate
startTime
endTime


2.
startDate
startTime
endTime


3.
startDate
startTime
endTime


Event Status:

EVENT_CREATED
when event is created 

EVENT_RUNNING
when event startDate and startTime matched (only for that day)

EVENT_PAUSE
when event is 
GREATER THAN [startDate and startTime] AND
BETWEEN NOT EQUAL [startDate and startTime] AND LESS THAN next event [startDate and startTime] 

EVENT_END
when match with event endDate and endTime


*/
