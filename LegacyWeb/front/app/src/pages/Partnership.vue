<template lang="pug">
    .partnership-section
        .register-menu
            index-menu
        .first-section
            .presentation
                v-row(style="height:100%;")
                    v-col( md = "6", cols = "12" )
                        .partnership-first-text-cotainer
                            .partnership-goelu-title.mb-10(v-if="isEn")
                                .goelu
                                    |goelu
                                .partnership
                                    |{{$t('partnership-first-section-title-1')}}
                            .partnership-goelu-title.mb-10(v-else)                                
                                .partnership
                                    |{{$t('partnership-first-section-title-1')}}
                                .goelu
                                    |goelu
                            p.partnership-text-title
                                |{{$t('partnership-first-section-title-2')}}
                            p.partnership-text-content.text-center.text-md-left
                                |{{$t('partnership-first-section-content')}}                                
                            .text-center.mt-10
                                v-btn(class="plans-btn" color="primary"  v-scroll-to="'#section-two'", style="font-weight: 700")
                                    |{{$t('partnership-first-section-btn')}}
                    v-col.text-center.text-md-left( md = "6", cols = "12" )
                        .partnership-first-img-cotainer
                            img( src = "/assets/images/goelu_ilustracion_partnership.svg" )                    
        .second-section#section-two
            .partnership-goelu-title(v-if="isEn")
                p.goelu
                    |goelu&nbsp;&nbsp; 
                p.partnership
                    | {{$t('partnership-first-section-title-1')}}
            .partnership-goelu-title(v-else)
                p.partnership
                    | {{$t('partnership-first-section-title-1')}}
                p.goelu
                    | &nbsp;&nbsp;goelu
            .partnership-goelu-joins
                .partnership-goelu-joins-text
                    img(src="/assets/images/pentagono.png")                
                    span(style="vertical-align: middle;")
                        |{{$t('partnership-second-title-2')}}
            .partnership-goelu-principal-text
                |{{$t('partnership-second-content')}}
            .down(v-scroll-to="'#third-section'")
        .third-section#third-section
            v-row(style="height:100%;")
                v-col(cols="0",md="6", v-show="!verticalStepper")
                v-col.d-flex.align-center.justify-center(cols="12",md="6", style="background-color: rgba(37, 168, 244, 0.8)")
                    .box-text
                        .box-text-title-1
                            |{{$t('partnership-third-title-1')}}
                        .box-text-title-2
                            |{{$t('partnership-third-title-2')}}
                        .box-text-title-3
                            p(style="display: inline-block, font-size: 1rem")
                                |{{$t('partnership-third-title-3')}}
                        .box-text-content
                            |{{$t('partnership-third-content')}}
        .quarter-section
            .empower-title
                |{{$t('partnership-quarter-title')}}
            .empower-text-content
                |{{$t('partnership-quarter-content')}}
        .fifth-section
            .advantage-title
                |{{$t('partnership-fifth-title')}}
            .group-img-advantage
                v-row
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[0]")
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[1]")
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[2]")
                v-row.mt-10
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[3]")
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[4]")
                    v-col(cols="12", md="4")
                        circle-image(:propsCircle="propsCircle[5]")
        .six-section
            .lets-title
                |{{$t('partnership-six-title-1')}}
            .you-will
                |{{$t('partnership-six-title-2')}}
            .icon
                v-icon(style="color:white", size="50")
                    |mdi-plus-circle-outlined
        .contact-section
            .contact-register
                .contact-header
                    .contact-register-title
                        |{{$t('partnership-contact-title')}}
                    .contact-register-content
                        p
                            |{{$t('partnership-contact-content-1')}}
                        p 
                            |&nbsp;{{$t('partnership-contact-content-2')}}
                .contact-container
                    v-form(ref="contactForm")
                        v-text-field(append-icon="mdi-account",v-model="contac.fullname",:label="$t('partnership-contact-form-1')",:rules="form.validations.fullname",background-color="transparent",@input="validate",outlined,dense,required)
                        v-text-field(append-icon="mdi-domain",v-model="contac.company",:label="$t('partnership-contact-form-2')",:rules="form.validations.company",background-color="transparent",@input="validate",outlined,dense,required)
                        v-text-field(append-icon="mdi-email",v-model="contac.email",:label="$t('partnership-contact-form-3')",:rules="form.validations.email",background-color="transparent",@input="validate",outlined,dense,required)
                        v-text-field(append-icon="mdi-map-marker",v-model="contac.from",:label="$t('partnership-contact-form-4')",:rules="form.validations.from",background-color="transparent",@input="validate",outlined,dense,required)
                        v-alert(color="warning", transition="scale-transition", v-show="error")
                            |{{ error }}
                    .final-text
                        |{{$t('partnership-contact-foot-1')}}
                        span()
                            a(:href="terminos", target="_blank")
                                |{{$t('partnership-contact-foot-2')}}
                    .final-text-2
                        |{{$t('partnership-contact-foot-3')}}
            .contact-btn()
                //-v-btn.elevation-0(width="50%", tile, color="white", x-large)
                    |back
                v-btn.elevation-0(width="100%", tile, color="#25a8e0", dark,  x-large, :loading="status.stepLoading", @click="send")
                    |{{$t('partnership-contact-btn')}}
</template>
<script>
import IndexMenu from "@/components/dashboard/elements/IndexMenu.vue"
import CircleImage from "@/components/dashboard/elements/partnership/CircleImage.vue"
    export default {
        data(){
            return{
                error: "",
                form: {
					validations: {
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
				      	],
				      	company: [
				        	v => !!v || 'Company is required'				        	
				      	],
				      	fullname: [
				        	v => !!v || 'Full name is required',
				      	],
				      	from: [
				        	v => !!v || 'This field is required',
				      	]
					}
				},
                status: {
					stepLoading: false,
				},
                contac:{
                    fullname:"",
                    company:"",
                    email:"",
                    from:""
                },
                propsCircle:[{
                    img:"/assets/icons/iconos_partnership_14.svg",
                    title:"partnership-fifth-cirlce-title-1",
                    content:"partnership-fifth-cirlce-content-1",
                },
                {
                    img:"/assets/icons/iconos_partnership_15.svg",
                    title:"partnership-fifth-cirlce-title-2",
                    content:"partnership-fifth-cirlce-content-2",
                },
                {
                    img:"/assets/icons/iconos_partnership_16.svg",
                    title:"partnership-fifth-cirlce-title-3",
                    content:"partnership-fifth-cirlce-content-3",
                },
                {
                    img:"/assets/icons/iconos_partnership_17_c.svg",
                    title:"partnership-fifth-cirlce-title-5",
                    content:"partnership-fifth-cirlce-content-5",
                },
                {
                    img:"/assets/icons/iconos_partnership_18.svg",
                    title:"partnership-fifth-cirlce-title-4",
                    content:"partnership-fifth-cirlce-content-4",                    
                },
                {
                    img:"/assets/icons/iconos_partnership_19.svg",
                    title:"partnership-fifth-cirlce-title-6",
                    content:"partnership-fifth-cirlce-content-6",
                }]
            }
        },
        methods: {
            validate: function(){
				return this.$refs.contactForm.validate()
			},
            send: function() {
                if( this.validate() ){
                    this.status.stepLoading = true
                    const url = this.baseApi + this.env + "contact-us"
				    return this.axios.post(url, this.contac)
                    .then(result => {
                        this.$swal({title: 'Thank you',text: "We will get in touch with you soon",type:"success"});
                    })
                    .catch( err => this.error = "Something went wrong" )
					.finally(() => this.status.stepLoading = false )
                }
            }
        },
        components: {			
		    IndexMenu,
            "circle-image":CircleImage
	    },
        computed: {
            verticalStepper: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true
		    },
            terminos:function(){
				if(this.$i18n.locale == 'en' )
					return "https://www.iubenda.com/terms-and-conditions/82638648"
				else
					return "https://www.iubenda.com/condiciones-de-uso/94397736"
			},
            isEn:function(){                
				if(this.$i18n.locale == 'en' )
                {
                    console.log('true')
                    return true
                }					
				else{
                    console.log('false')
                    return false
                }					
			},

        },
        mounted() {				
             if( this.$route.query.lang === "en" ){
                this.$i18n.locale = "en"
            }
            else{
                this.$i18n.locale = "es"
            }
        },
        activated(){
            if( this.$route.query.lang === "en" ){
                this.$i18n.locale = "en"
            }
            else{
                this.$i18n.locale = "es"
            }
        }
    }
</script>
<style lang="sass">
.partnership-section
    .first-section        
        margin-top: 9vh
        height: 90vh
        .presentation
            height: 100%
            .partnership-first-img-cotainer
                position: relative
                top: 50%
                transform: translateY(-50%)
                padding-left: 75px
                padding-right: 75px
                img
                    max-width: 800px
            .partnership-first-text-cotainer
                padding-left: 20%
                position: relative
                top: 50%
                transform: translateY(-50%)
                .partnership-goelu-title
                    color: #25a8e0
                    text-align: right
                    padding-right: 10%
                    .goelu
                        font-family: Raleway
                        font-weight: 800
                        font-size: 3rem
                        line-height: 1em
                    .partnership
                        font-family:  'Great Vibes', cursive
                        font-weight: 550
                        font-size: 6.5rem
                        line-height: 1em 
                .partnership-text-title
                    font-family: Raleway
                    font-weight: 700
                    font-size: 2rem
                    line-height: 1em
                .partnership-text-content
                    font-family: Raleway                    
                    font-size: 1rem 
                    line-height: 1.5em           
    .second-section
        background-image: url('/assets/images/goelu_fndo_partner_01.jpg')
        background-repeat: no-repeat
        background-size: cover
        color: white
        text-align: center
        padding-top: 100px
        padding-bottom: 30px    
        .partnership-goelu-title            
            padding-bottom: 30px
            .goelu
                margin-block-end: 0px
                display: inline-block
                font-family: Raleway
                font-weight: 800
                font-size: 3.5rem
                line-height: 1em
            .partnership
                margin-block-end: 0px
                display: inline-block
                font-family:  'Great Vibes', cursive
                font-weight: 550
                font-size: 6.5rem
                line-height: 1em 
        .partnership-goelu-joins
            text-align: center
            display: inline-block
            .partnership-goelu-joins-text                
                display: flex
                align-items: center                
                img
                    width: 70px
                    display:inline                
                span
                    font-family: Raleway
                    font-weight: 600
                    font-size: 2rem
                    line-height: 1em
                    position: relative 
                    &:after                                                
                        display: block
                        content: ''
                        width: 50%                        
                        height: 4px
                        background: white
                        position: absolute
                        bottom: -20px
                        left: 25%
        .partnership-goelu-principal-text
            margin-top: 40px
            margin-bottom: 40px
            padding-right: 20% 
            padding-left: 20%
            font-family: Raleway
            font-weight: 400
            font-size: 1rem
            line-height: 1.5em
        .down                
                position: relative
                bottom: 10px
                left: 0
                right: 0
                margin-left: auto
                margin-right: auto
                height: 40px
                width: 40px                
                border-radius: 50%
                transition: all 0.2s linear
                &:hover                    
                    cursor: pointer
                    border: 15px
                    bottom: 15px
                    transition: all 0.2s linear
                &::before
                    position: absolute
                    bottom: 10px
                    left: 4px
                    border-bottom: 2px
                    border: 2px solid white
                    width: 50%
                    height: 3px
                    content: ''
                    transform: rotate(45deg)
                &::after
                    position: absolute
                    bottom: 10px
                    right: 4px
                    border-bottom: 2px
                    border: 2px solid white
                    width: 50%
                    height: 3px
                    content: ''
                    transform: rotate(-45deg)
    .third-section
        background-image: url('/assets/images/goelu_fndo_partner_04-06.jpg')        
        background-repeat: no-repeat
        background-size: cover
        height: 1000px        
        .box-text
            padding-right: 17% 
            padding-left: 17%
            color: white
            font-family: Raleway
            .box-text-title-1
                font-weight: 600
                font-size: 1.3rem
                line-height: 1.7em
                margin-bottom: 5px
                text-transform: uppercase
            .box-text-title-2
                font-weight: 700
                font-size: 2rem
                line-height: 1em
                margin-bottom: 5px
                text-transform: uppercase
            .box-text-title-3
                text-transform: uppercase
                font-weight: 600
                font-size: 1.3rem
                line-height: 1.7em                
            .box-text-content
                padding-right: 10%
                font-weight: 500
                font-size: 1rem
                line-height: 1.5em
    .quarter-section
        font-family: Raleway
        padding-top: 5%
        padding-bottom: 5%
        padding-right: 20%
        padding-left: 20%
        color: white
        background-color: #043c74
        .empower-title
            text-align: center
            font-weight: 700
            font-size: 1.35rem
            line-height: 1.7em
            margin-bottom: 60px
            position: relative
            text-transform: uppercase
            &:after                                                
                display: block
                content: ''
                width: 50px                     
                height: 2px
                background: white
                position: absolute
                bottom: -3px
                left: 48%
        .empower-text-content
            font-weight: 500
            font-size: 1rem
            line-height: 1.5em
    .fifth-section
        padding-top: 5%
        padding-bottom: 5%
        padding-right: 15%
        padding-left: 15%
        background-image: url('/assets/images/goelu_fndo_partner_02.jpg')
        background-repeat: no-repeat
        background-size: cover
        .advantage-title
            text-align: center
            font-weight: 700
            font-size: 1.35rem
            line-height: 1.7em
            margin-bottom: 40px
            position: relative
            text-transform: uppercase
            &:after                                                
                display: block
                content: ''
                width: 50px                     
                height: 2px
                background: black
                position: absolute
                bottom: -4px
                left: 48%
    .six-section
        background-image: url('/assets/images/goelu_fndo_partner_03.jpg')
        background-repeat: no-repeat
        background-size: cover
        padding-right: 25%
        padding-left: 25%   
        padding-top: 3%
        padding-bottom: 3%                     
        color: white
        height: auto        
        .lets-title
            height: auto
            text-align: left
            font-weight: 700
            line-height: 1.7em              
            font-size: 3.5rem
        .you-will
            margin-top: -45px            
            text-align: right
            font-weight: 500
            font-family:  'Great Vibes', cursive                    
            font-size: 4.8rem
            line-height: 1.7em
        .icon            
            height: auto
            text-align: center
    .contact-section
        padding-right: 20%
        padding-left: 20%
        padding-top: 5%
        padding-bottom: 5%
        .contact-register
            border: 2px solid #f3f3f3
            .contact-header
                padding-right: 10%
                padding-left: 10%
                padding-top: 70px
                padding-bottom: 70px
                text-align: center
                .contact-register-title
                    color: rgb(37, 168, 224)
                    font-weight: 700
                    font-size: 28px
                    line-height: 1.7em
                    text-transform: uppercase                    
                .contact-register-content
                    font-weight: 500
                    position: relative
                    p
                        display: inline-block
                        margin-block-end: 0px
                    &:after                                                
                        display: block
                        content: ''
                        width: 50px                     
                        height: 2px
                        background: black
                        position: absolute
                        bottom: -20px
                        left: 48%
            .contact-container
                background-color:  #f3f3f3                
                padding-left: 15%
                padding-right: 15%
                padding-top: 50px
                padding-bottom: 50px
                .final-text
                    text-align: center
                    font-size: .9rem
                    line-height: 1.7em
                    span
                        color: rgb(37, 168, 224)
                        a
                            text-decoration: none
                .final-text-2
                    font-weight: 600
                    text-align: center
                    font-size: .9rem
                    line-height: 1.7em
        .contact-btn
            

@media only screen and (max-width: 1610px)
    .partnership-section                

@media only screen and (max-width: 1264px)
    .partnership-section
        .first-section            
            height: auto 
@media only screen and (max-width: 960px)
    .partnership-section
        .first-section            
            .presentation
                height: 100%
                .partnership-first-img-cotainer                    
                    padding-left: 25px
                    padding-right: 25px
                    img
                        max-width: 400px
                .partnership-first-text-cotainer
                    text-align: center
                    margin-top: 10px
                    padding-left: 25px
                    padding-right: 25px
                    .partnership-goelu-title                        
                        text-align: center
                        padding-right: 10%
                        .goelu
                            margin-bottom: 10px                                                        
                            font-size: 3rem                            
                        .partnership                                                        
                            font-size: 6.5rem                            
                    .partnership-text-title                                                
                        font-size: 2.4rem                        
                    .partnership-text-content                        
                        font-size: 1.3rem
                    .partnership-btn
                        margin-top: 10px
        .second-section
            padding-top: 70px                
            .partnership-goelu-title
                .goelu
                    font-size: 2.5rem                    
                .partnership
                    font-size: 4.5rem
            .partnership-goelu-joins                
                .partnership-goelu-joins-text
                    img
                        width: 80px
            .partnership-goelu-principal-text                
                padding-right: 10% 
                padding-left: 10%
        .third-section
            .box-text
                .box-text-title-1
                .box-text-title-2
                    text-align: center
                .box-text-title-3
                .box-text-content
                    text-align: center
                    padding-right: 0%
        .quarter-section            
            padding-top: 10%
            padding-bottom: 10%
            padding-right: 10%
            padding-left: 10%            
            .empower-title                                
            .empower-text-content
                text-align: center
        .six-section            
            padding-right: 40px
            padding-left: 40px   
            padding-top: 3%
            padding-bottom: 3%
            .lets-title         
                font-size: 3rem
            .you-will                                  
                font-size: 5rem
                margin-top: -20px
        .contact-section
            padding-right: 10%
            padding-left: 10%
            padding-top: 5%
            padding-bottom: 5%
            .contact-register                
                .contact-header                    
                    .contact-register-title                        
                    .contact-register-content                                                                        
                .contact-container                    
                    padding-left: 10%
                    padding-right: 10%                    
                    .final-text                        
                    .final-text-2                    
            .contact-btn
@media only screen and (max-width: 520px)
    .partnership-section
        .first-section            
            .presentation                
                .partnership-first-img-cotainer                                        
                    img
                        max-width: 250px
                .partnership-first-text-cotainer
                    .partnership-goelu-title                                                
                        padding-right: 10%
                        .goelu                                                        
                            font-size: 2.5rem                            
                        .partnership                                                        
                            font-size: 4.5rem 
                    .partnership-text-title                                                
                        font-size: 2rem                        
                    .partnership-text-content                        
                        font-size: 1rem
        .second-section                
            .partnership-goelu-title
                padding-right: 0px                        
                .goelu
                    display: block
                    font-size: 3rem
                    margin-bottom: 20px
                .partnership
                    display: block
                    margin-top: 10px
            .partnership-goelu-joins                
                .partnership-goelu-joins-text                    
            .partnership-goelu-principal-text                
                padding-right: 15px 
                padding-left: 15px
        .third-section
            height: auto            
            .box-text
                padding-top: 20px
                padding-bottom: 20px
                padding-right: 5% 
                padding-left: 5%
                .box-text-title-1
                    text-align: center
                    font-size: 1.1rem
                .box-text-title-2
                    font-size: 2rem                
                .box-text-title-3
                    font-size: 1.1rem
                    text-align: center
                .box-text-content
                    font-size: 1rem
        .quarter-section                        
            .empower-title
                &:after
                    left: 40%
                    bottom: -10px                               
            .empower-text-content
                text-align: center
        .fifth-section
            background-repeat: repeat
            background-size: contain
        .six-section            
            padding-right: 20px
            padding-left: 20px   
            padding-top: 3%
            padding-bottom: 3%            
            .lets-title
                text-align: center          
                font-size: 3rem
            .you-will
                text-align: center                                   
                font-size: 5rem
                margin-top: 0px
                line-height: 1.2em
        .contact-section
            padding-right: 0%
            padding-left: 0%
            padding-top: 0%
            padding-bottom: 0%
            .contact-register                
                .contact-header                    
                    .contact-register-title                        
                    .contact-register-content
                        &:after
                            left: 40%                                                                        
                .contact-container                    
                    padding-left: 20px
                    padding-right: 20px                    
                    .final-text                        
                    .final-text-2                    
            .contact-btn
</style>