<template lang="pug">
    .register-free-trial        
        .register-header            
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
                            v-alert(color="warning", transition="scale-transition", v-show="error")
                                |{{ error }}
                            .flex-center
                                v-btn.elevation-0(width="50%", tile, color="#25a8e0", dark, x-large,:loading="status.stepLoading", @click="confirmRegister")
                                    |{{ $t('subscribe') }}
                                v-btn.mt-3.elevation-0(text, color="primary",@click="$router.push({path: '/'})")
                                    v-icon(left)
                                        |mdi-arrow-left
                                    |Regresar
</template>
<script>
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
				let url = this.baseApi + this.env + "admin/check-email"
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
					}
                    let url = this.baseApi + this.env + "admin/register"
					return this.axios.post(url, body)
                })
                .then(result =>{                    
                    if( result.data.code && result.data.code == 1){                        
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
    }
}
</script>
<style lang="sass">
.register-free-trial
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
@media only screen and (max-width: 960px)
    .register-free-trial
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