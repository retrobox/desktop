import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {    
        apiEndpoint: '',
        webEndpoint: '',
        webSocketEndpoint: '',
        consoles: []
    },
    mutations: {
        'SET_API_ENDPOINT': function (state, endpoint) {
            state.apiEndpoint = endpoint
        },
        'SET_WEB_ENDPOINT': function (state, endpoint) {
            state.webEndpoint = endpoint
        },
        'SET_WEB_SOCKET_ENDPOINT': function (state, endpoint) {
            state.webSocketEndpoint = endpoint
        },
        'SET_CONSOLES': function (state, consoles) {
            state.consoles = consoles
        }
    }
})