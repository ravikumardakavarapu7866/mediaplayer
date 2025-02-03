import React, { useState, useEffect } from "react";
import "../../src/components/Common/styles.css";
import { DataGrid } from "@mui/x-data-grid";
import apiClient from "../components/Common/apiClient";
import axios from "axios";
import encryptData from '../components/Authentication/encryptPayloadData';
import CustomToolbar from "../components/Common/customToolbar";
import {
  REACT_APP_BASE_URL,
  VIDEODETAILPROGRESS_API,
  VIDEODETAILUSER_API,
} from "../components/Common/apiHelper";
import { formatDateTime } from '../components/Common/dateUtils';


const VideosPlaybackInformation = () => {
  const [videoDetailsProgress, setvideoDetailsProgress] = useState([]);
  const [userDetailsRows, setuserDetailsRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const renderHeaderBold = (params) => (
    <strong>{params.colDef.headerName}</strong>
  );

  const videDetailsProgressColumns = [
    {
      field: "userEmail",
      headerName: "User Email",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "videoName",
      headerName: "Video Name",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "providerName",
      headerName: "Provider Name",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "type",
      headerName: "Video Type",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "seasonNumber",
      headerName: "Season",
      width: 100,
      renderHeader: renderHeaderBold,
    },
    {
      field: "episodeNumber",
      headerName: "Episode",
      width: 100,
      renderHeader: renderHeaderBold,
    },
    {
      field: "episodeName",
      headerName: "Episode Name",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "currentTime",
      headerName: "Last Position (Seconds)",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "duration",
      headerName: "Video Total Duration (Seconds)",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "updatedDate",
      headerName: "Updated Date",
      width: 300,
      renderHeader: renderHeaderBold,
    },
  ];

  const userDetailsColumns = [
    {
      field: "clientOs",
      headerName: "Operating System",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "clientBrowser",
      headerName: "Browser",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "clientIp",
      headerName: "User IP",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "clientLoc",
      headerName: "User Location",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "createdDate",
      headerName: "Date",
      width: 300,
      renderHeader: renderHeaderBold,
    },
  ];


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userID = sessionStorage.getItem('userId');
      const payload = { userID }
      try {
        const videoDetailsProgress = await apiClient.apiRequest(VIDEODETAILPROGRESS_API, payload);
        const formattedData = videoDetailsProgress.data.map(item => ({
          ...item,
          // updatedDate: item.updatedDate ? item.updatedDate.replace('T', ' ').split('.')[0] : null,
          //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,

          updatedDate: item.updatedDate ? formatDateTime(item.updatedDate) : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));

        setvideoDetailsProgress(formattedData);
        if (formattedData.length > 0) {
          setSelectedRowId(formattedData[0].id); // Select the first row after data is loaded
        }
        getVideoDetailsUserData(videoDetailsProgress.data[0].id);
      } catch (error) {
        console.error("Error fetching data..:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVideoDetailsUserData = async (selectedRowID) => {
    //encrypted payload
    const payload = { selectedRowID };
    try {
      const videoDetailsUserResponse = await apiClient.apiRequest(VIDEODETAILUSER_API, payload);

      if (videoDetailsUserResponse.status === 200) {
        const formattedData = videoDetailsUserResponse.data.map(item => ({
          ...item,
          //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));
        setuserDetailsRows(formattedData);
      }
    } catch (error) {
      console.error("Error while getting the userDetailsRows:", error);
    }
  };

  const handleRowClick = async (params) => {
    setSelectedRowId(params.row.id);
    const selectedRowID = params.row.id;
    const payload = { selectedRowID };

    try {
      const userDetailsResponse = await apiClient.apiRequest(VIDEODETAILUSER_API, payload);

      if (userDetailsResponse.status === 200) {
        const formattedData = userDetailsResponse.data.map(item => ({
          ...item,
          //  createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));
        setuserDetailsRows(formattedData);
      } else {
        setuserDetailsRows('');
      }
    } catch (error) {
      console.error("Error while getting the userDetailsRows :", error);
    }
  };


  const getRowClassName = (params) => {
    return params.id === selectedRowId ? 'highlight-row' : '';
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ height: 350, width: "95%" }}>
        <div style={{ padding: "10px", marginBottom: "10px" }}>
          <strong>Videos Playback Information</strong>
        </div>
        <DataGrid
          rows={videoDetailsProgress}
          columns={videDetailsProgressColumns}
          slots={{ toolbar: CustomToolbar }}
          loading={loading}
          onRowClick={handleRowClick}
          getRowClassName={getRowClassName}

        />
      </div>

      <div style={{ height: 250, width: "95%", }}>
        <div
          style={{ padding: "10px", marginBottom: "10px", marginTop: "80px" }}
        >
          <strong>Details</strong>
        </div>
        <DataGrid
          rows={userDetailsRows}
          columns={userDetailsColumns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default VideosPlaybackInformation;
