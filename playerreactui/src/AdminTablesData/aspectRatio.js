import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { ASPECTRATIOS_API, ASPECTRATIOSAVE_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import { MdOutlineEdit } from "react-icons/md";
import CustomToolbar from '../components/Common/customToolbar';
import AddAspectRatioModal from '../components/Modal/addAspectRatioModal';

const AspectRatio = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [errorMessagee, setErrorMessagee] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);

  const columns = [
    {
      field: 'action',
      headerName: 'Actions',
      width: 100,
      renderHeader: renderHeaderBold,
      renderCell: (params) => (
        <MdOutlineEdit title='Edit' id={`edit-button-${params.row.id}`} onClick={() => handleEdit(params.row)}
          color="secondary" variant="contained" size="20px" style={{ cursor: 'pointer' }}>
          Edit
        </MdOutlineEdit>
      ),
    },
    { field: 'providerName', headerName: 'Provider Name', width: 300, renderHeader: renderHeaderBold },
    { field: 'aspectRatio', headerName: 'Aspect Ratio', width: 300, renderHeader: renderHeaderBold },
    { field: 'width', headerName: 'Width', width: 300, renderHeader: renderHeaderBold },
    { field: 'height', headerName: 'Height', width: 300, renderHeader: renderHeaderBold },
    { field: 'videoBitrate', headerName: 'Video Bitrate', width: 300, renderHeader: renderHeaderBold },
    { field: 'audioBitrate', headerName: 'Audio Bitrate', renderHeader: renderHeaderBold },
  ];

  const fetchData = async () => {
    setLoading(true);

    const userID = sessionStorage.getItem('userId');
    //console.log("UserID.." + userID);
    const payload = { userID };
    try {
      const response = await apiClient.apiRequest(ASPECTRATIOS_API, payload);
      if (response.status === 200) {
        setRows(response.data);
      }

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

  const handleEdit = async (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setFeedbackMessage('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleAddAspectRatio = async (payload) => {
    try {
      setLoading(true);
      const response = await apiClient.apiRequest(ASPECTRATIOSAVE_API, payload);
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

  const handleUpdateAspectRatio = async (payload) => {

    try {
      setLoading(true);
      const response = await apiClient.apiRequest(ASPECTRATIOSAVE_API, payload);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Aspect Ratios</strong>
        </div>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleOpenModal}
        >
          Add Aspect Ratio
        </button>
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
        pageSize={10}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
      />


      <AddAspectRatioModal
        open={modalOpen}
        onClose={handleCloseModal}
        onAdd={selectedRow ? handleUpdateAspectRatio : handleAddAspectRatio}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default AspectRatio;