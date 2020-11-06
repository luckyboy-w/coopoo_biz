import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const errCode = {
  "1000":'登录超时，请重新登录',
  "-102":'结算失败，非结算日无法提交结算。'
}

let requestBodyUrl = []
requestBodyUrl.push("/bc/order/bizOrderList")
requestBodyUrl.push("/bu/orderBill/findListPost")
requestBodyUrl.push("/bu/good/modityGoodStock")


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 10 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }

    config.headers['Biz-Site'] = 'Backend-Biz'
    if(config['url'].indexOf('/bu/good/update') != -1){
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }else{
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      if (config['method'] != 'get') {
        if(requestBodyUrl.indexOf(config.url) != -1){
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }else{
          config.transformRequest = [function(data) {
            // 在请求之前对data传参进行格式转换
            data = Qs.stringify(data)
            return data
          }]
        }
      }
    }

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
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code != 200) {
      /*Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })*/

      if(res.code == 1000){
        Message({
          message: '登录超时，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        location.href = '/'
        /*this.$router.push('/login')*/
      }

      if(errCode[res.code] != undefined){
        Message({
          message:  errCode[res.code],
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.code || 'Error'))
      }

      if(res.message == "pwd.fail"){
        Message({
          message: '密码错误，请重新输入',
          type: 'error',
          duration: 5 * 1000
        })
      }

      if(res.message == "disabled"){
        Message({
          message: '账号被禁用',
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    /*Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    // Message({
    //   message: '请求超时，请刷新页面后再试',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
