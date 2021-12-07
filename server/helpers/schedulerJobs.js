const { REvent } = require("../models/REvent");

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
  let date = new Date(d);
  if (
    date.getHours() === new Date().getHours() &&
    date.getMinutes() === new Date().getMinutes()
  ) {
    return true;
  }

  return false;
};

const updateREventStatus = async () => {
  REvent.find().then((result) => {
    result.map((item1) => {
      let currentObject = item1.rEventDates;
      currentObject.map((item2) => {
        item2.REventTimes.map((item3) => {
          if (isEqualToCurrentDate(item2.startDate)) {
            // console.log("Date Matched");
            if (isEqualToCurrentTime(item3.startTime)) {
              console.log("Time Matched");

              //    DO SOMETHING...

              //    REvent.findOneAndUpdate(
              //      { _id: id },
              //      { rEventDates: rEventData }
              //    ).then((result) => {
              //      // console.log(result);
              //    });
            }
          }
        });
      });
    });
  });
};

module.exports = {
  updateREventStatus,
};
