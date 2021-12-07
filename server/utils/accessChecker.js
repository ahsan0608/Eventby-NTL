const models = require("../models");

module.exports = () => {
  return async (req, res, next) => {
    try {
      const eventId = req.params.id;

      await models.Event.find({
        _id: eventId,
      })
        .then(function (event) {
          const isAmin = event[0].admin.includes(req.user.id);
          if (!isAmin) {
            res.status(403).json({
              success: false,
              message: "You don't have privilege to perform this action!",
            });
            return;
          }
          next();
        })
        .catch(function (err) {
          res.status(405).send(err);
        });
    } catch (error) {
      next(error);
    }
  };
};
