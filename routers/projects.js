const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const projectModel = require("../models/project");
const recordModel = require("../models/record");
const employeeModel = require("../models/employee");
const toolModel = require("../models/tool");
const { projectValidation, projectEditValidation } = require("../utils/validation");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser").json();
const upload = multer();
const fileSystem = require("fs");
const { promisify } = require("util");
const { decodeBase64 } = require("bcryptjs");
const pipeline = promisify(require("stream").pipeline);
require("dotenv/config");

//Insert new project to the database
router.post("/", async (request, response) => {
    // Validate before creating
    const { error } = projectValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    //Create new proj
    const newProject = new projectModel({
        ProjectName: request.body.projectName,
        Description: request.body.description,
        Date: request.body.date,
        FormType: "Tools",
        Status: request.body.status,
        IsDeleted: false,
    });
    try {
        const project = await newProject.save();
        response.status(200).json({ project: project.ProjectName });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const { error } = projectEditValidation(request.body);
        if (error) return response.status(400).send(error.details[0].message);

        const project = await projectModel.findById(request.params.id);
        const updates = request.body;
        const options = { new: true };
        const updatedProject = await projectModel.findByIdAndUpdate(
            project,
            updates,
            options
        );
        response.status(200).json({ project: updatedProject.ProjectName });
    } catch (error) {
        response.status(500).json({ error: "Error" });
    }
});

//List of Projects
router.post("/list", verify, async (request, response) => {
    try {
        var fromDate = request.body.fromDate !== "" ? request.body.fromDate : moment("01/01/2020", "yyyy-MM-DD");
        var toDate = request.body.toDate !== "" ? request.body.toDate : moment().format("yyyy-MM-DD");
        var page = request.body.page !== "" ? request.body.page : 0;
        var perPage = 20;
        if (Object.keys(request.body.selectedProject).length > 0) {
            var id = [];
            var data = request.body.selectedProject;
            for (const i in data) {
                id.push({ _id: request.body.selectedProject[i].value });
            }
            const projects = await projectModel.find({
                '$or': id,
                FormType: "Tools",
                IsDeleted: false
            }).sort('-Date');

            var data = [];
            for (const i in projects) {
                var borrowedTools = [];

                const records = await recordModel.find({
                    ProjectId: projects[i]._id,
                    DateBorrowed: { $gte: new Date(fromDate).setHours(5, 0, 0), $lte: new Date(toDate).setHours(23, 59, 59) },
                }).sort('-DateBorrowed');
                for (const i in records) {
                    var tool = await toolModel.find({ _id: records[i].ToolId });
                    var employee = await employeeModel.find({ _id: records[i].EmployeeId });
                    var recordData = {
                        "_id": records[i]._id,
                        "SerialNo": tool[0].SerialNo,
                        "ToolId": tool[0]._id,
                        "ToolName": tool[0].Name,
                        "EmployeeId": employee[0]._id,
                        "EmployeeNo": employee[0].EmployeeNo,
                        "EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
                        "DateBorrowed": records[i].DateBorrowed,
                        "Project": records[i].ProjectId,
                        "DateReturned": records[i].DateReturned,
                        "ProcessedBy": records[i].ProcessedBy,
                        "Remarks": records[i].Remarks,
                        "Status": records[i].Status,
                    }
                    borrowedTools.push(recordData);
                }

                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "Date": projects[i].Date,
                    "FormType": projects[i].FormType,
                    "Status": projects[i].Status,
                    "IsDeleted": projects[i].IsDeleted,

                    "BorrowedTools": borrowedTools
                }
                data.push(proj);
            }
            response.status(200).json(data);
        } else {
            const projects = await projectModel.find({ IsDeleted: false, FormType: "Tools" }).skip((page - 1) * perPage).limit(perPage).sort('-Date');
            var data = [];
            for (const i in projects) {
                var borrowedTools = [];

                const records = await recordModel.find({
                    ProjectId: projects[i]._id,
                    DateBorrowed: { $gte: new Date(fromDate).setHours(5, 0, 0), $lte: new Date(toDate).setHours(23, 59, 59) },
                }).sort('-DateBorrowed');
                for (const i in records) {
                    var tool = await toolModel.find({ _id: records[i].ToolId });
                    var employee = await employeeModel.find({ _id: records[i].EmployeeId });
                    var recordData = {
                        "_id": records[i]._id,
                        "SerialNo": tool[0].SerialNo,
                        "ToolId": tool[0].ToolId,
                        "ToolName": tool[0].Name,
                        "EmployeeId": employee[0]._id,
                        "EmployeeNo": employee[0].EmployeeNo,
                        "EmployeeName": employee[0].FirstName + " " + employee[0].MiddleName + " " + employee[0].LastName,
                        "DateBorrowed": records[i].DateBorrowed,
                        "Project": records[i].ProjectId,
                        "DateReturned": records[i].DateReturned,
                        "ProcessedBy": records[i].ProcessedBy,
                        "Remarks": records[i].Remarks,
                        "Status": records[i].Status,
                    }
                    borrowedTools.push(recordData);
                }

                var proj = {
                    "_id": projects[i]._id,
                    "ProjectName": projects[i].ProjectName,
                    "Description": projects[i].Description,
                    "Date": projects[i].Date,
                    "FormType": projects[i].FormType,
                    "Status": projects[i].Status,
                    "IsDeleted": projects[i].IsDeleted,

                    "BorrowedTools": borrowedTools
                }
                data.push(proj);
            }
            response.status(200).json(data);
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// list total form
router.get("/total-form", async (request, response) => {
    try {
        // const data = await timeLogsModel.find().sort('employeeName');
        const data = await projectModel.find({ IsDeleted: false, FormType: "Tools" });

        response.status(200).json(data.length);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

//For search options
router.get("/search-options", verify, async (request, response) => {
    try {
        const projects = await projectModel.find({ IsDeleted: false, FormType: "Tools" }).sort('ProjectName');
        response.status(200).json(projects);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

//Delete project from the database based on id
router.delete("/:id", async (request, response) => {
    try {
        const project = await projectModel.findById(request.params.id);
        // const deletedEmployee = await project.delete();
        const updates = { IsDeleted: true };
        const options = { new: true };
        const deletedProject = await projectModel.findByIdAndUpdate(
            project,
            updates,
            options
        );
        response.status(200).json(deletedProject);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;
