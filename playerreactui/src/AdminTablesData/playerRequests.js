import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { ALLPLAYERREQUESTS_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import CustomToolbar from '../components/Common/customToolbar';
import { formatDateTime } from '../components/Common/dateUtils';



const PlayerReuests = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
  const columns = [

    { field: 'requestUrl', headerName: 'Request Url', width: 400, renderHeader: renderHeaderBold },
    { field: 'referer', headerName: 'Referer', width: 300, renderHeader: renderHeaderBold },
    { field: 'userAgent', headerName: 'User Agent', width: 300, renderHeader: renderHeaderBold },
    { field: 'authToken', headerName: 'Auth Token', width: 300, renderHeader: renderHeaderBold },
    { field: 'authType', headerName: 'Type', width: 200, renderHeader: renderHeaderBold },
    { field: 'payload', headerName: 'Payload', width: 300, renderHeader: renderHeaderBold },
    { field: 'isInternalModified', headerName: 'Is Internal', width: 300, renderHeader: renderHeaderBold },
    { field: 'userIp', headerName: 'User Ip', width: 300, renderHeader: renderHeaderBold },
    { field: 'statusMessage', headerName: 'Status Message', width: 300, renderHeader: renderHeaderBold },
    { field: 'createdDate', headerName: 'Created DateTime', width: 300, renderHeader: renderHeaderBold },

  ];


  const fetchData = async () => {
    setLoading(true);
    const userID = sessionStorage.getItem('userId');
    const payload = { userID }
    try {
      const response = await apiClient.apiRequest(ALLPLAYERREQUESTS_API, payload);
      const formattedData = response.data.map(item => ({
        ...item,
        // createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
        createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div style={{ height: '90%', width: '95%' }} >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Player Requests</strong>
        </div>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}


      />
    </div>
  );
};

export default PlayerReuests;