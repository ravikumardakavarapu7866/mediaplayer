import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { ALLUSERDETAILS_API, USERSTATUSUPDATE_API, SAVEUSERDETAILS_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import CustomToolbar from '../components/Common/customToolbar';
import { MdOutlineEdit } from "react-icons/md";
import Checkbox from '@mui/material/Checkbox';
import Button from "@mui/material/Button";
import AddUserModal from '../components/Modal/addUserModal';



const UserActivateAndDeactivate = () => {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [errorMessagee, setErrorMessagee] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectOption, setSelectOption] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);


    const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
    const columns = [
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderHeader: renderHeaderBold,
            renderCell: (params) => {
                if (params.row.role === 'Super Admin') {
                    return null;
                }
                return (
                    <MdOutlineEdit
                        title='Edit'
                        id={`edit-button-${params.row.id}`}
                        onClick={() => handleEdit(params.row)}
                        color="secondary"
                        size="20px"
                        style={{ cursor: 'pointer' }}
                    />
                );
            },
        },
        {
            field: 'Select',
            headerName: 'Select',
            width: 100,
            renderHeader: renderHeaderBold,
            renderCell: (params) => {
                if (params.row.role === 'Super Admin') {
                    return null;
                }
                return (
                    <Checkbox
                        id={`select-button-${params.row.id}`}
                        onChange={() => handleSelect(params.row.id)}
                        checked={selectedRows.includes(params.row.id)}
                        color="primary"
                        size="small"
                    />
                );
            },
        },

        { field: 'providerName', headerName: 'Provider Name', width: 300, renderHeader: renderHeaderBold },
        { field: 'userEmail', headerName: 'User Email', width: 400, renderHeader: renderHeaderBold },
        { field: 'role', headerName: 'User Roles', width: 200, renderHeader: renderHeaderBold },
        { field: 'active', headerName: 'Active', width: 200, renderHeader: renderHeaderBold },
    ];


    const fetchData = async () => {
        setLoading(true);
        const userID = sessionStorage.getItem('userId');
        const payload = { userID }
        try {
            const response = await apiClient.apiRequest(ALLUSERDETAILS_API, payload);
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    //...........Clear the feedback message after 3 seconds.........//

    useEffect(() => {
        let timer;
        if (showFeedback) {
            timer = setTimeout(() => {
                setShowFeedback(false);
                setFeedbackMessage("");
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showFeedback]);


    const handleEdit = async (row) => {
        setSelectedRow(row);
        setModalOpen(true);

    };

    const handleSelect = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

    const handleUpdate = (option) => {

        if (selectedRows.length === 0) {
            setShowFeedback(true);
            return setFeedbackMessage("Please select User Email.");
        }
        setSelectOption(option);
        setShowConfirmation(true);

    };

    const handleConfirm = async (option) => {
        //.log("SelctedUserIds.." + selectedRows);
        //console.log("SelctedOption.." + selectOption);

        setShowConfirmation(false);
        const payload = { active: selectOption, userIds: selectedRows };

        try {
            setLoading(true);

            const response = await apiClient.apiRequest(USERSTATUSUPDATE_API, payload);

            if (response.status === 200) {
                await fetchData();
                setFeedbackMessage(response.data.message);
                setSelectOption('');
                setError('');
                setSelectedRows('');
            }
            else {
                setFeedbackMessage("Unexpected response from the server.");
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setFeedbackMessage(error.response.data.message);
                    return;
                } else {
                    setFeedbackMessage("An error occurred. Please try again later.");
                }
            } else {
                setFeedbackMessage("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
            setShowFeedback(true);
            setShowConfirmation(false);
        }


    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setErrorMessagee('');
    };

    const handleAddUser = async (payload) => {

        try {
            setLoading(true);
            const response = await apiClient.apiRequest(SAVEUSERDETAILS_API, payload);
            if (response.status === 200) {
                setFeedbackMessage(response.data.message);
                await fetchData();

            } else {
                setFeedbackMessage('Failed to add Aspect Ratio.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    await fetchData();
                    setFeedbackMessage(error.response.data.message);

                    return;
                } else {
                    setFeedbackMessage("An error occurred. Please try again later.");
                }
            } else {
                setFeedbackMessage("Network error. Please check your connection.");
            }
        }
        finally {
            setLoading(false);
            setShowFeedback(true);
        }

    };

    const handleUpdateUser = async (payload) => {

        try {
            setLoading(true);
            const response = await apiClient.apiRequest(SAVEUSERDETAILS_API, payload);
            if (response.status === 200) {
                setFeedbackMessage(response.data.message);
                await fetchData();

            } else {
                setFeedbackMessage('Failed to update Aspect Ratio.'); // Set error message
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    await fetchData();
                    setFeedbackMessage(error.response.data.message);

                    return;
                } else {
                    setFeedbackMessage("An error occurred. Please try again later.");
                }
            } else {
                setFeedbackMessage("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
            setShowFeedback(true);
        }

    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRow(null);
    };


    return (
        <div style={{ height: '90%', width: '95%' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                    <strong>User Management</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', marginRight: '10px' }}
                        onClick={() => {
                            setModalOpen(true);
                            setErrorMessagee('');
                        }} >
                        Add User
                    </button>

                    <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', marginRight: '10px' }}
                        onClick={() => handleUpdate("true")}>
                        Activate
                    </button>
                    <button value="false" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
                        onClick={() => handleUpdate("false")}>
                        Deactivate
                    </button>
                </div>
            </div>
            {feedbackMessage && (
                <div
                    style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "10px",
                        marginBottom: "10px",
                    }}
                >
                    {feedbackMessage}
                </div>
            )}

            {showConfirmation && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "9999",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <h4>Are you sure you want to proceed..?</h4>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Button
                                onClick={handleConfirm}
                                color="error"
                                variant="contained"
                                style={{ marginRight: "10px" }}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={handleCancel}
                                color="success"
                                variant="contained"
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                slots={{ toolbar: CustomToolbar }}

            />

            <AddUserModal
                open={modalOpen}
                onClose={handleCloseModal}
                onAdd={selectedRow ? handleUpdateUser : handleAddUser}
                selectedRow={selectedRow}
            />
        </div>
    );
};

export default UserActivateAndDeactivate;