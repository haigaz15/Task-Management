const TaskRepository = require("../../repositories/task.repository");
const UserRepository = require("../../repositories/user.repository");

const createTasks = async (req, res) => {
  try {
    const taskDatas = req.body;
    const assignedMembers = taskDatas.map((taskData) => {
      return taskData.assignedMembers.map((assignedMember) => assignedMember);
    });
    const users = await UserRepository.insertManyUsers(assignedMembers);
    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});
    const tasks = taskDatas.map((taskData) => {
      return {
        ...tasksDatas,
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

const getTaskDetails = (req, res) => {};

const updateTaskStatus = (req, res) => {};

module.exports = { createTasks, getTaskDetails, updateTaskStatus };
