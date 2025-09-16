const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs")

// @desc Export all tasks as an Excel file
// @route GET /api/reports/export/taks
// @access Private (Admin)

const exportTasksReport = async (req, res)=>{
    try{
        const tasks= await Task.find().populate("assignedTo", "name email");

        const workbook= new excelJs.Workbook();
        const workSheet = workbook.addWorksheet("Task Report");

        workSheet.columns=[
            { header: "Task ID", key: "_id", width: 25},
            {header: "Title", key: "title", width: 30 },
            {header: "Description", key: "description", width: 50 },
            {header: "Priority", key: "priority", width: 15 },
            {header: "Title", key: "title", width: 30 },
            {header: "Title", key: "title", width: 30 },
            {header: "Title", key: "title", width: 30 },
        ]
    }catch(error){
        res.status(500).json({message: "Error exporting tasks", error: error.message})
    }
};

// @desc Export user-task as an Excel file
// @route GET /api/reports/export/taks
// @access Private (Admin)
const exportUsersReport = async(req, res) => {
    try{

    }catch(error){
        res.status(500).json({message: "Error exporting tasks", error: error.message})
    }
}

module.exports ={
    exportTasksReport,
    exportUsersReport,
}