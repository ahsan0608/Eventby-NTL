const cron = require("node-cron");
const { updateREventStatus } = require("./schedulerJobs");

const startScheduler = async () => {
  try {
    // run every 30 seconds
    cron.schedule("*/30 * * * * *", async () => {
      console.log("CRONJOB RUNNING AT: " + new Date().toLocaleTimeString());

      updateREventStatus();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  startScheduler,
};
