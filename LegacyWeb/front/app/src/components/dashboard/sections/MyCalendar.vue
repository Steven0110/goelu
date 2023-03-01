<template lang="pug">
	.my-calendar
		.d-none
			|{{ getLocale }}
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_calendar_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_calendar.svg")
				td
					.subsection-title
						|{{ $t('calendar-header-title') }}
				td
					.subsection-description
						|{{ $t('calendar-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_calendar_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_calendar.svg")
			.subsection-title
				|{{ $t('calendar-header-title') }}
			.subsection-description
				|{{ $t('calendar-header-description') }}
		.content
			v-row
				v-col.d-none.d-md-block.pr-0.order-md-1.order-2.elevation-0(cols="12", md="3", :class="{'pb-0': $vuetify.breakpoint.mdAndDown}")
					v-card.elevation-0(width="100%")
						v-card-title
							v-btn.elevation-0.white-btn-text(
								color="#2963b4",
								raised,
								block,
								small,								
								@click="showCalendar=true")
								|Create new event
						v-card-text
							.minicalendar
								loader(position="absolute", background="transparent", v-show="loadingEvents", image="/assets/icons/loading.gif")
								v-date-picker(v-model="newEvent.date", :events="setEvents", event-color="blue", :min="today", full-width, :locale="getLocale", @click:date="focusDate")
								//-@dblclick:date="createNewEvent",-//
							.next-event
								v-expansion-panels(flat, v-model="nextEventPanel", multiple)
									v-expansion-panel
										v-expansion-panel-header
											|Next events
										v-expansion-panel-content
											.next-event-viewer(v-if="nextEvents.length == 0")
												|No events found
											.next-event-viewer(v-else)
												//-.event(v-for="event in nextEvents")
													|{{ event.name }} - {{ event.date | moment("MMMM Do YYYY")}}-//
												v-list(flat :disabled="showMenuNexEvent ? true : false")
													v-list-item-group(color="primary", v-model="selectionsNext")
														v-list-item.event(v-for="(event,i) in nextEvents", :key="i",  @click="showNextEventsOptions($event,i)")
															v-list-item-content
																|{{ event.name }} - {{ event.date | moment("MMMM Do YYYY")}}
												v-menu(v-model="showMenuNexEvent", :position-x="x", :position-y="y", absolute, offset-y)
													v-list
														v-list-item(@click="callEditNextEvent")
															v-list-item-icon
																v-icon
																	|mdi-pencil
															v-list-item-title
																|{{$t("calendar-edit")}}
														v-list-item(@click="callDeleteNextEvent")
															v-list-item-icon
																v-icon
																	|mdi-delete
															v-list-item-title
																|{{$t("calendar-remove")}}
				v-col.pt-0.pl-1.pr-0.order-md-2.order-1(cols="12", md="9")
					.calendar-container
						calendar(@edit="editEvent", ref="calendar", @dateSelected="dateSelected" @eventsMore="eventsMoreShow")
						loader(position="absolute", background="transparent", v-show="loadingEvents", image="/assets/icons/loading.gif")

		v-dialog.new-event-modal(v-model="showNewEvent", max-width="450")
			v-card.new-event-card
				v-card-title
					.card-title.mb-0
						|New event on {{newEvent.date || "2020-01-01" | moment("MMMM Do, YYYY") }}
				v-card-text
					v-row
						v-col.pb-0.mt-0.pt-0(cols="12", md="12")
							v-form(ref="newEventForm")
								v-row
									v-col(md="12", cols="11")
										v-text-field.mt-3(
											v-model="newEvent.name",
											label="Event Name",
											:rules="form.validations.required",
											required)
									v-col.time-icon.d-block.d-md-none(cols="1")
										v-icon(@click="openTimePicker", color="black")
											|mdi-clock
						v-col.d-none.d-md-block(cols="12", md="12")
							v-time-picker(v-model="newEvent.time", color="#51857d", scrollable, full-width, ampm-in-title, landscape)
						v-col.pt-0.pb-0(cols="12", md="12")
							v-alert(color="orange", ref="noEventName", :value="false")
								|Please, enter the event name.
				v-card-actions.editor-buttons
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#51857d", @click="redirectRecord", tile, :x-small="xsmall")
						|Record
					v-btn.elevation-0.white-btn-text(color="#51857d", @click="redirectUpload", tile, :x-small="xsmall")
						|Upload file
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="showNewEvent = false", :x-small="xsmall")
						|Close
					v-spacer
		event-editor(v-model="editingEvent", :open="showEditEvent", @close="showEditEvent = false")

		v-dialog.creator-mobile-timepicker-dialog(persistent, v-model="timepickerSelector")
			v-card.creator-mobile-timepicker-card
				v-card-title
					|Select a time
				v-card-text
					v-time-picker(v-model="newEvent.time", color="#51857d", scrollable, full-width, ampm-in-title, landscape)
				v-card-actions
					v-spacer
					v-btn.elevation-0(@click="cancelTimePicking", color="white")
						|Cancel
					v-btn.elevation-0(@click="setTime", color="#51857d", dark)
						|Save
		v-dialog(persistent, v-model="showMoreEvents", max-width="450")
			v-card(tile)
				v-list(dense :disabled="showMenu ? true : false")
					v-list-item-group(color="primary", v-model="selections")
						v-list-item(v-for="(item, i) in eventsMore", :key="i", @click="showEventsMoreOptions($event,i)")
							v-list-item-icon
									v-icon
										|mdi-file
							v-list-item-content
								v-list-item-title(v-text="item.name")
				.text-center.pb-4
					v-btn( color="primary", depressed, @click="closeEventsMoreShow")
						|{{$t("buttom-close")}}
			v-menu(v-model="showMenu", :position-x="x", :position-y="y", absolute, offset-y)
				v-list
					v-list-item(@click="callEditEvent")
						v-list-item-icon
							v-icon
								|mdi-pencil
						v-list-item-title
							|{{$t("calendar-edit")}}
					v-list-item(@click="callDeleteEvent")
						v-list-item-icon
							v-icon
								|mdi-delete
						v-list-item-title
							|{{$t("calendar-remove")}}
		.upload-file-calendar(v-show="showCalendar")
			.outter-container(:style="fixedWidth")
				.inner-container
					scheduler(@cancel="showCalendar = false", @close="showCalendar = false", from="upload", ref="scheduler")
</template>

<script>
	import Calendar from "@/components/dashboard/elements/Calendar.vue"
	import EventEditor from "@/components/dashboard/elements/events/EventEditor.vue"
	import Loader from "@/components/misc/Loader.vue"
	import Scheduler from "@/components/dashboard/elements/events/Scheduler.vue"

	export default {
		data(){
			return {
				editingEvent: {},
				events: [],
				simpleEvents: [],
				nextEventPanel: [0],
				eventsMore:[],
				newEvent: {
					name: "",
					time: "12:00",
					date: null,
					files: [],
				},
				form: {
					validations: {
						required: [
				        	v => !!v || 'This field is required',
				      	]
					}
				},
				filesPanel: [],
				chosenFiles: null,
				status: {
					saving: false
				},
				showNewEvent: false,
				showMenuNexEvent:false,
				showEditEvent: false,
				timepickerSelector: false,
				showMoreEvents:false,
				showMenu: false,
      			x: 0,
				y: 0,
				selection:null,
				selectionMoreEvents: 0,
				nextEventSelect:null,
				showCalendar:false
			}
		},
		mounted(){
			
			for( let i = 0 ; i < 2 ; i++ ){
				let d = new Date()
				let day = Math.floor(Math.random() * 30)
				d.setDate( 2 )

				this.simpleEvents.push( d.toISOString().substr(0, 10))
			}			
		},
		methods: {
			addEvent: function(){
				if( this.$refs.newEventForm.validate() ){
					this.status.saving = true
					let body = JSON.parse(JSON.stringify(this.newEvent)) //Clone Obj
					body.date = new Date(body.date)
					body.time = body.time || "12:00"

					body.date.setDate( body.date.getDate() + 1 ) //Fixes -1 day issue

					let h = Number(body.time.split(":")[0])
					let m = Number(body.time.split(":")[1])

					body.date.setHours( h )
					body.date.setMinutes( m )

					let url = this.baseApi + this.env + "events"
					this.axios.post(url, body)
					.then(result => {
						this.showNewEvent = false
						this.$store.commit("addEvent", result.data.event)
						this.$swal("Done!", "Event was added successfully", "success")
						this.resetForm()
					})
					.catch(err => {
						console.log( err )
					})
					.finally(() => {
						this.status.saving = false
					})
				}
			},
			editEvent: function( event ){				
				this.editingEvent = event				
				this.showEditEvent = true
				this.$emit("loadEvent")
			},
			dateSelected: function(dateObject){
				let date_selected= new Date(dateObject.date)				
				let date_limit= new Date(this.$store.getters.plan.endDate.split('T')[0])								
				if( !dateObject.past ){
					if(date_limit.getTime() >= date_selected.getTime()){
						this.newEvent.date = dateObject.date
						this.showNewEvent = true
					}
					else{
						this.$swal({
							title: "Oops!",
							text: "This event is out of your plan, if you need more time hire a plan for a longer time",
							type: "error",			
							confirmButtonColor: '#3085d6'
						})
					}						
				}
			},
			redirectRecord: function(){
				if( !this.newEvent.name ){
					this.$refs.noEventName.toggle()
				}else
					this.$router.push({path: '/dashboard/record', query: {returnable: "true", keep: "true", event: true, eventDate: this.newEvent.date, eventTime: this.newEvent.time, eventName: this.newEvent.name}})
			},
			redirectUpload: function(){
				if( !this.newEvent.name ){
					this.$refs.noEventName.toggle()
				}else
					this.$router.push({path: '/dashboard/upload', query: {returnable: "true", keep: "true", event: true, eventDate: this.newEvent.date, eventTime: this.newEvent.time, eventName: this.newEvent.name}})
			},
			resetForm: function(){
				this.newEvent = {
					name: "",
					time: "12:00",
					date: null,
					files: [],
				}
			},
			createNewEvent: function(){
				this.showNewEvent = true
			},
			openTimePicker: function() {
				this.timepickerSelector = true
			},
			cancelTimePicking: function() {
				this.newEvent.time = "12:00"
				this.timepickerSelector = false
			},
			setTime: function () {
				this.timepickerSelector = false
			},
			focusDate: function(){				
				let date_limit= new Date(this.$store.getters.plan.endDate.split('T')[0])
				let date_selected =	new Date(this.newEvent.date)				
				if(date_limit.getTime() >= date_selected.getTime()){
					this.showNewEvent = true
					this.$refs.calendar.focusDatePicker(this.newEvent.date)
				}
				else{
						this.$swal({
							title: "Oops!",
							text: "This event is out of your plan, if you need more time hire a plan for a longer time",
							type: "error",			
							confirmButtonColor: '#3085d6'
						})
				}
			},
			eventsMoreShow: function(events){
				this.eventsMore=events
				this.showMoreEvents=true				
			},
			closeEventsMoreShow:function(){
				this.eventsMore=null
				this.showMoreEvents=false
				this.selectionMoreEvents=0
				this.selection = null 
			},
			closeNextEventsShow:function(){					
				this.nextEventSelect=null
				this.selection = null 
			},
			showEventsMoreOptions:function(e,aux){
				e.preventDefault()
        		this.showMenu = false
        		this.x = e.clientX
        		this.y = e.clientY				
				this.selectionMoreEvents=aux				
        		this.$nextTick(() => {
          			this.showMenu = true
        		})
			},
			showNextEventsOptions:function(e,aux){
				e.preventDefault()				
        		this.showMenuNexEvent = false
        		this.x = e.clientX
        		this.y = e.clientY											
				let eventos=this.$refs.calendar.getEvents()			
				this.nextEventSelect= eventos.find( evento => evento._id === this.nextEvents[aux]._id )				
        		this.$nextTick(() => {
          			this.showMenuNexEvent = true
        		})
			},
			callEditEvent(){
				this.editEvent(this.eventsMore[this.selectionMoreEvents])
				this.closeEventsMoreShow()
			},
			callDeleteEvent(){
				this.$refs.calendar.deleteEvent(this.eventsMore[this.selectionMoreEvents])
				this.closeEventsMoreShow()
			},
			callEditNextEvent(){
				this.editEvent(this.nextEventSelect)
				this.closeNextEventsShow()
			},
			callDeleteNextEvent(){
				this.$refs.calendar.deleteEvent(this.nextEventSelect)
				this.closeNextEventsShow()
			},
			clear(){         
        		this.selection = null 
			}					    
		},
		computed: {
			getLocale: function() {
				return this.$store.getters.locale || "en"
			},
			setEvents: function(){
			
				let array = []
				let storedEvents = this.$store.getters.events
				for( let i = 0 ; i < storedEvents.length ; i++ )					
					array.push(storedEvents[ i ].date.substr(0, 10))
				
				return array
			},
			loadingEvents: function(){
				return this.$store.getters.gettingEvents
			},
			files: function(){
				let files = this.$store.getters.files || []
				if( files.length > 0 && this.$route.query.keep ){
					this.filesPanel = [0]
				}
				return files
			},
			nextEvents: function(){
				let events = JSON.parse(JSON.stringify(this.$store.getters.events))
				events = events.filter((a) => new Date(a.date) > new Date())
				events = events.sort((a, b) => new Date(b.date) - new Date(a.date))
				events = events.slice(0,5)				
				return events || []
			},
			today: function(){
				let current = new Date()
				let offset = new Date().getTimezoneOffset()
				let fixedDate = new Date(current.getTime() - (offset * 60000))

				return fixedDate.toISOString().substr(0, 10)
			},
			contacts: function(){
				return this.$store.getters.contacts
			},
			small: function(){
				if(this.$vuetify.breakpoint.width > 600)
					return false
				else
					return true
			},
			xsmall: function(){
				if(this.$vuetify.breakpoint.width > 600)
					return false
				else
					return true
			},
			selections:{
				get () {
					if(this.showMenu)
						return this.selection
					else
					return null
				},
				set (val) {
					this.selection = val            					
				}
			},
			selectionsNext:{
				get () {
					if(this.showMenuNexEvent)
						return this.selection
					else
						return null
				},
				set (val) {
					this.selection = val    					
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
		activated: function(){
			this.newEvent.name = ""	
		},
		components: {
			Calendar,
			EventEditor,
			Loader,
			Scheduler
		}
	}
</script>

<style lang="sass">
	.my-calendar
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%

		& *
			font-family: Raleway !important
			
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			background-color: #c9684d
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 100px
				bottom: -35px
				right: 25px
				opacity: 0.3
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					vertical-align: middle

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 10px
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
		.content
			position: relative
			.calendar-container
				position: relative
			.minicalendar
				position: relative
				margin-bottom: 5px
				.v-picker
					.v-date-picker-header__value
						.accent--text
							button
								font-family: Raleway
					.v-date-picker-table
						table
							tr
								th
									font-family: Raleway
								td
									.v-btn__content
										font-family: Raleway
			.v-picker
				.v-picker__title
					display: none

			.next-event
				.v-expansion-panel-header
					text-transform: uppercase
					font-size: 11pt
					font-family: Raleway
					font-weight: 600
				.next-event-viewer
					.event
						margin-bottom: 7px
						border-radius: 30px
						background-color: #f7ecd9
						padding-left: 25px
						padding-right: 25px
						padding-top: 7px
						padding-bottom: 5px
		.new-event-modal
			.headline
				font-weight: 600 !important

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
					
	.files-panel
		.v-expansion-panel-header
			padding-left: 10px
			padding-right: 12px
			text-transform: uppercase !important
			font-family: Raleway
			font-weight: 700
			font-size: 10pt
			letter-spacing: 1px
		.files-list
			.v-input
				margin-top: 0
				.v-input--selection-controls__ripple
					z-index: 10
	.new-event-card
		.contacts-card,.categories-card
			overflow-y: auto
		.card-title
			word-break: break-word
	@media only screen and (min-width: 1921px)
		.my-calendar
			.content
				.next-event
					.v-expansion-panel-header
						font-size: 16pt
					.v-expansion-panel-content
						.next-event-viewer
							font-size: 14pt
				.calendar-container
					.calendar
						.text-date
							font-size: 18pt
				.minicalendar
					.v-picker
						.v-date-picker-header__value
							.accent--text
								button
									font-size: 16pt
		.new-event-card
			.v-picker__title--landscape
				.v-time-picker-title__ampm
					font-size: 18pt
			.v-time-picker-clock__item
				font-size: 16pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
		.files-panel
			.v-expansion-panel-header
				font-size: 14pt
	@media only screen and (max-width: 768px)
		.my-calendar
			padding: 0
			padding-bottom: 50px
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
					height: 70%
					left: 10px
					img
						height: 100%
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block
					padding-left: 0
			.content
				padding: 10px
		.new-event-card
			&>.v-card__title
				padding-bottom: 0 !important
			.time-icon
				padding-top: 40px
				padding-left: 0
				padding-right: 0
			.v-card__text
				padding-bottom: 0 !important
			.files-panel
				.v-expansion-panel-content__wrap
					max-height: 50vh
					overflow-y: auto
				.v-input
					margin-top: 0
		.creator-mobile-timepicker-card
			.v-card__title
				font-family: Raleway
				font-weight: 700 !important
				text-transform: uppercase
				letter-spacing: 1px !important
			.v-card__text
				padding-left: 5px !important
				padding-right: 5px !important
	@media only screen and (max-width: 960px)
		.my-calendar
			.upload-file-calendar
				padding-top: 56px
				.outter-container
					padding: 0
					.inner-container
						border-radius: 0
						height: 100%


</style>