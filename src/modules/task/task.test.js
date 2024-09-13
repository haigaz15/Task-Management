const TaskRepository = require("../../repositories/task.repository");
const TaskService = require("../../modules/task/task.service");
const UserRepository = require("../../repositories/user.repository");
const UserTaskRepository = require("../../repositories/userTask.repository");
const APIError = require("../../core/apiError");
const users = [
  { id: "asfsf", username: "user1", firstName: "user", lastName: "man" },
];
const task = {
  id: "sdsd",
  title: "mock",
  description: "mocking",
  dueData: "2024-10-18",
  priority: 1,
};
const taskData = {
  ...task,
  assignedMembers: [{ username: "user1", firstName: "user", lastName: "man" }],
};
const userTasks = {
  id: "sd",
  userId: "asfsf",
  taskId: "sdsd",
};
describe("Task unit test suite: ", () => {
  test("Testing Create Task  - 1 - ", async () => {
    try {
      jest.spyOn(TaskRepository, "find").mockResolvedValue([task]);
      await TaskService.createTask(
        {
          body: taskData,
        },
        { res: {} }
      );
    } catch (err) {
      if (err instanceof APIError) {
        expect(err.message).toBe("Task already exist!");
      }
    }
  });

  test("Testing Create Task - 2 - ", async () => {
    jest.spyOn(UserRepository, "find").mockResolvedValue([]);
    jest.spyOn(TaskRepository, "find").mockResolvedValue([]);
    jest.spyOn(UserRepository, "insertManyUsers").mockResolvedValue([users]);
    jest.spyOn(TaskRepository, "createTask").mockResolvedValue(task);
    jest
      .spyOn(UserTaskRepository, "insertManyUserTask")
      .mockResolvedValue([userTasks]);
    const tt = await TaskService.createTask(
      {
        body: taskData,
      },
      { res: {} }
    );
    expect(tt[0].taskId).toBe("sdsd");
  });

  test("Testing Get task details - 1 - ", async () => {
    try {
      jest.spyOn(TaskRepository, "findTaskById").mockResolvedValue(undefined);
      await TaskService.getTaskDetails({ params: { taskId: "asf" } }, {});
    } catch (err) {
      if (err instanceof APIError)
        expect(err.message).toBe("Task could not be found");
    }
  });
  test("Testing Get task details - 2 - ", async () => {
    jest.spyOn(TaskRepository, "findTaskById").mockResolvedValue(task);
    const tt = await TaskService.getTaskDetails(
      { params: { taskId: "sdsd" } },
      {}
    );
    expect(tt.title).toBe("mock");
  });

  test("Testing update task details ", async () => {
    jest.spyOn(TaskRepository, "findTaskById").mockResolvedValue(task);
    jest.spyOn(UserRepository, "find").mockResolvedValue([]);
    jest.spyOn(UserTaskRepository, "find").mockResolvedValue([userTasks]);
    jest
      .spyOn(UserTaskRepository, "updateUserTask")
      .mockResolvedValue(undefined);
    jest
      .spyOn(TaskRepository, "updateTask")
      .mockResolvedValue({ progressLevel: 5 });
    const tt = await TaskService.updateTaskStatus(
      {
        params: { taskId: "sdsd" },
        body: [
          {
            userId: "asfsf",
            userContribution: 5,
          },
        ],
      },
      {}
    );
    expect(tt.progressLevel).toBe(5);
  });
});
