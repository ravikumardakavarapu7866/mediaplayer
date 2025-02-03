import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import apiClient from "../components/Common/apiClient";
import { DELETEVIDEOS_API, DELETE_API } from "../components/Common/apiHelper";
import "../../src/components/Common/styles.css";
import Button from "@mui/material/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import CustomToolbar from '../components/Common/customToolbar';
import { formatDate } from '../components/Common/dateUtils';

const DeleteVideos = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const renderHeaderBold = (params) => (
    <strong>{params.colDef.headerName}</strong>
  );
  const columns = [
    {
      field: "action",
      headerName: "Actions",
      width: 100,
      renderHeader: renderHeaderBold,
      renderCell: (params) => (
        <RiDeleteBinLine
          title="Delete"
          id={`delete-button-${params.row.id}`}
          onClick={() => handleDelete(params.row.id)}
          color="secondary"
          variant="contained"
          size="20px"
          style={{ cursor: "pointer", "&:hover": { cursor: "pointer" } }}
        >
          {" "}
          Delete{" "}
        </RiDeleteBinLine>
      ),
    },
    {
      field: "providerName",
      headerName: "Provider Name",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "videoName",
      headerName: "Video Name",
      width: 200,
      renderHeader: renderHeaderBold,
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderHeader: renderHeaderBold,
      type: "boolean",
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
      field: "releaseDate",
      headerName: "Release Date",
      width: 200,
      renderHeader: renderHeaderBold,
      valueGetter: (params) => {
        return formatDate(params.row.releaseDate);
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 200,
      renderHeader: renderHeaderBold,
      valueGetter: (params) => {
        return formatDate(params.row.endDate);
      },
    },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    const userID = sessionStorage.getItem('userId');
    const payload = { userID };
    try {
      const response = await apiClient.apiRequest(DELETE_API, payload);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //...........Clear the feedback message after 3 seconds.........//

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

  //.............delete selected reords process...........//

  const handleDeleteCancel = () => {
    setShowConfirmation(false);
  };
  const handleDelete = async (ids) => {
    //console.log("Selected IDs...:", ids);
    setSelectedIds(ids);
    setShowConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmation(false);
    setLoading(true);
    const payload = { selectedIds };

    try {
      const response = await apiClient.apiRequest(DELETEVIDEOS_API, payload);
      if (response.status === 200) {
        await fetchData(); // Fetch updated data after deletion
        setFeedbackMessage(response.data.message); // Show success message
      } else {
        setFeedbackMessage(response.data.message);
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          await fetchData();
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
  };

  return (
    <div style={{ height: '90%', width: "95%" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Delete Videos</strong>
        </div>
      </div>
      {feedbackMessage && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {feedbackMessage}
        </div>
      )}

      {showConfirmation && (
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
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h4>Are you sure you want to delete..?</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                style={{ marginRight: "10px" }}
              >
                Yes
              </Button>
              <Button
                onClick={handleDeleteCancel}
                color="success"
                variant="contained"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataGrid
        rows={rows}
        pageSize={10}
        columns={columns}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}


      />
    </div>
  );
};

export default DeleteVideos;
