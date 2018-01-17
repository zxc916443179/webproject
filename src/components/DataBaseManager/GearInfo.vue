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
            <el-button type="primary" @click="addGearVisible = true">添加装备</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="deleteGearMeta()">删除装备</el-button>
          </el-col>
        </el-row>       
        <span v-loading='loading'>
          <el-row>
            <span class="loading" v-if="loading"></span>
            <span v-else>
            <el-col>
              <el-table :data="tableData" stripe border style="background-color: #e4e7ed" @selection-change="handleSelection">
                <el-table-column type="selection" width="50"/>
                <el-table-column prop="name" label="装备名称" />
                <el-table-column prop="model" label="装备型号" />
                <el-table-column prop="number" label="装备号码" />
                <el-table-column
                prop="result"
                label="操作">
                <template slot-scope="scope">
                  <div>
                    <span><el-button type="text" @click="openUpdate(scope.$index)">修改</el-button></span>
                  </div>
                </template>
                </el-table-column>
              </el-table>
            </el-col>
            </span>
          </el-row>
        </span>
      </div>
      <el-dialog title="添加器材" :visible.sync="addGearVisible" size="tiny">
        <span>
          <el-form ref="add" :model="addForm">
            <el-form-item label="装备名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="装备型号" prop="model">
              <el-input v-model="addForm.model"></el-input>
            </el-form-item>
            <el-form-item label="装备号码" prop="number">
              <el-input v-model="addForm.number"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer">
          <el-button @click="addGearVisible = false" type="danger">取消</el-button>
          <el-button type="primary" @click="onCommit()">提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="更新器材" :visible.sync="updateGearVisible" size="tiny">
        <span>
          <el-form ref="update" :model="currentGear">
            <el-form-item label="装备名称" prop="name">
              <el-input v-model="currentGear.name"></el-input>
            </el-form-item>
            <el-form-item label="装备型号" prop="model">
              <el-input v-model="currentGear.model"></el-input>
            </el-form-item>
            <el-form-item label="装备号码" prop="number">
              <el-input v-model="currentGear.number"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer">
          <el-button @click="updateGearVisible = false" type="danger">取消</el-button>
          <el-button type="primary" @click="updateGear()">提交</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import Vue from 'vue'
import { GearMetaData } from '@/services/materialAndGear'
@Component({
  components: {
    LeftNav
  }
})
export default class GearInfo extends Vue {
  loading = false
  addForm = {}
  search = ''
  searchtype = ''
  tableData = []
  addGearVisible = false
  updateGearVisible = false
  deleteForm = []
  options = [{
    label: '装备名称', value: 'name'
  }, {
    label: '装备型号', value: 'model'
  }]
  currentGear = {}
  async init () {
    this.deleteForm = []
    this.loading = true
    this.addForm = {}
    this.search = ''
    this.searchtype = ''
    this.tableData = []
    this.tableData = await GearMetaData.getGearMetaData(this)
    this.loading = false
  }
  async mounted () {
    await this.init()
  }
  async onCommit () {
    if (!this.addForm.name || !this.addForm.number || !this.addForm.model) {
      this.$message({
        message: '请填写完整信息', type: 'warning'
      })
      return
    }
    await GearMetaData.addGearMetaData(this, this.addForm.name, this.addForm.model, this.addForm.number)
    this.addGearVisible = false
    await this.init()
  }
  async deleteGearMeta () {
    if (this.deleteForm.length === 0) {
      this.$message({
        message: '请选择要删除的项目', type: 'warning'
      })
      return
    }
    await GearMetaData.deleteGearMetaData(this, this.deleteForm)
    await this.init()
  }
  async handleSelection (val) {
    this.deleteForm = val
  }
  async openUpdate (index) {
    this.updateGearVisible = true
    this.currentGear = this.tableData[index]
  }
  async updateGear () {
    await GearMetaData.updateGearMetaData(this, this.currentGear.id, this.currentGear.name, this.currentGear.model, this.currentGear.number)
    this.loading = true
    this.updateGearVisible = false
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
    this.tableData = await GearMetaData.findGearMetaDataBy(this, this.searchtype, this.search)
    this.loading = false
  }
  async reset () {
    await this.init()
  }
}
</script>
<style>
  .loading {
    display: block;
    height: 100px;
  }
</style>
