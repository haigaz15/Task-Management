const APIError = require("../../core/apiError");
const ReportService = require("../../modules/report/report.service");
const TaskRepository = require("../../repositories/task.repository");
const UserRepository = require("../../repositories/user.repository");
const UserTaskRepository = require("../../repositories/userTask.repository");

const users = [
  { _id: "asfsf", username: "user1", firstName: "user", lastName: "man" },
];
const task = {
  _id: "sdsd",
  title: "mock",
  description: "mocking",
  dueData: "2024-10-18",
  priority: 1,
  status: "completed",
  progressLevel: 100,
  createdAt: new Date("2024-09-13T06:17:02.377+00:00"),
  completionDate: new Date("2024-09-13T06:22:32.936Z"),
};

const userTasks = {
  _id: "sd",
  userId: "asfsf",
  taskId: "sdsd",
};
describe("Report Unit Test", () => {
  test("Testing taskCompletionReport - 1 - ", async () => {
    jest.spyOn(TaskRepository, "find").mockResolvedValue([task]);
    jest.spyOn(UserTaskRepository, "find").mockResolvedValue([userTasks]);
    jest.spyOn(UserRepository, "find").mockResolvedValue(users);
    const result = await ReportService.taskCompletionReport(
      {
        query: {
          completionDate: "1",
          member: "1",
        },
      },
      {}
    );
    expect(result[0].task).toBe("mock");
    expect(new Date(result[0].completionDate).toString()).toBe(
      new Date("2024-09-13T06:22:32.936Z").toString()
    );
  });

  test("Testing taskCompletionReport - 2 - ", async () => {
    try {
      jest.spyOn(TaskRepository, "find").mockResolvedValue([]);
      const result = await ReportService.taskCompletionReport(
        {
          query: {
            completionDate: "1",
            member: "1",
          },
        },
        {}
      );
    } catch (err) {
      if (err instanceof APIError)
        expect(err.message).toBe("No tasks completed yet!");
    }
  });

  test("Testing taskCompletionAvgTimeAndCount - 1 -", async () => {
    try {
      jest.spyOn(TaskRepository, "find").mockResolvedValue([]);
      const result = await ReportService.taskCompletionAvgTimeAndCount({}, {});
    } catch (err) {
      if (err instanceof APIError)
        expect(err.message).toBe("No tasks completed yet!");
    }
  });

  test("Testing taskCompletionAvgTimeAndCount - 2 -", async () => {
    jest.spyOn(TaskRepository, "find").mockResolvedValue([task]);
    const result = await ReportService.taskCompletionAvgTimeAndCount({}, {});
    expect(result.completedTasksCount).toBe(1);
    expect(Math.ceil(result.averageTimeTookToComplete)).toBe(Math.ceil(0.09));
  });
});
