const ReportService = require("./report.service");

const taskCompletionReport = async (req, res, next) => {
  try {
    const report = await ReportService.taskCompletionReport(req, res);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

module.exports = { taskCompletionReport };
