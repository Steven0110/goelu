<template lang="pug">
	.scheduler
		.desktop.d-none.d-md-block
			v-row
				v-col.scheduler-left-side(sm="4", cols="12")
					.scheduler-selected-date
						|{{ selectedDate | moment("add", "1 day", "dddd MMMM, Do")}}
					v-text-field.simple.text-center(
						v-model="scheduler.eventName",
						label="Event name",
						background-color="transparent",
						regular,
						color="rgba(255, 255, 255, 0.5)"
						dense,
						required)
					v-row
						v-col(cols="12")
							v-alert(color="#316960", dark, dismissible, ref="emptyNameAlert", :value="false")
								|El nombre del evento está vacío

					v-time-picker.d-block.d-sm-none(v-model="time", color="#51857d", scrollable, full-width, ampm-in-title, landscape)
					
					simple-time-picker.d-none.d-sm-block(v-model="time")
						
					v-row
						v-col.text-center(cols="4")
							v-btn.elevation-0.scheduler-cancel-button.black.mr-1.ml-1(
								color="white",
								raised,
								tile,
								@click="$emit('cancel');reset();")
								|Cancel
						v-col.text-center(cols="4")
							v-btn.elevation-0.scheduler-done-button.mr-1.ml-1(
								color="#51857d",
								raised,
								tile,
								@click="record")
								|Record
						v-col.text-center(cols="4")
							v-btn.elevation-0.scheduler-done-button.mr-1.ml-1(
								color="#51857d",
								raised,
								tile,
								@click="update")
								|Upload File
				v-col.scheduler-right-side(sm="8", cols="12")
					empty-calendar(@changeDate="setDate")
		.mobile.d-block.d-md-none
			.content
				v-row
					v-col(md="4", cols="12")
						.scheduler-selected-date
							span
								|{{ selectedDate | moment("add", "1 day", "MMMM Do, YYYY")}}
							span.time-text(v-show="time != '12:00'")
								|at {{ time }} hrs.
				v-row
					v-col.pt-0(cols="10")
						v-text-field.simple(
							v-model="scheduler.eventName",
							label="Event name",
							background-color="transparent",
							regular,
							color="rgba(255, 255, 255, 0.5)"
							dense,
							required)
					//v-col.time-icon(cols="")
						v-icon(@click="openTimePicker", color="white")
							|mdi-clock
					v-col.time-icon(cols="2")
						v-icon(@click="openDatePicker", color="white", size="40")
							|mdi-calendar
				v-row
					v-col(cols="12")
						v-time-picker(v-model="time", color="#51857d", scrollable, full-width, ampm-in-title)

				v-btn.elevation-0.mobile-scheduler-cancel-button(
					color="white",
					raised,
					tile
					@click="$emit('close')")
					|Cancel
				v-btn.elevation-0.mobile-scheduler-save-button(
					color="#51857d",
					raised,
					tile,
					dark,
					@click="update")
					|Done
		v-dialog.mobile-timepicker-dialog(persistent, v-model="timepickerSelector")
			v-card.mobile-timepicker-card
				v-card-title
					|Select a time
				v-card-text
					
				v-card-actions
					v-spacer
					v-btn.elevation-0(@click="cancelTimePicking", color="white")
						|Cancel
					v-btn.elevation-0(@click="setTime", color="#51857d", dark)
						|Save
		v-dialog.mobile-datepicker-dialog(persistent, v-model="datepickerSelector", width="100%")
			v-card.mobile-datepicker-card
				v-card-title
					|Select a date
				v-card-text
					empty-calendar(@changeDate="setDate")
				v-card-actions
					v-spacer
					v-btn.elevation-0(@click="cancelDatePicking", color="white")
						|Cancel
					v-btn.elevation-0(@click="setPickedDate", color="#51857d", dark)
						|Save


</template>

<script>
	import EmptyCalendar 	from "@/components/dashboard/elements/EmptyCalendar.vue"
	import SimpleTimePicker from "@/components/dashboard/elements/tools/SimpleTimePicker.vue"
	
	export default {
		props: ["value", "from"],
		data() {
			return {
				selectedDate: new Date(),
				scheduler: {
					eventName: "",
					address: "",
					notes: "",
				},
				time: "12:00",
				timepickerSelector: false,
				datepickerSelector: false
			}
		},
		methods: {
			setDate: function( date ){
				this.selectedDate = new Date( date )
			},
			update: function(){
				let date_limit= new Date(this.$store.getters.plan.endDate.split('T')[0])
				let date_select=new Date(this.selectedDate)
				if( this.scheduler.eventName ){
					if(date_limit.getTime() >= date_select.getTime()){
						let time = this.time || "12:00"
						this.selectedDate.setHours( Number( time.split(":")[0] ) )
						this.selectedDate.setMinutes( Number( time.split(":")[1] ) )


						let browser = this.getBrowser()
						console.log( browser )
											
						let dateEvent=this.selectedDate.toISOString()
						this.$router.push({path: '/dashboard/upload', query: {returnable: "true", keep: "true", event: true, eventDate: dateEvent, eventTime:time, eventName: this.scheduler.eventName}})					
						this.reset()
						this.$emit('close')
					}
					else{
						this.$swal({
							title: "Oops!",
							text: "This event is out of your plan, if you need more time hire a plan for a longer time",
							type: "error",			
							confirmButtonColor: '#3085d6'
						})
					}					
				}else
					this.$refs.emptyNameAlert.toggle()
			},
			record: function(){
				let date_limit= new Date(this.$store.getters.plan.endDate.split('T')[0])
				let date_select=new Date(this.selectedDate)				
				if( this.scheduler.eventName ){
					if(date_limit.getTime() >= date_select.getTime()){
						let time = this.time || "12:00"
						this.selectedDate.setHours( Number( time.split(":")[0] ) )
						this.selectedDate.setMinutes( Number( time.split(":")[1] ) )


						let browser = this.getBrowser()
						console.log( browser )
											
						let dateEvent=this.selectedDate.toISOString()
						this.$router.push({path: '/dashboard/record', query: {returnable: "true", keep: "true", event: true, eventDate: dateEvent, eventTime:time, eventName: this.scheduler.eventName}})					
						//this.reset()
						this.reset()
						this.$emit('close')
					}
					else{
						this.$swal({
							title: "Oops!",
							text: "This event is out of your plan, if you need more time hire a plan for a longer time",
							type: "error",			
							confirmButtonColor: '#3085d6'
						})
					}						
				}else
					this.$refs.emptyNameAlert.toggle()
			},
			openTimePicker: function() {
				this.timepickerSelector = true
			},
			openDatePicker: function() {
				this.datepickerSelector = true
			},
			cancelTimePicking: function() {
				this.time = "12:00"
				this.timepickerSelector = false
			},
			setTime: function () {
				this.timepickerSelector = false
			},
			cancelDatePicking: function() {
				//this.time = "12:00"
				this.datepickerSelector = false
			},
			setPickedDate: function () {
				this.datepickerSelector = false
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
			reset: function() {
				this.selectedDate = new Date()
				this.time = "12:00"
				this.timepickerSelector = false
				this.datepickerSelector = false
				this.scheduler = {
					eventName: "",
					address: "",
					notes: "",
				}
			}
		},
		mounted() {
			
		},
		components: {
			EmptyCalendar,
			SimpleTimePicker
		}
	}
</script>

<style lang="sass">
	.scheduler
		.scheduler-selected-date
			font-family: Raleway
			font-weight: 500
			font-size: 26pt
			letter-spacing: 1px
			margin-bottom: 50px
			color: white
			text-transform: uppercase
			text-align: center
		.scheduler-left-side
			background-color: #60a99f
			//padding-top: 15px
			//padding-bottom: 15px
			padding: 30px
			padding-top: 7%
			border-radius: 15px 0 0 15px
			max-height: 600px
			overflow-y: auto
			
			.v-input
				&.simple
					label
						color: rgba(255, 255, 255, 0.5)
						font-family: Raleway
					.v-input__slot
						&:before
							border-color: rgba(255, 255, 255, 0.5) !important
						&:after	
							border-color: rgba(255, 255, 255, 0.5) !important
			.v-text-field
				input
					color: white

		.scheduler-right-side
			background-color: white
			border-radius: 0 15px 15px 0
		.v-time-picker
			transform: scale(0.3)
		.scheduler-cancel-button
			.v-btn__content
				font-family: Raleway
				color: black
				font-weight: 700
		.scheduler-done-button
			.v-btn__content
				font-family: Raleway
				color: white
				font-weight: 700
		input
			text-align: center

	@media only screen and (min-width: 1904px)
		.scheduler
			.scheduler-left-side
				max-height: 1000px

	@media only screen and (max-width: 960px)
		.scheduler
			padding: 0
			width: 100%
			height: 100%
			//overflow-y: auto
			.scheduler-left-side
				border-radius: 0
				padding-bottom: 10px
			.scheduler-right-side
				border-radius: 0
			.mobile
				background-color: #60a99f
				height: 100%
				position: relative
				overflow-y: auto
				.content
					min-height: 100%
					padding: 12px
					padding-bottom: 50px
					.time-icon
						padding-left: 0
						padding-right: 0
						text-align: center
						margin-top: -15px
					.scheduler-selected-date
						margin-bottom: 10px
						.time-text
							font-size: 11pt
							margin-left: 10px
							text-transform: none

					.mobile-scheduler-cancel-button
						position: absolute
						bottom: 10px
						right: 100px
						.v-btn__content
							font-family: Raleway
							font-weight: 700
					.mobile-scheduler-save-button
						position: absolute
						bottom: 10px
						right: 10px
						.v-btn__content
							font-family: Raleway
							font-weight: 700

				.v-text-field
					input
						color: white !important
				.v-input
					&.simple
						label
							color: rgba(255, 255, 255, 0.5)
							font-family: Raleway
						.v-input__slot
							&:before
								border-color: rgba(255, 255, 255, 0.5) !important
							&:after	
								border-color: rgba(255, 255, 255, 0.5) !important
		.mobile-timepicker-card
			.v-card__title
				font-family: Raleway
				font-weight: 700 !important
				text-transform: uppercase
				letter-spacing: 1px !important
		.mobile-datepicker-card
			.v-card__title
				font-family: Raleway
				font-weight: 700 !important
				text-transform: uppercase
				letter-spacing: 1px !important
			.v-card__text
				padding-left: 0px !important
				padding-right: 0px !important
</style>