// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import shared from './shared'
Vue.config.productionTip = false
Vue.use(element)
/* eslint-disable no-new */
shared.init(this).then(() => {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}).catch(e => {
  if (e.code !== 101) {
    alert('载入时发生错误' + e)
  } else {
    new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
