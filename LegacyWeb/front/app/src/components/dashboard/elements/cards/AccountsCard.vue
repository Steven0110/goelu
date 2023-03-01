<template lang="pug">
	.account-card
		.subtitle
			|{{ $t("accounts") }}
		.plan-name
			|{{ $t("accounts-administrator") }}
		.plan-specs
			span
				|{{ $t("card-admin-01") }}
		v-row
			v-col(cols="12")
				v-btn.elevation-0.white--text(
					color="#47c6c9",
					raised,
					block,
					:small="small",
					:x-small="xsmall",
					@click="$router.push({path: '/dashboard/profile'})")
					|{{ $t("edit-accounts") }}
</template>

<script>
	export default {
		computed: {
			small: function(){
				if(this.$vuetify.breakpoint.width > 1920)
					return false
				if(this.$vuetify.breakpoint.width > 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return false
				else if(this.$vuetify.breakpoint.width <= 640)
					return true
			},
			xsmall: function(){
				if(this.$vuetify.breakpoint.width > 1366)
					return false
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 768)
					return true
				else if(this.$vuetify.breakpoint.width <= 640)
					return false
			},
		}
	}	
</script>

<style lang="sass">
	.account-card
		padding: 15px
		padding-bottom: 10px
		background-color: white
		border-radius: 3px
		.subtitle
			font-size: 8pt
			color: #555
			font-family: Raleway
			font-weight: 600
			text-transform: uppercase
		.plan-name
			font-size: 12pt
			font-family: Raleway
			color: black
			font-weight: 800
			text-transform: uppercase
			margin-bottom: 5px
		.plan-specs
			font-size: 8pt
			color: #888
			font-family: Raleway
			font-weight: 600
		.v-btn
			.v-btn__content
				font-family: Raleway
				font-size: 11pt
	@media only screen and (min-width: 1024px)
		.account-card
			.subtitle
				font-size: 10pt
			.plan-name
				font-size: 14pt
			.plan-specs
				font-size: 10pt
			.v-btn
				.v-btn__content
					font-size: 9pt
					font-weight: 600
	@media only screen and (min-width: 1367px)
		.account-card
			.subtitle
				font-size: 10pt
			.plan-name
				font-size: 14pt
			.plan-specs
				font-size: 10pt
			.v-btn
				.v-btn__content
					font-size: 10pt
					font-weight: 600
	@media only screen and (min-width: 1921px)
		.account-card
			.subtitle
				font-size: 14pt
			.plan-name
				font-size: 18pt
			.plan-specs
				font-size: 14pt
			.v-btn
				.v-btn__content
					font-size: 14pt
	@media only screen and (max-width: 640px)
		.account-card
			.v-btn
				.v-btn__content
					font-size: 9pt
	
</style>