/* eslint-disable no-useless-catch */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../contexts/routes';

const fetchData = createAsyncThunk('fetchData', async (token) => {
  try {
    const { data } = await axios.get(routes.usersPath(), { headers: token });
    return data;
  } catch (error) {
    throw error; // Выбрасываем ошибку дальше, чтобы она была видна вызывающему коду
  }
});

export default fetchData;
