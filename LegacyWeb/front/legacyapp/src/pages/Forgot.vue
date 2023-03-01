<template lang="pug">
	.forgot
		v-row
			v-col.pt-0(cols="12", md="5")
				v-row
					v-col.forgot-panel(cols="12")
						v-row
							v-col.forgot-topbar(cols="12", md="8", offset-md="2")
								v-icon(color="black", size="30", @click="back")
									|mdi-arrow-left-thick
						v-row
							v-col.pt-0(cols="12", md="8", offset-md="2")
								p.welcome-message
									|{{ $t("reset-your-password") }}
								v-form(ref="forgotForm")
									v-text-field(
										append-icon="mdi-email",
										v-model="forgot.email",
										:label="$t('email-address')",
										background-color="transparent",
										:rules="form.validations.email",
										outlined,
										dense,
										required)
										
									v-alert(color="success", transition="scale-transition", v-show="message")
										|{{ message }}

									v-text-field(
										v-if="stage == 'code' || stage == 'reset'",
										append-icon="mdi-lock",
										v-model="forgot.code",
										:label="$t('verification-code')",
										:rules="form.validations.code",
										outlined,
										dense,
										background-color="transparent",
										type="text",
										required)
									v-text-field(
										v-if="stage == 'reset'",
										append-icon="mdi-lock",
										v-model="forgot.password",
										:label="$t('password')",
										:rules="form.validations.password",
										outlined,
										dense,
										background-color="transparent",
										@input="validate",
										type="password",
										required)
									v-text-field(
										v-if="stage == 'reset'",
										append-icon="mdi-lock",
										v-model="forgot.rpassword",
										:label="$t('reenter-password')",
										:rules="form.validations.password",
										outlined,
										dense,
										background-color="transparent",
										@input="validate",
										type="password",
										required)

									v-alert(color="warning", transition="scale-transition", v-show="error")
										|{{ error }}
									v-btn(
										color="#2963b4",
										:loading="loading",
										raised,
										block,
										x-large,
										@click="proceed")
										|{{ buttonText }}
								
								p.forgot-message.text-center
									span
										|{{ $t("go-back-to") }}
									span
										router-link(:to="{path: '/login'}")
											|{{ $t("login-btn") }}
								.copyright
									p
										|Copyright &copy; 2020
									p
										span
											router-link(:to="{path: '/'}")
												|{{ $t("terms-of-use") }} 
										span
											|/ 
										span
											router-link(:to="{path: '/'}")
												|{{ $t("privacy-policy") }} 

			v-col(cols="12", md="7").d-none.d-md-block
				.contact
					.social-networks
						.social-icon
							a(href="https://www.facebook.com/Goelu-106499030889439", target="_blank")
								v-img(src="assets/icons/ic_facebook.svg")
						.social-icon
							a(href="https://twitter.com/GoelU", target="_blank")
								v-img(src="assets/icons/ic_twitter.svg")
						.social-icon
							a(href="https://www.instagram.com/goelu_official/", target="_blank")
								v-img(src="assets/icons/ic_instagram.svg")
					.contact-info
						.contact-item
							.contact-icon
								v-img(src="assets/icons/ic_communicate.svg")
							span
								|contact@goelu.com

</template>

<script>
	export default {
		data() {
			return {
				forgot: {
					email: "",
					remail: "",
					password: "",
					rpassword: "",
					code: ""
				},
				stage: "email",
				loading: false,
				buttonText: "Confirm",
				error: "",
				message: "",
				form: {
					validations: {
						email: [
				        	v => !!v || this.$t('email-is-required'),
				        	v => /.+@.+\..+/.test(v) || this.$t('email-must-be-valid'),
				      	],
				      	password: [
				        	v => !!v || this.$t('password-is-required'),
				        	v => this.forgot.password === this.forgot.rpassword || this.$t('unmatch-password'),
				      	],
				      	code: [
				        	v => !!v || this.$t("verification-code-required")
				      	]
					}
				}
			}
		},
		mounted() {
			if( !localStorage.getItem("locale") ){
				let lang = this.$route.query.lang || "en"
				localStorage.setItem("locale", lang)
			}else
				this.$i18n.locale = localStorage.getItem("locale")

			this.buttonText = this.$t("confirm")
		},
		methods: {
			proceed: function(){
				if( this.validate() ){
					this.loading = true
					this.error = ""
					this.message = ""

					let body
					if( this.stage == "email" ){
						body = {
							email: 	this.forgot.email
						}
					}else if( this.stage == "code" ){
						body = {
							email: 	this.forgot.email,
							code: 	this.forgot.code
						}
					}else{
						body = {
							email: 		this.forgot.email,
							password: 	this.forgot.password,
							code: 		this.forgot.code
						}
					}

					let url = this.baseApi + this.env + "legacy/forgot"
					this.axios.post(url, body)
					.then( response => {
						if( this.stage == "email" ){
							this.stage = "code"
							this.buttonText = this.$t("validate-code-btn")
							this.message = this.$t("validate-code-instructions")
							
						}else if( this.stage == "code" ){
							this.stage = "reset"
							this.buttonText = this.$t("reset-your-password")
						}else{
							this.buttonText = this.$t("confirm")
							this.$swal({
									title: this.$t("done"),
									text: this.$t("successful-reset"),
									type: "success",
									timer: 3000,
	  								showConfirmButton: false,
									onClose: () => {
										this.$router.push({path: "/login"})
									}
								})
						}
					})
					.catch( error => {
						this.loading = false
						if( error.response.status == 500 ){
							let message = error.response.data.errorMessage.split("|")[1]
							this.error = message
						}else if( error.response.status == 401 ){
							this.error = this.$t("invalid-email")
						}else if( error.response.status == 403 ){
							this.error = this.$t("invalid-code")
						}else
							this.$swal(this.$t("unknown-error"), JSON.stringify( error.response || error ), "warning")
					})
					.finally(() => {
						this.loading = false
					})
				}
			},
			back: function(){
				this.$router.go(-1)
			},
			validate: function(){
				return this.$refs.forgotForm.validate()
			}
		}
	}
</script>

<style lang="sass">
	.forgot
		background: url("/assets/images/slider.jpg")
		background-repeat: no-repeat
		background-size: cover
		background-position: center
		height: 100vh
		.forgot-panel
			padding-top: 10px
			background-color: rgba(255, 255, 255, 0.9)
			height: 100vh
			position: relative
			.forgot-topbar
				.v-icon
					margin-left: -3px
			.welcome-message
				font-size: 18pt
				font-family: Raleway, sans-serif
				font-weight: 800
				margin-bottom: 5px
			.simple-message
				font-size: 12pt
				font-family: Raleway, sans-serif
				font-weight: 600
				color: #555555
			.forgot-message
				text-align: left
				color: #aaa
				font-family: Raleway, sans-serif
				font-weight: 700
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 800
					color: #4f7fbf
					text-decoration: none
					transition: 0.2s linear all
					&:hover
						color: #33537d
						text-decoration: none
						transition: 0.2s linear all
			.accept-terms
				text-align: center
				color: #aaa
				font-family: Raleway, sans-serif
				font-weight: 700
				margin-top: 25px
				margin-bottom: 25px
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 800
					color: #4f7fbf
					text-decoration: none
					transition: 0.2s linear all
					&:hover
						color: #33537d
						text-decoration: none
						transition: 0.2s linear all
			.forgot-password
				text-align: center
				margin-bottom: 25px
				a
					color: #4f7fbf
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 800
					text-decoration: none
					&:hover
						color: #2963b4
						text-decoration: none
			.copyright
				position: absolute
				width: 100%
				bottom: 5px
				left: 0
				p
					text-align: center
					margin-bottom: 0px
					font-family: Raleway, sans-serif
					font-size: 8pt
					font-weight: 700
					span
						a
							color: black
							text-decoration: none
							transition: 0.2s linear all
							&:hover
								color: #2963b4
								text-decoration: none
								transition: 0.2s linear all
			.v-form
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
				.v-input--radio-group
					margin-top: 0px
					.v-radio
						.v-input--selection-controls__ripple
							z-index: 10
				.v-btn
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 700
					color: white
					border-radius: 15px
					margin-bottom: 25px

		.contact
			text-align: right
			padding-right: 40px
			position: absolute
			right: 0
			bottom: 15px
			.social-networks
				text-align: right
				.social-icon
					display: inline-block
					height: 15px
					width: 15px
					margin-left: 15px
					transition: 0.2s linear all
					&:hover
						border-bottom: 1px solid white
						transition: 0.2s linear all
			.contact-info
				margin-top: 5px
				.contact-item
					display: inline-block
					margin-left: 15px
					.contact-icon
						height: 14px
						width: 14px
						display: inline-block
						margin-right: 5px
					span
						display: inline-block
						color: white
						font-family: Raleway, sans-serif
						font-size: 10pt
						font-weight: 600
	@media only screen and (max-width: 768px)
		.forgot
			.forgot-panel
				padding-left: 30px
				padding-right: 30px
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center
</style>