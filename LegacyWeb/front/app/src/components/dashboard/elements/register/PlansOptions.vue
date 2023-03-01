<template lang="pug">
    .register-plans-options.text-center
        .register-plans-options-popular.justify-center.d-flex.align-center(:style=" popular ? 'background-color: #25a8e0 !important;' : 'background-color: white !important;' ")
            span(v-show="popular")
                |{{$t('register-plan-most')}}
        .register-plans-options-content(:style=" popular ? 'background-color: #dcecf4 !important;' : 'background-color: #f4f4f4 !important;' ")
            .register-plans-options-title
                |{{$t('register-plan-get')}} {{name}}
            .register-plans-options-text
                |{{$t(desc)}}   
            .register-plans-options-price
                |$ {{price}}   
            .register-plans-options-year
                |/{{$t('register-plan-year')}}       
            .register-plans-options-btn.pb-3
                v-btn(color="primary" x-small, @click="returnProps")
                    |{{$t('register-plan-btn')}}        
</template>
<script>
export default {
    props:['popular','name','desc','price','prop'],
    data() {
        return {

        }
    },
    methods:{
        returnProps: function () {
            this.prop.name = `${this.prop.years} years - ${this.prop.storage} GB`
            this.$emit('chosePrediPlan', this.prop)
        },
        verticalStepper: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true
		}
    }
}
</script>
<style lang="sass">
.register-plans-options.text-center    
    .register-plans-options-popular
        height: 40px        
        color: white
        text-transform: uppercase
        font-weight: 600
        font-size: 1.2rem
    .register-plans-options-content
        padding-left: 15%
        padding-right: 15%
        color: black
        .register-plans-options-title
            padding-top: 40px
            padding-bottom: 2px
            font-family: Raleway                
            font-size: 1rem
            font-weight: 600
        .register-plans-options-text            
            font-family: Raleway                
            font-size: 1rem
            font-weight: 500
            margin-bottom: 20px
        .register-plans-options-price
            font-family: Raleway                
            font-size: 2rem
            font-weight: 800        
        .register-plans-options-year
            font-family: Raleway    
            font-size: .8rem
            margin-bottom: 15px    
</style>