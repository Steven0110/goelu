<template lang="pug">
	.file-manager-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_file_manager_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_file_manager.svg")
				td
					.subsection-title
						|{{ $t('filemanager-header-title') }}
				td
					.subsection-description
						|{{ $t('filemanager-header-description') }}
		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_file_manager_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_file_manager.svg")
			.subsection-title
				|{{ $t('filemanager-header-title') }}
			.subsection-description
				|{{ $t('filemanager-header-description') }}

		.media-library-bar.d-none.d-md-block
			.text
				|{{$t('file-manager-media')}}
			.media-library-button
				router-link(:to="{path: '/dashboard/upload'}")
					v-btn.elevation-0.white--text(
						color="#3f64d9",
						raised,
						@click="")
						|{{$t('buttom-add-file')}}
			.media-library-button
				router-link(:to="{path: '/dashboard/record', query: {tab: 'video'}}")
					v-btn.elevation-0.white--text(
						color="#3f64d9",
						raised,
						@click="")
						|{{$t('buttom-record-video')}}
			.media-library-button
				router-link(:to="{path: '/dashboard/record', query: {tab: 'audio'}}")
					v-btn.elevation-0.white--text(
						color="#3f64d9",
						raised,
						@click="")
						|{{$t('buttom-record-audio')}}
			.filters
				.filter-topic
					v-select(v-model="filter.topic", :label="$t('input-select-a-topic')", :items="topicsOptions", background-color="white", item-text="name", item-value="_id", solo)
				.filter-text
					v-text-field(v-model="filter.text", :label="$t('input-select-serach')", background-color="white", solo)
		.content
			loader(position="absolute", background="white", v-show="status.loading", image="/assets/icons/loading.gif")
			loader(position="absolute", background="transparent", v-show="loadingFiles", image="/assets/icons/loading.gif")

			//Descriptions modal
			v-dialog(v-model="descriptionDialog", max-width="500")
				v-card.description-card
					v-card-title.description-card-title
						|Descripción
					v-card-text
						.close-button
							v-btn(
								icon,
								color="black",
								absolute,
								right,
								top,
								@click="descriptionDialogText = '', descriptionDialog = false")
								v-icon
									|mdi-close
						.description-card-text
							|{{ descriptionDialogText }}

			//Editor Modal
			v-dialog(v-model="showEdit", max-width="700", content-class="file-editor-modal")
				v-card.file-editor-card
					v-card-title
						.card-title
							|Editing "{{editTitle}}"
					v-card-text
						v-form(ref="editFileForm")
							v-card.mb-3.input-card.elevation-0(width="100%")
								v-card-text
									.required-dot
										|*
									v-text-field(										
										v-model="currentFile.title",
										label="Title",										
										background-color="white",										
										:rules="form.validations.required",
										required)
							v-card.mb-3.input-card.elevation-0(width="100%")
								v-card-text
									.required-dot
										|*
									v-textarea.mt-2(
										v-model="currentFile.description",
										label="Description",
										:rules="form.validations.required",
										rows="3",
										dense,
										required)
							v-card.mb-0.input-card.elevation-0(width="100%")
								v-card-text
									v-select(
										v-model="currentFile.topic",
										label="Select a Topic",
										:items="topicsOptionsS",
										background-color="white",
										item-text="name",
										item-value="_id")

						v-row
							v-col(cols="6")
								v-expansion-panels(flat)
									v-expansion-panel.contact-group-selector
										v-expansion-panel-header
											|Contacts
										v-expansion-panel-content
											.contacts-list
												v-checkbox(
													v-model="currentFile.relationship.contacts",
													v-for="contact in contacts",
													:value="contact._id",
													color="#a44933",
													:key="contact._id")

													template(v-slot:label)
														.contact-info
															.contact-picture
																img(v-if="contact.pictureURL === '/assets/icons/avatar-generic_bg.svg'" src="/assets/icons/avatar_generico_bg_cuadrado.svg")
																img(v-else :src="contact.pictureURL")
															.contact-name
																|{{ contact.name }}
											.empty-label(v-if="contacts.length == 0")
												|No contacts found
							v-col(cols="6")
								v-expansion-panels(flat)
									v-expansion-panel.contact-group-selector
										v-expansion-panel-header
											|Groups
										v-expansion-panel-content
											.contacts-list
												v-checkbox(
													v-model="currentFile.relationship.groups",
													v-for="group in groups",
													:value="group._id",
													color="#a44933",
													:key="group._id")

													template(v-slot:label)
														.contact-info
															.contact-picture
																img(v-if="group.pictureURL === '/assets/icons/avatar-groups_bg.svg'" src="/assets/icons/avatar_groups_cuadrado.svg")
																img(v-else :src="group.pictureURL")
															.contact-name
																|{{ group.name }}
											.empty-label(v-if="groups.length == 0")
												|No groups found					
						v-alert(colored-border, type="warning", border="bottom",prominent)
							v-row(align="center")
								v-col( class="grow")
									|To modify the date, it is necessary to do it from the calendar
								v-col(class="shrink")
									v-btn.white--text(color="orange lighten-2" @click="redirectCalendar")
										|Go calendar	
					v-card-actions.editor-buttons
						v-spacer
						v-btn.elevation-0.white-btn-text(color="#F44336", @click="showEdit = false")
							|Close
						v-btn.elevation-0.white-btn-text(color="#2963b4", @click="updateFile", :loading="status.saving")
							|Save
						v-spacer
					.pt-5

			v-tabs(v-model="tabs", color="#E2A64E")
				v-tab(key="videos-tab")
					|Videos
				v-tab(key="audios-tab")
					|Audios
				v-tab(key="files-tab")
					|Files
			v-tabs-items.pb-sm-10.pb-14(v-model="tabs", touchless)
				v-tab-item(key="videos-tab")
					//Videos
					v-data-table.videos-datatable.datatable(:headers="videoTableHeaders", :items="videoFiles", :header-props="{sortByText: 'Sort by'}")
						template(v-slot:item.description="{ item }")
							span.clickable-description(@click="toggleDescription( item.description )")
								|{{ item.description | trimDescription }}

						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:mm") }} hrs.
						template(v-slot:item.relationship.eventDate="{ item }")
							span(v-if="item.relationship.eventDate")
								|{{ item.relationship.eventDate | moment("DD/MMM/YY HH:mm") }} hrs.
						template(v-slot:item.sent="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.sent")
								v-icon(color="white")
									|mdi-check-bold
						template(v-slot:item.relationship.type="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.relationship.type == 'legacy'")
								v-icon(color="white")
									|mdi-check-bold	
						template(v-slot:item.aux="{ item }")
							span(v-if="item.relationship && item.relationship.contacts")
								v-tooltip(top, v-for="contact in getContacts(item)", :key="contact._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="contact.pictureURL", :class="{isLegacy: contact.isLegacy}", v-on="on")
									span
										|{{ contact.name }}
							span(v-if="item.relationship && item.relationship.groups")
								v-tooltip(top, v-for="group in getGroups(item)", :key="group._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="group.pictureURL", v-on="on")
									span
										|{{ group.name }}
						template(v-slot:item._id="{ item }")
							.video-actions
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										a(:href="item.url")
											v-icon.mr-1(
												v-on="on",
												:small="small")
												|mdi-download
									span
										|Download video
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										router-link(:to="generateVideoURL(item.url)")
											v-icon.mr-1.ml-1(
												small,
												v-on="on",
												alt="View video",
												:small="small",
												@click="")
												|mdi-play
									span
										|View video
								v-tooltip(top, v-if="!item.sent")
									template(v-slot:activator="{ on }")
										v-icon.mr-1.ml-1(
											v-on="on",
											:small="small",
											@click="editItem(item)")
											|mdi-pencil
									span
										|Edit information
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-2(
											:small="small",
											v-on="on",
											@click="deleteItem(item)")
											|mdi-delete
									span
										|Delete video

				v-tab-item(key="audios-tab")
					//Audios
					v-data-table.audios-datatable.datatable(:headers="audioTableHeaders", :items="audioFiles")
						template(v-slot:item.description="{ item }")
							span.clickable-description(@click="toggleDescription( item.description )")
								|{{ item.description | trimDescription }}
								
						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:mm") }} hrs.
						template(v-slot:item.relationship.eventDate="{ item }")
							span(v-if="item.relationship.eventDate")
								|{{ item.relationship.eventDate | moment("DD/MMM/YY HH:mm") }} hrs.
						template(v-slot:item.sent="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.sent")
								v-icon(color="white")
									|mdi-check-bold
						template(v-slot:item.relationship.type="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.relationship.type == 'legacy'")
								v-icon(color="white")
									|mdi-check-bold	
						template(v-slot:item.aux="{ item }")
							span(v-if="item.relationship && item.relationship.contacts")
								v-tooltip(top, v-for="contact in getContacts(item)", :key="contact._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="contact.pictureURL", :class="{isLegacy: contact.isLegacy}", v-on="on")
									span
										|{{ contact.name }}
							span(v-if="item.relationship && item.relationship.groups")
								v-tooltip(top, v-for="group in getGroups(item)", :key="group._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="group.pictureURL", v-on="on")
									span
										|{{ group.name }}
						template(v-slot:item._id="{ item }")
							.audio-actions
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										a(:href="item.url", target="_blank")
											v-icon.mr-1(
												v-on="on",
												:small="small",)
												|mdi-download
									span
										|Download audio
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										router-link(:to="generateAudioURL(item.url)")
											v-icon.mr-1.ml-1(
												:small="small",
												v-on="on",
												alt="Play audio",
												@click="")
												|mdi-play
									span
										|Play audio
								v-tooltip(top, v-if="!item.sent")
									template(v-slot:activator="{ on }")
										v-icon.mr-1.ml-1(
											v-on="on",
											:small="small",
											@click="editItem(item)")
											|mdi-pencil
									span
										|Edit information
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-2(
											:small="small",
											v-on="on",
											@click="deleteItem(item)")
											|mdi-delete
									span
										|Delete audio
				v-tab-item(key="files-tab")
					//Others
					v-data-table.others-datatable.datatable(:headers="otherTableHeaders", :items="otherFiles")
						template(v-slot:item.description="{ item }")
							span.clickable-description(@click="toggleDescription( item.description )")
								|{{ item.description | trimDescription }}

						template(v-slot:item.size="{ item }")
							span
								|{{ item.size | sizeMB }} MB.
						template(v-slot:item.createdAt="{ item }")
							span
								|{{ item.createdAt | moment("DD/MMM/YY HH:mm") }} hrs.
						template(v-slot:item.relationship.eventDate="{ item }")
							span(v-if="item.relationship.eventDate")
								|{{ item.relationship.eventDate | moment("DD/MMM/YY HH:mm") }} hrs dd.
						template(v-slot:item.sent="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.sent")
								v-icon(color="white")
									|mdi-check-bold	
						template(v-slot:item.relationship.type="{ item }")
							v-btn.elevation-0(x-small, fab, color="success", v-if="item.relationship.type == 'legacy'")
								v-icon(color="white")
									|mdi-check-bold	
						template(v-slot:item.aux="{ item }")
							span(v-if="item.relationship && item.relationship.contacts")
								v-tooltip(top, v-for="contact in getContacts(item)", :key="contact._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="contact.pictureURL", :class="{isLegacy: contact.isLegacy}", v-on="on")
									span
										|{{ contact.name }}
							span(v-if="item.relationship && item.relationship.groups")
								v-tooltip(top, v-for="group in getGroups(item)", :key="group._id")
									template(v-slot:activator="{ on }")
										img.table-contact-image(:src="group.pictureURL", v-on="on")
									span
										|{{ group.name }}
						template(v-slot:item._id="{ item }")
							.others-actions

								v-tooltip(top)
									template(v-slot:activator="{ on }")
										a(:href="item.url", target="_blank")
											v-icon.mr-1(
												v-on="on",
												:small="small")
												|mdi-download
									span
										|Download file
								v-tooltip(top, v-if="item.isWord")
									template(v-slot:activator="{ on }")
										router-link(:to="generateDocURL(item.url)")
											v-icon.mr-1.ml-1(
												:small="small",
												v-on="on",
												alt="View document",
												@click="")
												|mdi-eye-outline
								v-tooltip(top, v-if="item.isPdf")
									template(v-slot:activator="{ on }")
										router-link(:to="generatePdfURL(item.url)")
											v-icon.mr-1.ml-1(
												:small="small",
												v-on="on",
												alt="View document",
												@click="")
												|mdi-eye-outline
								v-tooltip(top, v-if="item.isImage")
									template(v-slot:activator="{ on }")
										v-icon.mr-1.ml-1(
											:small="small",
											@click="show",
											alt="View image")
											|mdi-eye-outline
									span
										|View image
								v-tooltip(top, v-if="!item.sent")
									template(v-slot:activator="{ on }")
										v-icon.mr-1.ml-1(
											v-on="on",
											:small="small",
											@click="editItem(item)")
											|mdi-pencil
									span
										|Edit information
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1.ml-1(
											v-on="on",
											:small="small",
											@click="forwardItem(item)")
											|mdi-redo
									span
										|Forward file
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-2(
											:small="small",
											v-on="on",
											@click="deleteItem(item)")
											|mdi-delete
									span
										|Delete file
		.image-viewer
			.images.clearfix.d-none(ref="viewer", v-viewer="{rotatable: false, scalable: false, movable: true}")
				img(v-for="image in images", :src="image", :key="image")

		file-editor(v-model="currentFile", :show="showForward", @close="closeFileEditor", v-if="currentFile.title", @forward="forwarded", @schedule="scheduled")
</template>

<script>
	import FileEditor from "@/components/dashboard/elements/files/FileEditor.vue"
	import Loader from "@/components/misc/Loader.vue"
	
	export default {
		data() {
			return {
				tabs: null,
				status: {
					loading: false,
					saving: false
				},
				filter: {
					topic: false,
					text: ""
				},
				descriptionDialog: false,
				descriptionDialogText: "",
				editTitle: "",
				form: {
					validations: {
						required: [
				        	v => !!v || 'This field is required',
				      	]
					}
				},
				showEdit: false,
				showForward: false,
				currentFile: {
					relationship: {}
				},
				videoTableHeaders: [
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description" },
					{ text: "Topic", value: "topic[0].name" },
					{ text: "Date", value: "createdAt" },
					{ text: "Scheduled at", value: "relationship.eventDate" },
					{ text: "Size", value: "size" },
					{ text: "Sent?", value: "sent", align: "center" },
					{ text: "Legacy Manager", value: "relationship.type", sortable: false },
					{ text: "Contacts", value: "aux", sortable: false },
					{ text: "Actions", value: "_id", sortable: false },
				],
				audioTableHeaders: [
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description" },
					{ text: "Topic", value: "topic[0].name" },
					{ text: "Date", value: "createdAt" },
					{ text: "Scheduled at", value: "relationship.eventDate" },
					{ text: "Size", value: "size" },
					{ text: "Sent?", value: "sent", align: "center" },
					{ text: "Legacy Manager", value: "relationship.type", sortable: false },
					{ text: "Contacts", value: "aux", sortable: false },
					{ text: "Actions", value: "_id", sortable: false },
				],
				otherTableHeaders: [
					{ text: "Title", value: "title", align: "start" },
					{ text: "Description", value: "description" },
					{ text: "Topic", value: "topic[0].name" },
					{ text: "Date", value: "createdAt" },
					{ text: "Scheduled at", value: "relationship.eventDate" },
					{ text: "Size", value: "size" },
					{ text: "Sent?", value: "sent", align: "center" },
					{ text: "Legacy Manager", value: "relationship.type", sortable: false },
					{ text: "Contacts", value: "aux", sortable: false },
					{ text: "Actions", value: "_id", sortable: false },
				]
			}
		},
		computed: {
			videoFiles: function(){
				let files = this.$store.getters.files
				let videos = []
				
				if( this.filter.text )
					files = this.$clone( this.filterFilesByText( files, this.filter.text ) )

				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "video" ){
						if( (this.filter.topic && this.filter.topic != -1) ){
							if( files[ i ].topic[0] && files[ i ].topic[0]._id == this.filter.topic){
								videos.push( files[ i ] )
							}
						}else{
							videos.push( files[ i ] )
						}
					}

				return videos
			},
			audioFiles: function(){
				let files = this.$store.getters.files
				let audios = []
				
				if( this.filter.text )
					files = this.$clone( this.filterFilesByText( files, this.filter.text ) )
				
				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "audio" ){
						if( this.filter.topic && this.filter.topic != -1 ){
							if( files[ i ].topic[0] && files[ i ].topic[0]._id == this.filter.topic){
								audios.push( files[ i ] )
							}
						}else{
							audios.push( files[ i ] )
						}
					}

				return audios
			},
			otherFiles: function(){
				let files = this.$store.getters.files
				let other = []
				
				if( this.filter.text )
					files = this.$clone( this.filterFilesByText( files, this.filter.text ) )

				for( let i = 0 ; i < files.length ; i++ )
					if( files[ i ].type == "other" ){
						if( this.filter.topic && this.filter.topic != -1 ){
							if( files[ i ].topic[0] && files[ i ].topic[0]._id == this.filter.topic ){
								other.push( files[ i ] )
							}
						}else{
							other.push( files[ i ] )
						}
					}				
				return other
			},
			images: function() {
				const files = this.$store.getters.files

				let array = []

				for( let file of files ){
					if( file.isImage )
						array.push( file.url )
				}

				return array
			},
			loadingFiles: function(){
				return this.$store.getters.gettingFiles
			},
			contacts: function(){
				return this.$store.getters.contacts
			},
			groups: function(){
				return this.$store.getters.groups
			},
			topics: function(){
				return this.$store.getters.topics
			},
			topicsOptions: function(){
				let topics = this.$clone(this.$store.getters.topics)
				topics.unshift({_id: -1, name: "Any"})
				return topics
			},
			topicsOptionsS: function(){
				let topics = this.$clone(this.$store.getters.topics)
				topics.unshift({_id: "", name: "No topic"})
				return topics
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
			}
		},
		filters: {
			sizeMB: function( value ){
				if( value >= 0 && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			},
			trimDescription: function( value ) {
				if( value.length >= 70 )
					return value.substr(0, 30) + "..."
				else
					return value
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

			
			// Stored files
			this.$store.commit("setFilesStatus", true)
			this.$store.commit("setAnalyticsStatus", true)
			let filesURL = this.baseApi + this.env + "files"
			this.axios.get( filesURL )
			.then( response => {
				this.$store.commit("setFilesStatus", false)
				this.$store.commit("setFiles", response.data.files)
			})
			.catch( err => {
				if( err.response )
					if( err.response.status == 403 || err.response.status == 401)
						this.expireSession()
					else
						console.log( err )
				else
					console.log( err )
			})
			.finally(() => {
				this.$store.commit("setAnalyticsStatus", false)
			})
		},
		methods: {
			redirectCalendar(){
				this.showEdit = false
				this.$router.push({path: '/dashboard/calendar'})
			},
			show() {
				const viewer = this.$refs.viewer.$viewer
				viewer.show()
			},
			closeFileEditor: function() {
				this.showEdit = false
				this.showForward = false
				this.currentFile = {relationship: {}}
			},
			toggleDescription: function(description) {
				this.descriptionDialog = true
				this.descriptionDialogText = description
			},
			editItem: function( file ){				

				let item = this.$clone( file )

				if( !item.relationship.contacts || !item.relationship.contacts.length > 0)
					item.relationship.contacts = []

				if(item.topic.length >= 0 && item.topic[ 0 ] && item.topic[ 0 ]._id )
					item.topic = this.getTopicById( item.topic[ 0 ]._id )[ 0 ]


				this.currentFile = item
				this.editTitle = item.title
				this.showEdit = true
			},
			forwardItem: function( file ){		

				let item = this.$clone( file )

				if( !item.relationship.contacts || !item.relationship.contacts.length > 0)
					item.relationship.contacts = []

				if(item.topic.length >= 0 && item.topic[ 0 ] && item.topic[ 0 ]._id )
					item.topic = this.getTopicById( item.topic[ 0 ]._id )[ 0 ]


				this.currentFile = item
				this.editTitle = item.title
				this.showForward = true
			},
			deleteItem: function( item ){
				let message, title, proceed, okText
				let event = this.isFileInEvents( item )

				if( event && event.name != " " ){
					title = `This file belongs to the event \"${event.name}\"`
					message = "You must dissasociate this file from this event or delete the event to continue."
					okText = "Ok"
					proceed = false
				}else{
					title = `Do you want to delete ${item.title}?`
					message = "This action can't be undone"
					okText = "Yes, delete"
					proceed = true
				}

				this.$swal({
					title: title,
					text: message,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: okText,
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then(result => {
				  	if(result.value && proceed) {
				  		this.status.loading = true
						let url = this.baseApi + this.env + "files/" + item._id
				  		
				  		this.axios.delete( url )
				  		.then( result => {
				  			this.$store.commit("removeFile", item)
				  			this.$swal("Done!", item.title + " was deleted successfully", "success")
				  		})
				  		.catch( err => {
				  			console.log( err )
				  		})
				  		.finally(() => {
				  			this.status.loading = false
				  		})
				  	}
				})
			},
			forwarded: function(file){
				this.$store.commit("addFile", file)
				this.showForward = false
			},
			scheduled: function(event){
				this.$store.commit("addEvent", event)
			},
			updateFile: function(){

				if( this.$refs.editFileForm.validate() ){

					this.status.saving = true

					let url = this.baseApi + this.env + "files/" + this.currentFile._id + "/full"
					let body = {
						title: this.currentFile.title,
						description: this.currentFile.description,
						relationship: this.currentFile.relationship,
					}

					if( this.currentFile.topic ){
						if( this.currentFile.topic._id)
							body.topic = this.currentFile.topic._id
						else
							body.topic = this.currentFile.topic
					}

					this.axios.put(url, {file: body})
					.then(result => {
						this.showEdit = false
						this.showForward = false
						
						//Replace Topic id with name
						result.data.file.topic = this.getTopicById(result.data.file.topic)

						this.$store.commit("updateFile", result.data.file)
						this.$swal("Done!", "File updated successfully", "success")
					})
					.catch(err => {
						console.log( err )
					})
					.finally(() => {
						this.status.saving = false
					})

				}
			},
			getTopicById: function(id){
				let topics = this.topics
				for(let topic of topics)
					if( topic._id == id)
						return [topic]

				return ""
			},
			filterFilesByText: function( files, search ){
				let filtered = []
				for( let i = 0 ; i < files.length ; i++ )
					if( this.isFileMatched(files[ i ], search) )
						filtered.push( files[ i ] )

				return filtered
			},
			isFileMatched: function(file, search){
				if( file.title.toUpperCase().includes( search.toUpperCase() ) )
					return true
				if( file.description.toUpperCase().includes( search.toUpperCase() ) )
					return true
				return false
			},
			isFileInEvents: function(file){
				let events = this.$store.getters.events
				for( let i = 0 ; i < events.length ; i++ )
					for( let k = 0 ; k < events[ i ].files.length ; k++ )
						if(file._id == events[ i ].files[ k ])
							return events[ i ]
				return false
			},
			getAllowedContacts: function(file) {
				let accountContacts = this.contacts
				let contacts = []

				/*	Legacy Contacts */
				if( file.relationship &&  file.relationship.contacts )
					for( let i = 0 ; i < accountContacts.length ; i++ )
						for( let k = 0 ; k < file.relationship.contacts.length ; k++ )
							if( accountContacts[ i ]._id === file.relationship.contacts[ k ]){
								let aux = this.$clone( accountContacts[ i ] )
								aux.isLegacy = true
								contacts.push( aux )
							}

				//contacts = [...new Set(contacts)]
				contacts = [...new Map(contacts.map(item => [item["_id"], item])).values()]
				return contacts
			},
			getContacts: function(file) {
				let accountContacts = this.contacts
				let contacts = []

				/*	Legacy Contacts */
				if( file.relationship &&  file.relationship.contacts )
					for( let i = 0 ; i < accountContacts.length ; i++ )
						for( let k = 0 ; k < file.relationship.contacts.length ; k++ )
							if( accountContacts[ i ]._id === file.relationship.contacts[ k ]){
								let aux = this.$clone( accountContacts[ i ] )
								aux.isLegacy = true
								if(aux.pictureURL=="/assets/icons/avatar-generic_bg.svg")
									aux.pictureURL="/assets/icons/avatar-generic_bg.png"
								//console.log(aux.pictureURL)
								contacts.push( aux )
							}

				//contacts = [...new Set(contacts)]
				contacts = [...new Map(contacts.map(item => [item["_id"], item])).values()]				
				return contacts
			},
			getGroups: function(file) {
				let accountGroups = this.groups
				let groups = []

				/*	Legacy Contacts */
				if( file.relationship &&  file.relationship.groups )
					for( let i = 0 ; i < accountGroups.length ; i++ )
						for( let k = 0 ; k < file.relationship.groups.length ; k++ )
							if( accountGroups[ i ]._id === file.relationship.groups[ k ]){
								let aux = this.$clone( accountGroups[ i ] )
								if(aux.pictureURL=="/assets/icons/avatar-groups_bg.svg")
									aux.pictureURL="/assets/icons/avatar-groups_bg.png"
								//console.log(aux.pictureURL)
								//aux.isLegacy = true
								groups.push( aux )
							}

				//contacts = [...new Set(contacts)]
				groups = [...new Map(groups.map(item => [item["_id"], item])).values()]
				return groups
			},
			generateDocURL: function(url){
				let link = {path: "/dashboard/document-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generatePdfURL: function(url){
				let link = {path: "/dashboard/pdf-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generateImageURL: function(url){
				let link = {path: "/dashboard/image-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generateVideoURL: function(url){
				let link = {path: "/dashboard/video-viewer", query: {url: url, returnable: "true"}}
				return link
			},
			generateAudioURL: function(url){
				let link = {path: "/dashboard/audio-player", query: {url: url, returnable: "true"}}
				return link
			},
		},
		components: {
			FileEditor,
			Loader,
		}
	}
</script>

<style lang="sass">
	.file-editor-modal
		.v-input--selection-controls
			.v-input--selection-controls__input:hover
				.v-input--selection-controls__ripple
					&:before
						transform: scale(1.2) translateX(0px) !important
		.v-expansion-panel-content__wrap
			min-height: 200px
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
						padding-left: 0px
						padding-right: 0px
			.empty-label
				text-align: center

	.file-manager-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%


		.image-viewer
			display: none
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			background-color: #E2A64E
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					vertical-align: middle
			.subsection-header-posticon
				position: absolute
				width: 150px
				bottom: -25px
				right: 0
				opacity: 0.3

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				color: white
				margin-top: 5px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				margin-top: 8px
				padding-left: 30px
				color: white
		.media-library-bar
			padding: 15px
			position: relative
			.text
				display: inline-block
				color: black
				font-family: Raleway
				font-size: 14pt
				font-weight: 700
				text-transform: uppercase
				vertical-align: top
				margin-top: 5px
				margin-right: 15px
				line-height: 1.3
			.media-library-button
				display: inline-block
				margin-right: 15px
				a
					text-decoration: none
				.v-btn__content
					font-family: Raleway
					font-weight: 700
			.filters
				position: absolute
				top: 15px
				right: 15px
				.filter-topic
					display: inline-block
					margin-right: 10px
					.v-select
						margin-top: 0
						padding-top: 2px
						.v-text-field__details
							display: none
						.v-input__slot
							min-height: auto
							height: 37px
				.filter-text
					display: inline-block
					.v-text-field
						margin-top: 0
						padding-top: 2px
						.v-text-field__details
							display: none
						.v-input__slot
							min-height: auto
							height: 37px
		.v-tabs
			.v-tab
				max-width: none !important
				width: 33.3333%
				font-weight: 600
				&.v-tab--active
					box-shadow: 0px 0px 15px -10px black
		.content
			position: relative
			box-shadow: 4px 5px 8px -8px black
			clear: both
			.datatable

				tr
					&:nth-of-type(even)
						background-color: rgba(0, 0, 0, .03)
					.v-data-table__mobile-row
						&:last-child
							border: none !important
				.clickable-description
					&:hover
						cursor: pointer
			.videos-datatable
				.video-actions
					a
						text-decoration: none
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
					width: 32px
					height: 32px
					margin-top: 4px
					border-radius: 50%
					margin-right: 5px
					&.isLegacy
						//box-shadow: 2px 2px 2px #bbbbbb
			.audios-datatable
				.audio-actions
					a
						text-decoration: none
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
						//box-shadow: 2px 2px 2px #bbbbbb
			.others-datatable
				.others-actions
					a
						text-decoration: none
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
						//box-shadow: 2px 2px 2px #bbbbbb
	.viewer-canvas > img
		padding: 7px
		background-color: white
		border-radius: 6px
	.viewer-footer
		.viewer-title
			color: white !important
			font-size: 16px !important
	.file-editor-card
		background-color:	#f4f4f4 !important
		.card-title
			word-break: break-word
		.upload-subtitle
			font-family: Raleway
			font-size: 12pt
			font-weight: 700
			letter-spacing: 1px
			text-transform: uppercase
			padding-left: 15px
			margin-bottom: 15px		

		.input-card
			position: relative
			.required-dot
				position: absolute
				right: 15px
				top: 15px
				color: #DFA659
				font-size: 40px
			.v-card__text
				padding-bottom: 5px
				.v-select__slot
					label
						color: #032eb1
						letter-spacing: 1px
						text-transform: uppercase
						font-size: 15px
						font-family: Raleway						
				.v-text-field
					font-size:18px
					.v-input__slot
						&:before,&:after
							display: none
					.v-text-field__slot						
						label
							
							text-transform: uppercase
							letter-spacing: 1px
							color: #032eb1							
							font-family: Raleway
							font-size: 15px							
						&:before,&:after
							display: none
						input
							margin-top:10px

				.v-textarea
					font-size:18px
					.v-input__slot
						textarea
							margin-top:10px
						&:before,&:after
							display: none					
						
				.v-select
					.v-input__slot
						margin-bottom: 0
						&:before,&:after
							display: none
						svg
							color: #DFA659 !important
			&.select-card
				.v-card__text
					padding-top: 5px
		.contacts-list
			overflow-y: auto
			max-height: 200px

			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar
				width: 5px
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar-thumb
				background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, #3A6BD6),color-stop(0.72, #3954b0),color-stop(0.86, #3A6BD6))

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
	.description-card
		position: relative
		.description-card-title
			text-transform: uppercase
			letter-spacing: 1px
		.description-card-text
			padding-top: 25px
			font-family: Raleway
			font-size: 18px

	@media only screen and (min-width: 1367px)
		.file-manager-panel

	@media only screen and (min-width: 1921px)
		.file-manager-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.media-library-bar
				.text
					font-size: 18pt
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
	@media only screen and (max-width: 768px)
		.file-manager-panel
			padding: 0
			padding-bottom: 55px
			.subsection-header
				padding-left: 90px
				padding-bottom: 15px
				.subsection-description
					display: block
					margin-left: 0
					margin-top: 0
					padding-left: 0
				.subsection-header-icon
					position: absolute
					top: 0
					bottom: 0
					margin-top: auto
					margin-bottom: auto
					height: 75%
					left: 10px
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block

			.v-data-table
				.v-data-table__wrapper
					&::-webkit-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar-thumb
						background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, #DFA64D),color-stop(0.72, #DFA64D),color-stop(0.86, #ab813f))
				table
					width: 250%
					overflow-x: scroll
					margin-top: 50px
					thead
						tr
							th
								border-bottom: none !important
								&:first-child
									position: absolute
									top: 55px
									width: calc(100vw - 20px)

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
								&:nth-last-child(1)
									width: 200px
								&:nth-last-child(2)
									width: 150px
						tr
							&:first-child
								.v-data-table__mobile-row
									&:nth-last-child(2)
										.v-data-table__mobile-row__cell
											min-height: 38px
						tr
							.v-data-table__mobile-row
								.v-data-table__mobile-row__cell
									min-height: 38px
						tr.v-data-table__empty-wrapper
							text-align: left

					.snapshot
						padding-left: 0 !important
						text-align: center

					tbody
						tr
							width: 100%

							&:not(:first-child)
								.v-data-table__mobile-row__header
									display: none
	@media only screen and (max-width: 640px)
		.file-manager-panel
			.v-data-table
				table
					margin-top: 70px
					thead
						tr
							th
								&:first-child
									position: absolute
									top: 0px
									width: 100vw
	@media only screen and (max-width: 420px)
		.file-manager-panel
			.v-data-table
				.v-data-table__wrapper
				table
					width: 350% !important
					tbody
						tr
							.v-data-table__mobile-row
								&:nth-child(1)
									width: 150px
</style>