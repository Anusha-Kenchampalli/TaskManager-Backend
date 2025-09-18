import Task from "../models/Task.js";
import User from"../models/User.js";
import excelJs from "exceljs";

// @desc Export all tasks as an Excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    // Fetch tasks with assigned user details
    const tasks = await Task.find().populate("assignedTo", "name email");

    // Create a new workbook & worksheet
    const workbook = new excelJs.Workbook();
    const workSheet = workbook.addWorksheet("Task Report");

    // Define worksheet columns
    workSheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Assigned User", key: "assignedUser", width: 30 },
      { header: "Assigned Email", key: "assignedEmail", width: 30 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    // Add rows (map tasks to worksheet rows)
    tasks.forEach((task) => {
      workSheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedUser: task.assignedTo ? task.assignedTo.name : "Unassigned",
        assignedEmail: task.assignedTo ? task.assignedTo.email : "N/A",
        createdAt: task.createdAt ? task.createdAt.toISOString().split("T")[0] : "",
      });
    });

    // Set response headers for Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks-report.xlsx"
    );

    // Write the Excel file to the response
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting tasks", error: error.message });
  }
};

// @desc Export all users as an Excel file
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find();

    const workbook = new excelJs.Workbook();
    const workSheet = workbook.addWorksheet("User Report");

    // Define worksheet columns
    workSheet.columns = [
      { header: "User ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Role", key: "role", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    // Add rows
    users.forEach((user) => {
      workSheet.addRow({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "N/A",
        createdAt: user.createdAt ? user.createdAt.toISOString().split("T")[0] : "",
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting users", error: error.message });
  }
};

export {
  exportTasksReport,
  exportUsersReport,
};
