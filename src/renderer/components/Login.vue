<template>
    <v-layout fill-height justify-center align-center py-3>
        <v-layout column>
            <v-layout justify-center column class="text-xs-center">
                <div v-if="!opened">
                    <v-btn 
                        success
                        block
                        large
                        :loading="loading"
                        :disabled="loading"
                        @click="login()">
                        <v-icon left>
                            account_circle
                        </v-icon>
                        {{ $t('login') }}
                    </v-btn>
                </div>
                <div v-else>
                    <v-alert
                        :value="true"
                        icon="open_in_new"
                        type="info">
                        {{ $t('login-url-opened') }}
                    </v-alert>
                    <v-alert
                        :value="true"
                        type="warning">
                        {{ $t('login-url-opened-warning') }}
                    </v-alert>
                    <v-btn 
                        color="primary"
                        @click="$copyText(urlToOpen)">
                        {{ $t('copy-login-url') }}
                    </v-btn>
                </div>
            </v-layout>
        </v-layout>
    </v-layout>
</template>

<script>
const { shell } = require('electron')
const axios = require('axios')
const io = require('socket.io-client')
const child_process = require('child_process')
export default {
    data: () => ({
        opened: false,
        loading: false,
        urlToOpen: ''
    }),
    mounted() {
        this.$store.commit('SET_TITLE', this.$i18n.t('login'))
    },
    methods: {
        login: function () {
            this.loading = true
            axios.get(this.$store.state.apiEndpoint + '/account/login-desktop').then((res) => {
                let token = res.data.data.token
                this.urlToOpen = this.$store.state.webEndpoint + '/dashboard/login-desktop?token=' + token
                console.log(this.urlToOpen)
                //child_process.execSync('xdg-open ' + this.urlToOpen)
                let opened = shell.openExternal(this.urlToOpen)
                setTimeout(() => {
                    this.loading = false
                    this.opened = opened
                }, 200)
                // websocket
                let socket = io(this.$store.state.webSocketEndpoint, {
                    transportOptions: {
                        polling: {
                            extraHeaders: {
                                'x-client-type': 'desktop',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    }
                })
                socket.on('desktop_login_finished', (data) => {
                    console.log(data)
                    localStorage.setItem('userToken', data.userToken)
                    // redirect to login page
                    this.$emit('logged')
                })
            })
        }
    }
}
</script>
