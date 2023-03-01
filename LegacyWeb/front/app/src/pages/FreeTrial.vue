<template lang="pug">
    .register-free-trial
        .register-menu
            index-menu
        v-row.main-section-free(style="background-image:url('/assets/images/goelu_formulario_fondo-02.jpg') !important; background-repeat: no-repeat;background-size:cover")
            v-col(md="6")
                .main-section-container.text-lg-right.text-center
                    img(src="/assets/images/g_vector.png")
            v-col(md="6")
                .main-section-container.text-md-left.text-center
                    .main-section-title
                        p.white--text
                            |{{ $t('free-trial-title') }}
                        p.white--text
                            |{{ $t('free-trial-title-2') }}
                    .main-section-text
                        p.white--text
                            span
                                |{{ $t('free-trial-text') }}
                            br
                            span
                                |{{ $t('free-trial-text-2') }}
        v-row.video
            v-col.left-section(lg="6", cols="12")
                .video-container
                    p.marked-text.title
                        |{{ $t('video-p-2') }}
                    p.marked-text
                        span
                            |{{ $t('video-p-1') }}
                    p.marked-text
                        span
                            |{{ $t('video-p-4') }}
            v-col.right-section(lg="6", cols="12")
                .video-container
                    .video-player
                        video-player(ref="videoPlayer", :playsinline="true",:options="options" class=" video-player vjs-theme-forest")
        .register-header
            a(href="https://goelu.com/")
                img(src="/assets/images/goelU.svg")
            img(src="/assets/icons/mayor.svg")
            span.subscribe
                |{{ $t('free-trial') }}
        .register-banner
        .stepper-outter
            .stepper-inner
                //Mobile
                v-card(class="mx-auto", vertical, v-if="verticalStepper")
                    .step-header
                        .step-header-title
                            |{{ $t('account-info') }}
                        .step-header-description
                            |{{ $t('create-your-account') }}
                    .step-subcontent
                        v-form(ref="registerForm")
                            v-text-field(append-icon="mdi-account",
                                        v-model="register.fullname",
                                        :label="$t('full-name')",
                                        background-color="transparent",
                                        :rules="form.validations.fullname",
                                        outlined,
                                        dense,
                                        required)
                            v-text-field(append-icon="mdi-email",
                                        v-model="register.email",
                                        :label="$t('email-address')",
                                        background-color="transparent",
                                        :rules="form.validations.email",
                                        outlined,
                                        dense,
                                        required)
                            v-menu(ref="menu",
                                    v-model="menu",                                 
                                    :close-on-content-click="false",
                                    :return-value.sync="register.birthdate",
                                    transition="scale-transition",
                                    offset-y,
                                    min-width="290px",
                                    max-width="290px")
                                    template(v-slot:activator="{ on, attrs }")
                                        v-text-field(append-icon="mdi-calendar",
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
                                    v-date-picker(v-model="register.birthdate",
                                                ref="picker"
                                                no-title,
                                                scrollable)
                                        v-spacer
                                        v-btn(text, color="primary",@click="menu = false")
                                            |Cancel
                                        v-btn(color="primary",@click="$refs.menu.save(register.birthdate)")
                                            |Ok
                            v-text-field(append-icon="mdi-lock",
                                        v-model="register.password",                                      
                                        :label="$t('password')",
                                        :rules="form.validations.password",                                       
                                        outlined,
                                        dense,
                                        background-color="transparent",
                                        @input="validate",                                      
                                        type="password",
                                        required)
                            v-text-field(append-icon="mdi-lock",
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
                                v-radio-group(v-model="register.gender",row)
                                    v-layout
                                        v-flex
                                            v-radio(:label="$t('male')",
                                                    value="Male",
                                                    color="#25a8e0")
                                        v-flex
                                            v-radio(:label="$t('female')",
                                                    value="Female",
                                                    color="#25a8e0")
                                        v-flex
                                            v-radio(:label="$t('rather-not')",
                                                    value="Undefined",
                                                    color="#25a8e0")                            
                            v-alert(color="warning", transition="scale-transition", v-show="error")
                                |{{ error }}
                            .flex-center
                                v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large,:loading="status.stepLoading", @click="confirmRegister")
                                    |{{ $t('subscribe') }}
                //Desktop
                v-card(class="mx-auto", v-else)
                    .step-header
                        .step-header-title
                            |{{ $t('account-info') }}
                        .step-header-description
                            |{{ $t('create-your-account') }}
                    .step-subcontent
                        v-form(ref="registerForm")
                            v-text-field(append-icon="mdi-account",
                                        v-model="register.fullname",
                                        :label="$t('full-name')",
                                        background-color="transparent",
                                        :rules="form.validations.fullname",
                                        outlined,
                                        dense,
                                        required)
                            v-text-field(append-icon="mdi-email",
                                        v-model="register.email",
                                        :label="$t('email-address')",
                                        background-color="transparent",
                                        :rules="form.validations.email",
                                        outlined,
                                        dense,
                                        required)
                            v-menu(ref="menu",
                                    v-model="menu",                                 
                                    :close-on-content-click="false",
                                    :return-value.sync="register.birthdate",
                                    transition="scale-transition",
                                    offset-y,
                                    min-width="290px",
                                    max-width="290px")
                                    template(v-slot:activator="{ on, attrs }")
                                        v-text-field(append-icon="mdi-calendar",
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
                                    v-date-picker(v-model="register.birthdate",
                                                ref="picker"
                                                no-title,
                                                scrollable)
                                        v-spacer
                                        v-btn(text, color="primary",@click="menu = false")
                                            |Cancel
                                        v-btn(color="primary",@click="$refs.menu.save(register.birthdate)")
                                            |Ok
                            v-text-field(append-icon="mdi-lock",
                                        v-model="register.password",                                      
                                        :label="$t('password')",
                                        :rules="form.validations.password",                                       
                                        outlined,
                                        dense,
                                        background-color="transparent",
                                        @input="validate",                                      
                                        type="password",
                                        required)
                            v-text-field(append-icon="mdi-lock",
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
                                v-radio-group(v-model="register.gender",row)
                                    v-layout
                                        v-flex
                                            v-radio(:label="$t('male')",
                                                    value="Male",
                                                    color="#25a8e0")
                                        v-flex
                                            v-radio(:label="$t('female')",
                                                    value="Female",
                                                    color="#25a8e0")
                                        v-flex
                                            v-radio(:label="$t('rather-not')",
                                                    value="Undefined",
                                                    color="#25a8e0")                            
                            v-alert(color="warning", transition="scale-transition", v-show="error")
                                |{{ error }}
                            .flex-center
                                v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large,:loading="status.stepLoading", @click="confirmRegister")
                                    |{{ $t('subscribe') }}
</template>
<script>
import IndexMenu from "@/components/dashboard/elements/IndexMenu.vue"
import { videoPlayer } from "vue-video-player";
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css')
export default {
    data() {
			return {
                menu: false,
                error: "",
                ageError: "",
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
				},
                options : {
					muted: false,
					height: 200,
					width: 250,
					language: "en",					
					playbackRates: [0.7, 1.0, 1.5, 2.0],                    
					sources: [{type: "video/mp4", src: "assets/videos/Main_Video.mp4"}],
                    poster: "/assets/images/portada_videos_04_SP.jpg",
				}
            }
        },
    computed: {
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
    methods: {        
        validate: function(){
			return this.$refs.registerForm.validate()
		},
        checkEmail: function(email) {
				let body = {email: email}
				let url = this.baseApi + this.env + "check-email"
				return this.axios.post(url, body)
		},
        confirmRegister: function() {
            if( this.validate() ){                
				this.status.stepLoading = true
				this.checkEmail( this.register.email )
				.then(result => {
                    this.error = ""
                    let now = new Date();
                    let newDate = new Date(now.setMonth(now.getMonth()+1));
                    let body = {
						password: this.register.password,
						name: this.register.fullname,
						email: this.register.email,
						gender: this.register.gender,
						cardToken: '',
						plan: {
							endDate: newDate,
							name: '1 month - 100 MB',
							cost: 0.0,
						}
					}
                    let url = this.baseApi + this.env + "user/register"
					return this.axios.post(url, body)
                })
                .then(result =>{
                    if( result.data.code && result.data.code == 1){
                        this.$gtag.event('free-trial-success',{'event_category': 'register'})
                        this.$swal({
								title: this.$t("account-created"),
								text: this.$t("email-not-reach"),
								type: "success",
								timer: 4000,
  								showConfirmButton: false,
								onClose: () => {
									this.$router.push({name : 'Login'});
								}
							})                        
                    }
                })
				.catch( err => this.error = "This email is already registered." )
				.finally(() => this.status.stepLoading = false )
			}
        }
    },
    watch: {
        menu (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR')) 
        }
    },
    components: {			
		IndexMenu,
        videoPlayer
	}
}
</script>
<style lang="sass">
.register-free-trial    
    .main-section-free                
        margin-top: 9vh
        height: 48vh        
        .main-section-container
            position: relative
            top: 50%
            transform: translateY(-50%)
            padding-left: 75px
            padding-right: 75px            
            img
                max-width: 400px
            .main-section-title
                font-family: Raleway
                font-weight: 700
                font-size: 2rem
                line-height: 1em
            .main-section-text
                font-family: Raleway
                color: #666
                font-size: 1rem
                text-align: justify
    .video
        position: relative
        background-color: #f4f4f4
        .title
            font-size: 28pt
            font-weight: 700
            text-transform: uppercase
            color: #3aa9e0
        .marked-text
            margin-left: 25px
            margin-right: 25px
            text-align: left
            font-family: 'Raleway', sans-serif !important
            margin-top: 35px
            margin-bottom: 0px
            font-size: 12pt
            font-weight: 400
        .left-section
            position: relative
            padding: 50px
            text-align: center
            padding-left: 100px
            padding-right: 100px
        .right-section
            position: relative
            padding: 50px
            text-align: center
            padding-left: 100px
            padding-right: 100px
            .video-container
                min-height: 301px
                .video-player
                    width: 100%
                    min-height: 301px
                    .video-js
                        width: 100%
                        min-height: 301px
    .register-header
        text-align: center
        background-color: white
        padding-top: 25px
        padding-bottom: 25px        
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
    .register-banner
        height: 125px
        background-color: #25a8e0
    .stepper-outter
        padding-left: 15%
        padding-right: 15%
        .stepper-inner
            margin-top: -65px
            .v-card
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
@media only screen and (min-width: 1441px)
    .register-free-trial    
        .main-section-free  
        .video
            .title
                font-size: 30pt !important
            .marked-text
                font-size: 14pt

@media only screen and (max-width: 960px)
    .register-free-trial
        .main-section-free
            margin-top: 2vh            
            .main-section-container                
                padding-left: 25px
                padding-right: 25px
                img
                    max-width: 200px
                .main-section-title                    
                    font-size: 2rem
                .main-section-text                                        
                    font-size: 1rem                    
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
@media only screen and (max-width: 768px)
    .register-free-trial
        .video
            padding-top: 0px
            padding-bottom: 20px
            .left-section
                padding-left: 50px
                padding-right: 50px
            .right-section 
                padding-left: 50px
                padding-right: 50px
                .video-container
                    min-height: 404px
                    .video-player
                        width: 100%
                        min-height: 404px
                        .video-js
                            width: 100%
                            min-height: 404px
                
            .marked-text
                text-align: center !important                
        
@media only screen and (max-width: 520px)
    .register-free-trial
        .video
            .right-section
                .video-container
                    min-height: 183px
                    .video-player
                        width: 100%
                        min-height: 183px
                        .video-js
                            width: 100%
                            min-height: 183px
            .main-section-free
                height: 70vh            
                .main-section-container
                    .main-section-title                    
                        font-size: 1.5rem
                    .main-section-text                                        
                        font-size: .8rem   
</style>