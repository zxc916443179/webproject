import axios from 'axios'
import shared from './shared'
axios.defaults.withCredentials = true
let ServerBase = '/springboot'
if (process.env.NODE_ENV === 'development') {
  ServerBase = 'http://localhost:8080/springboot'
}
export { ServerBase }

class ServiceError extends Error {
  constructor (msg, code) {
    super()
    this.message = msg
    this.code = code
  }
}
class APIError extends Error {
  constructor (msg, code) {
    super()
    this.code = code
    this.message = msg
  }
}
export async function handleException (__this, e) {
  if (__this.loading) {
    __this.loading = false
  }
  if (e.code === 101) {
    shared.isLogin = false
    __this.$alert('登录已超时，请重新登录', '超时', {
      confirmButtonText: '确定',
      callback: action => {
        __this.$emit('rtl')
        __this.$router.push('/login')
      }
    })
  } else if (e.code === 105) {
    __this.$alert('没有权限访问', '警告', {
      confirmButtonText: '确定',
      callback: action => {
        __this.$router.push('/login')
      }
    })
  } else {
    __this.$alert(e.message)
  }
}
export async function apiCall (path, data = {}) {
  let res = await axios.post(`${ServerBase}${path}`, data)
  if (res.status === 200) {
    const data = res.data
    if (data.code === 0) {
      return data.body
    } else {
      if (data.code === 101) {
        shared.isLogin = false
      }
      throw new APIError(data.msg, data.code)
    }
  } else {
    throw new ServiceError('网络或服务器出错', res.status)
  }
}
