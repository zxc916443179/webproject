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
              <el-button type="primary" @click="addMaterialVisible = true">添加器材</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="deleteMaterial()">删除器材</el-button>
            </el-col>
          </el-row>       
          <span v-loading='loading'>
              <el-row>
                <span class="loading" v-if="loading"></span>
                <span v-else>
                <el-col>
                  <el-table :data="tableData" stripe border style="background-color: #e4e7ed" @selection-change="handleSelection">
                    <el-table-column type="selection" width="50"/>
                    <el-table-column prop="number" label="器材编号" />
                    <el-table-column prop="name" label="器材名称" />
                    <el-table-column prop="catalog" label="所属器材类别" />
                    <el-table-column
                    prop="pic"
                    label="图片">
                    <template slot-scope="picScope">
                      <div>
                        <span>
                          <el-popover ref="popover1" placement="top-start" title="图片" trigger="click" >
                              <img :src="tableData[index].pic" v-if="tableData[index].pic !== ''">
                              <span v-else>暂无图片</span>
                          </el-popover>
                          <el-button @click="index = picScope.$index" v-popover:popover1>显示图片</el-button>
                        </span>
                      </div>
                    </template>
                    </el-table-column>
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
    <el-dialog title="添加器材" :visible.sync="addMaterialVisible" size="tiny">
      <span>
        <el-form ref="add" :model="addForm">
          <el-form-item label="器材名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="所属器材类别" prop="catalog">
            <el-select v-model="addForm.catalogId" placeholder="请选择">
              <el-option v-for="item in catalogs" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span>图片上传</span>
            <el-upload ref="upload" class="upload-demo" drag multiple :auto-upload="false" action="http://localhost:8080/springboot/upload">
              <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="addMaterialVisible = false" type="danger">取消</el-button>
        <el-button type="primary" @click="onCommit()">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改器材信息" :visible.sync="updateMaterialVisible" size="tiny">
      <span>
        <el-form ref="update" :model="updateForm">
          <el-form-item label="器材名称" prop="name">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="updateForm.number"></el-input>
          </el-form-item>
          <el-form-item label="所属器材类别" prop="catalog">
            <el-select v-model="updateForm.catalogId" placeholder="请选择">
              <el-option v-for="item in catalogs" :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span>图片上传</span>
            <el-upload ref="upload" class="upload-demo" drag multiple :auto-upload="false" :action="serverBase + '/upload'">
              <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="updateMaterialVisible = false" type="danger">取消</el-button>
        <el-button type="primary" @click="applyUpdate()">提交</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import { MaterialCatalog, Material } from '@/services/materialAndGear'
import Vue from 'vue'
import { ServerBase } from '@/service'
@Component({
  components: {
    LeftNav
  }
})
export default class MaterialInfo extends Vue {
  addMaterialVisible = false
  updateMaterialVisible = false
  search = ''
  searchtype = ''
  index = 0
  catalogs = []
  addForm = {}
  updateForm = {}
  tableData = []
  loading = false
  serverBase = ServerBase
  deleteForm = []
  async init () {
    this.addMaterialVisible = false
    this.loading = true
    this.searchtype = ''
    this.search = ''
    this.addForm = {}
    this.updateForm = {}
    this.catalogs = []
    this.tableData = []
    this.options = [{
      label: '器材编号', value: 'number'
    }, {
      label: '器材名称', value: 'name'
    }]
    let ret = await MaterialCatalog.getAllCatalogs(this)
    for (let i in ret) {
      let el = ret[i]
      this.catalogs.push({
        name: el.name, id: el.id
      })
    }
    ret = await Material.getMaterialMeta(this)
    for (let i in ret) {
      let el = ret[i]
      if (el.pic !== '')el.pic = 'http://localhost:8080/pics/' + el.pic
      else el.pic = ''
      el.catalog = el.catalog.name
      this.tableData.push(el)
    }
    this.loading = false
  }
  async mounted () {
    this.init()
  }
  async onCommit () {
    if (this.$refs.upload.uploadFiles.length > 1) {
      this.$message({
        message: '只能上传一个文件',
        type: 'warning'
      })
      return
    }
    if (this.$refs.upload.uploadFiles.length > 0 && this.$refs.upload.uploadFiles[0].raw.type !== 'image/png' && this.$refs.upload.uploadFiles[0].raw.type !== 'image/jpeg') {
      this.$message({
        message: '只能上传jpg或png格式图片',
        type: 'warning'
      })
      return
    }
    await Material.addMaterial(this, this.addForm.number, this.addForm.name, this.addForm.catalogId, this.$refs.upload.uploadFiles.length > 0 ? this.$refs.upload.uploadFiles[0].name : '')
    await this.$refs.upload.submit()
    await this.init()
  }
  handleSelection (val) {
    this.deleteForm = val
  }
  async deleteMaterial () {
    if (this.deleteForm.length === 0) {
      this.$message({
        messeage: '请选择要删除的用户', type: 'warning'
      })
      return
    }
    this.$confirm('将要删除所选用户，是否继续？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      this.loading = true
      await Material.deleteMaterialMeta(this, this.deleteForm)
      await this.init()
    }).catch(() => {
      this.$message({
        message: '已取消删除', type: 'info'
      })
    })
  }
  openUpdate (index) {
    this.updateMaterialVisible = true
    this.updateForm = this.tableData[index]
  }
  async applyUpdate () {
    if (this.$refs.upload.uploadFiles.length > 1) {
      this.$message({
        message: '只能上传一个文件',
        type: 'warning'
      })
      return
    }
    if (this.$refs.upload.uploadFiles.length > 0 && this.$refs.upload.uploadFiles[0].raw.type !== 'image/png' && this.$refs.upload.uploadFiles[0].raw.type !== 'image/jpeg') {
      this.$message({
        message: '只能上传jpg或png格式图片',
        type: 'warning'
      })
      return
    }
    await Material.updateMaterial(this, this.updateForm.id, this.updateForm.number, this.updateForm.name, this.updateForm.catalogId, this.$refs.upload.uploadFiles.length > 0 ? this.$refs.upload.uploadFiles[0].name : '')
    await this.$refs.upload.submit()
    this.updateMaterialVisible = false
    this.init()
  }
  async findBy () {
    if (this.searchtype === '' || this.search === '') {
      this.$message({
        message: '搜索条件或内容不能为空', type: 'warning'
      })
      return
    }
    this.tableData = []
    this.loading = true
    let ret = await Material.findMaterialMetaDataBy(this, this.searchtype, this.search)
    for (let i in ret) {
      let el = ret[i]
      if (el.pic !== '')el.pic = 'http://localhost:8080/pics/' + el.pic
      else el.pic = ''
      el.catalog = el.catalog.name
      this.tableData.push(el)
    }
    this.loading = false
  }
}
</script>
<style>
  .loading {
    display: block;
    height: 100px;
  }
</style>
