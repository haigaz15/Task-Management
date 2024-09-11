const TaskRepository = require("../../repositories/task.repository");
const UserRepository = require("../../repositories/user.repository");
const APIError = require("../../core/apiError");
const createTasks = async (req, res) => {
  try {
    const taskDatas = req.body;
    const assignedMembers = [
      ...new Set(taskDatas.flatMap((taskData) => taskData.assignedMembers)),
    ];

    const users = await UserRepository.insertManyUsers(assignedMembers);

    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});
    const tasks = taskDatas.map((taskData) => {
      return {
        ...taskData,
        assignedMembers: taskData.assignedMembers.map(
          (assignedMember) => userMap[assignedMember.username]
        ),
      };
    });

    const savedTasks = await TaskRepository.insertManyTasks(tasks);
    await Promise.all(
      savedTasks.map((savedTask) => {
        return UserRepository.updateManyUsers(
          { _id: { $in: savedTask.assignedMembers } },
          { $push: { tasks: savedTask._id } }
        );
      })
    );
  } catch (err) {
    throw err;
  }
};

const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskRepository.findTaskById(taskId);
    if (!task) {
      throw new APIError("Task could not be found", 404);
    }
    return task;
  } catch (err) {
    throw err;
  }
};

const updateTaskStatus = (req, res) => {};

module.exports = { createTasks, getTaskDetails, updateTaskStatus };
