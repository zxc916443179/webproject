<template>
  <el-row>
    <el-col :span="4">
      <left-nav></left-nav>
    </el-col>
    <el-col :span="20">
      <div style="background-color: #E4E7Ed">
        <el-row class="header">
          <el-col :span="3" style="font-size: 23px;">搜索条件</el-col>
          <el-col :span="4">
            <el-select v-model="searchtype" placeholder="请选择搜索条件">
              <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.label">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" style="margin-left: 3%">
            <el-input v-model="search" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain @click="findBy()">查询</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="danger" plain @click="reset()">重置</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 3%; margin-left: -3%; margin-bottom: 1%">
          <el-col :span="5">
            <el-button type="primary" @click="export2Excel()">导出</el-button>
          </el-col>
        </el-row>       
        <span v-loading='loading'>
          <el-row>
            <span class="loading" v-if="loading"></span>
            <span v-else>
            <el-col>
              <el-table :data="tableData" stripe border style="background-color: #e4e7ed">
                <el-table-column prop="tid" label="序号" />
                <el-table-column prop="account" label="用户名" />
                <el-table-column prop="ip" label="登录IP" />
                <el-table-column prop="time" label="登录时间" />
              </el-table>
            </el-col>
            </span>
          </el-row>
        </span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import Vue from 'vue'
import { User } from '@/services/login'
@Component({
  components: {
    LeftNav
  }
})
export default class LoginRecord extends Vue {
  tableData = []
  search = ''
  searchtype = ''
  loading = false
  options = [{
    label: '用户名', value: 'account'
  }, {
    label: 'ip', value: 'ip'
  }]
  async init () {
    this.tableData = []
    this.searchtype = ''
    this.search = ''
    this.loading = true
    let ret = await User.getLoginRecords(this)
    for (let i in ret) {
      let element = ret[ret.length - i - 1]
      element.tid = i - '0' + 1
      this.tableData.push(element)
    }
    this.loading = false
  }
  async mounted () {
    this.loading = true
    await this.init()
  }
  async findBy () {
    if (this.searchtype === '' || this.search === '') {
      this.$message({
        message: '搜索条件或内容不能为空', type: 'warning'
      })
      return
    }
    this.loading = true
    this.tableData = []
    let ret = await User.findRecordsBy(this, this.searchtype, this.search)
    for (let i in ret) {
      let element = ret[ret.length - i - 1]
      element.tid = i - '0' + 1
      this.tableData.push(element)
    }
    this.loading = false
  }
  async reset () {
    await this.init()
  }
  async export2Excel () {
    require.ensure([], () => {
      const { export_json_to_excel } = require('../../vendor/Export2Excel')
      const tHeader = ['序号', '用户名', '登录IP', '登录时间']
      const filterVal = ['tid', 'account', 'ip', 'time']
      const list = this.tableData
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '登录记录excel')
    })
  }
  formatJson (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
}
</script>
