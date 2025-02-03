import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { GETAUTHFAILURES_API } from '../components/Common/apiHelper';
import CustomToolbar from '../components/Common/customToolbar';
import { formatDateTime } from '../components/Common/dateUtils';

const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
const columns = [
  { field: "requestUrl", headerName: "Request Url", width: 200, renderHeader: renderHeaderBold, },
  { field: "referer", headerName: "	Referer", width: 200, renderHeader: renderHeaderBold, },
  { field: "userAgent", headerName: "User Agent", width: 400, renderHeader: renderHeaderBold, },
  { field: "authToken", headerName: "Auth Token", width: 400, renderHeader: renderHeaderBold, },
  { field: "authType", headerName: "Type", width: 100, renderHeader: renderHeaderBold, },
  { field: "payload", headerName: "Payload", width: 100, renderHeader: renderHeaderBold, },
  { field: "isInternal", headerName: "Is Internal", width: 100, renderHeader: renderHeaderBold, },
  { field: "userIp", headerName: "User Ip", width: 250, renderHeader: renderHeaderBold, },
  { field: "statusMessage", headerName: "Status Message", width: 250, renderHeader: renderHeaderBold, },
  { field: "createdDate", headerName: "Created DateTime", width: 250, renderHeader: renderHeaderBold, }

]


const AuthorizationFailures = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userID = sessionStorage.getItem('userId');
      const payload = { userID };
      try {
        const response = await apiClient.apiRequest(GETAUTHFAILURES_API, payload);
        // Format the date fields
        const formattedData = response.data.map(item => ({
          ...item,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
        }));


        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div style={{ height: '90%', width: '95%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Authorization Failures</strong>
        </div>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        slots={{ toolbar: CustomToolbar }}
        loading={loading}
      />
    </div>
  );
};

export default AuthorizationFailures;
