<template lang="pug">
	.user-admin-menu
		g-header
		g-menu
		.panel
			//top-bar
			.sub-panel
				transition(name="slide-x-transition", mode="out-in")
					router-view(name="panel")
</template>

<script>
	import Menu 	from "@/components/dashboard/elements/Menu.vue"
	import Header 	from "@/components/dashboard/elements/Header.vue"
	import TopBar 	from "@/components/dashboard/elements/TopBar.vue"

	export default {
		data() {
			return {

			}
		},
		mounted() {
			//this.$store.commit("setUser", JSON.parse(localStorage.getItem("user")) )

			if( localStorage.getItem("locale"))
				this.$i18n.locale = localStorage.getItem("locale")

				// Gets User Data

			// User Info
			this.$store.commit("setUserStatus", true)
			let userURL = this.baseApi + this.env + "legacy/info"
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
			
			// Users Info
			this.$store.commit("setUsersStatus", true)
			let usersURL = this.baseApi + this.env + "legacy/users"
			this.axios.get( usersURL )
			.then( response => {
				console.log(response.data.users )
				this.$store.commit("setUsers", response.data.users)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setUsersStatus", false)
			})
			
			// Files
			this.$store.commit("setFilesStatus", true)
			let filesURL = this.baseApi + this.env + "legacy/files"
			this.axios.get( filesURL )
			.then( response => {
				console.log(response.data )
				this.$store.commit("setFiles", response.data.files)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setFilesStatus", false)
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
</style>