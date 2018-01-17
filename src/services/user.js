import { apiCall, handleException } from '../service.js'
export class User {
  static async deleteUser (__this, deleteForm) {
    try {
      for (let i in deleteForm) {
        await apiCall('/user/deleteUser', {
          id: deleteForm[i].id
        })
      }
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async getRole (__this) {
    try {
      return await apiCall('/user/getRoles', {})
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async addUser (__this, data) {
    try {
      return await apiCall('/user/addUser', {
        data
      }).then(() => {
        __this.$message({
          message: '操作成功', type: 'success'
        })
      })
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async findBy (__this, type, value, unit) {
    try {
      let ret = await apiCall('/user/findBy', {
        type, value, unit
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async test (__this, role) {
    try {
      return await apiCall(`/${role}/test`, {})
    } catch (error) {
      handleException(__this, error)
    }
  }
}
