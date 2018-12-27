export const state = () => ({
	drawer: null,
	isLoading: false,
	loadingType: 'normal'
})

export const mutations = {
	TOGGLE_DRAWER: function (state, payload = undefined) {
		state.drawer = payload === undefined ? !state.drawer : payload
	}
}
