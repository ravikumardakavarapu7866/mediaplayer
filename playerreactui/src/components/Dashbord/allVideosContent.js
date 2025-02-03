import "../../components/Common/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import DefaultThumbnail from "../../../src/assets/images/Default_Thumbnail.jpg";
import { USERPROVIDERS_API, USERTOKENVIDEOS_API, GETSERVERDATEANDTIME_API, HOMEPROVIDERVIDEOS_API } from "../Common/apiHelper";
import encryptData from "../Authentication/encryptPayloadData";
import { getPlayerUrl, initialize } from "../Common/fetchConfig";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, } from '@mui/material';
import apiClient from "../Common/apiClient";
import { ClipLoader } from 'react-spinners';
import { formatDate } from '../../components/Common/dateUtils';


let PLAYER_BASE_URL = "";

const setupApiHelper = async () => {
  await initialize(); // the base URL is fetched
  PLAYER_BASE_URL = getPlayerUrl(); // Set the base URL
  //console.log("PLAYER_BASE_URL:", PLAYER_BASE_URL);
};
setupApiHelper();

function AllVideosContent() {
  const { state } = useLocation();
  //const userID = state ? state.data.userId : null;
  const userID = sessionStorage.getItem('userId');


  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTitle, setFilterTitle] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [showWatermark, setShowWatermark] = useState("0");
  const [sessionIncrement, setSessionIncrement] = useState('1');
  const [sessionTimeout, setSessionTimeout] = useState(10);
  const [webseries, setWebseries] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [serverTime, setServerTime] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [movies, setMovies] = useState([]);



  const fetchProviders = async () => {
    const payload = { userID };
    try {
      const response = await apiClient.apiRequest(USERPROVIDERS_API, payload);

      if (response.status === 200) {
        setProviders(response.data);
        setProviderId(response.data[0].id);
      }

    } catch (error) {
      console.error('Error fetching server time:', error);
    }
  };
  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const serverDateAndTime = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);
        const serverTimeString = new Date(serverDateAndTime.data);
        setServerTime(serverTimeString);
      } catch (error) {
        console.error('Error fetching server time:', error);
      }
    };

    fetchServerTime();
  }, []);

  useEffect(() => {
    const fetchVideosData = async () => {
      const payload = { userID };
      //const payloadJSON = JSON.stringify(payload);
      //const encryptedPayload = encryptData(payloadJSON);
      try {
        const response = await apiClient.apiRequest(USERTOKENVIDEOS_API, payload);

        if (response.status === 200) {
          setVideos(response.data);

          if (response.data.length > 0) {

            const filteredSeasons = response.data.filter((video) => video.type === 'Seasons');
            const filteredMovies = response.data.filter((video) => video.type === 'Movie');
            setWebseries(filteredSeasons);
            setMovies(filteredMovies);
          }

          setErrorMessage(response.data.message);
        }
        // else {
        //   setErrorMessage(response.data.message);
        // }
      } catch (error) {
        console.error("Error fetching videos data:", error);
        setErrorMessage(
          "An error occurred while fetching videos data. Please try again later."
        );
        navigate("/login");
      }
    };

    fetchVideosData();
  }, [
    navigate,
    // encryptedPayload,
    // REACT_APP_BASE_URL,
    USERTOKENVIDEOS_API,
    setVideos,
    setErrorMessage,
  ]);

  // Function to format the date to "DD-MMM-YYYY"
  const formatReleaseDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase(); // Get month in uppercase
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Combine into desired format
  };

  const handleClick = (selectedVideo) => {

    const releaseDate = new Date(selectedVideo.releaseDate + 'T00:00:00');
    if (releaseDate > serverTime) {
      setShowFeedback(true);
      setShowModal(true);
      const formattedDate = formatDate(selectedVideo.releaseDate);
      return setFeedbackMessage(`Video can be played from ${formattedDate}.`);

    }

    const data = {
      userToken: selectedVideo.userToken,
      showWatermark: showWatermark,
      sessionTimeout: sessionTimeout,
      sessionIncrement: sessionIncrement,
    };

    navigate("/player", { state: { data } });
  };

  const handleClickBegin = (selectedVideo) => {

    const releaseDate = new Date(selectedVideo.releaseDate + 'T00:00:00');
    if (releaseDate > serverTime) {
      setShowFeedback(true);
      setShowModal(true);
      const formattedDate = formatDate(selectedVideo.releaseDate);
      return setFeedbackMessage(`Video can be played from ${formattedDate}.`);
    }

    const data = {
      userToken: selectedVideo.userToken,
      showWatermark: showWatermark,
      sessionTimeout: sessionTimeout,
      sessionIncrement: sessionIncrement,
      playFromBegin: true
    };

    navigate("/player", { state: { data } });
  };

  const filterVideos = useCallback(() => {
    let filtered = videos;
    if (filterType !== "all") {
      filtered = filtered.filter((video) => video.type === filterType);
    }
    if (filterTitle) {
      filtered = filtered.filter((video) => video.label === filterTitle);
    }
    setFilteredVideos(filtered);
  }, [videos, filterType, filterTitle]);

  useEffect(() => {
    filterVideos();
  }, [filterVideos, showWatermark, sessionIncrement, sessionTimeout]);

  const handleTypeChange = (event) => {
    setFilterType(event.target.value);
    setFilterTitle("");

  };

  const handleSelectProvider = async (e) => {
    setErrorMessage('');

    const selectedProviderId = e.target.value;
    //console.log("Selected Provider ID....: " + selectedProviderId);
    const selectedProvider = providers.find(provider => provider.id === selectedProviderId);
    setProviderId(selectedProviderId);
    setErrorMessage('');
    await fetchSeletedProviderVideos(selectedProviderId);
  };


  const fetchSeletedProviderVideos = async (id) => {
    // console.log("selectedIds.." + id);
    const userID = sessionStorage.getItem('userId');
    const payload = { selectedIds: id, userID };
    try {
      setLoading(true);
      const response = await apiClient.apiRequest(HOMEPROVIDERVIDEOS_API, payload);
      if (response.status === 200) {
        setVideos(response.data);
        setFilterTitle(response.data.label);
      } else {
        setFeedbackMessage("Unexpected response from the server.");
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (event) => {
    const selectedValue = event.target.value;
    setFilterTitle(selectedValue);

    const filteredOptions = filteredVideos.filter(item => item.label.toLowerCase().includes(selectedValue.toLowerCase()));
    setFilteredVideos(filteredOptions);


  };


  const handleWatermarkChange = (event) => {
    setShowWatermark(event.target.value);
  };

  const handleSessionIncrementChange = (event) => {
    setSessionIncrement(event.target.value);
  };

  const handleSessionTimeoutChange = (event) => {
    const value = event.target.value;
    const inputField = event.target;

    const regex = /^(300|[1-2][0-9]{2}|[1-9]?[0-9])$/;

    if (!regex.test(value)) {
      inputField.setCustomValidity("Please enter a number between 1 and 300.");
    } else {
      inputField.setCustomValidity(""); // Clear custom validity message
      setSessionTimeout(value);
    }

  };


  //...........Clear the feedback message after 3 seconds.........//

  useEffect(() => {
    let timer;
    if (showFeedback) {
      timer = setTimeout(() => {
        setShowFeedback(false);
        setShowModal(false);
        setFeedbackMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showFeedback]);





  const typeValues = [
    { value: 'all', label: 'All' },
    { value: 'Movie', label: 'Movies' },
    { value: 'Seasons', label: 'Webseries' },
  ];

  const showWaterMarkValues = [
    { value: '0', label: 'No' },
    { value: '1', label: 'Yes' },
    { value: '2', label: 'Original Video' },
  ];

  const sessionIncrementValues = [
    { value: '0', label: 'No' },
    { value: '1', label: 'Yes' },
  ];

  return (
    <>
      <div className="video-container">

        {showModal && (
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
                padding: "50px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              {feedbackMessage && (
                <p style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
                  {feedbackMessage}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
              </div>
            </div>
          </div>
        )}


        <div className="filters">

          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Type
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select value={filterType}
              onChange={handleTypeChange}
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}
            >
              <option value="" disabled hidden>Select a Type</option>
              {typeValues.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}

            </select>
          </div>


          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Provider Name
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select value={providerId || ''}
              onChange={handleSelectProvider}
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}
            >
              <option value="" disabled hidden>Select  Provider Name</option>
              {providers.map(item => (
                <option key={item.id} value={item.id} title={item.providerName}>
                  {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
                </option>
              ))}

            </select>
          </div>

          {/* <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Video Name
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select onChange={handleTitleChange}
              value={filterTitle || ''}
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}
            >

              <option value="" disabled hidden>Select  Video Name</option>
              {filteredVideos.map(item => (
                <option key={item.id} value={item.label} title={item.label}>
                  {item.label.length > 30 ? `${item.label.substring(0, 30)}...` : item.label}
                </option>
              ))}

            </select>
          </div> */}


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
              value={filterTitle || ''}
              onChange={handleTitleChange}
              label="Video Name"
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}
            >
              {Array.isArray(videos) && videos.length > 0 ? (
                videos.map(item => (
                  <option key={item.id} value={item.label} title={item.label}>
                    {item.label.length > 30 ? `${item.label.substring(0, 30)}...` : item.label}
                  </option>
                ))
              ) : (
                <option disabled>No videos available</option> // Handle case where no videos are present
              )}
            </select>
          </div>


          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Show Watermark
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select id="showWatermark"
              label="showWatermark"
              onChange={handleWatermarkChange}
              value={showWatermark}
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}
            >
              <option value="" disabled hidden>Select Show Watermark</option>
              {showWaterMarkValues.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}

            </select>
          </div>

          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Session Increment
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <select
              id="sessionIncrement"
              label="sessionIncrement"
              value={sessionIncrement}
              onChange={handleSessionIncrementChange}
              className="input-select-option-allVideos"
              disabled={!videos.length > 0}>

              <option value="" disabled hidden>Select Session Increment</option>
              {sessionIncrementValues.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}

            </select>
          </div>

          <div className="fieldContainer">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Session Timeout (min)
              <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Box>
            <input
              type="number"
              id="sessionTimeout"
              label="sessionTimeout"
              onChange={handleSessionTimeoutChange}
              disabled={!videos.length > 0}
              min={1}
              max={300}
              value={sessionTimeout}
              className="input-select-option-allVideos"
              pattern="^(300|[1-2][0-9]{2}|[1-9]?[0-9])$"
              title="Please enter a number between 1 and 300."
            />
          </div>


          {/* <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="video-type"
              disabled={!videos.length > 0}
            >
              <InputLabel id="videoType">Type</InputLabel>
              <Select
                style={{ width: "250px" }}
                id="selectFileType"
                label="Select Video"
                onChange={handleTypeChange}
                value={filterType}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Movie">Movies</MenuItem>
                <MenuItem value="Seasons">Webseries</MenuItem>

              </Select>
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="provider-type"
              disabled={!videos.length > 0}>
              <InputLabel id="provider-name-label">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Provider Name
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
              </InputLabel>
              <Select
                style={{ width: "250px" }}
                id="selectProvider"
                label="Select Provider"
                onChange={handleSelectProvider}
                value={providerId || ''}
              >
                {providers.map((provider) => (
                  <MenuItem key={provider.id}
                    value={provider.id}
                    title={provider.providerName}>
                    {provider.providerName.length > 30
                      ? provider.providerName.slice(0, 30) + "..."
                      : provider.providerName}

                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="video-name"
              disabled={!videos.length > 0}
            >
              <InputLabel id="videoName">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Video Name
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
              </InputLabel>
              <Select
                style={{ width: "250px" }}
                className="selectVideoName"
                label="Select VideoName"
                onChange={handleTitleChange}
                value={filterTitle}
              >
                {videos.length > 0 && (
                  filteredVideos.map((video, i) => (
                    <MenuItem
                      key={i}
                      value={video.label}
                      title={video.label}>

                      {video.label.length > 30
                        ? video.label.slice(0, 30) + "..."
                        : video.label
                      }
                    </MenuItem>
                  ))
                )}


              </Select>
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="video-showWatermark"
              disabled={!videos.length > 0}
            >
              <InputLabel id="showWatermark">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Show Watermark
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
              </InputLabel>
              <Select
                style={{ width: "250px" }}
                id="showWatermark"
                label="showWatermark"
                onChange={handleWatermarkChange}
                value={showWatermark}
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="2">Original Video</MenuItem>

              </Select>
            </FormControl>

            <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="video-sessionIncrement"
              disabled={!videos.length > 0}
            >
              <InputLabel id="sessionIncrement">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Session Increment
                  <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
              </InputLabel>
              <Select
                style={{ width: "250px" }}
                id="sessionIncrement"
                label="sessionIncrement"
                onChange={handleSessionIncrementChange}
                value={sessionIncrement}
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
            </FormControl>


            <FormControl
              sx={{ m: 1, minWidth: 120, mt: 2, mb: 4 }}
              size="large"
              className="video-sessionIncrement"
              disabled={!videos.length > 0}
            >
              <TextField
                style={{ width: "250px" }}
                onChange={handleSessionTimeoutChange}
                size="large"
                id="sessionTimeout"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Session Timeout (min)
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  </Box>
                }
                type="number"
                InputLabelProps={{ shrink: true }}
                min={1}
                max={3000}
                onInput={(e) => {
                  // Allow only numbers and prevent invalid input
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                defaultValue={10}
              />
            </FormControl> */}

        </div>


        {filteredVideos.length > 0 ? (
          <div className="movies-section">

            {(filterType === 'Movie' || filterType === 'all' && movies.length > 0) && (
              <h4>Movies</h4>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
              {filteredVideos.map(
                (video, i) =>
                  video.type === "Movie" && (
                    <div className="col" key={i}>
                      <div className="video-details">

                        {video.posterFileName ? (
                          <img
                            className="thumbnail img-fluid"
                            alt="thumbnail"
                            src={`${PLAYER_BASE_URL}/${video.id}/thumb.jpg`}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}

                          />
                        ) : (
                          <img
                            className="thumbnail img-fluid"
                            alt="thumbnail"
                            src={DefaultThumbnail}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        )}

                      </div>

                      <div className="provider-details">

                        {video.posterFileName ? (
                          <img
                            className="provider-icon"
                            alt="provider-icon"
                            src={`${PLAYER_BASE_URL}/${video.id}/thumb.jpg`}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <img
                            className="provider-icon"
                            alt="provider-icon"
                            src={DefaultThumbnail}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        )}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <button
                            className="video-title"
                            style={{
                              color: "black",
                              fontWeight: "600",
                              textDecoration: "none",
                              cursor: "default",
                              background: "none",
                              border: "none",
                              padding: 0,
                            }}
                            title={video.label}
                          // onClick={() => handleClick(video)}
                          >
                            {video.label.length > 30 ? video.label.slice(0, 30) + "..." : video.label}
                          </button>


                          {video.viewed === true ? (
                            <button
                              className="video-title"

                              style={{
                                padding: '5px 10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer',
                              }}
                              title={"Play From Begin"}
                              onClick={() => handleClickBegin(video)}
                            >
                              Play From Begin
                            </button>
                          ) : (
                            null
                          )}

                        </div>

                      </div>

                    </div>
                  )
              )}
            </div>
          </div>
        ) : (
          errorMessage && (
            <p style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
              {errorMessage}
            </p>
          )
        )}

        {filteredVideos.length > 0 ? (
          <div className="webseries-section">

            {(filterType === 'Seasons' || filterType === 'all' && webseries.length > 0) && (
              <h4 style={{ marginTop: '40px' }}>Web Series</h4>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
              {filteredVideos.map(
                (video, i) =>
                  video.type === "Seasons" && (
                    <div className="col" key={i}>
                      <div className="video-details">

                        {/* <img
                          className="thumbnail img-fluid"
                          alt="thumbnail"
                          src={video.videoPosterUrl}
                          onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                        /> */}

                        {video.posterFileName ? (
                          <img
                            className="thumbnail img-fluid"
                            alt="thumbnail"
                            src={`${PLAYER_BASE_URL}/${video.id}/thumb.jpg`}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}

                          />
                        ) : (
                          <img
                            className="thumbnail img-fluid"
                            alt="thumbnail"
                            src={DefaultThumbnail}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        )}

                      </div>
                      <div className="provider-details">

                        {/* <img
                          className="provider-icon"
                          alt="provider-icon"
                          src={video.videoPosterUrl}
                          onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                        /> */}

                        {video.posterFileName ? (
                          <img
                            className="provider-icon"
                            alt="provider-icon"
                            src={`${PLAYER_BASE_URL}/${video.id}/thumb.jpg`}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <img
                            className="provider-icon"
                            alt="provider-icon"
                            src={DefaultThumbnail}
                            onClick={() => handleClick(video)} style={{ cursor: "pointer" }}
                          />
                        )}

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <a
                            // href={video.videoUrl}
                            className="video-title"
                            style={{
                              color: "black",
                              fontWeight: "600",
                              textDecoration: "none",
                              cursor: "default",
                            }}
                            title={video.label}
                          >

                            {video.label.length > 30 ? video.label.slice(0, 30) + "..." : video.label}
                          </a>


                          {video.viewed === true ? (
                            <button
                              className="video-title"
                              style={{
                                padding: '5px 10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer',
                              }}
                              title={"Play From Begin"}
                              onClick={() => handleClickBegin(video)}
                            >
                              Play From Begin
                            </button>
                          ) : (
                            null
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : null}

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

      </div >
    </>
  );
}

export default AllVideosContent;
