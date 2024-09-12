const TaskRepository = require("../../repositories/task.repository");

const taskCompletionReport = async (req, res) => {
  try {
    const tasks = await TaskRepository.find({});
    console.log(tasks);
  } catch (err) {
    throw err;
  }
};

module.exports = { taskCompletionReport };
