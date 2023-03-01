<template lang="pug">
	v-dialog(content-class="storage-alert", v-model="modal", persistent)
		.storage-alert-container
			
			.watcher
				|{{ storage }}

</template>

<script>
	export default {
		data() {
			return {
				modal: false
			}
		},
		computed: {
			maxWidth: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return "60%"
				else
					return "90%"
			},
			storage: function() {
				let mb = this.$store.getters.user.storage / 1000000

				if( mb > 1 )
					this.modal = true
				else
					this.modal = false

				return ""
			}
		}
	}
</script>

<style lang="sass">
	.storage-alert
		.watcher
			display: none
		.storage-alert-container
			padding: 15px
			border-radius: 10px
			background-color: green
</style>