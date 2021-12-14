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
  if (new Date(d).getUTCHours() === new Date().getHours()) {
    if (new Date(d).getMinutes() === new Date().getMinutes()) {
      return true;
    }
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

const isGreaterThanEqualToEventStartTime = (eventStartTime) => {
  let eventStartHour = new Date(eventStartTime).getUTCHours();
  let eventStartMinute = new Date(eventStartTime).getMinutes();
  let eventStartSecond = 0;

  let eventEndHour = new Date().getHours();
  let eventEndMinute = new Date().getMinutes();
  let eventEndSecond = 0;

  let eventStartTimeObject = new Date();
  eventStartTimeObject.setHours(
    eventStartHour,
    eventStartMinute,
    eventStartSecond
  );

  let eventEndTimeObject = new Date(eventStartTimeObject);
  eventEndTimeObject.setHours(eventEndHour, eventEndMinute, eventEndSecond);

  if (eventEndTimeObject >= eventStartTimeObject) {
    return true;
  } else {
    return false;
  }
};

const isLessThanEqualToEventEndTime = (eventEndTime) => {
  let eventEndHour = new Date(eventEndTime).getUTCHours();
  let eventEndMinute = new Date(eventEndTime).getMinutes();
  let eventEndSecond = 0;

  let currentHour = new Date().getHours();
  let currentMinute = new Date().getMinutes();
  let currentSecond = 0;

  let eventEndTimeObject = new Date();
  eventEndTimeObject.setHours(eventEndHour, eventEndMinute, eventEndSecond);

  let currentTimeObject = new Date(eventEndTimeObject);
  currentTimeObject.setHours(currentHour, currentMinute, currentSecond);

  if (currentTimeObject <= eventEndTimeObject) {
    return true;
  } else {
    return false;
  }
};

const isGreaterThanOrEqualToEventStartDateTime = (
  eventStartDate,
  eventStartTime
) => {
  let date1 = new Date();
  date1.setHours(0, 0, 0, 0);

  let date2 = new Date(eventStartDate.getTime());
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() >= date2.getTime()) {
    // console.log("is greater than or equal to event start date");
    if (isGreaterThanEqualToEventStartTime(eventStartTime)) {
      // console.log("is greater than or equal to event start date and time");
      return true;
    }
  }
  return false;
};

const isLessThanOrEqualToEventEndDateTime = (eventEndDate, eventEndTime) => {
  let date1 = new Date();
  date1.setHours(0, 0, 0, 0);

  let date2 = new Date(eventEndDate.getTime());
  date2.setHours(0, 0, 0, 0);

  if (date1.getTime() < date2.getTime()) {
    // console.log("is Less Than Equal To Event End Date");
    return true;
  }

  if (date1.getTime() === date2.getTime()) {
    console.log("Equal To Event End Date");
    if (isLessThanEqualToEventEndTime(eventEndTime)) {
      console.log("is Less Than Equal To Event End Time");
      return true;
    }
  }
  return false;
};

const isEqualToEventTime = (timeObj) => {
  let currentHour = new Date().getHours();
  let currentMinute = new Date().getMinutes();
  let currentSecond = 0;

  let currentTimeObject = new Date();
  currentTimeObject.setHours(currentHour, currentMinute, currentSecond);
  let eventStartHour = new Date(timeObj.startTime).getUTCHours();
  let eventStartMinute = new Date(timeObj.startTime).getMinutes();
  let eventStartSecond = 0;

  let eventStartTimeObject = new Date();
  eventStartTimeObject.setHours(
    eventStartHour,
    eventStartMinute,
    eventStartSecond
  );

  let eventEndHour = new Date(timeObj.endTime).getUTCHours();
  let eventEndMinute = new Date(timeObj.endTime).getMinutes();
  let eventEndSecond = 0;

  let eventEndTimeObject = new Date();
  eventEndTimeObject.setHours(eventEndHour, eventEndMinute, eventEndSecond);

  if (
    currentTimeObject >= eventStartTimeObject &&
    currentTimeObject <= eventEndTimeObject
  ) {
    // console.log("DONE");
    return true;
  } else {
    // console.log("NOT DONE");
    return false;
  }
};

const isCurrentTimeEqualToEventTimes = (REventTimes) => {
  if (
    REventTimes.filter(function (e) {
      return isEqualToEventTime(e);
    }).length > 0
  ) {
    return true;
  }
  return false;
};

const updateEventStatusByEventId = (currentEventId, updatedStatus) => {
  models.Event.updateOne(
    {
      $and: [{ id: currentEventId }],
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
  if (isEqualToCurrentDate(dateObj.startDate)) {
    if (isEqualToCurrentTime(timeObj.startTime)) {
      updateEventStatusByEventId(currentEventId, "EVENT_RUNNING");
      return true;
    }
  }
};

const checkEventIsEnd = (dateObj, REventTimes, currentEventId) => {
  if (isEqualToCurrentDate(dateObj.endDate)) {
    if (isEqualToCurrentTime(REventTimes[REventTimes.length - 1].endTime)) {
      updateEventStatusByEventId(currentEventId, "EVENT_END");
      return true;
    }
  }
};

const isCurrentDateEqualToEventDates = (rDates) => {
  if (
    rDates.filter(function (e) {
      return isEqualToCurrentDate(e.startDate);
    }).length > 0
  ) {
    // console.log("Current date match with event start date");
    return true;
  }
  return false;
};

const isCurrentDateTimeInEventDateTimeRange = (rDates) => {
  const eventStartDate = rDates[0].startDate;
  const eventStartTime = rDates[0].REventTimes[0].startTime;
  const eventEndDate = rDates[0].endDate;
  const lastIndex = rDates[0].REventTimes.length;
  const eventEndTime = rDates[0].REventTimes[lastIndex - 1].endTime;
  // console.log(JSON.stringify(rDates, null, 2));

  if (
    isGreaterThanOrEqualToEventStartDateTime(eventStartDate, eventStartTime) &&
    isLessThanOrEqualToEventEndDateTime(eventEndDate, eventEndTime)
  ) {
    console.log("IN EVENT RANGE");
    return true;
  }
  return false;
};

const checkEventIsPause = (rDates, currentEventId) => {
  // check current (date and time) in between events (date and time) range
  if (isCurrentDateTimeInEventDateTimeRange(rDates)) {
    // if current date match with event date but not match with event time then PAUSE
    if (isCurrentDateEqualToEventDates(rDates)) {
      if (!isCurrentTimeEqualToEventTimes(rDates[0].REventTimes)) {
        // PAUSE
        // console.log("EVENT IS PAUSE " + currentEventId);
        updateEventStatusByEventId(currentEventId, "EVENT_PAUSE");
      }
    }
    // if current date not match with event date then PAUSE
    else {
      // PAUSE
      // console.log("EVENT IS PAUSE2 " + currentEventId);
      updateEventStatusByEventId(currentEventId, "EVENT_PAUSE");
    }
  }
};

const updateREventStatus = async () => {
  REvent.find()
    .then((result) => {
      result.map((obj) => {
        const currentEventId = mongoose.Types.ObjectId(obj.eventId);
        const rDates = obj.rEventDates;

        checkEventIsPause(rDates, currentEventId);
        rDates.map((dateObj) => {
          dateObj.REventTimes.map((timeObj) => {
            checkEventIsRunning(dateObj, timeObj, currentEventId);

            checkEventIsEnd(dateObj, dateObj.REventTimes, currentEventId);
          });
        });
      });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  updateREventStatus,
  isGreaterToCurrentDate,
};

/**
 * start -> Dec 12 10:30am
 * end -> Dec 20 10:40am
 */

// 13             15            17           19            21
// 11:00-11:50    11:00-11:50   11:00-11:50  11:00-11:50   11:00-11:50
// 12:00-12:50    12:00-12:50   12:00-12:50  12:00-12:50   12:00-12:50

// check current (date and time) in between events (date and time) range
// if current date not match with event date then PAUSE
// if current date not match with event date but not match with event time then PAUSE
