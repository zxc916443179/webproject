<template>
  <el-row>
    <el-col :span="4">
      <left-nav></left-nav>
    </el-col>
    <el-col :span="20">
      <span style="font-size: 20px;">welcome back</span>
    </el-col>
  </el-row>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftNav from './LeftNav'
import { User } from '@/services/user'
@Component({
  components: { LeftNav }
})
export default class DBMHome extends Vue {
  async mounted () {
    await User.test(this, 'dataBaseManager')
  }
}
</script>
