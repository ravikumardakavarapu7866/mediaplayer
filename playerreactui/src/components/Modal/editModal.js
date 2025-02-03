import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import '../../../src/components/Common/styles.css';
import { GETSERVERDATEANDTIME_API } from "../../components/Common/apiHelper";
import apiClient from '../../components/Common/apiClient';



const EditModal = ({ open, onClose, rowData, onSave, errorMessagee, }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  //const today = new Date().toISOString().split('T')[0];

  //const serverTimeString = sessionStorage.getItem('serverTime');
  //const serverTime = serverTimeString ? new Date(serverTimeString) : null;

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [serverTime, setServerTime] = useState(null);


  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const serverTimeString = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);
        //  console.log("serverDateAndTime: " + serverTimeString);

        const time = serverTimeString.data ? new Date(serverTimeString.data) : null; // Convert string to Date object
        setServerTime(time); // Update state with server time
        //  console.log("serverTime: " + time);
      } catch (error) {
        console.error("Error fetching server time: ", error); // Handle errors gracefully
      }
    };

    fetchServerTime(); // Call the async function
  }, []);

  useEffect(() => {
    if (rowData) {
      const { type, videoName, language, releaseDate, endDate, episodeName, videoDescription, providerName } = rowData;
      setFormData({ type, videoName, language, releaseDate, endDate, episodeName, videoDescription, providerName });
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };


  const handleInputDateChange = (newValue, fieldName) => {
    const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd') : null;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: formattedDate,
    }));
    setError('');
  };

  const handleSubmit = () => {

    if (!formData.videoName) {
      setError('Video Name is required.');
      return;
    }
    if (!formData.language) {
      setError('Language is required.');
      return;
    }
    if (!formData.releaseDate) {
      setError('Release Date is required.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => { }}

    >
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '500px', // Set a fixed width for better control
          maxWidth: '90%', // Allow it to be responsive on smaller screens
          margin: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute'
        }}
      >
        <h3>Update Video Details</h3>
        {error && <div style={modalStyles.errorMessage}>{error}</div>}

        {rowData && (
          <>
            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Type
              </Box>
              <input
                className="input-select-option"
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleChange} // You can keep this for handling changes if needed elsewhere
                fullWidth
                margin="normal"
                readOnly // Set the readOnly attribute here
              />
            </div>

            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Video Name
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <input
                className="input-select-option"
                name="videoName"
                value={formData.videoName || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 100) {
                    handleChange(e); // Call your existing input change handler
                  }
                }}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 100 }} // Restrict input to 100 characters
                helperText={`${formData && formData.videoName ? formData.videoName.length : 0}/100 characters`}
              />
            </div>

            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Language
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <input
                className="input-select-option"
                name="language"
                value={formData.language || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[a-zA-Z]*$/.test(inputValue) && inputValue.length <= 50) {
                    handleChange(e);
                  }
                }}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 50 }}
                helperText={`${formData && formData.language ? formData.language.length : 0}/50 characters`}
              />
            </div>


            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                Release Date
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  className="input-select-option"
                  sx={{ width: '100%' }}
                  name="releaseDate"
                  value={formData.releaseDate ? new Date(formData.releaseDate) : null}
                  minDateTime={serverTime}
                  onChange={(newValue) => {
                    if (newValue && newValue <= new Date()) {
                      handleInputDateChange(newValue, 'releaseDate');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" error={false} />
                  )}
                  ampm={false}
                  format="dd-MMM-yyyy"
                  slotProps={{ textField: { placeholder: 'dd-mmm-yyyy' } }}
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>
            </div>

            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                End Date
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  className="input-select-option"
                  sx={{ width: '100%' }}
                  name="endDate"
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  minDateTime={serverTime}
                  onChange={(newValue) => {
                    if (newValue && newValue > formData.releaseDate) {
                      handleInputDateChange(newValue, 'endDate');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" error={false} />
                  )}
                  ampm={false}
                  format="dd-MMM-yyyy"
                  slotProps={{ textField: { placeholder: 'dd-mmm-yyyy' } }}
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>
            </div>


            {formData.type === 'Seasons' && (
              <div className="fieldContainer">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Episode Name
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <input
                  name="episodeName"
                  className="input-select-option"
                  value={formData.episodeName || ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    // Allow input only if it's 100 characters or less
                    if (inputValue.length <= 100) {
                      handleChange(e); // Call your existing input change handler
                    }
                  }}
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: 100 }} // Restrict input to 100 characters
                  helperText={`${formData && formData.episodeName ? formData.episodeName.length : 0}/100 characters`}
                />
              </div>
            )}


            <div className="fieldContainer">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Video Description
              </Box>
              <input
                className="input-select-option"
                name="videoDescription"
                value={formData.videoDescription}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= 400) {
                    handleChange(e); // Call your existing input change handler
                  }
                }}
                fullWidth
                margin="normal"
                multiline
                rows={2}
                variant="outlined"
                InputProps={{
                  style: {
                    minHeight: '100px', cursor: 'pointer'
                  },
                }}
                inputProps={{ maxLength: 400 }} // Restrict input to 100 characters
                helperText={`${formData && formData.videoDescription ? formData.videoDescription.length : 0}/400 characters`}
              />
            </div>

          </>
        )}
        <div style={modalStyles.buttonContainer}>
          <Button variant="contained" onClick={handleSubmit} disabled={!rowData} style={modalStyles.button}> Update </Button>
          <Button variant="contained" onClick={onClose} style={modalStyles.button}>Close</Button>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyles = {

  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    cursor: 'pointer',
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

};


export default EditModal;