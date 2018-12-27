export const state = () => ({
  drawer: null,
  isLoading: false,
  loadingType: 'normal',
  title: ''
})

export const mutations = {
  TOGGLE_DRAWER: function (state, payload = undefined) {
    state.drawer = payload === undefined ? !state.drawer : payload
  },
  SET_TITLE: function (state, payload = undefined) {
    state.title = payload
  }
}
