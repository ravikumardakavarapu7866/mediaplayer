import React, { useState } from "react";
import "../Common/styles.css";
import SuresbyheaderLogo from "../../assets/images/Suresby1.png";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem } from "@mui/material";
import { getBuildTime, initialize, } from "../../../src/components/Common/fetchConfig";
import apiClient from "../Common/apiClient";

import { USERTOKENVIDEOS_API } from '../Common/apiHelper';
import encryptData from "../../components/Authentication/encryptPayloadData";


// let reactAppBuild = "";

// const setupBuild = async () => {
//   await initialize();
//   reactAppBuild = getBuildTime();
// };

//setupBuild();

function Navbar({ theme, setTheme, onViewChange }) {
  const { state } = useLocation();
  const loginUserEmail = sessionStorage.getItem('userEmail');
  const [darkMode, setDarkMode] = React.useState(true);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    theme === "light" ? setTheme("dark") : setTheme("light");
    setTheme(darkMode ? "light" : "dark");
  };

  const handleLogoClick = () => {
    onViewChange("allVideos");
  };

  const userImpersonate = sessionStorage.getItem('userImpersonate');

  const actualLoginUserId = sessionStorage.getItem('loginUserId');
  const actualLoginUserEmail = sessionStorage.getItem('loginUserEmail');
  const actualloginUserRole = sessionStorage.getItem('loginUserRole');


  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleMenuClose();
    sessionStorage.removeItem("selectedView");
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('selected_view');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('serverTime');

    sessionStorage.removeItem('userImpersonate');
    sessionStorage.removeItem('loginUserEmail');
    sessionStorage.removeItem('loginUserId');
    sessionStorage.removeItem('loginUserRole');

    navigate("/login");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEndClick = async () => {
    try {
      sessionStorage.setItem('userImpersonate', "false");
      sessionStorage.setItem('userEmail', actualLoginUserEmail);
      sessionStorage.setItem('userId', actualLoginUserId);
      sessionStorage.setItem('userRole', actualloginUserRole);
      sessionStorage.removeItem('selectedView');
      sessionStorage.removeItem('serverTime');
      sessionStorage.setItem("selectedView", "allVideos");

      const userID = actualLoginUserId;
      const payloadUserID = { userID };
      const payloadJSON = JSON.stringify(payloadUserID);
      const encryptedPayload = encryptData(payloadJSON);

      const userToken = encryptedPayload;
      if (userToken && userToken !== 'null') {
        sessionStorage.setItem("userToken", userToken);
      }
      navigate("/dashboard", { state: { selectedView: "userImpersonate" } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const firstLetter = loginUserEmail.charAt(0).toUpperCase();
  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="header-content">
        <strong style={{ textAlign: "center" }}>{loginUserEmail}</strong>
        <div className="left-content">
          {/* <strong style={{ textAlign: "center" }}>{reactAppBuild}</strong> */}
          <div className="toggle-icon">
            {/* <DarkModeSwitch checked={darkMode} onChange={handleToggle} /> */}
          </div>
          <div className="right-links">
            {userImpersonate === 'true' && (
              <a href="#" onClick={handleEndClick}>End Impersonate</a>
            )}
          </div>
          <div className="Avatar-tooltip">
            {/* <Tooltip title={loginUserEmail}> */}
            <IconButton sx={{ p: 0 }} onClick={handleAvatarClick}>
              <Avatar alt={loginUserEmail}>{firstLetter}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>

            {/* </Tooltip> */}
          </div>
        </div>
        <a onClick={handleLogoClick}>
          <span>
            <img
              src={SuresbyheaderLogo}
              alt="Logo"
              style={{
                width: "100px",
                height: "40px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}
            />
          </span>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
