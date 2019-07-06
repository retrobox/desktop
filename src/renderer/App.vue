<template>
  <div id="app">
    <v-app :dark="dark">
      <v-container>
        <v-layout class="mb-4 mt-4" space-between>
            <v-img src="https://raw.githubusercontent.com/retrobox/web/master/assets/images/nav.png" height="40" contain />
            <div>
              <v-btn icon color="success" outline @click="invertColor()">
                <v-icon>invert_colors</v-icon>
              </v-btn>
              <v-btn icon color="info" outline>
                <v-icon>help_outline</v-icon>
              </v-btn>
              <v-btn
                v-if="isLogged"
                icon color="error" outline @click="logoutConfirmationModal = true">
                <v-icon>exit_to_app</v-icon>
              </v-btn>
            </div>
        </v-layout>
        <v-layout justify-center align-center py-5 my-5 v-if="globalLoading">
            <v-progress-circular indeterminate></v-progress-circular>
        </v-layout>
        <v-layout justify-center align-center py-5 my-5 v-if="globalLoading === false && isElevated === false && needToBeElevated == true">
            <v-layout justify-center column class="text-xs-center">
                <v-alert
                  :value="true"
                  type="error">
                    Vous devez ouvrir ce programme en tant qu'administrateur pour pouvoir l'utiliser
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
        Vous êtes maintenant connecté!
        <v-btn
          flat
          @click="alert = false"
        >
          Ok
        </v-btn>
      </v-snackbar>
      <v-dialog
        v-model="logoutConfirmationModal"
        max-width="500px">
        <v-card>
          <v-card-title>
            Voulez vous vraiment vous déconnecter ?
          </v-card-title>
          <v-card-actions>
            <v-btn flat @click="logout()" color="error">
              Oui
            </v-btn>
            <v-spacer />
            <v-btn flat @click="logoutConfirmationModal = false" color="success">
              Non
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
  import Axios from 'axios';
  const isElevated = require('is-elevated')
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
      let envs = [
        process.env.API_ENDPOINT,
        process.env.WEB_ENDPOINT,
        process.env.WEB_SOCKET_ENDPOINT
      ]
      if (process.env.NODE_ENV === 'development') {
        console.log('development environment used')
        let ip = null
        if (process.env.DEV_REMOTE_ADDRESS !== undefined) {
          console.log('custom dev remote address detected', process.env.DEV_REMOTE_ADDRESS)
          ip = process.env.DEV_REMOTE_ADDRESS
        } else {
          ip = require('network-address')()
        }
        envs[0] = envs[0] === undefined ? 'http://' + ip + ':8000' : envs[0]
        envs[1] = envs[1] === undefined ? 'http://' + ip + ':3000' : envs[1]
        envs[2] = envs[2] === undefined ? 'http://' + ip + ':3008' : envs[2]
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

                let consoles = res.data.consoles
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
      }
    }
  }
</script>

<style>
</style>
