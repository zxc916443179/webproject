import { apiCall, handleException } from '../service.js'
export class Unit {
  static async addUnit (__this, number, name, superiorId, responsibleId, tel, fix) {
    try {
      let ret
      ret = await apiCall('/unit/addUnit', {
        number, name, responsibleId, superiorId, tel, fix
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async getResponsibles (__this) {
    try {
      let ret = await apiCall('/unit/getResponsibles', {})
      return ret
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async getUnits (__this) {
    try {
      let ret = await apiCall('/unit/getUnits', {})
      return ret
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async deleteUnits (__this, units) {
    try {
      for (let i in units) {
        let unit = units[i]
        await apiCall('/unit/deleteUnit', {
          id: unit.id
        })
      }
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async updateUnit (__this, id, number, name, superiorId, responsibleId, tel, fix) {
    try {
      let ret = await apiCall('/unit/updateUnit', {
        id, number, name, responsibleId, superiorId, tel, fix
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async findBy (__this, type, value, msg) {
    try {
      let ret = await apiCall('/unit/findUnitBy', {
        type, value
      })
      __this.$message({
        message: msg, type: 'success'
      })
      return ret
    } catch (error) {
      handleException(error)
    }
  }
  static async getJuniors (__this, name) {
    try {
      let ret = await apiCall('/unit/getJuniors', {
        name
      })
      return ret
    } catch (error) {
      handleException(error)
    }
  }
  static async getUsers (__this, name) {
    try {
      let ret = await apiCall('/unit/getUsers', {
        name
      })
      return ret
    } catch (error) {
      handleException(error)
    }
  }
}
