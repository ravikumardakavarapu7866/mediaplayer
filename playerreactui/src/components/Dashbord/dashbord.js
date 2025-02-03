import SideNavigation from "./sidebarNavigation";
import React, { useState, useEffect } from "react";
import ViewContent from "./viewContent";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Dashbord() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { state } = useLocation(); // Get the state from the location
  const [selectedView, setSelectedView] = useState(() => {
    // Initialize selectedView from sessionStorage or default to "allVideos"
    return sessionStorage.getItem("selectedView") || "allVideos";
  });

  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => {
    if (userRole === "Super Admin" || userRole === "Admin") {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [userRole]);

  // Set the view based on the state passed from impersonate.js
  useEffect(() => {
    if (state && state.selectedView) {
      setSelectedView(state.selectedView); // Set the view from the state
      sessionStorage.setItem("selectedView", state.selectedView); // Update sessionStorage
    }
  }, [state]);

  const handleViewChange = (newView) => {
    setSelectedView(newView);
    sessionStorage.setItem("selectedView", newView); // Persist selected view in sessionStorage
  };

  const current_theme = sessionStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");

  useEffect(() => {
    sessionStorage.setItem("current_theme", theme);
  }, [theme]);

  return (
    <div className={`dashbord-container ${theme}`}>
      <div className="header-container">
        <Navbar
          onViewChange={handleViewChange}
          theme={theme}
          setTheme={setTheme}
        />
      </div>
      <div className="content-div">
        {showSidebar && (
          <div className="sidebar-container">
            <SideNavigation
              onViewChange={handleViewChange}
              theme={theme}
              setTheme={setTheme}
              selectedView={selectedView}
            />
          </div>
        )}
        <div className="content-margin view-content">
          <ViewContent view={selectedView} /> {/* Use selectedView here */}
        </div>
      </div>
    </div>
  );
}

export default Dashbord;