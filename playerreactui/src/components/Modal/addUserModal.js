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
  Typography
} from '@mui/material';
import apiClient from '../Common/apiClient';
import { ACTIVEPROVIDRS_API, GETUSERROLES_API } from '../Common/apiHelper';
import '../Common/styles.css';

const AddUserModal = ({ open, onClose, onAdd, selectedRow }) => {


  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  useEffect(() => {
    if (open) {
      fetchProviders();
      fetchUserRoles();
    }
  }, [open]);

  useEffect(() => {
    if (selectedRow) {
      setSelectedProvider(selectedRow.providerName);
      setSelectedRole(selectedRow.role);
      setUserEmail(selectedRow.userEmail);
      setPassword(selectedRow.password);

    } else {
      clearFields();
    }
  }, [selectedRow]);


  const fetchProviders = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(ACTIVEPROVIDRS_API, payload);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchUserRoles = async () => {
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(GETUSERROLES_API, payload);
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };


  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
    setErrorMessage('');
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setErrorMessage('');
  };

  const handleClose = () => {
    clearFields();
    onClose();
  };


  const clearFields = () => {
    setSelectedProvider('');
    setSelectedRole('');
    setUserEmail('');
    setPassword('');
    setErrorMessage('');
  };

  const handleAdd = async () => {

    if (!selectedProvider) {
      setErrorMessage('Provider Name is required.');
      return;
    } if (!selectedRole) {
      setErrorMessage('Role is required.');
      return;

    } if (!userEmail) {
      setErrorMessage('User Email is required.');
      return;

    } if (!password) {
      setErrorMessage('Password is required.');
      return;

    }

    const payload = {
      id: selectedRow ? selectedRow.id : null,
      providerName: selectedProvider,
      roleName: selectedRole,
      userEmail: userEmail,
      password: password,
    };
    onAdd(payload);
    onClose();
    clearFields();
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
        <h2>{selectedRow ? 'Edit User' : 'Add User'}</h2>
        {errorMessage && <div style={modalStyles.errorMessage}>{errorMessage}</div>}

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
            value={selectedProvider || ''}
            onChange={handleProviderChange}
            label="Provider Name"
            className="input-select-option"
          >
            <option value="" disabled hidden>Select  Provider Name</option>
            {providers.map(item => (
              <option key={item.id} value={item.providerName} title={item.providerName}>
                {item.providerName.length > 30 ? `${item.providerName.substring(0, 30)}...` : item.providerName}
              </option>
            ))}
          </select>
        </div>


        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Role
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <select
            className="input-select-option"
            labelId="userRole"
            value={selectedRole || ''}
            onChange={handleRoleChange}
          >
            {roles.map((item) => (
              <MenuItem key={item.id} value={item.roleName}>
                {item.roleName}
              </MenuItem>
            ))}

            <option value="" disabled hidden>Select Role</option>
            {roles.map(item => (
              <option key={item.id} value={item.roleName} title={item.roleName}>
                {item.roleName.length > 30 ? `${item.roleName.substring(0, 30)}...` : item.roleName}
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
          <input
            className="input-select-option"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              setErrorMessage('');
            }}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 100 }}
            helperText={`${userEmail.length}/100 characters`}
          />
        </div>

        <div className="fieldContainer">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            User Password
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          </Box>
          <input
            className="input-select-option"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />
        </div>

        <div style={modalStyles.buttonContainer}>
          <Button variant="contained" onClick={handleAdd} style={modalStyles.button}>Save</Button>
          <Button variant="outlined" onClick={handleClose} style={modalStyles.button}>Close</Button>
        </div>
      </Box>
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

export default AddUserModal;