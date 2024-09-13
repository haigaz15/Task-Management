const TaskRepository = require("../../repositories/task.repository");
const UserTaskRepository = require("../../repositories/userTask.repository");
const UserRepository = require("../../repositories/user.repository.js");
const APIError = require("../../core/apiError");
const taskCompletionReport = async (req, res) => {
  try {
    let { completionDate, member } = req.query;
    let stat = [];
    completionDate = Boolean(parseInt(completionDate));
    member = Boolean(parseInt(member));
    const tasks = await TaskRepository.find({ status: "completed" });
    if (!tasks || tasks.length === 0)
      throw new APIError("No tasks completed yet!", 400);
    const completedTasksIds = tasks.map((task) => task._id);
    const userTasks = await UserTaskRepository.find({
      taskId: { $in: completedTasksIds },
    });
    const userIds = userTasks.map((userTask) => userTask.userId);
    const users = await UserRepository.find({ _id: { $in: userIds } });
    const userMap = users.reduce((map, user) => {
      map[user._id] = user.username;
      return map;
    }, {});
    const taskTitleMap = tasks.reduce((map, task) => {
      map[task._id] = task.title;
      return map;
    }, {});
    const taskDateMap = tasks.reduce((map, task) => {
      map[task._id] = task.completionDate;
      return map;
    }, {});
    if (completionDate && !member) {
      stat = tasks.map((task) => {
        return {
          title: task.title,
          completionDate: task.completionDate,
        };
      });
    } else if (!completionDate && member) {
      stat = userTasks.map((userTask) => {
        return {
          taskId: userTask.taskId,
          member: userMap[userTask.userId],
          contribution: userTask.userContribution + "%",
        };
      });

      let statMap = stat.reduce((map, s) => {
        map[s.taskId] = {
          taskId: s.taskId,
          members: [],
        };
        return map;
      }, {});

      stat.forEach((s) => {
        statMap[s.taskId].members.push({
          member: s.member,
          contribution: s.contribution,
        });
      });
      stat = Object.values(statMap);
    } else {
      stat = userTasks.map((userTask) => {
        return {
          task: taskTitleMap[userTask.taskId],
          completionDate: taskDateMap[userTask.taskId],
          member: userMap[userTask.userId],
          contribution: userTask.userContribution + "%",
        };
      });
      let statMap = stat.reduce((map, s) => {
        map[s.task] = {
          task: s.task,
          completionDate: s.completionDate,
          members: [],
        };
        return map;
      }, {});

      stat.forEach((s) => {
        statMap[s.task].members.push({
          member: s.member,
          contribution: s.contribution,
        });
      });
      stat = Object.values(statMap);
    }
    return stat;
  } catch (err) {
    throw err;
  }
};

const taskCompletionAvgTimeAndCount = async (req, res) => {
  try {
    const tasks = await TaskRepository.find({ status: "completed" });
    if (!tasks || tasks.length === 0)
      throw new APIError("No tasks completed yet!", 400);
    const completedTasksCount = tasks.length;
    const timeTookToComplete = tasks.map(
      (task) => (task.completionDate - task.createdAt) / (1000 * 60 * 60)
    );
    let avgTime = 0;
    timeTookToComplete.forEach((time) => {
      avgTime += time;
    });
    avgTime = avgTime / timeTookToComplete.length;
    return {
      completedTasksCount: completedTasksCount,
      averageTimeTookToComplete: avgTime,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { taskCompletionReport, taskCompletionAvgTimeAndCount };
