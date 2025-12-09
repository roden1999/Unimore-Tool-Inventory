import React, { useState, useEffect } from 'react'
import { Modal, Button, Card, Icon, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const axios = require("axios");

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
        // color: state.isSelected ? 'white' : 'black',
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

const Users = () => {
    const [usersData, setUsersData] = useState(null);
    const [selectedUser, setSelectedUser] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [loader, setLoader] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [changePassModal, setChangePassModal] = useState(false);
    const [id, setId] = useState(-1);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState([]);
    const [deletePopup, setDeletePopup] = useState(false);

    useEffect(() => {
        var data = selectedUser;
        var route = "users/list";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .post(url, data, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setUsersData(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setUsersData(obj);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, [selectedUser, loader]);

    const usersList = usersData
        ? usersData.map((x) => ({
            id: x._id,
            userName: x.UserName,
            name: x.Name,
            role: x.Role,
        }))
        : [];

    useEffect(() => {
        var route = "users/search-options";
        var url = window.apihost + route;
        var token = sessionStorage.getItem("auth-token");

        axios
            .get(url, {
                headers: { "auth-token": token },
            })
            .then(function (response) {
                // handle success
                if (Array.isArray(response.data)) {
                    setUserOptions(response.data);
                } else {
                    var obj = [];
                    obj.push(response.data);
                    setUserOptions(obj);
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

    const usersOptionsList = userOptions
        ? userOptions.map((x) => ({
            id: x._id,
            userName: x.UserName,
        }))
        : [];

    function UsersOption(item) {
        var list = [];
        if (item !== undefined || item !== null) {
            item.map((x) => {
                var name = x.userName;
                return list.push({
                    label: name,
                    value: x.id,
                });
            });
        }
        return list;
    }

    function RoleOption() {
        var list = [];
        var item = [
            { role: "Administrator", key: "Administrator" },
            { role: "Tool Keeper", key: "Tool Keeper" },
            { role: "Maintenance", key: "Maintenance" }
        ]
        if (item !== undefined || item !== null) {
            item.map((x) => {
                return list.push({
                    label: x.role,
                    value: x.key,
                });
            });
        }
        return list;
    }

    const handleAddUser = () => {
        var route = "users/";
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");

        var data = {
            userName: userName,
            password: password,
            confirmPassword: confirmPassword,
            name: name,
            role: Object.keys(role).length > 0 ? role.value : ''
        }

        setLoader(true);
        axios
            .post(url, data)
            .then(function (response) {
                // handle success
                toast.success(response.data.user + ' successfully saved.', {
                    position: "top-center"
                });
                setAddModal(false);
                setLoader(false);
                setId(-1);
                setUserName('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setRole('');
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
                setLoader(false);
            });
    }


    const handlCloseAddModal = () => {
        setAddModal(false);
        setId(-1);
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setRole("");
    }

    const handleEditUser = () => {
        var route = `users/${id}`;
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");

        var data = {
            UserName: userName,
            Name: name,
            Role: Object.keys(role).length > 0 ? role.value : ''
        }

        setLoader(true);
        axios
            .put(url, data)
            .then(function (response) {
                // handle success
                toast.success(response.data.user + ' successfully edited.', {
                    position: "top-center"
                });
                setEditModal(false);
                setLoader(false);
                setId(-1);
                setUserName('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setRole('');
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
        setId(params.id);
        setEditModal(true);
        setUserName(params.userName);
        setName(params.name);
        var data = params.role !== "" ? params.role : "";
        setRole([{ label: data, value: data }]);
    }

    const handlCloseEditModal = () => {
        setEditModal(false);
        setId(-1);
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setRole("");
    }

    const onDelete = (value) => {
        setId(value);
        setDeletePopup(true);
    }

    const handleCloseDeleteModal = () => {
        setDeletePopup(false);
        setId(-1);
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setRole("");
    }

    const handleDeleteUser = () => {
        var url = window.apihost + `users/${id}`;
        setLoader(true);
        axios
            .delete(url)
            .then(function (response) {
                // handle success
                if (response.status <= 200) {
                    toast.success('User successfully deleted!', {
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

    const handleChangePassword = () => {
        var route = `users/change-password/${id}`;
        var url = window.apihost + route;
        // var token = sessionStorage.getItem("auth-token");

        var data = {
            Password: password,
            ConfirmPassword: confirmPassword
        }

        setLoader(true);
        axios
            .put(url, data)
            .then(function (response) {
                // handle success
                toast.success(response.data.user + ' successfully changed password.', {
                    position: "top-center"
                });
                setChangePassModal(false);
                setLoader(false);
                setId(-1);
                setUserName('');
                setPassword('');
                setConfirmPassword('');
                setName('');
                setRole('');
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

    const handlCloseChangePassModal = () => {
        setChangePassModal(false);
        setId(-1);
        setUserName('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setRole('');
    }

    const handleOpenChangePassModal = (value) => {
        setChangePassModal(true);
        setId(value);
    }

    const isMobile = window.innerWidth <= 768;

    return (
        <div style={{ padding: isMobile ? '10px' : '20px' }}>
            <ToastContainer />

            {/* Top Controls */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? 10 : 0,
                marginBottom: 20
            }}>
                <Button size='large' onClick={() => setAddModal(true)}>
                    <Icon name='plus' /> Add User
                </Button>

                <div style={{ width: isMobile ? '100%' : '30%' }}>
                    <Select
                        defaultValue={selectedUser}
                        options={UsersOption(usersOptionsList)}
                        onChange={e => setSelectedUser(e)}
                        placeholder='Search...'
                        isClearable
                        isMulti
                        theme={theme => ({
                            ...theme,
                            colors: { ...theme.colors, text: 'black', primary25: '#66c0f4', primary: '#B9B9B9' }
                        })}
                        styles={customMultiSelectStyle}
                    />
                </div>
            </div>

            {/* Users Cards */}
            <div style={{ paddingTop: 20 }}>
                {loader ? (
                    <div style={{ margin: '0 auto', textAlign: 'center' }}>
                        <Icon loading name='spinner' size='huge' style={{ color: '#C4C4C4', marginTop: 50 }} />
                    </div>
                ) : usersList && usersList.length > 0 ? (
                    <Card.Group
                        itemsPerRow={isMobile ? 1 : 3} // 1 for mobile, 3 for desktop
                        stackable
                        style={{
                            margin: '0 auto',
                            width: '100%',
                            backgroundColor: '#EEEEEE',
                            overflowY: 'auto',
                            maxHeight: '80vh',
                            gap: 20
                        }}
                    >
                        {usersList.map(user => (
                            <Card color='blue' key={user.id} fluid={isMobile}>
                                <Card.Content>
                                    <Card.Header>{user.name}</Card.Header>
                                    <Card.Description>
                                        Username: <strong>{user.userName}</strong>
                                    </Card.Description>
                                    <Card.Description>
                                        Role: <strong>{user.role}</strong>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui three buttons'>
                                        <Button
                                            basic
                                            color='grey'
                                            disabled={user.userName === 'superadmin'}
                                            onClick={() => handleOpenEditModal(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            basic
                                            color='grey'
                                            disabled={user.userName === 'superadmin'}
                                            onClick={() => handleOpenChangePassModal(user.id)}
                                        >
                                            Change Password
                                        </Button>
                                        <Button
                                            basic
                                            color='grey'
                                            disabled={user.userName === 'superadmin'}
                                            onClick={() => onDelete(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                ) : (
                    <div style={{ textAlign: 'center', padding: 120 }}>
                        <h1 style={{ color: "#C4C4C4" }}>No data found!</h1>
                    </div>
                )}
            </div>

            <Modal
                size="mini"
                open={addModal}
                onClose={handlCloseAddModal}
            >
                <Modal.Header>Add New User</Modal.Header>
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

                        <label><strong>Role</strong></label>
                        <Select
                            defaultValue={role}
                            options={RoleOption()}
                            onChange={e => setRole(e)}
                            placeholder='role'
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
                        <Form.Input
                            fluid
                            label='Username'
                            placeholder='username'
                            id='form-input-user-name'
                            size='medium'
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Password'
                            placeholder='password'
                            id='form-input-password'
                            size='medium'
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Confirm Password'
                            placeholder='password'
                            id='form-input-confirm-password'
                            size='medium'
                            type='password'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handlCloseAddModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleAddUser} disabled={loader}>
                            <Icon name='save' /> Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleAddUser} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>

                    }
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={editModal}
                onClose={handlCloseEditModal}
            >
                <Modal.Header>Edit User</Modal.Header>
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

                        <label><strong>Role</strong></label>
                        <Select
                            defaultValue={role}
                            options={RoleOption()}
                            onChange={e => setRole(e)}
                            placeholder='role'
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
                        <Form.Input
                            fluid
                            label='Username'
                            placeholder='username'
                            id='form-input-user-name'
                            size='medium'
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handlCloseEditModal}>
                        Cancel
                    </Button>

                    {!loader &&
                        <Button onClick={handleEditUser} disabled={loader}>
                            <Icon name='save' /> Edit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleEditUser} disabled={loader}>
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

                <Modal.Content>Are you sure you want to Delete this User?</Modal.Content>

                <Modal.Actions>
                    <Button onClick={handleCloseDeleteModal}>
                        <Icon name='close' />Cancel
                    </Button>
                    {!loader &&
                        <Button negative onClick={handleDeleteUser} disabled={loader}>
                            <Icon name='trash' /> Delete
                        </Button>
                    }
                    {loader &&
                        <Button negative onClick={handleDeleteUser} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>

            <Modal
                size="mini"
                open={changePassModal}
                onClose={handlCloseChangePassModal}
            >
                <Modal.Header>Change Password</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            fluid
                            label='Password'
                            placeholder='password'
                            id='form-input-password'
                            size='medium'
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <Form.Input
                            fluid
                            label='Confirm Password'
                            placeholder='password'
                            id='form-input-confirm-password'
                            size='medium'
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handlCloseChangePassModal}>
                        Cancel
                    </Button>
                    {!loader &&
                        <Button onClick={handleChangePassword} disabled={loader}>
                            <Icon name='save' />Submit
                        </Button>
                    }
                    {loader &&
                        <Button onClick={handleChangePassword} disabled={loader}>
                            <Icon loading name='spinner' />
                        </Button>
                    }
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Users;
