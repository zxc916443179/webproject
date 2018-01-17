<template>
  <div>
    <el-row>
      <el-col :span="4">
    <right-nav></right-nav>
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
        <el-row style="margin-top: 3%; margin-left: -3%;margin-bottom: 1%">
          <el-col :span="4">
            <el-button type="primary" @click="applyVisible = true">申请器材</el-button>
          </el-col>
        </el-row>
        <el-row>
          <span v-loading="loading">
            <span class="loading" v-if="loading"></span>
            <span v-else>
            <el-col>
              <el-table
              :data="tableData"
              stripe
              border
              style="background-color: #e4e7ed">
              <el-table-column
              prop="id"
              label="序号"
              wtidth="80"
              />
              <el-table-column
              prop="code"
              label="器材代码"
              />
              <el-table-column
              prop="date"
              label="上报时间"
              />
              <el-table-column
              prop="unit"
              label="单位"
              />
              <el-table-column
              prop="quantity"
              label="数量"
              />
              <el-table-column
              prop="result"
              label="审核结果"/>
              </el-table>
            </el-col>
            </span>
          </span>
        </el-row>
      </div>
      </el-col>
    </el-row>
    <el-dialog
    title="申请器材"
    :visible.sync="applyVisible"
    size="tiny">
    <span>
      <el-form ref="apply" :model="applyForm">
        <el-form-item label="器材代码" prop="code">
          <el-input v-model="applyForm.code"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="applyForm.unit" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="applyForm.quantity"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="applyVisible = false" type="danger">取消</el-button>
      <el-button @click="onCommit" type="primary">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/BaseMilitary/RightNav'
import { Material } from '../../services/materialAndGear'
import { handleException } from '@/service.js'
import shared from '@/shared'
@Component({
  components: {
    RightNav
  }
})
export default class MaterialApply extends Vue {
  searchtype = ''
  search = ''
  applyVisible = false
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
  applyForm = {
    code: '',
    unit: shared.unit,
    quantity: 0
  }
  tableData = []
  ids = []
  async onApply () {
    this.applyVisible = true
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
      this.handleRet(ret)
      this.loading = false
      this.$message({
        message: '查找成功',
        type: 'success',
        showClose: true
      })
    } catch (e) {
      handleException(this, e)
    }
  }
  async onCommit () {
    await Material.applyCommit(this, this.applyForm.code, new Date().toLocaleDateString(), this.applyForm.unit, this.applyForm.quantity, '待审核')
    // console.log(ret)
    this.tableData = []
    let ret = await Material.getMaterialRecords(this)
    this.handleRet(ret)
    this.applyVisible = false
    this.$message({
      message: '操作成功',
      type: 'success',
      showClose: true
    })
  }
  async reset () {
    try {
      this.loading = true
      let ret = await Material.getMaterialRecords(this)
      this.search = ''
      this.searchtype = ''
      this.tableData = []
      this.ids = []
      this.handleRet(ret)
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
  async mounted () {
    try {
      this.loading = true
      let ret = await Material.getMaterialRecords(this)
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
  handleRet (ret) {
    for (let key in ret) {
      let element = ret[ret.length - key - 1]
      let tid = key - '0' + 1
      this.ids.push(element.id)
      element.id = tid
      this.tableData.push(element)
    }
  }
}
</script>

<style scoped>
</style>
