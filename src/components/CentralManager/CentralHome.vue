<template>
  <div>
    <el-container>
      <el-aside>
    <right-nav></right-nav>
      </el-aside>
    </el-container>
    <el-container>
      <el-main>
        <i> CentralHome</i>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/CentralManager/RightNav'
import { User } from '@/services/user'
@Component({
  components: {
    RightNav
  }
})
export default class CentralHome extends Vue {
  async mounted () {
    await User.test(this, 'centralManager')
  }
}
</script>
