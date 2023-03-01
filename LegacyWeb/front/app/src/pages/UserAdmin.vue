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
	import StorageAlert from "@/components/misc/StorageAlert.vue"

	export default {
		updated(){

			// Last ACtivity
			this.$store.commit("setLastActivitiesStatus", true)
			let lastActivityURL = this.baseApi + this.env + "activity/last"
			this.axios.get( lastActivityURL )
			.then( response => {
				this.$store.commit("setLastActivitiesStatus", false)
				this.$store.commit("setLastActivity", response.data.lastActivities)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
		},
		mounted() {
			this.$store.commit("setUser", JSON.parse(localStorage.getItem("user")) )

			if( localStorage.getItem("locale")){
				this.$store.commit("setLocale", localStorage.getItem("locale"))
				this.$i18n.locale = localStorage.getItem("locale")
			}

				// Gets User Data

			// Stored files
			this.$store.commit("setFilesStatus", true)
			this.$store.commit("setAnalyticsStatus", true)
			let filesURL = this.baseApi + this.env + "files"
			this.axios.get( filesURL )
			.then( response => {
				this.$store.commit("setFilesStatus", false)
				this.$store.commit("setFiles", response.data.files)
			})
			.catch( err => {
				if( err.response )
					if( err.response.status == 403 || err.response.status == 401)
						this.expireSession()
					else
						console.log( err )
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setAnalyticsStatus", false)
			})

			// Contacts
			this.$store.commit("setContactsStatus", true)
			let contactsURL = this.baseApi + this.env + "contacts"
			this.axios.get( contactsURL )
			.then( response => {
				this.$store.commit("setContactsStatus", false)
				this.$store.commit("setContacts", response.data.contacts)
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

			// Topics
			this.$store.commit("setTopicsStatus", true)
			let topicsURL = this.baseApi + this.env + "topics"
			this.axios.get( topicsURL )
			.then( response => {
				this.$store.commit("setTopicsStatus", false)
				this.$store.commit("setTopics", response.data.topics)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setTopicsStatus", false)
			})

			// Contacts Groups
			this.$store.commit("setGroupsStatus", true)
			let groupsURL = this.baseApi + this.env + "groups"
			this.axios.get( groupsURL )
			.then( response => {
				this.$store.commit("setGroupsStatus", false)
				this.$store.commit("setGroups", response.data.groups)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setGroupsStatus", false)
			})

			// Events
			this.$store.commit("setEventsStatus", true)
			let eventsURL = this.baseApi + this.env + "events"
			this.axios.get( eventsURL )
			.then( response => {
				this.$store.commit("setEventsStatus", false)
				this.$store.commit("setEvents", response.data.events)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})

			
			// Last ACtivity
			this.$store.commit("setLastActivitiesStatus", true)
			let lastActivityURL = this.baseApi + this.env + "activity/last"
			this.axios.get( lastActivityURL )
			.then( response => {
				this.$store.commit("setLastActivitiesStatus", false)
				this.$store.commit("setLastActivity", response.data.lastActivities)
			})
			.catch( err => {
				if( err.response.status == 403 || err.response.status == 401)
					this.expireSession()
				else
					console.log( err )
			})

			// User Info
			this.$store.commit("setUserStatus", true)
			let userURL = this.baseApi + this.env + "user/info"
			this.axios.get( userURL )
			.then( response => {
				this.$store.commit("setUser", response.data.user)
				this.$store.commit("setPlan", response.data.user.plan)
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
			StorageAlert,
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