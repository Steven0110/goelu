<template lang="pug">
    .plan-table-life(:class="mostPopular")
        .mostpp(v-show="feature.popular")
            p
                |{{$t('plans-text-most-popular')}} 
        .tabless
            v-card.eleevation-0(:color="feature.popular ? 'rgba(255, 255, 255, 0.6)':'rgba(255, 255, 255, 0.8)'")
                v-card-title.justify-center.pt-10.plan-table-life-title
                    |{{$t('plans-text-name')}} {{feature.name}}
                v-card-text
                    .plan-table-life-price
                        p
                            |$ {{feature.price}}
                    .plan-table-life-icon-and-text                    
                        .plan-table-life-icon-text(v-for="(item, index) in feature.include" :key="index+1")
                            v-row
                                v-col.pb-1(cols="2", md="1")
                                    img(src="/assets/icons/icono_tabla_palomita.svg")
                                v-col.pb-1(cols="10", md="11")
                                    | {{$t(item)}}
                        .plan-table-life-icon-text(v-for="(item, index) in feature.includeG" :key="index+10")
                            v-row
                                v-col.pb-1(cols="2", md="1")
                                    img(src="/assets/icons/icono_tabla_g.svg")
                                v-col.pb-1(cols="10", md="11", v-html="$t(item)")                               
                    .plan-table-life-btn.text-center
                        v-btn.white--text(color="#2646b4" x-small, @click="goTo")
                            |{{$t('plans-text-btn-get')}}
        br
        br        
        .space(v-show="!verticalStepper")
            |&nbsp;                    
                        
                        
</template>
<script>
export default {
    props:['feature'],
    data() {
        return {
            
        }
    },
    computed: {
        mostPopular: function() {
            return this.feature.popular ? 'plan-popular' : '';
        },
        verticalStepper: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true
		}
    },
    methods :{
        goTo: function (){            
            this.$router.push({path: '/register', query: {planTableLife: "true"}})
        },
    },
}
</script>
<style lang="sass">
.plan-table-life
    font-family: Raleway
    position: relative
    .mostpp
        padding-left: 20%
        padding-right: 20%    
        width: 100%
        text-align: center
        position: absolute
        top: -25px
        z-index:2
        color: #25a8e0
        text-transform: uppercase
        font-weight: 500
        p
            background-color: rgba(255, 255, 255, 0.9)
            padding-top: 10px
            padding-bottom: 10px
            margin-block-end: 0px
    .tabless
        z-index:1        
        .plan-table-life-title
            font-weight: 600
            font-size: 1.3rem
        .plan-table-life-price
            font-weight: 800
            font-size: 1.8rem
            color: black
            text-align: center
        .plan-table-life-icon-and-text
            padding-left: 10px
            padding-right: 10px
            .plan-table-life-icon-text
                color: black
                font-size: .9rem
                img
                    width: 25px
@media only screen and (max-width: 960px)
    .plan-table-life
        .mostpp
            top: -13px
    .plan-popular
        margin-top: 10px
</style>