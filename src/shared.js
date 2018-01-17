import Vue from 'vue'
import { Login } from './services/login'
let shared = new Vue({
  async created () {
    //
  },
  data () {
    return {
      role: '',
      isLogin: false,
      account: '',
      fix: '', // 备注
      age: '', // 年龄
      realName: '',
      gender: '', // 性别
      tel: '', // 电话
      email: '',
      id: 0,
      unit: '',
      longingUnit: ''
    }
  },
  methods: {
    async init () {
      let ret = await Login.init()
      if (typeof (ret) !== typeof (undefined)) {
        this.role = ret.role.role
        this.account = ret.account
        this.isLogin = true
        this.fix = ret.fix
        this.age = ret.age
        this.realName = ret.realName
        this.tel = ret.tel
        this.gender = ret.gender
        this.email = ret.email
        this.id = ret.id
        console.log(!ret.userJob)
        if (!ret.userJob) {
          this.unit = ''
        } else {
          this.unit = ret.userJob.unit.name
          if (!ret.userJob.unit.superior) {
            this.longingUnit = '无'
          } else this.longingUnit = ret.userJob.unit.superior.name
        }
      } else {
        this.role = ''
        this.isLogin = false
        this.account = ''
        this.fix = ''
        this.gender = ''
        this.age = ''
        this.realName = ''
        this.tel = ''
        this.email = ''
        this.id = 0
      }
    }
  }
})
window.shared = shared
export default shared
