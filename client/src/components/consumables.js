import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Card, Icon, Pagination, Table, Label } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useMediaQuery } from 'react-responsive';
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

const Consumables = () => {
    const [consumablesData, setConsumablesData] = useState(null);
    const [consumablesOptions, setConsumablesOptions] = useState(null);
    const [selectedConsumables, setSelectedConsumables] = useState([]);
    const [loader, setLoader] = useState(false);
    const [id, setId] = useState(-1);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [unit, setUnit] = useState([]);
    const [datePurchased, setDatePurchased] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [used, setUsed] = useState(0);
    const [critLevel, setCritLevel] = useState(0);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [itemPage, setItemPage] = useState(1);
    const [allConsumables, setAllConsumables] = useState([]);


    const boundaryRange = 1;
    const siblingRange = 1;
    const showEllipsis = true;
    const showFirstAndLastNav = true;
    const showPreviousAndNextNav = true;

    useEffect(() => {
        var data = {
            selectedConsumables: !selectedConsumables ? [] : selectedConsumables,
            page: itemPage
        };
        var route = "consumables/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setConsumablesData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setConsumablesData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedConsumables, loader, itemPage]);

    const consumablesList = consumablesData
        ? consumablesData.map((x) => ({
            id: x._id,
            name: x.Name,
            brand: x.Brand,
            unit: x.Unit,
            datePurchased: x.DatePurchased,
            description: x.Description,
            quantity: x.Quantity,
            used: x.Used,
            critLevel: x.CritLevel,
            critLevelIndicator: x.CritLevelIndicator,
        }))
        : [];

    useEffect(() => {
        var route = "consumables/total-item";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");
        axios
            .get(url)
            .then(function (response) {
                // handle success
                var total = response.data !== "" ? response.data : 0;
                setTotalItem(total);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [consumablesOptions, selectedConsumables, loader]);

    useEffect(() => {
        var route = "consumables/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setConsumablesOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setConsumablesOptions(obj);
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

    const consumablesOptionsList = consumablesOptions
        ? consumablesOptions.map((x) => ({
            id: x._id,
            name: x.Name,
        }))
        : [];

    function ConsumablesOption(item) {
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

    const handleAddConsumables = () => {
        var route = "consumables/";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            name: name,
            brand: brand,
            unit: unit.length !== 0 ? unit.value : "",
            datePurchased: datePurchased,
            description: description,
            quantity: quantity,
            used: used,
            critLevel: critLevel
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
                toast.success(response.data.consumable + ' successfully edited.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                setBrand("");
                setUnit([]);
                setDatePurchased("");
                setDescription("");
                setQuantity(0);
                setUsed(0);
                setCritLevel(0);
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
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);;
    }

    const handleEditConsumables = () => {
        var route = `consumables/${id}`;
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        var data = {
            Name: name,
            Brand: brand,
            Unit: unit.length !== 0 ? unit.value : "",
            DatePurchased: datePurchased,
            Description: description,
            Quantity: quantity,
            Used: used,
            CriticalLevel: critLevel
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
                toast.success(response.data.consumable + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setName("");
                setBrand("");
                setUnit(null);
                setDatePurchased("");
                setDescription("");
                setQuantity(0);
                setUsed(0);
                setCritLevel(0);
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
        var u = params.unit !== "" ? { label: params.unit, value: params.unit } : []
        setEditModal(true);
        setId(params.id);
        setName(params.name);
        setBrand(params.brand);
        setUnit(u);
        setDatePurchased(params.datePurchased);
        setDescription(params.description);
        setQuantity(params.quantity);
        setUsed(params.used);
        setCritLevel(params.critLevel);
    }

    const handleCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);
        setCritLevel(0);
    }

    const handleDeleteItem = () => {
        var url = window.apihost + `consumables/${id}`;
        var token = sessionStorage.getItem("auth-token");
        setLoader(true);
        axios
            .delete(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    alert('Tool successfuly deleted!');
                    toast.success('Item successfully deleted!', {
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
                    toast.success(err.response.data, {
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
        setName("");
        setBrand("");
        setUnit(null);
        setDatePurchased("");
        setDescription("");
        setQuantity(0);
        setUsed(0);
    }

    function UnitOption() {
        var list = [
            { value: "Pieces", label: "Pieces" },
            { value: "Box", label: "Box" },
            { value: "Sets", label: "Sets" },
            { value: "Unit", label: "Unit" },
            { value: "Meters", label: "Meters" },
            { value: "Litters", label: "Litters" },
            { value: "Package", label: "Package" },
            { value: "Kilogram", label: "Kilogram" },
            { value: "Miligram", label: "Miligram" },
            { value: "Gallon", label: "Gallon" },
        ];
        return list;
    }

    const exportToPDF = () => {
        var url = window.apihost + "consumables/list-of-all-consumables";
        var token = sessionStorage.getItem("auth-token");
        var data = [];
        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setAllConsumables(response.data);
                    const document = {
                        content: [
                            { image: 'unimore', width: 195, height: 70 },
                            {
                                columns: [
                                    [
                                        { text: "List of Consumables", fontSize: 15, bold: true, lineHeight: 1 },
                                    ],
                                    [
                                        { text: "Date: " + moment().format("MMM DD, yyyy"), fontSize: 15, bold: true, lineHeight: 1, },
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
                            widths: [80, 35, 40, 40, 30, 40, 70, 40, 50],
                            body: [
                                //Data
                                //Header
                                [
                                    { text: 'Name', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Brand', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Unit', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Total Item Received', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Used', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Total Available', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Date Purchased', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Status', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Description', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                ],
                            ]
                        },
                    });

                    response.data.forEach(y => {
                        document.content.push({
                            // layout: 'lightHorizontalLines',
                            table: {
                                headerRows: 1,
                                widths: [80, 35, 40, 40, 30, 40, 70, 40, 50],
                                body: [
                                    //Data
                                    [
                                        { text: y.Name, fontSize: 7, alignment: "left", },
                                        { text: y.Brand, fontSize: 7, alignment: "left", },
                                        { text: y.Unit, fontSize: 7, alignment: "left", },
                                        { text: y.Quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "left", },
                                        { text: y.Used.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "center" },
                                        { text: (y.Quantity - y.Used).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "center", },
                                        { text: y.datePurchased ? moment(y.datePurchased).format("MM/DD/yyyy") : "No Date", fontSize: 7, alignment: "center", },
                                        { text: y.CritLevelIndicator === false ? "Good" : "Low of Stocks", fontSize: 7, alignment: "center", color: y.CritLevelIndicator === false ? "green" : "orange" },
                                        { text: y.Description, fontSize: 7, alignment: "left" },
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
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setAllConsumables(obj);
                    const document = {
                        content: [
                            { image: 'unimore', width: 195, height: 70 },
                            {
                                columns: [
                                    [
                                        { text: "List of Consumables", fontSize: 15, bold: true, lineHeight: 1 },
                                    ],
                                    [
                                        { text: "Date: " + moment().format("MMM DD, yyyy"), fontSize: 15, bold: true, lineHeight: 1, },
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
                            widths: [80, 35, 40, 40, 30, 40, 70, 40, 50],
                            body: [
                                //Data
                                //Header
                                [
                                    { text: 'Name', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Brand', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Unit', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Total Item Received', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Used', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Total Available', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Date Purchased', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Status', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                    { text: 'Description', bold: true, fontSize: 9, alignment: "center", fillColor: '#C8C9CA' },
                                ],
                            ]
                        },
                    });

                    obj.forEach(y => {
                        document.content.push({
                            // layout: 'lightHorizontalLines',
                            table: {
                                headerRows: 1,
                                widths: [80, 35, 40, 40, 30, 40, 70, 40, 50],
                                body: [
                                    //Data
                                    [
                                        { text: y.Name, fontSize: 7, alignment: "left", },
                                        { text: y.Brand, fontSize: 7, alignment: "left", },
                                        { text: y.Unit, fontSize: 7, alignment: "left", },
                                        { text: y.Quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "left", },
                                        { text: y.Used.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "center" },
                                        { text: (y.Quantity - y.Used).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 7, alignment: "center", },
                                        { text: y.datePurchased ? moment(y.datePurchased).format("MM/DD/yyyy") : "No Date", fontSize: 7, alignment: "center", },
                                        { text: y.CritLevelIndicator === false ? "Good" : "Low of Stocks", fontSize: 7, alignment: "center", color: y.CritLevelIndicator === false ? "green" : "orange" },
                                        { text: y.Description, fontSize: 7, alignment: "left" },
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
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (
        <div>
            <ToastContainer />

            {/* Top Controls */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                    gap: 10,
                }}
            >
                <Button size="large" onClick={() => setAddModal(true)}>
                    <Icon name="plus" /> Add Item
                </Button>

                <div style={{ flex: '1 1 300px', minWidth: 200 }}>
                    <Select
                        defaultValue={selectedConsumables}
                        options={ConsumablesOption(consumablesOptionsList)}
                        onChange={(e) => setSelectedConsumables(e)}
                        placeholder="Search..."
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

                <Button size="large" onClick={() => exportToPDF()}>
                    <Icon name="file pdf" /> Export to PDF
                </Button>
            </div>

            <div style={{ width: '100%', maxHeight: '78vh', overflowY: 'auto' }}>
                {isMobile ? (
                    // Mobile view: show cards instead of table
                    consumablesList && consumablesList.length > 0 ? (
                        consumablesList.map((x) => (
                            <div
                                key={x.id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    background: 'white',
                                }}
                            >
                                <div><strong>Name:</strong> {x.name}</div>
                                <div><strong>Brand:</strong> {x.brand || 'No Brand'}</div>
                                <div><strong>Unit:</strong> {x.unit}</div>
                                <div><strong>Total Item Received:</strong> {x.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                                <div><strong>Used:</strong> {x.used.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                                <div><strong>Total Available:</strong> {(x.quantity - x.used).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                                <div><strong>Date Purchased:</strong> {x.datePurchased ? moment(x.datePurchased).format('MM/DD/yyyy') : 'No Date'}</div>
                                <div><strong>Crit Value:</strong> {x.critLevel}</div>
                                <div>
                                    <strong>Status:</strong>{' '}
                                    {(x.quantity - x.used) > 0 ? (
                                        <Label color={x.critLevelIndicator === false ? 'green' : 'orange'} horizontal>
                                            {x.critLevelIndicator === false ? 'Good' : 'Low of Stocks'}
                                        </Label>
                                    ) : (
                                        <Label color="red" horizontal>
                                            Out of Stocks
                                        </Label>
                                    )}
                                </div>
                                <div><strong>Description:</strong> {x.description}</div>
                                <div style={{ marginTop: 12, textAlign: 'center' }}>
                                    <Button basic color="grey" onClick={() => handleOpenEditModal(x)} style={{ marginRight: 8 }}>
                                        Edit
                                    </Button>
                                    <Button basic color="grey" onClick={() => handleOpenDeletePopup(x.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: 50, color: '#C4C4C4' }}>
                            No data found!
                        </div>
                    )
                ) : (
                    // Desktop/tablet view: show table as before
                    <Table celled structured size="large" color="blue">
                        <Table.Header style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                            <Table.Row>
                                <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Brand</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Unit</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Total Item Received</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Used</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Total Available</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Date Purchased</Table.HeaderCell>
                                <Table.HeaderCell colSpan="2" style={{ textAlign: 'center', zIndex: 2 }}>
                                    Critical Level
                                </Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2">Description</Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2" style={{ textAlign: 'center', zIndex: 2 }}>
                                    Action
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell rowSpan="2" style={{ zIndex: 2 }}>
                                    Crit Value
                                </Table.HeaderCell>
                                <Table.HeaderCell rowSpan="2" style={{ zIndex: 2 }}>
                                    Status
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {consumablesList &&
                                consumablesList.map((x) => (
                                    <Table.Row key={x.id}>
                                        <Table.Cell>{x.name}</Table.Cell>
                                        <Table.Cell>{x.brand || 'No Brand'}</Table.Cell>
                                        <Table.Cell>{x.unit}</Table.Cell>
                                        <Table.Cell>{x.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Table.Cell>
                                        <Table.Cell>{x.used.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Table.Cell>
                                        <Table.Cell>{(x.quantity - x.used).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Table.Cell>
                                        <Table.Cell>{x.datePurchased ? moment(x.datePurchased).format('MM/DD/yyyy') : 'No Date'}</Table.Cell>
                                        <Table.Cell>{x.critLevel}</Table.Cell>
                                        <Table.Cell
                                            positive={x.critLevelIndicator === false}
                                            negative={x.critLevelIndicator}
                                            style={{ textAlign: 'center' }}
                                        >
                                            {(x.quantity - x.used) > 0 ? (
                                                <Label color={x.critLevelIndicator === false ? 'green' : 'orange'} horizontal>
                                                    {x.critLevelIndicator === false ? 'Good' : 'Low of Stocks'}
                                                </Label>
                                            ) : (
                                                <Label color="red" horizontal>
                                                    Out of Stocks
                                                </Label>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{x.description}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <div className="ui two buttons">
                                                <Button basic color="grey" onClick={() => handleOpenEditModal(x)}>
                                                    Edit
                                                </Button>
                                                <Button basic color="grey" onClick={() => handleOpenDeletePopup(x.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                )}

                {(!consumablesList || consumablesList.length === 0) && !loader && (
                    <div style={{ textAlign: 'center', padding: 120 }}>
                        <h1 style={{ color: '#C4C4C4' }}>No data found!</h1>
                    </div>
                )}
                {loader && (
                    <div style={{ margin: '0 auto', textAlign: 'center' }}>
                        <Icon loading name="spinner" size="huge" style={{ color: '#C4C4C4', marginTop: 50 }} />
                    </div>
                )}
            </div>

            {/* Pagination */}
            {Object.keys(selectedConsumables).length === 0 && (
                <Pagination
                    activePage={itemPage}
                    boundaryRange={boundaryRange}
                    onPageChange={(e, { activePage }) => setItemPage(activePage)}
                    size="mini"
                    siblingRange={siblingRange}
                    totalPages={totalItem / 12}
                    ellipsisItem={showEllipsis ? undefined : null}
                    firstItem={showFirstAndLastNav ? undefined : null}
                    lastItem={showFirstAndLastNav ? undefined : null}
                    prevItem={showPreviousAndNextNav ? undefined : null}
                    nextItem={showPreviousAndNextNav ? undefined : null}
                    style={{ float: 'right', marginTop: 10 }}
                />
            )}

            <Modal
                size="mini"
                open={addModal}
                onClose={handleCloseAddModal}
            >
                <Modal.Header>Add New Item</Modal.Header>
                <Modal.Content>
                    <Form>

                        <Form.Input
                            fluid
                            label='Name'
                            placeholder='Name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Unit</strong></label>
                        <Select
                            defaultValue={unit}
                            options={UnitOption()}
                            onChange={e => setUnit(e)}
                            placeholder='Unit...'
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

                        <label><b>Date Purchased</b></label>
                        <input
                            fluid
                            label='Date Purchased'
                            placeholder='date purchased'
                            id='form-input-date-purchased'
                            size='medium'
                            type='date'
                            value={moment(datePurchased).format("yyyy-MM-DD")}
                            onChange={e => setDatePurchased(e.target.value)}
                        />

                        <br />
                        <br />

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Quantity'
                            placeholder='quantity'
                            id='form-input-quantity'
                            type="number"
                            size='medium'
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Critical Level'
                            placeholder='critical level'
                            id='form-input-criticallevel'
                            type="number"
                            size='medium'
                            min="0"
                            value={critLevel}
                            onChange={e => setCritLevel(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseAddModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleAddConsumables} disabled={loader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleAddConsumables} disabled={loader}>
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
                            label='Name'
                            placeholder='name'
                            id='form-input-name'
                            size='medium'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Brand'
                            placeholder='brand'
                            id='form-input-brand'
                            size='medium'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />

                        <label><strong>Unit</strong></label>
                        <Select
                            defaultValue={unit}
                            options={UnitOption()}
                            onChange={e => setUnit(e)}
                            placeholder='Unit...'
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

                        <label><b>Date Purchased</b></label>
                        <input
                            fluid
                            label='Date Purchased'
                            placeholder='date purchased'
                            id='form-input-date-purchased'
                            size='medium'
                            type='date'
                            value={moment(datePurchased).format("yyyy-MM-DD")}
                            onChange={e => setDatePurchased(e.target.value)}
                        />

                        <br />
                        <br />

                        <Form.Input
                            fluid
                            label='Description'
                            placeholder='description'
                            id='form-input-description'
                            size='medium'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Quantity'
                            placeholder='quantity'
                            id='form-input-quantity'
                            type="number"
                            size='medium'
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Used'
                            placeholder='used'
                            id='form-input-used'
                            type="number"
                            size='medium'
                            min="0"
                            value={used}
                            onChange={e => setUsed(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Critical Level'
                            placeholder='critical level'
                            id='form-input-criticallevel'
                            type="number"
                            size='medium'
                            min="0"
                            value={critLevel}
                            onChange={e => setCritLevel(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleEditConsumables} disabled={loader}>
                            <Icon name='save' />Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleEditConsumables} disabled={loader}>
                            <Icon loading name='spinner' />
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

                <Modal.Content>Are you sure you want to Delete this Item?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    {!loader &&
                    <Button negative onClick={handleDeleteItem} disabled={loader}>
                        <Icon name='trash' /> Delete
                    </Button>
}
                    {loader &&
                    <Button negative onClick={handleDeleteItem} disabled={loader}>
                        <Icon loading name='spinner' />
                    </Button>
}
                </Modal.Actions>
            </Modal>
        </div >
    );
}

export default Consumables;
