<template>
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
              <el-button type="primary" @click="statuVisible = true">添加记录</el-button>
            </el-col>
          </el-row>
          <el-row>
            <span v-loading='loading'>
              <span v-if="loading" class="loading"></span>
              <span v-else>
                <el-col>
                  <el-table
                  :data="tableData"
                  stripe
                  border
                  style="background-color: #e4e7ed">
                  <el-table-column
                  prop="fixId"
                  label="维护编号"
                  width="80"
                  />
                  <el-table-column
                  prop="type"
                  label="装备名称型号"
                  />
                  <el-table-column
                  prop="unit"
                  label="单位"
                  />
                  <el-table-column
                  prop="date"
                  label="登记日期"
                  />
                  <el-table-column
                  prop="sponsor"
                  label="登记人"
                  />
                  <el-table-column
                  prop="details"
                  label="详细说明"/>
                  <el-table-column
                  prop="operation"
                  label="操作"/>
                  </el-table>
                </el-col>
              </span>
            </span>
          </el-row>
        </div>
      </el-col>
      <el-dialog title="添加状态记录" :visible.sync="statuVisible" size="tiny">
        <span>
          <el-form ref="status" :model="formData">
            <el-form-item label="维修编号" prop="fixId">
              <el-input v-model="formData.fixId"></el-input>
            </el-form-item>
            <el-form-item label="装备型号名称" prop="type">
              <el-input v-model="formData.type"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="formData.unit" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="登记人" prop="sponsor">
              <el-input v-model="formData.sponsor" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="详细说明" prop="details">
              <el-input v-model="formData.details"></el-input>
            </el-form-item>
            <el-form-item label="操作" prop="operation">
              <el-input v-model="formData.operation"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer">
          <el-button @click="statuVisible = false" type="danger">取消</el-button>
          <el-button type="primary" @click="onCommit()">提交</el-button>
        </span>
      </el-dialog>
    </el-row>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/BaseMilitary/RightNav'
import { GearStatus as Status } from '@/services/materialAndGear'
import shared from '@/shared'
@Component({
  components: {
    RightNav
  }
})
export default class GearStatus extends Vue {
  statuVisible = false
  loading = false
  tableData = []
  search = ''
  searchtype = ''
  options = [{
    value: 'fixId',
    label: '维护编号'
  }, {
    value: 'type',
    label: '装备型号名称'
  }, {value: 'unit', label: '单位'}, {value: 'sponsor', label: '登记人'}]
  ids = []
  formData = {
    fixId: '', type: '', unit: shared.unit, sponsor: shared.realName, details: '', operation: ''
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
      let ret = await Status.findBy(this, this.searchtype, this.search)
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
  async onCommit () {
    try {
      await Status.applyCommit(this, this.formData.fixId, this.formData.type, this.formData.unit,
      new Date().toLocaleDateString(), this.formData.sponsor, this.formData.details, this.formData.operation)
      let ret = await Status.getStatuRecords(this)
      this.tableData = []
      this.ids = []
      this.handleRet(ret)
      this.statuVisible = false
      this.$message({
        message: '操作成功', type: 'success', showClose: true
      })
    } catch (error) {
      //
    }
  }
  async reset () {
    try {
      this.loading = true
      let ret = await Status.getStatuRecords(this)
      this.tableData = []
      this.ids = []
      this.search = ''
      this.searchtype = ''
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
    this.loading = true
    try {
      let ret = await Status.getStatuRecords(this)
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
  .loading {
    display: block;
    height: 100px;
  }
</style>
