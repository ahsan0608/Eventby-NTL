const getDateDifference = (startDate, endDate) => {
  var date1 = new Date(startDate);
  var date2 = new Date(endDate);

  var difference = date1.getTime() - date2.getTime();

  var days = Math.ceil(difference / (1000 * 3600 * 24));
  return Math.abs(days);
};

const getAllDatesByInterval = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate
) => {
  const rEventDates = [{ startDate: new Date(startDate) }];
  for (let i = 0; i <= Math.floor(dateDiff / Number(numOfRecurrence)); i++) {
    let tempDate = new Date(startDate);
    if (new Date(tempDate) <= new Date(endDate)) {
      tempDate.setDate(tempDate.getDate() + Number(numOfRecurrence) * 1);
      startDate = tempDate;
      rEventDates.push({ startDate: tempDate });
    }
  }
  // console.log(rEventDates);
  return rEventDates;
};

const getSelectedDays = (selectedDays) => {
  /* 
        day = new Date().getDay()
        sun = 0
        mon = 1
        tue = 2
        wed = 3
        thu = 4
        fri = 5
        sat = 6
        */
  const days = [];
  selectedDays.map((o) => {
    if (o.isSelected && o.day === "SUN") {
      days.push(0);
    }
    if (o.isSelected && o.day === "MON") {
      days.push(1);
    }
    if (o.isSelected && o.day === "TUE") {
      days.push(2);
    }
    if (o.isSelected && o.day === "WED") {
      days.push(3);
    }
    if (o.isSelected && o.day === "THU") {
      days.push(4);
    }
    if (o.isSelected && o.day === "FRI") {
      days.push(5);
    }
    if (o.isSelected && o.day === "SAT") {
      days.push(6);
    }
  });
  // console.log(days);
  return days;
};

const getSelectedDates = (selectedDatesForMonth) => {
  const dates = [];
  selectedDatesForMonth.map((o) => {
    if (o.isSelected) {
      dates.push(Number(o.date));
    }
  });
  // console.log(dates);
  return dates;
};

const getSelectedMonths = (selectedMonths) => {
  const months = [];
  selectedMonths.map((o) => {
    if (o.isSelected) {
      months.push(o.month);
    }
  });
  // console.log(months);
  return months;
};

const getMonthNameByDate = (date) => {
  const monthName = new Date(date).toLocaleString("default", {
    month: "short",
  });
  return monthName;
};

const getAllDatesForEveryWeek = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedDays
) => {
  const rEventDatesForDay = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence,
    startDate,
    endDate
  );
  const dayList = getSelectedDays(selectedDays);

  const rEventDatesForWeek = [];
  rEventDatesForDay.map((o) => {
    if (dayList.includes(o.startDate.getDay())) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        rEventDatesForWeek.push({ startDate: o.startDate });
      }
    }
  });
  // console.log(rEventDatesForWeek);
  return rEventDatesForWeek;
};

const getAllDatesForWeek = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedDays
) => {
  // get startDate for every week
  const startDateList = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence * 7,
    startDate,
    endDate
  );

  let weeklyDates = [];

  startDateList.map((o) => {
    let sDate = o.startDate;
    let eDate = new Date(o.startDate).setDate(
      new Date(o.startDate).getDate() + 7
    );
    let dDiff = getDateDifference(sDate, eDate);
    const dates = getAllDatesByInterval(dDiff, 1, sDate, eDate);
    weeklyDates.push(...dates);
  });
  // console.log(rEventDatesForWeek);

  const dayList = getSelectedDays(selectedDays);

  const rEventDatesForWeek = [];
  weeklyDates.map((o) => {
    if (dayList.includes(o.startDate.getDay())) {
      rEventDatesForWeek.push({ startDate: o.startDate });
    }
  });
  // console.log(rEventDatesForWeek);
  return rEventDatesForWeek;
};

const getAllDatesForEveryMonth = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedDatesForMonth
) => {
  const getAllDates = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence,
    startDate,
    endDate
  );

  // console.log(getAllDates);

  const dateList = getSelectedDates(selectedDatesForMonth);

  // console.log(dateList);

  const rEventDatesForMonth = [];
  getAllDates.map((o) => {
    if (dateList.includes(o.startDate.getDate())) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        rEventDatesForMonth.push({ startDate: o.startDate });
      }
    }
  });
  // console.log(rEventDatesForMonth);
  return rEventDatesForMonth;
};

const getAllDatesForMonth = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedDatesForMonth
) => {
  // get startDate for every month
  const startDateList = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence * 30,
    startDate,
    endDate
  );

  let monthlyDates = [];
  startDateList.map((o) => {
    let sDate = o.startDate;
    let eDate = new Date(o.startDate).setDate(
      new Date(o.startDate).getDate() + 30
    );
    let dDiff = getDateDifference(sDate, eDate);
    const dates = getAllDatesByInterval(dDiff, 1, sDate, eDate);
    monthlyDates.push(...dates);
  });
  // console.log(monthlyDates);

  const dateList = getSelectedDates(selectedDatesForMonth);

  const rEventDatesForMonth = [];
  monthlyDates.map((o) => {
    if (dateList.includes(o.startDate.getDate())) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        rEventDatesForMonth.push({ startDate: o.startDate });
      }
    }
  });
  // console.log(rEventDatesForMonth);
  return rEventDatesForMonth;
};

const getAllDatesForEveryYear = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedMonths,
  selectedDatesForYear
) => {
  const allDates = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence,
    startDate,
    endDate
  );

  // console.table(allDates);

  const monthList = getSelectedMonths(selectedMonths);

  const datesFilterByMonth = [];
  allDates.map((o) => {
    if (monthList.includes(getMonthNameByDate(o.startDate))) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        datesFilterByMonth.push({ startDate: o.startDate });
      }
    }
  });

  const dateList = getSelectedDates(selectedDatesForYear);
  // console.log(dateList);

  const rEventDatesForYear = [];
  datesFilterByMonth.map((o) => {
    if (dateList.includes(o.startDate.getDate())) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        rEventDatesForYear.push({ startDate: o.startDate });
      }
    }
  });
  // console.log(rEventDatesForYear);
  return rEventDatesForYear;
};

const getAllDatesForYear = (
  dateDiff,
  numOfRecurrence,
  startDate,
  endDate,
  selectedMonths,
  selectedDatesForYear
) => {
  // get startDate for every year
  const startDateList = getAllDatesByInterval(
    dateDiff,
    numOfRecurrence * 365,
    startDate,
    endDate
  );
  // console.log(startDateList);

  let allDates = [];
  startDateList.map((o) => {
    let sDate = o.startDate;
    let eDate = new Date(o.startDate).setDate(
      new Date(o.startDate).getDate() + 365
    );

    let dDiff = getDateDifference(sDate, eDate);
    const dates = getAllDatesByInterval(dDiff, 1, sDate, eDate);
    allDates.push(...dates);
  });
  // console.table(allDates);

  const monthList = getSelectedMonths(selectedMonths);

  const datesFilterByMonth = [];
  allDates.map((o) => {
    if (monthList.includes(getMonthNameByDate(o.startDate))) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        datesFilterByMonth.push({ startDate: o.startDate });
      }
    }
  });

  const dateList = getSelectedDates(selectedDatesForYear);
  // console.log(dateList);

  const rEventDatesForYear = [];
  datesFilterByMonth.map((o) => {
    if (dateList.includes(o.startDate.getDate())) {
      if (new Date(o.startDate) <= new Date(endDate)) {
        rEventDatesForYear.push({ startDate: o.startDate });
      }
    }
  });
  // console.log(rEventDatesForYear);
  return rEventDatesForYear;
};

const getREventData = (dateList, timeInputs, endDate) => {
  return dateList.map((o) => ({
    ...o,
    endDate: new Date(endDate),
    REventTimes: timeInputs,
  }));
};

const getRecurrentEventDates = async (data) => {
  // console.log(JSON.stringify(data));
  let {
    startDate,
    endDate,
    numOfRecurrence,
    recurrenceType,
    timeInputs,
    selectedDays,
    selectedDatesForMonth,
    selectedMonths,
    selectedDatesForYear,
  } = data;

  /* 
    startDate= 21/11/21
    endDate= 31/01/22
    numOfRecurrence= 2
    recurrenceType= Week


    21/11/21 startDate
    25/11/21 startDate = startDate + (numOfRecurrence - 1)
    29/11/21
  
  
  */

  const dateDiff = getDateDifference(startDate, endDate);

  let rEventDates = {};

  switch (recurrenceType) {
    case "Day":
      const rEventDatesForDay = getAllDatesByInterval(
        dateDiff,
        numOfRecurrence,
        startDate,
        endDate
      );

      // rEventDates = {
      //   rEventDates: await getREventData(
      //     rEventDatesForDay,
      //     timeInputs,
      //     endDate
      //   ),
      // };

      // console.log(rEventDatesForDay);
      return await getREventData(rEventDatesForDay, timeInputs, endDate);

    case "Week":
      if (Number(numOfRecurrence) === 1) {
        const rEventDatesForWeek = getAllDatesForEveryWeek(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedDays
        );
        // console.log(rEventDatesForWeek);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForWeek,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForWeek, timeInputs, endDate);
      } else {
        const rEventDatesForWeek = getAllDatesForWeek(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedDays
        );
        // console.log(rEventDatesForWeek);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForWeek,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForWeek, timeInputs, endDate);
      }
      return rEventDates;
    case "Month":
      if (Number(numOfRecurrence) === 1) {
        const rEventDatesForMonth = getAllDatesForEveryMonth(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedDatesForMonth
        );
        // console.log(rEventDatesForMonth);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForMonth,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForMonth, timeInputs, endDate);
      } else {
        const rEventDatesForMonth = getAllDatesForMonth(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedDatesForMonth
        );
        // console.log(rEventDatesForMonth);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForMonth,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForMonth, timeInputs, endDate);
      }
      return rEventDates;
    case "Year":
      if (Number(numOfRecurrence) === 1) {
        const rEventDatesForYear = getAllDatesForEveryYear(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedMonths,
          selectedDatesForYear
        );
        // console.log(rEventDatesForYear);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForYear,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForYear, timeInputs, endDate);
      } else {
        const rEventDatesForYear = getAllDatesForYear(
          dateDiff,
          numOfRecurrence,
          startDate,
          endDate,
          selectedMonths,
          selectedDatesForYear
        );
        // console.log(rEventDatesForYear);

        // rEventDates = {
        //   rEventDates: await getREventData(
        //     rEventDatesForYear,
        //     timeInputs,
        //     endDate
        //   ),
        // };

        // console.log(rEventDates);
        return await getREventData(rEventDatesForYear, timeInputs, endDate);
      }
    // return rEventDates;
    default:
      break;
  }

  // console.log(JSON.stringify(rEventDates));
  // return rEventDates;
};

module.exports = {
  getRecurrentEventDates,
};
