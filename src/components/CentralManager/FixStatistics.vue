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
              <el-button type="primary" @click="export2Excel()">导出</el-button>
            </el-col>
          </el-row>       
          <span v-loading='loading'>
              <el-row>
                <span class="loading" v-if="loading"></span>
                <span v-else>
                <el-col>
                  <el-table :data="tableData" stripe border style="background-color: #e4e7ed">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-row>
                          <el-col :span="14">
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="所属单位"><span>{{ props.row.longingUnit }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="装备号码"><span>{{ props.row.number }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="故障现象"><span>{{ props.row.bug }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="联系人"><span>{{ props.row.sponsor }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="联系电话"><span>{{ props.row.tel }}</span></el-form-item>
                              </el-form>
                            </el-row>
                          </el-col>
                          <el-col :span="4"><el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="图片">
                              <template>
                                <img v-bind:src="props.row.pic" v-if="props.row.pic !== ''">
                                <span v-else>暂无图片</span>
                              </template>
                            </el-form-item>
                            </el-form>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column prop="id" label="序号" width="50" />
                    <el-table-column prop="unit" label="申请单位" />
                    <el-table-column prop="type" label="装备型号名称" />
                    <!-- <el-table-column prop="bug" label="故障现象"/> -->
                    <el-table-column prop="needs" label="器材需求"/>
                    <el-table-column prop="means" label="供应方式"/>
                    <el-table-column prop="fixUnit" label="维修单位"/>
                    <!-- <el-table-column prop="sponsor" label="联系人"/> -->
                    <!-- <el-table-column prop="tel" label="联系电话"/> -->
                    <el-table-column prop="date" label="申请日期"/>
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
import Vue from 'vue'
import RightNav from '@/components/CentralManager/RightNav'
import { Gear } from '../../services/materialAndGear'
@Component({
  components: {
    RightNav
  }
})
export default class FixStatistics extends Vue {
  bugVisible = false
  loading = true
  bugForm = {
    unit: '', longingUnit: '', type: '', number: '', bug: '', needs: '', means: '', fixUnit: '', sponsor: '', tel: ''
  }
  tableData = []
  search = ''
  options = [{
    value: 'unit',
    label: '申请单位'
  }, {
    value: 'longingUnit',
    label: '所属单位'
  }, {
    value: 'type',
    label: '装备型号名称'
  }, {
    value: 'fixUnit',
    label: '维修单位'
  }, {
    value: 'sponsor',
    label: '联系人'
  }]
  searchtype = ''
  ids = []
  async onCommit () {
    await Gear.applyCommit(this, this.bugForm.unit, this.bugForm.longingUnit, this.bugForm.type,
    this.bugForm.number, this.bugForm.bug, this.bugForm.needs, this.bugForm.means, this.bugForm.fixUnit, this.bugForm.sponsor, this.bugForm.tel,
    new Date().toLocaleDateString())
    let ret = await Gear.getGearRecords(this)
    this.handleRet(ret)
    this.bugVisible = false
    this.$message({
      message: '操作成功', type: 'success', showClose: true
    })
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
      let ret = await Gear.findBy(this, this.searchtype, this.search)
      this.tableData = []
      this.ids = []
      this.handleRet(ret)
      this.$message({
        message: '操作成功', type: 'success', showClose: true
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
  async reset () {
    try {
      this.loading = true
      let ret = await Gear.getGearRecords(this)
      this.tableData = []
      this.search = ''
      this.searchtype = ''
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
      let ret = await Gear.getGearRecords(this)
      this.handleRet(ret)
      this.loading = false
    } catch (e) {
      this.loading = false
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
  async export2Excel () {
    require.ensure([], () => {
      const { export_json_to_excel } = require('../../vendor/Export2Excel')
      const tHeader = ['序号', '申请单位', '所属单位', '装备型号名称', '装备号码', '故障现象', '器材需求', '供应方式', '维修单位', '联系人',
        '联系电话', '申请日期']
      const filterVal = ['id', 'unit', 'longingUnit', 'type', 'number', 'bug', 'needs', 'means', 'fixUnit', 'sponsor', 'tel', 'date']
      const list = this.tableData
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '列表excel')
    })
  }
  formatJson (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
  handleRet (ret) {
    for (let key in ret) {
      let element = ret[ret.length - key - 1]
      let tid = key - '0' + 1
      this.ids.push(element.id)
      element.id = tid
      if (element.pic !== '')element.pic = 'http://localhost:8080/pics/' + element.pic
      else element.pic = ''
      this.tableData.push(element)
    }
  }
}
</script>

<style>
  .loading {
    display: block;
    height: 100px;
  }
</style>
