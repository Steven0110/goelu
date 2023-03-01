<template lang="pug">
	.file-manager-panel
		.subsection-header
			.subsection-header-icon
				img(src="/assets/icons/ic_file_manager_lg.svg")
			.subsection-title
				|File manager
			.subsection-description
				|Manage all your videos, audios and documents
		.content
			loader(position="absolute", background="white", v-show="status.loading", image="/assets/icons/loading.gif")
			loader(position="absolute", background="transparent", v-show="loadingFiles", image="/assets/icons/loading.gif")

			v-tabs(v-model="tabs", color="#dca646")
				v-tab(key="videos-tab")
					|Videos
				v-tab(key="audios-tab")
					|Audios
				v-tab(key="files-tab")
					|Files
			v-tabs-items(v-model="tabs")
				v-tab-item(key="videos-tab")
					//Videos
					v-data-table.general-datatable.videos-datatable(:headers="videoTableHeaders", :items="videoFiles")
						//template(v-slot:item.description="{ item }")
							.snapshot
								img.video-snapshot(:src="item.snapshot")
								.snapshot-title
									|{{ item.title }}
								.snapshot-description
									|{{ item.description }}
						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:MM") }} hrs.
						template(v-slot:item.user="{ item }")
							v-tooltip(top)
								template(v-slot:activator="{ on }")
									img.owner-thumbnail(:src="item.user.pictureURL || '/assets/icons/avatar_male.svg'", v-on="on")
									span.owner-name
										|{{ item.user.name }}
								span
									|{{ item.user.name }}
						template(v-slot:item._id="{ item }")
							.actions(v-if="!item.sent && item.relationship && item.relationship.allowLegacy === true ")
								v-icon.elevation-0.white-btn-text(color="gray", @click="showEditor( item )", tile, size="20")
									|mdi-pencil
							.actions.video-actions(v-if="!item.user.dead && !item.sent")
								v-icon.white-btn-text.elevation-0(color="gray", @click="sendFile( item )", tile, size="20")
									|mdi-send

				v-tab-item(key="audios-tab")
					//Audios
					v-data-table.general-datatable.audios-datatable(:headers="audioTableHeaders", :items="audioFiles")
						//template(v-slot:item.description="{ item }")
							.snapshot
								.snapshot-title
									|{{ item.title }}
								.snapshot-description
									|{{ item.description }}
						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:MM") }} hrs.
						template(v-slot:item.user="{ item }")
							v-tooltip(top)
								template(v-slot:activator="{ on }")
									img.owner-thumbnail(:src="item.user.pictureURL || '/assets/icons/avatar_male.svg'", v-on="on")
								span
									|{{ item.user.name }}
						template(v-slot:item._id="{ item }")
							.actions(v-if="!item.sent && item.relationship && item.relationship.allowLegacy === true ")
								v-icon.elevation-0.white-btn-text(color="gray", @click="showEditor( item )", tile, size="20")
									|mdi-pencil
							.actions.audio-actions(v-if="!item.user.dead && !item.sent")
								v-icon.white-btn-text.elevation-0(color="gray", @click="sendFile( item )", tile, size="20")
									|mdi-send
				v-tab-item(key="files-tab")
					//Others
					v-data-table.general-datatable.others-datatable(:headers="otherTableHeaders", :items="otherFiles")
						//template(v-slot:item.description="{ item }")
							.snapshot
								.snapshot-title
									|{{ item.title }}
								.snapshot-description
									|{{ item.description }}
						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:MM") }} hrs.
						template(v-slot:item.user="{ item }")
							v-tooltip(top)
								template(v-slot:activator="{ on }")
									img.owner-thumbnail(:src="item.user.pictureURL || '/assets/icons/avatar_male.svg'", v-on="on")
								span
									|{{ item.user.name }}
						template(v-slot:item._id="{ item }")
							.actions(v-if="!item.sent && item.relationship && item.relationship.allowLegacy === true ")
								v-icon.elevation-0.white-btn-text(color="gray", @click="showEditor( item )", tile, size="20")
									|mdi-pencil
							.actions(v-if="!item.user.dead && !item.sent")
								v-icon.white-btn-text.elevation-0(color="gray", @click="sendFile( item )", tile, size="20")
									|mdi-send

		//Add recipient									
		v-dialog(content-class="recipient-editor", v-model="showRecipientEditor", persistent, max-width="500")
			v-card
				v-card-title
					|Add contact
				v-card-text
					v-form(ref="recipientForm")
						v-text-field(
							append-icon="mdi-account",
							v-model="newRecipient.name",
							label="Name",
							:rules="form.validations.required",
							outlined,
							background-color="transparent",
							required)
						v-text-field(
							append-icon="mdi-account",
							v-model="newRecipient.email",
							label="Email",
							:rules="form.validations.email",
							outlined,
							background-color="transparent",
							required)
				v-card-actions
					v-spacer
					v-btn.elevation-0(color="primary", @click="showRecipientEditor = false", text, tile)
						|Close
					v-btn.elevation-0(color="primary", :loading="status.recipientLoading", @click="addRecipient", tile)
						|Add contact
					v-spacer
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		data() {
			return {
				tabs: null,
				status: {
					loading: false,
					saving: false,
					recipientLoading: false
				},
				showRecipientEditor: false,
				editTitle: "",
				editFile: {},
				newRecipient: {},
				form: {
					validations: {
						required: [
				        	v => !!v || 'This field is required',
				      	],
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
				      	],
					}
				},
				showEdit: false,
				currentFile: {},
				videoTableHeaders: [
					//{ text: "File", value: "description" },
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description"},
					{ text: "Additional notes", value: "relationship.notes" },
					{ text: "Uploaded at", value: "createdAt" },
					{ text: "Owner", value: "user" },
					//{ text: "Uploaded To", value: "category" },
					{ text: "Actions", value: "_id", align: "center" },
				],
				audioTableHeaders: [
					//{ text: "File", value: "description" },
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description"},
					{ text: "Additional notes", value: "relationship.notes" },
					{ text: "Uploaded at", value: "createdAt" },
					{ text: "Owner", value: "user" },
					//{ text: "Uploaded To", value: "category" },
					{ text: "Actions", value: "_id", align: "center" },
				],
				otherTableHeaders: [
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description"},
					{ text: "Additional notes", value: "relationship.notes" },
					{ text: "Uploaded at", value: "createdAt" },
					{ text: "Owner", value: "user" },
					//{ text: "Uploaded To", value: "category" },
					{ text: "Actions", value: "_id", align: "center" },
				]
			}
		},
		computed: {
			videoFiles: function(){
				let files = this.$store.getters.files

				let videos = []
				
				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "video" )
						videos.push( files[ i ] )

				return videos
			},
			audioFiles: function(){
				let files = this.$store.getters.files
				let audios = []
				
				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "audio" )
						audios.push( files[ i ] )

				return audios
			},
			otherFiles: function(){
				let files = this.$store.getters.files
				let other = []

				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "other" )
						other.push( files[ i ] )
				return other
			},
			loadingFiles: function(){
				return this.$store.getters.gettingFiles
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
		filters: {
			sizeMB: function( value ){
				if( value >= 0 && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			}
		},
		activated() {
			if( this.$route.query.tab ){
				switch( this.$route.query.tab ){
					case "videos":
						this.tabs = 0
						break
					case "audios":
						this.tabs = 1
						break
					case "files":
						this.tabs = 2
						break
				}
			}
		},
		methods: {
			sendFile: function( file ) {

				let status, error
				this.$swal({
					title: `¿Do you want to send ${file.title}?`,
					text: "This file will be sent to the recipients defined by the owner and it can not be undone",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes, send it",
					cancelButtonText: "Cancel",
					reverseButtons: true,
					showLoaderOnConfirm: true,
					preConfirm: () => {

						let sendFileURL = this.baseApi + this.env + "legacy/send-file/" + file._id
						return this.axios.get( sendFileURL )
						.then( response => {
							console.log(response.data )
						})
						.catch( err => {
							console.log( err )
							status = err.response.status
							error  = err.response.data
						})
					}
				})
				.then(result => {
				  	if( result.value ) {
				  		console.log( status )
						if( status == 403 )
							this.$swal("You are not allowed to perform this action", "It might be that the file has already been sent", "error")
						else if( status == 404 ){
							this.$swal("No contacts found", "This file doesn't have any configured recipients", "warning")
						}
						else if( status == 500 ){
							this.$swal("Error", JSON.stringify(error), "error")
						}else{
				  			this.$swal("Done!", `${file.title} has been sent`, "success")
				  			file.sent = true
				  			this.$store.commit("updateFile", file)
						}
				  	}
				})
			},
			showEditor: function( file ) {
				this.newRecipient = {}

				this.showRecipientEditor = true
				this.editFile = file
			},
			addRecipient: function() {
				if( this.$refs.recipientForm.validate() ){
					
					this.status.recipientLoading = true

					const contact = {
						name: this.newRecipient.name,
						email: this.newRecipient.email,
					}
					const fileId = this.editFile._id
					const url = this.baseApi + this.env + "files/" + fileId + "/add-recipient"

					return this.axios.post( url, contact )
					.then( response => {
						this.newRecipient = {}
						this.editFile = {}
						this.showRecipientEditor = false
						this.$swal("Done!", "The recipient has been added successfully.", "success")
					})
					.catch( err => {
						if( err.response ){
							if( err.response.status == 404 )
								this.$swal("Unauthorized", "You are not authorized by the owner to edit this file.", "warning")
							else{
								console.error( err )
								this.$swal("Something happened", "Please, try it again.", "error")
							}
						}else{
							console.error( err )
							this.$swal("Something happened", "Please, try it again.", "error")
						}
					})
					.finally( () => this.status.recipientLoading = false)
				}
			}
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.file-manager-panel
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
			padding-bottom: 0
			background-image: url('/assets/images/bg_file_manager_title.jpg')
			background-size: 100% 100%
			background-repeat: no-repeat
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
				margin-top: 20px
				margin-left: 40px
				color: white
		.v-tabs
			.v-tab
				max-width: none !important
				width: 33%
				font-weight: 800
				&.v-tab--active
					box-shadow: 0px 0px 15px -10px black
		.content
			position: relative
			box-shadow: 4px 5px 8px -8px black
			.actions
				display: inline-block
				margin-right: 7px
				.v-btn__content
					font-family: Raleway
					font-size: 12px
					font-weight: 800
					color: white
					padding-left: 25px
					padding-right: 25px
				.v-btn__loader
					color: white
			.general-datatable
				.owner-thumbnail
					width: 35px
					height: 35px
					border-radius: 50%
					margin-top: 9px
				.owner-name
					vertical-align: top
					font-family: Raleway
					font-weight: 700
					font-size: 10pt
					margin-top: 15px
					margin-left: 5px
					display: inline-block
			.videos-datatable
				.snapshot
					position: relative
					padding: 5px
					padding-left: 55px
					.video-snapshot
						position: absolute
						left: 0
						top: 0
						bottom: 0
						margin-top: auto
						margin-bottom: auto
						width: 45px
					.snapshot-title
						font-family: Raleway
						font-size: 12pt
						font-weight: 600
						margin-bottom: -6px
					.snapshot-description
						font-size: 10pt
						font-weight: 500
						margin-top: -6px
				.table-contact-image
					display: inline-block
					width: 28px
					height: 28px
					border-radius: 50%
					margin-right: 5px
					&.isLegacy
						box-shadow: 2px 2px 2px #a56c05
			.audios-datatable
				.snapshot
					position: relative
					padding: 5px
					padding-left: 0px
					.snapshot-title
						font-family: Raleway
						font-size: 12pt
						font-weight: 600
						margin-bottom: -6px
					.snapshot-description
						font-size: 10pt
						font-weight: 500
						margin-top: -6px
				.table-contact-image
					display: inline-block
					width: 28px
					height: 28px
					border-radius: 50%
					margin-right: 5px
					&.isLegacy
						box-shadow: 2px 2px 2px #a56c05
			.others-datatable
				.snapshot
					position: relative
					padding: 5px
					padding-left: 0px
					.snapshot-title
						font-family: Raleway
						font-size: 12pt
						font-weight: 600
						margin-bottom: -6px
					.snapshot-description
						font-size: 10pt
						font-weight: 500
						margin-top: -6px
				.table-contact-image
					display: inline-block
					width: 28px
					height: 28px
					border-radius: 50%
					margin-right: 5px
					&.isLegacy
						box-shadow: 2px 2px 2px #a56c05
	.file-editor-card
		.upload-subtitle
			font-family: Raleway
			font-size: 12pt
			font-weight: 700
			letter-spacing: 1px
			text-transform: uppercase
			padding-left: 15px
			margin-bottom: 15px
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
				.v-input__slot
					margin-bottom: 0
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
						font-size: 10pt

	@media only screen and (min-width: 1367px)
		.file-manager-panel
			.v-tabs
				border: 1px solid rgba(0, 0, 0, 0.1)
				.v-tab
					font-size: 14pt

	@media only screen and (min-width: 1921px)
		.file-manager-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.v-tabs
				border: 1px solid rgba(0, 0, 0, 0.1)
				.v-tab
					font-size: 17pt
			.videos-datatable
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
			.audios-datatable
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
			.others-datatable
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

		.file-editor-card
			.upload-subtitle
				font-size: 16pt
			.contacts-list
				.v-input--checkbox
					.contact-info
						.contact-picture
							img
								width: 35px
								height: 35px
						.contact-name
							font-size: 14pt
			input
				font-size: 16pt
			label
				font-size: 16pt
</style>