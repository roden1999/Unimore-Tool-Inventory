import React, { useState, useEffect } from 'react'
import { Modal, Form, Label, Button, Table, Icon, Pagination } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import moment from 'moment';

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

const Records = () => {
    const [recordData, setRecordData] = useState(null);
    const [returnedRecordData, setReturnedRecordData] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [loader, setLoader] = useState(false);
    const [id, setId] = useState(-1);
    const [toolData, setToolData] = useState([]);
    const [toolDataSt, setToolDataSt] = useState([]);
    const [toolId, setToolId] = useState("");
    const [empData, setEmpData] = useState(null);
    const [employeeId, setEmployeeId] = useState([]);
    const [dateBorrowed, setDateBorrowed] = useState(moment());
    const [projectData, setProjectData] = useState("");
    const [project, setProject] = useState([]);
    const [dateReturned, setDateReturned] = useState("");
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [processedBy, setProcessedBy] = useState("");
    const [receivedBy, setReceivedBy] = useState("");
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [searchTool, setSearchTool] = useState([]);
    const [totalBorrowed, setTotalBorrowed] = useState(0);
    const [borrowedPage, setBorrowedPage] = useState(1);
    const [totalReturned, setTotalReturned] = useState(0);
    const [returnedPage, setReturnedPage] = useState(1);

    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            searchTool: !searchTool ? [] : searchTool,
            page: borrowedPage
        };
        var route = "records/list-borrowed";
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
                    setRecordData(response.data);
                    setProcessedBy(user.Name)
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setRecordData(obj);
                    setProcessedBy(user.Name)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedRecord, searchTool, borrowedPage, loader]);

    const recordsList = recordData
        ? recordData.map((x) => ({
            id: x._id,
            serialNo: x.SerialNo,
            toolName: x.ToolName,
            employeeNo: x.EmployeeNo,
            employeeName: x.EmployeeName,
            dateBorrowed: x.DateBorrowed,
            project: x.Project,
            processedBy: x.ProcessedBy,
            status: x.Status,
            remarks: x.Remarks
        }))
        : [];

    useEffect(() => {
        var route = "records/total-borrowed";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalBorrowed(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [searchTool, selectedRecord, loader]);

    useEffect(() => {
        var route = "records/total-returned";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalReturned(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [searchTool, selectedRecord, loader]);

    useEffect(() => {
        var data = {
            searchTool: !searchTool ? [] : searchTool,
            page: returnedPage
        };
        var route = "records/list-returned";
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
                    setReturnedRecordData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setReturnedRecordData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedRecord, searchTool, returnedPage, loader]);

    const returnedRecordsList = returnedRecordData
        ? returnedRecordData.map((x) => ({
            id: x._id,
            serialNo: x.SerialNo,
            toolName: x.ToolName,
            employeeNo: x.EmployeeNo,
            employeeName: x.EmployeeName,
            dateBorrowed: x.DateBorrowed,
            project: x.Project,
            dateReturned: x.DateReturned,
            processedBy: x.ProcessedBy,
            receivedBy: x.ReceivedBy,
            status: x.Status,
            remarks: x.Remarks
        }))
        : [];

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

    useEffect(() => {
        var route = "tools/search-options-st";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setToolDataSt(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setToolDataSt(obj);
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

    const toolsOptionsListSt = toolDataSt
        ? toolDataSt.map((x) => ({
            id: x._id,
            name: x.Name,
            serialNo: x.SerialNo
        }))
        : [];

    function ToolsOptionSt(item) {
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
                    setProjectData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setProjectData(obj);
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

    const projectOptionsList = projectData
        ? projectData.map((x) => ({
            id: x._id,
            name: x.ProjectName + " - (" + moment(x.Date).format("MM-DD-yyyy") + ")",
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

    const handleAddTools = () => {
        var route = "records/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var proj = !project ? [] : project;

        var data = {
            toolId: toolId.length !== 0 ? toolId.value : "",
            employeeId: employeeId.length !== 0 ? employeeId.value : "",
            dateBorrowed: dateBorrowed,
            project: proj.length !== 0 ? proj.value : "",
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
                toast.success(response.data.record + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setToolId("");
                setEmployeeId("");
                setDateBorrowed(moment());
                setProject("");
                setDateReturned("");
                setStatus("");
                // setProcessedBy("");
                setReceivedBy("");
                setRemarks("");
            })
            .catch(function (error) {
                // handle error
                toast.error(error.response.data, {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleCloseAddModal = () => {
        setAddModal(false);
        setId(-1);
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setProject("");
        setDateReturned("");
        setStatus("");
        // setProcessedBy("");
        setReceivedBy("");
        setRemarks("");
    }

    const handleEditTools = () => {
        var route = `records/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            toolId: toolId,
            employeeId: employeeId,
            dateBorrowed: dateBorrowed,
            project: project,
            dateReturned: "",
            status: "Borrowed",
            processedBy: "",
            receivedBy: "",
            remarks: remarks
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
                toast.success(response.data.record + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setToolId("");
                setEmployeeId("");
                setDateBorrowed(moment());
                setProject("");
                setDateReturned("");
                setStatus("");
                setProcessedBy("");
                setReceivedBy("");
                setRemarks("");
            })
            .catch(function (error) {
                // handle error
                toast.error(error.response.data, {
                    position: "top-center"
                });
                setLoader(false);
            })
            .finally(function () {
                // always executed
            });
    }

    const handleOpenEditModal = (params) => {
        setEditModal(true);
        setId(params.id);
        setToolId(params.toolId);
        setEmployeeId(params.employeeId);
        setDateBorrowed(moment(params.dateBorrowed));
        setProject(params.project);
        setDateReturned(params.dateReturned);
        setStatus(params.status);
        setProcessedBy(params.processedBy);
        setReceivedBy(params.receivedBy);
        setRemarks(params.remarks);
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setProject("");
        setDateReturned("");
        setStatus("");
        // setProcessedBy("");
        setReceivedBy("");
        setRemarks("");
    }

    const handleDeleteEmployee = () => {
        var url = window.apihost + `records/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('Tool successfully deleted!', {
                        position: "top-center"
                    });
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
                    toast.error(error.response.data, {
                        position: "top-center"
                    });
                    setLoader(false);
                } else {
                    // alert(err.response.status + JSON.stringify(err.response.data));
                    const error = {
                        status: err.response.status,
                        error: JSON.stringify(err.response.data),
                    };
                    alert(JSON.stringify(error));
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
        setToolId("");
        setEmployeeId("");
        setDateBorrowed(moment());
        setProject("");
        setDateReturned("");
        setStatus("");
        // setProcessedBy("");
        setReceivedBy("");
        setRemarks("");
    }

    const handleOpenReturnModal = (params) => {
        setReturnModal(true);
        setId(params.id);
        setRemarks(params.remarks);
    }

    const handleCloseReturnModal = () => {
        setReturnModal(false);
        setEmployeeId("");
        setDateBorrowed(moment());
    }

    const handleReturnTools = () => {
        var route = `records/${id}`;
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

    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (
        <div>
            <ToastContainer />
            <Button size="large" style={{ float: 'left' }} onClick={() => setAddModal(true)}>
                <Icon name='plus' />Borrow Tool
            </Button>

            <div style={{ float: 'right', width: isMobile ? '100%' : '30%', zIndex: 100, marginTop: isMobile ? 20 : 0 }}>
                <Select
                    defaultValue={searchTool}
                    options={ToolsOption(toolsOptionsList)}
                    onChange={e => setSearchTool(e)}
                    placeholder='Search...'
                    isClearable
                    isMulti
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            text: 'black',
                            primary25: '#66c0f4',
                            primary: '#B9B9B9',
                        },
                    })}
                    styles={customMultiSelectStyle}
                />
            </div>

            <div style={{ paddingTop: 50 }}>
                <h3 style={{ textAlign: 'left' }}>
                    <Label color="grey"><h4>Borrowed</h4></Label>
                </h3>

                <div style={{ overflowY: 'auto', width: '100%', height: '100%', minHeight: '30vh', maxHeight: '30vh', backgroundColor: '#EEEEEE', padding: isMobile ? 10 : 0 }}>
                    {isMobile ? (
                        // Mobile: Cards view
                        recordsList && recordsList.length > 0 ? (
                            recordsList.map((x) => (
                                <div
                                    key={x.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: 8,
                                        padding: 16,
                                        marginBottom: 16,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        fontSize: 14,
                                    }}
                                >
                                    <div><strong>Tool Name:</strong> {x.toolName}</div>
                                    <div><strong>Tool SN:</strong> {x.serialNo}</div>
                                    <div><strong>Borrower:</strong> {x.employeeName}</div>
                                    <div><strong>Date Borrowed:</strong> {x.dateBorrowed ? moment(x.dateBorrowed).format("MMMM DD, yyyy") : ''}</div>
                                    <div><strong>Project:</strong> {x.project}</div>
                                    <div><strong>Processed By:</strong> {x.processedBy}</div>
                                    <div>
                                        <strong>Status:</strong>{' '}
                                        <Label color='blue' horizontal>
                                            <Icon color='white' name='checkmark' size='large' />{x.status}
                                        </Label>
                                    </div>
                                    <div><strong>Remarks:</strong> {x.remarks}</div>
                                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                                        <Button.Group fluid>
                                            <Button basic color="grey" onClick={() => handleOpenDeletePopup(x.id)}>
                                                <Icon color='white' name='delete' /> Delete
                                            </Button>
                                            <Button basic color="grey" onClick={() => handleOpenReturnModal(x)}>
                                                <Icon color='white' name='reply' /> Return
                                            </Button>
                                        </Button.Group>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ margin: '0 auto', textAlign: 'center', color: '#C4C4C4', paddingTop: 50 }}>
                                No data found.
                            </div>
                        )
                    ) : (
                        // Desktop/tablet: Table view
                        <Table celled color="blue">
                            <Table.Header style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                <Table.Row>
                                    <Table.HeaderCell rowSpan='2'>Tool Name</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Tool SN.</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Borrower</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Date Borrowed</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Project</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Processed By</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Status</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Remarks</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            {recordsList !== null && loader !== true && recordsList.map(x =>
                                <Table.Body key={x.id}>
                                    <Table.Row>
                                        <Table.Cell>{x.toolName}</Table.Cell>
                                        <Table.Cell>{x.serialNo}</Table.Cell>
                                        <Table.Cell>{x.employeeName}</Table.Cell>
                                        <Table.Cell>{x.dateBorrowed ? moment(x.dateBorrowed).format("MMMM DD, yyyy") : ""}</Table.Cell>
                                        <Table.Cell>{x.project}</Table.Cell>
                                        <Table.Cell>{x.processedBy}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Label color='blue' horizontal>
                                                <Icon color='white' name='checkmark' size='large' />{x.status}
                                            </Label>
                                        </Table.Cell>
                                        <Table.Cell>{x.remarks}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Button.Group>
                                                <Button basic color="grey" onClick={() => handleOpenDeletePopup(x.id)}>
                                                    <Icon color='white' name='delete' />Delete
                                                </Button>
                                                <Button basic color="grey" onClick={() => handleOpenReturnModal(x)}>
                                                    <Icon color='white' name='reply' />Return
                                                </Button>
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )}

                        </Table>
                    )}

                    {(recordsList === null || recordsList.length === 0) && loader !== true && !isMobile && (
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <h1 style={{ color: '#C4C4C4', marginTop: 50 }}>No data found.</h1>
                        </div>
                    )}

                    {loader === true && (
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                        </div>
                    )}
                </div>

                {Object.keys(selectedRecord).length === 0 && (
                    <Pagination
                        activePage={borrowedPage}
                        boundaryRange={boundaryRange}
                        onPageChange={(e, { activePage }) => setBorrowedPage(activePage)}
                        size='mini'
                        siblingRange={siblingRange}
                        totalPages={totalBorrowed / 12}
                        ellipsisItem={showEllipsis ? undefined : null}
                        firstItem={showFirstAndLastNav ? undefined : null}
                        lastItem={showFirstAndLastNav ? undefined : null}
                        prevItem={showPreviousAndNextNav ? undefined : null}
                        nextItem={showPreviousAndNextNav ? undefined : null}
                        style={{ float: 'right', marginTop: 10 }}
                    />
                )}
            </div>

            <div style={{ paddingTop: 50 }}>
                <h3 style={{ textAlign: 'left' }}>
                    <Label color="grey"><h4>Returned</h4></Label>
                </h3>

                <div
                    style={{
                        overflowY: 'auto',
                        width: '100%',
                        height: '100%',
                        minHeight: '30vh',
                        maxHeight: '30vh',
                        backgroundColor: '#EEEEEE',
                        padding: isMobile ? 10 : 0,
                    }}
                >
                    {isMobile ? (
                        // Mobile: Cards
                        returnedRecordsList && returnedRecordsList.length > 0 ? (
                            returnedRecordsList.map((x) => (
                                <div
                                    key={x.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: 8,
                                        padding: 16,
                                        marginBottom: 16,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        fontSize: 14,
                                    }}
                                >
                                    <div><strong>Tool Name:</strong> {x.toolName}</div>
                                    <div><strong>Tool SN:</strong> {x.serialNo}</div>
                                    <div><strong>Borrower:</strong> {x.employeeName}</div>
                                    <div><strong>Date Borrowed:</strong> {x.dateBorrowed ? moment(x.dateBorrowed).format("MMMM DD, yyyy") : ''}</div>
                                    <div><strong>Processed By:</strong> {x.processedBy}</div>
                                    <div><strong>Date Returned:</strong> {x.dateReturned ? moment(x.dateReturned).format("MMMM DD, yyyy | HH:mm a") : ''}</div>
                                    <div><strong>Received By:</strong> {x.receivedBy}</div>
                                    <div>
                                        <strong>Status:</strong>{' '}
                                        <Label color='green' horizontal>
                                            <Icon color='white' name='checkmark' size='large' />{x.status}
                                        </Label>
                                    </div>
                                    <div><strong>Remarks:</strong> {x.remarks}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ margin: '0 auto', textAlign: 'center', color: '#C4C4C4', paddingTop: 50 }}>
                                No data found.
                            </div>
                        )
                    ) : (
                        // Desktop/tablet: Table view
                        <Table celled role="grid" aria-labelledby="header" color="green">
                            <Table.Header style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                <Table.Row>
                                    <Table.HeaderCell rowSpan='2'>Tool Name</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Tool SN.</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Borrower</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Date Borrowed</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Processed By</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Date Returned</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Received By</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Status</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>Remarks</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {returnedRecordsList !== null &&
                                    loader !== true &&
                                    returnedRecordsList.map((x) => (
                                        <Table.Row key={x.id}>
                                            <Table.Cell>{x.toolName}</Table.Cell>
                                            <Table.Cell>{x.serialNo}</Table.Cell>
                                            <Table.Cell>{x.employeeName}</Table.Cell>
                                            <Table.Cell>{x.dateBorrowed ? moment(x.dateBorrowed).format("MMMM DD, yyyy") : ""}</Table.Cell>
                                            <Table.Cell>{x.processedBy}</Table.Cell>
                                            <Table.Cell>{x.dateReturned ? moment(x.dateReturned).format("MMMM DD, yyyy | HH:mm a") : ""}</Table.Cell>
                                            <Table.Cell>{x.receivedBy}</Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                <Label color='green' horizontal>
                                                    <Icon color='white' name='checkmark' size='large' />{x.status}
                                                </Label>
                                            </Table.Cell>
                                            <Table.Cell>{x.remarks}</Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    )}

                    {(returnedRecordsList === null || returnedRecordsList.length === 0) && loader !== true && !isMobile && (
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <h1 style={{ color: '#C4C4C4', marginTop: 50 }}>No data found.</h1>
                        </div>
                    )}

                    {loader === true && (
                        <div style={{ margin: '0 auto', textAlign: 'center' }}>
                            <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                        </div>
                    )}
                </div>

                {Object.keys(selectedRecord).length === 0 && (
                    <Pagination
                        activePage={returnedPage}
                        boundaryRange={boundaryRange}
                        onPageChange={(e, { activePage }) => setReturnedPage(activePage)}
                        size='mini'
                        siblingRange={siblingRange}
                        totalPages={totalReturned / 12}
                        ellipsisItem={showEllipsis ? undefined : null}
                        firstItem={showFirstAndLastNav ? undefined : null}
                        lastItem={showFirstAndLastNav ? undefined : null}
                        prevItem={showPreviousAndNextNav ? undefined : null}
                        nextItem={showPreviousAndNextNav ? undefined : null}
                        style={{ float: 'right', marginTop: 10 }}
                    />
                )}
            </div>

            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Borrow Tool</Modal.Header>
                <Modal.Content>
                    <Form>

                        <label><b>Tool</b></label>
                        <Select
                            defaultValue={toolId}
                            options={ToolsOptionSt(toolsOptionsListSt)}
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

                        <label><b>Project</b></label>
                        <Select
                            defaultValue={project}
                            options={ProjectsOption(projectOptionsList)}
                            onChange={e => setProject(e)}
                            placeholder='Project...'
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

                        <br />

                        <label><b>Remarks</b></label>
                        <input
                            fluid
                            label='Remarks'
                            placeholder='remarks'
                            id='form-input-date-borrowed'
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
                    <Button onClick={handleCloseAddModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddTools}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handleCloseEditModal}
            >
                <Modal.Header>Edit Tool</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Tool'
                            placeholder='tool'
                            id='form-input-tool'
                            size='medium'
                            value={toolId}
                            onChange={e => setToolId(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Borrower'
                            placeholder='borrower'
                            id='form-input-borrower'
                            size='medium'
                            value={employeeId}
                            onChange={e => setEmployeeId(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Date Borrowed'
                            placeholder='date borrowed'
                            id='form-input-date-borrowed'
                            size='medium'
                            type='date'
                            value={dateBorrowed}
                            onChange={e => setDateBorrowed(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Remarks'
                            placeholder='Remarks'
                            id='form-input-date-borrowed'
                            size='medium'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                        />

                        <br />

                        <label><b>Processed By:</b> {processedBy}</label>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditTools}>
                        <Icon name='save' />Submit
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal
                open={deletePopup}
                onClose={handleCloseDeleteModal}
                size="small"
            >
                <Modal.Header>Warning!</Modal.Header>

                <Modal.Content>Are you sure you want to Delete this Record?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    <Button negative onClick={handleDeleteEmployee}>
                        <Icon name='trash' />Delete
                    </Button>
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
                    <label><b>Remarks</b></label>
                    <input
                        fluid
                        label='Remarks'
                        placeholder='remarks'
                        id='form-input-date-borrowed'
                        size='medium'
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseReturnModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    <Button positive onClick={handleReturnTools}>
                        <Icon name='reply' />Return
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Records;
