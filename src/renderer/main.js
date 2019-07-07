import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import App from './App'
import 'vuetify/dist/vuetify.min.css'
import VueClipboard from 'vue-clipboard2'
import store from './store'
import VueI18n from 'vue-i18n'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueClipboard)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    fr: require('./assets/locales/fr.json'),
    en: require('./assets/locales/en.json')
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  store,
  i18n
}).$mount('#app')
