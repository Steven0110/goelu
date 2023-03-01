<template lang="pug">
	.calendar.fill-height
		v-col(:class="{'pb-0': $vuetify.breakpoint.mdAndDown}")
			v-sheet(height="64")
				v-toolbar.top-toolbar(flat, color="white")
					v-btn(fab, text, small, color="gray darken-1", @click="prev")
						v-icon.prev-month(small)
							|mdi-chevron-left
					v-btn.mr-4(fab, text, small, color="black", @click="next")
						v-icon.next-month(small, color="gray")
							|mdi-chevron-right
					v-toolbar-title.text-date
						|{{ title }}
					v-spacer
					v-col.year-selector-container.pa-0(cols="4",sm="2", md="2",lg="1",xl="1" :class="{'pt-1': $vuetify.breakpoint.mdAndDown}")
						v-select(
							v-model="year",
							:items="years",
							width="100",
							:menu-props="{ 'content-class': 'year-selector', auto: true}"
							@change="changeYear")
			v-sheet(:height="height")
				v-calendar(
					ref="calendar",
					v-model="focus",
					color="darken-1",
					:events="events",
					:event-color="getEventColor",
					:now="today",
					:type="type",
					:locale="getLocale",
					@click:event="showEvent",
					@click:more="viewDayMore",
					@click:date="viewDay",
					@change="updateRange")
				v-menu.edit-event-menu(
					v-model="selectedOpen"
					:close-on-content-click="false"
					:activator="selectedElement"
					offset-x)
					v-card.edit-event-card(
						color="grey lighten-4"
						min-width="350px"
						flat)
						v-toolbar.edit-event-toolbar(
							:color="selectedEvent.color",
							height="150",
							dark)
							v-btn.edit-event-button(fab, :color="selectedEvent.color + ' darken-3'", @click="$emit('edit', selectedEvent)", v-show="!hasEnded(selectedEvent)")
								v-icon
									|mdi-pencil
							v-btn.delete-event-button(fab, color="red darken-3", @click="deleteEvent(selectedEvent)", :loading="status.deleting", v-show="!hasEnded(selectedEvent)")
								v-icon
									|mdi-delete
							v-btn.edit-event-closer(icon, @click="selectedOpen = false")
								v-icon(color="white")
									|mdi-close
							v-toolbar-title()
								|{{selectedEvent.name}}
						v-card-text
							event-fact(
								icon="mdi-calendar",
								name="Date",
								:text="$moment(new Date(selectedEvent.start)).add('1', 'd').format('MMMM Do, YYYY')")
							event-fact(
								v-if="selectedEvent.time != '12:00'",
								icon="mdi-clock-outline",
								name="Time",
								:text="selectedEvent.time")

							event-fact(
								v-if="selectedEvent.files && selectedEvent.files.length > 0",
								icon="mdi-file-outline",
								name="Event related files",
								:files="selectedEvent.files")
						v-card-actions
</template>

<script>
	import EventFact from "@/components/dashboard/elements/events/EventFact.vue"

	export default {
		props: [],
		data() {
			return {
				focus: '',
				type: 'month',
				typeToLabel: {
					month: 'Month',
					week: 'Week',
					day: 'Day',
					'4day': '4 Days',
				},
				status: {
					deleting: false
				},
				today: null,
				start: null,
				end: null,
				selectedEvent: {},
				selectedElement: null,
				selectedOpen: false,
				colors: ['blue', 'cyan', 'green', 'orange', 'grey darken-1', "red", "light-blue"],
				names: ['Meeting', 'Holiday', 'Jhonny\'s Birthday', 'Anniversary', 'Mike\'s Wedding'],
				year: null,
				years: []				
			}
		},
		computed: {
			title: function(){
				const { start, end } = this
				if (!start || !end) {
					return ''
				}
				const startMonth = this.monthFormatter(start)
				const endMonth = this.monthFormatter(end)
				const suffixMonth = startMonth === endMonth ? '' : endMonth

				const startYear = start.year
				const endYear = end.year
				const suffixYear = startYear === endYear ? '' : endYear

				const startDay = start.day + this.nth(start.day)
				const endDay = end.day + this.nth(end.day)

				switch (this.type) {
					case 'month':
						return `${startMonth}`
					case 'week':
					case '4day':
						return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
					case 'day':
						return `${startMonth} ${startDay} ${startYear}`
				}
				return ''
			},
			monthFormatter: function(){
				return this.$refs.calendar.getFormatter({
					timeZone: 'UTC', month: 'long',
				})
			},
			events: function(){
				let array = []
				let storedEvents = this.$store.getters.events
				for( let i = 0 ; i < storedEvents.length ; i++ )
					array.push({
						_id: storedEvents[ i ]._id,
						name: storedEvents[ i ].name,
						start: this.formatDate(new Date(storedEvents[ i ].date)),
						end: this.formatDate(new Date(storedEvents[ i ].date)),
						color: this.colors[this.rnd(0, this.colors.length - 1)],
						files: storedEvents[ i ].files,
						time: storedEvents[ i ].time
					})
				return array
			},
			height: function() {
				if( this.$vuetify.breakpoint.mdAndDown )
					return "500"
				else
					return "600"
			},
			getLocale: function() {
				return this.$store.getters.locale || "en"
			},
		},
		mounted(){
			this.$refs.calendar.checkChange()
			this.setYears()
		},
		methods: {
			getEvents(){
				return this.events
			},
			viewDayMore({date}){				
				let eventsMore = this.events.filter( evento => evento.start === date )				
				this.$emit("eventsMore", eventsMore)				
			},
			viewDay ({ date, past }) {
				this.focus = date
				this.$emit("dateSelected", {date:date, past:past})
				//this.type = 'day'
			},
			setYears: function(){
				let currentYear = Number( new Date().getFullYear() )
				for( let i = 0 ; i <= 100 ; i++ )
					this.years.push( currentYear + i )
				this.year = currentYear
			},
			getEventColor (event) {
				return event.color
			},
			setToday () {
				this.focus = this.today
			},
			prev () {				
					if(this.title == "January" || this.title == "enero"){						
						if((this.year-1)>=this.years[0]){
							this.year-=1
							this.$refs.calendar.prev()
						}
					}
					else
						this.$refs.calendar.prev()																							
			},
			next () {
				if(this.title == "December" || this.title == "diciembre")
					this.year++
				this.$refs.calendar.next()				
				//console.log(this.$refs.calendar)
				//console.log(this.title)
				//console.log( this.year)
			},
			showEvent ({ nativeEvent, event }) {
				const open = () => {
					this.selectedEvent = event
					this.selectedElement = nativeEvent.target
					setTimeout(() => this.selectedOpen = true, 10)
				}

				if (this.selectedOpen) {
					this.selectedOpen = false
					setTimeout(open, 10)
				} else {
					open()
				}

				nativeEvent.stopPropagation()
			},
			updateRange ({ start, end }) {

				const min = new Date(`${start.date}T12:00:00`)
				const max = new Date(`${end.date}T23:59:59`)
				const days = (max.getTime() - min.getTime()) / 86400000

				this.start = start
				this.end = end
			},
			nth (d) {
				return d > 3 && d < 21
					? 'th'
					: ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
			},
			rnd (a, b) {
				return Math.floor((b - a + 1) * Math.random()) + a
			},
			formatDate ( a ) {
				let yyyy 	= a.getFullYear(),
					mm 		= a.getMonth() + 1,
					dd 		= a.getDate()

				if( mm < 10)
					mm = "0" + mm
				if( dd < 10)
					dd = "0" + dd

				return `${yyyy}-${mm}-${dd}`
			},
			deleteEvent: function( event ){
				console.log(event)
				this.$swal({
					title: "Do you want to delete "+event.name+"?",
					text: "This action can't be undone",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, delete',
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then( status => {
					if(status.value) {
						this.status.deleting = true
						let url = this.baseApi + this.env + "events/" + event._id
						this.axios.delete( url )
						.then( result => {
							this.$store.commit("removeEvent", event)
							this.selectedOpen = false
							this.$swal("Done!", event.name + " was deleted", "success")
						})
						.catch( err => {
							console.log( err )
						})
						.finally(() => {
							this.status.deleting = false
						})
					}
				})
			},
			changeYear: function( year ){
				let todayParts = this.start.date.split("-")
				let newDate = `${year}-${todayParts[1]}-${todayParts[2]}`

				this.focus = newDate
			},
			hasEnded: function(event) {
				if( event && event.start ){
					let date = new Date( new Date(event.start) )
					let today = new Date()

					return date < today
				}else
					return true
			},
			focusDatePicker:function(focus){
				this.focus=focus
			}
		},
		components: {
			EventFact,
		}
	}
</script>

<style lang="sass">
	.calendar
		.year-selector-container
			.v-input__slot
				margin-bottom: 0
			.v-select__selection
				font-size: 25px
				line-height: 25px
			.v-text-field__details
				display: none
			.v-list-item__title
				font-size: 20px
			.v-select__slot
				width: 130px

		.v-calendar
			.v-calendar-weekly__day-label
				.v-btn__content
					color: black !important
					font-family: Raleway
			.v-calendar-weekly__head-weekday
				font-family: Raleway
				font-weight: 500
		.text-date
			text-transform: uppercase
			font-family: Raleway
			font-weight: 600
	.edit-event-toolbar
		background-image: url("/assets/images/goelu_events_blanco.png")
		background-size: cover
		position: relative
		.v-toolbar
			.v-toolbar__title
				font-family: Raleway
				font-weight: 600
		.edit-event-button
			position: absolute
			right: 75px
			bottom: 0
			transform: translateY(50%)
		.delete-event-button
			position: absolute
			right: 10px
			bottom: 0
			transform: translateY(50%)
		.edit-event-closer
			position: absolute !important
			left: 0px
			top: 0px
	.edit-event-card
		.v-card__text
			padding-top: 25px
	.year-selector
		.v-list-item__title
			font-size: 20px
	@media only screen and (min-width: 1921px)
		.calendar
			.prev-month
				&:before
					font-size: 24pt
			.next-month
				&:before
					font-size: 24pt
			.v-calendar
				.v-event
					font-size: 12pt
					height: 22px !important
		.edit-event-card
			.edit-event-toolbar
				.v-toolbar__title
					font-size: 18pt
	@media only screen and (max-width: 960px)
		.calendar
			.v-toolbar.top-toolbar
				.v-toolbar__title
					font-size: 18px
					padding-top: 7px
				//.v-btn.v-btn--fab
					//width: 25px
				.v-select
					.v-select__selection
						font-size: 21px
		.edit-event-toolbar
			.edit-event-button
				right: 90px
			.delete-event-button
				right: 25px
	@media only screen and (max-width: 600px)
		.calendar
			.v-toolbar.top-toolbar
				.v-toolbar__title
					font-size: 13px
					padding-top: 7px
					letter-spacing: 1px
				.v-btn.v-btn--fab
					width: 20px
				.v-select
					.v-select__selection
						font-size: 16px
</style>