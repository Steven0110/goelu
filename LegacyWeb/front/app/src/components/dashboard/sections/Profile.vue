<template lang="pug">
	.profile
		v-row
			v-col.left-sidebar.order-md-1.order-2(md="4", cols="12")
				v-progress-linear(color="blue", indeterminate, height="10", v-show="status.uploading")
				.profile-picture.desktop-fix.d-none.d-md-block(:style="profileStyle")
					input.d-none(ref="file", type="file", @change="imageLoaded", accept="image/*")
				.plan-info
					v-card.elevation-0
						v-card-text
							.subtitle
								|Your plan
							.plan-name
								|{{ plan.name | planName }}
							.plan-specs
								span
									|{{ $t("your-plan-includes") }}&nbsp;
								span.account-storage-limit
									|{{ plan.name | planStorage }}
								span
									|&nbsp;|{{ $t("of-storage") }}
							v-row
								v-col(lg="6", cols="12", :class="{'pb-1': $vuetify.breakpoint.mdAndDown}")
									v-btn.elevation-0.white-btn-text(
										color="#28c5cb",
										raised,
										block,
										tile,
										:small="small",
										:x-small="xsmall",
										:to="{path: '/dashboard/plan'}")
										|{{ $t("read-more") }}
								v-col(lg="6", cols="12", :class="{'pt-1': $vuetify.breakpoint.mdAndDown}")
									v-btn.elevation-0.white-btn-text(
										color="#3d64d9",
										raised,
										block,
										tile,
										:small="small",
										:x-small="xsmall",
										@click="$router.push({path: '/dashboard/plan'})")
										|Upgrade your plan
				.legacy-contacts
					v-card.elevation-0(:loading="status.deletingLegacy")
						v-card-text
							.subtitle
								|Accounts
							.m-title
								|Legacy managers
							.text
								|Add or remove your legacy managers
							v-row
								v-col(cols="12")
									.legacy--contacts
										.legacy-contact(v-for="legacyUser in user.legacyUsers")
											.actions-layer
												v-icon.float-right(@click="deleteLegacyUser( legacyUser )", color="red")
													|mdi-delete
												v-icon.float-right(@click="editLegacy( legacyUser )", color="blue")
													|mdi-pencil
											.legacy-contact-picture(:style="{backgroundImage:'url('+legacyUser.pictureURL+')'}")
												
											.legacy-contact-name
												|{{ legacyUser.name }}
							v-row
								v-col(md="8", cols="12", offset-md="2")
									v-btn.elevation-0.white-btn-text(
										color="#28c5cb",
										raised,
										block,
										tile,
										:small="small",
										:x-small="xsmall",
										@click="showNewLegacy = true")
										|Add account
			v-col.right-panel.order-md-2.order-1(md="8", cols="12")
				.general-info
					.edit-account-button.d-none.d-lg-block
						v-btn.elevation-0.white-btn-text(
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
								//v-row
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
								v-btn.elevation-0.white-btn-text(
									color="#3d64d9",
									raised,
									tile,
									:small="small",
									:x-small="xsmall",
									block,
									@click="$router.push({path: '/dashboard/profile/edit', query: {returnable: 'true'}})")
									|Edit account

				.additional-info
					.subtitle
						|About your legacy manager
					.text
						|Your legacy manager will be the administrator of the files you upload. You will select this person carefully, he or she will be able to send the files in the moment it has to be sent. For example, if you leave a video for you kids about the day they get married, your legacy manager will have to send on the exact date. The legacy manager will NOT be able, at any time, to see any of the content of your files; he/she will be able only to visualize the topic, title, type of file and the date it was created.
					.text
						|Goelu and your Legacy manager will be your ally in assuring you will not miss any the most important events of your family by making sure they are sent in the exact moment and time.

		v-dialog(v-model="showNewLegacy", max-width="800", persistent)
			v-card.new-legacy-contact
				v-card-title
					.card-title
						|Add new legacy manager
				v-card-text
					v-form(ref="newLegacyForm")
						v-row
							v-col(md="6", cols="12")
								.new-picture-container(@click="triggerPictureUpload")
									.picture-uploader(v-show="!newLegacy.pictureURL")
										p.first
											|Picture
										img(src="/assets/icons/ic_add_contact.svg")
										p.last
											|Add picture
									.picture-preview(v-show="newLegacy.pictureURL && !status.uploadingLegacy")
										.picture-preview-container
											img(:src="newLegacy.pictureURL")
											.delete-layer(@click="deleteLegacyImage")
												.text
													span
														|Remove picture
														v-icon(color="#fff", size="40")
															|mdi-close
									input(type="file", ref="newLegacyPicture", @change="legacyImageLoaded", v-show="false", accept="image/*")

									loader(position="absolute", background="white", v-show="status.uploadingLegacy", image="/assets/icons/loading.gif")

							v-col(md="6", cols="12")
								v-text-field(
									v-model="newLegacy.name",
									label="Name",
									outlined,
									placeholder="Legacy manager name"
									:rules="form.validations.required")
								v-text-field(
									v-model="newLegacy.email",
									label="Email",
									placeholder="Legacy manager email"
									outlined,
									:rules="form.validations.email")
				v-card-actions
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="showNewLegacy = false")
						|Cancel
					v-btn.elevation-0.white-btn-text(color="#2963b4", @click="addLegacyContact", :loading="status.creatingLegacy")
						|Add legacy manager

		v-dialog(v-model="showEditLegacy", max-width="700", persistent)
			v-card.edit-legacy-contact
				v-card-title
					.card-title
						|Editing Legacy Manager
				v-card-text
					v-form(ref="editLegacyForm")
						v-row
							v-col(md="6", cols="12")
								.edit-picture-container(@click="triggerEPictureUpload")
									.picture-uploader(v-show="!legacyEdit.pictureURL")
										p.first
											|Picture
										img(src="/assets/icons/ic_add_contact.svg")
										p.last
											|Add picture
									.picture-preview(v-show="legacyEdit.pictureURL && !status.uploadingLegacy")
										.picture-preview-container
											img(:src="legacyEdit.pictureURL")
											.delete-layer(@click="deleteELegacyImage")
												.text
													span
														|Remove picture
														v-icon(color="#fff", size="40")
															|mdi-close
									input(type="file", ref="editLegacyPicture", @change="eLegacyImageLoaded", v-show="false", accept="image/*")

									loader(position="absolute", background="white", v-show="status.uploadingLegacy", image="/assets/icons/loading.gif")

							v-col(md="6", cols="12")
								v-text-field(
									v-model="legacyEdit.name",
									label="Name",
									outlined,
									placeholder="Legacy manager name"
									:rules="form.validations.required")
								v-text-field(
									v-model="legacyEdit.email",
									label="Email",
									placeholder="Legacy manager email"
									outlined,
									:rules="form.validations.email")
				v-card-actions
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="showEditLegacy = false")
						|Cancel
					v-btn.elevation-0.white-btn-text(color="#2963b4", @click="saveLegacyContact", :loading="status.savingLegacy")
						|Save

</template>

<script>
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				status: {
					uploading: false,
					uploadingLegacy: false,
					resetting: false,
					creatingLegacy: false,
					deletingLegacy: false,
					savingLegacy: false
				},
				passwordReset: {
					current: "",
					rnew: "",
					new: "",
				},
				newLegacy: {
					name: "",
					email: "",
					pictureURL: ""
				},
				legacyEdit: {
					name: "",
					email: "",
					pictureURL: ""
				},
				showReset: false,
				showNewLegacy: false,
				showEditLegacy: false,
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
			legacyImageLoaded: async function(){
				let file = this.$refs.newLegacyPicture.files[0]
				const filetypes = ["jpg","png","jpeg","gif"]

				if( file ){

					let filetype = this.getFileType( file )
					if( filetypes.includes( filetype ) ){

						if( file.size < 3000000 ){
							this.status.uploadingLegacy = true
							let base64 = await this.toBase64( file )
							let body = {
								asset: {
									base64: base64,
									filetype: filetype
								}
							}
							let url = this.baseApi + this.env + "user/asset"

							this.axios.post(url, body)
							.then( response => {
								this.newLegacy.pictureURL = response.data.asset.url								
							})
							.catch( err => {
								console.log( err )
							})
							.finally( () => {
								this.status.uploadingLegacy = false
							})
						}else{
							this.$swal("File too big", "The maximum upload size is 3 MB", "warning")
							this.$refs.newLegacyPicture.value = ""
						}
					}
				}
			},
			eLegacyImageLoaded: async function(){
				let file = this.$refs.editLegacyPicture.files[0]
				const filetypes = ["jpg","png","jpeg","gif"]

				if( file ){

					let filetype = this.getFileType( file )
					if( filetypes.includes( filetype ) ){

						if( file.size < 3000000 ){
							this.status.uploadingLegacy = true
							let base64 = await this.toBase64( file )
							let body = {
								asset: {
									base64: base64,
									filetype: filetype
								}
							}
							let url = this.baseApi + this.env + "user/asset"

							this.axios.post(url, body)
							.then( response => {
								this.legacyEdit.pictureURL = response.data.asset.url								
							})
							.catch( err => {
								console.log( err )
							})
							.finally( () => {
								this.status.uploadingLegacy = false
							})
						}else{
							this.$swal("File too big", "The maximum upload size is 3 MB", "warning")
							this.$refs.editLegacyPicture.value = ""
						}
					}
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
			triggerPictureUpload: function(){
				if(!this.status.uploading && !this.picture ){
					this.$refs.newLegacyPicture.click()
				}
			},
			triggerEPictureUpload: function(){
				if(!this.status.uploading && !this.legacyEdit.pictureURL ){
					this.$refs.editLegacyPicture.click()
				}
			},
			deleteLegacyImage: function(){
				this.status.uploading = true
				setTimeout(() => {
					this.status.uploading = false
					this.$refs.newLegacyPicture.value = ""
				}, 500)
			},
			deleteELegacyImage: function(){
				this.status.uploadingLegacy = true
				setTimeout(() => {
					this.status.uploadingLegacy = false
					this.$refs.editLegacyPicture.value = ""
					this.legacyEdit.pictureURL = ""
				}, 500)
			},
			addLegacyContact: function() {
				if( this.$refs.newLegacyForm.validate() ){

					this.status.creatingLegacy = true
					let url = this.baseApi + this.env + "user/legacy"

					let body = this.$clone( this.newLegacy )
					body.pictureURL = body.pictureURL || "/assets/icons/avatar_generico_bg_cuadrado.svg"

					this.axios.post(url, body)
					.then( response => {
						this.$store.commit("addLegacyContact", response.data.legacyUser)
						this.$swal("Done!", "Legacy manager created successfully", "success")

						this.newLegacy = {
							name: "",
							email: "",
							pictureURL: ""
						}
					})
					.catch( err => {
						console.log( err )
					})
					.finally( () => {
						this.showNewLegacy = false
						this.status.creatingLegacy = false
					})
				}
			},
			saveLegacyContact: function() {
				if( this.$refs.editLegacyForm.validate() ){

					this.status.savingLegacy = true
					let url = this.baseApi + this.env + "user/legacy/kz01sf4g4678"

					let body = this.$clone( this.legacyEdit )
					body.pictureURL = body.pictureURL || "/assets/icons/avatar_generico_bg_cuadrado.svg"					
					
					this.axios.put(url, body)
					.then( response => {
						this.$swal("Done!", "Legacy manager updated successfully", "success")
						if(this.legacyEdit.pictureURL=="")
							this.legacyEdit.pictureURL="/assets/icons/avatar_generico_bg_cuadrado.svg"
						this.$store.commit("updateLegacyUser", this.legacyEdit)

						this.legacyEdit = {
							name: "",
							email: "",
							pictureURL: ""
						}
					})
					.catch( err => {
						console.log( err )
					})
					.finally( () => {
						this.showEditLegacy = false
						this.status.savingLegacy = false
					})
				}
			},
			deleteLegacyUser: function(legacyUser) {
				this.$swal({
					title: `Do you want to delete ${legacyUser.name}?`,
					text: "This action can not be undone",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes, delete",
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then(result => {
					if( result.value ){
						this.status.deletingLegacy = true

						let url = this.baseApi + this.env + "user/legacy/by-email/" + legacyUser.email

						this.axios.delete(url)
						.then( response => {
							console.log( response.data )
							this.$swal("Done!", "Legacy manager deleted successfully", "success")
							this.$store.commit("deleteLegacyUser", legacyUser)
						})
						.catch( err => {
							console.log( err )
						})
						.finally( () => {
							this.status.deletingLegacy = false
						})
					}
				})

			},
			editLegacy: function(legacyUser) {
				this.legacyEdit = this.$clone(legacyUser)
				if(this.legacyEdit.pictureURL=="/assets/icons/avatar-generic_bg.svg" || this.legacyEdit.pictureURL=="/assets/icons/avatar_generico_bg_cuadrado.svg")
					this.legacyEdit.pictureURL = "" 
				this.showEditLegacy = true
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
			profileStyle: function() {
				let user = this.$store.getters.user
				let picture = user.pictureURL || "/assets/icons/avatar-generic_bg.svg"

				return {
					"background-image": `url('${picture}')`
				}
			},
			birthday: function() {
				let birthday = this.user.birthday
				if( birthday )
					return this.$moment(birthday).format("MMMM Do, YYYY")
				else
					return ""
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
			plan: function() {
				return this.$store.getters.plan || {}
			}
		},
		filters: {
			address: function(value) {
				if( value.country || value.state || value.city || value.street1 || value.zip )
					return `${value.country}, ${value.state}, ${value.city}, ${value.street1} ${value.zip}`
				else
					return "Not defined"
			},
			planName: value => (value || "Loading plan... - Loading plan...").split(" - ")[0],
			planStorage: value => (value || "Loading plan... - Loading plan...").split(" - ")[1]
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
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
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
							margin-top: 8px
							overflow: hidden
							border-radius: 50%
							width: 25px
							height: 25px
							background-size: cover
							background-position: center
								

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
				background-color: white
				padding: 50px
				border: 1px solid, rgba(0, 0, 0, 0.07)
				margin-top: 40px
				.subtitle
					font-size: 15pt
					color: #25a7df
				.text
					font-family: Raleway
					font-weight: 500
					margin-top: 10px
					text-align: justify
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
									margin-top: 15px

							.legacy-contact-picture
								margin-left: 5px
								margin-right: 15px
								margin-top: 14px

							.legacy-contact-name
								margin-top: 15px
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