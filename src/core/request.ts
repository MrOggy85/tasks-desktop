import axios, { Method } from 'axios';

type Params = {
  path: string;
  method: Method;
  data?: any;
};

async function request({ path, method, data }: Params) {
  const response = await axios({
    url: path,
    baseURL: 'http://localhost:8000',
    method,
    data,
  });

  return response.data;
}

export default request;
