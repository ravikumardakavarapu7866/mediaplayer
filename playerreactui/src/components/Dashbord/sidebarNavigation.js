import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Menu, MenuItem, ProSidebar, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../../components/Common/styles.css";

//icons

import { LiaPhotoVideoSolid } from "react-icons/lia";
import { MdInsertChartOutlined } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { VscServerProcess } from "react-icons/vsc";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { RiVideoUploadFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import Divider from "@mui/material/Divider";
import { FaUsers } from "react-icons/fa6";

const SideNavigation = ({ onViewChange, selectedView }) => {

  const [collapsed, setCollapsed] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [activeItem, setActiveItem] = useState(selectedView);

  const userRole = sessionStorage.getItem('userRole');

  const [currentTheme, setCurrentTheme] = useState(
    sessionStorage.getItem("current_theme")
  );

  //proSidebar and menuicon styles
  const styles = {
    sideBarHeight: {
      height: "100vh",
      innerWidth: "100px",
    },
    menuIcon: {
      float: "right",
      margin: "10px",
    },
  };

  const onClickMenuIcon = () => {
    setCollapsed(!collapsed);
  };

  const handleMouseEnter = (text) => {
    setHoverText(text);
  };

  const handleMouseLeave = () => {
    setHoverText("");
  };

  useEffect(() => {
    sessionStorage.setItem("current_theme", currentTheme);
  }, [currentTheme]);

  const handleMenuItemClick = (view) => {
    setActiveItem(view);
    sessionStorage.setItem('selected_view', view);
    onViewChange(view);
  };



  return (
    <ProSidebar style={{ ...styles.sideBarHeight, cursor: 'pointer' }} collapsed={collapsed}>
      <Divider style={{ backgroundColor: "#fff" }} />
      <SidebarHeader className="sidebar-header">
        <div style={styles.menuIcon} onClick={onClickMenuIcon}>
          <AiOutlineMenu />
        </div>
      </SidebarHeader>
      <div className="menu-items-container">
        <Menu >
          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("All-Videos")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<LiaPhotoVideoSolid style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("allVideos")}
              style={{ backgroundColor: activeItem === "allVideos" ? "#615d60" : "transparent", }}
            >
              All-Videos
            </MenuItem>
          ) : (
            <MenuItem
              icon={<LiaPhotoVideoSolid style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"All-Videos".length > 16 ? "All-Videos" : ""}
              onClick={() => handleMenuItemClick("allVideos")}
              style={{ backgroundColor: activeItem === "allVideos" ? "#615d60" : "transparent", }}
            >
              {"All-Videos".length > 16
                ? `${"All-Videos".substring(0, 16)}...`
                : "All-Videos"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Aspect Ratios")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<MdInsertChartOutlined style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("aspectRatio")}
              style={{ backgroundColor: activeItem === "aspectRatio" ? "#615d60" : "transparent", }}
            >
              Aspect Ratios
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdInsertChartOutlined style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Aspect Ratios".length > 16 ? "Aspect Ratios" : ""}
              onClick={() => handleMenuItemClick("aspectRatio")}
              style={{ backgroundColor: activeItem === "aspectRatio" ? "#615d60" : "transparent", }}
            >
              {"Aspect Ratios".length > 16
                ? `${"Aspect Ratios".substring(0, 16)}...`
                : "Aspect Ratios"}
            </MenuItem>
          )}

          {userRole === "Super Admin" && (
            collapsed ? (
              <MenuItem
                onMouseEnter={() => handleMouseEnter("Authorization Failures")}
                onMouseLeave={handleMouseLeave}
                title={hoverText}
                icon={<LiaPhotoVideoSolid style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
                onClick={() => handleMenuItemClick("authorizationFailures")}
                style={{ backgroundColor: activeItem === "authorizationFailures" ? "#615d60" : "transparent" }}
              >
                Authorization Failures
              </MenuItem>
            ) : (
              <MenuItem
                icon={<LiaPhotoVideoSolid style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
                title={"Authorization Failures".length > 16 ? "Authorization Failures" : ""}
                onClick={() => handleMenuItemClick("authorizationFailures")}
                style={{ backgroundColor: activeItem === "authorizationFailures" ? "#615d60" : "transparent" }}
              >
                {"Authorization Failures".length > 16
                  ? `${"Authorization Failures".substring(0, 16)}...`
                  : "Authorization Failures"}
              </MenuItem>
            )
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Configuration")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<GrSecure style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("configuration")}
              style={{ backgroundColor: activeItem === "configuration" ? "#615d60" : "transparent", }}
            >
              Configuration
            </MenuItem>
          ) : (
            <MenuItem
              icon={<GrSecure style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Configuration".length > 16 ? "Configuration" : ""}
              onClick={() => handleMenuItemClick("configuration")}
              style={{ backgroundColor: activeItem === "configuration" ? "#615d60" : "transparent", }}
            >
              {"Configuration".length > 16
                ? `${"Configuration".substring(0, 16)}...`
                : "Configuration"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Consumer Process")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<VscServerProcess style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("consumerProcess")}
              style={{ backgroundColor: activeItem === "consumerProcess" ? "#615d60" : "transparent", }}
            >
              Consumer Process
            </MenuItem>
          ) : (
            <MenuItem
              icon={<VscServerProcess style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Consumer Process".length > 16 ? "Consumer Process" : ""}
              onClick={() => handleMenuItemClick("consumerProcess")}
              style={{ backgroundColor: activeItem === "consumerProcess" ? "#615d60" : "transparent", }}
            >
              {"Consumer Process".length > 16
                ? `${"Consumer Process".substring(0, 16)}...`
                : "Consumer Process"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Delete Videos")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<RiDeleteBin5Line style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("deleteVideos")}
              style={{ backgroundColor: activeItem === "deleteVideos" ? "#615d60" : "transparent", }}
            >
              Delete Videos
            </MenuItem>
          ) : (
            <MenuItem
              icon={<RiDeleteBin5Line style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Delete Videos".length > 16 ? "Delete Videos" : ""}
              onClick={() => handleMenuItemClick("deleteVideos")}
              style={{ backgroundColor: activeItem === "deleteVideos" ? "#615d60" : "transparent", }}
            >
              {"Delete Videos".length > 16
                ? `${"Delete Videos".substring(0, 16)}...`
                : "Delete Videos"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Player Requests")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaCodePullRequest style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("playerReuests")}
              style={{ backgroundColor: activeItem === "playerReuests" ? "#615d60" : "transparent", }}
            >
              Player Requests
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaCodePullRequest style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Player Requests".length > 16 ? "Player Requests" : ""}
              onClick={() => handleMenuItemClick("playerReuests")}
              style={{ backgroundColor: activeItem === "playerReuests" ? "#615d60" : "transparent", }}
            >
              {"Player Requests".length > 16
                ? `${"Player Requests".substring(0, 16)}...`
                : "Player Requests"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Providers")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaUsers style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("providers")}
              style={{ backgroundColor: activeItem === "providers" ? "#615d60" : "transparent", }}
            >
              Providers
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaUsers style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Providers".length > 16 ? "Providers" : ""}
              onClick={() => handleMenuItemClick("providers")}
              style={{ backgroundColor: activeItem === "providers" ? "#615d60" : "transparent", }}
            >
              {"Providers".length > 16
                ? `${"Providers".substring(0, 16)}...`
                : "Providers"}
            </MenuItem>
          )}



          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Thumbnail Upload")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaFileUpload style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("thumbnailUpload")}
              style={{ backgroundColor: activeItem === "thumbnailUpload" ? "#615d60" : "transparent", }}
            >
              Thumbnail Upload
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaFileUpload style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Thumbnail Upload".length > 16 ? "Thumbnail Upload" : ""}
              onClick={() => handleMenuItemClick("thumbnailUpload")}
              style={{ backgroundColor: activeItem === "thumbnailUpload" ? "#615d60" : "transparent", }}
            >
              {"Thumbnail Upload".length > 16
                ? `${"Thumbnail Upload".substring(0, 16)}...`
                : "Thumbnail Upload"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Upload")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<RiVideoUploadFill style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("upload")}
              style={{ backgroundColor: activeItem === "upload" ? "#615d60" : "transparent", }}
            >
              Upload
            </MenuItem>
          ) : (
            <MenuItem
              icon={<RiVideoUploadFill style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"Upload".length > 16 ? "Upload" : ""}
              onClick={() => handleMenuItemClick("upload")}
              style={{ backgroundColor: activeItem === "upload" ? "#615d60" : "transparent", }}
            >
              {"Upload".length > 16
                ? `${"Upload".substring(0, 16)}...`
                : "Upload"}
            </MenuItem>
          )}


          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("User Impersonate")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaUser style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("userImpersonate")}
              style={{ backgroundColor: activeItem === "userImpersonate" ? "#615d60" : "transparent", }}
            >
              User Impersonate
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaUser style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"User Impersonate".length > 16 ? "User Impersonate" : ""}
              onClick={() => handleMenuItemClick("userImpersonate")}
              style={{ backgroundColor: activeItem === "userImpersonate" ? "#615d60" : "transparent", }}
            >
              {"User Impersonate".length > 16 ? `${"User Impersonate".substring(0, 16)}...` : "User Impersonate"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("User Management")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaUserCog style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("userActivateAndDeactivate")}
              style={{ backgroundColor: activeItem === "userActivateAndDeactivate" ? "#615d60" : "transparent", }}
            >
              User Management
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaUserCog style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={
                "User Management".length > 16
                  ? `${"User Management".substring(0, 16)}...`
                  : "User Management"

              }
              onClick={() => handleMenuItemClick("userActivateAndDeactivate")}
              style={{ backgroundColor: activeItem === "userActivateAndDeactivate" ? "#615d60" : "transparent", }}
            >
              {"User Management".length > 16
                ? `${"User Management".substring(0, 16)}...`
                : "User Management"
              }
            </MenuItem>
          )}


          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("User Tokens")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaUser style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("userDetails")}
              style={{ backgroundColor: activeItem === "userDetails" ? "#615d60" : "transparent", }}
            >
              User Tokens
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaUser style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={"User Tokens".length > 16 ? "User Tokens" : ""}
              onClick={() => handleMenuItemClick("userDetails")}
              style={{ backgroundColor: activeItem === "userDetails" ? "#615d60" : "transparent", }}
            >
              {"User Tokens".length > 16 ? `${"User Tokens".substring(0, 16)}...` : "User Tokens"}
            </MenuItem>
          )}


          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Videos Play Events")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaRegPlayCircle style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("videosPlayEvents")}
              style={{ backgroundColor: activeItem === "videosPlayEvents" ? "#615d60" : "transparent", }}
            >
              Videos Play Events
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaRegPlayCircle style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={
                "Videos Play Events".length > 16 ? "Videos Play Events" : ""
              }
              onClick={() => handleMenuItemClick("videosPlayEvents")}
              style={{ backgroundColor: activeItem === "videosPlayEvents" ? "#615d60" : "transparent", }}
            >
              {"Videos Play Events".length > 16
                ? `${"Videos Play Events".substring(0, 16)}...`
                : "Videos Play Events"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() =>
                handleMouseEnter("Videos Playback Information")
              }
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<FaFileVideo style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("videosPlayBackInformation")}
              style={{ backgroundColor: activeItem === "videosPlayBackInformation" ? "#615d60" : "transparent", }}
            >
              Videos Playback Information
            </MenuItem>
          ) : (
            <MenuItem
              icon={<FaFileVideo style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={
                "Videos Playback Information".length > 16
                  ? "Videos Playback Information"
                  : ""
              }
              onClick={() => handleMenuItemClick("videosPlayBackInformation")}
              style={{ backgroundColor: activeItem === "videosPlayBackInformation" ? "#615d60" : "transparent", }}
            >
              {"Videos Playback Information".length > 16
                ? `${"Videos Playback Information".substring(0, 16)}...`
                : "Videos Playback Information"}
            </MenuItem>
          )}

          {collapsed ? (
            <MenuItem
              onMouseEnter={() => handleMouseEnter("Videos Upload Status")}
              onMouseLeave={handleMouseLeave}
              title={hoverText}
              icon={<GiProgression style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              onClick={() => handleMenuItemClick("videoUploadStatus")}
              style={{ backgroundColor: activeItem === "videoUploadStatus" ? "#615d60" : "transparent", }}
            >
              Videos Upload Status
            </MenuItem>
          ) : (
            <MenuItem
              icon={<GiProgression style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />}
              title={
                "Videos Upload Status".length > 16 ? "Videos Upload Status" : ""
              }
              onClick={() => handleMenuItemClick("videoUploadStatus")}
              style={{ backgroundColor: activeItem === "videoUploadStatus" ? "#615d60" : "transparent", }}
            >
              {" Videos Upload Status".length > 16
                ? `${"Videos Upload Status".substring(0, 16)}...`
                : "Videos Upload Status"}
            </MenuItem>
          )}
        </Menu>
      </div>
    </ProSidebar >
  );
};

export default SideNavigation;
