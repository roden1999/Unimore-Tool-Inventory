import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Card, Icon, Table, TableCell, Pagination, Menu, Grid, List, Segment, Label, Input, Loader } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import moment from 'moment';

//import pdfmake
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const customMultiSelectStyle = {
    clearIndicator: (ci) => ({
        ...ci
        // backgroundColor: '#383f48',
    }),
    dropdownIndicator: (ci) => ({
        ...ci
        // backgroundColor: "#383f48"
    }),
    indicatorsContainer: (ci) => ({
        ...ci,
        color: "red",
        // backgroundColor: "#383f48",
        position: "sticky",
        top: 0,
        height: "40px",
        zIndex: "100"
    }),
    control: (base) => ({
        ...base,
        height: 40,
        minHeight: 40,
        overflowX: "hidden",
        overflowY: "auto",
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        width: "100%"
        // backgroundColor: '#383f48',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
        zIndex: 1000
    }),
    singleValue: base => ({
        ...base,
        // color: "#fff"
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: "#1E8EFF",
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: "#00000",
    }),
    input: base => ({
        ...base,
        // color: "#fff"
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

const customSelectStyle = {
    control: base => ({
        ...base,
        height: 40,
        minHeight: 40,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        // backgroundColor: '#383f48',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        padding: 20,
        zIndex: 1000
    }),
    singleValue: base => ({
        ...base,
        // color: "#fff"
    }),
    input: base => ({
        ...base,
        // color: "#fff"
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

const Projects = () => {
    const [projectData, setProjectData] = useState(null);
    const [projectOptions, setProjectOptions] = useState(null);
    const [selectedProject, setSelectedProject] = useState([]);
    const [loader, setLoader] = useState(false);
    const [addloader, setAddloader] = useState(false);
    const [id, setId] = useState(-1);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState([]);
    const [date, setDate] = useState(moment());
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [borrowModal, setBorrowModal] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [recordId, setRecordId] = useState(-1);
    const [toolData, setToolData] = useState([]);
    const [toolId, setToolId] = useState("");
    const [empData, setEmpData] = useState(null);
    const [employeeId, setEmployeeId] = useState([]);
    const [project, setProject] = useState("");
    const [dateBorrowed, setDateBorrowed] = useState(moment());
    const [processedBy, setProcessedBy] = useState("");
    const [remarks, setRemarks] = useState("");
    const [fromDate, setFromDate] = useState(moment().format('01/01/2021'));
    const [toDate, setToDate] = useState(moment().format('MM/DD/yyyy'));
    const [editItem, setEditItem] = useState(false);
    const [itemId, setItemId] = useState(-1);
    const [projId, setProjId] = useState("");
    const [totalForm, setTotalForm] = useState(0);
    const [page, setPage] = useState(1);

    const boundaryRange = 0;
    const siblingRange = 0;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        setLoader(true);
        var data = {
            selectedProject: !selectedProject ? [] : selectedProject,
            fromDate: fromDate,
            toDate: toDate,
            page: page
        };
        var route = "projects/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");
        const user = JSON.parse(sessionStorage.getItem('user'));

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success                
                if (Array.isArray(response.data)) {
                    setProjectData(response.data);
                    setProcessedBy(user.Name);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setProjectData(obj);
                    setProcessedBy(user.Name);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                setLoader(false);
            });
    }, [selectedProject, fromDate, toDate, page]);

    const projectsList = projectData
        ? projectData.map((x) => ({
            id: x._id,
            projectName: x.ProjectName,
            description: x.Description,
            status: x.Status,
            date: x.Date,
            borrowedTools: x.BorrowedTools
        }))
        : [];

    useEffect(() => {
        var route = "projects/total-form";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalForm(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [projectOptions, selectedProject, loader]);

    useEffect(() => {
        var route = "projects/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setProjectOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setProjectOptions(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [loader]);

    const projectsOptionsList = projectOptions
        ? projectOptions.map((x) => ({
            id: x._id,
            name: x.ProjectName + " | " + moment(x.Date).format("MM/DD/yyyy"),
        }))
        : [];

    function ProjectsOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.name,
                    value: x.id,
                });
            });
        }
        return list;
    }

    useEffect(() => {
        var route = "employees/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setEmpData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setEmpData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [loader]);

    const employeeOptionsList = empData
        ? empData.map((x) => ({
            id: x._id,
            name: x.FirstName + " " + x.MiddleName + " " + x.LastName,
        }))
        : [];

    function EmployeesOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.name,
                    value: x.id,
                });
            });
        }
        return list;
    }

    useEffect(() => {
        var route = "tools/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setToolData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setToolData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [loader]);

    const toolsOptionsList = toolData
        ? toolData.map((x) => ({
            id: x._id,
            name: x.Name,
            serialNo: x.SerialNo
        }))
        : [];

    function ToolsOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.name + " | " + x.serialNo,
                    value: x.id,
                });
            });
        }
        return list;
    }

    const handleAddProject = () => {
        var route = "projects/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            projectName: projectName,
            description: description,
            date: date,
            status: status ? status.value : "",
        }

        setAddloader(true);

        axios
            .post(url, data, {
                headers: {
                    "auth-token": token,
                },
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.project + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setAddloader(false);
                setId(-1);
                setProjectName("");
                setDescription("");
                setDate(moment());
                setStatus([]);
            })
            .catch(function (error) {
                // handle error
                toast.error(JSON.stringify(error.response.data), {
                    position: "top-center"
                });
                setAddloader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleCloseAddModal = () => {
        setAddModal(false);
        setId(-1);
        setProjectName("");
        setDescription("");
        setDate(moment());
    }

    const handleEditProjects = () => {
        var route = `projects/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            // id: id,
            ProjectName: projectName,
            Description: description,
            Date: date,
            Status: status ? status.value : "",
        }

        setLoader(true);

        axios
            .put(url, data, {
                headers: {
                    "auth-token": token,
                },
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.project + ' successfully saved.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setProjectName("");
                setDescription("");
                setDate(moment());
                setStatus([]);
            })
            .catch(function (error) {
                // handle error
                toast.error(JSON.stringify(error.response.data), {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleOpenEditModal = (params) => {
        var stat = [{ label: params.status, value: params.status }]
        setEditModal(true);
        setId(params.id);
        setProjectName(params.projectName);
        setDescription(params.description);
        setDate(moment(params.date));
        setStatus(stat)
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setProjectName("");
        setDescription("");
        setStatus([]);
    }

    const handleDeleteItem = () => {
        var url = window.apihost + `projects/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('Form successfully deleted.', {
                        position: "top-center"
                    })
                    setId(-1);
                    setLoader(false);
                    setDeletePopup(false);
                }
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    const error = {
                        status: err.response.status,
                        error: err.response.data,
                    };
                    alert(JSON.stringify(error));
                    setLoader(false);
                } else {
                    // alert(err.response.status + JSON.stringify(err.response.data));
                    const error = {
                        status: err.response.status,
                        error: JSON.stringify(err.response.data),
                    };
                    toast.error(JSON.stringify(error.response.data), {
                        position: "top-center"
                    });
                    setLoader(false);
                }
            });
    }

    const handleOpenDeletePopup = (id) => {
        setDeletePopup(true);
        setId(id);
    }

    const handleCloseDeleteModal = () => {
        setDeletePopup(false);
        setId(-1);
        setProjectName("");
        setDescription("");
        setDate(moment());
        setStatus([])
    }

    const handleCloseBorrowModal = () => {
        setBorrowModal(false);
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setProject("");
    }

    const handleAddTools = () => {
        var route = "records/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            toolId: toolId.length !== 0 ? toolId.value : "",
            employeeId: employeeId.length !== 0 ? employeeId.value : "",
            dateBorrowed: dateBorrowed,
            project: project,
            dateReturned: "",
            status: "Borrowed",
            processedBy: processedBy,
            receivedBy: "",
            remarks: remarks
        }

        setLoader(true);

        axios
            .post(url, data, {
                headers: {
                    "auth-token": token,
                },
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.record + ' successfully edited.', {
                    position: "top-center"
                })
                setBorrowModal(false);
                setLoader(false);
                setToolId("");
                setEmployeeId("");
                setDateBorrowed(moment());
                setRemarks("");
            })
            .catch(function (error) {
                // handle error
                toast.error(JSON.stringify(error.response.data), {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleBorrowTool = (id) => {
        setBorrowModal(true);
        setProject(id);
    }

    const handleOpenReturnModal = (params) => {
        setReturnModal(true);
        setRecordId(params._id);
        setRemarks(params.Remarks)
    }

    const handleCloseReturnModal = () => {
        setReturnModal(false);
        setEmployeeId("");
        setDateBorrowed(moment());
        setRemarks("");
    }

    const handleReturnTools = () => {
        var route = `records/${recordId}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            // toolId: toolId,
            // employeeId: employeeId,
            // dateBorrowed: dateBorrowed,
            // project: project,
            DateReturned: moment(),
            Status: "Returned",
            // processedBy: "",
            ReceivedBy: processedBy,
            Remarks: remarks
        }

        setLoader(true);

        axios
            .put(url, data, {
                headers: {
                    "auth-token": token,
                },
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.record + ' successfully returned.', {
                    position: "top-center"
                });
                setReturnModal(false);
                setLoader(false);
                setId(-1);
                setRecordId(-1);
                setEmployeeId("");
                setDateBorrowed(moment());
                setRemarks("");
            })
            .catch(function (error) {
                // handle error
                alert(error);
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleEditItem = (params) => {
        var tool = [{ value: params.ToolId, label: params.ToolName }];
        var borrower = [{ value: params.EmployeeId, label: params.EmployeeName }];
        setEditItem(true);
        setItemId(params._id);
        setToolId(tool);
        setEmployeeId(borrower);
        setDateBorrowed(moment(params.DateBorrowed));
        setRemarks(params.remarks)
    }

    const handleCancelEditItem = () => {
        setEditItem(false);
        setItemId(-1);
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setRemarks("");
    }

    const handleSubmitEditItem = () => {
        var route = `records/edit-item/${itemId}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            ToolId: toolId ? toolId.value : "",
            EmployeeId: employeeId ? employeeId.value : "",
            DateBorrowed: dateBorrowed,
            Remarks: remarks
        }

        setLoader(true);

        axios
            .put(url, data, {
                headers: {
                    "auth-token": token,
                },
            })
            .then(function (response) {
                // handle success
                toast.success(response.data.record + ' successfully saved.', {
                    position: "top-center"
                });
                setLoader(false);
                setEditItem(false);
                setItemId(-1);
                setToolId("");
                setEmployeeId("");
                setDateBorrowed(moment());
            })
            .catch(function (error) {
                // handle error
                toast.error(JSON.stringify(error.response.data), {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    function StatusOption() {
        var list = [
            { value: "On Going", label: "On Going" },
            { value: "Finished", label: "Finished" },
        ];
        return list;
    }

    const exportToPDF = (e) => {
        const document = {
            content: [
                { image: 'unimore', width: 195, height: 70 },
                {
                    columns: [
                        [
                            { text: "TOOLS", fontSize: 15, bold: true, lineHeight: 1 },
                            { text: "Project Name: " + e.projectName, fontSize: 12, bold: true, lineHeight: 1 },
                            { text: "Description: " + e.description, fontSize: 12, bold: false, lineHeight: 1, },
                        ],
                        [
                            { text: "Date: " + moment(e.date).format("MMM DD"), fontSize: 12, bold: false, lineHeight: 1, },
                            { text: "Status: " + e.status, fontSize: 12, bold: false, lineHeight: 1, },
                        ]
                    ]
                },
            ],
            images: {
                unimore: 'https://i.ibb.co/mTwt2jt/unimore-logo-back-black.png'
            }
        }

        document.content.push({
            // layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                widths: [80, 50, 78, 60, 37, 70, 70],
                body: [
                    //Data
                    //Header
                    [
                        { text: 'Tool Name', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Serial No.', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Borrower', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Date Borrowed', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Returned', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Date Returned', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                        { text: 'Remarks', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                    ],
                ]
            },
        });

        e.borrowedTools.forEach(y => {
            document.content.push({
                // layout: 'lightHorizontalLines',
                table: {
                    headerRows: 1,
                    widths: [80, 50, 78, 60, 37, 70, 70],
                    body: [
                        //Data
                        [
                            { text: y.ToolName, fontSize: 7, alignment: "left", },
                            { text: y.SerialNo, fontSize: 7, alignment: "left", },
                            { text: y.EmployeeName, fontSize: 7, alignment: "left", },
                            { text: moment(y.DateBorrowed).format("MM/DD/yyyy").toString(), fontSize: 7, alignment: "center", },
                            { text: y.Status, fontSize: 7, alignment: "center", color: y.Status === "Returned" ? "green" : "black" },
                            { text: moment(y.DateReturned).format("MM/DD/yyyy | h:mm a").toString(), fontSize: 7, alignment: "center", },
                            { text: y.Remarks, fontSize: 7, alignment: "left", },
                        ],
                    ],
                    // lineHeight: 2
                },
            });
        });

        pdfMake.tableLayouts = {
            exampleLayout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 1;
                },
                vLineWidth: function (i) {
                    return 0;
                },
                hLineColor: function (i) {
                    return i === 1 ? 'black' : '#aaa';
                },
                paddingLeft: function (i) {
                    return i === 0 ? 0 : 8;
                },
                paddingRight: function (i, node) {
                    return (i === node.table.widths.length - 1) ? 0 : 8;
                }
            }
        };

        // pdfMake.createPdf(document).download();
        pdfMake.createPdf(document).print({}, window.frames['printPdf']);
    }

    const isMobile = window.innerWidth <= 768;

    return (
        <div style={{ padding: "1rem" }}>
            <ToastContainer />
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Button size="large" onClick={() => setAddModal(true)}>
                    <Icon name="plus" /> Add Form
                </Button>

                <div style={{ width: isMobile ? "100%" : "30%", marginTop: isMobile ? "1rem" : 0 }}>
                    <Select
                        defaultValue={selectedProject}
                        options={ProjectsOption(projectsOptionsList)}
                        onChange={(e) => setSelectedProject(e)}
                        placeholder="Search..."
                        isClearable
                        isMulti
                        styles={customMultiSelectStyle}
                    />
                </div>
            </div>

            <Grid stackable style={{ marginTop: "2rem" }}>
                {/* Project List */}
                <Grid.Column width={isMobile ? 16 : 3}>
                    <Menu fluid vertical size="massive" color="blue">
                        <Menu.Item style={{ backgroundColor: "#B9B9B9" }}>
                            <h4 style={{ textAlign: "center" }}>PROJECT</h4>
                        </Menu.Item>

                        {loader ? (
                            <Loader active inline="centered" style={{ marginTop: "2rem" }} />
                        ) : projectsList && projectsList.length > 0 ? (
                            projectsList.map((x) => (
                                <Menu.Item
                                    key={x.id}
                                    active={x.id === projId}
                                    onClick={() => setProjId(x.id)}
                                >
                                    <List>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header>{x.projectName}</List.Header>
                                                <List.Description>{moment(x.date).format("MMMM DD, yyyy")}</List.Description>
                                                <List.Description>{x.description}</List.Description>
                                                {x.status && (
                                                    <Label color={x.status !== "On Going" ? "green" : "blue"}>
                                                        {x.status}
                                                    </Label>
                                                )}
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <Button circular size="mini" icon="edit" onClick={() => handleOpenEditModal(x)} />
                                        <Button circular size="mini" icon="trash" onClick={() => handleOpenDeletePopup(x.id)} style={{ marginLeft: "0.5rem" }} />
                                    </div>
                                </Menu.Item>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                <h4 style={{ color: "#C4C4C4" }}>No Project found!</h4>
                            </div>
                        )}

                        <Menu.Item>
                            {selectedProject.length === 0 && (
                                <Pagination
                                    activePage={page}
                                    boundaryRange={boundaryRange}
                                    onPageChange={(e, { activePage }) => setPage(activePage)}
                                    size="mini"
                                    siblingRange={siblingRange}
                                    totalPages={Math.ceil(totalForm / 20)}
                                    ellipsisItem={showEllipsis ? undefined : null}
                                    firstItem={showFirstAndLastNav ? undefined : null}
                                    lastItem={showFirstAndLastNav ? undefined : null}
                                    prevItem={showPreviousAndNextNav ? undefined : null}
                                    nextItem={showPreviousAndNextNav ? undefined : null}
                                />
                            )}
                        </Menu.Item>
                    </Menu>
                </Grid.Column>

                {/* Borrowed Tools Table / Cards */}
                <Grid.Column width={isMobile ? 16 : 13}>
                    <Segment style={{ minHeight: "72vh", maxHeight: "72vh", overflowY: "auto" }}>
                        {loader ? (
                            <Loader active inline="centered" size="large" content="Loading..." />
                        ) : projId && projectsList ? (
                            projectsList
                                .filter((x) => x.id === projId)
                                .map((proj) => {
                                    const tools = proj.borrowedTools || [];
                                    return isMobile ? (
                                        <Card.Group key={proj.id} itemsPerRow={1} stackable>
                                            {tools.length > 0 ? (
                                                tools.map((y) => (
                                                    <Card key={y.ToolName}>
                                                        <Card.Content>
                                                            <Card.Header>{y.ToolName}</Card.Header>
                                                            <Card.Meta>Serial No: {y.SerialNo}</Card.Meta>
                                                            <Card.Description>
                                                                Borrower: {y.EmployeeName} <br />
                                                                Date Borrowed: {moment(y.DateBorrowed).format("MMM DD, yyyy")} <br />
                                                                Returned: {y.Status === "Returned" ? "✅" : "❌"} <br />
                                                                Date Returned: {y.DateReturned ? moment(y.DateReturned).format("MM/DD/yyyy | h:mm a") : "-"} <br />
                                                                Remarks: {y.Remarks || "-"}
                                                            </Card.Description>
                                                        </Card.Content>
                                                        {y.Status !== "Returned" && (
                                                            <Card.Content extra>
                                                                <Button.Group>
                                                                    <Button basic color="grey" onClick={() => handleEditItem(y)}>
                                                                        <Icon name="edit" /> Edit
                                                                    </Button>
                                                                    <Button basic color="grey" onClick={() => handleOpenReturnModal(y)}>
                                                                        <Icon name="reply" /> Return
                                                                    </Button>
                                                                </Button.Group>
                                                            </Card.Content>
                                                        )}
                                                    </Card>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                                    No tools borrowed.
                                                </div>
                                            )}
                                        </Card.Group>
                                    ) : (
                                        <Table celled color="blue">
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Tool Name</Table.HeaderCell>
                                                    <Table.HeaderCell>Serial No.</Table.HeaderCell>
                                                    <Table.HeaderCell>Borrower</Table.HeaderCell>
                                                    <Table.HeaderCell>Date Borrowed</Table.HeaderCell>
                                                    <Table.HeaderCell style={{ textAlign: "center" }}>Returned</Table.HeaderCell>
                                                    <Table.HeaderCell>Date Returned</Table.HeaderCell>
                                                    <Table.HeaderCell>Remarks</Table.HeaderCell>
                                                    <Table.HeaderCell style={{ textAlign: "center" }}>Action</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {tools.map((y) => (
                                                    <Table.Row key={y.ToolName}>
                                                        <Table.Cell>{y.ToolName}</Table.Cell>
                                                        <Table.Cell>{y.SerialNo}</Table.Cell>
                                                        <Table.Cell>{y.EmployeeName}</Table.Cell>
                                                        <Table.Cell>{moment(y.DateBorrowed).format("MMM DD, yyyy")}</Table.Cell>
                                                        <Table.Cell style={{ textAlign: "center" }}>
                                                            {y.Status === "Returned" ? <Icon color="green" name="checkmark" /> : ""}
                                                        </Table.Cell>
                                                        <Table.Cell>{y.DateReturned ? moment(y.DateReturned).format("MM/DD/yyyy | h:mm a") : ""}</Table.Cell>
                                                        <Table.Cell>{y.Remarks}</Table.Cell>
                                                        <Table.Cell style={{ textAlign: "center" }}>
                                                            {y.Status !== "Returned" && (
                                                                <Button.Group>
                                                                    <Button basic color="grey" onClick={() => handleEditItem(y)}>
                                                                        <Icon name="edit" /> Edit
                                                                    </Button>
                                                                    <Button basic color="grey" onClick={() => handleOpenReturnModal(y)}>
                                                                        <Icon name="reply" /> Return
                                                                    </Button>
                                                                </Button.Group>
                                                            )}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    );
                                })
                        ) : (
                            <h3 style={{ textAlign: "center", marginTop: "20%", color: "#C4C4C4" }}>
                                Select a Project to View Borrowed Tools.
                            </h3>
                        )}
                    </Segment>
                </Grid.Column>
            </Grid>


            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Add New Tool Form</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Project Name'
                            placeholder='project name'
                            id='form-input-project-name'
                            size='medium'
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <label><b>Date</b></label>
                        <input
                            fluid
                            label='Date'
                            placeholder='date'
                            id='form-input-date'
                            size='medium'
                            type='date'
                            value={moment(date).format("yyyy-MM-DD")}
                            onChange={e => setDate(e.target.value)}
                        />

                        <br />

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
                            isClearable
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseAddModal}>
                        Cancel
                    </Button>
                    {!addloader &&
                        <Button onClick={handleAddProject} disabled={addloader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {addloader &&
                        <Button onClick={handleAddProject} disabled={addloader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handleCloseEditModal}
            >
                <Modal.Header>Edit Item</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Project Name'
                            placeholder='project name'
                            id='form-input-project-name'
                            size='medium'
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <label><b>Date</b></label>
                        <input
                            fluid
                            label='Date'
                            placeholder='date'
                            id='form-input-date'
                            size='medium'
                            type='date'
                            value={moment(date).format("yyyy-MM-DD")}
                            onChange={e => setDate(e.target.value)}
                        />

                        <br />

                        <label><strong>Status</strong></label>
                        <Select
                            defaultValue={status}
                            options={StatusOption()}
                            onChange={e => setStatus(e)}
                            placeholder='Status...'
                            isClearable
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleEditProjects} disabled={loader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleEditProjects} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editItem}
                onClose={handleCancelEditItem}
            >
                <Modal.Header>Edit Item</Modal.Header>
                <Modal.Content>
                    <Form>

                        <label><b>Tool</b></label>
                        <Select
                            defaultValue={toolId}
                            options={ToolsOption(toolsOptionsList)}
                            onChange={e => setToolId(e)}
                            placeholder='Borrower...'
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />

                        <br />

                        <label><b>Borrower</b></label>
                        <Select
                            defaultValue={employeeId}
                            options={EmployeesOption(employeeOptionsList)}
                            onChange={e => setEmployeeId(e)}
                            placeholder='Borrower...'
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />

                        <br />

                        <label><b>Date Issued</b></label>
                        <input
                            fluid
                            label='Date Issued'
                            placeholder='date issued'
                            id='form-input-date-issued'
                            size='medium'
                            type='date'
                            value={moment(dateBorrowed).format("yyyy-MM-DD")}
                            onChange={e => setDateBorrowed(e.target.value)}
                        />
                        <br />
                        <br />

                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelEditItem}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleSubmitEditItem} disabled={loader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleSubmitEditItem} disabled={loader}>
                            <Icon loader name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                open={deletePopup}
                onClose={handleCloseDeleteModal}
                size="small"
            >
                <Modal.Header>Warning!</Modal.Header>

                <Modal.Content>Are you sure you want to Delete this form?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    {!loader &&
                        <Button negative onClick={handleDeleteItem} disabled={loader}>
                            <Icon name='trash' />Delete
                        </Button>
                    }
                    {loader &&
                        <Button negative onClick={handleDeleteItem} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                open={returnModal}
                onClose={handleCloseReturnModal}
                size="small"
            >
                <Modal.Header>Return Tool</Modal.Header>

                <Modal.Content>Are you sure you want to Return this tool?</Modal.Content>

                <Modal.Content>
                    <Form>
                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseReturnModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    {!loader &&
                        <Button positive onClick={handleReturnTools} disabled={loader}>
                            <Icon name='reply' /> Return
                        </Button>
                    }
                    {loader &&
                        <Button positive onClick={handleReturnTools} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={borrowModal}
                onClose={handleCloseBorrowModal}
            >
                <Modal.Header>Borrow Tool</Modal.Header>
                <Modal.Content>
                    <Form>

                        <label><b>Tool</b></label>
                        <Select
                            defaultValue={toolId}
                            options={ToolsOption(toolsOptionsList)}
                            onChange={e => setToolId(e)}
                            placeholder='Tool...'
                            // isClearable
                            // isMulti
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />

                        <br />

                        <label><b>Borrower</b></label>
                        <Select
                            defaultValue={employeeId}
                            options={EmployeesOption(employeeOptionsList)}
                            onChange={e => setEmployeeId(e)}
                            placeholder='Borrower...'
                            theme={(theme) => ({
                                ...theme,
                                // borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    text: 'black',
                                    primary25: '#66c0f4',
                                    primary: '#B9B9B9',
                                },
                            })}
                            styles={customSelectStyle}
                        />

                        <br />

                        <label><b>Date Borrowed</b></label>
                        <input
                            fluid
                            label='Date Borrowed'
                            placeholder='date borrowed'
                            id='form-input-date-borrowed'
                            size='medium'
                            type='date'
                            value={moment(dateBorrowed).format("yyyy-MM-DD")}
                            onChange={e => setDateBorrowed(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-remarks'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />

                        <br />
                        <br />

                        <label><b>Processed By:</b> {processedBy}</label>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseBorrowModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleAddTools} disabled={loader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleAddTools} disabled={loader}>
                            <Icon loading name='spinner' /> 
                        </Button>
                    }
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Projects;
