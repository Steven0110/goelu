<template lang="pug">
	.profile-editor
		.profile-editor-title
			|Edit account's information
		v-row
			v-col.left-sidebar(md="4", cols="12")
				
				.d-none.computed-trigger
					|{{user.none}}

				v-progress-linear(color="blue", indeterminate, height="10", v-show="status.uploading")
				.profile-picture
					img(:src="profilePicture", v-ripple)
					.mobile-actions.d-block.d-md-none
						v-row
							v-col.pt-0.pr-0(cols="6")
								.action-row
									v-btn.elevation-0(@click="$refs.file.click()", block, color="#3d64d9", dark, tile)
										|Change
										v-icon(color="#fff", right)
											|mdi-sync
							v-col.pt-0.pl-0(cols="6")
								.action-row
									v-btn.elevation-0(@click="deletePicture", block, color="red", dark, tile)
										|Delete
										v-icon(color="#fff", size="40", right)
											|mdi-delete
					.change-hover.d-none.d-md-block()
						.actions
							.action-row
								v-btn.elevation-0(@click="$refs.file.click()", x-large, color="#3d64d9", dark)
									|{{ changePictureText }}
									v-icon(color="#fff", right)
										|mdi-sync
							.action-row
								v-btn.elevation-0(@click="deletePicture", x-large, color="red", dark, v-if="!isPictureDefault()")
									|Delete picture
									v-icon(color="#fff", size="40", right)
										|mdi-delete
					input.d-none(ref="file", type="file", @change="imageLoaded", accept="image/*")
			v-col.right-panel(md="8", cols="12")
				.buttons-section.d-none.d-lg-block
					v-btn.elevation-0.white-btn-text(
						color="#28c5cb",
						raised,
						tile,
						:small="small",
						:x-small="xsmall",
						@click="showReset = true")
						|Change password
					v-btn.elevation-0.white-btn-text(
						color="red",
						raised,
						tile,
						:small="small",
						:x-small="xsmall",
						@click="cancelAccount")
						|Cancel account
				.general-info
					v-form(ref="userInfoForm")
						.subtitle
							|General information
						v-row
							v-col(md="6", cols="12")
								v-text-field(
									append-icon="mdi-account",
									label="Name",
									background-color="white",
									:rules="form.validations.required",
									outlined,
									name="Name",
									v-model="profile.name"
									required)
								v-text-field(
									append-icon="mdi-phone",
									label="Phone",
									background-color="white",
									outlined,
									name="Phone",
									v-model="profile.phone",
									required)
								v-select(:items="['Male', 'Female', 'Rather not to say']", outlined, label="Gender", v-model="profile.gender")
							v-col(md="6", cols="12")
								v-text-field(
									append-icon="mdi-briefcase",
									label="Occupation",
									name="Occupation",
									background-color="white",
									outlined,
									v-model="profile.occupation"
									required)
								.birthday
									.clickable(@click="showCalendar = true")
										v-text-field(
											append-icon="mdi-calendar",
											label="Birthday",
											name="birthday",
											background-color="white",
											outlined,
											v-model="profile.birthday",
											required)
									.calendar-display
										v-icon.closer(color="white", size="30", v-if="showCalendar", @click="showCalendar = false")
											|mdi-close
										v-date-picker(v-model="profile.birthday", v-if="showCalendar", @change="showCalendar = false", key="demo")
						.subtitle
							|Address
						v-row
							v-col(md="6", cols="12")
								v-text-field(
									append-icon="mdi-earth",
									label="Country",
									name="Country",
									background-color="white",
									outlined,
									v-model="profile.address.country"
									required)
								v-text-field(
									append-icon="mdi-city",
									label="City",
									name="City",
									background-color="white",
									outlined,
									v-model="profile.address.city"
									required)
								v-text-field(
									append-icon="mdi-map-marker",
									label="Address Line 1",
									name="Address Line 1",
									background-color="white",
									outlined,
									v-model="profile.address.street1"
									required)
							v-col(md="6", cols="12")
								v-text-field(
									append-icon="mdi-home-city",
									label="State",
									name="State",
									background-color="white",
									outlined,
									v-model="profile.address.state"
									required)
								v-text-field(
									append-icon="mdi-numeric",
									label="Zip Code",
									name="Zip Code",
									background-color="white",
									outlined,
									v-model="profile.address.zip"
									required)
								v-text-field(
									append-icon="mdi-map-marker",
									label="Address Line 2",
									name="Address Line 2",
									background-color="white",
									outlined,
									v-model="profile.address.street2"
									required)

						v-row
							v-col(md="4", cols="12", offset-md="4")
								v-btn.elevation-0.white-btn-text(color="#3d64d9", :loading="status.updating", block, @click="updateInfo", 
							:small="small",
							:x-small="xsmall")
									|Update information
							v-col.d-block.d-md-none(cols="12")
								v-btn.elevation-0.white-btn-text(
									color="#28c5cb",
									raised,
									tile,
									:small="small",
									:x-small="xsmall",
									block,
									@click="showReset = true")
									|Change password
							v-col.d-block.d-md-none(cols="12")
								v-btn.elevation-0.white-btn-text(
									color="red",
									raised,
									tile,
									block,
									:small="small",
									:x-small="xsmall",
									@click="cancelAccount")
									|Cancel account
		v-dialog.password-reset-dialog(v-model="showReset", max-width="700", persistent)
			v-card.password-reset-card
				v-card-title
					.card-title
						|Password change
				v-card-text
					v-form(ref="passwordChange")
						v-text-field(
							append-icon="mdi-lock",
							v-model="passwordReset.current",
							label="Current password",
							background-color="transparent",
							:rules="form.validations.required",
							type="password"
							outlined,
							dense,
							required)
						v-text-field(
							append-icon="mdi-lock",
							v-model="passwordReset.new",
							label="New password",
							background-color="transparent",
							:rules="form.validations.password",
							outlined,
							type="password"
							@change="validateResetPassword()",
							dense,
							required)
						v-text-field(
							append-icon="mdi-lock",
							v-model="passwordReset.rnew",
							label="Repeat new password",
							background-color="transparent",
							:rules="form.validations.password",
							type="password"
							outlined,
							@input="validateResetPassword()",
							dense,
							required)
				v-card-actions
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="showReset = false")
						|Cancel
					v-btn.elevation-0.white-btn-text(color="#3d64d9", :loading="status.resetting", @click="resetPassword")
						|Change password
</template>

<script>

	export default {
		data() {
			return {
				status: {
					uploading: false,
					updating: false,
				},
				passwordReset: {
					current: "",
					rnew: "",
					new: "",
				},
				profile: {
					name: "",
					occupation: "",
					address: {
						country: "",
						city: "",
						state: "",
						zip: "",
						street1: "",
						street2: "",
					},
					gender: "",
					occupation: "",
					phone: "",
					birthday: "",
				},
				showReset: false,
				showCalendar: false,
				form: {
					validations: {
				      	password: [
				        	v => !!v || 'Password is required',
				        	v => this.passwordReset.new === this.passwordReset.rnew || 'Passwords don\'t match',
				      	],
				      	required: [
				        	v => !!v || 'This field is required'
				      	],
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
				      	],
					}
				}
			}
		},
		computed: {
			user: function() {
				let user = this.$clone( this.$store.getters.user )
				user.address = user.address || {}
				user.address = {
					city: 		user.address.city || "",
					country: 	user.address.country || "",
					state: 		user.address.state || "",
					zip: 		user.address.zip || "",
					street1: 	user.address.street1 || "",
					street2: 	user.address.street2 || "",
				}
				user.gender = user.gender || ""
				user.occupation = user.occupation || ""
				user.phone = user.phone || ""
				user.birthday = user.birthday || ""

				this.profile = user

				return user
			},
			changePictureText: function() {
				if( this.profilePicture ){
					if( this.profilePicture.match(/avatar/g))
						return "Upload picture"
					else
						return "Change picture"
				}else{
					return "Upload picture"
				}
			},
			profilePicture: function() {
				let user = this.$store.getters.user
				return user.pictureURL || "/assets/icons/avatar_generico_add.svg"
			},
			small: function(){
				if(this.$vuetify.breakpoint.width > 1920)
					return false
				if(this.$vuetify.breakpoint.width > 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return false
				else if(this.$vuetify.breakpoint.width <= 640)
					return true
			},
			xsmall: function(){
				if(this.$vuetify.breakpoint.width > 1366)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return true
				else if(this.$vuetify.breakpoint.width <= 640)
					return false
			},
		},
		methods: {
			isPictureDefault: function() {
				if( this.profilePicture){
					if( this.profilePicture.match(/avatar/g))
						return true
					else
						return false
				}else
					return true
			},
			imageLoaded: async function(){
				let file = this.$refs.file.files[0]
				const filetypes = ["jpg","png","jpeg","gif"]

				if( file ){

					let filetype = this.getFileType( file )
					if( filetypes.includes( filetype ) ){

						if( file.size < 3000000 ){
							this.status.uploading = true
							let base64 = await this.toBase64( file )
							let body = {
								asset: {
									base64: base64,
									filetype: filetype
								}
							}
							let url = this.baseApi + this.env + "user/asset"
							let assetUrl

							this.axios.post(url, body)
							.then( response => {

								assetUrl = response.data.asset.url
								let user = this.$clone( this.$store.getters.user )
								user.pictureURL = assetUrl

								url = this.baseApi + this.env + "user"								
								return this.axios.put(url, user)
								
							})
							.then( response => {
								this.$store.commit("updateUserPicture", assetUrl)
							})
							.catch( err => {
								console.log( err )
							})
							.finally( () => {
								this.status.uploading = false
							})
						}else{
							this.$swal("File too big", "The maximum upload size is 3 MB", "warning")
							this.$refs.file.value = ""
						}
					}
				}
			},
			resetPassword: function() {
				if( this.validateResetPassword() ){
					this.status.resetting = true
					let body = {
						new: this.passwordReset.new,
						old: this.passwordReset.current
					}
					let url = this.baseApi + this.env + "user/password-change"
					this.axios.post(url, body)
					.then( response => {
						this.passwordReset.new = ""
						this.passwordReset.rnew = ""
						this.passwordReset.current = ""
						this.showReset = false
						this.$swal("Done!", "Your password has been changed successfully", "success")
					})
					.catch( err => {
						if( err.response.status == 403 )
							this.$swal("Invalid password", "The current password given is incorrect", "warning")
						else
							console.log( err )
					})
					.finally( () => {
						this.status.resetting = false
					})
				}
			},
			validateResetPassword: function () {
				return this.$refs.passwordChange.validate()
			},
			deletePicture: function() {

				this.$swal({
					title: "Are you sure you want to delete your profile picture?",
					text: "",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes, delete it.",
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then(result => {
				  	if( result.value ) {

						this.status.uploading = true

						let url = this.baseApi + this.env + "user"

						this.axios.put(url, {pictureURL: ""})
						.then( response => {
							this.$store.commit("updateUserPicture", "")
						})
						.catch( err => {
							console.log( err )
						})
						.finally( () => {
							this.status.uploading = false
						})

				  	}
				})

			},
			updateInfo: function() {
				
				if( this.$refs.userInfoForm.validate() ){
					this.status.updating = true

					let url = this.baseApi + this.env + "user"

					this.axios.put(url, this.profile)
					.then(response => {
						this.$store.commit("updateUser", this.profile)
						return this.$swal("Done!", "Information updated successfully", "success")
					})
					.then(response => {
						this.$router.push({path: '/dashboard/profile'})
					})
					.catch( err => {
						console.log( err )
					})
					.finally( () => {
						this.status.updating = false
					})
				}
			},
			toBase64: function( file ) {
				let reader = new FileReader()
				return new Promise((resolve, reject) => {
	                reader.onloadend = e => e.target.result ? resolve( e.target.result.split(",")[1] ) : e.target.error
	                reader.readAsDataURL( file )
				})
			},
			getFileType: function( file ){
				let aux = file.name.split(".")
				return aux[ aux.length - 1]
			},
			cancelAccount: function() {
				this.$swal({
					title: "Are you sure?",
					text: "All your information will be deleted and this action can't be undone",
					showCancelButton: true,
					reverseButtons: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes, I want to cancel my account.",
					cancelButtonText: "Cancel",
					showLoaderOnConfirm: true,
					allowOutsideClick: () => this.$swal.isLoading(),
					preConfirm: () => {

						let url = this.baseApi + this.env + "account/delete"
						let assetUrl

						return this.axios.get( url )
						.then(result => {
							return this.$swal("Done!", "Your account has been deleted successfully", "success")

						})
						.then(result => {
							localStorage.removeItem("token")
							localStorage.removeItem("user")
							this.$router.push({path: "/"})
						})
						.catch(err => {
							console.error( err )
							this.$swal("Your account could not be deleted", "Please try again.", "warning")
						})
						.finally(() => {
						})
					}
				})
			}
		},
		mounted() {
		}
	}
</script>

<style lang="sass">
	.profile-editor
		min-height: 100%
		padding: 25px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.profile-editor-title
			font-family: Raleway
			font-size: 20px
			font-weight: 800
			text-align: center
			text-transform: uppercase
			letter-spacing: 1px

		.left-sidebar
			position: relative
			.v-progress-linear
				position: absolute
				top: 5px
				left: 12px
				width: calc(100% - 24px)
			.profile-picture
				position: relative
				overflow: hidden
				min-height: 250px
				img
					max-width: 100%
					vertical-align: middle
				.change-hover
					position: absolute
					//background-color: #5273d6
					background-color: rgba(0, 0, 0, 0.5)
					top: 100%
					left: 0
					width: 100%
					height: 100%
					transition: 0.2s linear all

					.actions
						position: absolute
						text-align: center
						top: 50%
						left: 0
						right: 0
						transform: translateY(-50%)
						.action-row
							margin-bottom: 20px
							.v-btn
								margin-left: 10px
								.v-btn__content
									font-family: Raleway
									font-weight: 600
				.mobile-actions
					margin-top: -7px

				&:hover
					cursor: pointer
					.change-hover
						top: 0
						transition: 0.2s linear all
			.plan-info
				.subtitle
					font-size: 8pt
					color: #555
					font-family: Raleway
					font-weight: 600
					text-transform: uppercase
					letter-spacing: 1px
				.plan-name
					font-size: 12pt
					font-family: Raleway
					color: black
					font-weight: 800
					text-transform: uppercase
					margin-bottom: 5px
					letter-spacing: 1px
				.plan-specs
					font-size: 8pt
					color: #888
					font-family: Raleway
					font-weight: 600
					.account-storage-limit
						font-weight: 800
		.right-panel
			position: relative
			padding-top: 50px
			.buttons-section
				position: absolute
				top: 10px
				right: 0
				.v-btn
					margin-left: 10px
					.v-btn__content
						padding-left: 50px
						padding-right: 50px
			.general-info
				position: relative
				.edit-account-button
					position: absolute
					right: 0
					top: 0
					.v-btn
						margin-left: 10px
						.v-btn__content
							padding-left: 50px
							padding-right: 50px
				.birthday
					position: relative
					z-index: 99
					.clickable
						&:hover
						input,.v-text-field__slot
							&:hover
								cursor: pointer !important
					.closer
						position: absolute
						left: 280px
						top: 30px
						z-index: 100
					.v-picker
						position: absolute
						left: 25px
						top: 25px
			.subtitle
				font-size: 8pt
				color: #555
				font-family: Raleway
				font-weight: 700
				text-transform: uppercase
				letter-spacing: 1px
			.profile-main
				display: table
				.profile-name
					display: table-cell
					vertical-align: middle
					text-transform: uppercase
					color: black
					font-size: 12pt
					font-family: Raleway
					font-weight: 800
					margin-bottom: 5px
					letter-spacing: 1px
					display: inline-block
					margin-right: 10px
				.profile-location-icon
					display: table-cell
					vertical-align: middle
					margin-top: -5px
					padding-bottom: 4px
				.profile-location
					display: table-cell
					vertical-align: middle
					margin-top: -3px
					font-weight: 700
					font-family: Raleway
					font-size: 10pt
					color: rgba(0, 0, 0, 0.4)
					padding-bottom: 4px
			.profile-occupation
				font-size: 8pt
				color: #75a7d2
				font-family: Raleway
				font-weight: 700
				text-transform: uppercase
				letter-spacing: 1px
				margin-top: -10px
				margin-bottom: 30px
			.contact-info
				.prop-name
					font-size: 12pt
					font-family: Raleway
					font-weight: 700
					letter-spacing: 1px
				.prop-value
					font-size: 12pt
					font-family: Raleway
					font-weight: 700
					letter-spacing: 1px
					&.c-black
						color: black
					&.c-blue
						color: #75a7d2
			.additional-info
				.text
					font-family: Raleway
					font-weight: 500
	@media only screen and (min-width: 1367px)
		.profile-editor
			.right-panel
				.subtitle
					font-size: 10pt
				.profile-main
					.profile-name
						font-size: 15pt
	@media only screen and (min-width: 1921px)
		.profile-editor
			.left-sidebar
			.right-panel
			.profile-editor-title
				font-size: 24px
				.profile-main
					.profile-name
						font-size: 19pt
				input
					font-size: 16pt
				label
					font-size: 16pt
				.v-select__selection
					font-size: 16pt
		.v-select-list
			.v-list-item__title
				font-size: 16pt !important
		.v-btn
			.v-btn__content
				font-size: 13pt
</style>