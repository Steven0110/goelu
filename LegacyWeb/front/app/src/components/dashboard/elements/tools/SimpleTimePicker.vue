<template lang="pug">
	.simple-time-picker
		span.at
			|At
		.hour-selector
			v-select(ref="hour", :items="hours", solo, :value="getHours(value)", menu-props="auto", @change="update")
			.small
				|HH
		span.time-separator
			|:
		.minute-selector
			v-select(ref="minute", :items="minutes", solo, :value="getMinutes(value)", menu-props="auto", @change="update")
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
		.hour-selector
			display: inline-block
			width: 100px
			.v-select__selection
				padding-left: 15px
				font-size: 20px
				line-height: 20px
		.minute-selector
			display: inline-block
			width: 100px
			.v-select__selection
				padding-left: 15px
				font-size: 20px
				line-height: 20px
		.time-separator
			display: inline-block
			padding: 10px
			font-size: 16pt
			font-weight: 800
			vertical-align: top
			padding-top: 10px
		.at
			display: inline-block
			font-size: 14pt
			padding: 12px
			padding-top: 10px
			padding-left: 0
			vertical-align: top
		span,.small
			color: white
			font-family: Raleway
		.small
			text-align: center
			font-size: 10pt
			margin-top: -20px
</style>