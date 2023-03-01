<template lang="pug">
	v-dialog(:content-class="dialogClass", max-width="900", persistent, :value="show")
		v-card.file-editor-card
			v-card-title
				|Forwarding file "{{ file.title }}"
			v-card-text
				v-form(ref="editFileForm")
					v-row
						v-col(md="6")
							v-card.mb-1.input-card.elevation-0(width="100%")
								v-card-text.pt-1(style="min-height:90px;")
									.required-dot
										|*
									v-text-field(
										v-model="newFile.title",
										label="Title",										
										background-color="white",
										:rules="form.validations.required",
										required)
						v-col(md="6")
							v-card.mb-1.input-card.elevation-0(width="100%")
								v-card-text(style="min-height:90px;")
									v-select.pt-1(
										v-model="newFile.topic",
										label="Select a Topic",
										:items="topicsOptionsS",
										background-color="white",
										hide-details,
										item-text="name",
										item-value="_id")
						v-col(md="12").py-0
							v-card.mb-1.input-card.elevation-0(width="100%")
								v-card-text
									.required-dot
										|*
									v-textarea.mt-2(
										v-model="newFile.description",
										label="Description",
										:rules="form.validations.required",
										rows="3",
										hide-details,
										dense,
										required)
				v-row
					v-col(md="6")
						v-card.elevation-0.groups-list-card
							v-card-text
								.contacts-list-title
									|Contacts
								.contacts-list
									v-checkbox(
										v-model="newFile.relationship.contacts",
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
							v-card-actions
								v-spacer
								v-btn(@click="redirectNewContact", color="#054fbd", text)
									|+ Add new contact
					v-col(md="6")
						v-card.elevation-0.groups-list-card
							v-card-text
								.contacts-list-title
									|Groups
								.contacts-list
									v-checkbox(
										v-model="newFile.relationship.groups",
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
							v-card-actions
								v-spacer
								v-btn(@click="redirectNewGroup", color="#054fbd", text)
									|+ Add new group
					v-col(md="12")
						v-row
							v-col(cols="12")
								p.title-send
									|SENDING FILE
								p.subtitle-send
									|How would you like your file to be sent?
								v-radio-group(v-model="newFile.relationship.type", :row="$vuetify.breakpoint.mdAndUp", :disabled="!!$route.query.event")
									v-radio(label="Send it now", value="now", color="#60A99E")
									v-radio(label="Add to calendar", value="event", color="#60A99E", @change="status.show.calendar = true", @click.native="status.show.calendar = true")
									v-radio(label="To be sent by my legacy contact", value="legacy", color="#60A99E")

							v-col.pt-0(cols="12", v-show="newFile.relationship.type == 'legacy'")
								v-card.mb-3.input-card.elevation-0(width="100%")
									v-card-text
										.required-dot
											|*
										v-textarea(
											v-model="newFile.relationship.notes",
											label="Additional note",
											placeholder="Add a note to the legacy contacts",
											background-color="white",
											required)
								v-checkbox.permission-checkbox(v-model="newFile.relationship.allowLegacy")
									template(v-slot:label)
										div
											|Allow my legacy contacts to add contacts
											v-tooltip(top)
												template(v-slot:activator="{ on }")
													v-icon.ml-1(v-on="on")
														|mdi-help-circle
												|This means that your legacy contacts will be able to add additional contacts so they also will get the file when it is sent.
			v-card-actions
				v-spacer
				v-btn(small, color="#b54f4e", @click="$emit('close')", dark, tile)
					|Close
				v-btn(small, color="#1043a3", @click="updateFile", dark, tile, :loading="status.loading")
					|Done
				v-spacer
			.pt-5

		.upload-file-calendar(v-show="status.show.calendar")
			.outter-container(:style="fixedWidth")
				.inner-container
					scheduler(v-model="event", @cancel="status.show.calendar = false, file.relationship.type = 'now'", @close="status.show.calendar = false", from="upload", ref="scheduler")
</template>

<script>
	import Scheduler from "@/components/dashboard/elements/Scheduler.vue"

	export default {
		props: ["value", "show"],
		data() {
			return {
				file: this.value,
				newFile: {
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
				event: {},
				status: {
					loading: false,
					show: {
						calendar: false
					},
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
			topicsOptionsS: function(){
				let topics = this.$clone(this.$store.getters.topics)
				topics.unshift({_id: "", name: "No topic"})
				return topics
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

			},
			dialogClass: function() {
				if( this.status.show.calendar )
					return "file-editor-dialog overflow-hidden"
				else
					return "file-editor-dialog"
			}
		},
		methods: {
			updateFile: function() {
				if( this.$refs.editFileForm.validate() ){
					if(this.newFile.relationship.type=="legacy"){
						if((this.newFile.relationship.allowLegacy==="undefined" || !this.newFile.relationship.allowLegacy) && this.newFile.relationship.contacts.length === 0 && this.newFile.relationship.groups.length === 0){
							this.$swal({
								title: "Error",
								text: "You need to add a contact or allow it to your legacy contacts",
								type: "error",
							})
							return
						}							
					}
					this.status.loading = true
					let body = {
						file: this.file
					}
					
					body.file.title = this.newFile.title
					body.file.description = this.newFile.description
					body.file.relationship = this.newFile.relationship

					if( this.newFile.topic )
						body.file.topic = this.newFile.topic

					if( this.event.name && this.event.date ){
						body.event = this.event
						body.file.relationship.eventDate = this.event.date
					}
					
					//Send file now
					if( this.newFile.relationship.type == "now")
						body.event = {
							name: " ",
							date: new Date(2000, 0, 1),
							time: "00:00",
						}

					let url = this.baseApi + this.env + "files/" + this.file._id + "/full"

					console.log( url, body )

					this.axios.put(url, body)
					.then(response => {
						this.$swal("Done!", "The file was saved successfully", "success")
						
						this.$emit("forward", response.data.file)

						if( response.data.event)
							this.$emit("schedule", response.data.event)
					})
					.catch( err => {
						console.log( err )
						this.$swal("Something went wrong!", "Please try it again.", "error")
					})
					.finally(() => {
						this.status.loading = false
					})
				}
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
			redirectNewContact: function() {
				this.$emit('close')
				this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newContact: "true", from: "filemanager"}})
			},
			redirectNewGroup: function() {
				this.$emit('close')
				this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newGroup: "true", from: "filemanager"}})
			},
		},
		components: {
			Scheduler
		}
	}
</script>

<style lang="sass">
	.overflow-hidden
		overflow: hidden !important
	.file-editor-dialog
		.upload-file-calendar
			position: fixed
			left: 0
			top: 0
			bottom: 0
			right: 0
			z-index: 100
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
		.file-editor-card
			.groups-list-card
				min-height: 265px						
			.v-card__title
			.v-card__text

				.title-send
					font-family: Raleway
					font-size: 20px
					font-weight: 700
					margin-bottom: 0
				.subtitle-send
					font-family: Raleway
				.permission-checkbox.v-input--checkbox
					.v-label
						&>div
							padding-top: 5px !important
			.v-card__actions
				.v-btn
					font-weight: 600
					font-family: Raleway
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
							font-size: 14px
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
							&:before,&:after
								display: none

					.v-textarea
						font-size:18px
						.v-input__slot
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
			.contacts-list-title
				padding-bottom: 7px
				font-family: Raleway
				font-weight: 800
				font-size: 1.2rem
				letter-spacing: 1px
				text-transform: uppercase
			.contacts-list
				overflow-y: auto
				min-height: 150px
				max-height: 150px

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
</style>