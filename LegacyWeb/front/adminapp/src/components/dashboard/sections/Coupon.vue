<template lang="pug">
	.contacts-subpanel
		v-row
			v-col.order-md-1.order-2(cols="12", md="4")
				.add-contact
					.subtitle
						|Agregar Cupon					
					v-form(ref="newContactInfo")
						v-card.mt-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-text-field(
		                            prepend-icon="",
		                            v-model="newContact.cupon",		                            
		                            label="Cupon",
		                            placeholder="Agregar cupon"
		                            :rules="form.validations.required",
		                            background-color="white",
		                            required)
						v-card.mt-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-text-field(
		                            prepend-icon="",
		                            v-model="newContact.owner",		                            
		                            label="Propietario",
		                            placeholder="Agregar propietario"
		                            :rules="form.validations.required",
		                            background-color="white",
		                            required)
						v-card.mt-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-text-field(
		                            prepend-icon="",
		                            v-model="newContact.discount",		                            
		                            label="Descuento %",
		                            placeholder="Agregar descuento: \"10\""
		                            :rules="form.validations.required",
		                            background-color="white",
		                            required)
					.add-contact-btn-container
						v-btn.elevation-0.add-contact-btn(
							color="#3f64d9",
							raised,
							:loading="status.creating"
							@click="addContact")
							|Agregar cupon
			v-col.order-md-2.order-1(cols="12", md="8")
				.contacts-list
					.subtitle
						|Cupones
					v-data-table.contacts-table.elevation-1(:headers="tableHeaders", :items="contacts", :loading="gettingContacts", no-data-text="No hay cupones", loading-text="Cargando cupones...")
						template(v-slot:item._id="{ item }")
							.contact-actions
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#3954b0",
											@click="editContact(item)",
											:small="small")
											|mdi-pencil
									span
										|Modificar Cupon
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#901617",
											@click="deleteContact(item)",
											:small="small")
											|mdi-delete
									span
										|Borrar cupon
		//@update="updatedContact"
		contact-editor(v-if="editingContact", @close="closeEditModal", :contact="editingContact")
		
</template>

<script>
	import ContactEditor from "@/components/dashboard/elements/ContactEditor.vue"
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				tabs: null,
				newContact: {
					cupon: "",
					owner: "",
					discount: ""
				},
				editingContact: null,
				picture: null,
				tableHeaders: [
					{ text: "Cupon", value: "coupon"},
					{ text: "Propietario", value: "owner", align: "center" },
					{ text: "Descuento %", value: "discount", align: "center" },
					{ text: "Edit / Delete", value: "_id", align: "center", sortable: false },
				],
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
                status: {
                	uploading: false,
                	creating: false
                }
			}
		},
		mounted() {
			if( this.$route.query.newContact ){
				this.$nextTick(() => this.$refs.newContactName.focus())
			}
		},
		activated() {
			if( this.$route.query.newContact ){
				this.$nextTick(() => this.$refs.newContactName.focus())
			}
		},
		computed: {
			contacts: function(){
				return this.$store.getters.contacts
			},
			gettingContacts: function(){
				return this.$store.getters.gettingContacts
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
		},
		methods: {
			triggerPictureUpload: function(){
				if(!this.status.uploading && !this.picture ){
					this.$refs.newPicture.click()
				}
			},
			addEmail: function(){
				this.newContact.emails.push({value: ""})
			},
			addContact: function(){
				if( this.$refs.newContactInfo.validate() ){
					this.status.creating = true
					let today=new Date()
					today.setHours(0,0,0,0)
					let newContact = {
						coupon: this.newContact.cupon,
						owner: this.newContact.owner,
						discount: this.newContact.discount,
						create: today
					}

					let contactId

					let url = this.baseApi + this.env + "admin/coupon "
					this.axios.post(url, newContact)
					.then( response => {												
						this.$store.commit("addContact", response.data.contact)
						this.resetForm()
						return this.$swal("Done!", response.data.contact.coupon + " was added successfully", "success")
					})					
					.catch( err => {
						conosole.log( err )
					})
					.finally( () => {
						this.status.creating = false
					})
				}
			},
			resetForm: function(){
				this.newContact = {
					cupon: "",
					owner: "",
					discount: "",
				}
				this.picture = null				
				this.$refs.newContactInfo.reset()
			},
			editContact: function( contact ){
				this.editingContact = contact
			},
			deleteContact: function( contact ){
				this.$swal({
					title: `Are you sure you want to delete ${contact.coupon}?`,
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
				  	if(result.value) {
				  		this.$store.commit("setContactsStatus", true)
						let url = this.baseApi + this.env + "admin/coupon/" + contact._id
				  		this.axios.delete( url )
				  		.then( result => {
				  			this.$store.commit("removeContact", contact)
				  			this.$swal("Done!", contact.coupon + " was deleted successfully", "success")
				  		})
				  		.catch( err => {
				  			console.log( err )
				  		})
				  		.finally(() => {
				  			this.$store.commit("setContactsStatus", false)
				  		})
				  	}
				})
			},
			removeEmail: function( i ){
				this.newContact.emails.splice(i, 1)
			},
			emailRemover: function( i ){
				if( i == 0 )
					return ""
				else
					return "mdi-close"
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
			closeEditModal: function() {
				this.editingContact = null
			},
			updatedContact: function(contact) {
				this.editingContact = null
				contact.emails = contact.emails.map(a => a.value)

				this.$store.commit("updateContact", contact)
			}
		},
		components: {
			ContactEditor,			
			Loader
		}
	}
</script>


<style lang="sass">
	.contacts-subpanel
		padding: 15px
		background-color: #f2f2f2
		height: 100%
		.add-contact
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.new-contact
				.new-picture-container
					padding: 25px
					position: relative
					border: 2px dashed #ddd
					transition: 0.2s linear all
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
							max-width: 25%
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
			.input-card
				position: relative
				.required-dot
					position: absolute
					right: 15px
					top: 15px
					color: #032eb1
					font-size: 20px
				.v-card__text
					padding-bottom: 5px
					.v-text-field__slot
						label
							text-transform: uppercase
							letter-spacing: 1px
					.v-text-field
						.v-input__slot
							&:before,&:after
								display: none
						.v-text-field__slot
							label
								text-transform: uppercase
								letter-spacing: 1px
								color: #032eb1
								font-family: Raleway
							&:before,&:after
								display: none

					.v-textarea
						.v-input__slot
							&:before,&:after
								display: none
					.v-select
						.v-input__slot
							margin-bottom: 0
							&:before,&:after
								display: none
			.add-new-contact
				text-align: center
				margin-top: 10px
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
					.v-btn__content
						font-family: Raleway
						font-size: 12px
						font-weight: 800
						color: white
						padding-left: 25px
						padding-right: 25px
					.v-btn__loader
						color: white
		
		.contacts-list
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.contacts-table
				*
					font-family: Raleway
				tr
					&:nth-of-type(even)
						background-color: rgba(0, 0, 0, .03)
				.v-data-table-header
					tr
						background-color: rgba(0, 0, 0, .03)
						th
							span
								font-family: Raleway
								text-transform: uppercase
				tbody
					tr
						td
							padding-top: 12px
							padding-bottom: 12px
				.contact-thumbnail
					overflow: hidden
					border-radius: 50%
					width: 30px
					height: 30px
					background-size: cover
					background-position: center					
					&:hover
						cursor: pointer

	@media only screen and (min-width: 1367px)
		.contacts-subpanel
			.add-contact
				.subtitle
					font-size: 14pt
					font-weight: 700
			.contacts-list
				.subtitle
					font-weight: 700
					font-size: 14pt
				.contacts-table
					*
						font-family: Raleway
					.v-data-table-header
						tr
							th
								span
									font-family: Raleway
									text-transform: uppercase
									font-size: 12pt
									font-weight: 800
					tbody
						tr
							td
								font-weight: 600
								font-size: 11pt
					.v-data-footer
						*
							font-size: 12pt
					.contact-thumbnail
						img
							border-radius: 50%
							width: 30px
							height: 30px
	@media only screen and (min-width: 1921px)
		.contacts-subpanel
			.add-contact
				.subtitle
					font-size: 18pt
				.new-contact
					.new-picture-container
						.picture-uploader
							.first
								font-size: 15pt
							.last
								font-size: 16pt
				.add-contact-btn-container
					.add-contact-btn
						.v-btn__content
							font-size: 16px
				.new-contact
				.add-new-contact
					.text
						font-size: 16px
			.contacts-list
				.subtitle
					font-size: 18pt
				.contacts-table
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
					.contact-thumbnail
						img
							width: 30px
							height: 30px
			input
				font-size: 16pt
			label
				font-size: 16pt
	@media only screen and (max-width: 768px)
		.contacts-subpanel
			padding: 10px
			.contacts-list
				.v-data-table
					.v-data-table__wrapper
						&::-webkit-scrollbar-track
							-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
							background-color: rgba(255, 255, 255, 0.2)
						&::-webkit-scrollbar
							width: 10px
							background-color: rgba(255, 255, 255, 0.2)
						&::-webkit-scrollbar-thumb
							background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, #3A6BD6),color-stop(0.72, #3954b0),color-stop(0.86, #3A6BD6))
					table
						width: 200%
						overflow-x: scroll
						thead
							tr
								th
									border-bottom: none !important
									&:first-child
										.v-text-field .v-input__slot:before
											display: none
						tbody
							.v-data-table__mobile-row
								display: table-cell !important
								//width: 170px
								text-align: center
								.v-data-table__mobile-row__header
									text-align: center
								.v-data-table__mobile-row__cell
									text-align: center
							tr
								display: table-row

								&:first-child
									.v-data-table__mobile-row
										.v-data-table__mobile-row__header
											height: 30px
								.v-data-table__mobile-row
									&:nth-child(1)
										width: 100px
									&:nth-child(2)
										width: 150px
									&:nth-last-child(1)
										width: 200px
									&:nth-last-child(2)
										width: 150px
						tbody
							tr
								width: 100%

								&:not(:first-child)
									.v-data-table__mobile-row__header
										display: none
	@media only screen and (max-width: 640px)
		.contacts-subpanel
			.contacts-list
				.v-data-table
					table
						margin-top: 50px
						thead
							tr
								th
									&:first-child
										position: absolute
										top: 55px
										width: calc(100vw - 20px)
	@media only screen and (max-width: 420px)
		.contacts-subpanel
			.contacts-list
				.v-data-table
					.v-data-table__wrapper
					table
						width: 300%
						tbody
							tr
								.v-data-table__mobile-row
									&:nth-child(1)
										width: 75px
									&:last-child
										border: none !important
</style>