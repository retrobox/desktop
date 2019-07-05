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
                        Se connecter
                    </v-btn>
                </div>
                <div v-else>
                    <v-alert
                        :value="true"
                        icon="open_in_new"
                        type="info">
                        Nous avons ouvert le site web retrobox.tech sur votre navigateur préféré. Rendez vous y, et suivez les instructions. Je vous retrouve de l'autre côté !
                    </v-alert>
                    <v-alert
                        :value="true"
                        type="warning">
                        Il se peut que le site web ne se soit pas ouvert automatiquement, vous pouvez alors copier et coller l'url dans votre navigateur
                    </v-alert>
                    <v-btn 
                        color="primary"
                        @click="$copyText(urlToOpen)"
                        >
                        Copier l'url
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
        apiEndpoint: '',
        webEndpoint: '',
        webSocketEndpoint: '',
        opened: false,
        loading: false,
        urlToOpen: ''
    }),
    created () {
        let envs = [
            process.env.API_ENDPOINT,
            process.env.WEB_ENDPOINT,
            process.env.WEB_SOCKET_ENDPOINT
        ]
        if (process.env.NODE_ENV === 'development') {
            if (process.env.DEV_REMOTE_ADDRESS !== undefined) {
                let ip = process.env.DEV_REMOTE_ADDRESS
            } else {
                let ip = require('network-address')()
            }
    
            envs[0] = envs[0] === undefined ? 'http://' + ip + ':8000' : envs[0]
            envs[1] = envs[1] === undefined ? 'http://' + ip + ':3000' : envs[1]
            envs[2] = envs[2] === undefined ? 'http://' + ip + ':3008' : envs[2]
        }
        console.log(envs)

        this.apiEndpoint = envs[0]
        this.webEndpoint = envs[1]
        this.webSocketEndpoint = envs[2]
    },
    methods: {
        login: function () {
            this.loading = true
            axios.get(this.apiEndpoint + '/account/login-desktop').then((res) => {
                let token = res.data.data.token
                this.urlToOpen = this.webEndpoint + '/dashboard/login-desktop?token=' + token
                console.log(this.urlToOpen)
                //child_process.execSync('xdg-open ' + this.urlToOpen)
                let opened = shell.openExternal(this.urlToOpen)
                setTimeout(() => {
                    this.loading = false
                    this.opened = opened
                }, 200)
                // websocket
                let socket = io(this.webSocketEndpoint, {
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

<style>

</style>
