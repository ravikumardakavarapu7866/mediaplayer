import React, { useState, useEffect } from 'react';
import apiClient from '../components/Common/apiClient';
import { USERS_API, USERDETAILS_API, GETUSERTOKENVIDEOS_API } from '../components/Common/apiHelper';
import '../../src/components/Common/styles.css';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from '../components/Common/customToolbar';
import GenerateUserToken from '../AdminTablesData/generateUserToken';
import { formatDateTime } from '../components/Common/dateUtils';


const UserDetails = () => {
    const [usersRows, setUsersRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUserDetails, setLoadingUserDetails] = useState(false);
    const [userDetailsRows, setUserDetailsRows] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showGenerateUserToken, setShowGenerateUserToken] = useState(false);
    const [strongText, setStrongText] = useState('User Tokens');
    const [buttonText, setButtonText] = useState('Generate User Token');
    const [showUserTokens, setShowUserTokens] = useState(true);



    const renderHeaderBold = (params) => (<strong>{params.colDef.headerName}</strong>);
    const usersColumns = [
        { field: 'userEmail', headerName: 'User Email', width: 300, renderHeader: renderHeaderBold },
        { field: 'providerName', headerName: 'Provider Name', width: 300, renderHeader: renderHeaderBold },
        { field: 'token', headerName: 'User Token', width: 300, renderHeader: renderHeaderBold },
        { field: 'validFromDate', headerName: 'From DateTime', width: 300, renderHeader: renderHeaderBold },
        { field: 'validEndDate', headerName: 'End DateTime', width: 300, renderHeader: renderHeaderBold },
        { field: 'createdDate', headerName: 'Created DateTime', width: 300, renderHeader: renderHeaderBold },
    ];

    const userDetailsColumns = [
        { field: 'type', headerName: 'Type', width: 900, renderHeader: renderHeaderBold },
        { field: 'videoName', headerName: 'Video Name', width: 900, renderHeader: renderHeaderBold },
    ];


    const fetchData = async () => {
        setLoading(true);
        const userID = sessionStorage.getItem('userId');
        const payload = { userID }
        try {
            const usersResponse = await apiClient.apiRequest(USERS_API, payload);
            const formattedData = usersResponse.data.map(item => ({
                ...item,
                // validFromDate: item.validFromDate ? item.validFromDate.replace('T', ' ').split('.')[0] : null,
                // validEndDate: item.validEndDate ? item.validEndDate.replace('T', ' ').split('.')[0] : null,
                // createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,

                validFromDate: item.validFromDate ? formatDateTime(item.validFromDate) : null,
                validEndDate: item.validEndDate ? formatDateTime(item.validEndDate) : null,
                createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
            }));



            // const uniqueData = formattedData.filter((value, index, self) =>
            //     index === self.findIndex((t) => (
            //         t.userId === value.userId
            //     ))
            // );

            setUsersRows(formattedData);

            if (formattedData.length > 0) {
                setSelectedRowId(formattedData[0].userId); // Select the first row after data is loaded
                //getUserDetails(formattedData[0].userId);
            }
            getUserDetails(usersResponse.data[0].userId);
        } catch (error) {
            console.error('Error while getting the userDetailsRows:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getUserDetails = async (selectedRowID) => {
        const payload = { selectedRowID };
        setLoading(true);
        try {
            const videoDetailsUserResponse = await apiClient.apiRequest(GETUSERTOKENVIDEOS_API, payload);

            if (videoDetailsUserResponse.status === 200) {
                const formattedData = videoDetailsUserResponse.data.map(item => ({
                    ...item,
                    //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
                    createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
                }));
                setUserDetailsRows(formattedData);
            }
        } catch (error) {
            console.error("Error while getting the userDetailsRows:", error);
        }
        finally {
            setLoading(false);
        }
    };


    const handleRowClick = async (params) => {
        setSelectedRowId(params.row.id);
        const selectedRowID = params.row.id;
        const payload = { selectedRowID };
        try {
            setLoadingUserDetails(true);
            const response = await apiClient.apiRequest(GETUSERTOKENVIDEOS_API, payload);

            if (response.status === 200) {
                const formattedData = response.data.map(item => ({
                    ...item,
                    //createdDate: item.createdDate ? item.createdDate.replace('T', ' ').split('.')[0] : null,
                    createdDate: item.createdDate ? formatDateTime(item.createdDate) : null,
                }));
                setUserDetailsRows(formattedData);
            } else {
                setUserDetailsRows('');
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        } finally {
            setLoadingUserDetails(false);
        }
    };


    const getRowClassName = (params) => {
        return params.id === selectedRowId ? 'highlight-row' : '';
    };

    const handleGenerateUserTokenClick = () => {
        setShowGenerateUserToken(true);
        setShowUserTokens(false);
        setButtonText('User Tokens');
        setStrongText('Generate User Tokens');
    };

    const handleUserTokenClick = () => {
        setShowGenerateUserToken(false);
        setShowUserTokens(true);
        setButtonText('Generate User Token');
        setStrongText('User Tokens');
    };

    return (
        <div style={{ height: '90%', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ margin: 0 }}>{strongText}</strong>

                <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={buttonText === 'Generate User Token' ? handleGenerateUserTokenClick : handleUserTokenClick}>
                    {buttonText}
                </button>
            </div>
            {showUserTokens && (
                <>
                    <DataGrid
                        rows={usersRows}
                        columns={usersColumns}
                        loading={loading}
                        slots={{ toolbar: CustomToolbar }}
                        onRowClick={handleRowClick}
                        getRowId={(usersRows) => usersRows.id || usersRows.userId} // Specify userId as the unique id
                        getRowClassName={getRowClassName}
                    />

                    <div style={{ height: 250, width: '100%' }}>
                        <div style={{ padding: '10px', marginBottom: '5px', marginTop: '20px' }}>
                            <strong style={{ margin: 0 }}>Details</strong>
                        </div>
                        <DataGrid
                            rows={userDetailsRows}
                            columns={userDetailsColumns}
                            loading={loadingUserDetails}
                        />
                    </div>
                </>
            )}

            {showGenerateUserToken && (
                <div style={{ height: 250, width: '100%' }}>
                    <GenerateUserToken />
                </div>
            )}

        </div>
    );
};

export default UserDetails;