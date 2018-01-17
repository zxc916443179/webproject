<template>
  <el-row>
    <el-col :span="4">
      <left-nav></left-nav>
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
          <el-row style="margin-top: 3%; margin-left: -3%; margin-bottom: 1%">
            <el-col :span="5">
              <el-button type="primary" @click="addUnitVisible = true">添加单位</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="deleteUnit()">删除单位</el-button>
            </el-col>
          </el-row>       
          <span v-loading='loading'>
              <el-row>
                <span class="loading" v-if="loading"></span>
                <span v-else>
                <el-col>
                  <el-table :data="tableData" stripe border style="background-color: #e4e7ed" @selection-change="handleSelection">
                    <el-table-column type="selection" width="50"/>
                    <el-table-column prop="number" label="编号" width="60" />
                    <el-table-column prop="name" label="单位名" />
                    <el-table-column prop="superiorName" label="上级单位" />
                    <el-table-column prop="responsibleName" label="负责人"/>
                    <el-table-column prop="tel" label="联系方式"/>
                    <el-table-column prop="fix" label="备注"/>
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
    <el-dialog title="添加单位" :visible.sync = 'addUnitVisible'>
      <span>
        <el-form ref="addUnit" :model="addForm">
          <el-form-item label="单位编号" prop="number">
            <el-input v-model="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="superiorId">
            <el-select v-model="superiorId" placeholder="请选择" style="margin-left:2.5%;">
              <el-option v-for="item in superiors" :key="item.superiorId" :label="item.superiorName" :value="item.superiorId">
                <span style="float: left;">{{ item.superiorName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.number }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位负责人" prop="responsibleId">
            <el-select v-model="responsibleId" placeholder="请选择">
              <el-option v-for="item in responsibles" :key="item.responsibleId" :label="item.responsibleName" :value="item.responsibleId">
                <span style="float: left;">{{ item.responsibleName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.post }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="fix">
            <el-input type="textarea" :rows="2" v-model="addForm.fix"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUnitVisible = false" type="danger">取消</el-button>
        <el-button @click="onCommit()" type="primary">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改单位信息" :visible.sync = 'updateUnitVisible'>
      <span>
        <el-form ref="updateUnit" :model="updateForm">
          <el-form-item label="单位编号" prop="number">
            <el-input v-model="updateForm.number"></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="superior">
            <el-select v-model="updateForm.superiorId" placeholder="请选择" style="margin-left:2.5%;">
              <el-option v-for="item in superiors" :key="item.superiorId" :label="item.superiorName" :value="item.superiorId">
                <span style="float: left;">{{ item.superiorName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.number }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位负责人" prop="responsible">
            <el-select v-model="updateForm.responsibleId" placeholder="请选择">
              <el-option v-for="item in responsibles" :key="item.responsibleId" :label="item.responsibleName" :value="item.responsibleId">
                <span style="float: left;">{{ item.responsibleName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.post }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="updateForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="fix">
            <el-input type="textarea" :rows="2" v-model="updateForm.fix"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUnitVisible = false" type="danger">取消</el-button>
        <el-button @click="updateUnit()" type="primary">提交</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import { Unit } from '@/services/unit'
@Component({
  components: {
    LeftNav
  }
})
export default class UnitManage extends Vue {
  addUnitVisible = false
  updateUnitVisible = false
  index = 0
  loading = false
  search = ''
  searchtype = ''
  options = [{
    label: '编号',
    value: 'number'
  }, {
    label: '单位名',
    value: 'name'
  }]
  tableData = []
  updateForm = [{}]
  ids = []
  deleteForm = []
  addForm = {
    number: '', name: '', superiorId: -1, responsibleId: -1, tel: '', fix: ''
  }
  responsibles = []
  superiors = []
  superiorId = ''
  responsibleId = ''
  async mounted () {
    await this.init()
  }
  async init () {
    this.addUnitVisible = false
    this.loading = false
    this.search = ''
    this.searchtype = ''
    this.tableData = []
    this.ids = []
    this.deleteForm = []
    this.addForm = {
      number: '', name: '', superiorId: -1, responsibleId: -1, tel: '', fix: ''
    }
    this.responsibles = []
    this.superiors = []
    this.superiorId = ''
    this.responsibleId = ''
    this.loading = true
    let ret = await Unit.getResponsibles(this)
    this.responsibles.push({
      responsibleName: '无', responsibleId: 0
    })
    for (const key in ret) {
      let element = ret[key]
      if (!element.manager) {
        element.responsibleId = element.id
        element.responsibleName = element.user.realName
        this.responsibles.push(element)
      }
    }
    ret = await Unit.getUnits(this)
    this.superiors.push({
      superiorName: '无', superiorId: 0
    })
    for (const key in ret) {
      let element = ret[key]
      element.superiorId = element.id
      element.superiorName = element.name
      this.superiors.push({
        superiorId: element.superiorId, superiorName: element.superiorName
      })
      if (!element.superior) {
        element.superiorName = '无'
        element.superiorId = 0
      } else {
        element.superiorName = element.superior.name
        element.superiorId = element.superior.id
      }
      if (!element.responsible) {
        element.responsibleName = '无'
        element.responsibleId = 0
      } else {
        element.responsibleName = ret[key].responsible.user.realName
        element.responsibleId = ret[key].responsible.id
      }
      this.tableData.push(element)
    }
    this.loading = false
  }
  async findBy () {
    if (this.search === '' || this.searchtype === '') {
      this.$message({
        message: '搜索条件或内容不能为空', type: 'warning'
      })
    } else {
      let ret = await Unit.findBy(this, this.searchtype, this.search, '查找成功')
      this.tableData = []
      for (let key in ret) {
        let element = ret[key]
        if (!element.superior) {
          element.superiorName = '无'
          element.superiorId = 0
        } else {
          element.superiorName = element.superior.name
          element.superiorId = element.superior.id
        }
        if (!element.responsible) {
          element.responsibleName = '无'
          element.responsibleId = 0
        } else {
          element.responsibleName = ret[key].responsible.user
          element.responsibleId = ret[key].responsible.id
        }
        this.tableData.push(element)
      }
    }
  }
  async reset () {
    await this.init()
  }
  async onCommit () {
    if (this.addForm.number !== '' && this.addForm.name !== '' && this.superiorId !== '' && this.responsibleId !== '' && this.addForm.tel !== '') {
      await Unit.addUnit(this, this.addForm.number, this.addForm.name, this.superiorId, this.responsibleId, this.addForm.tel, this.addForm.fix)
      this.$message({
        message: '添加成功', type: 'success'
      })
      await this.init()
    } else {
      this.$message({
        message: '请填写完整的部门信息',
        type: 'warning'
      })
    }
  }
  async deleteUnit () {
    if (this.deleteForm.length === 0) {
      this.$message({
        message: '请选择要删除的单位', type: 'warning'
      })
      return
    }
    this.$confirm('将要删除所选单位并移除所有所属单位的人员，是否继续？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await Unit.deleteUnits(this, this.deleteForm)
      this.tableData = []
      await this.init()
      this.$message({
        message: '删除成功', type: 'success'
      })
    }).catch(() => {
      this.$message({
        message: '已取消删除', type: 'info'
      })
    })
  }
  async updateUnit () {
    await Unit.updateUnit(this, this.updateForm.id, this.updateForm.number, this.updateForm.name, this.updateForm.superiorId,
    this.updateForm.responsibleId, this.updateForm.tel, this.updateForm.fix)
    this.$message({
      message: '添加成功', type: 'success'
    })
    this.updateUnitVisible = false
    await this.init()
  }
  handleSelection (val) {
    this.deleteForm = val
  }
  openUpdate (index) {
    this.updateForm = this.tableData[index]
    this.updateUnitVisible = true
  }
}
</script>
