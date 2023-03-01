<template lang="pug">
	.plan-upgrade
		.content
			.stepper-outter
				.stepper-inner
					v-stepper(v-model="step", vertical, v-if="verticalStepper")
						v-stepper-step(step="1", :complete="isCompleted(1)")
							|Plan
						v-divider

						v-stepper-content(step="1")
							.step-header
								.step-header-title
									|{{$t('step-1')}}
								.step-header-description
									|{{$t('customize-your-plan')}}
							.step-subcontent
								plan-customizer(v-model="plan", :minYears="minYears", :minStorage="minStorage")

							v-btn(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
								|{{$t('back')}}
							v-btn(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
								|{{ stepperContinue }}
						v-stepper-step(step="2", :complete="isCompleted(2)")
							|{{$t('payment')}}
						v-divider
						v-stepper-content(step="2")
							.step-header
								.step-header-title
									|{{$t('step-2')}}
								.step-header-description
									|{{$t('payment-information')}}
							.step-subcontent
								credit-card(v-model="payment.card")

								v-alert(color="warning", transition="scale-transition", v-show="error")
									|{{ error }}
							v-btn(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
								|{{$t('back')}}
							v-btn(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
								|{{ stepperContinue }}
						v-stepper-step(step="3", :complete="isCompleted(3)")
							|{{$t('summary')}}
						v-divider

						v-stepper-content(step="3")
							.step-header
								.step-header-title
									|{{$t('step-3')}}
								.step-header-description
									|{{$t('check-information')}}
							.step-subcontent
								v-row
									v-col.pt-0.pb-0.pr-0.pl-0(md="6", cols="12")
										v-card.summary-card.elevation-0()
											v-card-text
												.summary-title
													|{{$t('plan-info')}}
												.summary-field
													.summary-name.pr-0
														|{{ plan.yearsText }}
												.summary-field
													.summary-name.pr-0
														|{{ plan.storageText }} {{$t('m-storage')}}
									v-col.pt-0.pb-0.pl-0(md="6", cols="12")
										v-card.summary-card.elevation-0()
											v-card-text
												.summary-title
													|{{$t('payment-info')}}
												.summary-field
													.summary-name
														|{{$t('card')}}:
													.summary-value
														|{{ cardTermination }}
												.summary-field
													.summary-name
														|{{$t('card-holder')}}:
													.summary-value
														|{{ payment.card.cardName }}
												.summary-field
													.summary-name
														|{{$t('card-expiration')}}:
													.summary-value
														|{{ payment.card.cardMonth }} / {{ payment.card.cardYear }}
								.disclaimer
									.sentence
										|{{$t('by-clicking-subscribe')}}
									.link
										a(:href="terminos", target="_blank")
											|{{$t('terms-of-use')}}
									.sentence
										|{{$t('and')}}
									.link
										a(:href="policy", target="_blank")
											|{{$t('privacy-policy')}}
							v-btn(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
								|{{$t('back')}}
							v-btn(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
								|{{ stepperContinue }}
						
						v-stepper-step(step="5", :complete="isCompleted(5)")
							|{{$t('confirmation')}}
						v-divider

						v-stepper-content(step="5")
							.step-header
								.step-header-title
									|{{$t('success')}}
								.step-header-description
									|{{$t('plan-has-been-update"')}}
						v-btn(width="100%", tile, color="#25a8e0", dark, x-large, @click="$router.push({path: '/dashboard'})", v-show="step == 4")
							|{{$t('buttom-finish')}}

					v-stepper(v-model="step", alt-labels, v-else)
						v-stepper-header
							v-stepper-step(step="1", :complete="isCompleted(1)")
								|Plan
							v-divider
							v-stepper-step(step="2", :complete="isCompleted(2)")
								|{{$t('payment')}}
							v-divider
							v-stepper-step(step="3", :complete="isCompleted(3)")
								|{{$t('summary')}}
							v-divider
							v-stepper-step(step="4", :complete="isCompleted(4)")
								|{{$t('confirmation')}}

						// 	DESKTOP STEPPER
						v-stepper-content(step="1")
							.step-header
								.step-header-title
									|{{$t('step-1')}}
								.step-header-description
									|{{$t('plan-header-description')}}
							.step-subcontent
								plan-customizer(v-model="plan", :minYears="minYears", :minStorage="minStorage")

						v-stepper-content(step="2")
							.step-header
								.step-header-title
									|{{$t('step-2')}}
								.step-header-description
									|{{$t('payment-information')}}
							.step-subcontent
								credit-card(v-model="payment.card")

								v-alert(color="warning", transition="scale-transition", v-show="error")
									|{{ error }}


						v-stepper-content(step="3")
							.step-header
								.step-header-title
									|{{$t('step-3')}}
								.step-header-description
									|{{$t('check-information')}}
							.step-subcontent
								v-row
									v-col.pt-0.pb-0.pr-0.pl-0(md="6", cols="12")
										v-card.summary-card.elevation-0()
											v-card-text
												.summary-title
													|{{$t('plan-info')}}
												.summary-field
													.summary-name
														|{{ plan.yearsText }}
												.summary-field
													.summary-name
														|{{ plan.storageText }} {{$t('m-storage')}}
									v-col.pt-0.pb-0.pl-0(md="6", cols="12")
										v-card.summary-card.elevation-0()
											v-card-text
												.summary-title
													|{{$t('payment-info')}}
												.summary-field
													.summary-name
														|{{$t('card')}}:
													.summary-value
														|{{ cardTermination }}
												.summary-field
													.summary-name
														|{{$t('card-holder')}}:
													.summary-value
														|{{ payment.card.cardName }}
												.summary-field
													.summary-name
														|{{$t('card-expiration')}}:
													.summary-value
														|{{ payment.card.cardMonth }} / {{ payment.card.cardYear }}
								.disclaimer
									.sentence
										|{{$t('by-clicking')}}
									.link
										a(:href="terminos", target="_blank")
											|{{$t('terms-of-use')}}
									.sentence
										|{{$t('and')}}
									.link
										a(:href="policy", target="_blank")
											|{{$t('privacy-policy')}}
						

						v-stepper-content(step="4")
							.step-header
								.step-header-title
									|{{$t('success')}}
								.step-header-description
									|{{$t('plan-has-been-update')}}
							.step-subcontent
					.actions-container(v-if="!verticalStepper")
						v-btn.elevation-0(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 4")
							|{{$t('back')}}
						v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 4")
							|{{ stepperContinue }}
						v-btn.elevation-0(width="100%", tile, color="#25a8e0", dark, x-large, @click="$router.push({path: '/dashboard'})", v-show="step == 4")
							|{{$t('buttom-finish')}}
</template>


<script>
	import CreditCard from "@/components/misc/CreditCard.vue"
	import PlanCustomizer 	from "@/components/misc/PlanCustomizer.vue"
	export default {
		data() {
			return {
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
			Conekta.setLanguage("en")
			Conekta.setPublicKey( this.$conektaPublic )

		},
		methods: {
			tokenizeCard: function(tokenBody){
				return new Promise((resolve, reject) => {
					Conekta.Token.create(tokenBody, token => resolve( token ), err => reject( err ))
				})
			},
			updatePlan: function(){
				this.status.stepLoading = true

				let chosenPlan = this.plan

				/*		Se hace tokeniza la tarjeta 		*/
				let tokenBody = {
					"card": {
						"number": this.payment.card.cardNumber.replace(" ", ""),
						"name": this.payment.card.cardName,
						"exp_year": this.payment.card.cardYear,
						"exp_month": this.payment.card.cardMonth,
						"cvc": this.payment.card.cardCvv,
						"address": {
							"street1": "Loma de Los Juanes",
							"street2": "Olivar de los Padres",
							"city": "Ciudad de Mexico",
							"state": "Distrito Federal",
							"zip": "01780",
							"country": "Mexico"
						}
					}
				}

				return this.tokenizeCard( tokenBody )
				.then( token => {
					let tokenId = token.id

					let body = {
						card: {
							cardToken: tokenId,
							name: this.payment.card.cardName
						},
						plan: {
							endDate: chosenPlan.endDate,
							name: chosenPlan.name,
							cost: chosenPlan.cost,
						}
					}

					let url = this.baseApi + this.env + "user/plan-update"
					return this.axios.post(url, body)
				})
			},
			back: function(){
				this.$router.push({path: "/login"})
			},
			isCompleted: function(i) {
				return i < this.step
			},
			validateCard: function() {
				if(this.payment.card.cardName && this.payment.card.cardNumber && this.payment.card.cardYear && this.payment.card.cardMonth && this.payment.card.cardCvv ){
					this.error = ""
					return true
				}else
					return false
			},
			decreaseStep: function() {
				if( this.step > 1 )
					--this.step
			},
			increaseStep: function() {
				switch( this.step ){
					case 1:
						++this.step
						break
					case 2:
						if( this.validateCard() )
							++this.step
						else
							this.error = "Please fill in all the fields"
						break
					case 3:
						/*	Actualiza el plam 	*/
						this.status.stepLoading = true
						let chosenPlan = this.plan

						this.updatePlan()
						.then(result => {
							console.log(result.data.code)
							if( result.data.code && result.data.code == 1){

								chosenPlan.endDate = new Date(chosenPlan.endDate).toISOString()

								this.$store.commit("setPlan", chosenPlan)
								++this.step
							}else{
								if( result.data.response.message ){
									this.$swal("Error in payment", result.data.response.message, "warning")
									this.step = 2
								}else{
									this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
								}
							}
						})
						.catch(err => {
							console.log( err )
							if( err.response && err.response.status ){
								if( err.response.status == 400 ){ //Error al procesar el cargo
									console.log(JSON.stringify( err.response.data ))
								}else if( err.response.status == 500 ){
									console.error( err )
									this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
								}
							}else if(err.message_to_purchaser){
								this.step = 2
								this.$swal("Error while processing the card", err.message_to_purchaser, "warning")
							}else
								this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
						})
						.finally(() => this.status.stepLoading = false )
						break
					case 4:
						break
				}
			},
		},
		computed: {
			terminos:function(){
				if(this.$i18n.locale == 'en' )
					return "https://www.iubenda.com/terms-and-conditions/82638648"
				else
					return "https://www.iubenda.com/condiciones-de-uso/94397736"
			},
			policy:function(){
				if(this.$i18n.locale == 'en' )
					return "https://www.iubenda.com/privacy-policy/82638648"
				else
					return "https://www.iubenda.com/privacy-policy/94397736"
			},
			stepperContinue: function() {
				if( this.step == 3 )
					return this.$t('pay')
				else
					return this.$t('continue')
			},
			cardTermination: function() {
				if(this.payment.card && this.payment.card.cardNumber ){
					return "**** **** ****" + this.payment.card.cardNumber.substr( this.payment.card.cardNumber.length - 4 )
				}else{
					return ""
				}
			},
			altLabels: function() {

				if(this.$vuetify.breakpoint.width > 960)
					return true
				else
					return false
			},
			verticalStepper: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true

			},
			minYears: function() {
				if( this.$store.getters.user && this.$store.getters.user.plan && this.$store.getters.user.plan.name){
					let name = this.$store.getters.user.plan.name
					return Number(name.split(" - ")[0].split(" ")[0]) + 1
				}else{
					return 1
				}
			},
			minStorage: function() {
				if( this.$store.getters.user && this.$store.getters.user.plan && this.$store.getters.user.plan.name){
					let name = this.$store.getters.user.plan.name
					return Number(name.split(" - ")[1].split(" ")[0]) + 20
				}else{
					return 20
				}
			},
		},
		components: {
			CreditCard,
			PlanCustomizer
		}
	}
</script>


<style lang="sass">
	.plan-upgrade
		position: relative
		padding-top: 15px
		background-color: rgba(0, 0, 0, 0.05)
		min-height: 100%
		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 10px
			padding-bottom: 10px
			background-color: #bbd2f0
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 200px
				bottom: -35px
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
		.plan-upgrade
			.content
	@media only screen and (max-width: 1904px)
		.plan-upgrade
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 1264px)
		.plan-upgrade
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 960px)
		.plan-upgrade
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
				padding: 15px
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