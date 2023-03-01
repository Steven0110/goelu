<template lang="pug">
	.contact-editor
		v-dialog(v-model="open", :max-width="maxWidth", persistent, content-class="contact-editor-dialog")
			v-card.contact-editor-card
				v-card-text
					.contact-editor-title
						|Editing {{contact.coupon}}
					.contact-editor-form
						v-row
							v-col(cols="12")
								v-form(ref="editContactInfo")
									v-text-field(
			                            prepend-icon="mdi-account",
			                            v-model="edit.coupon",
			                            label="Cupon",
			                            :rules="form.validations.required",
			                            background-color="white",
			                            outlined,
			                            dense,
			                            required)
									v-text-field(
			                            prepend-icon="mdi-account",
			                            v-model="edit.owner",
			                            label="Name",
			                            :rules="form.validations.required",
			                            background-color="white",
			                            outlined,
			                            dense,
			                            required)
									v-text-field(
			                            prepend-icon="mdi-account",
			                            v-model="edit.discount",
			                            label="Name",
			                            :rules="form.validations.required",
			                            background-color="white",
			                            outlined,
			                            dense,
			                            required)
				v-card-actions.editor-buttons
					v-spacer
					v-btn.elevation-0.white-btn-text.elevation-0(color="#F44336", @click="close")
						|Close
					v-btn.elevation-0.white-btn-text.elevation-0(color="#2963b4", @click="saveContact", :loading="status.updating")
						|Save
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		props: ["contact"],
		data() {
			return {
				open: false,
				status: {
					uploading: false,
					updating: false
				},
				edit: {
					coupon: "",
					owner: "",
					discount: ""
				},
				picture: null,
                form: {
                    validations: {
                        required: [
                            v => !!v || 'This field is required',
                        ],
                        email: [
                            v => !!v || 'This field is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
                        ]
                    }
                },
			}
		},
		mounted() {
			this.open = true
			this.edit = JSON.parse(JSON.stringify(this.contact))			
		},
		computed: {
			maxWidth: function() {
				if(this.$vuetify.breakpoint.width > 1920){
					return "1200"
				}else{
					return "1000"
				}
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
		methods: {
			close: function(){
				this.open = false
				this.$emit("close")
			},
			saveContact: function(){
				if( this.$refs.editContactInfo.validate() ){
					this.status.updating = true

					let newContact = {
						coupon: this.edit.coupon,
						owner: this.edit.owner,
						discount: this.edit.discount
					}

					let url = this.baseApi + this.env + "admin/coupon/" + this.edit._id

					this.axios.put(url, newContact)
					.then( response => {

						this.$swal("Done!", this.edit.name + " was updated successfully", "success")
						this.open = false
						let updated = this.edit
						updated.pictureURL = newContact.pictureURL
						this.$emit("update", updated)

					})
					.catch( err => {
						console.log( err )
					})
					.finally( () => {
						this.status.creating = false
					})
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
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.contact-editor
		.subtitle
			font-family: Raleway
			font-weight: 700
			color: #222
			text-transform: uppercase
			margin-bottom: 7px
			letter-spacing: 1px
		.v-btn
			.v-btn
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn
				color: white
	.contact-editor-card
		padding-top: 30px
		padding-bottom: 30px
		.contact-editor-title
			font-family: Raleway
			text-align: center
			font-weight: 700
			font-size: 24pt
			margin-bottom: 20px
		.contact-editor-form
			.edit-picture-container
				min-width: 150px
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
					min-height: 200px
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
										.v-btn
											font-family: Raleway
											font-weight: 600
					&:hover
						cursor: pointer
						.change-hover
							top: 0
							transition: 0.2s linear all

					.mobile-actions
						margin-top: -7px
			.save-contact
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
	.add-contact-btn-container
		text-align: center
		.add-contact-btn
			margin-top: 15px
			.v-btn
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn
				color: white
</style>