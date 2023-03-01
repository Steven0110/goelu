<template lang="pug">
	div
		v-dialog.event-editor(:value="!!open", max-width="1000", eager, persistent)
			v-card.event-editor-card
				v-card-title
					.card-title.mb-3
						|Editing {{ value.name }}
				v-card-text
					v-row.d-block.d-sm-none
						v-col.pt-0.pb-0(cols="12")
							.date-info(v-if="datepicker")
								span
									|{{ datepicker | moment("MMMM Do, YYYY") }}
								span.time-text(v-show="time != '12:00'")
									|at {{ time }} hrs.
					v-row
						v-col.d-none.d-sm-block(cols="12")
							v-text-field(
								ref="eventName",
								label="Event name",
								v-model="eventName",
								required)
					v-row
						v-col(sm="4", cols="12")
							v-row
								v-col.d-block.d-sm-none(cols="10", sm="12")
									v-text-field(
										ref="eventName",
										label="Event name",
										v-model="eventName",
										required)
								v-col.d-none.d-sm-block.pt-0(cols="12")
									.card-subtitle
										|FILES
									.event-editor-files
										.files-list
											v-row
												v-col.pt-0.pb-0(cols="12", v-for="file in files", :key="file._id")
													v-checkbox(:label="file.title", :value="file._id", v-model="selectedFiles", color="#51857d")

								v-col.time-icon.d-block.d-sm-none(cols="1")
									v-icon(@click="openTimePicker", color="black")
										|mdi-clock
								v-col.time-icon.d-block.d-sm-none(cols="1")
									v-icon(@click="openDatePicker", color="black")
										|mdi-calendar
						v-col.d-none.d-sm-block(sm="4", cols="12")
							.card-subtitle
								|DATE
							v-date-picker.event-editor-datepicker(v-model="datepicker", @change="change", color="transparent", full-width)

						v-col.d-none.d-sm-block(sm="4", cols="12")
							.card-subtitle
								|TIME
							normal-time-picker.d-none.d-sm-block(v-model="time")

						v-col.d-block.d-sm-none(cols="12")
							.event-editor-files
								v-expansion-panels()
									v-expansion-panel
										v-expansion-panel-header
											|Files
										v-expansion-panel-content
								.files-list
									v-row
										v-col.pt-0.pb-0(cols="12", sm="3", v-for="file in files", :key="file._id")
											v-checkbox(:label="file.title", :value="file._id", v-model="selectedFiles", color="#51857d")
					
				v-card-actions.editor-buttons
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="$emit('close')")
						|Close
					v-btn.elevation-0.white-btn-text(color="#2963b4", @click="updateEvent", :loading="status.saving")
						|Save
					v-spacer
				loader(position="absolute", background="white", v-show="status.loading", image="/assets/icons/loading.gif")

		v-dialog.editor-mobile-timepicker-dialog(persistent, v-model="timepickerSelector")
			v-card.editor-mobile-timepicker-card
				v-card-title
					|Select a time
				v-card-text
					v-time-picker(v-model="time", color="#51857d", scrollable, ampm-in-title, full-width)
				v-card-actions
					v-spacer
					v-btn.elevation-0(@click="cancelTimePicking", color="white")
						|Cancel
					v-btn.elevation-0(@click="setTime", color="#51857d", dark)
						|Save
					v-spacer
		v-dialog.editor-mobile-datepicker-dialog(persistent, v-model="datepickerSelector", width="100%")
			v-card.editor-mobile-datepicker-card
				v-card-title
					|Select a date
				v-card-text
					v-date-picker.event-editor-datepicker(v-model="datepicker", @change="change", color="#51857d", full-width)
				v-card-actions
					v-spacer
					v-btn.elevation-0(@click="cancelDatePicking", color="white")
						|Cancel
					v-btn.elevation-0(@click="setPickedDate", color="#51857d", dark)
						|Save
					v-spacer
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	import NormalTimePicker from "@/components/dashboard/elements/tools/NormalTimePicker.vue"

	export default {
		props: ["value", "open"],
		data() {
			return {
				status: {
					saving: false,
					loading: false
				},
				eventName: "",
				eventAddress: "",
				eventNotes: "",
				touched: false,
				datepicker: null,
				timepickerSelector: false,
				datepickerSelector: false,
				time: null,
				selectedFiles: []
			}
		},
		mounted(){
			this.$parent.$on("loadEvent", this.loadData)
		},
		methods: {
			addEvent: function(){

			},
			loadData: function(){
				this.status.loading = true
				setTimeout(() => {
					this.status.loading = false
					this.datepicker = this.value.start
					this.time = this.value.time
					this.selectedFiles = this.value.files

					this.eventName = this.value.name
					this.eventAddress = this.value.address
					this.eventNotes = this.value.notes
				}, 500)
			},
			updateEvent: function() {
				this.status.saving = true
				let date = new Date(this.datepicker)

				let body = {
					name: this.$refs.eventName.value,
					date: date,
					time: this.time || "12:00",
					files: this.selectedFiles
				}
				
				let h = Number(body.time.split(":")[0])
				let m = Number(body.time.split(":")[1])

				body.date.setHours( h )
				body.date.setMinutes( m )
				//alert("touched=" + this.touched)
				let browser = this.getBrowser()
				console.log("Before adjustment: ", body.date.getDate())
				console.log( browser )
				if( this.touched ){
					if( browser == "opera" || browser == "chrome" || browser == "edgechromium" )
						body.date.setDate(body.date.getDate() + 1)
				}else{
					if( browser == "opera" || browser == "chrome" || browser == "edgechromium" )
						body.date.setDate(body.date.getDate() + 1)
				}
				console.log("After adjustment: ", body.date.getDate())

				let url = this.baseApi + this.env + "events/" + this.value._id
				this.axios.put( url, body )
				.then( result => {
					this.$store.commit("updateEvent", result.data.event)
					this.$emit('close')
					this.$swal("Done!", "Event updated succesfully", "success")
				})
				.catch( err => {
					console.log( err )
				})
				.finally(() => {
					this.status.saving = false
					this.touched = false
				})
			},
			change: function(){
				this.touched = true
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
			}
		},
		computed: {
			files: function(){
				return this.$store.getters.files || []
			},
		},
		components: {
			Loader,
			NormalTimePicker
		}
	}
</script>

<style lang="sass">
	.event-editor
	.event-editor-files
		.v-expansion-panel-header
			text-transform: uppercase !important
			font-family: Raleway
			font-weight: 600
			font-size: 10pt
			letter-spacing: 1px
	.event-editor-card
		position: relative

		.card-subtitle
			font-size: 25px
			text-transform: uppercase
			color: white
			padding: 15px
			font-weight: 600
			padding-left: 25px
			padding-right: 25px
			background-color: #51857d

		.event-editor-datepicker
			.v-picker__title
				padding-top: 23px !important
				padding-bottom: 23px !important
			.v-picker__title__btn.v-date-picker-title__date
				color: #51857d
			button.transparent
				background-color: #dddddd !important
			.v-date-picker-table
				.v-btn
					.v-btn__content
						color: black
		.files-list
			max-height: 390px
			overflow-y: auto
			overflow-x: hidden

			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar
				width: 3px
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar-thumb
				background-color: #51857d

			.v-messages
				display: none
			.v-input__slot
				margin-bottom: 0
			.v-input
				margin-top: 7px
			label
				margin-left: 7px
		.time-icon
			padding-left: 0
			padding-top: 30px
			padding-right: 0
	@media only screen and (min-width: 1921px)
		.event-editor
		.event-editor-card
			.v-time-picker-title
				.v-time-picker-title__ampm
					font-size: 18pt
			.v-time-picker-clock__item
				font-size: 16pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
			.event-editor-files
				.v-expansion-panel-header
					font-size: 14pt
			.v-picker--date
				.v-date-picker-title__year
					font-size: 14pt
				.v-date-picker-header
					.v-date-picker-header__value
						button
							font-size: 14pt

	@media only screen and (max-width: 640px)
		.event-editor-card
			.files-list
				.v-input
					margin-top: 0
			.event-editor-files
				.v-expansion-panel-content__wrap
					max-height: 50vh
					overflow-y: auto

		.editor-mobile-timepicker-card
			.v-card__title
				font-family: Raleway
				font-weight: 700 !important
				text-transform: uppercase
				letter-spacing: 1px !important
		.editor-mobile-datepicker-card
			.v-card__title
				font-family: Raleway
				font-weight: 700 !important
				text-transform: uppercase
				letter-spacing: 1px !important
			.v-card__text

</style>