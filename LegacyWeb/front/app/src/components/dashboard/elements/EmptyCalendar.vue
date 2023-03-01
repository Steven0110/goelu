<template lang="pug">
	.fill-height.empty-calendar
		v-col.pt-0
			v-sheet(height="64")
				v-toolbar(flat, color="white")
					v-btn(fab, text, small, color="black blue", @click="prev")
						v-icon(small)
							|mdi-chevron-left
					v-btn(fab, text, small, color="black", @click="next")
						v-icon(small)
							|mdi-chevron-right
					v-toolbar-title.text-date
						|{{ title }}
					v-spacer
					v-col.pr-0(cols="auto", :class="{'pt-1': $vuetify.breakpoint.mdAndDown}")
						v-select(
							v-model="year",
							:items="years",
							width="100",
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
					:locale="getLocale"
					@click:event="showEvent",
					@click:more="viewDay",
					@click:date="viewDay",
					@change="updateRange")
				v-menu(
					v-model="selectedOpen"
					:close-on-content-click="false"
					:activator="selectedElement"
					offset-x)
					v-card(
						color="grey lighten-4"
						min-width="350px"
						flat)
						v-toolbar(
							:color="selectedEvent.color"
							dark)
							v-btn(icon)
								v-icon
									|mdi-pencil
							v-toolbar-title(v-html="selectedEvent.name")
							v-spacer
							v-btn(icon)
								v-icon
									|mdi-dots-vertical
						v-card-text(v-html="selectedEvent.details")
							span
						v-card-actions
							v-btn(
								text
								color="secondary"
								@click="selectedOpen = false")
								|Cancel
</template>

<script>
	export default {
		props: [],
		data() {
			return {
				focus: '',
				type: 'month',
				today: null,
				typeToLabel: {
					month: 'Month',
					week: 'Week',
					day: 'Day',
					'4day': '4 Days',
				},
				start: null,
				end: null,
				selectedEvent: {},
				selectedElement: null,
				selectedOpen: false,
				events: [],
				colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
				names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
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
						return `${startMonth} ${startDay}`
				}
				return ''
			},
			monthFormatter: function(){
				return this.$refs.calendar.getFormatter({
					timeZone: 'UTC', month: 'long',
				})
			},
			height: function() {
				if(this.$vuetify.breakpoint.width >= 1920)
					return 600
				else if(this.$vuetify.breakpoint.width >= 1440 && this.$vuetify.breakpoint.width < 1920)
					return 500
				else if(this.$vuetify.breakpoint.width >= 1366 && this.$vuetify.breakpoint.width < 1440)
					return 500
				else if(this.$vuetify.breakpoint.width >= 1024 && this.$vuetify.breakpoint.width < 1366)
					return 400
				else if(this.$vuetify.breakpoint.width < 1024)
					return 400
			},
			getLocale: function() {
				if( localStorage ){
					return localStorage.getItem("locale") || "es"
				}
				else
					return "es"
			}
		},
		mounted(){
			this.$refs.calendar.checkChange()
			this.setYears()
		},
		methods: {
			viewDay ({ date }) {
				this.focus = date
				this.$emit("changeDate", date)
				//this.type = 'day'
			},
			getEventColor (event) {
				return event.color
			},
			setToday () {
				this.focus = this.today
			},
			prev () {
				this.$refs.calendar.prev()
			},
			next () {
				this.$refs.calendar.next()
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

				this.start = start
				this.end = end
			},
			setYears: function(){
				let currentYear = Number( new Date().getFullYear() )
				for( let i = 0 ; i <= 50 ; i++ )
					this.years.push( currentYear + i )
				this.year = currentYear
			},
			nth (d) {
				return d > 3 && d < 21
					? 'th'
					: ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
			},
			rnd (a, b) {
				return Math.floor((b - a + 1) * Math.random()) + a
			},
			formatDate (a, withTime) {
				return withTime
					? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
					: `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
			},
			changeYear: function( year ){
				let newDate = year + "-02-01"
				this.focus = newDate
			}
		}
	}
</script>

<style lang="sass">
	.empty-calendar
		.v-calendar
			.v-calendar-weekly__day-label
				.v-btn__content
					color: black !important
				.darken-1
					background-color: #5AAC9E !important
					border-radius: 10px !important
					.v-btn__content
						color: white !important
						font-weight: 800
		.v-toolbar
			.v-toolbar__content
				padding-right: 0
			.v-select
				.v-input__control
					height: 30px !important
					.v-input__slot
						margin-bottom: 2px !important
						.v-select__selections
							padding-left: 25px
							padding-right: 25px
							.v-select__selection
								font-family: Raleway
								font-size: 18pt
								font-weight: 500
								max-width: 100%
								padding-bottom: 4px
							input
								display: none
		.text-date
			text-transform: uppercase

	@media only screen and (max-width: 768px)
		.empty-calendar
			.v-toolbar
				.v-toolbar__content
					padding-left: 0
				.v-select
					.v-input__control
						height: 30px !important
						.v-input__slot
							margin-bottom: 2px !important
							.v-select__selections
								padding-left: 5px
								padding-right: 5px
								.v-select__selection
									font-size: 16pt
									font-weight: 500
									max-width: 100%
									padding-bottom: 4px
</style>