<template lang="pug">
	.header.d-none.d-md-block
		.relative
			.logo
				router-link(:to="{path: '/dashboard'}")
					img.img.img-responsive(src="/assets/images/goelU.svg")
			.options
				.option
					.valign-parent
						|FAQ				
</template>

<script>
	export default {
		data() {
            return {								
				}
			},
		methods: {
			setLocale: function(locale){
				localStorage.setItem("locale", locale)
				this.$store.commit("setLocale", locale)
				this.$i18n.locale = locale
				this.$moment.locale( locale )				
				if (locale=='es')					
					$zopim.livechat.set({language: 'es'})
				else
					$zopim.livechat.set({language: 'en'})
				$zopim.livechat.theme.reload()
			}			
		},
		computed: {
			locale: function(){								
				return this.$i18n.locale
			}
		},
		mounted(){			
		}		
	}
</script>

<style lang="sass">
	.header
		width: 100%
		height: 9vh
		top: 0
		z-index: 99
		position: fixed
		left: 0
		background-color: #f2f2f2
		border-bottom: 1px solid rgba(0, 0, 0, 0.07)
		transition: 0.2s linear all
		.logo
			width: 10%
			position: relative
			display: table
			text-align: center
			float: left
			height: 9vh
			transition: 0.2s linear all
			a
				padding-top: 4px
				padding-bottom: 4px
				height: 9vh
				display: table-cell
				vertical-align: middle
			img
				display: inline-block
				max-height: 100%
				max-width: 85%
		.options
			float: left
			width: 90%
			height: 9vh
			border-right: 1px solid rgba(0, 0, 0, 0.07)
			transition: 0.2s linear all
			.option
				float: right
				height: 100%
				border: 1px solid rgba(0, 0, 0, 0.07)
				border-bottom: none
				border-top: none
				border-right: none
				font-family: Raleway, sans-serif
				font-weight: 700
				font-size: 8pt
				text-transform: uppercase
				transition: 0.3s linear all
				.valign-parent
					.active
						color: #3aa9e0 !important
						transition: 0.2s linear all
				&:hover
					transition: 0.3s linear all
					a
						transition: 0.3s linear all
						color: white
				&:first-child
					border-right: none
				a
					transition: 0.3s linear all
					color: #444
					text-decoration: none
					font-family: Raleway
					padding-left: 25px
					padding-right: 25px
					&:hover
						text-decoration: none
						color: #3aa9e0

			.language-selector
				float: right
				padding-right: 25px
				padding-left: 25px
				height: 100%
				border: 1px solid rgba(0, 0, 0, 0.07)
				border-bottom: none
				border-top: none
				border-right: none
				transition: 0.3s linear all
				font-family: Raleway, sans-serif
				font-weight: 700
				font-size: 8pt
				width: 150px
				color: #444
				transition: 0.2s linear all
				width: 120px
				span
					display: inline-block
					color: #666
					transition: 0.2s linear all
					&.language-option
						&.active
							color: #3aa9e0
							transition: 0.2s linear all
						&:hover
							cursor: pointer
							color: #3aa9e0
							transition: 0.2s linear all
						&.english-switcher
							margin-right: 4px
						&.spanish-switcher
							margin-left: 4px
	@media only screen and (min-width: 1921px)
		.header
			.logo
				a
					padding-top: 8px
					padding-bottom: 8px
			.options
				.option
					font-size: 12pt

				.language-selector
					font-size: 12pt
</style>