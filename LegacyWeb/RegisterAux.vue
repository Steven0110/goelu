<template lang="pug">
	.register
		.register-menu
			index-menu
		.register-header
			a(href="https://goelu.com/") 
				img(src="/assets/images/goelU.svg")
			img(src="/assets/icons/mayor.svg")
			span.subscribe
				|{{ $t('subscribe') }}
		.register-banner
		.stepper-outter
			.stepper-inner

				//Mobile Stepper
				v-stepper(v-model="step", vertical, v-if="verticalStepper")

					v-stepper-step(step="1", :complete="isCompleted(1)")
						|{{ $t('account-info') }}
					v-divider
					v-stepper-content(step="1")
						.step-header
							.step-header-title
								|{{ $t('step-1') }}
							.step-header-description
								|{{ $t('create-your-account') }}
						.step-subcontent
							v-form(ref="registerForm")
								v-text-field(
									append-icon="mdi-account",
									v-model="register.fullname",
									:label="$t('full-name')",
									background-color="transparent",
									:rules="form.validations.fullname",
									outlined,
									dense,
									required)
								v-text-field(
									append-icon="mdi-email",
									v-model="register.email",
									:label="$t('email-address')",
									background-color="transparent",
									:rules="form.validations.email",
									outlined,
									dense,
									required)
								v-menu(
									ref="menu",
									v-model="menu",
									:close-on-content-click="false",
									:return-value.sync="register.birthdate",
									transition="scale-transition",
									offset-y,
									min-width="290px",
									max-width="290px")
									template(v-slot:activator="{ on, attrs }")
										v-text-field(
											append-icon="mdi-calendar",
											v-model="register.birthdate",
											:rules="form.validations.age",
											:label="$t('birthdate')",
											background-color="transparent",
											v-bind="attrs",
											v-on="on",
											readonly,
											outlined,
											dense,
											required)
									v-date-picker(
										ref="picker"
										v-model="register.birthdate",
										no-title,
										scrollable)
										v-spacer
										v-btn(text, color="primary", @click="menu = false")
											|Cancel
										v-btn(color="primary", @click="$refs.menu.save(register.birthdate)")
											|Ok
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.password",
									:label="$t('password')",
									:rules="form.validations.password",
									outlined,
									dense,
									background-color="transparent",
									@input="validate",
									type="password",
									required)
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.rpassword",
									:label="$t('re-enter-password')",
									:rules="form.validations.password",
									outlined,
									dense,
									background-color="transparent",
									@input="validate",
									type="password",
									required)
								.flex-center
									v-radio-group(v-model="register.gender" row)
										v-layout
											v-flex
												v-radio(
													:label="$t('male')",
													value="Male",
													color="#25a8e0"
												)
											v-flex
												v-radio(
													:label="$t('female')",
													value="Female",
													color="#25a8e0"
												)
											v-flex
												v-radio(
													:label="$t('rather-not')",
													value="Undefined",
													color="#25a8e0"
												)

								v-alert(color="warning", transition="scale-transition", v-show="ageError")
									|{{ ageError }}
								v-alert(color="warning", transition="scale-transition", v-show="error")
									|{{ error }}								

						v-btn.elevation-0(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
							|Back
						v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
							|{{ stepperContinue }}

					v-stepper-step(step="2", :complete="isCompleted(2)")
						|Plan
					v-divider

					v-stepper-content(step="2")
						.step-header
							.step-header-title
								|{{ $t('step-2') }}
							.step-header-description
								|{{ $t('customize-your-plan') }}
						.step-subcontent
							plan-customizer(v-model="plan")
								
						v-btn.elevation-0(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
							|Back
						v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
							|{{ stepperContinue }}
					v-stepper-step(step="3", :complete="isCompleted(3)")
						|{{ $t('payment') }}
					v-divider
					v-stepper-content(step="3")
						.step-header
							.step-header-title
								|{{ $t('step-3') }}
							.step-header-description
								|{{ $t('payment-information') }}
						.step-subcontent
							credit-card(v-model="payment.card")

							v-alert(color="warning", transition="scale-transition", v-show="error")
								|{{ error }}
							p.mt-6.mb-6.text-center(style="font-size:35px;font-weight: 700;color:#3d3d3d;")
								|or
							.text-center.mb-8
								v-btn(tile, color="#25a8e0", dark, x-large, @click="++step;paypalpayment=true")
									|Pay with Paypal
						v-btn(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
							|Back
						v-btn(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5")
							|{{ stepperContinue }}
					v-stepper-step(step="4", :complete="isCompleted(4)")
						|{{ $t('summary') }}
					v-divider

					v-stepper-content(step="4")
						.step-header
							.step-header-title
								|{{ $t('step-4') }}
							.step-header-description
								|{{ $t('check-information') }}
						.step-subcontent
							v-row
								v-col.pt-0.pb-0.pr-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('account-info') }}
											.summary-field
												.summary-name
													|{{ $t('full-name') }}:
												.summary-value
													|{{ register.fullname }}
											.summary-field
												.summary-name
													|{{ $t('email-address') }}:
												.summary-value
													|{{ register.email }}
								v-col.pt-0.pb-0.pr-0.pl-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('plan-info') }}
											.summary-field
												.summary-name.pr-0
													|{{ plan.years | yearsText }}
											.summary-field
												.summary-name.pr-0
													|{{ plan.storage | storageText }}
								v-col.pt-0.pb-0.pl-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('payment-info') }}
											.summary-field
												.summary-name
													|{{ $t('card') }}:
												.summary-value
													|{{ cardTermination }}
											.summary-field
												.summary-name
													|{{ $t('card-holder') }}:
												.summary-value
													|{{ payment.card.cardName }}
											.summary-field
												.summary-name
													|{{ $t('card-expiration-date') }}:
												.summary-value
													|{{ payment.card.cardMonth }} / {{ payment.card.cardYear }}
							.disclaimer
								.sentence
									|{{ $t('by-clicking-subscribe') }}
								.link
									a(href="https://www.iubenda.com/terms-and-conditions/82638648", target="_blank")
										|{{ $t('terms-of-use') }}
								.sentence
									|{{ $t('and') }}
								.link
									a(href="https://www.iubenda.com/privacy-policy/82638648", target="_blank")
										|{{ $t('privacy-policy') }}
						v-btn(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
							|{{ $t('back') }}						
						v-btn(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5" :disabled="paypalpayment && step > 3")
							|{{ stepperContinue }}
						div.elevation-0.text-center(ref="payment" v-show="paypalpayment")
					
					v-stepper-step(step="5", :complete="isCompleted(5)")
						|{{ $t('confirmation') }}
					v-divider

					v-stepper-content(step="5")
						.step-header
							.step-header-title
								|{{ $t('success') }}
							.step-header-description
								|{{ $t('now-you-can') }}
					v-btn(width="100%", tile, color="#25a8e0", dark, x-large, @click="$router.push({path: '/'})", v-show="step == 5")
						|${{ $t('login') }}

				
				//Desktop Stepper
				v-stepper(v-model="step", alt-labels, v-else)
					v-stepper-header
						v-stepper-step(step="1", :complete="isCompleted(1)")
							|{{ $t('account-info') }}
						v-divider
						v-stepper-step(step="2", :complete="isCompleted(2)")
							|Plan
						v-divider
						v-stepper-step(step="3", :complete="isCompleted(3)")
							|{{ $t('payment') }}
						v-divider
						v-stepper-step(step="4", :complete="isCompleted(4)")
							|{{ $t('summary') }}
						v-divider
						v-stepper-step(step="5", :complete="isCompleted(5)")
							|{{ $t('confirmation') }}

					v-stepper-content(step="1")
						.step-header
							.step-header-title
								|{{ $t('step-1') }}
							.step-header-description
								|{{ $t('create-your-account') }}
						.step-subcontent
							v-form(ref="registerForm")
								v-text-field(
									append-icon="mdi-account",
									v-model="register.fullname",
									:label="$t('full-name')",
									background-color="transparent",
									:rules="form.validations.fullname",
									outlined,
									dense,
									required)
								v-text-field(
									append-icon="mdi-email",
									v-model="register.email",
									:label="$t('email-address')",
									background-color="transparent",
									:rules="form.validations.email",
									outlined,
									dense,
									required)
								v-menu(
									ref="menu",
									v-model="menu",
									:close-on-content-click="false",
									:return-value.sync="register.birthdate",
									transition="scale-transition",
									offset-y,
									min-width="290px",
									max-width="290px")
									template(v-slot:activator="{ on, attrs }")
										v-text-field(
											append-icon="mdi-calendar",
											v-model="register.birthdate",
											:rules="form.validations.age",
											:label="$t('birthdate')",
											background-color="transparent",
											v-bind="attrs",
											v-on="on",
											readonly,
											outlined,
											dense,
											required)
									v-date-picker(
										ref="picker"
										v-model="register.birthdate",
										no-title,
										scrollable)
										v-spacer
										v-btn(text, color="primary", @click="menu = false")
											|Cancel
										v-btn(color="primary", @click="$refs.menu.save(register.birthdate)")
											|Ok
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.password",
									:label="$t('password')",
									:rules="form.validations.password",
									outlined,
									dense,
									background-color="transparent",
									@input="validate",
									type="password",
									required)
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.rpassword",
									:label="$t('re-enter-password')",
									:rules="form.validations.password",
									outlined,
									dense,
									background-color="transparent",
									@input="validate",
									type="password",
									required)
								.flex-center
									v-radio-group(v-model="register.gender" row)
										v-layout
											v-flex
												v-radio(
													:label="$t('male')",
													value="Male",
													color="#25a8e0"
												)
											v-flex
												v-radio(
													:label="$t('female')",
													value="Female",
													color="#25a8e0"
												)
											v-flex
												v-radio(
													:label="$t('rather-not')",
													value="Undefined",
													color="#25a8e0"
												)

								v-alert(color="warning", transition="scale-transition", v-show="error")
									|{{ error }}

					// 	DESKTOP STEPPER
					v-stepper-content(step="2")
						.step-header
							.step-header-title
								|{{ $t('step-2') }}
							.step-header-description
								|{{ $t('customize-your-plan') }}
						.step-subcontent

							plan-customizer(v-model="plan")

					v-stepper-content(step="3")
						.step-header
							.step-header-title
								|{{ $t('step-3') }}
							.step-header-description
								|{{ $t('payment-information') }}
						.step-subcontent
							credit-card(v-model="payment.card")

							v-alert(color="warning", transition="scale-transition", v-show="error")
								|{{ error }}
							p.mt-6.mb-6.text-center(style="font-size:35px;font-weight: 700;color:#3d3d3d;")
								|or	
							.text-center
								v-btn(tile, color="#25a8e0", dark, x-large, @click="++step;paypalpayment=true")
									|Pay with Paypal


					v-stepper-content(step="4")
						.step-header
							.step-header-title
								|{{ $t('step-4') }}
							.step-header-description
								|{{ $t('check-information') }}
						.step-subcontent
							v-row
								v-col.pt-0.pb-0.pr-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('account-info') }}
											.summary-field
												.summary-name
													|{{ $t('full-name') }}:
												.summary-value
													|{{ register.fullname }}
											.summary-field
												.summary-name
													|{{ $t('email-address') }}:
												.summary-value
													|{{ register.email }}
								v-col.pt-0.pb-0.pr-0.pl-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('plan-info') }}
											.summary-field
												.summary-name.pr-0
													|{{ plan.years | yearsText }}
											.summary-field
												.summary-name.pr-0
													|{{ plan.storage | storageText }}
								v-col.pt-0.pb-0.pl-0(md="4", cols="12")
									v-card.summary-card.elevation-0()
										v-card-text
											.summary-title
												|{{ $t('payment-info') }}
											.summary-field
												.summary-name
													|{{ $t('card') }}:
												.summary-value
													|{{ cardTermination }}
											.summary-field
												.summary-name
													|{{ $t('card-holder') }}:
												.summary-value
													|{{ payment.card.cardName }}
											.summary-field
												.summary-name
													|{{ $t('card-expiration-date') }}:
												.summary-value
													|{{ payment.card.cardMonth }} / {{ payment.card.cardYear }}
							.disclaimer
								.sentence
									|{{ $t('by-clicking-subscribe') }}
								.link
									a(href="https://www.iubenda.com/terms-and-conditions/82638648", target="_blank")
										|{{ $t('terms-of-use') }}
								.sentence
									|{{ $t('and') }}
								.link
									a(href="https://www.iubenda.com/privacy-policy/82638648", target="_blank")
										|{{ $t('privacy-policy') }}
					

					v-stepper-content(step="5")
						.step-header
							.step-header-title
								|{{ $t('success') }}
							.step-header-description
								|{{ $t('now-you-can') }}
						.step-subcontent
							v-img.mx-auto(src="/assets/images/goelu_promote_video.svg", width="60%", align="center")
				.actions-container(v-if="!verticalStepper")
					v-btn.elevation-0(width="50%", tile, color="white", x-large, @click="decreaseStep", v-show="step != 5")
						|{{ $t('back') }}					
					v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large, :loading="status.stepLoading", @click="increaseStep", v-show="step != 5" :disabled="paypalpayment && step > 3")
						|{{ stepperContinue }}
					div.elevation-0.text-center(ref="payment" v-show="paypalpayment")
					v-btn.elevation-0(width="100%", tile, color="#25a8e0", dark, x-large, @click="$router.push({path: '/'})", v-show="step == 5")
						|{{ $t('login') }}

		p.already-registered
			router-link(:to="{path: '/'}")
				|{{ $t('are-you-already') }}
</template>
<script>
	import CreditCard 		from "@/components/misc/CreditCard.vue"
	import PlanCustomizer 	from "@/components/misc/PlanCustomizer.vue"
	import IndexMenu 		from "@/components/dashboard/elements/IndexMenu.vue"
	

	export default {
		data() {
			return {
				register: {
					fullname: "",
					email: "",
					remail: "",
					password: "",
					rpassword: "",
					gender: "Male",
					birthdate: null
				},
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
					storage: 100,
					years: 10
				},
				menu: false,
				step: 1,
				tabs: null,
				error: "",
				ageError: "",
				paypalpayment:false,
				form: {
					validations: {
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
				      	],
				      	password: [
				        	v => !!v || 'Password is required',
				        	v => this.register.password === this.register.rpassword || 'Passwords don\'t match',
				      	],
				      	fullname: [
				        	v => !!v || 'Full name is required',
				      	],
				      	age: [
				        	v => this.userAge >= 18 || "You must be 18 to register an account",
				      	]
					}
				}
			}
		},
		mounted() {
			Conekta.setLanguage("en")
			Conekta.setPublicKey( this.$conektaPublic )
			const script = document.createElement("script");
			//script.src = "https://www.paypal.com/sdk/js?client-id=AS5mxQtc3jilt3FjWbikvILU0X-BvXOiMQ8WtoJEdmjJS0pMY92CIVsf0mUFn4g6PWiZeEPMjC_14QVO&locale=en_US"; test
			script.src = "https://www.paypal.com/sdk/js?client-id=AWzWI73Mql6zuCFZfsTdvwksVSJ_1xk25LzHGmPqMsXj4iqitVxy3GH0qG0Q83gxY_H1DPk1E6-g0v7_&locale=en_US";
			script.addEventListener("load", this.setLoaded);
			document.body.appendChild(script)						
		},
		filters: {
			yearsText: function( value ) {
				if( value == 1 )
					return `${value} year`
				else
					return `${value} years`
			},
			storageText: function( value ) {
				return `${value} GB STORAGE`
			},
		},
		methods: {
			submitRegisterPaypal: function() {
				let chosenPlan = this.plan
				let body = {
						password: this.register.password,
						name: this.register.fullname,
						email: this.register.email,
						gender: this.register.gender,
						cardToken: "paypal",						
						plan: {
							endDate: chosenPlan.endDate,
							name: chosenPlan.name,
							cost: chosenPlan.cost,
							coupon: chosenPlan.coupon
						}
					}
					let url = this.baseApi + this.env + "user/register"
					this.axios.post(url, body)
					.then(result => {
							if( result.data.code && result.data.code == 1){
								++this.step
								this.$gtag.event('confirmation',{
									'event_category': 'register'})
								this.paypalpayment=false
							}
							else{
								this.$swal("Error in payment", result.data.response.message, "warning")
								this.paypalpayment=false
								this.step = 3
							}
						})
						.catch(err => {
							if( err.response && err.response.status ){
								if( err.response.status == 400 ){ //Error al procesar el cargo
									console.log(JSON.stringify( err.response.data ))
								}else if( err.response.status == 500 ){
									console.error( err )
									this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
								}
							}else if(err.message_to_purchaser){
								this.step = 3
								this.$swal("Error while processing the card", err.message_to_purchaser, "warning")
							}else
								this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
						})
						.finally(() => this.status.stepLoading = false )
			},
			setLoaded: function(){				
				window.paypal.Buttons({
					style: {
						layout: 'horizontal',
						tagline: 'false',
						color: 'blue',
						label: 'checkout'					
					},
					createOrder: (data, actions) => {											
          				return actions.order.create({
            				purchase_units: [{
								description:"Pago membresia",
              					amount: {
                					value: this.plan.cost
              					}
            				}]
          				});
        			},
        			onApprove: async (data, actions, resp) => {
          				const order= await actions.order.capture();
						this.status.stepLoading = true
						this.submitRegisterPaypal()
        			},
					onError: err => {
						alert(err)
					}
				}).render(this.$refs.payment)
			},
			tokenizeCard: function(tokenBody){
				return new Promise((resolve, reject) => {
					Conekta.Token.create(tokenBody, token => resolve( token ), err => reject( err ))
				})
			},
			submitRegister: function(){
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
						password: this.register.password,
						name: this.register.fullname,
						email: this.register.email,
						gender: this.register.gender,
						cardToken: tokenId,
						plan: {
							endDate: chosenPlan.endDate,
							name: chosenPlan.name,
							cost: chosenPlan.cost,
							coupon: chosenPlan.coupon
						}
					}

					let url = this.baseApi + this.env + "user/register"
					return this.axios.post(url, body)
				})
			},
			back: function(){
				this.$router.push({path: "/login"})
			},
			isCompleted: function(i) {
				return i < this.step
			},
			validate: function(){
				return this.$refs.registerForm.validate()
			},
			validateCard: function() {
				if(this.payment.card.cardName && this.payment.card.cardNumber && this.payment.card.cardYear && this.payment.card.cardMonth && this.payment.card.cardCvv ){
					this.error = ""
					return true
				}else
					return false
			},
			checkEmail: function(email) {
				let body = {email: email}
				let url = this.baseApi + this.env + "check-email"
				return this.axios.post(url, body)
			},
			decreaseStep: function() {
				if( this.step > 1 ){
					--this.step
					this.paypalpayment= false
				}
			},
			increaseStep: function() {
				switch( this.step ){
					case 1:						
						/*	Valida el formulario de registro y que el correo sea válido 	*/						
						if( this.validate() ){
							this.status.stepLoading = true
							this.checkEmail( this.register.email )
							.then(result => ++this.step,this.error = "",
								this.$gtag.event('plan',{
									'event_category': 'register'})
								)
							.catch( err => this.error = "This email is already registered." )
							.finally(() => this.status.stepLoading = false )
						}
						break
					case 2:						
						++this.step						
						this.$gtag.event('payment',{
									'event_category': 'register'})												
						break
					case 3:
						if( this.validateCard() ){
							++this.step
							this.$gtag.event('summary',{
									'event_category': 'register'})							
						}
						else
							this.error = "Please fill in all the fields"
						break
					case 4:
						/*	Confirma el registro 	*/
						this.status.stepLoading = true
						this.submitRegister()
						.then(result => {
							if( result.data.code && result.data.code == 1){
								++this.step
								this.$gtag.event('confirmation',{
									'event_category': 'register'})								
							}
							else{
								this.$swal("Error in payment", result.data.response.message, "warning")
								this.step = 3
							}
						})
						.catch(err => {
							if( err.response && err.response.status ){
								if( err.response.status == 400 ){ //Error al procesar el cargo
									console.log(JSON.stringify( err.response.data ))
								}else if( err.response.status == 500 ){
									console.error( err )
									this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
								}
							}else if(err.message_to_purchaser){
								this.step = 3
								this.$swal("Error while processing the card", err.message_to_purchaser, "warning")
							}else
								this.$swal("Error during the process", "Please try it again, if the problem persists, please let us know to contact@goelu.com", "warning")
						})
						.finally(() => this.status.stepLoading = false )
						break
					case 5:
						break
				}
			},
		},
		computed: {
			stepperContinue: function() {
				if( this.step == 4 )
					return this.$t('subscribe')
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
			userAge: function() {
				if( this.register.birthdate ){
					let birth = new Date( this.register.birthdate )
					let today = new Date()

					//let age = today.getFullYear() - birth.getFullYear()
					let age = (today - birth) / 1000 / 60 / 60 / 24 / 365.3
					return Math.floor( age )
				}else
					return null
			}
		},
		watch: {
        	menu (val) {
            	val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        	}
    	},
		components: {
			CreditCard,
			PlanCustomizer,
			IndexMenu
		}
	}
</script>

<style lang="sass">
	.register
		padding-bottom: 50px
		.register-header
			text-align: center
			background-color: white
			padding-top: 25px
			padding-bottom: 25px
			margin-top: 9vh
			img
				vertical-align: middle
				display: inline-block
				margin-left: 25px
				margin-right: 25px
				&:nth-child(1)
					height: 75px
				&:nth-child(2)
					width: 20px
			span
				display: inline-block
				font-family: Raleway
				font-weight: 700
				font-size: 35px
				text-transform: uppercase
				vertical-align: top
				letter-spacing: 1px
				margin-top: 12px
				margin-left: 15px

		.already-registered
			text-align: center
			color: #aaa
			font-family: Raleway, sans-serif
			font-weight: 700
			padding-top: 25px
			a
				padding-left: 5px
				font-size: 12pt
				font-family: Raleway, sans-serif
				font-weight: 800
				color: #25a8e0
				text-decoration: none
				&:hover
					color: #25a8e0
					text-decoration: none
		.register-banner
			height: 125px
			background-color: #25a8e0

		.stepper-outter
			padding-left: 15%
			padding-right: 15%
			.stepper-inner
				margin-top: -65px
				.v-stepper
					border-radius: 0
					.v-stepper__header
						.v-stepper__step
							.v-stepper__label
								font-family: Raleway
								text-transform: uppercase
								font-size: 13px
								font-weight: 500
								text-align: center !important
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
									width: 20%
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

		.register-panel
			padding-top: 10px
			background-color: rgba(255, 255, 255, 0.9)
			height: 100vh
			position: relative
			padding-bottom: 3px
			overflow-y: auto

			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar
				width: 10px
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar-thumb
				background-color: #32343d

	@media only screen and (max-width: 1264px)
		.register
	@media only screen and (max-width: 960px)
		.register
			.register-header
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
					margin-top: -65px
					.v-stepper
						.v-stepper__header
							.v-stepper__step
								.v-stepper__label
						.v-stepper__content
							margin-left: 0 !important
							width: 100%
</style>