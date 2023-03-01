<template lang="pug">
	.groups-subpanel
		v-row
			v-col.order-md-1.order-2(cols="12", md="4")
				.add-group
					.subtitle
						|{{$t('groups-add-title')}}
					v-card.new-group.elevation-0(width="100%")
						v-card-text
							.new-picture-container(@click="triggerPictureUpload")
								.picture-uploader(v-show="!picture")
									p.first
										|{{$t('contacts-picture')}}
									img(src="/assets/icons/ic_add_groups.svg")
									p.last
										|{{$t('groups-add-picture')}}
								.picture-preview(v-show="picture && !status.uploading")
									.picture-preview-container
										img(:src="picture")
										.delete-layer(@click="deleteImage")
											.text
												span
													|Remove picture
													v-icon(color="#fff", size="40")
														|mdi-close
								//v-icon(color="blue")
									|mdi-settings
								input(type="file", ref="newPicture", @change="uploadAsset", v-show="false", accept="image/*")

								loader(position="absolute", background="white", v-show="status.uploading", image="/assets/icons/loading.gif")
					v-form(ref="newGroupInfo")
						v-card.mt-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-text-field(
									prepend-icon="",
									v-model="newGroup.name",
									ref="newGroupName",
									:label="$t('groups-name')",
									:placeholder="$t('groups-iput-name')",
									:rules="form.validations.required",
									background-color="white",
									required)

						v-expansion-panels(flat)
							v-expansion-panel.contact-group-selector
								v-expansion-panel-header
									|{{$t('contacts')}}
								v-expansion-panel-content
									v-card.contacts-card.mt-3.elevation-0
										v-card-text
											.contacts-list
												v-checkbox(
													v-model="newGroup.contacts",
													v-for="contact in contacts",
													:value="contact._id",
													color="#a44933",
													:key="contact._id")

													template(v-slot:label)
														.contact-info
															.contact-picture(:style="{backgroundImage:'url('+contact.pictureURL+')'}")
															.contact-name
																|{{ contact.name }}
											.empty-label(v-if="contacts.length == 0")
												|{{$t('groups-no-contacs')}}

											v-alert(ref="contactsAlert", color="orange", :value="false", dismissable)
												|{{$t('groups-groups-need')}}

					.add-group-btn-container
						v-btn.add-group-btn.elevation-0(
							color="#3f64d9",
							raised,
							:loading="status.creating",
							@click="addGroup")
							|{{$t('groups-button-add')}}

			v-col.order-md-2.order-1(cols="12", md="8")
				.groups-list
					.subtitle
						|{{$t('groups')}}
					v-data-table.groups-table.elevation-1(:headers="tableHeaders", :items="groups", :loading="gettingGroups", no-data-text="No contacts groups found", loading-text="Loading contacts groups...")
						template(v-slot:item.pictureURL="{ item }")
							.group-thumbnail(:style="{backgroundImage:'url('+item.pictureURL+')'}" , @click="editContact(item)")
						template(v-slot:item._id="{ item }")
							.group-actions
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#3954b0",
											@click="editGroup(item)",
											:small="small")
											|mdi-pencil
									span
										|{{$t('groups-edit-tip')}}
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#901617",
											@click="deleteGroup(item)",
											:small="small")
											|mdi-delete
									span
										|{{$t('groups-delete-tip')}}

		group-editor(v-if="editingGroup", @close="closeEditModal", :group="editingGroup", @update="updatedGroup")
		
</template>

<script>
	import GroupEditor from "@/components/dashboard/elements/contacts/GroupEditor.vue"
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				tabs: null,
				newGroup: {
					picture: null,
					name: "",
					contacts: []
				},
				editingGroup: null,
				picture: null,
				tableHeaders: [
					{ text: "", value: "pictureURL", sortable: false },
					{ text: "Contact Group", value: "name", align: "center" },
					{ text: "Edit / Delete", value: "_id", align: "center", sortable: false },
				],
				form: {
					validations: {
						required: [
							v => !!v || 'This field is required',
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
			if( this.$route.query.newGroup ){
				this.$nextTick(() => this.$refs.newGroupName.focus())
			}
		},
		activated() {
			if( this.$route.query.newGroup ){
				this.$nextTick(() => this.$refs.newGroupName.focus())
			}
		},
		computed: {
			groups: function(){
				return this.$store.getters.groups
			},
			contacts: function(){
				return this.$store.getters.contacts
			},
			gettingGroups: function(){
				return this.$store.getters.gettingGroups
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
				this.newGroup.emails.push({value: ""})
			},
			addGroup: function(){
				if( this.newGroup.contacts.length == 0 )
					this.$refs.contactsAlert.toggle()
				else{
					if( this.$refs.newGroupInfo.validate() ){
						this.status.creating = true

						let newGroup = {
							name: this.newGroup.name,
							pictureURL: this.picture || "/assets/icons/avatar-groups_bg.svg",
							contacts: this.newGroup.contacts
						}

						let groupId

						let url = this.baseApi + this.env + "groups"
						this.axios.post(url, newGroup)
						.then( response => {
							groupId = response.data.group._id
							
							for( let i = 0 ; i < response.data.group.contacts.length ; i++ )
								response.data.group.contacts[ i ] = this.findContactById( response.data.group.contacts[ i ])

							this.$store.commit("addGroup", response.data.group)
							this.resetForm()
							return this.$swal("Done!", response.data.group.name + " was added successfully", "success")
						})
						.then( () => {
							if( this.$route.query.newGroup ){
								if( this.$route.query.from == "upload" ){
									this.$router.push({path: '/dashboard/upload', query: {keep: "true", group: groupId}})
								}else if( this.$route.query.from == "video" ){
									this.$router.push({path: '/dashboard/record', query: {keep: "true", group: groupId, video: true}})
								}else if( this.$route.query.from == "audio" ){
									this.$router.push({path: '/dashboard/record', query: {keep: "true", group: groupId, audio: true}})
								}else if( this.$route.query.from == "calendar" ){
									this.$router.push({path: '/dashboard/calendar', query: {keep: "true", group: groupId}})
								}
							}
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
			resetForm: function(){
				this.newGroup = {
					picture: null,
					name: "",
					emails: [
						{value: ""}
					]
				}
				this.picture = null
				this.$refs.newPicture.value = ""
				this.$refs.newGroupInfo.reset()
			},
			editGroup: function( group ){
				this.editingGroup = group
			},
			deleteGroup: function( group ){
				this.$swal({
					title: `Are you sure you want to delete ${group.name}?`,
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
						this.$store.commit("setGroupsStatus", true)
						let url = this.baseApi + this.env + "groups/" + group._id
						this.axios.delete( url )
						.then( result => {
							this.$store.commit("removeGroup", group)
							this.$swal("Done!", group.name + " was deleted successfully", "success")
						})
						.catch( err => {
							console.log( err )
						})
						.finally(() => {
							this.$store.commit("setGroupsStatus", false)
						})
					}
				})
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
				this.editingGroup = null
			},
			updatedGroup: function(group) {
				group.contacts = group.contacts.map(contact => {
					return this.findContactById( contact )
				})
				this.editingGroup = null
				this.$store.commit("updateGroup", group)
			},
			findContactById: function( id ){
				for( let i = 0 ; i < this.contacts.length ; i++ )
					if( this.contacts[ i ]._id == id ){
						return this.contacts[ i ]
					}
				return id
			},
		},
		components: {
			Loader,
			GroupEditor
		}
	}
</script>


<style lang="sass">
	.groups-subpanel
		padding: 15px
		background-color: #f2f2f2

		.contact-group-selector
			margin-top: 10px
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
				
		.add-group
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.new-group
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
			.add-group-btn-container
				text-align: center
				.add-group-btn
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

			.contacts-card
				.contacts-list
					.v-input--checkbox
						margin-top: 0px
						padding-top: 6px
						padding-bottom: 2px
						padding-left: 25px
						padding-right: 25px
						&:hover
							background-color: rgba(164, 73, 51, 0.05)
						.v-messages
							display: none
						.v-input--selection-controls__ripple
							z-index: 10
							margin-top:10px
						.v-input--selection-controls__input
							.v-icon
								margin-top:3px
						.contact-info
							.contact-picture
								display: inline-block
								float: left
								margin-left: 5px
								margin-right: 15px
								width: 25px
								height: 25px
								border-radius: 50%
								margin-top: 8px
								background-size: cover
								background-position: center								
									
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
		
		.groups-list
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.groups-table
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
				.group-thumbnail
					overflow: hidden
					border-radius: 50%
					width: 30px
					height: 30px
					background-size: cover
					background-position: center	
					&:hover
						cursor: pointer

	@media only screen and (min-width: 1367px)
		.groups-subpanel
			.add-group
				.subtitle
					font-size: 14pt
					font-weight: 700
			.groups-list
				.subtitle
					font-weight: 700
					font-size: 14pt
				.groups-table
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
					.group-thumbnail
						img
							border-radius: 50%
							width: 30px
							height: 30px
	@media only screen and (min-width: 1921px)
		.groups-subpanel
			.add-group
				.subtitle
					font-size: 18pt
				.new-group
					.new-picture-container
						.picture-uploader
							.first
								font-size: 15pt
							.last
								font-size: 16pt
				.add-group-btn-container
					.add-group-btn
						.v-btn__content
							font-size: 16px
				.new-group
				.add-new-contact
					.text
						font-size: 16px
			.groups-list
				.subtitle
					font-size: 18pt
				.groups-table
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
					.group-thumbnail
						img
							width: 30px
							height: 30px
			input
				font-size: 16pt
			label
				font-size: 16pt
	@media only screen and (max-width: 768px)
		.groups-subpanel
			padding: 10px
			.groups-list
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
						width: 100%
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
		.groups-subpanel
			.groups-list
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
		.groups-subpanel
			.groups-list
				.v-data-table
					.v-data-table__wrapper
					table
						width: 170% !important
						tbody
							tr
								.v-data-table__mobile-row
									&:nth-child(1)
										width: 75px !important
</style>