<template>
  <v-navigation-drawer
    fixed
    v-model="$store.state.drawer"
    app
  >
    <v-list dense>
      <v-list-tile
        :to="{ name: 'home' }"
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
        :to="{ name: 'installation' }"
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
	name: 'DrawerNav'
}
</script>
