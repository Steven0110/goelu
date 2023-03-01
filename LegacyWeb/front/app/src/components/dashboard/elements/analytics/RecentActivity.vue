<template lang="pug">
	.recent-activity

		loader(position="absolute", background="white", v-show="loadingLastActivity", image="/assets/icons/loading.gif")

		.ra-title
			|{{ $t("recent-activity") }}
		.activities-container
			.activity(v-for="activity in activities", :key="activity._id")
				.activity-description
					|{{ activity.message }}
				.activity-date(v-if="lastActivity.createdAt")
					|{{ activity.createdAt | moment("MMM DD") }}
				.profile-photo(v-if="activity.image")
					img(:src="activity.image")
				//.view-all
					|{{ $t("view-all-activity") }}
			.empty(v-if="!activities || activities.length == 0")
				|No recent activities
</template>

<script>
	import Loader 	from "@/components/misc/Loader.vue"

	export default {
		computed: {
			loadingLastActivity: function(){
				return this.$store.getters.gettingLastActivities
			},
			lastActivity: function(){
				let activity = this.$store.getters.lastActivities[ 0 ] || {}
				return activity	
			},
			activities: function() {				
				return this.$store.getters.lastActivities
			}
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.recent-activity
		padding: 15px
		padding-left: 0
		padding-right: 0
		padding-bottom: 0
		background-color: white
		border-radius: 3px
		position: relative

		.empty
			padding-top: 15px
			padding-bottom: 15px
			color: #888
			font-family: Raleway
			text-align: center
			font-size: 11pt
			text-transform: uppercase
			letter-spacing: 1px
			font-weight: 500
		.ra-title
			font-family: Raleway
			font-size: 10pt
			text-align: center
			color: black
			text-transform: uppercase
			font-weight: 600
		.activities-container
			max-height: 300px
			overflow-y: auto

			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: white
			&::-webkit-scrollbar
				width: 10px
				background-color: rgba(0, 0, 0, 0.1)
			&::-webkit-scrollbar-thumb
				background-color: #2963b4
			.activity
				position: relative
				display: inline-block
				width: calc(100%)
				padding: 15px
				padding-top: 5px
				padding-bottom: 5px
				&:nth-child(odd)
					background: rgba(0, 0, 0, 0.03)

				.activity-author
					font-family: Raleway
					color: black
					font-size: 11pt
					font-weight: 800
				.activity-description
					display: inline-block
					width: 80% 
					font-family: Raleway
					color: #888
					font-size: 9pt
					font-weight: 600
				.activity-date
					display: inline-block
					width: 80%
					font-family: Raleway
					color: #888
					font-size: 9pt
					text-transform: uppercase
				.profile-photo
					float: right
					height: 36px
					width: 36px
					position: relative
					border-radius: 50%
					overflow: hidden
					margin-top: -18px
					img
						position: absolute
						top: 0
						bottom: 0
						left: 50%
						right: 0
						margin: auto
						height: 100%
						transform: translateX(-50%)
				.view-all
					position: absolute
					top: 50%
					right: 0
					transform: translateY(-50%)
					color: #2963b4
					font-size: 9pt
					text-transform: uppercase
					transition: 0.2s linear all
					font-weight: 600
					letter-spacing: 1px
					&:hover
						cursor: pointer
						color: #1c437a
						transition: 0.2s linear all
	@media only screen and (min-width: 1367px)
		.recent-activity
			.ra-title
				font-size: 12pt
			.activity
				.activity-author
					font-size: 13pt
				.activity-description
					font-size: 11pt
				.activity-date
					font-size: 11pt
				.view-all
					font-size: 11pt
	@media only screen and (min-width: 1921px)
		.recent-activity
			.ra-title
				font-size: 16pt
			.activity
				.activity-author
					font-size: 17pt
				.activity-description
					font-size: 15pt
				.activity-date
					font-size: 15pt
				.view-all
					font-size: 15pt
	@media only screen and (max-width: 640px)
		.recent-activity
			.activity
				.view-all
					top: unset
					bottom: -10px
</style>