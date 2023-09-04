
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
  

const fetchData = createAsyncThunk('fetchData', async () => {
  try {
    const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
    console.log('MYdata', data);
    return data;
  } catch (error) {
    // Здесь можно обработать ошибку или выбросить ее дальше
    console.error('Ошибка при выполнении fetchData:', error);
    throw error; // Выбрасываем ошибку дальше, чтобы она была видна вызывающему коду
  }
});

  export default fetchData;