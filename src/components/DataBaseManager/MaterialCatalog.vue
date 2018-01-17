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
              <el-button type="primary" @click="addCatalogVisible = true">添加器材类别</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="deleteCatalog()">删除类别</el-button>
            </el-col>
          </el-row>       
          <span v-loading='loading'>
              <el-row>
                <span class="loading" v-if="loading"></span>
                <span v-else>
                <el-col>
                  <el-table :data="tableData" stripe border style="background-color: #e4e7ed" @selection-change="handleSelection">
                    <el-table-column type="selection" width="50"/>
                    <el-table-column prop="tid" label="序号" width="60"/>
                    <el-table-column prop="name" label="器材类别名称" />
                    <el-table-column prop="superior" label="父器材类别名称" />
                    <el-table-column prop="level" label="器材类别等级" />
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
    </el-col>
    <el-dialog title="添加器材类别" :visible.sync = 'addCatalogVisible'>
      <span>
        <el-form ref="addCatalog" :model="addForm">
          <el-form-item label="器材类别名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="父器材类别" prop="superiorId">
            <el-select v-model="addForm.superiorId" placeholder="请选择" style="margin-left:2.5%;">
              <el-option v-for="item in superiors" :key="item.id" :label="item.superiorName" :value="item.id">
                <span style="float: left;">{{ item.superiorName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="器材类别等级" prop="level">
            <el-input v-model="addForm.level"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatalogVisible = false" type="danger">取消</el-button>
        <el-button @click="addCatalog()" type="primary">提交</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import Vue from 'vue'
import { MaterialCatalog as Catalog } from '@/services/materialAndGear.js'
@Component({
  components: {
    LeftNav
  }
})
export default class MaterialCatalog extends Vue {
  search = ''
  searchtype = ''
  loading = false
  tableData = []
  addCatalogVisible = false
  superiors = []
  options = [{
    label: '器材类别名称', value: 'name'
  }, {label: '器材类别等级', value: 'level'}]
  deleteForm = []
  addForm = {superiorId: -1}
  async init () {
    this.addForm = {}
    this.superiors = []
    this.superiors.push({
      superiorName: '无', id: 0
    })
    this.loading = true
    this.tableData = []
    this.addCatalogVisible = false
    let ret = await Catalog.getAllCatalogs(this)
    for (let i in ret) {
      let el = ret[i]
      if (!el.superior) {
        el.superior = '无'
      } else {
        el.superior = el.superior.name
      }
      let tid = i - '0' + 1
      this.tableData.push({
        id: el.id, tid: tid, name: el.name, superior: el.superior, level: el.level
      })
      this.superiors.push({
        superiorName: el.name, id: el.id
      })
    }
    this.loading = false
  }
  async mounted () {
    await this.init()
  }
  async addCatalog () {
    if (!this.addForm.name || this.addForm.superiorId === -1 || !this.addForm.level) {
      this.$message({
        message: '请填写完整信息', type: 'warning'
      })
      return
    }
    console.log(this.addForm.superiorId)
    await Catalog.addCatalog(this, this.addForm.name, this.addForm.superiorId, this.addForm.level)
    await this.init()
  }
  handleSelection (val) {
    this.deleteForm = val
  }
  async deleteCatalog () {
    if (this.deleteForm.length === 0) {
      this.$message({
        message: '请选择要删除的类别', type: 'warning'
      })
      return
    }
    this.$confirm('将要删除所选类别并移除其所属类别以及所属器材，是否继续？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await Catalog.deleteCatalog(this, this.deleteForm)
      await this.init()
    }).catch(() => {
      this.$message({
        message: '已取消删除', type: 'info'
      })
    })
  }
  async findBy () {
    if (this.search === '' || this.searchtype === '') {
      this.$message({
        message: '搜索条件或内容不能为空', type: 'warning'
      })
    } else {
      this.loading = true
      let ret = await Catalog.findBy(this, this.searchtype, this.search)
      this.tableData = []
      for (let i in ret) {
        let el = ret[i]
        if (!el.superior) {
          el.superior = '无'
        } else {
          el.superior = el.superior.name
        }
        let tid = i - '0' + 1
        this.tableData.push({
          id: el.id, tid: tid, name: el.name, superior: el.superior, level: el.level
        })
      }
      this.loading = false
    }
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
