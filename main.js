import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from "uview-ui";
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uView from "uview-ui";
Vue.use(uView);
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif