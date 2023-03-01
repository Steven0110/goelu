<template lang="pug">
	.users-manager-panel
		.subsection-header
			.subsection-header-icon
				img(src="/assets/icons/ic_contacts_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_contact.svg")
			.subsection-title
				|Users
			.subsection-description
				|See all the users of which you are a legacy contact
		.content

			v-data-table.users-datatable(:headers="usersTableHeaders", :items="users", :loading="loadingUsers", loading-text="Loading users", no-data-text="No users found")
				template(v-slot:item.pictureURL="{ item }")
					.picture-thumbnail
						img(:src="getUserPicture( item.pictureURL, item.gender )")
				//template(v-slot:item._id="{ item }")
					.user-actions(v-if="!item.dead")
						v-btn(
							@click="notifyModal( item )",
							color="#3f64d9",
							raised)
							|Notify death
		v-dialog(persistent, v-model="showModal", max-width="900")
			v-card.death-card
				v-card-title
					.card-title
						|Death notification for {{ notifyingUser.name }}
				v-card-text
					.death-warning
						|¿Are you sure you want to notify this? This is a delicate action and can not be undone. All the files he/she asigned to other users will be sent right now.
				v-card-actions
					v-spacer
					v-btn.white-btn-text(color="#F44336", @click="")
						|No, cancel
					v-btn.white-btn-text(color="#3f64d9", @click="notifyDeath", :loading="status.notifying")
						|Yes, notify his/her death
</template>

<script>
	export default {
		data() {
			return {
				status: {
					loading: false,
					notifying: false
				},
				notifyingUser: {},
				showModal: false,
				usersTableHeaders: [
					{ text: "Picture", value: "pictureURL", align: "start" },
					{ text: "Name", value: "name" },
					{ text: "Email", value: "email" },
					{ text: "Occupation", value: "occupation" },
					//{ text: "Actions", value: "_id", width: "200" },
				]
			}
		},
		computed: {
			users: function(){
				return this.$store.getters.users
			},
			loadingUsers: function(){
				return this.$store.getters.gettingUsers
			},
		},
		methods: {
			notifyModal: function( user ) {
				this.showModal = true
				this.notifyingUser = user
			},
			notifyDeath: function() {

				this.status.notifying = true
				let user = this.notifyingUser
				let url = this.baseApi + this.env + "legacy/notify-death/" + user._id

				this.axios.get( url )
				.then( result => {
					console.log( result.data )
					this.$swal("Done!", "This action has been applied successfully", "success")
					this.showModal = false
		  			user.dead = true
		  			this.$store.commit("updateUser", user)
				})
				.catch( err => {
					console.log( err )
					this.showModal = false

					if( err.response.status == 403 ){
						this.$swal("You are not allowed to perform this action", "It might be that all files have already been sent or this account has no files", "error")
			  			user.dead = true
			  			this.$store.commit("updateUser", user)
					}else if( status == 404 ){
						this.$swal("Done!", "This account has been disabled and all files will be sent to the configured recipients.", "success")
			  			user.dead = true
			  			this.$store.commit("updateUser", user)
					}
					else if( status == 500 ){
						this.$swal("Error", JSON.stringify(err), "error")
					}else{
			  			this.$swal("Done!", ``, "success")
			  			user.dead = true
			  			this.$store.commit("updateUser", user)
					}
				})
				.finally( result => {
					this.status.notifying = false

				})
			},
			getUserPicture: function(url, gender) {
				if( !url )
					if( gender == "Male")
						return "/assets/icons/avatar_male.svg"
					else
						return "/assets/icons/avatar_female.svg"
				else
					return url
			}
		},
		components: {
		}
	}
</script>

<style lang="sass">
	.users-manager-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 15px
			padding-left: 25px
			padding-bottom: 10px
			background-color: #486FD6
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden
			.subsection-header-posticon
				position: absolute
				width: 200px
				top: 10px
				right: 15px
				opacity: 0.3
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				margin-left: 10px
				margin-top: 10px
				color: white
			.subsection-description
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				margin-top: 17px
				margin-left: 40px
				color: white
		.content
			position: relative
			box-shadow: 4px 5px 8px -8px black
			.users-datatable
				.snapshot
					position: relative
					padding: 5px
					padding-left: 0PX
					.snapshot-title
						font-family: Raleway
						font-size: 12pt
						font-weight: 600
						margin-bottom: -6px
					.snapshot-description
						font-size: 10pt
						font-weight: 500
						margin-top: -6px

				.picture-thumbnail
					img
						border-radius: 50%
						margin-top: 5px
						width: 50px
						height: 50px
			.v-btn__content
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn__loader
				color: white
	.card-title
		font-family: Raleway
		font-size: 14pt
		font-weight: 800
		letter-spacing: 1px
		margin-bottom: 15px
		text-transform: uppercase
	.death-card
		padding: 15px
		.death-warning
			font-family: Raleway
			font-size: 14pt
			text-align: center
			margin-top: 15px
			margin-bottom: 15px
	@media only screen and (min-width: 1921px)
		.users-manager-panel
			.content
				.v-btn__content
					font-family: Raleway
					font-size: 15px
					font-weight: 800
					color: white
					padding-left: 25px
					padding-right: 25px
				.v-btn__loader
					color: white
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.users-datatable
				.v-data-table-header
					tr
						th
							span
								font-size: 16pt
				tbody
					tr
						td
							font-size: 15pt
				.v-data-footer
					*
						font-size: 16pt
				.snapshot
					.snapshot-title
						font-size: 16pt !important
					.snapshot-description
						font-size: 14pt !important
</style>