<template lang="pug">
    .register-plans-life-options.text-center
        .mostpp(v-show="popular")
            p
                |Most Popular
        .register-plans-life-options-content(:style=" popular ? 'background-color: rgba(255, 255, 255, 0.7) !important;' : 'background-color: rgba(255, 255, 255, 0.9) !important;' ")
            .register-plans-life-options-title
                |{{$t('register-plan-get')}} {{name}}
            .register-plans-life-options-text
                |{{$t(desc)}}   
            .register-plans-life-options-price
                |$ {{price}}
            .register-plans-life-options-btn.pb-3
                v-btn(color="white", x-small, style="color:#25a8e0;", @click="returnProps")
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
        }
    }
}
</script>
<style lang="sass">
.register-plans-life-options
    position: relative
    .mostpp
        padding-left: 25%
        padding-right: 25%    
        width: 100%
        text-align: center
        position: absolute
        top: -25px
        z-index:2
        color: #25a8e0

        text-transform: uppercase
        font-weight: 500
        p
            background-color: rgba(255,255,255,0.85) 
            padding-top: 5px
            padding-bottom: 5px
            margin-block-end: 0px 
    .register-plans-life-options-popular
        height: 40px        
        color: white
        text-transform: uppercase
        font-weight: 600
        font-size: 1.2rem
    .register-plans-life-options-content
        color: black
        padding-left: 15%
        padding-right: 15%
        .register-plans-life-options-title
            padding-top: 40px
            padding-bottom: 2px
            font-family: Raleway                
            font-size: 1.6rem
            font-weight: 600
            margin-bottom: 10px
        .register-plans-life-options-text            
            font-family: Raleway                
            font-size: 1rem
            font-weight: 500
            margin-bottom: 10px
        .register-plans-life-options-price
            font-family: Raleway                
            font-size: 2rem
            font-weight: 800
            margin-bottom: 20px
@media only screen and (max-width: 960px)
    .register-plans-life-options
        .mostpp
            top: 2px
</style>