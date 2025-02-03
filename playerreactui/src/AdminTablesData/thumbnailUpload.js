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
  Tooltip,
} from '@mui/material';
import FileUpload from 'react-material-file-upload';
import axios from "axios";
import { REACT_APP_BASE_URL, THUMBNAILPROVIDER_API, THUMBNAILPROVIDERVIDEOS_API, SAVETHUMBNAILIMAGE_API } from "../components/Common/apiHelper";
import { ClipLoader } from 'react-spinners';
import apiClient from '../components/Common/apiClient';
import '../../src/components/Common/styles.css';


const ThumbnailUploadForm = () => {
  const [formData, setFormData] = useState({
    providerName: '',
    videoName: '',
    imageType: '',
    imageUrl: '',
    imageFiles: [],
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



  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      setLoading(true);
      const response = await apiClient.apiRequest(THUMBNAILPROVIDER_API, payload);
      setActiveProviders(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);


  const fetchSeletedProviderVideos = async (id) => {
    //setLoading(true);

    const payload = { selectedIds: id };

    try {
      setLoading(true);
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


  const handleSelectVideo = (e) => {
    const { name, value } = e.target;
    const selectedViodeSourceId = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    //console.log("sourceId.." + selectedViodeSourceId);
    setSourceId(selectedViodeSourceId);
    setErrorMessage('');
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    setErrorMessage('');
  };


  const handleSelectProvider = async (e) => {
    setErrorMessage('');

    const selectedProviderId = e.target.value;
    //  / console.log("Selected Provider ID....: " + selectedProviderId);

    const selectedProvider = activeProviders.find(provider => provider.id === selectedProviderId);

    setProviderId(selectedProviderId);

    setFormData(prevFormData => ({
      ...prevFormData,
      providerName: selectedProvider.providerName
    }));
    setErrorMessage('');
    await fetchSeletedProviderVideos(selectedProviderId);

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



  const handleUploadThumbnail = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formDataToSend = new FormData();
      if (formData.imageType === 'imageFile' && formData.imageFiles.length > 0) {
        formDataToSend.append('image', formData.imageFiles[0]);
      }
      if (formData.imageType === 'imageUrl') {
        formDataToSend.append('thumbnailUrl', formData.imageUrl);
      }
      formDataToSend.append('sourceId', sourceId);
      formDataToSend.append('providerId', providerId);
      const userID = sessionStorage.getItem('userId');
      // formDataToSend.append('userId', userID);


      try {

        setLoading(true);
        setDisableForm(true);
        const response = await axios.post(
          `${REACT_APP_BASE_URL}/${SAVETHUMBNAILIMAGE_API}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {

          setFeedbackMessage(response.data.message);
          setFormData({
            providerName: '',
            videoName: '',
            imageFiles: [],
            thumbnailUrl: '',
            imageType: '',
          });
          setProviderId('');
          setErrorMessage('');

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
        setDisableForm(false);
        setShowFeedback(true);
      }
    }
  }

  const validateForm = () => {

    if (!formData.providerName.trim()) {
      setErrorMessage('Provider Name is required.');
      return false;
    }
    if (!formData.videoName.trim()) {
      setErrorMessage('Video Name is required.');
      return false;
    }
    if (!formData.imageType.trim()) {
      setErrorMessage('Image type is required.');
      return false;
    }
    if (formData.imageType === 'imageFile' && formData.imageFiles.length === 0) {
      setErrorMessage('Image file is required.');
      return false;
    }
    if (formData.imageType === 'imageUrl' && !formData.imageUrl.trim()) {
      setErrorMessage('Image url is required.');
      return false;
    }

    setErrorMessage('');
    return true;

  }

  let selectedVideo = '';

  if (!formData.imageType) {
    selectedVideo = "Supported image formats are .png, .jpeg, .jpg of width:350 and height:197."
  }


  const thumbnailImageType = [
    { value: 'imageFile', label: 'Image File' },
    { value: 'imageUrl', label: 'Image URL' },
  ];

  return (

    <Box
      component="form"
      onSubmit={handleUploadThumbnail}
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 2,
        minWidth: '400px',
        width: '40%',
        mx: 'auto',
        mt: 4
      }}

    >
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>Thumbnail Upload</Typography>

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
          className="input-select-option"
        >
          <option value="" disabled hidden>Select  Provider Name</option>
          {activeProviders.map(item => (
            <option key={item.id} value={item.id} title={item.providerName}>
              {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
            </option>
          ))}

        </select>
      </div>

      <div className="fieldContainer">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          Video Name
          <Typography component="span" color="error" sx={{ ml: 0.5 }}>
            *
          </Typography>
        </Box>
        <select
          labelId="videoName-label"
          name="videoName"
          value={formData.videoName || ''}
          onChange={handleSelectVideo}
          label="Video Name"
          className="input-select-option"
          disabled={!activeProviders.length > 0}
        >
          <option value="" disabled hidden>Select Video Name</option>
          {activeVideos.map(item => (
            <option key={item.id} value={item.sourceId} title={item.videoName}>
              {item.videoName.length > 30 ? `${item.videoName.substring(0, 30)}...` : item.videoName}
            </option>
          ))}

        </select>
      </div>


      <div className="fieldContainer">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          Thumbnail Image Type
          <Typography component="span" color="error" sx={{ ml: 0.5 }}>
            *
          </Typography>
        </Box>
        <Tooltip
          title={selectedVideo ? selectedVideo.description : 'Supported image formats are .png, .jpeg, .jpg of width:350 and height:197.'}
          arrow
          placement="top"
        >
          <select
            name="imageType"
            labelId="image-type-label"
            value={formData.imageType}
            onChange={handleInputChange}
            className="input-select-option"
          >
            <option value="" disabled hidden>Select Image Type</option>
            {thumbnailImageType.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Tooltip>
      </div>

      {
        formData.imageType === 'imageUrl' && (

          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Enter a Image URL
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ mb: 4 }}
              className="input-select-option"
            />
          </div>

        )
      }

      {
        formData.imageType === 'imageFile' && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              Upload a Image File
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>

            <FileUpload
              value={formData.imageFiles}
              onChange={(files) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  imageFiles: files,
                }));

              }}
              multiple={false}
              rightLabel="to select image file"
              buttonLabel="Upload Image File"
              maxFileSize={5}
              maxUploadFiles={1}
              bannerProps={{
                elevation: 0,
                variant: 'outlined',
                style: { height: '60px' }
              }}
              containerProps={{
                elevation: 0,
                variant: 'outlined',
                style: { height: '60px' }
              }}
            />
          </Box>
        )
      }

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

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 1 }} onClick={handleUploadThumbnail}>
          Submit
        </Button>
      </Box>
    </Box >
  );

};

export default ThumbnailUploadForm;
