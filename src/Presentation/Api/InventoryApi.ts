import axios, { AxiosHeaders} from 'axios';

const InventoryApi = axios.create({
    baseURL: `${import.meta.env.VITE_HOST_URL}`
});

// Todo: configurar interceptores
InventoryApi.interceptors.request.use( (config) => {
    const token = localStorage.getItem('token');

  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('x-token', token);
    } else if (config.headers) {
      (config.headers as Record<string, string>)['x-token'] = token;
    } else {
      config.headers = new AxiosHeaders({ 'x-token': token });
    }
  }


    return config;
})


export default InventoryApi;



