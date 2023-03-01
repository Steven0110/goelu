<template lang="pug">
	.top-bar
		.desktop.d-none.d-md-block
			.return(v-show="returnable")
				v-icon(color="white", size="30", @click="back")
					|mdi-arrow-left-thick
			.settings
				v-menu(offset-y, content-class="settings")
					template(v-slot:activator="{ on }")
						img.settings-icon(v-on="on", src="/assets/icons/vertical-dots.png")
					v-list
						v-list-item(@click="$router.push({path: '/dashboard/profile'}).catch(err => {})")
							v-icon
								|mdi-settings
							v-list-item-title
								|{{ $t("profile") }}
						v-list-item(@click="logout")
							v-icon
								|mdi-exit-to-app
							v-list-item-title
								|{{ $t("logout") }}
			.profile-image
				img(:src="profilePicture", @click="$router.push({path: '/dashboard/profile'})")
			.name
				span
					|{{ userName }}
		.mobile.d-block.d-md-none
			v-toolbar(color="#343434", dark)
				v-app-bar-nav-icon(@click="$emit('toggleDrawer')")
				v-toolbar-title
					|{{ pageName }}
				v-spacer
				.settings
					v-menu(offset-y, content-class="settings")
						template(v-slot:activator="{ on }")
							v-btn.submenu-button(icon)
								v-avatar(v-on="on")
									img(:src="profilePicture")
								v-icon
									|mdi-menu-down
								//v-icon(v-on="on")
									|mdi-dots-vertical
						v-list
							v-list-item(@click="$router.push({path: '/dashboard/profile'})")
								v-icon
									|mdi-settings
								v-list-item-title
									|{{ $t("profile") }}
							v-list-item(@click="logout")
								v-icon
									|mdi-exit-to-app
								v-list-item-title
									|{{ $t("logout") }}
				v-icon.mobile-return(size="30", @click="back", v-show="returnable")
					|mdi-arrow-left-thick
</template>

<script>
	export default {
		methods: {
			back: function(){
				this.$router.go(-1)
			},
			logout: function(){
				this.$swal({
					title: "Are you sure you want to logout?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes",
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then( result => {
					if( result.value ){
						localStorage.removeItem("token")
						localStorage.removeItem("user")
						this.$router.push({path: "/"})
					}
				})
			},
		},
		computed: {
			returnable: function(){
				return this.$route.query.returnable || false
			},
			userName: function() {
				return this.$store.getters.user.name || ""
			},
			profilePicture: function() {
				let user = this.$store.getters.user
				return user.pictureURL || "/assets/icons/avatar.svg"
			},
			pageName: function() {
				return this.$t( this.$route.name )
			}
		}
	}
</script>

<style lang="sass">
	.top-bar
		position: relative
		.desktop
			height: 53px
			padding-right: 15px
			padding-top: 8px
			padding-bottom: 8px
			box-shadow: 0px 0px 15px -8px black
			background-color: #3d3d3d
			.name
				display: table
				float: right
				font-family: Raleway
				font-weight: 500
				margin-right: 15px
				text-align: center
				height: 100%
				color: white
				span
					display: table-cell
					vertical-align: middle

				&:hover
					cursor: pointer
			.profile-image
				float: right
				height: 36px
				width: 36px
				position: relative
				border-radius: 50%
				border: 2px white solid
				overflow: hidden
				
				img
					position: absolute
					top: 0
					bottom: 0
					left: 50%
					right: 0
					margin: auto
					height: 100%
					transform: translateX(-50%) scale(1.3)
					&:hover
						cursor: pointer
			.return
				float: left
				display: inline-block
				padding-left: 10px
				.v-icon
					margin-bottom: -15px
					opacity: 1 !important
			.settings
				float: right
				height: 100%
				padding: 7px
				.v-list-item
					.v-list-item__title
						margin-left: 15px !important
				.settings-icon
					max-width: 100%
					max-height: 100%
					margin-left: 15px
					&:hover
						cursor: pointer
		.mobile
			.mobile-return
				margin-left: 10px
	.v-menu__content.settings
		.v-list-item__title
			margin-left: 7px

	@media only screen and (min-width: 1921px)
		.top-bar
			.desktop
				.name
					span
						font-size: 15pt
					.v-list-item
						.v-list-item__title
							font-size: 19pt
	@media only screen and (max-width: 960px)
		.top-bar
			.mobile
				.settings
					.submenu-button
						position: relative
						.v-icon
							position: absolute
							right: -20px
							top: 50%
							transform: translateY(-50%)
					.v-avatar
						min-width: 0 !important
						width: 35px !important
						height: 35px !important
	@media only screen and (max-width: 600px)
		.top-bar
			.mobile
				.mobile-return
					margin-left: 20px

</style>