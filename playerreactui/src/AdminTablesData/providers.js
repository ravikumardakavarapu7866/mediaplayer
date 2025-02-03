import React, { useState, useEffect } from 'react';
import apiClient from '../components/Common/apiClient';
import { PROVIDERS_API, SAVEPROVIDERS_API, REACT_APP_BASE_URL, SAVEPROVIDERTOKENS_API, DELETEPROVIDER_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import { RiDeleteBinLine } from "react-icons/ri";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import encryptData from '../components/Authentication/encryptPayloadData';
import CustomToolbar from '../components/Common/customToolbar';
import AddProviderModal from '../components/Modal/addProvider';
import GenerateTokenModal from '../components/Modal/generateToken';
import Button from "@mui/material/Button";
import { formatDateTime } from '../components/Common/dateUtils';


const Providers = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [providerName, setProviderName] = useState('');
  const [errorMessagee, setErrorMessagee] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState('');
  const [sendToEmail, setSendToEmail] = useState('');
  const [fromDateTime, setFromDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [uniqueProviders, setUniqueProviders] = useState([]);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  const userRole = sessionStorage.getItem('userRole');
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);


  const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
  const columns = [
    {
      field: 'action',
      headerName: 'Actions',
      width: 100,
      renderHeader: renderHeaderBold,
      renderCell: (params) => {
        // Check if deletedText is 'Yes' or if providerToken is not present
        const canShowDeleteButton = params.row.deletedText !== 'Yes' && params.row.token;

        return canShowDeleteButton ? (
          <RiDeleteBinLine
            title="Delete"
            id={`delete-button-${params.row.id}`}
            onClick={() => handleDelete(params.row.id)}
            color="secondary"
            variant="contained"
            size="20px"
            style={{ cursor: 'pointer' }}
          />
        ) : null;
      },
    },
    //{ field: 'providerName', headerName: 'Provider Name', width: 200, renderHeader: renderHeaderBold },
    {
      field: 'providerName',
      headerName: 'Provider Name',
      width: 200,
      renderHeader: renderHeaderBold,
      renderCell: (params) => {
        const providerName = params.value;
        return (
          <span className="provider-name" style={{ whiteSpace: 'nowrap' }}>
            {providerName}
          </span>
        );
      }
    },
    { field: 'token', headerName: 'Provider Token', width: 300, renderHeader: renderHeaderBold },
    { field: 'validFromDate', headerName: 'From DateTime', width: 300, renderHeader: renderHeaderBold },
    { field: 'validEndDate', headerName: 'End DateTime', width: 300, renderHeader: renderHeaderBold },
    { field: 'deletedText', headerName: 'Deleted Token', width: 200, renderHeader: renderHeaderBold },
    { field: 'sendToEmail', headerName: 'Send To Email', width: 300, renderHeader: renderHeaderBold },
    { field: 'expirationEmailSentDate', headerName: 'Expiration Email Sent DateTime', width: 300, renderHeader: renderHeaderBold },
    { field: 'createdDate', headerName: 'Created DateTime', width: 300, renderHeader: renderHeaderBold },

  ];

  const fetchData = async () => {
    setLoadingDataGrid(true);
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(PROVIDERS_API, payload);
      // Format the date fields
      const formattedData = response.data.map(item => ({
        ...item,
        // validEndDate: item.validEndDate ? item.validEndDate.replace('T', ' ').split('.')[0] : null,
        // validFromDate: item.validFromDate ? item.validFromDate.replace('T', ' ').split('.')[0] : null,
        // createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
        // expirationEmailSentDate: item.expirationEmailSentDate ? item.expirationEmailSentDate.replace('T', ' ').split('.')[0] : null,

        validFromDate: item.validFromDate ? formatDateTime(item.validFromDate) : null,
        validEndDate: item.validEndDate ? formatDateTime(item.validEndDate) : null,
        createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        expirationEmailSentDate: item.expirationEmailSentDate ? formatDateTime(item.expirationEmailSentDate) : null,

      }));

      // Get unique provider names
      const uniqueProviders = Array.from(new Set(formattedData.map(item => item.providerName)));
      setRows(formattedData);
      //console.log("unique providers.." + uniqueProviders);
      setUniqueProviders(uniqueProviders);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoadingDataGrid(false);
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
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showFeedback]);

  const handleDelete = async (ids) => {
    //console.log('Selected IDs...:', ids);
    setSelectedIds(ids);
    setShowConfirmation(true);
  };

  const handleAddProvider = async () => {
    if (providerName.trim() === '') {
      setErrorMessagee('Provider Name is required');
      return;
    }

    const trimmedProviderName = providerName.trim();
    setProviderName('');
    setErrorMessagee('');
    setModalOpen(false);
    setLoadingDataGrid(true);

    const payload = { providerName: trimmedProviderName };

    try {

      const response = await apiClient.apiRequest(SAVEPROVIDERS_API, payload);

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
      setLoadingDataGrid(false);
      setShowFeedback(true);
    }
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setErrorMessagee('');
    setProviderName('');
    setFromDateTime('');
    setEndDateTime('');
  };



  const handleGenerateToken = async (e) => {

    //console.log("Generating token for:", selectedProvider, sendToEmail, fromDateTime, endDateTime);

    // e.preventDefault(); // Prevent default form submission


    if (selectedProvider.trim() === '') {
      setErrorMessagee('Provider Name is required');
      return;
    }
    if (sendToEmail.trim() === '') {
      setErrorMessagee('Please enter Send To Email');
      return;
    }
    if (fromDateTime.trim() === '') {
      setErrorMessagee('Please select From DateTime');
      return;
    }
    if (endDateTime.trim() === '') {
      setErrorMessagee('Please select End DateTime');
      return;
    }

    setErrorMessagee('');

    const formattedFromDateTime = fromDateTime.replace('T', ' ');
    const formattedEndDateTime = endDateTime.replace('T', ' ');


    const payload = { providerName: selectedProvider, validFromDate: fromDateTime, validEndDate: formattedEndDateTime, sendToEmail };

    try {
      setLoading(true);
      setIsGeneratingToken(true);

      const response = await apiClient.apiRequest(SAVEPROVIDERTOKENS_API, payload);
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedIds[0] ? { ...row, deletedText: 'Yes' } : row
          )
        );
        await fetchData();
        setFeedbackMessage(response.data.message);
        setTokenModalOpen(false);
        setSelectedProvider('');
        setSendToEmail('');
        setFromDateTime('');
        setEndDateTime('');
      }
      else {
        // Handle unexpected responses
        setErrorMessagee("Unexpected response from the server.");
      }
    } catch (error) {
      // Handle error responses
      if (error.response && error.response.status === 400) {
        setErrorMessagee(error.response.data.message || "An error occurred. Please try again.");
      } else {
        setErrorMessagee("An error occurred while generating the token. Please try again later.");
      }
    } finally {
      setLoading(false);
      setIsGeneratingToken(false);
      setShowFeedback(true);
    }
  };

  const handleOpenTokenModal = () => {
    setTokenModalOpen(true);
    setSelectedProvider('');
    setSendToEmail('');
    setFromDateTime('');
    setEndDateTime('');
    setErrorMessagee('');
  };

  const handleDeleteConfirm = async () => {
    //console.log("Press yes button..", selectedIds);
    setShowConfirmation(false);

    const payload = { selectedIds };

    try {
      setLoading(true);

      const response = await apiClient.apiRequest(DELETEPROVIDER_API, payload);

      if (response.status === 200) {
        await fetchData(); // Fetch updated data after deletion
        setFeedbackMessage(response.data.message); // Show success message
      } else {
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

  const handleDeleteCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div style={{ height: '90%', width: '95%' }} >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Providers</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {(userRole === "Super Admin") && (
            <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px', marginRight: '10px' }}
              onClick={() => {
                setModalOpen(true);
                setErrorMessagee('');
              }} >
              Add Provider
            </button>
          )}
          <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
            onClick={handleOpenTokenModal}>
            Generate Provider Token
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
            <h4>Are you sure you want to delete..?</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                style={{ marginRight: "10px" }}
              >
                Yes
              </Button>
              <Button
                onClick={handleDeleteCancel}
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
        loading={loadingDataGrid}
        slots={{ toolbar: CustomToolbar }}
        getRowId={(rows) => rows.id || rows.providerName}

      />
      <AddProviderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddProvider}
        providerName={providerName}
        setProviderName={setProviderName}
        errorMessagee={errorMessagee}
        setErrorMessagee={setErrorMessagee}
      />

      <GenerateTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        onGenerate={handleGenerateToken}
        providers={uniqueProviders}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        sendToEmail={sendToEmail}
        setSendToEmail={setSendToEmail}
        fromDateTime={fromDateTime}
        setFromDateTime={setFromDateTime}
        endDateTime={endDateTime}
        setEndDateTime={setEndDateTime}
        errorMessagee={errorMessagee}
        setErrorMessagee={setErrorMessagee}
        isGeneratingToken={isGeneratingToken}
      />
    </div>
  );
};

export default Providers;