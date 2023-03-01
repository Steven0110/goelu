<template lang="pug">
	.events
		loader(position="absolute", background="white", v-show="loadingEvents", image="/assets/icons/loading.gif")
		.information(v-if="events.length > 0")
			.evt-title
				|{{ $t("next-events") }}
			.events-slider
				slick(ref="eventsSlider", :options="options", v-if="events.length > 0")
					.event-slide(v-for="event in events", :key="event.id")
						.inner-event-container
							.event-icon
								img(src="/assets/icons/ic_calendar_2.svg")
							.event-info
								.year
									|{{ event.year }}
								.date
									|{{ event.date }}
								.name
									|{{ event.name }}
		.empty(v-else)
			.evt-title
				|{{ $t("next-events") }}
			.no-events
				|No events found
</template>

<script>
	import Slick from 'vue-slick'
	import Loader from "@/components/misc/Loader.vue"

	export default {
		data() {
			return {
				options: {
					slidesToShow: 1,
					autoplay: true,
					autoplaySpeed: 3000
				}
			}
		},
		computed: {
			loadingEvents: function(){
				return this.$store.getters.gettingEvents
			},
			events: function(){
				let events = this.$store.getters.events
				let array = []
				let today = new Date()
				for( let i = 0 ; i < events.length ; i++ ){
					let eventDate = new Date( events[ i ].date )
					if( eventDate >= today ){
						array.push({
							id: events[ i ]._id,
							year: events[ i ].date.substr(0, 4),
							date: this.$moment(events[ i ].date).format("MMMM Do"),
							name: events[ i ].name
						})
					}
				}
				return array
			}
		},
		components: {
			Slick,
			Loader
		}
	}
</script>

<style lang="sass">
	.events
		padding: 15px
		background-color: #60c5a0
		padding: 15px
		position: relative
		border-radius: 3px
		.evt-title
			display: block
			position: relative
			font-family: Raleway
			font-size: 10pt
			text-align: center
			color: white
			text-transform: uppercase
			font-weight: 600
			&:after
				content: ''
				position: absolute
				height: 1px
				left: -15px
				right: -15px
				bottom: -10px
				background-color: rgba(255, 255, 255, 0.4)
		.no-events
			margin-top: 25px
			color: white
			font-family: Raleway
			text-align: center
			font-size: 11pt
			text-transform: uppercase
			letter-spacing: 1px
			font-weight: 500
		.events-slider
			.slick-prev
				margin-left: 25px
				margin-top: 10px
				z-index: 100
			.slick-next
				margin-right: 25px
				margin-top: 10px
				z-index: 100
			.event-slide
				position: relative
				padding-left: 35px
				padding-top: 15px
				padding-left: 10%
				padding-right: 10%
				text-align: center
				.inner-event-container
					display: inline-block
					width: 100%
					position: relative
					.event-icon
						display: inline-block
						position: relative
						transform: translateY(-15%)
						width: 30px
						height: 30px
						img
							max-width: 100%
							max-height: 100%

					.event-info
						display: inline-block
						text-align: left
						margin-left: 10px
						.year
							font-family: Raleway
							color: rgba(255, 255, 255, 0.6)
							font-weight: 800
							font-size: 12pt
							margin-top: 0
							margin-bottom: -5px
							text-transform: uppercase
						.date
							font-family: Raleway
							color: #333
							font-weight: 800
							font-size: 10pt
							margin-top: 0
							margin-bottom: -5px
							text-transform: uppercase
							letter-spacing: 1px
						.name
							font-family: Raleway
							color: white
							font-weight: 800
							font-size: 12pt
							margin-top: 0
							margin-bottom: -5px
							text-transform: uppercase
							letter-spacing: 1px
	@media only screen and (min-width: 1367px)
		.events
			.evt-title
				font-size: 12pt
			.events-slider
				.slick-prev
				.slick-next
				.event-slide
					.inner-event-container
						.event-info
							.year
								font-size: 14pt
							.date
								font-size: 12pt
							.name
								font-family: Raleway
								color: white
								font-weight: 800
								font-size: 14pt
	@media only screen and (min-width: 1921px)
		.events
			.evt-title
				font-size: 16pt
			.events-slider
				.event-slide
					.inner-event-container
						.event-info
							.year
								font-size: 18pt
							.date
								font-size: 16pt
							.name
								font-size: 18pt
</style>