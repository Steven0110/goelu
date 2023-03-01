<template lang="pug">
	.multi-progress-bar
		.bar1(:style="b1")
		.bar2(:style="b2")
		.bar3(:style="b3")
		.bar4
		.consumed-text
			|{{ $t("consumed") }}
		.available-text
			|{{ $t("available") }}
</template>

<script>
	
	export default {
		props: ["p1", "p2", "p3"],
		computed: {
			b1: function(){
				let css = {}
				if( this.p1 >= 0 ){
					css.left = "0"
					css.width = Number(this.p1) + "%"
				}
				return css
			},
			b2: function(){
				let css = {}
				if( this.p1 >= 0 && this.p3 >= 0 ){
					css.left = Number(this.p1) + "%"
					css.width = Number(this.p2) +"%"
				}
				return css
			},
			b3: function(){
				let css = {}
				if( this.p1 >= 0 && this.p2 >= 0 && this.p3 >= 0 ){
					css.left = (Number(this.p2) + Number(this.p1)) + "%"
					css.width = this.p3 + "%"
				}
				return css
			}
		}
	}
</script>

<style lang="sass">
	.multi-progress-bar
		display: block
		position: relative
		width: 100%
		top: 50%
		transform: translateY(-50%)
		.bar1
			position: absolute
			height: 4px
			width: 10px
			left: 0
			bottom: 0
			background-color: #ca654c
			border-radius: 4px 0 0 4px
			z-index: 10
		.bar2
			position: absolute
			height: 4px
			width: 10px
			left: 20px
			bottom: 0
			background-color: #57acef
			z-index: 10
		.bar3
			position: absolute
			height: 4px
			left: 40px
			width: 10px
			bottom: 0
			background-color: #f9ca70
			z-index: 10
			border-radius: 0 4px 4px 0
		.bar4
			position: absolute
			height: 4px
			left: 0
			width: 100%
			bottom: 0
			background-color: rgba(0, 0, 0, 0.1)
			z-index: 9
			border-radius: 0 4px 4px 0
		.consumed-text
			position: absolute
			left: 0
			top: -30px
			font-family: Raleway
			font-size: 9pt
			font-weight: 600
			text-transform: uppercase
			padding-left: 20px
			color: #555
			letter-spacing: 1px
		.available-text
			position: absolute
			top: -30px
			right: 0
			font-family: Raleway
			font-size: 9pt
			padding-right: 20px
			font-weight: 600
			text-transform: uppercase
			color: #555
			letter-spacing: 1px
	@media only screen and (min-width: 1367px)
		.multi-progress-bar
			.consumed-text
				font-size: 11pt
			.available-text
				font-size: 11pt
	@media only screen and (min-width: 1921px)
		.multi-progress-bar
			.consumed-text
				font-size: 15pt
				top: -35px
			.available-text
				font-size: 15pt
				top: -35px
</style>