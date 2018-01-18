<template>
  <div>
    <el-row class="tac">
      <el-col>
        <el-menu
        theme="dark"
        :router="true"
        default-active="1"
        class="el-menu-vertical"
        @open="handleOpen()"
        @close="handleClose()"
        >
        <!-- <el-badge>
          <el-menu-item index = '/centralManager/gearStatus'>
            <i class="el-icon-menu"></i>
            <span>装备动态汇总</span>
          </el-menu-item>
        </el-badge> -->
        <el-badge :value="min(count, tscount)">
          <el-menu-item index = '/centralManager/materialApplyList'>
            <i class="el-icon-menu"></i>
            <span>器材申请列表</span>
          </el-menu-item>
        </el-badge>
        <el-badge>
          <el-menu-item index = '/centralManager/fixStatistics'>
            <i class="el-icon-menu"></i>
            <span>装备报修统计</span>
          </el-menu-item>
        </el-badge>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import { Material } from '@/services/materialAndGear'
@Component({
  props: ['count']
})
export default class RightNav extends Vue {
  tscount = 0
  async mounted () {
    let ret = await Material.getMaterialRecords(this)
    let cnt = 0
    for (let key in ret) {
      if (ret[key].result === '待审核')cnt++
    }
    this.tscount = cnt
  }
  min (x, y) {
    if (typeof (x) === typeof (undefined)) {
      return y
    }
    return (x < y) ? x : y
  }
}
</script>

<style>
  .tac {
    width: 100%;
    float: left;
  }
  .el-menu {
    border: none;
  }
</style>
