<template lang="pug">
	.group-editor
		v-dialog(v-model="open", max-width="900", persistent, content-class="group-editor-dialog")
			v-card.group-editor-card
				v-card-text
					.group-editor-title
						|Editing {{group.name}}
					.group-editor-form
						v-row
							v-col(cols="12", md="4")
								.edit-picture-container(@click="triggerPictureUpload")
									
									loader(position="absolute", background="white", v-show="status.uploading", image="/assets/icons/loading.gif")

									.picture-uploader(v-show="!picture")
										p.first
											|Picture
										img(src="/assets/icons/ic_add_groups.svg")
										p.last
											|Add contacts group picture
									.picture-preview(v-show="picture && !status.uploading")
										.picture-preview-container
											img(v-if="picture === '/assets/icons/avatar-groups_bg.svg'" src="/assets/icons/avatar_groups_add.svg" style="vertical-align: middle")
											img(v-else :src="picture", style="vertical-align: middle")

											.mobile-actions.d-block.d-md-none
												v-row
													v-col.pt-0.pr-0(cols="6")
														.action-row
															v-btn.elevation-0(@click="$refs.newPicture.click()", block, color="#3d64d9", dark, tile, small)
																|Change
																v-icon(color="#fff", right, size="17")
																	|mdi-sync
													v-col.pt-0.pl-0(cols="6")
														.action-row
															v-btn.elevation-0(@click="deleteImage", block, color="red", dark, tile, small)
																|Delete
																v-icon(color="#fff", size="17", right)
																	|mdi-delete

											.change-hover.d-none.d-md-block
												.actions
													.action-row
														v-btn.elevation-0(@click="$refs.newPicture.click()", small, color="#3d64d9", dark, size="20")
															|{{ changePictureText }}
															v-icon(color="#fff", right)
																|mdi-sync
													.action-row
														v-btn.elevation-0(@click="deleteImage", color="red", small, dark, v-if="!isPictureDefault()")
															|Delete picture
															v-icon(color="#fff", size="20", right)
																|mdi-delete
									input(type="file", ref="newPicture", @change="uploadAsset", accept="image/*", v-show="false")

							v-col(cols="12", md="8")
								v-form(ref="editGroupInfo")
									v-text-field(
										prepend-icon="mdi-account",
										v-model="edit.name",
										label="Name",
										:rules="form.validations.required",
										background-color="white",
										outlined,
										dense,
										required)

								v-expansion-panels(flat)
									v-expansion-panel.contact-group-selector
										v-expansion-panel-header
											|Contacts
										v-expansion-panel-content
											v-card.contacts-card.mt-3.elevation-0
												v-card-text
													.contacts-list
														v-checkbox(
															v-model="edit.contacts",
															v-for="contact in contacts",
															:value="contact._id",
															color="#a44933",
															:key="contact._id")

															template(v-slot:label)
																.contact-info
																	.contact-picture
																		img(:src="contact.pictureURL")
																	.contact-name
																		|{{ contact.name }}
													.empty-label(v-if="contacts.length == 0")
														|You don't have any contacts yet
													v-alert(ref="contactsAlert", color="orange", :value="false", dismissable)
														|Groups need to have at least one contact


				v-card-actions.editor-buttons
					v-spacer
					v-btn.white-btn-text.elevation-0(color="#F44336", @click="close")
						|Close
					v-btn.white-btn-text.elevation-0(color="#2963b4", @click="saveGroup", :loading="status.updating")
						|Save
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		props: ["group"],
		data() {
			return {
				open: false,
				status: {
					uploading: false,
					updating: false
				},
				edit: {
					name: "",
					contacts: [],
					pictureURL: ""
				},
				picture: null,
				form: {
					validations: {
						required: [
							v => !!v || 'This field is required',
						]
					}
				},
			}
		},
		mounted() {
			this.open = true
			this.edit = JSON.parse(JSON.stringify(this.group))
			this.edit.contacts = this.edit.contacts.map(contact => {
				return contact._id
			})
			this.picture = this.edit.pictureURL
		},
		methods: {
			close: function(){
				this.open = false
				this.$emit("close")
			},
			saveGroup: function(){
				if( this.edit.contacts.length == 0)
					this.$refs.contactsAlert.toggle()
				else{
					if( this.$refs.editGroupInfo.validate() ){
						this.status.updating = true

						let newGroup = {
							name: this.edit.name,
							contacts: this.edit.contacts,
							pictureURL: this.picture || "/assets/icons/avatar-groups_bg.svg",
						}

						let url = this.baseApi + this.env + "groups/" + this.edit._id

						this.axios.put(url, newGroup)
						.then( response => {

							this.$swal("Done!", this.edit.name + " was updated successfully", "success")
							this.open = false
							let updated = this.edit
							updated.pictureURL = newGroup.pictureURL
							this.$emit("update", updated)

						})
						.catch( err => {
							console.log( err )
						})
						.finally( () => {
							this.status.creating = false
						})
					}
				}
			},
			isPictureDefault: function() {
				if( this.picture ){
					if( this.picture.match(/avatar/g))
						return true
					else
						return false
				}else
					return true
			},

			triggerPictureUpload: function(){
				if(!this.status.uploading && !this.picture ){
					this.$refs.newPicture.click()
				}
			},
			deleteImage: function(){
				this.status.uploading = true
				setTimeout(() => {
					this.status.uploading = false
					this.$refs.newPicture.value = ""
					this.picture = null
				}, 500)
			},
			uploadAsset: async function(){
				let file = this.$refs.newPicture.files[0]
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
							this.axios.post(url, body)
							.then( response => {
								this.picture = response.data.asset.url
							})
							.catch( err => {
								console.log( err )
							})
							.finally( () => {
								this.status.uploading = false
							})
						}else{
							this.$swal("File too big", "The maximum upload size is 3 MB", "warning")
							this.$refs.newPicture.value = ""
						}

					}else{
						this.$swal("Invalid file", "You can only upload images", "warning")
						this.$refs.newPicture.value = ""
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

			removeEmail: function( i ){
				this.edit.emails.splice(i, 1)
			},
			emailRemover: function( i ){
				if( i == 0 )
					return ""
				else
					return "mdi-close"
			},
			addEmail: function(){
				this.edit.emails.push({value: ""})
			},
		},
		computed: {
			contacts: function(){
				return this.$store.getters.contacts
			},
			changePictureText: function() {
				if( this.picture ){
					if( this.picture.match(/avatar/g))
						return "Upload picture"
					else
						return "Change picture"
				}else{
					return "Upload picture"
				}
			}

		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.group-editor-dialog
		.v-input--checkbox
			.v-input--selection-controls__ripple
				margin-left: 9px
		
		.contact-group-selector
			.v-expansion-panel-content__wrap
				padding: 0px
			.v-expansion-panel-header
				font-family: Raleway
				font-size: 12pt
				font-weight: 700
				letter-spacing: 1px
				text-transform: uppercase
				padding-left: 15px
				margin-bottom: 0
				color: #777
			.v-expansion-panel-content
				.v-card
					.v-card__text
						padding-top: 0px
						padding-left: 0px
						padding-right: 0px
			.empty-label
				text-align: center
	.group-editor
		.subtitle
			font-family: Raleway
			font-weight: 700
			color: #222
			text-transform: uppercase
			margin-bottom: 7px
			letter-spacing: 1px
		.v-btn
			.v-btn__content
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn__loader
				color: white
	.group-editor-card
		padding-top: 30px
		padding-bottom: 30px
		.group-editor-title
			font-family: Raleway
			text-align: center
			font-weight: 700
			font-size: 24pt
			margin-bottom: 20px
		.group-editor-form
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
						max-width: 40%
					.last
						font-family: Raleway
						font-size: 12pt
						color: #bbb
						font-weight: 700
				.picture-preview
					.picture-preview-container
						text-align: center
						margin-left: 0px
						margin-right: 0px
						position: relative
						overflow: hidden
						img
							max-width: 100%
							display: inline-block
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
					&:hover
						cursor: pointer
						.change-hover
							top: 0
							transition: 0.2s linear all

					.mobile-actions
						margin-top: -7px
			.save-group
				text-align: center
				.v-icon
					margin-top: -3px
				.text
					font-family: Raleway
					font-weight: 600
					font-size: 12px
					text-transform: uppercase
					color: #032eb1
					margin-left: 5px
				&:hover
					cursor: pointer
			.v-text-field
				.v-icon
					color: #032eb1

		.contacts-card
			.contacts-list
				.v-input--checkbox
					margin-top: 0px
					padding-top: 2px
					padding-bottom: 2px
					padding-left: 25px
					padding-right: 25px
					&:hover
						background-color: rgba(164, 73, 51, 0.05)
					.v-messages
						display: none
					.v-input--selection-controls__ripple
						z-index: 10
					.contact-info
						.contact-picture
							display: inline-block
							float: left
							margin-left: 5px
							margin-right: 15px
							img
								width: 25px
								height: 25px
								border-radius: 50%
								margin-top: 8px
						.contact-name
							display: inline-block
							float: left
							margin-top: 11px
							font-family: Raleway
							font-weight: 700
			.contacts-list-subtitle
				font-family: Raleway
				font-size: 14pt
				font-weight: 700
				letter-spacing: 1px
				text-transform: uppercase
				padding-left: 15px
				margin-bottom: 15px
	.add-contact-btn-container
		text-align: center
		.add-contact-btn
			margin-top: 15px
			.v-btn__content
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn__loader
				color: white
</style>