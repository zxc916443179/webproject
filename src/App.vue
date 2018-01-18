<template>
  <div id="app">
    <header-bar></header-bar>
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import HeaderBar from '@/components/shared/HeaderBar'
import shared from '@/shared'
import { Login } from '@/services/login'
@Component({
  components: {
    HeaderBar
  }
})
export default class App extends Vue {
  name = 'app'
  async mounted () {
    setInterval(async () => {
      if (shared.isLogin === true) await Login.testLogin(this)
    }, 3000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
