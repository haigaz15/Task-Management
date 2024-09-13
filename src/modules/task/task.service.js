const TaskRepository = require("../../repositories/task.repository");
const UserRepository = require("../../repositories/user.repository");
const UserTaskRepository = require("../../repositories/userTask.repository");
const APIError = require("../../core/apiError");

const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const assignedMembers = taskData.assignedMembers;
    let task = await TaskRepository.find({ title: taskData.title });
    if (task.length !== 0) throw new APIError("Task already exist!", 400);
    if (!assignedMembers || assignedMembers.length === 0) {
      throw new APIError("Please attach the members that will contribute", 400);
    }
    const usernames = assignedMembers.map((a) => a.username);
    let users = await UserRepository.find({ username: { $in: usernames } });
    let newUsers = [];
    if (users.length === 0) {
      await UserRepository.insertManyUsers(assignedMembers);
    } else {
      let setOfUsernames = new Set(usernames);
      users.forEach((user) => {
        if (setOfUsernames.has(user.username))
          setOfUsernames.delete(user.username);
      });
      newUsers = [...setOfUsernames];
      let newAssignedMembers = [];
      for (const member of assignedMembers) {
        for (const newUser of newUsers) {
          if (member.username === newUser) newAssignedMembers.push(member);
        }
      }
      await UserRepository.insertManyUsers(newAssignedMembers);
    }
    users = await UserRepository.find({ username: { $in: usernames } });
    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});

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
    let task = await TaskRepository.find({ title: taskDatas.title });
    if (task.length !== 0) throw new APIError("Task already exist!", 400);

    const assignedMembers = [
      ...new Set(taskDatas.flatMap((taskData) => taskData.assignedMembers)),
    ];
    if (!assignedMembers || assignedMembers.length === 0) {
      throw new APIError("Please attach the members that will contribute", 400);
    }
    const usernames = assignedMembers.map((a) => a.username);
    let users = await UserRepository.find({ username: { $in: usernames } });
    let newUsers = [];
    if (users.length === 0) {
      await UserRepository.insertManyUsers(assignedMembers);
    } else {
      let setOfUsernames = new Set(usernames);
      users.forEach((user) => {
        if (setOfUsernames.has(user.username))
          setOfUsernames.delete(user.username);
      });
      newUsers = [...setOfUsernames];
      let newAssignedMembers = [];
      for (const member of assignedMembers) {
        for (const newUser of newUsers) {
          if (member.username === newUser) newAssignedMembers.push(member);
        }
      }
      await UserRepository.insertManyUsers(newAssignedMembers);
    }

    users = await UserRepository.find({ username: { $in: usernames } });

    const userMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});
    tasks = taskDatas.map((taskData) => {
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
    let contributions = updateData.reduce((sum, u) => {
      sum += u.userContribution;
      return sum;
    }, 0);
    const task = await TaskRepository.findTaskById(taskId);
    if (!task) throw new APIError(`Task with id ${taskId} could not be found`);
    let status = "in-progress";
    if (task.progressLevel === 100)
      throw new APIError(
        `Task is completed! no more contributions are need`,
        400
      );
    if (contributions + task.progressLevel > 100)
      throw new APIError(
        `Users contribution level exceed 100 ${updateData.map(
          (u) =>
            `user with id: ${u.userId} and contribution: ${u.userContribution}, `
        )}. 
         Please adjust your contributions to match exacly 100`,
        400
      );
    if (contributions + task.progressLevel === 100) {
      status = "completed";
    }

    const userTasks = await UserTaskRepository.find({ taskId: taskId });
    if (!userTasks || userTasks === 0)
      throw new APIError("User task can not be found", 404);

    await Promise.all(
      updateData.map(async (user) => {
        return UserTaskRepository.updateUserTask(
          { userId: user.userId, taskId: taskId },
          {
            $inc: {
              userContribution: user.userContribution,
            },
          }
        );
      })
    );
    const updateParams = {
      status: status,
      $inc: { progressLevel: contributions },
      completionDate: status === "completed" ? new Date() : null,
    };
    return await TaskRepository.updateTask(taskId, updateParams, { new: true });
  } catch (err) {
    throw err;
  }
};

module.exports = { createTasks, getTaskDetails, updateTaskStatus, createTask };
