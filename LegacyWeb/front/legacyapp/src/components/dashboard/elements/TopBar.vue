<template lang="pug">
	.top-bar
		.return(v-show="returnable")
			v-icon(color="black", size="30", @click="back")
				|mdi-arrow-left-thick
		//.settings
			v-menu(offset-y, content-class="settings")
				template(v-slot:activator="{ on }")
					img.settings-icon(v-on="on", src="/assets/icons/vertical-dots.png")
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
		.profile-image
			img(:src="profilePicture", @click="$router.push({path: '/dashboard/profile'})")
		.name
			span
				|{{ userName }}
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
				return user.pictureURL || (user.gender == "Female" ? "/assets/icons/avatar_female.svg" : "/assets/icons/avatar_male.svg")
			},
		}
	}
</script>

<style lang="sass">
	.top-bar
		height: 53px
		padding-right: 15px
		padding-top: 8px
		padding-bottom: 8px
		box-shadow: 0px 0px 15px -8px black
		.name
			display: table
			float: right
			font-family: Raleway
			font-weight: 500
			margin-right: 15px
			text-align: center
			height: 100%
			span
				display: table-cell
				vertical-align: middle
		.profile-image
			float: right
			height: 36px
			width: 36px
			img
				border-radius: 50%
				max-height: 100%
				&:hover
					cursor: pointer
		.return
			float: left
			display: inline-block
			padding-left: 10px
			.v-icon
				margin-bottom: -15px
		.settings
			float: right
			height: 100%
			padding: 7px
			.v-list-item
				.v-list-item
					.v-list-item__title
						margin-left: 15px !important
			.settings-icon
				max-width: 100%
				max-height: 100%
				margin-left: 15px
				&:hover
					cursor: pointer
	.v-menu__content.settings
		.v-list-item__title
			margin-left: 7px

	
</style>