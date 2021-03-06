import axios from 'axios'
import {
  Message
} from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: 'http://192.168.3.3:8888/', // url = base url + request url
  // baseURL: 'http://106.14.77.81:8888/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 设置请求头Authorization值为token
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response

    // if the custom code is not 100, it is judged as an error.
    if (res.status !== 200) {
      Message({
        message: res.status || 'Error check your token or method',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.status || 'Error'))
    } else {
      return res
    }
  },
  // error => {
  //   console.log('err' + error) // for debug
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 2 * 1000
  //   })
  //   return Promise.reject(error)
  // }
)

export default service.request
