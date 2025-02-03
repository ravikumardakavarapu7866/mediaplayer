import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../components/Common/apiClient';
import { CONSUMERPROCESS_API } from '../components/Common/apiHelper';
import CustomToolbar from '../components/Common/customToolbar';
import { formatDateTime } from '../components/Common/dateUtils';

const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
const columns = [
  { field: "userEmail", headerName: "User Email", width: 200, renderHeader: renderHeaderBold, },
  { field: "timeStamp", headerName: "Time Stamp", width: 200, renderHeader: renderHeaderBold, },
  { field: "videoName", headerName: "Video Name", width: 200, renderHeader: renderHeaderBold, },
  { field: "height", headerName: "Resolution", width: 200, renderHeader: renderHeaderBold, },
  { field: "fileName", headerName: "File Name", width: 200, renderHeader: renderHeaderBold, },
  { field: "processSeconds", headerName: "Process(ms)", width: 100, renderHeader: renderHeaderBold, },
  { field: "createdDate", headerName: "Chunks Processed Date Time", width: 250, renderHeader: renderHeaderBold, },
  { field: "updatedDate", headerName: "Updated Date", width: 250, renderHeader: renderHeaderBold, }

]


const ConsumerProcess = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userID = sessionStorage.getItem('userId');
      const payload = { userID };
      try {
        const response = await apiClient.apiRequest(CONSUMERPROCESS_API, payload);
        // Format the date fields
        const formattedData = response.data.map(item => ({
          ...item,
          //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
          //updatedDate: item.updatedDate ? item.updatedDate.replace('T', ' ').split('.')[0] : null,
          createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
          updatedDate: item.updatedDate ? formatDateTime(item.updatedDate) : null,
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
          <strong>Consumer Process</strong>
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

export default ConsumerProcess;
