import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import apiClient from '../Common/apiClient';
import { ACTIVEPROVIDRS_API, ASPECTRATIOKEYS_API } from '../Common/apiHelper';
import { ClipLoader } from 'react-spinners';

const AddAspectRatioModal = ({ open, onClose, onAdd, selectedRow }) => {

  // const [feedbackMessage, setFeedbackMessage] = useState("");
  // const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [aspectRatios, setAspectRatios] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [widthOptions, setWidthOptions] = useState([]);
  const [selectedWidth, setSelectedWidth] = useState('');
  const [height, setHeight] = useState('');
  const [videoBitrate, setVideoBitrate] = useState('');
  const [audioBitrate, setAudioBitrate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [responseData, setResponseData] = useState([]);



  useEffect(() => {
    if (open) {
      fetchProviders();
      fetchAspectRatios();
    }
  }, [open]);

  useEffect(() => {
    if (selectedRow) {
      setSelectedProvider(selectedRow.providerName);
      setSelectedAspectRatio(selectedRow.aspectRatio);
      setSelectedWidth(selectedRow.width);
      setHeight(selectedRow.height);
      setVideoBitrate(selectedRow.videoBitrate.replace('k', ''));
      setAudioBitrate(selectedRow.audioBitrate.replace('k', ''));
    } else {
      clearFields();
    }
  }, [selectedRow]);


  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }

    try {
      setLoading(true);
      const response = await apiClient.apiRequest(ACTIVEPROVIDRS_API, payload);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchAspectRatios = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(ASPECTRATIOKEYS_API, payload);
      setResponseData(response.data);
      const uniqueAspectRatios = [...new Set(response.data.map(item => item.aspectRatio))];
      setAspectRatios(uniqueAspectRatios);
      const uniqueWidthOptions = [...new Set(response.data.map(item => item.width))];
      //setWidthOptions(response.data.width);

      //setAspectRatios(response.data);
      //setWidthOptions(response.data.map(item => item.width));
      //setSelectedAspectRatio(response.data.map(item => item.aspectRatio));

      if (uniqueAspectRatios.length > 0) {
        setSelectedAspectRatio(uniqueAspectRatios[0]); // Default to first aspect ratio
        updateWidthOptions(uniqueAspectRatios[0], response.data); // Update width options based on default aspect ratio
      }

    } catch (error) {
      console.error('Error fetching providers:', error);
    }
    finally {
      setLoading(false);
    }
  };


  const updateWidthOptions = (aspectRatio, data) => {
    const filteredWidths = [...new Set(data.filter(item => item.aspectRatio === aspectRatio).map(item => item.width))];
    setWidthOptions(filteredWidths);
    // setSelectedWidth(''); // Reset width selection
    //setHeight(''); // Reset height when aspect ratio changes
  };

  const handleAspectRatioChange = (event) => {
    const selected = event.target.value;
    setSelectedAspectRatio(selected);
    updateWidthOptions(selected, responseData);
    //const filteredOptions = aspectRatios.filter(item => item.aspectRatio === selected);
    //const allWidths = filteredOptions.map(item => item.width);
    //setWidthOptions(allWidths);
    //setSelectedWidth('');
    //setHeight('');
    setErrorMessage('');
  };

  const handleWidthChange = (event) => {
    const selected = event.target.value;
    setSelectedWidth(selected);
    // const selectedAspect = aspectRatios.find(item => item.width === selected && item.aspectRatio === selectedAspectRatio);
    const selectedAspect = responseData.find(item => item.width === selected && item.aspectRatio === selectedAspectRatio);
    if (selectedAspect) {
      setHeight(selectedAspect.height);
    } else {
      setHeight('');
    }
    setErrorMessage('');
  };

  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
    setErrorMessage('');
  };

  const handleClose = () => {
    clearFields();
    onClose();
  };


  const clearFields = () => {
    setSelectedAspectRatio('');
    setWidthOptions([]);
    setSelectedWidth('');
    setHeight('');
    setVideoBitrate('');
    setAudioBitrate('');
    setSelectedProvider('');
    setErrorMessage('');
  };

  const handleAdd = async () => {

    if (!selectedProvider) {
      setErrorMessage('Provider Name is required.');
      return;
    } if (!selectedAspectRatio) {
      setErrorMessage('Aspect Ratio is required.');
      return;

    } if (!selectedWidth) {
      setErrorMessage('WidthXHeight is required.');
      return;

    } if (!height) {
      setErrorMessage('WidthXHeight is required.');
      return;

    } if (!videoBitrate) {
      setErrorMessage('Video Bitrate is required.');
      return;

    } if (!audioBitrate) {
      setErrorMessage('Audio Bitrate is required.');
      return;
      setErrorMessage('');
    }
    const payload = {
      id: selectedRow ? selectedRow.id : null,
      providerName: selectedProvider,
      aspectRatio: selectedAspectRatio,
      width: selectedWidth,
      height: height,
      videoBitrate: videoBitrate,
      audioBitrate: audioBitrate,
    };
    onAdd(payload);
    onClose();
    clearFields();
  };


  const handleDimensionsChange = (event) => {
    const selectedDimensions = event.target.value.split('x');
    const selectedWidth = selectedDimensions[0];
    const selectedHeight = selectedDimensions[1];

    setSelectedWidth(selectedWidth);
    setHeight(selectedHeight);

    // Optionally reset any error messages or other state as needed
    setErrorMessage('');
  };


  return (
    <Modal open={open} onClose={() => { }}>
      <Box sx={{
        padding: 4,
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        margin: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      }}>
        <h2>{selectedRow ? 'Edit Aspect Ratio' : 'Add Aspect Ratio'}</h2>
        {errorMessage && <div style={modalStyles.errorMessage}>{errorMessage}</div>}

        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Provider Name
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <select
            labelId="provider-select-label"
            value={selectedProvider || ''}
            onChange={handleProviderChange}
            className="input-select-option"
          >

            <option value="" disabled hidden>Select Provider Name</option>
            {providers.map(item => (
              <option key={item.id} value={item.providerName} title={item.providerName}>
                {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
              </option>
            ))}

          </select>
        </div>

        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Aspect Ratio
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>

          <select
            className="input-select-option"
            labelId="aspectRatio-select-label"
            value={selectedAspectRatio || ''}
            onChange={handleAspectRatioChange}
          >
            {/* {aspectRatios.map((item) => (
                <MenuItem key={item.id} value={item.aspectRatio}>
                  {item.aspectRatio}
                </MenuItem>
              ))} */}

            {aspectRatios.map((aspectRatio, index) => (
              <option key={index} value={aspectRatio}>
                {aspectRatio}
              </option>
            ))}

          </select>
        </div>


        {/* Combined Width and Height Dropdown */}
        <div className="fieldContainer">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Typography component="label" variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  WidthXHeight
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Typography>
                <Select
                  labelId="dimensions-select-label"
                  value={`${selectedWidth}  x  ${height}`} // Combine width and height for the dropdown
                  onChange={handleDimensionsChange}
                  fullWidth
                  sx={{ mt: 0.3 }} // Add margin-top for spacing
                >
                  {responseData.map((item) => (
                    <MenuItem key={item.id} value={`${item.width}x${item.height}`}>
                      {`${item.width}x${item.height}`} {/* Show combined dimensions */}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
          </Grid>
        </div>


        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center', }} >
            Video Bitrate (k)
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <input
            className="input-select-option"
            name="videoBitrate"
            value={videoBitrate}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === '' || /^\d{0,9}$/.test(inputValue)) {
                setVideoBitrate(inputValue);
              }
              setErrorMessage('');
            }}
            fullWidth
            sx={{ mt: 1 }}
            margin="normal"
            InputProps={{
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
            }}
          />
        </div>

        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            Audio Bitrate (k)
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <input
            className="input-select-option"
            name="audioBitrate"
            value={audioBitrate}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === '' || /^\d{0,9}$/.test(inputValue)) {
                setAudioBitrate(inputValue);
              }
              setErrorMessage('');
            }}
            fullWidth
            margin="normal"
            sx={{ mb: 2, mt: 0.5 }}
            InputProps={{
              inputProps: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
            }}
          />
        </div>

        {
          loading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ClipLoader loading={loading} size={50} color={"#ffffff"} />
            </Box>
          )
        }
        <div style={modalStyles.buttonContainer}>
          <Button variant="contained" onClick={handleAdd} style={modalStyles.button}>Save</Button>
          <Button variant="outlined" onClick={handleClose} style={modalStyles.button}>Close</Button>
        </div>
      </Box >
    </Modal >
  );
};

const modalStyles = {
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    cursor: 'pointer'
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

export default AddAspectRatioModal;