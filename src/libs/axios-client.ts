import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  // withCredentials: true,
  // headers: {

  // }
})

axiosClient.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    console.log('🚀 ~ file: axios-client.ts:18 ~ error:', error)
    return Promise.reject(error)
  }
)

export default axiosClient
