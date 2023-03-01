<template lang="pug">
	.upload-file-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_upload_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_upload.svg")
				td
					.subsection-title
						|{{ $t('upload-header-title') }}
				td
					.subsection-description
						|{{ $t('upload-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_upload_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_upload.svg")
			.subsection-title
				|{{ $t('upload-header-title') }}
			.subsection-description
				|{{ $t('upload-header-description') }}

		.media-library-bar
			.text
				|{{ $t('text-upload-media') }}
		.content
			.drag-and-drop-container
				drag-and-drop(ref="drgdrp", id="drgdrp", :options="dragAndDrop", v-on:vdropzone-sending="beforeUpload", v-on:vdropzone-complete="updateView")
				progress-viewer(:progress="status.uploadProgress")

			v-row(v-show="status.uploading")
				v-col.text-center(cols="12")
					v-progress-circular(indeterminate, color="primary")

			v-row(v-show="file.tmpInfo.name")
				v-col(cols="12")
					.file-info.mobile
						.file-info-title
							|{{$t('text-file-info')}}

						.data(v-if="file.tmpInfo.type")
							p(v-show="file.tmpInfo.size")
								span.data-title
									|{{$t('text-file-size')}}:&nbsp;
								span.data-value
									|{{ file.tmpInfo.size | sizeMB }} MB.
			.media-library-bar
				.text
					|{{$t('text-file-description')}}
			v-row
				v-col.pb-0(cols="12", md="6", :class="{'pb-0': $vuetify.breakpoint.smAndDown}")
					v-form(ref="fileInfo")

						v-card.mb-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-text-field(
									v-model="file.title",
									:label="$t('input-select-title')",
									maxlength="50",
									:placeholder="$t('input-select-title-des')",
									background-color="white",
									:rules="form.validations.required",
									required)

						v-card.mb-3.input-card.elevation-0(width="100%")
							v-card-text
								.required-dot
									|*
								v-textarea(
									v-model="file.description",
									maxlength="140",
									:label="$t('input-select-descrition')",
									:placeholder="$t('input-select-descrition-des')",
									background-color="white",
									:rules="form.validations.required",
									required)
						v-card.mb-3.input-card.select-card.elevation-0(width="100%")
							v-card-text
								v-select(v-model="file.topic", :label="$t('input-select-topic')", :items="topicsOptions", background-color="white", item-text="name", item-value="_id")
								.text-right 
									v-btn(@click="redirectNewTopic", color="#054fbd", text)
										|{{$t('buttom-add-topic')}}
					v-row
						v-col(cols="12")
							p.title-send
								|{{$t('text-sending-file')}}
							p.subtitle-send
								|{{$t('text-how-would')}}
							v-radio-group(v-model="file.relationship.type", :row="$vuetify.breakpoint.mdAndUp", :disabled="!!$route.query.event")
								v-radio(:label="$t('buttom-send-it')", value="now", color="#60A99E")
								v-radio(:label="$t('buttom-add-to')", value="event", color="#60A99E", @change="show.calendar = true", @click.native="show.calendar = true")
								v-radio(:label="$t('buttom-to-be-sent')", value="legacy", color="#60A99E")

						v-col.pt-0(cols="12", v-show="file.relationship.type == 'legacy'")
							v-card.mb-3.input-card.elevation-0(width="100%")
								v-card-text
									.required-dot
										|*
									v-textarea(
										v-model="file.relationship.notes",
										:label="$t('input-select-title-des')",
										:placeholder="$t('input-select-descrition-des')",
										background-color="white",
										required)
							v-checkbox.permission-checkbox(v-model="file.relationship.allowLegacy")
								template(v-slot:label)
									div
										|{{$t('buttom-alloy-my-legacy')}}
										v-tooltip(top)
											template(v-slot:activator="{ on }")
												v-icon.ml-1(v-on="on")
													|mdi-help-circle
											|{{$t('text-this-meand')}}


				v-col(cols="12", md="6", :class="{'pt-0': $vuetify.breakpoint.smAndDown}")
					v-row
						v-col.pt-0(cols="12", md="6")
							v-expansion-panels(flat)
								v-expansion-panel.contact-group-selector
									v-expansion-panel-header
										|{{$t('input-select-groups')}}
									v-expansion-panel-content
										v-card.elevation-0
											v-card-text
												.contacts-list
													v-checkbox(
														v-model="file.relationship.groups",
														v-for="(group, index) in groups",
														:value="group._id",
														:color="getRowColor( index )",
														:class="getRowClass( index )",
														:key="group._id")

														template(v-slot:label)
															.contact-info
																.contact-picture
																	img(v-if="group.pictureURL === '/assets/icons/avatar-groups_bg.svg'" src="/assets/icons/avatar_groups_cuadrado.svg")
																	img(v-else :src="group.pictureURL")
																.contact-name
																	|{{ group.name }}
												.empty-label(v-if="groups.length == 0")
													|{{$t('text-dont-groups')}}
											v-card-actions
												v-spacer
												v-btn(@click="redirectNewGroup", color="#054fbd", text)
													|{{$t('buttom-add-group')}}
						v-col.pt-0(cols="12", md="6")
							v-expansion-panels(flat)
								v-expansion-panel.contact-group-selector
									v-expansion-panel-header
										|{{$t('input-select-contacts')}}
									v-expansion-panel-content
										v-card.elevation-0
											v-card-text
												.contacts-list
													v-checkbox(
														v-model="file.relationship.contacts",
														v-for="(contact, index) in contacts",
														:value="contact._id",
														:color="getRowColor( index )",
														:class="getRowClass( index )",
														:key="contact._id")

														template(v-slot:label)
															.contact-info
																.contact-picture
																	img(v-if="contact.pictureURL === '/assets/icons/avatar-generic_bg.svg'" src="/assets/icons/avatar_generico_bg_cuadrado.svg")
																	img(v-else :src="contact.pictureURL")
																.contact-name
																	|{{ contact.name }}
												.empty-label(v-if="contacts.length == 0")
													|{{$t('text-dont-contacts')}}
											v-card-actions
												v-spacer
												v-btn(@click="redirectNewContact", color="#054fbd", text)
													|{{$t('buttom-add-contact')}}

					v-row
						v-col(cols="12")
							.file-info
								.action-buttons
									v-btn.mr-1.ml-1.elevation-0(
										color="red darken-2",
										raised,
										:disabled="!file.tmpInfo.type",
										@click="reset")
										|{{$t('buttom-delete')}}
									v-btn.done-button.mr-1.ml-1.elevation-0(
										color="#2963b4",
										:disabled="!file.tmpInfo.type",
										:loading="status.saving",
										raised,
										@click="updateFile")
										|{{$t('buttom-done')}}

		.upload-file-calendar(v-show="show.calendar")
			.outter-container(:style="fixedWidth")
				.inner-container
					scheduler(v-model="event", @cancel="show.calendar = false, file.relationship.type = 'now'", @close="show.calendar = false", @update="updateCalendar", from="upload", ref="scheduler")
</template>

<script>
	import vue2Dropzone from "vue2-dropzone"
	import ProgressViewer from "@/components/dashboard/elements/tools/ProgressViewer.vue"
	import Scheduler from "@/components/dashboard/elements/Scheduler.vue"
	export default {
		data() {
			return {
				tabs: null,
				status: {
					loading: false,
					uploading: false,
					saving: false,
					deleting: false,
					uploadProgress: 0,
				},
				event: {
				},
				show: {
					calendar: false
				},
				file: {
					tmpInfo: {
						name: "",
						lastModified: null,
						size: 0,
						type: null,
						width: 0,
						height: 0,
					},
					relationship: {
						type: "now", // "event", "legacy",
						contacts: [],
						groups: [],
						eventDate: null,
						sentDate: null,
					},
					title: "",
					description: "",
					groups: [],
					contacts: []
				},
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
			this.preloadEvent()
		},
		activated: function(){
			this.preloadEvent()
		},
		methods: {
			preloadEvent: function() {
				this.status.uploadProgress = 0
				if(this.$route.query.keep){
					if(this.$route.query.contact)
						this.file.contacts.push(this.$route.query.contact)
					if(this.$route.query.event){
						this.event.name = this.$route.query.eventName
						this.event.date = new Date(this.$route.query.eventDate)
						this.event.time = this.$route.query.eventTime						
						//Adjust Date time
						let hh = this.event.time.split(":")[0]
						let mm = this.event.time.split(":")[1]

						this.event.date.setHours(Number( hh ))
						this.event.date.setMinutes(Number( mm ))

						this.event.date.setDate( this.event.date.getDate() + 1)

						this.file.relationship.type = "event"						
					}
				}
			},
			updateFile: function() {				
				if( this.$refs.fileInfo.validate() ){
					if(this.file.relationship.type=="legacy"){
						if((this.file.relationship.allowLegacy==="undefined" || !this.file.relationship.allowLegacy) && this.file.relationship.contacts.length === 0 && this.file.relationship.groups.length === 0){
							this.$swal({
								title: "Error",
								text: "You need to add a contact or allow it to your legacy contacts",
								type: "error",
							})
							return
						}							
					}
					this.status.saving = true
					let body = {
						file: {
							tmpPath:    this.file.tmpInfo.tmpPath,
							size:       this.file.tmpInfo.size,
							name:       this.file.tmpInfo.name,
							fileType:   this.file.tmpInfo.type,
							title:      this.file.title,
							description:this.file.description,
							relationship: this.file.relationship,
						}
					}

					if( this.file.topic )
						body.file.topic = this.file.topic

					if( this.event.name && this.event.date ){
						body.event = this.event
						body.file.relationship.eventDate = this.event.date
					}
					
					//Send file now
					if( this.file.relationship.type == "now"){					
						body.file.relationship.eventDate=null
						body.event = {
							name: " ",
							date: new Date(2000, 0, 1),
							time: "00:00",
						}
					}					
					let url = this.baseFS + "upload/file"
					let fileId
					
					this.axios.post(url, body)
					.then(response => {

						if( response.data.event )
							this.$store.commit("addEvent", response.data.event)
						
						fileId = response.data.file._id

						
						//Replaces Topics id with name
						response.data.file.topic = this.getTopicById(response.data.file.topic)
						this.$store.commit("addFile", response.data.file)
						
						return this.$swal("Done!", "The file was saved successfully", "success")
					})
					.then(() => {
						this.$refs.scheduler.reset()	
						this.reset()

						if( this.$route.query.returnable && this.$route.query.keep)
							this.$router.push({path: '/dashboard/calendar' })
						else
							this.$router.push({path: "/dashboard/file-manager"})
					})
					.catch( err => {
						console.log( err )
					})
					.finally(() => {
						this.status.saving = false
					})
				}
			},
			getBrowser: function() {
				var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

				// Firefox 1.0+
				var isFirefox = typeof InstallTrigger !== 'undefined';

				// Safari 3.0+ "[object HTMLElementConstructor]" 
				var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

				// Internet Explorer 6-11
				var isIE = /*@cc_on!@*/false || !!document.documentMode;

				// Edge 20+
				var isEdge = !isIE && !!window.StyleMedia;

				// Chrome 1 - 79
				var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

				// Edge (based on chromium) detection
				var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

				if( isOpera )
					return "opera"
				else if( isFirefox )
					return "firefox"
				else if( isSafari )
					return "safari"
				else if( isIE )
					return "ie"
				else if( isEdge )
					return "edge"
				else if( isChrome )
					return "chrome"
				else
					return "edgechromium"

			},
			beforeUpload: function(file, xhr, formData){
				let token = localStorage.getItem('token')
				xhr.setRequestHeader("Authorization", `Bearer ${ token }`)
			},
			updateView: function(file){
				this.file.tmpInfo.name          = file.name
				this.file.tmpInfo.lastModified  = new Date( file.lastModified )
				this.file.tmpInfo.size          = file.size
				this.file.tmpInfo.type          = file.type
				this.file.tmpInfo.width         = file.width
				this.file.tmpInfo.height        = file.width
			},
			calendarRadioFired: function(value) {},
			updateCalendar: function(info){

			},
			redirectNewGroup: function() {
				this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newGroup: "true", from: "upload"}})
			},
			redirectNewContact: function() {
				this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newContact: "true", from: "upload"}})
			},
			redirectNewTopic: function(){
				this.$router.push({path: '/dashboard/topics',query: {returnable: "true", from: "upload"}})
			},
			getTopicById: function(id){
				let topics = this.topics
				for(let topic of topics)
					if( topic._id == id)
						return [topic]

				return ""
			},
			getContactsByGroupId: function(id){
				let groups = this.$store.getters.groups
				for(let group of groups){
					if( group._id == id)
						return group
				}
				return false
			},
            getRowColor: function( i ) {
            	let mod = i % 4
            	switch( mod ) {
                    case 0:
                        return "#60AB9D"
                    case 1:
                        return "#ab7c6c"
                    case 2:
                        return "#5a68a1"
                    case 3:
                        return "#608bab"
            	}
            },
            getRowClass: function( i ) {
            	let mod = i % 4
            	switch( mod ) {
                    case 0:
                        return {"row-1": true}
                    case 1:
                        return {"row-2": true}
                    case 2:
                        return {"row-3": true}
                    case 3:
                        return {"row-4": true}
            	}
            },
			reset: function(){
				this.file = {
					title: "",
					description: "",
					tmpInfo: {
						name: "",
						lastModified: null,
						size: 0,
						type: null,
						width: 0,
						height: 0,
					},
					groups: [],
					relationship: {
						type: "now", // "event", "legacy",
						contacts: [],
						eventDate: null,
						sentDate: null,
					}
				}
				
				this.$refs.drgdrp.removeAllFiles(true)
				this.$refs.fileInfo.reset()
			}
		},
		computed: {
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
				topics.unshift({_id: "", name: "No topic"})
				return topics
			},
			dragAndDrop: function() {

				let dragAndDropdText = "Drag your file here or click to upload"
				
				if( this.$vuetify.breakpoint.mdAndDown )
					dragAndDropdText = "Tap here to select a file"
			
				return {
					url: this.baseFS + "upload",
					thumbnailWidth: 150,
					maxFilesize: 1024,
					paramName: "file",
					timeout: 1000 * 180,
					chunking: true,
					forceChunking: true,
					previewTemplate: `<div class="dz-preview dz-file-preview dz-processing">
					   <div class="dz-image"><img data-dz-thumbnail=""></div>
					   <div class="dz-details">
					      <div class="dz-size"><span data-dz-size=""><strong>7.7</strong> MB</span></div>
					      <div class="dz-filename"><span data-dz-name="">nvidia-ampere-architecture-whitepaper.pdf</span></div>
					   </div>
					   <div class="dz-error-message"><span data-dz-errormessage=""></span></div>
					   <div class="dz-success-mark">
					      <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
					         <title>Check</title>
					         <defs></defs>
					         <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
					            <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
					         </g>
					      </svg>
					   </div>
					   <div class="dz-error-mark">
					      <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
					         <title>Error</title>
					         <defs></defs>
					         <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
					            <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
					               <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
					            </g>
					         </g>
					      </svg>
					   </div>
					</div>`,
					maxFiles: 1,
					uploadprogress: (file, progress, size) => {
						let total = file.size
						let current = size

						let percentage = Number( Math.floor( current * 100 / total ) )
						this.status.uploading = true
						
						if( percentage > 100 )
							percentage = 100
						
						this.status.uploadProgress = percentage
					},
					maxfilesexceeded: file => {
						this.$refs.drgdrp.removeFile( file )
						this.$swal("", "You can only handle one file at a time", "warning")
					},
					success: response => {
						let fileResponse = JSON.parse( response.xhr.responseText )
						this.file.tmpInfo.tmpPath = fileResponse.file.path
						this.status.uploading = false
					},
					dictDefaultMessage: dragAndDropdText
				}
			},
			fixedWidth: function() {
				if( this.$vuetify.breakpoint.width > 1904 )
					return { "padding-left": "450px", "padding-right": "450px" }
				else if( this.$vuetify.breakpoint.width <= 1904 && this.$vuetify.breakpoint.width > 1264)
					return { "padding-left": "150px", "padding-right": "150px" }
				else if( this.$vuetify.breakpoint.width <= 1264 && this.$vuetify.breakpoint.width > 960)
					return { "padding-left": "15px", "padding-right": "15px" }
				else if( this.$vuetify.breakpoint.width <= 960 && this.$vuetify.breakpoint.width > 600)
					return { "padding-left": "30px", "padding-right": "30px" }
				else
					return { "padding-left": "0px", "padding-right": "0px" }

			}
		},
		filters: {
			sizeMB: function( value ){
				if( value && typeof value == "number" )
					return parseFloat(value / 1000000).toFixed(2)
				else return ""
			}
		},
		components: {
			"drag-and-drop": vue2Dropzone,
			Scheduler,
			ProgressViewer,
		}
	}
</script>

<style lang="sass">
	.upload-file-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%

		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			background-color: #518982
			background-size: cover
			background-repeat: no-repeat
			overflow: hidden
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					margin-top: 10px
					margin-bottom: 10px
					vertical-align: middle
			.subsection-header-posticon
				position: absolute
				width: 150px
				bottom: -70px
				right: 15px
				opacity: 0.3

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 15px
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
				padding-left: 30px
				margin-top: 8px
				color: white
		.media-library-bar
			padding: 15px
			.text
				display: inline-block
				color: black
				font-family: Raleway
				font-size: 14pt
				font-weight: 700
				text-transform: uppercase
				vertical-align: top
				margin-top: 2px
				margin-right: 15px
		.content
			position: relative
			.drag-and-drop-container
				position: relative
				margin-bottom: 25px
				padding: 20px
				background-color: white
			.vue-dropzone
				text-align: center
				border: 2px dashed #e5e5e5 !important
			.file-info
				text-align: center
				.file-info-title
					color: black
					text-align: center
					font-family: Raleway
					font-size: 14pt
					font-weight: 700
					text-transform: uppercase
				.data
					margin-top: 15px
					margin-bottom: 15px
					p
						margin-top: 0
						margin-bottom: 0
						.data-title
							font-family: Raleway
							font-weight: 600
						.data-value
							font-family: Raleway
				.action-buttons
					text-align: center
			.title-send
				font-family: Raleway
				font-size: 20px
				font-weight: 700
				margin-bottom: 0
			.subtitle-send
				font-family: Raleway

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
					.v-select__slot
						label
							color: #032eb1
							letter-spacing: 1px
							text-transform: uppercase
							font-size: 14px
							font-family: Raleway
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
				&.select-card
					.v-card__text
						padding-top: 5px
			.permission-checkbox.v-input--checkbox
				.v-label
					&>div
						padding-top: 5px !important
			.v-input--radio-group
				margin-top: 0px
				.v-radio
					.v-input--selection-controls__ripple
						z-index: 10
			.action-buttons
				.v-btn
					.v-btn__content
						font-family: Raleway
						color: white
						font-weight: 700
				.done-button
					.v-btn__loader
						color: white
		.v-radio
			.v-input--selection-controls__ripple
				margin-left: 7px
		.upload-file-calendar
			position: fixed
			left: 0
			top: 0
			bottom: 0
			right: 0
			z-index: 100
			padding-top: 9vh
			.outter-container
				position: relative
				background-color: rgba(0, 0, 0, 0.4)
				height: 100%
				padding-top: 0px
				.inner-container
					border-radius: 25px
					top: 50%
					transform: translateY(-50%)
					position: relative
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
		.upload-subtitle
			font-family: Raleway
			font-size: 14pt
			font-weight: 700
			letter-spacing: 1px
			text-transform: uppercase
			padding-left: 15px
			margin-bottom: 15px

		.contacts-list
			.row-1
				&.v-input--checkbox
					&:hover
						background-color: rgba(96, 171, 157, 0.1)
			.row-2
				&.v-input--checkbox
					&:hover
						background-color: rgba(171, 124, 108, 0.1)
			.row-3
				&.v-input--checkbox
					&:hover
						background-color: rgba(90, 104, 161, 0.1)
			.row-4
				&.v-input--checkbox
					&:hover
						background-color: rgba(96, 139, 171, 0.1)

			.v-input--checkbox
				margin-top: 0px
				padding-top: 6px
				padding-bottom: 2px
				padding-left: 25px
				padding-right: 25px
				.v-messages
					display: none
				.v-input--selection-controls__input
					margin-top: 3px
				.v-input--selection-controls__ripple
					z-index: 10
					margin-top: 7px
					margin-left: 7px
				.contact-info
					.contact-picture
						display: inline-block
						float: left
						margin-left: 5px
						margin-right: 15px						
						overflow: hidden
						img							
							border-radius: 50%
							width: 30px
							height: 30px
					.contact-name
						display: inline-block
						float: left
						margin-top: 5px
						font-family: Raleway
						font-weight: 700
	@media only screen and (min-width: 1921px)
		.upload-file-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.media-library-bar
				.text
					font-size: 18pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
			.dropzone.dz-clickable
				.dz-message
					span
						font-size: 18pt
			.vue-dropzone
				&>.dz-preview
					.dz-details
						.dz-filename
							font-size: 18pt
			.content
				.vue-dropzone
				.file-info
					.file-info-title
						font-size: 18pt
					.data
						p
							.data-title
								font-size: 16pt
							.data-value
								font-size: 16pt
	@media only screen and (max-width: 960px)
		.upload-file-panel
			padding: 0
			padding-bottom: 25px
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
					img
						margin-top: 30px
				.subsection-title
					margin-top: 0
					margin-left: 0
					padding-left: 0
					display: block

			.content
				padding: 10px
				padding-bottom: 25px
			.upload-file-calendar
				padding-top: 56px
				.outter-container
					padding: 0
					.inner-container
						border-radius: 0
						height: 100%
</style>