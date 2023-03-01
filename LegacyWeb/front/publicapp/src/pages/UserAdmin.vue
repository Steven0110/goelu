<template lang="pug">
	.user-admin-menu
		g-header
		g-menu(ref="menu")
		.panel
			top-bar(@toggleDrawer="$refs.menu.toggle()")
			.sub-panel
				transition(name="slide-x-transition", mode="out-in")
					keep-alive
						router-view(name="panel")
</template>

<script>
	import Menu 	from "@/components/dashboard/elements/Menu.vue"
	import Header 	from "@/components/dashboard/elements/Header.vue"
	import TopBar 	from "@/components/dashboard/elements/TopBar.vue"

	export default {
		mounted() {
			//this.$store.commit("setUser", JSON.parse(localStorage.getItem("user")) )

			if( localStorage.getItem("locale"))
				this.$i18n.locale = localStorage.getItem("locale")

				// Gets User Data

			// Load asigned files
			
			this.$store.commit("setFilesStatus", true)
			let filesURL = this.baseApi + this.env + "files/relative"
			this.axios.get( filesURL )
			.then( response => {
				this.$store.commit("setFilesStatus", false)
				this.$store.commit("setFiles", response.data.files)
				console.log(response.data.files)
			})
			.catch( err => {
				if( err.response.status == 403 )
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setFilesStatus", false)
			})


			// User Info
			this.$store.commit("setUserStatus", true)
			let userURL = this.baseApi + this.env + "relative-user/info"
			this.axios.get( userURL )
			.then( response => {
				this.$store.commit("setUser", response.data.user)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setUserStatus", false)
			})
		},
		methods: {
			expireSession: function(){
				this.$swal({
					title: "Your session expired",
					text: "You will be redirected to the login section",
					type: "warning",
					timer: 4000,
						showConfirmButton: false,
					onClose: () => {
						this.logout()
					}
				})
			},
			logout: function(){
				localStorage.removeItem("token")
				localStorage.removeItem("user")
				this.$router.push({path: "/"})
			},
		},
		components: {
			"g-menu": Menu,
			"g-header": Header,
			TopBar
		}
	}
</script>

<style lang="sass">
	.user-admin-menu
		.logout
			.v-btn__content
				font-family: Raleway
				color: white
				font-weight: 700
		.panel
			position: fixed
			top: 9vh
			left: 50px
			right: 0
			bottom: 0
			.sub-panel
				height: 100%
				overflow: auto
				&::-webkit-scrollbar-track
					-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
					background-color: rgba(255, 255, 255, 0.2)
				&::-webkit-scrollbar
					width: 10px
					background-color: rgba(255, 255, 255, 0.2)
				&::-webkit-scrollbar-thumb
					background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, rgb(122,153,217)),color-stop(0.72, rgb(73,125,189)),color-stop(0.86, rgb(28,58,148)))
	@media only screen and (max-width: 960px)
		.user-admin-menu
			.logout
				.v-btn__content
			.panel
				left: 0
				top: 0

				.sub-panel
					overflow-x: hidden
</style>