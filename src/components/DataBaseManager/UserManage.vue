<template>
  <el-row>
    <el-col :span="4">
      <left-nav></left-nav>
    </el-col>
    <el-col :span="20" class="main">
      <el-col :span="5" class="tree">
        <el-tree :load="loadNode" :props="props" lazy @node-click="handleNodeClick" :highlight-current="true" :expand-on-click-node="false"></el-tree>
      </el-col>
      <el-col style="background-color: #E4E7Ed" class="table" :span="19">
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
              <el-button type="primary" @click="openAdd()">添加用户</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="deleteUser()">删除用户</el-button>
            </el-col>
          </el-row>       
          <span v-loading='loading'>
              <el-row>
                <span class="loading" v-if="loading"></span>
                <span v-else>
                <el-col>
                  <el-table :data="tableData" stripe border style="background-color: #e4e7ed" @selection-change="handleSelection">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-row>
                          <el-col :span="8">
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="性别"><span>{{ props.row.gender }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="年龄"><span>{{ props.row.age }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="联系方式"><span>{{ props.row.tel }}</span></el-form-item>
                              </el-form>
                            </el-row>
                          </el-col>
                          <el-col :span="16">
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="用户名"><span>{{ props.row.account }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="email"><span>{{ props.row.email }}</span></el-form-item>
                              </el-form>
                            </el-row>
                            <el-row>
                              <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="职务"><span>{{ props.row.job }}</span></el-form-item>
                              </el-form>
                            </el-row>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column type="selection" width="50"/>
                    <el-table-column prop="tid" label="序号" width="60" />
                    <el-table-column prop="realName" label="真实姓名" />
                    <el-table-column prop="role" label="角色" />
                    <el-table-column prop="unit" label="所属单位"/>
                    <el-table-column prop="post" label="岗位"/>
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
          </el-col>
    </el-col>
    <el-dialog title="添加用户" :visible.sync = 'addUserVisible'>
      <span>
        <el-collapse>
          <el-collapse-item title="用户信息">
            <el-form ref="addUnit" :model="addForm">
              <el-form-item label="用户名" prop="account">
                <el-input v-model="addForm.account"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="addForm.realName"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="所属单位" prop="unit">
                <el-input :disabled="true" v-model="addForm.unit"></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                <el-select v-model="addForm.roleId" placeholder="请选择">
                  <el-option v-for="item in roles" :key="item.id" :label="item.role" :value="item.id">
                    <span style="float: left;">{{ item.role }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio v-model="addForm.gender" label="男">男</el-radio>
                <el-radio v-model="addForm.gender" label="女">女</el-radio>
              </el-form-item>
              <el-form-item label="联系电话" prop="unit">
                <el-input v-model="addForm.tel"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="addForm.age"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="用户备注" prop="userFix">
                <el-input type="textarea" :rows="2" v-model="addForm.userFix"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="职务信息">
            <el-form ref="addUnit" :model="addForm">
              <el-form-item label="职务" prop="job">
                <el-input v-model="addForm.job"></el-input>
              </el-form-item>
              <el-form-item label="岗位" prop="post">
                <el-input v-model="addForm.post"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="jobFix">
                <el-input type="textarea" :rows="2" v-model="addForm.jobFix"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false" type="danger">取消</el-button>
        <el-button @click="addUser()" type="primary">提交</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import { Unit } from '@/services/unit.js'
import { User } from '@/services/user.js'
@Component({
  components: {
    LeftNav
  }
})
export default class UserManage extends Vue {
  loading = false
  search = ''
  searchtype = ''
  addUserVisible = false
  options = [{
    label: '角色',
    value: 'role'
  }, {
    label: '真实姓名',
    value: 'realName'
  }, {
    label: '岗位',
    value: 'post'
  }]
  tableData = []
  updateForm = [{}]
  addForm = {}
  ids = []
  deleteForm = []
  props = {
    label: 'name', children: 'children', isLeaf: 'leaf'
  }
  currentUnit = ''
  roles = []
  async handleNodeClick (data) {
    this.tableData = []
    this.ids = []
    this.currentUnit = data.name
    await this.getUsers()
  }
  async getUsers () {
    let ret = await Unit.getUsers(this, this.currentUnit)
    for (let i in ret) {
      let element = ret[i]
      let user = element.user
      let tid = i - '0' + 1
      this.ids.push(element.id)
      this.tableData.push({
        id: user.id, gender: user.gender, age: user.age, tel: user.tel, realName: user.realName, email: user.email, job: element.job, tid: tid, account: user.userAuth, role: user.role.role, unit: element.unit.name, post: element.post
      })
    }
  }
  async loadNode (node, resolve) {
    if (node.level === 0) {
      let ret = await Unit.getUnits(this)
      let data = []
      for (let key in ret) {
        let element = ret[key]
        if (!element.superior) {
          data.push({
            name: element.name, leaf: element.based
          })
        }
      }
      return resolve(data)
    } else {
      let ret = await Unit.getJuniors(this, node.label)
      let data = []
      for (let i in ret) {
        let element = ret[i]
        data.push({
          name: element.name, leaf: element.based
        })
      }
      return resolve(data)
    }
  }
  async init () {
    this.loading = true
    this.searchtype = ''
    this.search = ''
    this.tableData = []
    this.deleteForm = []
    this.addForm = {}
    this.addUserVisible = false
    this.roles = await User.getRole(this)
    if (this.currentUnit !== '') {
      await this.getUsers()
    }
    this.loading = false
  }
  async mounted () {
    this.init()
  }
  handleSelection (val) {
    this.deleteForm = val
  }
  openAdd () {
    this.addForm.unit = this.currentUnit
    this.currentUnit === '' ? this.$message({message: '请选择一个单位', type: 'warning'}) : this.addUserVisible = true
  }
  async addUser () {
    let form = this.addForm
    if (!form.account || !form.password || !form.unit || !form.roleId || !form.gender || !form.tel || !form.email ||
    !form.job || !form.post || !form.jobFix || !form.age || !form.realName) {
      this.$message({
        message: '请填写完整的用户信息', type: 'warning'
      })
      return
    }
    await User.addUser(this, this.addForm)
    this.addUserVisible = false
    await this.init()
    this.loading = true
    this.getUsers(this, this.currentUnit)
    this.loading = false
  }
  async deleteUser () {
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
      await User.deleteUser(this, this.deleteForm)
      await this.init()
      await this.getUsers()
      this.$message({
        message: '删除成功', type: 'success'
      })
      this.deleteForm = []
    }).catch(() => {
      this.$message({
        message: '已取消删除', type: 'info'
      })
    })
  }
  async findBy () {
    if (this.currentUnit === '') {
      this.$message({
        message: '请选择一个单位', type: 'warning'
      })
      return
    }
    this.loading = true
    let ret = await User.findBy(this, this.searchtype, this.search, this.currentUnit)
    this.tableData = []
    for (let i in ret) {
      let element = ret[i]
      let user = element.user
      let tid = i - '0' + 1
      this.ids.push(element.id)
      this.tableData.push({
        id: user.id, gender: user.gender, age: user.age, tel: user.tel, realName: user.realName, email: user.email, job: element.job, tid: tid, account: user.userAuth, role: user.role.role, unit: element.unit.name, post: element.post
      })
    }
    this.loading = false
  }
  async reset () {
    this.init()
  }
}
</script>

<style>
  .loading {
    display: block;
    height: 100px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
    float: left;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    float: right;
    width: 100%;
  }
</style>
