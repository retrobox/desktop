<template>
  <div id="app">
    <v-app :dark="dark">
      <v-container>
        <v-layout class="mb-4 mt-4" space-between>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="primary" outline v-on="on" @click="switchLocale()">
                    <v-icon>flag</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('switch-locale') }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="success" outline v-on="on" @click="invertColor()">
                    <v-icon>invert_colors</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('toggle-dark-mode') }}</span>
              </v-tooltip>
            </div>
            <v-img 
              src="https://raw.githubusercontent.com/retrobox/web/master/assets/images/nav.png"
              height="40"
              contain />
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="info" outline v-on="on" @click="openHelp()">
                    <v-icon>help_outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('help') }}</span>
              </v-tooltip>
              <v-tooltip 
                bottom 
                v-if="isLogged">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon color="error" outline v-on="on" @click="logoutConfirmationModal = true">
                    <v-icon>exit_to_app</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('logout') }}</span>
              </v-tooltip>
            </div>
        </v-layout>
        <v-layout justify-center align-center py-5 my-5 v-if="globalLoading">
            <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
        <v-layout 
          justify-center
          align-center
          py-5 my-5
          v-if="globalLoading === false && isElevated === false && needToBeElevated == true">
            <v-layout justify-center column class="text-xs-center">
                <v-alert
                  :value="true"
                  type="error">
                    {{ $t('must-open-as-administrator') }}                    
                </v-alert>    
            </v-layout>
        </v-layout>
        <v-layout v-if="globalLoading == false && (isElevated || !needToBeElevated)">
          <Installation v-if="isLogged === true" />
          <Login 
            v-if="isLogged === false"
            @logged="onLogged()" />
        </v-layout>
      </v-container>
      <v-snackbar
        v-model="alert"
        color="success"
        bottom
        multi-line
        right
        vertical
        :timeout="6000"
      >
        {{ $t('successful-login') }}
        <v-btn
          flat
          @click="alert = false"
        >
          {{ $t('close') }}
        </v-btn>
      </v-snackbar>
      <v-dialog
        v-model="logoutConfirmationModal"
        max-width="500px">
        <v-card>
          <v-card-title>
            {{ $t('confirm-logout') }}
          </v-card-title>
          <v-card-actions>
            <v-btn flat @click="logout()" color="error">
              {{ $t('yes') }}
            </v-btn>
            <v-spacer />
            <v-btn flat @click="logoutConfirmationModal = false" color="success">
              {{ $t('no') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script> 
  import Installation from './components/Installation.vue'
  import Login from './components/Login.vue'
  import Axios from 'axios'
  import moment from 'moment'
  const isElevated = require('is-elevated')
  const { shell } = require('electron')
  export default {
    name: 'desktop_lab',
    components: {
       Installation,
       Login
    },
    data: () => ({
      isLogged: null,
      alert: false,
      isElevated: true,
      needToBeElevated: false,
      globalLoading: true,
      dark: false,
      logoutConfirmationModal: false
    }),
    created() {
      console.log("navigator language detected: " + navigator.language)
      if (navigator.language === "fr") {
        this.$i18n.locale = 'fr'
      } else {
        this.$i18n.locale = 'en'
      }
      console.log('Using locale:', this.$i18n.locale)
      let envs = [
        'https://api.retrobox.tech',
        'https://retrobox.tech',
        'https://ws.retrobox.tech'
      ]
      if (process.env.NODE_ENV === 'development' && process.env.DEFAULT_ENDPOINT === undefined) {
        console.log('development environment used')
        let ip = null
        if (process.env.DEV_REMOTE_ADDRESS !== undefined) {
          console.log('custom dev remote address detected', process.env.DEV_REMOTE_ADDRESS)
          ip = process.env.DEV_REMOTE_ADDRESS
        } else {
          ip = require('network-address')()
        }
        envs[0] = envs[0] === undefined || ip !== null ? 'http://' + ip + ':8000' : envs[0]
        envs[1] = envs[1] === undefined || ip !== null ? 'http://' + ip + ':3000' : envs[1]
        envs[2] = envs[2] === undefined || ip !== null ? 'http://' + ip + ':3008' : envs[2]
      } 
      console.log('env endpoints used:', envs)
      this.$store.commit('SET_API_ENDPOINT', envs[0])
      this.$store.commit('SET_WEB_ENDPOINT', envs[1])
      this.$store.commit('SET_WEB_SOCKET_ENDPOINT', envs[2])
      
      //this.needToBeElevated = os.platform() === 'linux' || os.platform() == 'darwin'

      // verify if logged
      isElevated().then(elevated => {
          this.isElevated = elevated
          console.log('isElevated: ' + elevated)
          if (this.needToBeElevated && !this.elevated) {
            console.warn("The application doesn't have administrator privileges!")
            this.globalLoading = false
          } else {
            if (localStorage.getItem('userToken') !== null) {
              // verify validity of the token by calling account info API route
              Axios.get(this.$store.state.apiEndpoint + '/dashboard', {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('userToken')
                }
              }).then((res) => {
                console.log(res.data)

                this.isLogged = true
                this.globalLoading = false
                // fetch consoles
                // fetch consoles from API
                // get serial number and token
                moment.locale(this.$i18n.locale)
                let consoles = res.data.data.consoles.map(item => {
                  if (item.created_at !== null) {
                    item.created_at = moment(item.created_at).fromNow()
                  }
                  if (item.first_boot_at !== null) {
                    item.first_boot_at = moment(item.first_boot_at).fromNow()
                  }
                  return item
                })
                
                console.log(consoles.length + ' consoles detected!')

                this.$store.commit('SET_CONSOLES', consoles)
              }).catch((err) => {
                console.warn("Can't login to api")
                console.log(err.response)
                console.error(err)
                this.isLogged = false
                this.globalLoading = false
              })
            } else {
              this.isLogged = false
              this.globalLoading = false
            }
          }
      });
    },
    methods: {
      onLogged() {
        this.isLogged = true
        this.alert = true
      },
      invertColor() {
        this.dark = !this.dark
      },
      logout() {
        localStorage.removeItem('userToken')
        this.logoutConfirmationModal = false
        this.isLogged = false
      },
      switchLocale() {
        if (this.$i18n.locale === 'fr') {
          this.$i18n.locale = 'en'
        } else {
          this.$i18n.locale = 'fr'
        }
      },
      openHelp() {
        shell.openExternal('https://retrobox.tech/contact-us')
      }
    }
  }
</script>
