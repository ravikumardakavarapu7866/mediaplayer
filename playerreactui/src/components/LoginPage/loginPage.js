import "../../components/Common/styles.css";
import { FaUser, FaLock, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import encryptData from "../Authentication/encryptPayloadData";
import { REACT_APP_BASE_URL, LOGIN_API, USERTOKEN_API, GETSERVERDATEANDTIME_API } from "../Common/apiHelper";
import axios from "axios";
import { FaSpinner, FaEye } from "react-icons/fa";
import { getBuildTime, initialize, } from "../../../src/components/Common/fetchConfig";
import apiClient from "../Common/apiClient";


let reactAppBuild = "";

const setupBuild = async () => {
  await initialize();
  reactAppBuild = getBuildTime();
};

setupBuild();

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();

    //cleare existing error messages
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const trimmedEmail = email.trim();
    // Validate email
    if (!trimmedEmail || trimmedEmail === "" || trimmedEmail == null) {
      return setEmailError("Please enter user email");
    } else {
      setEmailError("");
    }

    // Validate password
    if (!password || password === "" || password == null) {
      return setPasswordError("Please enter password");
    } else {
      setPasswordError("");
    }

    // Check if both email and password are valid
    if (trimmedEmail && password) {
      setIsLoading(true);

      const payload = { email: trimmedEmail, password };


      try {
        const response = await apiClient.apiRequest(LOGIN_API, payload);

        if (response.status === 200) {
          const serverDateAndTime = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);
          console.log("serverDateAndTime.." + serverDateAndTime.data);         
          sessionStorage.setItem('serverTime', serverDateAndTime.data);
          sessionStorage.setItem('userEmail', email);
          sessionStorage.setItem('userId', response.data.userId);
          sessionStorage.setItem('userRole', response.data.userRole);
          
          sessionStorage.setItem('loginUserEmail', email);
          sessionStorage.setItem('loginUserId', response.data.userId);
          sessionStorage.setItem('loginUserRole', response.data.userRole);          
          sessionStorage.setItem('userImpersonate', "false");

          const userID = response.data.userId;
          const payloadUserID = { userID };
          const payloadJSON = JSON.stringify(payloadUserID);
          const encryptedPayload = encryptData(payloadJSON);

          const userToken = encryptedPayload;
          if (userToken && userToken !== 'null') {
            sessionStorage.setItem("userToken", userToken);
          }
          navigate("/dashboard");
        } else {
          setLoginError("Invalid email or password");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoginError("Invalid email or password.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // const fetchServerTime = async () => {

  //   const response = await apiClient.apiRequest(GETSERVERDATEANDTIME_API);

  //   if (response.status === 200) {

  //     return response.data;
  //   }
  //   else {

  //   }

  // };

  return (
    <div className="login-Form">
      <div className="build-Number"><strong style={{ textAlign: "center" }}>{reactAppBuild}</strong></div>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="image-div"></div>
          {loginError && (
            <label severity="error" style={{ color: "red" }} sx={{ mt: 2 }}>
              {loginError}
            </label>
          )}
          {emailError && (
            <div className="error" style={{ color: "red" }}>
              {emailError}
            </div>
          )}
          {passwordError && (
            <div className="error" style={{ color: "red" }}>
              {passwordError}
            </div>
          )}
          <div className="input-box">
            <input
              type="text"
              placeholder="User Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          {/* <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div> */}
          <div className="input-box password-input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {showPassword ? (
              <FaEye className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
            ) : (

              <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
          <div className="login-btn">
            <button type="submit" name="login"
              className={`btn ${isLoading ? "loading" : ""}`}
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="spinner" />
              ) : (
                <span className='btn-text'>
                  Login
                </span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
