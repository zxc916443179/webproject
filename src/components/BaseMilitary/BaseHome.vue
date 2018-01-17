<template>
  <el-row>
    <el-col :span="4">
      <right-nav></right-nav>
    </el-col>
    <el-col :span="20">
      <span style="font-size: 20px;">welcome back</span>
    </el-col>
  </el-row>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/BaseMilitary/RightNav'
import { User } from '@/services/user'
@Component({
  components: {
    RightNav
  }
})
export default class BaseHome extends Vue {
  async mounted () {
    await User.test(this, 'militaryBase')
  }
}
</script>
