<template>
  <div>
    <el-row class="tac">
      <el-col>
        <el-menu
        :router="true"
        default-active="1"
        class="el-menu-vertical"
        >
          <el-menu-item index = '/militaryBase/materialapply'>
            <i class="el-icon-menu"></i>
            <span>器材申请</span>
          </el-menu-item>
          
          <el-menu-item index = '/militaryBase/gearbug'>
            <i class="el-icon-menu"></i>
            <span>装备维修申请登记</span>
          </el-menu-item>
          <el-menu-item index = '/militaryBase/gearstatus'>
            <i class="el-icon-menu"></i>
            <span>装备维修情况登记</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
@Component()
export default class RightNav extends Vue {
  // go () {
  //   this.$router.push('/military/materialapply')
  // }
}
</script>

<style>
  .tac {
    width: 100%;
    float: left;
  }
</style>
