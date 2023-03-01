<template lang="pug">
	.profile
		v-row
			v-col.left-sidebar.order-md-1.order-2(md="4", cols="12")
				v-progress-linear(color="blue", indeterminate, height="10", v-show="status.uploading")
				.profile-picture.desktop-fix.d-none.d-md-block(:style="profileStyle")
					input.d-none(ref="file", type="file", @change="imageLoaded", accept="image/*")

			v-col.right-panel.order-md-2.order-1(md="8", cols="12")
				.general-info
					.edit-account-button.d-none.d-lg-block
						v-btn.white-btn-text(
							color="#3d64d9",
							raised,
							tile,
							:small="small",
							:x-small="xsmall",
							:block="$vuetify.breakpoint.mdAndDown",
							@click="$router.push({path: '/dashboard/profile/edit', query: {returnable: 'true'}})")
							|Edit account
					.subtitle
						|My profile
					.profile-main
						.profile-name
							|{{ user.name }}
						.profile-location-icon(v-if="user.address && user.address.state")
							v-icon
								|mdi-map-marker
						.profile-location(v-if="user.address && user.address.state")
							|{{ user.address.state }}
					.profile-occupation
						|{{ user.occupation || '' }}

					.profile-picture.d-block.d-md-none
						img(:src="profilePicture")

					.contact-info
						v-row
							v-col(md="6", cols="12")
								.subtitle
									|Contact information
								v-row
									v-col(cols="12", md="12", lg="3", xl="2", :class="{'pb-0 pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-name
											|Phone:
									v-col(cols="12", md="12", lg="9", xl="10", :class="{'pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-value.c-blue
											|{{ user.phone || 'Not defined' }}
								v-row
									v-col(cols="12", md="12", lg="3", xl="2", :class="{'pb-0 pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-name
											|Address:
									v-col(cols="12", md="12", lg="9", xl="10", :class="{'pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-value.c-black(v-if="user.address")
											|{{ user.address | address }}
										.prop-value.c-black(v-else)
											|Not defined
								v-row
									v-col(cols="12", md="12", lg="3", xl="2", :class="{'pb-0 pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-name
											|Email:
									v-col(cols="12", md="12", lg="9", xl="10", :class="{'pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-value.c-blue
											|{{ user.email }}
							v-col(md="6", cols="12")
								.subtitle
									|Basic information
								v-row
									v-col(cols="12", md="12", lg="3", xl="2", :class="{'pb-0 pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-name
											|Birthday:
									v-col(cols="12", md="12", lg="9", xl="10", :class="{'pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-value.c-blue(v-if="user.birthday")
											|{{ birthday }}
										.prop-value.c-blue(v-else)
											|Not defined
								v-row
									v-col(cols="12", md="12", lg="3", xl="2", :class="{'pb-0 pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-name
											|Gender:
									v-col(ccols="12", md="12", lg="9", xl="10", :class="{'pt-0': $vuetify.breakpoint.mdAndDown}")
										.prop-value.c-black
											|{{ user.gender || 'Not defined' }}

						v-row.d-block.d-lg-none
							v-col(cols="12")
								v-btn.white-btn-text(
									color="#3d64d9",
									raised,
									tile,
									:small="small",
									:x-small="xsmall",
									block,
									@click="$router.push({path: '/dashboard/profile/edit', query: {returnable: 'true'}})")
									|Edit account

</template>

<script>
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				status: {
					uploading: false,
					resetting: false,
				},
				passwordReset: {
					current: "",
					rnew: "",
					new: "",
				},
				showReset: false,
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
		methods: {
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
			validateResetPassword: function () {
				return this.$refs.passwordChange.validate()
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
		},
		computed: {
			user: function() {
				return this.$store.getters.user
			},
			profilePicture: function() {
				let user = this.$store.getters.user
				return user.pictureURL || "/assets/icons/avatar-generic_bg.svg"
			},
			birthday: function() {
				let birthday = this.user.birthday
				if( birthday )
					return this.$moment(birthday).format("MMMM Do, YYYY")
				else
					return ""
			},
			profileStyle: function() {
				let user = this.$store.getters.user
				let picture = user.pictureURL || "/assets/icons/avatar-generic_bg.svg"

				return {
					"background-image": `url('${picture}')`
				}
			},
			small: function(){
				if(this.$vuetify.breakpoint.width > 1920)
					return false
				if(this.$vuetify.breakpoint.width > 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return false
				else if(this.$vuetify.breakpoint.width <= 1024)
					return false
			},
			xsmall: function(){
				if(this.$vuetify.breakpoint.width > 1366)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return true
				else if(this.$vuetify.breakpoint.width <= 1024)
					return true
			},
		},
		filters: {
			address: function(value) {
				if( value.country || value.state || value.city || value.street1 || value.zip )
					return `${value.country}, ${value.state}, ${value.city}, ${value.street1} ${value.zip}`
				else
					return "Not defined"
			},
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">

	.profile
		min-height: 100%
		padding: 25px
		padding-bottom: 80px
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
				&.desktop-fix
					height: 500px
					background-size: cover
					background-position: center
					background-repeat: no-repeat
					margin-bottom: 20px
				img
					max-width: 100%
					max-height: 300px

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
			.legacy-contacts
				margin-top: 15px
				.subtitle
					font-size: 8pt
					color: #555
					font-family: Raleway
					font-weight: 600
					text-transform: uppercase
					letter-spacing: 1px
				.m-title
					font-size: 12pt
					font-family: Raleway
					color: black
					font-weight: 800
					text-transform: uppercase
					margin-bottom: 5px
					letter-spacing: 1px
				.text
					font-size: 8pt
					color: #888
					font-family: Raleway
					font-weight: 600
				.v-card
					.v-card__progress
						.v-progress-linear
							left: 0
							width: 100%
				.legacy--contacts
					.legacy-contact
						clear: both
						position: relative
						height: 40px
						.actions-layer
							position: absolute
							left: 0
							right: 0
							top: 0
							bottom: 0
							background-color: transparent
							transition: 0.2s linear all
							.v-icon
								margin-right: 10px
								margin-top: 10px
						&:hover
							.actions-layer
								opacity: 1
								background-color: rgba(0, 0, 0, 0.05)
								transition: 0.2s linear all

						.legacy-contact-picture
							position: relative
							display: inline-block
							float: left
							margin-left: 5px
							margin-right: 15px
							overflow: hidden
							border-radius: 50%
							width: 25px
							height: 25px
							margin-top: 8px
							img
								transform: scale(1.5)

						.legacy-contact-name
							display: inline-block
							float: left
							margin-top: 11px
							margin-left: 11px
							font-family: Raleway
							font-weight: 700
		.right-panel
			.profile-picture
				position: relative
				overflow: hidden
				img
					max-width: 100%
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
					word-break: break-word
					&.c-black
						color: black
					&.c-blue
						color: #75a7d2
			.additional-info
				.text
					font-family: Raleway
					font-weight: 500
	.new-legacy-contact
		.new-picture-container
			padding: 25px
			position: relative
			border: 2px dashed #ddd
			transition: 0.2s linear all
			margin-bottom: 25px
			&:hover
				cursor: pointer
				background-color: #efefef
				transition: 0.2s linear all
			.picture-uploader
				text-align: center
				.first
					font-family: Raleway
					font-size: 11pt
					color: #5273d6
					text-transform: uppercase
					margin-bottom: 5px
					font-weight: 500
				img
					max-width: 50%
				.last
					font-family: Raleway
					font-size: 12pt
					color: #bbb
					font-weight: 700
			.picture-preview
				.picture-preview-container
					text-align: center
					margin-left: 15%
					margin-right: 15%
					position: relative
					overflow: hidden
					img
						max-width: 100%
						display: inline-block
					.delete-layer
						position: absolute
						background-color: #5273d6
						top: 100%
						left: 0
						width: 100%
						height: 100%
						transition: 0.2s linear all
						.text
							position: relative
							width: 100%
							height: 100%
							margin-top: 20px
							span
								position: absolute
								top: 0
								bottom: 0
								left: 0
								right: 0
								margin: auto
								height: 120px
								color: white
								font-family: Raleway
								font-size: 18pt
								font-weight: 700
								.v-icon
									opacity: 1
									&:before
										font-weight: 800
					&:hover
						cursor: pointer
						.delete-layer
							top: 0
							transition: 0.2s linear all
			.v-icon
				position: absolute
				left: 0
				right: 0
				bottom: 0
				top: 0
				margin: auto
	.edit-legacy-contact
		.edit-picture-container
			padding: 25px
			position: relative
			border: 2px dashed #ddd
			transition: 0.2s linear all
			margin-bottom: 25px
			&:hover
				cursor: pointer
				background-color: #efefef
				transition: 0.2s linear all
			.picture-uploader
				text-align: center
				.first
					font-family: Raleway
					font-size: 11pt
					color: #5273d6
					text-transform: uppercase
					margin-bottom: 5px
					font-weight: 500
				img
					max-width: 50%
				.last
					font-family: Raleway
					font-size: 12pt
					color: #bbb
					font-weight: 700
			.picture-preview
				.picture-preview-container
					text-align: center
					margin-left: 15%
					margin-right: 15%
					position: relative
					overflow: hidden
					img
						max-width: 100%
						display: inline-block
					.delete-layer
						position: absolute
						background-color: #5273d6
						top: 100%
						left: 0
						width: 100%
						height: 100%
						transition: 0.2s linear all
						.text
							position: relative
							width: 100%
							height: 100%
							margin-top: 20px
							span
								position: absolute
								top: 0
								bottom: 0
								left: 0
								right: 0
								margin: auto
								height: 120px
								color: white
								font-family: Raleway
								font-size: 18pt
								font-weight: 700
								.v-icon
									opacity: 1
									&:before
										font-weight: 800
					&:hover
						cursor: pointer
						.delete-layer
							top: 0
							transition: 0.2s linear all
			.v-icon
				position: absolute
				left: 0
				right: 0
				bottom: 0
				top: 0
				margin: auto
	.card-title
		font-family: Raleway
		font-size: 14pt
		font-weight: 800
		letter-spacing: 1px
		margin-bottom: 15px
		text-transform: uppercase

	@media only screen and (min-width: 1367px)
		.profile
			.left-sidebar
				.plan-info
					.subtitle
						font-size: 10pt
					.plan-name
						font-size: 15pt
					.plan-specs
						font-size: 12pt
					.v-btn
						.v-btn__content
							font-size: 10pt
							font-weight: 600
				.legacy-contacts
					.subtitle
						font-size: 10pt
					.m-title
						font-size: 15pt
					.text
						font-size: 12pt
					.v-btn
						.v-btn__content
							font-size: 10pt
							font-weight: 600
			.right-panel
				.subtitle
					font-size: 10pt
				.profile-main
					.profile-name
						font-size: 15pt
	@media only screen and (min-width: 1921px)
		.profile
			.left-sidebar
				.plan-info
					.subtitle
						font-size: 14pt
						margin-bottom: 7px
					.plan-name
						font-size: 19pt
						margin-bottom: 15px
					.plan-specs
						font-size: 16pt
					.v-btn
						.v-btn__content
							font-size: 14pt
				.legacy-contacts
					.subtitle
						font-size: 14pt
						margin-bottom: 7px
					.m-title
						font-size: 19pt
						margin-bottom: 15px
					.text
						font-size: 16pt
					.v-btn
						.v-btn__content
							font-size: 13pt
					.legacy--contacts
						.legacy-contact
							height: 50px
							.actions-layer
								.v-icon
									margin-right: 10px
									margin-top: 10px

							.legacy-contact-picture
								margin-left: 5px
								margin-right: 15px
								img
									width: 35px
									height: 35px
									margin-top: 8px

							.legacy-contact-name
								margin-top: 11px
								font-size: 14pt
			.right-panel
				.general-info
					.edit-account-button
						.v-btn
							.v-btn__content
								font-size: 13pt
				.subtitle
					font-size: 13pt
				.profile-main
					.profile-name
						font-size: 19pt
				.profile-main
					display: table
					.profile-location-icon
					.profile-location
						font-size: 14pt
				.profile-occupation
					font-size: 12pt
				.contact-info
					.prop-name
						font-size: 16pt
					.prop-value
						font-size: 16pt
				.additional-info
					.text
						font-size: 16pt
		.card-title
			font-size: 18pt
			input
				font-size: 16pt
			label
				font-size: 16pt
		.new-legacy-contact
			.new-picture-container
				.picture-uploader
					.first
						font-size: 13pt
					.last
						font-size: 16pt
			input
				font-size: 16pt
			label
				font-size: 16pt
		.edit-legacy-contact
			.edit-picture-container
				.picture-uploader
					.first
						font-size: 13pt
					.last
						font-size: 16pt
			input
				font-size: 16pt
			label
				font-size: 16pt
	@media only screen and (max-width: 768px)
		.profile

			.right-panel
				.general-info
					position: relative
				.profile-occupation
					margin-top: 0

		.card-title
			font-size: 12pt
</style>