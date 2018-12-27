<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    app
  >
    <v-list dense>
      <v-list-tile
        to="/"
        ripple
        exact>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        to="/installation"
        ripple
        exact>
        <v-list-tile-action>
          <v-icon>cloud_download</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Setup a console</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DrawerNav',
  data: () => ({
	  drawer: null
  }),
  watch: {
    '$store.state.drawer': function (value) {
      this.drawer = value
    },
    'drawer': function (value) {
      this.$store.commit('TOGGLE_DRAWER', value)
    }
  }
}
</script>
