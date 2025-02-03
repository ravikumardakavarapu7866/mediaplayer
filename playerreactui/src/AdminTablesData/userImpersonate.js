import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { THUMBNAILPROVIDER_API, LOGIN_API, PROVIDERUSERS_API, IMPERSONATE_API } from "../components/Common/apiHelper";
import { ClipLoader } from 'react-spinners';
import apiClient from '../components/Common/apiClient';
import { useNavigate } from "react-router-dom";
import encryptData from "../components/Authentication/encryptPayloadData";


const UserImpersonate = () => {
  const [formData, setFormData] = useState({
    providerName: '',
    userEmail: '',

  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeProviders, setActiveProviders] = useState([]);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [userDto, setUserDto] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);

  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(THUMBNAILPROVIDER_API, payload);
      setActiveProviders(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
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
    setErrorMessage('');
    await fetchSeletedProviderUsers(selectedProviderId);

  };

  const handleSelectUser = async (e) => {
    setErrorMessage('');
    const selectedUserId = e.target.value;
    const selectedUser = userDto.find(user => user.id === selectedUserId);
    setSelectedUserId(selectedUserId);
    setFormData(prevFormData => ({
      ...prevFormData,
      providerName: selectedUser.userName
    }));
    setErrorMessage('');
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


  useEffect(() => {
    fetchProviders();
  }, []);

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


  const handleImpersonate = async (e) => {
    e.preventDefault();

    if (validateForm()) {

      try {
        setLoading(true);
        const payload = { userID: selectedUserId }
        const userDataResponse = await apiClient.apiRequest(IMPERSONATE_API, payload);
        if (userDataResponse.status === 200) {



          const selectedUserEmail = userDataResponse.data.userEmail;
          const seletedUserPassword = userDataResponse.data.password;

          const payload = { email: selectedUserEmail, password: seletedUserPassword }



          const response = await apiClient.apiRequest(LOGIN_API, payload);

          if (response.status === 200) {

            sessionStorage.setItem('userImpersonate', "true");
            sessionStorage.setItem('userEmail', selectedUserEmail);
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('userRole', response.data.userRole);
            sessionStorage.removeItem('selectedView');
            sessionStorage.removeItem('serverTime');
            sessionStorage.setItem("selectedView", "allVideos");



            const userID = response.data.userId;
            const payloadUserID = { userID };
            const payloadJSON = JSON.stringify(payloadUserID);
            const encryptedPayload = encryptData(payloadJSON);

            const userToken = encryptedPayload;
            if (userToken && userToken !== 'null') {
              sessionStorage.setItem("userToken", userToken);
            }
            navigate("/dashboard", { state: { selectedView: "allVideos" } });
          }

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
  }

  const validateForm = () => {
    if (!providerId) {
      setErrorMessage('Provider Name is required.');
      return false;
    }
    if (selectedUserId.length === 0) {
      setErrorMessage('User Email is required.');
      return false;
    }
    setErrorMessage('');
    return true;
  };


  return (
    <Box>
      {/* <div style={{ padding: "10px", marginTop: "5px" }}>
        <strong>User Impersonate</strong>
      </div> */}

      <Box
        component="form"
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
        <Typography variant="h5" sx={{ marginBottom: "20px" }}>User Impersonate</Typography>

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
          <select
            labelId="provider-name-label"
            name="providerName"
            value={providerId || ''}
            onChange={handleSelectProvider}
            label="Provider Name"
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
            User Email
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <select
            className="input-select-option"
            labelId="userEamil-label"
            name="userEamil"
            value={selectedUserId || ''}
            onChange={handleSelectUser}
            label="User Email"
            sx={{ mb: 4 }}
            disabled={!userDto.length > 0}
          >
            {userDto && userDto.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.userEmail}
              </MenuItem>
            ))}

            <option value="" disabled hidden>Select User Email</option>
            {userDto.map(item => (
              <option key={item.id} value={item.id} title={item.userEmail}>
                {item.userEmail.length > 30 ? `${item.userEmail.substring(0, 30)}...` : item.userEmail}
              </option>
            ))}

          </select>
        </div>


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
          <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 1 }} onClick={handleImpersonate}>
            Impersonate
          </Button>
        </Box>
      </Box >
    </Box>
  );

};

export default UserImpersonate;
