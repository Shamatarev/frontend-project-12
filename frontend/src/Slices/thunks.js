/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../contexts/routes';

const fetchData = createAsyncThunk('fetchData', async (token) => {
  try {
    const { data } = await axios.get(routes.usersPath(), { headers: token });
    // console.log('MYdata', data);
    return data;
  } catch (error) {
    // Здесь можно обработать ошибку или выбросить ее дальше
    // console.error('Ошибка при выполнении fetchData:', error);
    throw error; // Выбрасываем ошибку дальше, чтобы она была видна вызывающему коду
  }
});

export default fetchData;
