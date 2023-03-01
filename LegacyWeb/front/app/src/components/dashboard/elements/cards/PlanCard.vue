<template lang="pug">
	.plan-card
		.subtitle
			|{{ $t("your-plan") }}
		.plan-name
			|{{ plan.name | planName }}
		.plan-specs
			span
				|{{ $t("your-plan-includes") }}&nbsp;
			span.account-storage-limit
				|{{ plan.name | planStorage }}
			span
				|&nbsp;{{ $t("of-storage") }}
		v-row
			v-col(xl="4", cols="12", :class="{'pb-1': $vuetify.breakpoint.mdAndDown}")
				v-btn.elevation-0.white--text(
					color="#47c6c9",
					raised,
					block,
					:small="small",
					:x-small="xsmall",
					:to="{path: '/dashboard/plan'}")
					|{{ $t("read-more") }}
			v-col(xl="8", cols="12", :class="{'pt-1': $vuetify.breakpoint.mdAndDown}")
				v-btn.elevation-0.white--text(
					color="#3f64d9",
					raised,
					block,
					:small="small",
					:x-small="xsmall",
					:to="{path: '/dashboard/plan?tab=upgrade'}")
					|{{ $t("upgrade-your-plan") }}
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
			plan: function() {
				return this.$store.getters.plan || {}
			}
		},
		filters: {
			planName: value => (value || "Loading plan... - Loading plan...").split(" - ")[0],
			planStorage: value => (value || "Loading plan... - Loading plan...").split(" - ")[1]
		}
	}
</script>

<style lang="sass">
	.plan-card
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
			.account-storage-limit
				font-weight: 800
		.v-btn
			.v-btn__content
				font-family: Raleway
				font-size: 9pt
				font-weight: 600
	@media only screen and (min-width: 1024px)
		.plan-card
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
		.plan-card
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
		.plan-card
			.subtitle
				font-size: 14pt
			.plan-name
				font-size: 18pt
			.plan-specs
				font-size: 14pt
			.v-btn
				.v-btn__content
					font-size: 14pt
	
</style>