
import {  createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
};

const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
  
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
  
    return {};
  };
  

 const fetchData = createAsyncThunk(
    'fetchData',
    async () => {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        console.log('MYdata', data)
      return data;
    },
  );

  export default fetchData;