import { apiCall, handleException } from '../service.js'
import shared from '../shared'

export class Login {
  static async login (__this, account, password) {
    try {
      let ret = await apiCall('/login', {
        account, password
      })
      return ret
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async init () {
    let ret = await apiCall('/init', {})
    return ret
  }
  static async logout (__this, account) {
    try {
      let ret = await apiCall('/logout', {account})
      return ret
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async testLogin (__this) {
    try {
      await apiCall('/testLogin', {})
    } catch (e) {
      if (e.code === 101) shared.isLogin = false
      handleException(this, e)
    }
  }
}
export class User {
  static async updateInfo (__this, realName, fix, gender, tel, email, age, id) {
    try {
      let ret = await apiCall('/user/updateInfo', {
        realName, fix, gender, tel, email, age, id
      })
      return ret
    } catch (error) {
      handleException(error)
    }
  }
  static async updatePass (__this, id, password) {
    try {
      let ret = await apiCall('/user/updatePass', {
        id, password
      })
      return ret
    } catch (error) {
      handleException(error)
    }
  }
  static async findRecordsBy (__this, type, value) {
    try {
      let ret = await apiCall('/user/findRecordsBy', {
        type, value
      })
      __this.$message({
        message: '查找成功', type: 'success'
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async getLoginRecords (__this) {
    try {
      return await apiCall('/user/getLoginRecords', {})
    } catch (error) {
      handleException(__this, error)
    }
  }
}
