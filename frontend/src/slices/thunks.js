import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const fetchData = createAsyncThunk('fetchData', async (token) => {
  const { data } = await axios.get(routes.usersPath(), { headers: token });
  return data;
});

export default fetchData;
