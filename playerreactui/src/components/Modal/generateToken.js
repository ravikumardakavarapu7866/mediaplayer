import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, CircularProgress, Grid } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { GETSERVERDATEANDTIME_API } from "../../components/Common/apiHelper";
import apiClient from '../../components/Common/apiClient';
import '../Common/styles.css';

const GenerateTokenModal = ({
  isOpen,
  onClose,
  onGenerate,
  providers,
  selectedProvider,
  setSelectedProvider,
  sendToEmail,
  setSendToEmail,
  errorMessagee,
  setErrorMessagee,
  isGeneratingToken,
  fromDateTime,
  setFromDateTime,
  endDateTime,
  setEndDateTime,

}) => {

  const [touchedFromDate, setTouchedFromDate] = useState(false);
  const [touchedEndDate, setTouchedEndDate] = useState(false);

  // Retrieve server time from session storage
  // const serverTimeString = sessionStorage.getItem('serverTime');
  //const serverTime = serverTimeString ? new Date(serverTimeString) : null;

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [serverTime, setServerTime] = useState(null);

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const serverTimeString = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);
        //console.log("serverDateAndTime: " + serverTimeString);

        const time = serverTimeString.data ? new Date(serverTimeString.data) : null; // Convert string to Date object
        setServerTime(time); // Update state with server time
        console.log("serverTime: " + time);
      } catch (error) {
        console.error("Error fetching server time: ", error); // Handle errors gracefully
      }
    };

    fetchServerTime(); // Call the async function
  }, []);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    // // e.preventDefault();
    // if (!fromDateTime || !endDateTime) {
    //   setTouchedFromDate(true);
    //   setTouchedEndDate(true);
    //   return;
    // }
    onGenerate();
    setSelectedFromDate('');
    setSelectedEndDate('');
  };

  const handleClose = (e) => {

    onClose();
    setSelectedFromDate('');
    setSelectedEndDate('');
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
    setErrorMessagee('');
  };

  const handleSendToEmailChange = (e) => {
    setSendToEmail(e.target.value);
    setErrorMessagee('');
  };

  const handleFromDateTimeChange = (newValue) => {
    setErrorMessagee('');
    setTouchedFromDate(true);

    if (newValue) {
      const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd HH:mm') : null;
      setFromDateTime(formattedDate);
    }
  };

  const handleEndDateTimeChange = (newValue) => {
    setErrorMessagee('');
    setTouchedEndDate(true);

    if (newValue) {
      const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd HH:mm') : null;
      setEndDateTime(formattedDate);
    }
  };

  const handleFromDateOpen = () => {
    if (!selectedFromDate) {
      setSelectedFromDate(serverTime);
    }
    setErrorMessagee('');
  };

  const handleEndDateOpen = () => {
    if (!selectedEndDate) {
      setSelectedEndDate(serverTime);
    }
    setErrorMessagee('');
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h4>Generate Provider Token</h4>
        {errorMessagee && <div style={modalStyles.errorMessage}>{errorMessagee}</div>}

        {!isGeneratingToken ? (
          <form style={modalStyles.form}>
            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Provider Name
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <select
                value={selectedProvider}
                onChange={handleProviderChange}
                className="input-select-option"
              >
                <option value="" disabled hidden>Select Provider Name</option>
                {providers.map((provider, index) => (
                  <option key={index} value={provider} title={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Send To Email
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <input
                className="input-select-option"
                type="email"
                value={sendToEmail}
                onChange={handleSendToEmailChange}
                placeholder="Send To Email"
                required
                maxLength={200}
              />
              {/* <div style={modalStyles.helperText}>
                {`${sendToEmail.length}/200 characters`}
              </div> */}
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    From DateTime
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      className="input-select-option"
                      value={selectedFromDate}
                      onChange={handleFromDateTimeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                        />
                      )}
                      ampm={false}
                      inputFormat="yyyy-MM-dd HH:mm"
                      minDateTime={serverTime || new Date()}
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                    />
                  </LocalizationProvider>
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    End DateTime
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      className="input-select-option"
                      value={selectedEndDate}
                      onChange={handleEndDateTimeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                        />
                      )}
                      ampm={false}
                      inputFormat="yyyy-MM-dd HH:mm"
                      minDateTime={serverTime || new Date()}
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                    />
                  </LocalizationProvider>
                </div>
              </Grid>
            </Grid>

            <div style={modalStyles.buttonContainer}>
              <button type="button" onClick={handleGenerate} style={modalStyles.button}>
                Generate Token
              </button>
              <button type="button" onClick={handleClose} style={modalStyles.button}>
                Close
              </button>
            </div>
          </form>
        ) : (
          <div style={modalStyles.loading}>
            <CircularProgress size={40} />
            <span style={{ marginLeft: '10px' }}>Generating...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldContainer: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    margin: '0 5px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'left',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '20px',
  },
};

export default GenerateTokenModal;