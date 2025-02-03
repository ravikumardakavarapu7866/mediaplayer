import React from 'react';

const Modal = ({ isOpen, onClose, onAdd, providerName, setProviderName, errorMessagee, setErrorMessagee }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setProviderName(e.target.value);
    setErrorMessagee(''); // Clear feedback message when the user starts typing
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h4>Add Provider</h4>
        {errorMessagee && <div style={modalStyles.errorMessage}>{errorMessagee}</div>}
        <input
          type="text"
          value={providerName}
          onChange={handleInputChange}
          placeholder="Enter Provider Name"
          style={modalStyles.input}
          maxLength={100}
        />
        <div style={modalStyles.buttonContainer}>
          <button type="button" onClick={onAdd} style={modalStyles.button}>
            Add
          </button>
          <button type="button" onClick={onClose} style={modalStyles.button}>
            Close
          </button>
        </div>
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
    zIndex: "9999",
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    width: '400px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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

export default Modal;