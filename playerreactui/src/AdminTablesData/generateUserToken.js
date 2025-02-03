import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { THUMBNAILPROVIDER_API, GETPROVIDERVIDEOS_API, SAVEUSERTOKEN_API, GETSERVERDATEANDTIME_API, PROVIDERUSERS_API } from "../components/Common/apiHelper";
import apiClient from '../components/Common/apiClient';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { ClipLoader } from 'react-spinners';
import { format } from 'date-fns';
import { formatDateTime } from '../components/Common/dateUtils';


const GenerateUserToken = () => {
  //const serverTimeString = sessionStorage.getItem('serverTime');
  //const serverTime = serverTimeString ? new Date(serverTimeString) : null;

  //console.log("serverTime" + serverTime);

  const [formData, setFormData] = useState({
    userEmail: '',
    providerName: '',
    fromDate: null,
    endDate: null,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeProviders, setActiveProviders] = useState([]);
  const [activeVideos, setActiveVideos] = useState([]);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [disableForm, setDisableForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [userDto, setUserDto] = useState([]);


  const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
  const columns = [

    {
      field: 'Select',
      headerName: 'Select',
      width: 100,
      renderHeader: renderHeaderBold,
      renderCell: (params) => (

        <Checkbox
          id={`select-button-${params.row.id}`}
          onChange={() => handleSelect(params.row)}
          checked={selectedRows.includes(params.row.id)}
          color="primary"
          size="small"
        />
      ),
    },

    { field: 'videoName', headerName: 'Video Name', width: 300 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'language', headerName: 'Language', width: 100 },
    { field: 'seasonNumber', headerName: 'Season', width: 100 },
    { field: 'episodeNumber', headerName: 'Episode', width: 100 },
    { field: 'episodeName', headerName: 'Episode Name', width: 250 },
    { field: 'releaseDate', headerName: 'Release Date', width: 250 },
    { field: 'endDate', headerName: 'End Date', width: 250 },
  ];

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const serverTimeString = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);
        console.log("serverDateAndTime: " + serverTimeString);

        const time = serverTimeString.data ? new Date(serverTimeString.data) : null; // Convert string to Date object
        setServerTime(time); // Update state with server time
        console.log("serverTime: " + time);
      } catch (error) {
        console.error("Error fetching server time: ", error); // Handle errors gracefully
      }
    };

    fetchServerTime(); // Call the async function
  }, []);


  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID };
    try {
      const response = await apiClient.apiRequest(THUMBNAILPROVIDER_API, payload);
      setActiveProviders(response.data);
      if (response.data.length > 0) {
        setProviderId(response.data[0].id);
        await fetchSeletedProviderVideos(response.data[0].id);
        await fetchSeletedProviderUsers(response.data[0].id);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);


  const handleSelectProvider = async (e) => {
    setErrorMessage('');

    const selectedProviderId = e.target.value;
    //console.log("Selected Provider ID....: " + selectedProviderId);

    const selectedProvider = activeProviders.find(provider => provider.id === selectedProviderId);

    setProviderId(selectedProviderId);

    setFormData(prevFormData => ({
      ...prevFormData,
      providerName: selectedProvider.providerName
    }));
    setErrorMessage('');
    await fetchSeletedProviderVideos(selectedProviderId);
    await fetchSeletedProviderUsers(selectedProviderId);
  };


  const fetchSeletedProviderVideos = async (id) => {
    // console.log("selectedIds.." + id);
    const payload = { selectedIds: id };
    try {
      setLoading(true);
      const response = await apiClient.apiRequest(GETPROVIDERVIDEOS_API, payload);
      if (response.status === 200) {
        const formattedData = response.data.map(item => ({
          ...item,
          //releaseDate: item.releaseDate ? item.releaseDate.replace('T', ' ').split('.')[0] : null,
          //endDate: item.endDate ? item.endDate.replace('T', ' ').split('.')[0] : null,

          releaseDate: item.releaseDate ? formatDateTime(item.releaseDate) : null,
          endDate: item.endDate ? formatDateTime(item.endDate) : null,
        }));

        setActiveVideos(formattedData);
      } else {
        setFeedbackMessage("Unexpected response from the server.");
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchSeletedProviderUsers = async (id) => {
    const payload = { providerId: id }
    setLoading(true);
    try {
      const response = await apiClient.apiRequest(PROVIDERUSERS_API, payload);

      if (response.status === 200) {

        setUserDto(response.data);
      }
      else {
        console.error('Error fetching User Data:', error);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
    finally {
      setLoading(false);
    }
  };

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


  const handleSelect = (row) => {
    if (selectedRows.includes(row.id)) {
      setSelectedRows(selectedRows.filter((id) => id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row.id]);
    }
    setSourceId(row.sourceId);
    setErrorMessage('');

  };

  const validateForm = (e) => {

    if (!formData.userEmail) {
      return setErrorMessage("Please enter User Email.");
    }
    if (!selectedFromDate) {
      return setErrorMessage("Please select From Date.");
    }
    if (!selectedEndDate) {
      return setErrorMessage("Please select End Date.");
    }

    if (selectedRows.length === 0) {
      return setErrorMessage("Please select video.");
    }
    setErrorMessage('');
    return true;
  };


  const handleInputChange = (name) => (newValue) => {
    if (name === 'fromDate' || name === 'endDate') {
      const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd') : null;
      //setSelectedFromDate(formattedDate);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,

      }));
      setErrorMessage('');

    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
      //setSelectedFromDate(null);
    }
    setErrorMessage('');

  };

  const handleFromDateTimeChange = (name) => (newValue) => {
    if (newValue) {
      const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd') : null;
      setSelectedFromDate(newValue);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,

      }));
    }
    setErrorMessage('');
  };

  const handleEndDateTimeChange = (name) => (newValue) => {
    if (newValue) {
      const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd') : null;
      setSelectedEndDate(newValue);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,

      }));
    }
    setErrorMessage('');
  };

  const handleFromDateOpen = () => {
    if (!selectedFromDate) {
      setSelectedFromDate(serverTime);
    }
    setErrorMessage('');
  };




  const handleEndDateOpen = () => {
    if (!selectedEndDate) {
      setSelectedEndDate(serverTime);
    }
    setErrorMessage('');
  };

  const handleSaveUserToken = async () => {
    if (validateForm()) {

      setLoading(true);

      try {
        //console.log("Selcted from date :" + formData.fromDate);
        // console.log("Selcted end date :" + formData.endDate);

        const payload = { providerId: providerId, userEmail: formData.userEmail, sourceId: sourceId, validFromDate: selectedFromDate, validEndDate: selectedEndDate };
        const response = await apiClient.apiRequest(SAVEUSERTOKEN_API, payload);

        if (response.status === 200) {
          await fetchProviders();
          setFeedbackMessage(response.data.message);
          setFormData({
            userEmail: '',
            fromDate: null,
            endDate: null,
          });
          setSelectedRows('');
          setErrorMessage('');
          setSelectedFromDate(null);
          setSelectedEndDate(null);

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
        setSelectedFromDate(null);
        setSelectedEndDate(null);
      }

    }

  };

  return (
    <Box>
      <Box component="form" sx={{ p: 4, borderRadius: 2, boxShadow: 0, width: '100%', maxWidth: 600, mx: 'auto', }}>

        {errorMessage && (
          <Typography variant="body1" color="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Typography>
        )}
        {feedbackMessage && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              marginBottom: "30px",
            }}
          >
            {feedbackMessage}
          </div>
        )}

        <Grid container spacing={3}>

          <Grid item xs={12} >
            <div className="..fieldContainer-userToken-userToken-userToken">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Provider Name
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <select
                className="input-select-option"
                labelId="provider-name-label"
                label="Provider Name"
                name="providerName"
                value={providerId || ''}
                onChange={handleSelectProvider}

              >
                <option value="" disabled hidden>Provider Name</option>
                {activeProviders.map(item => (
                  <option key={item.id} value={item.id} title={item.providerName}>
                    {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
                  </option>
                ))}

              </select>
            </div>
          </Grid>

          <Grid item xs={12} >
            {/* <TextField
              name="userEmail"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  User Email
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
              }
              value={formData.userEmail}
              onChange={(e) => handleInputChange('userEmail')(e.target.value)}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 200 }}
              helperText={`${formData.userEmail.length}/200 characters`}
              
            /> */}

            <div className="fieldContainer-userToken" sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                User Email
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              </Box>
              <select
                className="input-select-option"
                labelId="userEamil-label"
                name="userEamil"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail')(e.target.value)}
                label="User Email"
                sx={{ mb: 4 }}
              >
                <option value="" disabled hidden> User Email</option>
                {userDto.map(item => (
                  <option key={item.id} value={item.userEmail} title={item.userEmail}>
                    {item.userEmail.length > 30 ? `${item.userEmail.substring(0, 30)}...` : item.userEmail}
                  </option>
                ))}
              </select>
            </div>

          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              From Date
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} >
              <DateTimePicker
                name="fromDate"
                className="input-select-option"
                value={selectedFromDate}
                //onChange={handleInputChange('fromDate')}
                onChange={handleFromDateTimeChange('fromDate')}
                onOpen={handleFromDateOpen}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" />
                )}
                ampm={false}
                inputFormat="yyyy-MM-dd"
                minDateTime={serverTime || new Date()}
                views={['year', 'month', 'day']}

              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              End Date
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                name="endDate"
                className="input-select-option"
                value={selectedEndDate}
                //onChange={handleInputChange('endDate')}
                onChange={handleEndDateTimeChange('endDate')}
                onOpen={handleEndDateOpen}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined"
                  />
                )}
                ampm={false}
                inputFormat="yyyy-MM-dd"
                minDateTime={serverTime || new Date()}
                views={['year', 'month', 'day']}


              />
            </LocalizationProvider>
          </Grid>



        </Grid>

        {loading && (
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


        <Box sx={{ mt: 0, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" sx={{ borderRadius: 1 }} onClick={handleSaveUserToken}>
            Submit
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 0,
          width: '100%',
          maxWidth: '100%',
          mx: 'auto',
          '& .MuiDataGrid-root': {
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <div style={{ height: 380 }}>
          <DataGrid
            rows={activeVideos}
            columns={columns}
            autoHeight={false}


          />
        </div>
      </Box>
    </Box >

  );
};

export default GenerateUserToken;