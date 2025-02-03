import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { VIDEOUPLOADSTATUS_API, REACT_APP_BASE_URL, UPDATEVIDEODETAILS_API, GETLOGDATA_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import { MdOutlineEdit } from "react-icons/md";
import CustomToolbar from '../components/Common/customToolbar';
import EditModal from '../components/Modal/editModal';
import encryptData from '../components/Authentication/encryptPayloadData';
import axios from "axios";
import { formatDateTime, formatDate } from '../components/Common/dateUtils';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link } from '@mui/material';


const VideoUploadstatus = () => {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [errorMessagee, setErrorMessagee] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedVideoMasterId, setSelectedVideoMasterId] = useState(null);
    const [logData, setLogData] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedVideoName, setSelectedVideoName] = useState(null);



    const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);

    const columns = [
        {
            field: 'action', headerName: 'Actions', width: 100, renderHeader: renderHeaderBold, renderCell: (params) => (
                <MdOutlineEdit title="Edit" id={`delete-button-${params.row.id}`} onClick={() => handleEdit(params.row.id)}
                    color="secondary" variant="contained" size="20px" style={{ cursor: 'pointer', '&:hover': { cursor: 'pointer' } }}> Edit  </MdOutlineEdit>
            ),
        },

        { field: 'providerName', headerName: 'Provider Name', width: 200, renderHeader: renderHeaderBold },
        // { field: 'videoName', headerName: 'Video Name', width: 300, renderHeader: renderHeaderBold },
        {
            field: 'videoName', // This will show the log entry
            headerName: 'Video Name',
            width: 300,
            renderHeader: renderHeaderBold,
            renderCell: (params) => {
                const videoTitle = params.value; // Get the video name
                const truncatedTitle = videoTitle.length > 30 ? `${videoTitle.slice(0, 30)}...` : videoTitle; // Truncate if longer than 30 characters

                return (
                    <Link
                        component="button"
                        variant="body2"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                        onClick={() => handleVideoClick(params.row)}
                        title={videoTitle} // Show full title as a tooltip
                    >
                        {truncatedTitle} {/* Display truncated title */}
                    </Link>
                );
            },
        },

        { field: 'sourceId', headerName: 'Source Id', width: 300, renderHeader: renderHeaderBold },
        { field: 'type', headerName: 'Type', width: 100, renderHeader: renderHeaderBold },
        { field: 'language', headerName: 'Language', width: 100, renderHeader: renderHeaderBold },
        { field: 'seasonNumber', headerName: 'Season', width: 100, renderHeader: renderHeaderBold },
        { field: 'episodeNumber', headerName: 'Episode', width: 100, renderHeader: renderHeaderBold },
        { field: 'episodeName', headerName: 'Episode Name', width: 300, renderHeader: renderHeaderBold },
        { field: 'releaseDate', headerName: 'Release Date', width: 150, renderHeader: renderHeaderBold },
        { field: 'endDate', headerName: 'End Date', width: 150, renderHeader: renderHeaderBold },
        { field: 'activeModified', headerName: 'Active', width: 100, renderHeader: renderHeaderBold },
        { field: 'status', headerName: 'Status', width: 200, renderHeader: renderHeaderBold },
        { field: 'statusMessage', headerName: 'Status Message', width: 300, renderHeader: renderHeaderBold },
        { field: 'createdDate', headerName: 'Upload DateTime', width: 300, renderHeader: renderHeaderBold },
        { field: 'videoDescription', headerName: 'Video Description', width: 300, renderHeader: renderHeaderBold },
    ];

    const handleVideoClick = async (row) => {
        setSelectedVideoName(row.videoName);
        try {
            setLoading(true);
            const payload = { videoMasterId: row.id }
            const response = await apiClient.apiRequest(GETLOGDATA_API, payload);
            if (response.status === 200) {
                setLogData(response.data.responseData);
                setOpen(true);
            }
            else {
                setFeedbackMessage("Unexpected response from the server.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        setLoading(true);
        const userID = sessionStorage.getItem('userId');
        const payload = { userID }
        try {
            const response = await apiClient.apiRequest(VIDEOUPLOADSTATUS_API, payload);
            const formattedData = response.data.map(item => ({
                ...item,
                //endDate: item.endDate ? item.endDate.replace('T', ' ').split('.')[0] : null,
                //releaseDate: item.releaseDate ? item.releaseDate.replace('T', ' ').split('.')[0] : null,
                //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,

                endDate: item.endDate ? formatDate(item.endDate) : null,
                releaseDate: item.releaseDate ? formatDate(item.releaseDate) : null,
                createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,


            }));
            setRows(formattedData);
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


    const handleEdit = async (id) => {
        //console.log('Selected ID...:', id);
        setSelectedVideoMasterId(id);
        const rowToEdit = rows.find(row => row.id === id);
        setSelectedRow(rowToEdit);
        setModalOpen(true);

    };

    const handleUpdate = async (updatedRow) => {

        const type = updatedRow.type;
        const videoMasterId = selectedVideoMasterId;
        const language = updatedRow.language;
        const releaseDate = updatedRow.releaseDate;
        const endDate = updatedRow.endDate;
        const videoDescription = updatedRow.videoDescription;
        const providerName = updatedRow.providerName;
        const videoName = updatedRow.videoName;
        const episodeName = updatedRow.episodeName;

        //console.log("Selected releaseDate .." + releaseDate);
        //console.log("Selected endDate .." + endDate);

        const payload = { type, videoMasterId, videoName, providerName, language, releaseDate, endDate, videoDescription, episodeName };

        try {
            setLoading(true);
            const response = await apiClient.apiRequest(UPDATEVIDEODETAILS_API, payload);
            if (response.status === 200) {
                await fetchData();
                setFeedbackMessage(response.data.message);
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
        }
    };

    //...........Clear the feedback message after 5 seconds.........//

    useEffect(() => {
        let timer;
        if (showFeedback) {
            timer = setTimeout(() => {
                setShowFeedback(false);
                setFeedbackMessage("");
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showFeedback]);



    return (
        <div style={{ height: '90%', width: '95%' }}>

            {open && (
                <Dialog
                    open={open}
                    //onClose={handleClose}
                    PaperProps={{
                        style: {
                            width: '100%',
                            maxWidth: '100%',
                            height: '90%',
                            maxHeight: '90%',
                        },
                    }}
                >
                    <DialogTitle>Log : {selectedVideoName}</DialogTitle>

                    <DialogContent>
                        {logData ? (
                            <pre>{logData}</pre> // Display log data if available
                        ) : (
                            <p>No log data available.</p> // Message when log data is empty
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                    <strong>Videos Upload Status</strong>
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

            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                slots={{ toolbar: CustomToolbar }}


            />

            <EditModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                rowData={selectedRow}
                onSave={handleUpdate}
                errorMessagee={errorMessagee}

            />
        </div>
    );
};

export default VideoUploadstatus;