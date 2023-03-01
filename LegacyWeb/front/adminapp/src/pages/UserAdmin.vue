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
				//Storage Alert
				//storage-alert
</template>

<script>
	import Menu 		from "@/components/dashboard/elements/Menu.vue"
	import Header 		from "@/components/dashboard/elements/Header.vue"
	import TopBar 		from "@/components/dashboard/elements/TopBar.vue"	

	export default {
		updated(){
		},
		mounted() {
			this.$store.commit("setUser", JSON.parse(localStorage.getItem("user")) )			
            
			// Contacts
			this.$store.commit("setContactsStatus", true)
			let contactsURL = this.baseApi + this.env + "admin/coupon"
			this.axios.get( contactsURL )
			.then( response => {
				this.$store.commit("setContactsStatus", false)
				this.$store.commit("setContacts", response.data.coupon)
                console.log(response.data.coupon)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setAnalyticsStatus", false)
			})
		},
		methods: {
			expireSession: function(){
				if( this.$store.getters.sessionValidity == true){
					this.$store.commit("setSessionValidity", false)

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
				}
			},
			logout: function(){
				localStorage.removeItem("token")
				localStorage.removeItem("user")
				this.$router.push({path: "/"})
			},
			test() {
			}
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
			left: 53px
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
					background-color: #32343d
	@media only screen and (min-width: 1921px)
		.user-admin-menu
			.logout
				.v-btn__content
			.panel
				left: 53px
	@media only screen and (max-width: 1920px)
	@media only screen and (max-width: 1366px)
	@media only screen and (max-width: 1024px)
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