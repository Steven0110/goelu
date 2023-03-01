<template lang="pug">
	.grid-option(:style="style")
		router-link(:to="to")
			.outter-container
				.inner-container
					.name
						|{{ name }}
					.description
						|{{ description }}
					.icon
						img(:src="icon")
</template>

<script>
	export default {
		props: ["name", "to", "description", "icon", "background"],
		data() {
			return {
				//bImage: "",
			}
		},
		mounted() {
			//this.bImage = this.background ? "url('"+this.background+"');" : "none;"
			//console.log( this.bImage )
		},
		computed: {
			style: function(){
				let styles = {}
				if( this.background )
					styles["background-image"] = "url(\"" + this.background + "\")"
				else
					styles["background-image"] = "red"

				return styles 
			}
		},
		methods: {
		}
	}
</script>

<style lang="sass">
	.grid-option
		background-size: cover
		background-repeat: no-repeat
		text-align: center
		padding: 20px
		height: 300px
		margin-top: 8px
		transition: 0.3s linear all
		&.first
			margin-top: 0
		a
			display: block
			width: 100%
			height: 100%
			text-decoration: none
			.outter-container
				position: relative
				height: 100%
				.inner-container
					position: relative
					top: 50%
					transform: translateY(-50%)
					.name
						margin-bottom:10px
						font-family: Raleway
						font-size: 18pt
						line-height:1.1
						text-transform: uppercase
						font-weight: 800
						color: white
					.description
						font-family: Raleway
						color: white
						font-size: 10pt
						font-weight: 600
					.icon
						display: block
						text-align: center
						margin-top: 15px
						img
							display: inline-block
							height: 100px
		&:hover
			filter: brightness(80%)
			box-shadow: 0px 0px 15px -8px black
			transform: scale(1.02)
			transition: 0.3s linear all
	@media only screen and (min-width: 1367px)
		.grid-option
			a
				.outter-container
					.inner-container
						.name
							font-size: 20pt
						.description
							font-size: 12pt
	@media only screen and (min-width: 1921px)
		.grid-option
			height: 500px
			a
				.outter-container
					.inner-container
						.name
							font-size: 32pt
						.description
							font-size: 18pt
						.icon
							img
								height: 150px
</style>