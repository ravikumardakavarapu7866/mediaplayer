import React, { useState, useEffect } from "react";
import { DataGrid, } from "@mui/x-data-grid";
import apiClient from "../components/Common/apiClient";
import {
  VIDEOPLAYEVENTS_API,
  VIDEOPLAYDETAILS_API,
} from "../components/Common/apiHelper";
import "../../src/components/Common/styles.css";
import CustomToolbar from "../components/Common/customToolbar";
import { formatDateTime } from '../components/Common/dateUtils';

const VideoPlayEvents = () => {
  const [videoPlayEventRows, setVideoPlayEventRows] = useState([]);
  const [videoPlayDetailsRows, setVideoPlayDetailsRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const renderHeaderBold = (params) => (
    <strong>{params.colDef.headerName}</strong>
  );
  const VideosPlayEventsColumns = [
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
      field: "screenWidth",
      headerName: "Screen Width",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "screenHeight",
      headerName: "Screen Height",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userOs",
      headerName: "Operating System",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userBrowser",
      headerName: "Browser",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userIp",
      headerName: "User Ip",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userLocation",
      headerName: "User Location",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userTime",
      headerName: "User Time",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "userTimeZone",
      headerName: "User TimeZone",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 300,
      renderHeader: renderHeaderBold,
    },
  ];

  const VideosPlayDetailsColumns = [
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
      field: "eventType",
      headerName: "Event Type",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "start",
      headerName: "Start",
      width: 100,
      renderHeader: renderHeaderBold,
    },
    {
      field: "end",
      headerName: "End",
      width: 100,
      renderHeader: renderHeaderBold,
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 300,
      renderHeader: renderHeaderBold,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
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
        const videoPlayEventresponse = await apiClient.apiRequest(VIDEOPLAYEVENTS_API, payload); //get the  all videoplayevents
        const formattedData = videoPlayEventresponse.data.map(item => ({
          ...item,
          // userTime: item.userTime ? item.userTime.replace('T', ' ').split('.')[0] : null,
          //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,

          userTime: item.userTime ? formatDateTime(item.userTime) : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));
        setVideoPlayEventRows(formattedData);
        if (formattedData.length > 0) {
          setSelectedRowId(formattedData[0].id); // Select the first row after data is loaded
        }
        getVideoPlaydetailsData(videoPlayEventresponse.data[0].id);
      } catch (error) {
        console.error("Error fetching data..:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVideoPlaydetailsData = async (selectedRowID) => {

    const payload = { selectedRowID };
    try {
      const videoPlayDetailsResponse = await apiClient.apiRequest(VIDEOPLAYDETAILS_API, payload);

      if (videoPlayDetailsResponse.status === 200) {
        const formattedData = videoPlayDetailsResponse.data.map(item => ({
          ...item,
          // userTime: item.userTime ? item.userTime.replace('T', ' ').split('.')[0] : null,
          // createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,

          userTime: item.userTime ? formatDateTime(item.userTime) : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,

        }));
        setVideoPlayDetailsRows(formattedData);
      }
    } catch (error) {
      console.error("Error while getting the VideoPlayDetailsRows :", error);
    }
  };

  const handleRowClick = async (params) => {

    setSelectedRowId(params.row.id);
    const selectedRowID = params.row.id;
    const payload = { selectedRowID };
    try {
      const videoPlayDetailsResponse = await apiClient.apiRequest(VIDEOPLAYDETAILS_API, payload);

      if (videoPlayDetailsResponse.status === 200) {
        const formattedData = videoPlayDetailsResponse.data.map(item => ({
          ...item,
          // createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));
        setVideoPlayDetailsRows(formattedData);
      } else {
        setVideoPlayDetailsRows('');
      }
    } catch (error) {
      console.error("Error while getting the VideoPlayDetailsRows :", error);
    }
  };


  const getRowClassName = (params) => {
    return params.id === selectedRowId ? 'highlight-row' : '';
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ height: 350, width: "95%" }}>
        <div style={{ padding: "10px", marginBottom: "10px" }}>
          <strong>Videos Play Events</strong>
        </div>
        <DataGrid
          rows={videoPlayEventRows}
          columns={VideosPlayEventsColumns}
          slots={{ toolbar: CustomToolbar }}
          loading={loading}
          onRowClick={handleRowClick}
          getRowClassName={getRowClassName}

        />
      </div>

      <div style={{ height: 250, width: "95%" }}>
        <div
          style={{ padding: "10px", marginBottom: "10px", marginTop: "80px" }}
        >
          <strong>Details</strong>
        </div>
        <DataGrid
          rows={videoPlayDetailsRows}
          columns={VideosPlayDetailsColumns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default VideoPlayEvents;
