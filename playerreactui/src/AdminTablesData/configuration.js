import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import '../../src/components/Common/styles.css';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, FormHelperText, CircularProgress } from '@mui/material';
import { THUMBNAILPROVIDER_API, THUMBNAILPROVIDERVIDEOS_API, GETGLOBALCONFIGKEYS_API, GETPROVIDERKEYS_API, GETPROVIDERVIDEOKEYS_API, GETCONFIGKEYS_API, SAVECONFIGURATIONS_API } from '../components/Common/apiHelper';
import { ClipLoader } from 'react-spinners';

const Configuration = () => {

  const [formData, setFormData] = useState({
    providerName: '',
    searchProvider: '',
    type: '',
    videoName: '',
    seasons: '',
    configKey: '',
    configValue: '',

  });

  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [providerId, setProviderId] = useState(null);
  const [searchProviderId, setSearchProviderId] = useState(null);
  const [activeProviders, setActiveProviders] = useState([]);
  const [error, setError] = useState(null);
  const [activeVideos, setActiveVideos] = useState([]);
  const [videoMasterId, setvideoMasterId] = useState(null);
  const [typeError, setTypeError] = useState(false);
  const [providerError, setProviderError] = useState(false);

  const [globalConfigKeys, setGlobalConfigKeys] = useState([]);
  const [providerConfigKeys, setProviderConfigKeys] = useState([]);
  const [providerVideoConfigKeys, setproviderVideoConfigKeys] = useState([]);

  const [filteredVideos, setFilteredVideos] = useState([]);
  const [configKeys, setConfigKeys] = useState([]);
  const [configValues, setConfigValues] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedConfigType, setSelectedConfigType] = useState('');

  const [gkloading, setGkLoading] = useState(false);
  const [pkloading, setPkLoading] = useState(false);
  const [pvkloading, setPvkLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setpageLoading] = useState(false);



  const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);


  const globalConfigKeysColumns = [
    { field: 'configKey', headerName: 'Key', width: 350, renderHeader: renderHeaderBold },
    { field: 'configValue', headerName: 'Value', width: 150, renderHeader: renderHeaderBold },
    { field: 'description', headerName: 'Description', width: 500, renderHeader: renderHeaderBold },
  ];

  const providerConfigKeysColumns = [
    { field: 'providerName', headerName: 'Provider Name', width: 400, renderHeader: renderHeaderBold },
    { field: 'configKey', headerName: 'Key', width: 400, renderHeader: renderHeaderBold },
    { field: 'configValue', headerName: 'Value', width: 300, renderHeader: renderHeaderBold },
  ];

  const providerVideoConfigKeysColumns = [
    { field: 'videoName', headerName: 'Video Name', width: 400, renderHeader: renderHeaderBold },
    { field: 'configKey', headerName: 'Key', width: 400, renderHeader: renderHeaderBold },
    { field: 'configValue', headerName: 'Value', width: 300, renderHeader: renderHeaderBold },
  ];

  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    // console.log("UserID.." + userID);
    const payload = { userID };
    try {
      // setLoading(true);
      const response = await apiClient.apiRequest(THUMBNAILPROVIDER_API, payload);
      setActiveProviders(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
    finally {
      // setLoading(false);
    }
  };


  const fetchGlobalConfigKeys = async () => {

    try {
      setGkLoading(true);
      const response = await apiClient.apiRequest(GETGLOBALCONFIGKEYS_API);

      if (response.status === 200) {

        setGlobalConfigKeys(response.data);

      } else {
        setGlobalConfigKeys('');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setGkLoading(false);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchProviderConfigKeys = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID };
    try {
      setPkLoading(true);
      setpageLoading(true);
      const response = await apiClient.apiRequest(GETPROVIDERKEYS_API, payload);
      if (response.status === 200) {
        //setProviderConfigKeys(response.data);

        const formattedData = response.data.map(item => ({
          ...item,
          configValue: capitalizeFirstLetter(item.configValue),
        }));
        setProviderConfigKeys(formattedData);

      } else {
        setProviderConfigKeys('');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
    finally {
      setPkLoading(false);
      setpageLoading(false);
    }
  };


  const fetchProviderVideoConfigKeys = async (id) => {
    const payload = { providerId: id }
    try {
      setPvkLoading(true);
      const response = await apiClient.apiRequest(GETPROVIDERVIDEOKEYS_API, payload);
      if (response.status === 200) {
        //setproviderVideoConfigKeys(response.data);
        const formattedData = response.data.map(item => ({
          ...item,
          configValue: capitalizeFirstLetter(item.configValue),
        }));
        setproviderVideoConfigKeys(formattedData);


      } else {
        setproviderVideoConfigKeys('');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setPvkLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchGlobalConfigKeys();
    fetchProviderConfigKeys();
  }, []);


  const fetchSeletedProviderVideos = async (id) => {
    const payload = { selectedIds: id };
    try {
      const response = await apiClient.apiRequest(THUMBNAILPROVIDERVIDEOS_API, payload);
      if (response.status === 200) {

        const updatedVideos = response.data.map(video => {
          if (video.seasonNumber) {
            const newVideoName = `${video.label}`;
            return {
              ...video,
              videoName: newVideoName
            };
          }
          return video;
        });

        setActiveVideos(updatedVideos);
        setFilteredVideos([]);
      } else {
        setActiveVideos([]);
        //setFilteredVideos([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
    finally {
      //setLoading(false);
    }
  };


  const fetchSeletedTypeConfigKeys = async (seletedType) => {
    const payload = { type: seletedType };
    try {
      const response = await apiClient.apiRequest(GETCONFIGKEYS_API, payload);

      if (response.status === 200) {
        setConfigKeys(response.data);

      } else {
        setConfigKeys('');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };


  const handleInputChange = async (event) => {

    const { name, value } = event.target;
    const filteredValue = value.replace(/[^a-zA-Z]/g, '');

    // Check if the input is a number and within the range of 1 to 99
    if (name === 'configValue' && selectedConfigType === 'number') {
      const numericValue = parseInt(value, 10);
      if (value && (isNaN(numericValue) || numericValue < 1 || numericValue > 99)) {
        //setErrorMessage('Please enter a number between 1 to 99.');
        return;
      } else {
        setErrorMessage('');
      }
    }


    setFormData({ ...formData, [name]: value });


    if (name === 'type') {
      const filtered = activeVideos.filter(video => video.type === value);
      setFilteredVideos(filtered);
      await fetchSeletedTypeConfigKeys(value);

    };

    // Update selected config type based on selected config key
    if (name === 'configKey') {
      const selectedKey = configKeys.find(key => key.configKey === value);
      setSelectedConfigType(selectedKey ? selectedKey.configType : '');
      setFormData((prevData) => ({
        ...prevData,
        configValue: '',
      }));
    }

    if (name === 'text') {
      if (filteredValue && !/^[a-zA-Z]*$/.test(filteredValue)) {
        setErrorMessage('Only alphabetic characters are allowed');
      } else {
        setErrorMessage(''); // Clear error if input is valid
      }
    }


    setErrorMessage('');
  };


  const handleSelectProvider = async (e) => {
    setErrorMessage('');
    const selectedProviderId = e.target.value;
    const selectedProvider = activeProviders.find(provider => provider.id === selectedProviderId);
    setProviderId(selectedProviderId);
    setFormData(prevFormData => ({
      ...prevFormData,
      providerName: selectedProvider.providerName
    }));

    setFormData({
      type: '',
      videoName: '',
      configKey: '',
      configValue: '',

    });

    await fetchSeletedProviderVideos(selectedProviderId);
    setErrorMessage('');

  };

  const handleSearchProviderVideoKeys = async (e) => {
    setErrorMessage('');
    const selectedProviderId = e.target.value;
    const selectedProvider = activeProviders.find(provider => provider.id === selectedProviderId);
    setSearchProviderId(selectedProviderId);
    setFormData(prevFormData => ({
      ...prevFormData,
      searchProvider: selectedProvider.providerName
    }));

    await fetchProviderVideoConfigKeys(selectedProviderId);

  };



  const handleSelectVideo = (e) => {
    const { name, value } = e.target;
    const selectedViodeId = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    setvideoMasterId(selectedViodeId);
    setErrorMessage('');
  };

  const handleSaveConfigs = async (e) => {

    if (!providerId) {
      return setErrorMessage("Provider Name is required.");
    }
    if (!formData.type) {
      return setErrorMessage("Type is required.");
    }
    if (!formData.configKey) {
      return setErrorMessage("Key is required.");
    }

    if (!formData.configValue) {
      return setErrorMessage("Value is required.");
    }

    const payload = { providerId: providerId, selectVideo: formData.videoName, configKey: formData.configKey, configValue: formData.configValue };

    try {

      setLoading(true);

      const response = await apiClient.apiRequest(SAVECONFIGURATIONS_API, payload);

      if (response.status === 200) {
        setFeedbackMessage(response.data.message);
        setProviderId('');
        setvideoMasterId('');
        setFormData({
          configKey: '',
          configValue: '',
          videoName: '',
          type: '',
        });

        setLoading(false);
        await fetchProviders();
        await fetchProviderConfigKeys();
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

      setShowFeedback(true);
    }

  };



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

  const typeValues = [
    { value: 'Movie', label: 'Movies' },
    { value: 'Seasons', label: 'Seasons' },
  ];

  const booleanValues = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
  ];

  const chooseColorValues = [
    { value: 'Black', label: 'Black' },
    { value: 'Blue', label: 'Blue' },
    { value: 'Cyan', label: 'Cyan' },
    { value: 'Gray', label: 'Gray' },
    { value: 'Green', label: 'Green' },
    { value: 'Magenta', label: 'Magenta' },
    { value: 'Orange', label: 'Orange' },
    { value: 'Red', label: 'Red' },
    { value: 'White', label: 'White' },
    { value: 'Yellow', label: 'Yellow' },
  ];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px' }}>
        {/* Left Side: Tables */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '80%', marginLeft: '-10%' }}>
          <div style={{ height: 300, marginBottom: '30px' }}>
            <strong>Global Keys</strong>
            <DataGrid
              rows={globalConfigKeys}
              columns={globalConfigKeysColumns}
              pageSize={10}
              // loading={gkloading}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ height: 300, marginBottom: '30px' }}>
            <strong>Provider Keys</strong>
            <DataGrid
              rows={providerConfigKeys}
              columns={providerConfigKeysColumns}
              pageSize={10}
              // loading={pkloading}
              style={{ width: '100%' }}
            />
          </div>



          <div style={{ height: 300 }}>
            <strong>Provider Video Keys</strong>



            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Provider Name
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select
              labelId="searchProvider-name-label"
              name="searchProvider"
              value={searchProviderId || ''}
              onChange={handleSearchProviderVideoKeys}
              label="Provider Name"
              className="input-select-option"
              style={{ marginBottom: '4px' }}

            >

              {activeProviders.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.providerName}
                </MenuItem>
              ))}

              <option value="" disabled hidden>Select Provider Name</option>
              {activeProviders.map(item => (
                <option key={item.id} value={item.id} title={item.providerName}>
                  {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
                </option>
              ))}
            </select>

            {providerError && <FormHelperText>Provider Name is required</FormHelperText>}

            <DataGrid
              rows={providerVideoConfigKeys}
              columns={providerVideoConfigKeysColumns}
              pageSize={10}
              loading={pvkloading}
              style={{ width: '100%' }}
            />
          </div>


        </div>

        {/* Right Side: Centered Box */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{
            width: '80%',
            height: '70%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '270px',
            marginLeft: '10px',
          }}>
            <Box
              component="form"
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 2,
                minWidth: '400px',
                width: '40%',
                mx: 'auto',
                mt: 0,
                height: '100%'
              }} >
              <Typography variant="h5" sx={{ marginBottom: "30px" }}>Add New Configuration Key</Typography>

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

              <div className="fieldContainer">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Provider Name
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <select labelId="provider-name-label"
                  name="providerName"
                  value={providerId || ''}
                  onChange={handleSelectProvider}
                  label="Provider Name"
                  className="input-select-option"
                >
                  <option value="" disabled hidden>Select Provider Name</option>
                  {activeProviders.map(item => (
                    <option key={item.id} value={item.id} title={item.providerName}>
                      {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
                    </option>
                  ))}

                </select>
              </div>


              <div className="fieldContainer">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Type
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <select
                  name="type"
                  labelId="type-label"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-select-option"
                >
                  <option value="" disabled hidden>Select Type</option>
                  {typeValues.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}

                </select>
              </div>

              <div className="fieldContainer">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Video Name

                </Box>
                <select
                  labelId="videoName-label"
                  name="videoName"
                  value={formData.videoName || ''}
                  onChange={handleSelectVideo}
                  label="Video Name"
                  disabled={!formData.type}
                  className="input-select-option"
                >
                  <option value="" disabled hidden>Select Video Name</option>
                  {filteredVideos.map(item => (
                    <option key={item.id} value={item.id} title={item.videoName}>
                      {item.videoName.length > 30 ? `${item.videoName.substring(0, 30)}...` : item.videoName}
                    </option>
                  ))}

                </select>
              </div>

              <div className="fieldContainer">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Key
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <select
                  labelId="key-label"
                  name="configKey"
                  value={formData.configKey || ''}
                  onChange={handleInputChange}
                  label="Key"
                  disabled={!formData.type}
                  className="input-select-option"
                >
                  <option value="" disabled hidden>Select Key</option>
                  {configKeys.map(item => (
                    <option key={item.id} value={item.configKey} title={item.description}>
                      {item.configKey}
                    </option>
                  ))}
                </select>
              </div>

              {selectedConfigType === 'boolean' && (
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Value
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                  <select
                    labelId="value-label"
                    name="configValue"
                    value={formData.configValue || ''}
                    onChange={handleInputChange}
                    label="Value"
                    className="input-select-option"
                    disabled={!formData.configKey}
                  >
                    <option value="" disabled hidden>Select Value</option>
                    {booleanValues.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              {selectedConfigType === 'text' && (
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Value
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                  <input
                    type="text"
                    name="configValue" // Ensure this matches the name used in validation
                    value={formData.configValue || ''}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      // Allow only alphabetic characters and prevent invalid input
                      e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
                    }}
                    className="input-select-option"
                    pattern="[A-Za-z]*" // Pattern to allow only alphabetic characters
                  //tit
                  />

                </div>
              )}

              {selectedConfigType === 'number' && (
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Value
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                  <input
                    type="number"
                    name="configValue" // Ensure this matches the name used in validation
                    value={formData.configValue || ''}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      // Allow only alphabetic characters and prevent invalid input
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    className="input-select-option"
                    pattern="[A-Za-z]*" // Pattern to allow only alphabetic characters
                    tit
                  />
                  {/* {errorMessage && (
                    <Typography component="span" color="error" sx={{ mt: 1 }}>
                      {errorMessage}
                    </Typography>
                  )} */}
                </div>
              )}
              {selectedConfigType === 'chooseColor' && (
                <div className="fieldContainer">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Value
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                  <select
                    labelId="value-label"
                    name="configValue"
                    value={formData.configValue || ''}
                    onChange={handleInputChange}
                    label="Value"
                    className="input-select-option"
                    disabled={!formData.configKey}
                  >
                    <option value="" disabled hidden>Select Value</option>
                    {chooseColorValues.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveConfigs}
                  disabled={loading}
                  style={{ position: 'relative' }}
                >
                  {pageLoading && (
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
                      <ClipLoader loading={pageLoading} size={50} color={"#ffffff"} />
                    </Box>
                  )
                  }

                  {loading ? (
                    <CircularProgress size={24} style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }} />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>

            </Box>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Configuration;