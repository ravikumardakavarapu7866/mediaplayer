import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import FileUpload from 'react-material-file-upload';
import axios from "axios";
import { REACT_APP_BASE_URL, UPLOADVIDEO_API, ACTIVEPROVIDRS_API, GETSERVERDATEANDTIME_API } from "../components/Common/apiHelper";
import { ClipLoader } from 'react-spinners';
import apiClient from '../components/Common/apiClient';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';


const VideoUploadForm = () => {
    const [formData, setFormData] = useState({
        providerName: '',
        sourceId: '',
        videoName: '',
        videoDescription: '',
        language: '',
        releaseDate: '',
        endDate: '',
        type: '',
        seasonNumber: '',
        episodeNumber: '',
        episodeName: '',
        videoType: '',
        videoUrl: '',
        imageType: '',
        imageUrl: '',
        videoFiles: [],
        imageFiles: [], // Changed to imageFiles to match state
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeProviders, setActiveProviders] = useState([]);
    const [error, setError] = useState(null);

    // const today = new Date().toISOString().split('T')[0];
    // const serverTimeString = sessionStorage.getItem('serverTime');

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
        const fetchProviders = async () => {
            const userID = sessionStorage.getItem('userId');
            const payload = { userID }
            try {
                setLoading(true);
                const response = await apiClient.apiRequest(ACTIVEPROVIDRS_API, payload);
                setActiveProviders(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        setErrorMessage('');
    };


    const handleInputDateChange = (newValue, fieldName) => {
        const formattedDate = newValue ? format(newValue, 'yyyy-MM-dd') : null;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: formattedDate,
        }));
        setErrorMessage('');
    };



    const validateForm = () => {
        // Check for required fields
        if (!formData.providerName.trim()) {
            setErrorMessage('Provider Name is required.');
            return false;
        }
        if (!formData.sourceId.trim()) {
            setErrorMessage('Source ID is required.');
            return false;
        }
        if (!formData.videoName.trim()) {
            setErrorMessage('Video Name is required.');
            return false;
        }
        if (!formData.language.trim()) {
            setErrorMessage('Language is required.');
            return false;
        }
        if (!selectedFromDate) {
            setErrorMessage('Release Date is required.');
            return false;
        }
        if (!formData.type.trim()) {
            setErrorMessage('Type is required.');
            return false;
        }
        if (formData.type === 'seasons') {
            if (!formData.seasonNumber.trim()) {
                setErrorMessage('Season Number is required.');
                return false;
            }
            if (!formData.episodeNumber.trim()) {
                setErrorMessage('Episode Number is required.');
                return false;
            }
            if (!formData.episodeName.trim()) {
                setErrorMessage('Episode Name is required.');
                return false;
            }
        }
        if (!formData.videoType.trim()) {
            setErrorMessage('Video type is required.');
            return false;
        }
        if (formData.videoType === 'videoFile' && formData.videoFiles.length === 0) {
            setErrorMessage('Video file is required.');
            return false;
        }
        if (formData.videoType === 'videoUrl' && !formData.videoUrl.trim()) {
            setErrorMessage('Video url is required.');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const handleUploadVideo = async (e) => {
        e.preventDefault();

        const ReleaseDate = selectedFromDate ? format(selectedFromDate, 'yyyy-MM-dd') : null;
        const EndDate = selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : null;
        const trimmedEndDate = EndDate ? EndDate.trim() : '';

        if (validateForm()) {
            const formDataToSend = new FormData();
            formDataToSend.append('providerName', formData.providerName);
            formDataToSend.append('sourceId', formData.sourceId);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('releaseDate', ReleaseDate);
            formDataToSend.append('endDate', trimmedEndDate);
            formDataToSend.append('videoName', formData.videoName);
            formDataToSend.append('videoDescription', formData.videoDescription);
            formDataToSend.append('language', formData.language);
            formDataToSend.append('seasonNumber', formData.seasonNumber);
            formDataToSend.append('episodeNumber', formData.episodeNumber);
            formDataToSend.append('episodeName', formData.episodeName);
            formDataToSend.append('videoType', formData.videoType);
            formDataToSend.append('imageType', formData.imageType);

            if (formData.videoType === 'videoFile' && formData.videoFiles.length > 0) {
                formDataToSend.append('videoFile', formData.videoFiles[0]);
            } else if (formData.videoType === 'videoUrl') {
                formDataToSend.append('videoUrl', formData.videoUrl);
            }

            if (formData.imageFiles.length > 0) {
                formDataToSend.append('imageFile', formData.imageFiles[0]);
            }

            try {
                setLoading(true);
                const response = await axios.post(
                    `${REACT_APP_BASE_URL}/${UPLOADVIDEO_API}`,
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
                        sourceId: '',
                        videoName: '',
                        videoDescription: '',
                        language: '',
                        videoFiles: [],
                        imageFiles: [],
                        videoUrl: '',
                        thumbnailUrl: '',
                        seasonNumber: '',
                        episodeNumber: '',
                        episodeName: '',
                        type: '',
                        imageType: '',
                        videoType: '',
                        releaseDate: '',
                        endDate: '',
                    });

                    setSelectedFromDate(null);
                    setSelectedEndDate(null);

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


    const typeValues = [
        { value: 'movie', label: 'Movie' },
        { value: 'seasons', label: 'Seasons' },
    ];

    const videoTypes = [
        { value: 'videoFile', label: 'Video File' },
        { value: 'videoUrl', label: 'Video URL' },
    ];

    const imageTypes = [
        { value: 'imageFile', label: 'Image File' },
        { value: 'imageUrl', label: 'Image URL' },
    ];

    return (

        <Box
            component="form"
            onSubmit={handleUploadVideo}
            sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 2,
                minWidth: '500px',
                width: '80%',
                mx: 'auto',
                mt: 4
            }}
        >
            <div>
                <Typography style={{ marginBottom: "30px" }}><h3>Upload Video </h3></Typography>
            </div>
            {errorMessage && (
                <Typography variant="body1" color="error" sx={{ mb: 4 }}>
                    {errorMessage}
                </Typography>
            )}
            {feedbackMessage && (
                <div
                    style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "10px",
                        marginBottom: "40px",

                    }}
                >
                    {feedbackMessage}
                </div>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Provider Name
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <select
                        labelId="provider-name-label"
                        name="providerName"
                        value={formData.providerName}
                        onChange={handleInputChange}
                        label="Provider Name"
                        className="input-select-option"
                    >

                        <option value="" disabled hidden>Select  Provider Name</option>
                        {activeProviders.map(item => (
                            <option key={item.id} value={item.providerName} title={item.providerName}>
                                {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
                            </option>
                        ))}

                    </select>

                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Source ID
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <input
                        name="sourceId"
                        value={formData.sourceId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        className="input-select-option"
                    />
                </Grid>


                <Grid item xs={12} sm={6}>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Video Name
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <input
                        className="input-select-option"
                        name="videoName"
                        value={formData.videoName}
                        onChange={(e) => {
                            if (e.target.value.length <= 100) {
                                handleInputChange(e);
                            }
                        }}
                        fullWidth
                        variant="outlined"
                        inputProps={{ maxLength: 100 }}
                        helperText={`${formData.videoName.length}/100 characters`}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Language
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <input
                        className="input-select-option"
                        name="language"
                        value={formData.language}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^[a-zA-Z]*$/.test(inputValue) && inputValue.length <= 50) {
                                handleInputChange(e);
                            }
                        }}

                        fullWidth
                        variant="outlined"
                        inputProps={{ maxLength: 50 }}
                        helperText={`${formData.language.length}/50 characters `}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    {/* <TextField
                        name="releaseDate"
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Release Date
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Box>
                        }
                        type="date"
                        value={serverTime}
                        onChange={handleInputChange}
                        onOpen={handleFromDateOpen}
                        fullWidth
                        variant="outlined"

                        InputLabelProps={{
                            shrink: true
                        }}

                        inputProps={{
                            min: serverTime
                        }}
                    /> */}

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
                            value={selectedFromDate}
                            onChange={(newValue) => {
                                handleInputDateChange(newValue, 'releaseDate');
                                setSelectedFromDate(newValue); // Update local state immediately

                            }}
                            onOpen={handleFromDateOpen}
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
                            PopperProps={{
                                style: {
                                    zIndex: 2000,
                                },
                            }}
                            views={['year', 'month', 'day',]}

                        />
                    </LocalizationProvider>

                </Grid>

                <Grid item xs={12} sm={6}>
                    {/* <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        inputProps={{
                            min: serverTime
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    /> */}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        End Date
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker sx={{ width: '100%' }}
                            className="input-select-option"
                            value={selectedEndDate}
                            //onChange={(newValue) => handleInputDateChange(newValue, 'endDate')}
                            onChange={(newValue) => {
                                handleInputDateChange(newValue, 'endDate');
                                setSelectedEndDate(newValue); // Update local state immediately
                            }}
                            onOpen={handleEndDateOpen}
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
                            PopperProps={{
                                style: {
                                    zIndex: 2000,
                                },
                            }}
                            views={['year', 'month', 'day']}

                        />
                    </LocalizationProvider>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Type
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <select
                        name="type"
                        labelId="type"
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
                </Grid>

                {formData.type === 'seasons' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Season Number
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Box>
                            <input
                                className="input-select-option"
                                name="seasonNumber"
                                value={formData.seasonNumber}
                                onChange={(e) => {
                                    const inputValue = e.target.value;

                                    // Allow only digits (0-9)
                                    if (/^\d*$/.test(inputValue)) {
                                        handleInputChange(e);
                                    }
                                }}

                                fullWidth
                                variant="outlined"
                                inputProps={{ maxLength: 3 }} // Optional: limit to 3 digits
                                helperText="Enter a numeric value" // Optional: provide helper text
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Episode Number
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Box>
                            <input
                                className="input-select-option"
                                name="episodeNumber"
                                value={formData.episodeNumber}
                                onChange={(e) => {
                                    const inputValue = e.target.value;

                                    // Allow only digits (0-9)
                                    if (/^\d*$/.test(inputValue)) {
                                        handleInputChange(e);
                                    }
                                }}
                                fullWidth
                                variant="outlined"
                                inputProps={{ maxLength: 3 }} // Optional: limit to 3 digits
                                helperText="Enter a numeric value" // Optional: provide helper text
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Episode Name
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Box>
                            <input
                                className="input-select-option"
                                name="episodeName"
                                value={formData.episodeName}
                                onChange={(e) => {
                                    const inputValue = e.target.value;

                                    // Check if the input is alphabetic and within the max length
                                    if (inputValue.length <= 100) {
                                        handleInputChange(e); // Call your existing input change handler
                                    }

                                }}
                                fullWidth
                                variant="outlined"
                                inputProps={{ maxLength: 100 }} // Restrict input to 100 characters
                            //helperText={`${formData.language.length}/100 characters`} // Display character count
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Video Type
                        <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                            *
                        </Typography>
                    </Box>
                    <select
                        className="input-select-option"
                        name="videoType"
                        labelId="video-type-label"
                        value={formData.videoType}
                        // onClick={handleInputChange}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled hidden>Select  Video Type</option>
                        {videoTypes.map(item => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Image Type
                    </Box>
                    <select
                        className="input-select-option"
                        name="imageType"
                        labelId="image-type-label"
                        value={formData.imageType}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                    >
                        <option value="" disabled hidden>Select Image Type</option>
                        {imageTypes.map(item => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </Grid>

                {formData.videoType === 'videoUrl' && (
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Enter a Video URL
                            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                *
                            </Typography>
                        </Box>
                        <input
                            className="input-select-option"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"

                        />
                    </Grid>
                )}


                {loading && (
                    <div className="overlay">
                        <div className="spinner-container">
                            <ClipLoader loading={loading} size={50} color={"#3498db"} />
                        </div>
                    </div>
                )}

                {formData.videoType === 'videoFile' && (
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            Upload a Video File
                            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                *
                            </Typography>
                        </Box>

                        <FileUpload
                            value={formData.videoFiles}
                            onChange={(files) => {
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    videoFiles: files,
                                }));
                            }}
                            multiple={false}
                            rightLabel="to select video file"
                            buttonLabel="Upload Video File"
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
                    </Grid>
                )}

                {formData.imageType === 'imageUrl' && (
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Image URL
                        </Box>
                        <input
                            className="input-select-option"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                )}

                {formData.imageType === 'imageFile' && (
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            Upload a Image File
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
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Video Description
                    </Box>
                    <input
                        className="input-select-option"
                        name="videoDescription"
                        //label="Video Description"
                        value={formData.videoDescription}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue.length <= 400) {
                                handleInputChange(e); // Call your existing input change handler
                            }
                        }}
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        inputProps={{ maxLength: 400 }} // Restrict input to 100 characters
                        helperText={`${formData.videoDescription.length}/400 characters`}
                    />
                </Grid>
            </Grid>

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
                <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 1 }} onClick={handleUploadVideo}>
                    Submit
                </Button>

            </Box>
        </Box >
    );
};

export default VideoUploadForm;