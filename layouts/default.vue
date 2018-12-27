<template>
	<v-content>
		<DrawerNav />

		<v-toolbar fixed app>
			<v-toolbar-side-icon @click.stop="$store.commit('TOGGLE_DRAWER')"></v-toolbar-side-icon>
			<v-fade-transition mode="out-in">
				<v-toolbar-title :key="$store.state.title">
					{{ $store.state.title }}
				</v-toolbar-title>
			</v-fade-transition>
			<v-spacer></v-spacer>
			<v-menu bottom left offset-y>
				<v-btn
					slot="activator"
					icon
				>
					<v-icon>more_vert</v-icon>
				</v-btn>

				<v-list>
					<v-list-tile
						@click="dialog_settings = true">
						<v-list-tile-action>
							<v-icon>settings</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Settings</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>account_circle</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Profile</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-action>
							<v-icon>exit_to_app</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Logout</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-menu>

		</v-toolbar>
		<v-container fluid transition="fade-transition" class="dashboard-container">
			<v-fade-transition mode="out-in">
				<slot></slot>
			</v-fade-transition>
		</v-container>
	</v-content>
</template>

<script>
import DrawerNav from '../components/DrawerNav'
export default {
	components: {DrawerNav},
	data: () => ({
	}),
	created () {
	},
	methods: {}
}
</script>
