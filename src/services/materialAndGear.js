import { apiCall, handleException } from '../service.js'

export class Material {
  static async applyCommit (__this, code, date, unit, quantity, result) {
    let ret = await apiCall('/material/applyCommit', {
      1: Number, code, date, unit, quantity, result
    })
    return ret
  }
  static async getMaterialMeta (__this) {
    try {
      return await apiCall('/material/getAllMaterialMetaData', {})
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async deleteMaterialMeta (__this, form) {
    try {
      for (const i in form) {
        const element = form[i]
        await apiCall('/material/deleteMaterialMetaData', {
          id: element.id
        })
      }
      __this.$message({
        message: '删除成功', type: 'success'
      })
      return
    } catch (e) {
      handleException(__this, e)
    }
  }
  static async addMaterial (__this, number, name, superiorId, pic) {
    try {
      let ret = await apiCall('/material/addMaterialMetaData', {
        number, name, superiorId, pic
      })
      __this.$message({
        message: '添加成功', type: 'success'
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async updateMaterial (__this, id, number, name, superiorId, pic) {
    try {
      let ret = await apiCall('/material/updateMaterialMetaData', {
        id, number, name, superiorId, pic
      })
      __this.$message({
        message: '修改成功', type: 'success'
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async findMaterialMetaDataBy (__this, type, value) {
    try {
      let ret = await apiCall('/material/findMaterialMetaDataBy', {
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
  static async getMaterialRecords (__this) {
    let ret = await apiCall('/material/getRecords', {})
    return ret
  }
  static async findBy (__this, type, value) {
    let ret = await apiCall('/material/findBy', {
      type, value
    })
    return ret
  }
  static async censor (__this, id, result) {
    let ret = await apiCall('/material/censor', {
      id, result
    })
    return ret
  }
}
export class Gear {
  static async applyCommit (__this, unit, longingUnit, type, number, bug, needs, means, fixUnit, sponsor, tel, date, pic) {
    let ret = await apiCall('/gear/applyCommit', {
      1: Number, unit, longingUnit, type, number, bug, needs, means, fixUnit, sponsor, tel, date, pic
    })
    return ret
  }
  static async getGearRecords (__this) {
    let ret = await apiCall('/gear/getRecords', {})
    return ret
  }
  static async findBy (__this, type, value) {
    let ret = await apiCall('/gear/findBy', {
      type, value
    })
    return ret
  }
}
export class GearStatus {
  static async applyCommit (__this, fixId, type, unit, date, sponsor, details, operation) {
    let ret = await apiCall('/gearStatus/applyCommit', {
      fixId, type, unit, date, sponsor, details, operation
    })
    return ret
  }
  static async getStatuRecords (__this) {
    let ret = await apiCall('/gearStatus/getRecords', {})
    return ret
  }
  static async findBy (__this, type, value) {
    let ret = await apiCall('/gearStatus/findBy', {
      type, value
    })
    return ret
  }
}
export class MaterialCatalog {
  static async getAllCatalogs (__this) {
    try {
      return await apiCall('/material/getAllCatalogs')
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async addCatalog (__this, name, superiorId, level) {
    try {
      let ret = await apiCall('/material/addCatalog', {
        name, superiorId, level
      })
      __this.$message({
        message: '添加成功', type: 'success'
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async deleteCatalog (__this, deleteForm) {
    try {
      for (let i in deleteForm) {
        let cat = deleteForm[i]
        await apiCall('/material/deleteCatalog', {
          id: cat.id
        })
        __this.$message({
          message: '删除成功', type: 'success'
        })
      }
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async findBy (__this, type, value) {
    try {
      let ret = await apiCall('/material/findCatalogBy', {
        type, value
      })
      __this.$message({
        message: '查找成功', type: 'succcess'
      })
      return ret
    } catch (e) {
      handleException(__this, e)
    }
  }
}
export class GearMetaData {
  static async getGearMetaData (__this) {
    try {
      return await apiCall('/gear/getGearMetaData', {})
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async addGearMetaData (__this, name, model, number) {
    try {
      let ret = await apiCall('/gear/addGearMetaData', {
        name, model, number
      })
      __this.$message({
        message: '添加成功', type: 'success'
      })
      return ret
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async deleteGearMetaData (__this, form) {
    try {
      for (const i in form) {
        if (form.hasOwnProperty(i)) {
          const element = form[i]
          await apiCall('/gear/deleteGearMetaData', {
            id: element.id
          })
        }
      }
      __this.$message({
        message: '删除成功', type: 'success'
      })
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async updateGearMetaData (__this, id, name, model, number) {
    try {
      await apiCall('/gear/updateGearMetaData', {
        id, name, model, number
      })
      __this.$message({
        message: '修改成功', type: 'success'
      })
      return
    } catch (error) {
      handleException(__this, error)
    }
  }
  static async findGearMetaDataBy (__this, type, value) {
    try {
      return await apiCall('/gear/findGearMetaDataBy', {
        type, value
      })
    } catch (error) {
      handleException(__this, error)
    }
  }
}
