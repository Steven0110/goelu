<template lang="pug">
	.simple-time-picker
		.selected-time
			.value
				|{{ value }}
			.hrs
				|&nbsp;hrs.
		.selectors
			.hour-selector
				v-select(ref="hour", :items="hours", solo, :value="getHours(value)", menu-props="auto", @change="update", background-color="#51857d")
				.small
					|HH
			span.time-separator
				|:
			.minute-selector
				v-select(ref="minute", :items="minutes", solo, :value="getMinutes(value)", menu-props="auto", @change="update", background-color="#51857d")
				.small
					|mm
</template>

<script>
	export default {
		props: ["value"],
		data() {
			return {
				hours: [],
				minutes: []
			}
		},
		created() {

			for( let i = 0 ; i < 24 ; i++ )
				if( i < 10 )
					this.hours.push({text: "0" + i, value: "0" + i})
				else
					this.hours.push({ text: i + "", value: i + "" })

			for( let i = 0 ; i < 60 ; i++ ){
				if( i < 10 )
					this.minutes.push({text: "0" + i, value: "0" + i})
				else
					this.minutes.push({ text: i + "", value: i + "" })
			}
		},
		methods: {
			getHours: function( v ) {
				if(!v)
					return "12"
				else
					return v.split(":")[0]
			},
			getMinutes: function( v ) {
				if(!v)
					return "00"
				else
					return v.split(":")[1]
			},
			update: function() {
				setTimeout(() => {
					let hours 	= this.$refs.hour.selectedItems[0].value
					let minutes = this.$refs.minute.selectedItems[0].value
					this.$emit("input", hours + ":" + minutes )
				}, 200)
			}
		}
	}
</script>

<style lang="sass">
	.simple-time-picker
		clear: both
		display: block
		width: 100%
		height: 100px
		text-align: center
		padding-top: 15px
		.selected-time
			padding-top: 10px
			padding-bottom: 30px
			.value
				display: inline-block
				color: #51857d
				font-size: 30px
				font-weight: 600
			.hrs
				display: inline-block
				color: #51857d
				font-size: 16px
		.selectors
			.hour-selector
				display: inline-block
				width: 100px
				.v-select__selection
					padding-left: 15px
					font-size: 20px
					line-height: 20px
					color: white
				.v-select__slot
					.v-input__append-inner
						svg
							color: white
			.minute-selector
				display: inline-block
				width: 100px
				.v-select__selection
					padding-left: 15px
					font-size: 20px
					line-height: 20px
					color: white
				.v-select__slot
					.v-input__append-inner
						svg
							color: white
			.time-separator
				display: inline-block
				padding: 10px
				font-size: 16pt
				font-weight: 800
				vertical-align: top
				padding-top: 10px
				color: #51857d
			.at
				display: inline-block
				font-size: 14pt
				padding: 12px
				padding-top: 10px
				padding-left: 0
				vertical-align: top
				color: #51857d
			span,.small
				color: #51857d
				font-family: Raleway
			.small
				text-align: center
				font-size: 12pt
				margin-top: -25px
</style>