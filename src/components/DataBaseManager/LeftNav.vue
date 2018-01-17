<template>
  <div>
    <el-row class="tac">
      <el-col>
        <el-menu :router="true" default-active="1" class="el-menu-vertical" >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户信息管理</span>
            </template>
          <el-menu-item-group>
            <el-menu-item index = '/dataBaseManager/unitManage'>单位管理</el-menu-item>
            <el-menu-item index =  '/dataBaseManager/userManage'>用户管理</el-menu-item>
            <el-menu-item index =  '/dataBaseManager/loginRecord'>登录记录管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>设备元数据信息管理</span>
            </template>
          <el-menu-item-group>
            <el-menu-item index = '/dataBaseManager/gearInfo'>装备信息管理</el-menu-item>
            <el-menu-item index =  '/dataBaseManager/materialInfo'>器材信息管理</el-menu-item>
            <el-menu-item index =  '/dataBaseManager/materialCatalog'>器材类别管理</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component()
export default class LeftNav extends Vue {
}
</script>
<style scoped>
  .tac {
    width: 100%;
    float: left;
  }
</style>
