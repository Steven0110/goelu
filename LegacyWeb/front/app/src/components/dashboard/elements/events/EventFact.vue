<template lang="pug">
	.event-fact
		.event-fact-icon
			v-icon
				|{{ icon }}
		.event-fact-name
			|{{ name }}
		.event-fact-text(v-if="!files")
			|{{ text }}
		.event-fact-text(v-else)
			|{{ formatFiles( files ) }}
</template>
<script>
	export default {
		props: ["icon", "name", "text", "files"],
		methods: {
			findFilenameById: function( id ){
				let files = this.$store.getters.files
				for( let i = 0 ; i < files.length ; i++ ){
					if( files[ i ]._id === id )
						return files[ i ].title
				}

				return false
			},
			formatFiles: function(files){
				let filenames = []
				for( let i = 0 ; i < files.length ; i++ ){
					let filename = this.findFilenameById(files[ i ])
					if( filename )
						filenames.push( filename )
				}

				return filenames.join(", ")
			}
		}
	}
</script>
<style lang="sass">
	.event-fact
		position: relative
		margin-bottom: 15px
		.event-fact-icon
			i
				position: absolute
				left: 0
				top: 0
				bottom: 0
				margin-top: auto
				margin-bottom: auto

		.event-fact-name
			color: #2963b4
			font-family: Raleway
			font-weight: 700
			font-size: 8pt
			letter-spacing: 1px
			padding-left: 30px
			margin-bottom: -6px
			text-transform: uppercase
		.event-fact-text
			color: black
			font-family: Raleway
			font-size: 10pt
			font-weight: 600
			padding-left: 30px
			margin-top: -6px
	@media only screen and (min-width: 1921px)
		.event-fact
			.event-fact-icon
				i
					&:before
						font-size: 34px
			.event-fact-name
				padding-left: 45px
				font-size: 14pt
				margin-bottom: 8px
			.event-fact-text
				font-size: 16pt
				padding-left: 45px
	
</style>