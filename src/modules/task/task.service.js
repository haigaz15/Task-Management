const TaskRepository = require("../../repositories/task.repository");
const UserRepository = require("../../repositories/user.repository");
const UserTaskRepository = require("../../repositories/userTask.repository");
const APIError = require("../../core/apiError");

const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const assignedMembers = taskData.assignedMembers;
    const usernames = assignedMembers.map((a) => a.username);
    let users = await UserRepository.find({ username: { $in: usernames } });
    if (!users || !users.length === 0)
      throw new APIError(
        `Some Users with ids ${users.map((user) => user._id)} already exist!`,
        400
      );
    users = await UserRepository.insertManyUsers(assignedMembers);
    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});
    let task = TaskRepository.find({ title: taskData.title });
    if (!task || !task.length === 0)
      throw new APIError("Task already exist!", 400);
    task = await TaskRepository.createTask({
      title: taskData.title,
      description: taskData.description,
      dueData: taskData.dueData,
      priority: taskData.priority,
    });
    const userTasks = [];
    taskData.assignedMembers.forEach((member) => {
      userTasks.push({
        userId: userMap[member.username],
        taskId: task._id,
      });
    });
    return await UserTaskRepository.insertManyUserTask(userTasks);
  } catch (err) {
    throw err;
  }
};
const createTasks = async (req, res) => {
  try {
    const taskDatas = req.body;
    const assignedMembers = [
      ...new Set(taskDatas.flatMap((taskData) => taskData.assignedMembers)),
    ];
    const usernames = assignedMembers.map((a) => a.username);
    let users = await UserRepository.find({ username: { $in: usernames } });
    if (!users || users.length === 0)
      throw new APIError(
        `Some Users with ids ${users.map((user) => user._id)} already exist!`,
        400
      );
    users = await UserRepository.insertManyUsers(assignedMembers);

    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});
    const tasks = taskDatas.map((taskData) => {
      return {
        title: taskData.title,
        description: taskData.description,
        dueData: taskData.dueData,
        priority: taskData.priority,
      };
    });

    const savedTasks = await TaskRepository.insertManyTasks(tasks);
    const userTasks = [];
    savedTasks.map((savedTask) => {
      taskDatas
        .find((t) => t.title === savedTask.title)
        .assignedMembers.forEach((member) => {
          userTasks.push({
            userId: userMap[member.username],
            taskId: savedTask._id,
          });
        });
    });
    return await UserTaskRepository.insertManyUserTask(userTasks);
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

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;
    const contributions = updateData.reduce((sum, u) => {
      sum += u.userContribution;
      return sum;
    }, 0);
    const task = await TaskRepository.findTaskById(taskId);
    if (!task) throw new APIError(`Task with id ${taskId} could not be found`);
    const userTasks = await UserTaskRepository.find({ taskId: taskId });
    if (!userTasks || userTasks === 0)
      throw new APIError("User task can not be found", 404);

    const updatedUserTasks = await Promise.all(
      updateData.map(async (user) => {
        return UserTaskRepository.updateUserTask(
          { userId: user.userId },
          {
            $inc: {
              userContribution: user.userContribution,
            },
          }
        );
      })
    );

    return await TaskRepository.updateTask(taskId, {
      status: "in-progress",
      $inc: { progressLevel: contributions },
    });
  } catch (err) {
    throw err;
  }
};

module.exports = { createTasks, getTaskDetails, updateTaskStatus, createTask };
