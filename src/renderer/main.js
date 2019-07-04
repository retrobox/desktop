import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import App from './App'
import 'vuetify/dist/vuetify.min.css'
import VueClipboard from 'vue-clipboard2'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
