import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import BaseHome from '@/components/BaseMilitary/BaseHome'

// MilitaryBase Components
import MaterialApply from '@/components/BaseMilitary/MaterialApply'
import GearBug from '@/components/BaseMilitary/GearBug'
import GearStatus from '@/components/BaseMilitary/GearStatus'
// CentralManager Compoenents
import MaterialApplyList from '@/components/CentralManager/MaterialApplyList'
import CentralHome from '../components/CentralManager/CentralHome'
import FixStatistics from '@/components/CentralManager/FixStatistics'
import CentralGearStatus from '../components/CentralManager/CentralGearStatus'
// DataBaseManager Components
import DBMHome from '@/components/DataBaseManager/DBMHome'
import UnitManage from '@/components/DataBaseManager/UnitManage'
import LoginRecord from '@/components/DataBaseManager/LoginRecord'
import UserManage from '@/components/DataBaseManager/UserManage'
import MaterialInfo from '@/components/DataBaseManager/MaterialInfo'
import GearInfo from '@/components/DataBaseManager/GearInfo'
import MaterialCatalog from '@/components/DataBaseManager/MaterialCatalog'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    // BaseMilitary Router
    {
      path: '/militaryBase/home',
      name: 'BaseMilitaryHome',
      component: BaseHome
    },
    {
      path: '/militaryBase/materialapply',
      name: 'MaterialApply',
      component: MaterialApply
    },
    {
      path: '/militaryBase/gearbug',
      name: 'GearBug',
      component: GearBug
    },
    {
      path: '/militaryBase/gearstatus',
      name: 'GearStatus',
      component: GearStatus
    },

    // CentralManager Router
    {
      path: '/centralManager/home',
      name: 'CentralHome',
      component: CentralHome
    },
    {
      path: '/centralManager/materialApplyList',
      name: 'materialApllyList',
      component: MaterialApplyList
    },
    {
      path: '/centralManager/fixStatistics',
      name: 'FixStatistics',
      component: FixStatistics
    },
    {
      path: '/centralManager/gearStatus',
      name: 'CentralGearStatus',
      component: CentralGearStatus
    },
    // DBM Router
    {
      path: '/dataBaseManager/home',
      name: 'DataBaseManager',
      component: DBMHome
    },
    {
      path: '/dataBaseManager/loginRecord',
      name: 'LoginRecord',
      component: LoginRecord
    },
    {
      path: '/dataBaseManager/unitManage',
      name: 'UnitManage',
      component: UnitManage
    },
    {
      path: '/dataBaseManager/userManage',
      name: 'UserManage',
      component: UserManage
    },
    {
      path: '/dataBaseManager/gearInfo',
      name: 'GearInfo',
      component: GearInfo
    },
    {
      path: '/dataBaseManager/materialInfo',
      name: 'MaterialInfo',
      component: MaterialInfo
    },
    {
      path: '/dataBaseManager/materialCatalog',
      name: 'MaterialCatalog',
      component: MaterialCatalog
    }
  ]
})
