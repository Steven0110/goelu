<template lang="pug">
	.menu

		.desktop.d-none.d-md-block.pt-0
			.option(:class="{active: $route.name == 'm-home'}")
				router-link(:to="{path: '/dashboard'}")
					img(src="/assets/icons/ic_home.svg")
			//.option(:class="{active: $route.name == 'm-samples'}")
				router-link(:to="{path: '/dashboard/samples'}")
					img(src="/assets/icons/ic_sample02-01.svg")
			.option(:class="{active: $route.name == 'm-filemanager'}")
				router-link(:to="{path: '/dashboard/file-manager'}")
					img(src="/assets/icons/ic_file_manager.svg")
			.option(:class="{active: $route.name == 'm-record'}")
				router-link(:to="{path: '/dashboard/record'}")
					img(src="/assets/icons/ic_record.svg")
			.option(:class="{active: $route.name == 'm-upload'}")
				router-link(:to="{path: '/dashboard/upload'}")
					img(src="/assets/icons/ic_upload.svg")
			.option(:class="{active: $route.name == 'm-contacts'}")
				router-link(:to="{path: '/dashboard/contacts'}")
					img(src="/assets/icons/ic_contact.svg")
			.option(:class="{active: $route.name == 'm-topics'}")
				router-link(:to="{path: '/dashboard/topics'}")
					img(src="/assets/icons/ic_categories.svg")
			.option(:class="{active: $route.name == 'm-calendar'}")
				router-link(:to="{path: '/dashboard/calendar'}")
					img(src="/assets/icons/ic_calendar.svg")
			.option(:class="{active: $route.name == 'm-plan'}")
				router-link(:to="{path: '/dashboard/plan'}")
					img(src="/assets/icons/ic_plan-01.svg")
			.option(@click="logout")
				router-link(:to="{path: '#'}")
					img(src="/assets/icons/ic_signout.svg")


		.mobile.d-block.d-md-none
			v-navigation-drawer(absolute, temporary, v-model="drawer", color="#2B2E3B", dark)
				.mobile-menu-logo
					img(src="/assets/images/logo.svg")
					.mobile-menu-closer
						v-icon.mobile-menu-closer-icon(color="white", @click="drawer = false")
							|mdi-close
				//Main Menu
				p.mobile-menu-title
					|{{ $t('main-menu') }}
				v-list(dense)
					//v-list-item(link, @click="$router.push({path: '/dashboard'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.chome
						v-list-item-content
							v-list-item-title
								|{{ $t("my-videos") }}					
					v-list-item(link, @click="$router.push({path: '/dashboard/tutorials'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.chome
						v-list-item-content
							v-list-item-title
								|{{ $t("tutorials") }}
					v-list-item(link, @click="$router.push({path: '/dashboard/plan'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.chome
						v-list-item-content
							v-list-item-title
								|{{ $t("plan") }}
					v-list-item(link, @click="$router.push({path: '/dashboard/FAQ'})")
						v-list-item-icon
							v-icon
								|mdi-help-circle
						v-list-item-content
							v-list-item-title
								|{{ $t("m-faq") }}
					//v-list-item(link, @click="$router.push({path: '/dashboard'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.chome
						v-list-item-content
							v-list-item-title
								|{{ $t("how-it-works") }}

				//Admin Panel
				p.mobile-menu-title
					|{{ $t('administration-panel') }}
				v-list(dense)
					v-list-item(link, @click="$router.push({path: '/dashboard'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.chome
						v-list-item-content
							v-list-item-title
								|{{ $t('m-home') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/samples'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.csamples
						v-list-item-content
							v-list-item-title
								|{{ $t('m-samples') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/file-manager'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.cfiles
						v-list-item-content
							v-list-item-title
								|{{ $t('m-filemanager') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/record'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.crecord
						v-list-item-content
							v-list-item-title
								|{{ $t('m-record') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/upload'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.cupload
						v-list-item-content
							v-list-item-title
								|{{ $t('m-upload') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/contacts'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.ccontacts
						v-list-item-content
							v-list-item-title
								|{{ $t('m-contacts') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/topics'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.ccategories
						v-list-item-content
							v-list-item-title
								|{{ $t('m-topics' )}}
					v-list-item(link, @click="$router.push({path: '/dashboard/calendar'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.ccalendar
						v-list-item-content
							v-list-item-title
								|{{ $t('m-calendar') }}
					v-list-item(link, @click="$router.push({path: '/dashboard/plan'})")
						v-list-item-icon
							v-icon
								|$vuetify.icons.cplan
						v-list-item-content
							v-list-item-title
								|{{ $t('m-plan') }}
					v-list-item(link, @click="logout")
						v-list-item-icon
							v-icon
								|$vuetify.icons.clogout
						v-list-item-content
							v-list-item-title
								|Log Out
				.language-chooser
					.spanish
						img(src="/assets/images/spanish.png", @click="setLocale('es')", :class="{active: locale == 'es'}")
					.english
						img(src="/assets/images/english.png", @click="setLocale('en')", :class="{active: locale == 'en'}")
				//template(v-slot:append)
					.pa-2.logout-button
						v-btn(block, color="white", dark, @click="logout")
							|{{ $t('m-logout') }}
</template>

<script>
	export default {
		data() {
			return {
				drawer: false
			}
		},
		methods: {
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
			setLocale: function(locale){
				localStorage.setItem("locale", locale)
				this.$i18n.locale = locale
			},
			toggle: function() {
				this.drawer = true
			}
		},
		computed: {
			userName: function() {
				return this.$store.getters.user.name || ""
			},
			profilePicture: function() {
				let user = this.$store.getters.user
				return user.pictureURL || (user.gender == "Female" ? "/assets/icons/avatar_female.svg" : "/assets/icons/avatar_male.svg")
			},
			locale: function(){
				return this.$i18n.locale
			}
		}
	}
</script>

<style lang="sass">
	.menu
		.desktop
			position: fixed
			top: 9vh
			left: 0
			bottom: 0
			background-color: #3d3d3d
			//padding-top: 15px
			//padding-bottom: 15px
			width: 53px
			.option
				position: relative
				//width: 53px
				//height: 53px
				background-color: transparent
				transition: 0.2s linear all
				padding: 13px
				
				&:hover
					background-color: #3aa9e0
					transition: 0.2s linear all

				&.active
					background-color: #3aa9e0
					transition: 0.2s linear all
				a
					display: block
					img
						//position: absolute
						//top: 0
						//left: 0
						//right: 0
						//bottom: 0
						//margin: auto
						width: 100%
						vertical-align: middle
		.mobile
			.mobile-menu-logo
				text-align: center
				position: relative
				padding-top: 10px
				.mobile-menu-closer
					display: inline-block
					position: absolute
					right: 10px
					top: 10px
					.mobile-menu-closer-icon

				img
					height: 30px
					display: inline-block
			.mobile-menu-title
				color: white
				font-size: 12pt
				font-family: Raleway
				letter-spacing: 1px
				padding-left: 16px
				margin-bottom: 0px
				margin-top: 20px
				text-transform: uppercase
			.v-navigation-drawer
				.v-navigation-drawer__content
					-webkit-overflow-scrolling: auto !important

					&::-webkit-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar-thumb
						-webkit-overflow-scrolling: auto !important
						background-color: #32343d
					&::-moz-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-moz-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-moz-scrollbar-thumb
						background-color: #32343d
					&::-o-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-o-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-o-scrollbar-thumb
						background-color: #32343d
					
				.v-list-item__content

					.v-list-item__title
						font-family: Raleway
						text-transform: uppercase
				.language-chooser
					margin-top: 15px
					padding: 10px
					.spanish
						display: inline-block
						width: 40px
						float: left
						img
							width: 40px
							border-radius: 50%
							&:hover
								cursor: pointer
					.english
						display: inline-block
						width: 40px
						float: left
						margin-left: 10px
						img
							width: 40px
							border-radius: 50%
							&:hover
								cursor: pointer
					.active
						box-shadow: 0px 0px 7px 4px white
				.logout-button
					.v-btn__content
						font-family: Raleway
						color: black
						text-transform: uppercase
						letter-spacing: 1px
						font-weight: 700
	@media only screen and (min-width: 1921px)
		.menu
			.desktop
				.option
					//width: 75px
					//height: 75px
	@media only screen and (max-width: 600px)
		.menu
			.mobile
				.language-chooser
					margin-bottom: 100px
</style>