<template lang="pug">
	.login
		v-row
			v-col.pt-0(cols="12", md="5")
				v-row
					v-col.login-panel(cols="12")
						.language-selector
							.valign-parent
								p.valign-child
									span.language-option.english-switcher(@click="setLocale('en')", :class="{active: locale == 'en'}")
										|EN
									span
										|/
									span.language-option.spanish-switcher(@click="setLocale('es')", :class="{active: locale == 'es'}")
										|ES		
						v-row
							v-col(cols="12", md="8", offset-md="2")
								p.logo
									a(href="https://goelu.com/")
										img(src="/assets/images/goelU.svg")
								p.user-type.text-center.text-md-left
									|{{ $t('user') }}
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
									v-switch.mt-0(v-model="login.remember", :label="$t('remember-me')", color="#2963b4")
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
									v-alert(type="info", outlined)
										div
											strong DEMO SITE: 
											| This is a demo version with no backend connection. 
										div
											| To test login functionality use:
										div
											strong Email: 
											| test@example.com
										div
											strong Password: 
											| password
									v-btn(
										color="#2963b4",
										:loading="loading",
										raised,
										block,
										x-large,
										@click="submitLogin")
										|{{ $t("login-btn") }}
								p.forgot-password
									router-link(:to="{path: '/forgot'}")
										|{{ $t("forgot-password") }}
								.copyright
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
			if( !localStorage.getItem("locale") ){
				let lang = this.$route.query.lang || "en"
				localStorage.setItem("locale", lang)
			}else
				this.$i18n.locale = localStorage.getItem("locale")
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

					setTimeout(() => {
						this.loading = false
						
						// Mock different scenarios based on email/password
						if (this.login.username === "test@example.com" && this.login.password === "password") {
							// Successful login
							const mockUser = {
								email: this.login.username,
								name: "Test User",
								token: "mock-token-" + Math.random().toString(36).substring(2),
								plan: {storageLimit: 20000000}
							}
							
							this.$store.commit("setUser", mockUser)
							localStorage.setItem("token", mockUser.token)
							localStorage.setItem("user", JSON.stringify(mockUser))
							
							// Add mock files data
							const mockFiles = [
								// Video files
								{
									_id: "v1",
									imageUsr: "https://randomuser.me/api/portraits/men/1.jpg",
									nameUser: "John Doe",
									title: "Introduction Video",
									description: "Company introduction for new employees",
									size: 15000000,
									createdAt: new Date().getTime() - 86400000 * 2,
									url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
									type: "video"
								},
								{
									_id: "v2",
									imageUsr: "https://randomuser.me/api/portraits/women/2.jpg",
									nameUser: "Jane Smith",
									title: "Product Demo",
									description: "Showcase of new features",
									size: 25000000,
									createdAt: new Date().getTime() - 86400000 * 5,
									url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
									type: "video"
								},
								
								// Audio files
								{
									_id: "a1",
									imageUsr: "https://randomuser.me/api/portraits/men/3.jpg",
									nameUser: "Robert Johnson",
									title: "Meeting Recording",
									description: "Team weekly planning session",
									size: 5000000,
									createdAt: new Date().getTime() - 86400000 * 1,
									url: "https://sample-videos.com/audio/mp3/wave.mp3",
									type: "audio"
								},
								{
									_id: "a2",
									imageUsr: "https://randomuser.me/api/portraits/women/4.jpg",
									nameUser: "Emily Davis",
									title: "Conference Call",
									description: "Client discussion about project timeline",
									size: 7500000,
									createdAt: new Date().getTime() - 86400000 * 3,
									url: "https://sample-videos.com/audio/mp3/wave.mp3",
									type: "audio"
								},
								
								// Document files
								{
									_id: "d1",
									imageUsr: "https://randomuser.me/api/portraits/men/5.jpg",
									nameUser: "Michael Wilson",
									title: "Quarterly Report",
									description: "Financial analysis Q3 2023",
									size: 3000000,
									createdAt: new Date().getTime() - 86400000 * 7,
									url: "https://sample-files.com/download/pdf/sample.pdf",
									type: "other",
									isPdf: true
								},
								{
									_id: "d2",
									imageUsr: "https://randomuser.me/api/portraits/women/6.jpg",
									nameUser: "Sarah Brown",
									title: "Project Proposal",
									description: "New marketing initiative details",
									size: 2500000,
									createdAt: new Date().getTime() - 86400000 * 10,
									url: "https://sample-files.com/download/doc/sample.doc",
									type: "other",
									isWord: true
								},
								{
									_id: "d3",
									imageUsr: "https://randomuser.me/api/portraits/men/7.jpg",
									nameUser: "David Lee",
									title: "Product Image",
									description: "High resolution product photo",
									size: 8500000,
									createdAt: new Date().getTime() - 86400000 * 15,
									url: "https://sample-files.com/download/image/sample.jpg",
									type: "other",
									isImage: true
								}
							]
							
							// Commit the mock files to the store
							this.$store.commit("setFiles", mockFiles)
							
							this.$swal({
								title: this.$t("access-confirmed"),
								text: this.$t("login-redirection"),
								type: "success",
								timer: 4000,
								showConfirmButton: false,
								onClose: () => {
									this.$router.push({path: "/dashboard/videos"})
								}
							})
						} else if (this.login.username === "new@example.com") {
							// New location detection scenario
							this.message = this.$t("new-location") + this.login.username + ' ' + this.$t("new-location-2")
							this.code = true
						} else if (this.code && this.login.code === "123456") {
							// Successful verification code
							const mockUser = {
								email: this.login.username,
								name: "New Location User",
								token: "mock-token-" + Math.random().toString(36).substring(2),
								plan: {storageLimit: 20000000}
							}
							
							this.$store.commit("setUser", mockUser)
							localStorage.setItem("token", mockUser.token)
							localStorage.setItem("user", JSON.stringify(mockUser))
							
							// Add mock files data
							const mockFiles = [
								// Video files
								{
									_id: "v1",
									imageUsr: "https://randomuser.me/api/portraits/men/1.jpg",
									nameUser: "John Doe",
									title: "Introduction Video",
									description: "Company introduction for new employees",
									size: 15000000,
									createdAt: new Date().getTime() - 86400000 * 2,
									url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
									type: "video"
								},
								{
									_id: "v2",
									imageUsr: "https://randomuser.me/api/portraits/women/2.jpg",
									nameUser: "Jane Smith",
									title: "Product Demo",
									description: "Showcase of new features",
									size: 25000000,
									createdAt: new Date().getTime() - 86400000 * 5,
									url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
									type: "video"
								},
								
								// Audio files
								{
									_id: "a1",
									imageUsr: "https://randomuser.me/api/portraits/men/3.jpg",
									nameUser: "Robert Johnson",
									title: "Meeting Recording",
									description: "Team weekly planning session",
									size: 5000000,
									createdAt: new Date().getTime() - 86400000 * 1,
									url: "https://sample-videos.com/audio/mp3/wave.mp3",
									type: "audio"
								},
								{
									_id: "a2",
									imageUsr: "https://randomuser.me/api/portraits/women/4.jpg",
									nameUser: "Emily Davis",
									title: "Conference Call",
									description: "Client discussion about project timeline",
									size: 7500000,
									createdAt: new Date().getTime() - 86400000 * 3,
									url: "https://sample-videos.com/audio/mp3/wave.mp3",
									type: "audio"
								},
								
								// Document files
								{
									_id: "d1",
									imageUsr: "https://randomuser.me/api/portraits/men/5.jpg",
									nameUser: "Michael Wilson",
									title: "Quarterly Report",
									description: "Financial analysis Q3 2023",
									size: 3000000,
									createdAt: new Date().getTime() - 86400000 * 7,
									url: "https://sample-files.com/download/pdf/sample.pdf",
									type: "other",
									isPdf: true
								},
								{
									_id: "d2",
									imageUsr: "https://randomuser.me/api/portraits/women/6.jpg",
									nameUser: "Sarah Brown",
									title: "Project Proposal",
									description: "New marketing initiative details",
									size: 2500000,
									createdAt: new Date().getTime() - 86400000 * 10,
									url: "https://sample-files.com/download/doc/sample.doc",
									type: "other",
									isWord: true
								},
								{
									_id: "d3",
									imageUsr: "https://randomuser.me/api/portraits/men/7.jpg",
									nameUser: "David Lee",
									title: "Product Image",
									description: "High resolution product photo",
									size: 8500000,
									createdAt: new Date().getTime() - 86400000 * 15,
									url: "https://sample-files.com/download/image/sample.jpg",
									type: "other",
									isImage: true
								}
							]
							
							// Commit the mock files to the store
							this.$store.commit("setFiles", mockFiles)
							
							this.$swal({
								title: this.$t("access-confirmed"),
								text: this.$t("login-redirection"),
								type: "success",
								timer: 4000,
								showConfirmButton: false,
								onClose: () => {
									this.$router.push({path: "/dashboard/videos"})
								}
							})
						} else if (this.code && this.login.code !== "123456") {
							// Invalid verification code
							this.error = this.$t("invalid-code")
						} else {
							// Invalid login
							this.error = this.$t("invalid-login")
						}
					}, 1000)
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
		height: 100vh
		.login-panel
			padding-top: 50px
			background-color: rgba(255, 255, 255, 0.9)
			height: 100vh
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
				font-family: Raleway
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
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Raleway, sans-serif
					font-weight: 800
					color: #4f7fbf
					text-decoration: none
					&:hover
						color: #4f7fbf
						text-decoration: none
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
			right: 22%
			bottom: 15px
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
	@media only screen and (max-width: 768px)
		.login
			.login-panel
				padding-left: 30px
				padding-right: 30px
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center
</style>