<template lang="pug">
	.plans-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_plan_lg02.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_plan.svg")
				td
					.subsection-title
						|{{ $t('plan-header-title') }}
				td
					.subsection-description
						|{{ $t('plan-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_plan_lg02.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_plan-01.svg")
			.subsection-title
				|{{ $t('plan-header-title') }}
			.subsection-description
				|{{ $t('plan-header-description') }}
		.content
			v-tabs(v-model="tabs", color="#3A6BD6")
				v-tab(key="details-tab")
					|{{ $t('my-plan-tab') }}
				v-tab(key="upgrade-tab")
					|{{ $t('my-plan-upgrade-tab') }}
			v-tabs-items(v-model="tabs", touchless)
				v-tab-item(key="details-tab",style="background-color: rgba(0, 0, 0, 0.05")
					plan-details
				v-tab-item(key="upgrade-tab")
					plan-upgrade
</template>


<script>
	import PlanUpgrade 	from "@/components/dashboard/elements/plan/PlanUpgrade.vue"
	import PlanDetails 	from "@/components/dashboard/elements/plan/PlanDetails.vue"
	export default {
		data() {
			return {
				tabs: null,
				status: {
					stepLoading: false,
				},
				payment: {
					card: {},
				},
				plan: {
					name: "Hola",
					cost: {},
					discount: 0,
					endDate: new Date(),
					storage: 150,
					years: 25
				},
				menu: false,
				step: 1,
				error: "",
				ageError: "",
			}
		},
		mounted() {
			this.$root.$on('goUpgrade',this.changeTabs)
		},
		activated() {
			if( this.$route.query.tab && this.$route.query.tab == "upgrade" )
				this.tabs = 1
		},		
		methods:{
			changeTabs:function(){				
				this.tabs = 1			
			}
		}
		,
		components: {
			PlanUpgrade,
			PlanDetails,
		}
	}
</script>


<style lang="sass">
	.plans-panel
		position: relative
		padding: 15px
		padding-bottom: 80px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			padding-bottom: 10px
			background-color: #C6DBF4
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 200px
				bottom: -60px
				right: 0
				opacity: 0.3

			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					vertical-align: middle

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 15px
				color: white
				letter-spacing: 2px
				margin-top: 5px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				padding-left: 30px
				margin-top: 8px
				color: white
		.content
			.v-tabs
				.v-tab
					max-width: none !important
					width: 50%
					font-weight: 600
					&.v-tab--active
						box-shadow: 0px 0px 15px -10px black
			.content-subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 15px
				margin-top: 15px
				margin-left: -15px
				letter-spacing: 1px

			.stepper-outter
				padding-left: 15%
				padding-right: 15%
				.stepper-inner
					.v-stepper
						border-radius: 0
						.v-stepper__header
							.v-stepper__step
								.v-stepper__label
									font-family: Raleway
									text-transform: uppercase
									font-size: 13px
									font-weight: 500
						.v-stepper__content
							padding-left: 0
							padding-right: 0
							padding-bottom: 0
							.step-header
								padding-top: 50px
								padding-bottom: 90px
								padding-left: 24px
								padding-right: 24px
								.step-header-title
									color: #25a8e0
									font-family: Raleway
									letter-spacing: 1px
									text-align: center
									font-size: 28px
									text-transform: uppercase
									font-weight: 800
								.step-header-description
									position: relative
									font-family: Raleway
									letter-spacing: 1px
									text-align: center
									font-size: 20px
									text-transform: uppercase
									font-weight: 700
									color: #888
									&:before
										position: absolute
										content: ''
										height: 2px
										width: 50px
										background: #888
										bottom: -10px
										margin-left: auto
										margin-right: auto
										left: 0
										right: 0
							.step-subcontent
								background-color: #f3f3f3
								padding-left: 24px
								padding-right: 24px
								padding-top: 50px
								padding-bottom: 50px

								.v-form
									padding-left: 20%
									padding-right: 20%
									padding-top: 25px
									padding-bottom: 0
									.v-text-field
										label
											font-size: 12pt
											color: #999999
											font-family: Raleway, sans-serif
									.v-input--switch
										label
											font-size: 12pt
											font-family: Raleway, sans-serif
											font-weight: 700
									.flex-center
										display: flex
										flex-direction: column
										align-items: center
									.v-input--radio-group
										margin-top: 0px
										.v-input__slot
											margin-bottom: 0
										.v-radio
											.v-input--selection-controls__ripple
												z-index: 10
								.v-tabs
									.v-tab
										max-width: none !important
										//width: 20%
										font-weight: 600
										&.v-tab--active
											box-shadow: 0px 0px 15px -10px black

								.storage-plan-card
									border-radius: 0 !important
									transition: 0.2s linear all
									&.active
										transition: 0.2s linear all
										background-color: rgba(137, 218, 250, 0.3)
										.v-card__title
											color: #528FB9
											border-bottom: 2px solid #528FB9
										.v-card__text
											border: 1px solid rgba(95, 164, 212, 0.2)
									&:focus
										background: transparent !important
									&:not(.active):focus
										background: rgba(137, 218, 250, 0.3)
										&:before
											opacity: 0 !important
									.v-card__title
										display: block
										background-color: white
										font-family: Raleway
										color: rgba(0, 0, 0, 0.3)
										letter-spacing: 1px
										text-align: center
										font-size: 18px
										font-weight: 700
										text-transform: uppercase

									.v-card__text
										height: 100%
										min-height: 250px
										border: 1px solid rgba(0, 0, 0, 0.1)
										padding: 15px
										padding-bottom: 80px
										text-align: center
										font-family: Raleway
										.storage-plan-title
											font-size: 20px
											text-transform: uppercase
											margin-top: 25px
											margin-bottom: 25px
											font-weight: 800
										.storage-plan-description
											font-size: 16px
											margin-top: 15px
											margin-bottom: 25px
											font-weight: 500
										.storage-plan-price
											font-size: 20px
											font-weight: 500
										.storage-plan-f-price
											font-size: 17px
											font-weight: 500
											text-decoration: line-through
										.v-btn.get-plan-btn.elevation-0
											position: absolute
											bottom: 25px
											left: 0
											right: 0
											margin-left: auto
											margin-right: auto
											.v-btn__content
												font-family: Raleway
												letter-spacing: 1px
												padding-left: 25px
												padding-right: 25px
												font-size: 14px
												text-transform: none
										.v-btn.current-plan-btn.elevation-0
											position: absolute
											bottom: 25px
											left: 0
											right: 0
											margin-left: auto
											margin-right: auto
											.v-btn__content
												font-family: Raleway
												letter-spacing: 1px
												padding-left: 25px
												padding-right: 25px
												font-size: 14px
												text-transform: none
								.summary-card
									border-radius: 0 !important
									.v-card__text
										height: 100%
										min-height: 200px
										border: 1px solid rgba(0, 0, 0, 0.1)
										padding: 15px
										padding-bottom: 30px
										padding-top: 30px
										text-align: center
										font-family: Raleway
										.summary-title
											font-size: 20px
											color: #555
											position: relative
											text-transform: uppercase
											font-weight: 700
											letter-spacing: 1px
											margin-bottom: 35px
											&:before
												position: absolute
												content: ''
												height: 2px
												width: 50px
												background: #555
												bottom: -10px
												margin-left: auto
												margin-right: auto
												left: 0
												right: 0

										.summary-field
											.summary-name
												display: inline-block
												padding-right: 7px
												text-transform: uppercase
												font-weight: 600
											.summary-value
												display: inline-block
								.disclaimer
									text-align: center
									font-family: Raleway
									font-size: 18px
									text-transform: uppercase
									font-weight: 600
									padding-top: 30px
									padding-bottom: 30px
									padding-left: 25px
									padding-right: 25px
									letter-spacing: 1px
									.sentence
										color: #666
										display: inline-block
										margin-right: 5px
									.link
										display: inline-block
										margin-right: 5px
										a
											text-decoration: none

	@media only screen and (min-width: 1905px)
		.plans-panel
			.content
	@media only screen and (max-width: 1904px)
		.plans-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.plans-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 960px)
		.plans-panel
			padding: 0
			padding-bottom: 50px
			.subsection-header
				padding-left: 90px
				padding-bottom: 15px
				.subsection-description
					display: block
					margin-left: 0
					margin-top: 0
					padding-left: 0
					font-size: 12pt
				.subsection-header-icon
					position: absolute
					top: 0
					bottom: 0
					margin-top: auto
					margin-bottom: auto
					height: 70%
					left: 10px
					img
						height: 100%
				.subsection-title
					margin-top: 0
					margin-left: 0
					display: block
					padding-left: 0
					font-size: 20pt
			.content
				padding: 0
				.content-subtitle
					margin-left: 0
				.stepper-outter
					padding-left: 0
					padding-right: 0
					.step-header
						padding-left: 0 !important
						padding-right: 0 !important
						padding-top: 30px !important
						padding-bottom: 40px !important
						.step-header-description
							padding-left: 10px !important
							padding-right: 10px !important
					.step-subcontent
						padding-left: 0 !important
						padding-right: 0 !important
						padding-bottom: 10px !important
						padding-top: 0px !important
						.v-form
							padding-left: 15px !important
							padding-right: 15px !important
							padding-top: 25px
						.v-tabs
							.v-slide-group__prev
								display: none !important
						.v-tabs-items
							background-color: #f3f3f3 !important

						.storage-plan-card
							margin-top: 15px
							.v-card__text
								padding-bottom: 80px !important

					.stepper-inner
						.v-stepper
							.v-stepper__header
								.v-stepper__step
									.v-stepper__label
							.v-stepper__content
								margin-left: 0 !important
								width: 100%
</style>