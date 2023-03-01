<template lang="pug">
	.login
		v-row
			v-col.pt-0.pb-0(cols="12", md="5")
				v-row
					v-col.login-panel(cols="12")
						//.language-selector
							.valign-parent
								p.valign-child
									span.language-option.english-switcher(@click="setLocale('en')", :class="{active: locale == 'en'}")
										|EN
									span
										|/
									span.language-option.spanish-switcher(@click="setLocale('es')", :class="{active: locale == 'es'}")
										|ES
						v-row
							v-col(cols="12", md="8", offset-md="2", style="position: relative")
								p.logo
									a(href="https://goelu.com/")
										img(src="/assets/images/goelU.svg")
								p.user-type.text-center.text-md-left
									|{{ $t('administrator') }}
								p.welcome-message
									|{{ $t("welcome-back") }}
								p.simple-message
									|{{ $t("login-instructions") }}
								v-form(ref="loginForm")
									v-text-field(
										append-icon="mdi-email",
										v-model="login.username",
										:label="$t('email-address')",
										background-color="transparent",
										:rules="form.validations.email",
										outlined,
										dense,
										required)
									v-text-field(
										append-icon="mdi-lock",
										v-model="login.password",
										:label="$t('password')",
										:rules="form.validations.password",
										outlined,
										dense,
										background-color="transparent",
										type="password",
										required)
									v-switch.mt-0(v-model="login.remember", :label="$t('remember-me')", color="#25a8e0")
									v-alert(color="warning", transition="scale-transition", v-show="error")
										|{{ error }}
									v-alert(color="warning", transition="scale-transition", v-show="message")
										|{{ message }}
									v-text-field(
										v-if="code",
										append-icon="mdi-lock",
										v-model="login.code",
										:label="$t('verification-code')",
										outlined,
										dense,
										background-color="transparent",
										required)
									v-btn.elevation-0(
										color="#25a8e0",
										:loading="loading",
										raised,
										block,
										x-large,
										@click="submitLogin")
										|{{ $t("login-btn") }}
								//-p.forgot-password
									router-link(:to="{path: '/forgot'}")
										|{{ $t("forgot-password") }}
								p.create-account
									//-span
										|{{ $t("dont-have-account") }}
									span
										router-link(:to="{path: '/register'}")
											|{{ $t("create-account") }}
								//-.copyright
									p
										|Copyright &copy; 2020 - {{yearNow}}
									p
										span
											a(:href="terminos", target="_blank")
												|{{ $t("terms-of-use") }} 
										span
											|/ 
										span
											a(:href="policy", target="_blank")
												|{{ $t("privacy-policy") }} 

			//-v-col(cols="12", md="7").d-none.d-md-block
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
				login: {
					username: "",
					password: "",
					code: "",
					remember: false
				},
				error: "",
				message: "",
				loading: false,
				code: false,
				form: {
					validations: {
						email: [
				        	v => !!v || this.$t('email-is-required'),
				        	v => /.+@.+\..+/.test(v) || this.$t('email-must-be-valid'),
				      	],
				      	password: [
				        	v => !!v || this.$t('password-is-required'),
				      	]
					}
				}
			}
		},
		filters: {
		},
		mounted() {
			/*if( !localStorage.getItem("locale") ){
				let lang = this.$route.query.lang || "en"
				localStorage.setItem("locale", lang)
			}else
				this.$i18n.locale = localStorage.getItem("locale")*/
		},
		methods: {			            
			setLocale: function(locale){
				localStorage.setItem("locale", locale)
				this.$store.commit("setLocale", locale)
				this.$i18n.locale = locale
				this.$moment.locale( locale )
			},
			obfuscateEmail: function( value ){
				let parts = value.split("@")
				let obfuscated = parts[0].charAt(0) + parts[0].charAt(1) + parts[0].charAt(2) + "...@" + parts[1]
				return obfuscated
			},
			submitLogin: function(){
				if( this.$refs.loginForm.validate() ){
					this.loading = true
					this.error = ""
					this.message = ""

					let body = {
						"email": this.login.username,
						"password": this.login.password,
						"rememberUser": this.login.remember,
					}

					if( this.login.code )
						body.code = this.login.code
					
					let url = this.baseApi + this.env + "admin/login"
					this.axios.post(url, body)
					.then( response => {
						this.loading = false

						if( response.data.code == -1){
							this.message = this.$t("new-location") +' '+ this.login.username +' '+ this.$t("new-location-2")
							this.code = true
						}else if( response.data.code == 1){
							response.data.response.user.plan = {storageLimit: 20000000}
							this.$store.commit("setUser", response.data.response.user)
							localStorage.setItem("token", response.data.response.user.token)
							localStorage.setItem("user", JSON.stringify(response.data.response.user))
							
							this.$swal({
								title: this.$t("access-confirmed"),
								text: this.$t("login-redirection"),
								type: "success",
								timer: 4000,
  								showConfirmButton: false,
								onClose: () => {
									this.$router.push({path: "/dashboard"})
								}
							})
						}
					})
					.catch( error => {
						this.loading = false
						if( error.response.status == 403 )
							this.error = this.$t("invalid-login")
						else if( error.response.status == 405 )
							this.error = this.$t("invalid-code")
						else
							this.$swal(this.$t("unknown-error"), JSON.stringify( error ), "warning")
					})
				}
			}
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
			locale: function(){
				return this.$i18n.locale
			},
			yearNow: function(){
				return new Date().getFullYear()
			}
		}
	}
</script>

<style lang="sass">
	.login
		background: url("/assets/images/slider.jpg")
		background-repeat: no-repeat
		background-size: cover
		background-position: center
		height: 101vh
		.login-panel
			padding-top: 50px
			background-color: rgba(255, 255, 255, 0.9)
			height: 102vh
			position: relative
			padding-bottom: 3px
			overflow-y: auto

			.language-selector
				padding-left: 30px															
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
			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar
				width: 10px
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar-thumb
				background-color: #32343d

			.logo
				text-align: center
				margin-bottom: 50px
				img
					max-width: 50%
			.user-type
				font-size: 1.2em
				color: #25a8e0
				font-weight: 500
				text-transform: uppercase
				margin-bottom: 10px
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
			.create-account
				text-align: center
				color: #aaa
				font-family: Raleway, sans-serif
				font-weight: 700
				margin-bottom: 35px
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
			.forgot-password
				text-align: center
				margin-bottom: 25px
				a
					color: #25a8e0
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 800
					text-decoration: none
					&:hover
						color: #25a8e0
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
								color: #25a8e0
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
				.v-btn
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 700
					color: white
					border-radius: 15px
					margin-bottom: 25px

		.contact
			text-align: center
			padding-right: 40px
			position: absolute			
			bottom: 15px
			right: 22%
			.social-networks
				text-align: center
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
	@media only screen and (min-width: 1264px)
		.login
			.login-panel
	@media only screen and (max-width: 1263px)
		.login
			.login-panel
				.logo
					text-align: center
					img
						max-width: 50%
	@media only screen and (max-width: 768px)
		.login
			height: 100%
			&>.row
				min-height: 100% !important
				&>div
					min-height: 100% !important
					&>.row
						min-height: 100% !important
			.login-panel
				padding-left: 30px
				padding-right: 30px
				min-height: 100%
				height: auto
				.logo
					text-align: center
					margin-bottom: 0
					img
						max-width: 50%
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center
	@media only screen and (max-width: 640px)
		.login
			.login-panel
				.language-selector
					padding-left: 5px
				.v-form
					.v-btn
						margin-bottom: 10px
				.v-input--switch
					margin-bottom: 0
				.forgot-password
					text-align: center
					margin-bottom: 5px
				.create-account
</style>