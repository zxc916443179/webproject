<template>
<el-row>
  <el-col :span="4">
    <right-nav :count="count"></right-nav>
  </el-col>
  <el-col :span="20">
    <div style="background-color: #E4E7Ed">
        <el-row>
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
        <el-row style="margin-top: 5%;">
          <span v-loading="loading">
            <span class="loading" v-if="loading"></span>
            <span v-else>
            <el-col>
              <el-table class="table"
                :data="tableData"
                border :row-class-name.sync="tableRowClassName">
                <el-table-column prop="id" label="序号" wtidth="50"/>
                <el-table-column prop="code" label="器材代码"/>
                <el-table-column prop="date"  label="上报时间"/>
                <el-table-column prop="unit" label="申请单位"/>
              <el-table-column
              prop="quantity"
              label="数量"
              />
              <el-table-column
              prop="result"
              label="审核结果"/>
              <el-table-column
              prop="result"
              label="操作">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command='handleCommand'>
                  <span>
                    操作<i class="el-icon-arrow-down el-icon--right"/>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="data = {index: scope.$index, result: '审核通过'}">通过</el-dropdown-item>
                    <el-dropdown-item :command="data = {index: scope.$index, result: '审核不通过'}">不通过</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              </el-table-column>
              </el-table>
            </el-col>
            </span>
          </span>
        </el-row>
      </div>
  </el-col>
</el-row>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/CentralManager/RightNav'
import { Material } from '@/services/materialAndGear'
@Component({
  components: {
    RightNav
  }
})
export default class MaterialApplyList extends Vue {
  tableRowClassName ({row, rowIndex}) {
    if (this.tableData[rowIndex].result === '待审核') {
      return 'warning'
    } else if (this.tableData[rowIndex].result === '审核通过') {
      return 'success'
    } else return 'danger'
  }
  loading = false
  options = [{
    value: 'code',
    label: '器材代码'
  }, {
    value: 'unit',
    label: '单位'
  }, {
    value: 'result',
    label: '审核结果'
  }]
  ids = []
  search = ''
  searchtype = ''
  tableData = []
  count = 0
  async handleCommand (command) {
    try {
      await Material.censor(this, this.ids[command.index], command.result)
      if (this.count !== 0) this.count --
      this.tableData[command.index].result = command.result
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    } catch (error) {
      this.$alert(error)
    }
  }
  async reset () {
    try {
      this.loading = true
      let ret = await Material.getMaterialRecords(this)
      this.search = ''
      this.searchtype = ''
      this.tableData = []
      this.ids = []
      for (let key in ret) {
        let element = ret[ret.length - key - 1]
        let tid = key - '0' + 1
        this.ids.push(element.id)
        element.id = tid
        this.tableData.push(element)
      }
      this.loading = false
    } catch (e) {
      if (e.code === 101) {
        this.$alert('登录已超时，请重新登录', '超时', {
          confirmButtonText: '确定',
          callback: action => {
            this.$emit('rtl')
            this.$router.push('/login')
          }
        })
      } else {
        this.$alert(e.message)
      }
    } finally {
      this.loading = false
    }
  }
  async findBy () {
    try {
      if (this.searchtype === '' || this.search === '') {
        this.$message({
          message: '查找类型或内容不能为空',
          type: 'warning'
        })
        return
      }
      this.loading = true
      let ret = await Material.findBy(this, this.searchtype, this.search)
      this.ids = []
      this.tableData = []
      for (let key in ret) {
        let element = ret[ret.length - key - 1]
        let tid = key - '0' + 1
        this.ids.push(element.id)
        element.id = tid
        this.tableData.push(element)
      }
      this.loading = false
      this.$message({
        message: '查找成功',
        type: 'success',
        showClose: true
      })
    } catch (e) {
      if (e.code === 101) {
        this.$alert('登录已超时，请重新登录', '超时', {
          confirmButtonText: '确定',
          callback: action => {
            this.$emit('rtl')
            this.$router.push('/login')
          }
        })
      } else {
        this.$alert(e.message)
      }
    }
  }
  async mounted () {
    try {
      this.loading = true
      let ret = await Material.getMaterialRecords(this)
      this.count = this.handleRet(ret)
      this.loading = false
    } catch (e) {
      if (e.code === 101) {
        this.$alert('登录已超时，请重新登录', '超时', {
          confirmButtonText: '确定',
          callback: action => {
            this.$emit('rtl')
            this.$router.push('/login')
          }
        })
      } else {
        this.$alert(e.message)
      }
    } finally {
      this.loading = false
    }
  }
  handleRet (ret) {
    let cnt = 0
    for (let key in ret) {
      let element = ret[ret.length - key - 1]
      let tid = key - '0' + 1
      this.ids.push(element.id)
      element.id = tid
      if (element.result === '待审核') cnt++
      this.tableData.push(element)
    }
    return cnt
  }
}
</script>

<style>
  .el-table .warning {
    background-color: oldlace;
  }

  .el-table .success {
    background: #f0f9eb;
  }
  .el-table .danger {
    background: rgb(253, 252, 249);
  }
</style>