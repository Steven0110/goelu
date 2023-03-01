<template lang="pug">
.plan-table-movil
    .t(style="height:50px;" v-show="!popular")
    table(:style=" popular ? 'border: 2px solid #25a8e0 !important;' : 'border: 2px solid #f4f4f4 !important;' ", :class="mostPopular")
        tr(v-show="popular")
            th.text-center(:style=" popular ? 'background:#25a8e0 !important; ': '' ")
                span.most-pupular-text(v-show="popular")
                    |{{$t('plans-text-most-popular')}}                  
        tr
            td.text-center(class="plans-text-name", :style=" popular ? 'background:#25a8e0 !important; color:white;': 'background:#f4f4f4 !important;' ")
                |{{$t('plans-text-name')}} {{name}}
        tr
            td
                v-row
                    v-col(cols="4", style="margin: auto")                        
                        |Price
                    v-col(cols="8", style="text-align:right; padding-right:30px;")
                        span(class="plans-text-price")
                            |$ {{price}} 
                        span()
                            |/{{$t('plans-text-year')}}
        tr
            td                
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-video')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[0]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-send')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")                
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[1]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-delivery')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[2]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-legacy')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[3]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-email')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[4]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-up')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[5]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-safeguard')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[6]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr
            td
                v-row
                    v-col(cols="10")
                        |{{$t('plans-text-table-preferential')}}
                    v-col.pl-0.align-center.d-flex.justify-center(cols="2")
                        img(src="/assets/icons/icono_tabla_palomita.svg", v-if="check[7]")
                        img(src="/assets/icons/icono_tabla_tache.svg", v-else)
        tr(class="last")
            td.text-center(:style=" popular ? 'background: #c4dcfc !important; ': 'background:white !important;' ")
                v-btn(color="primary" small, @click="goTo")
                    |{{$t('plans-text-btn-get')}}
    .space()
        |&nbsp;
    |&nbsp;
</template>
<script>
export default {
    props:['popular','name','price','check'],
    data() {
        return{

        }
    },
     computed: {
        mostPopular: function() {
            return this.popular ? 'table-popular' : '';
        }
    },
    methods :{
        goTo: function (){            
            this.$router.push({path: '/register', query: {planTable: "true"}})
        },
    },
}
</script>
<style lang="sass">
.plan-table-movil
    table
        width: 100%
        font-family: Raleway        
        empty-cells: hide
        text-align: left
        border-spacing: 0
        border-radius: 10px
        color: black
        height: 100%        
        tr
            .plans-text-name
                text-transform: uppercase
                font-size: 1.4rem                
                font-weight: 700
            &:nth-child(even)
                background-color: #f4f4f4
            &:nth-child(odd)
                background-color: white
            th                
                border-radius: 6px 6px 0px 0px
                height: 50px
            td
                height: 50px
                padding-left: 10px 
                .min-table                    
                    min-height: 50px
                .plans-text-price
                    font-size: 2.2rem
                    font-weight: 800
                img
                   width: 25px                   
                    
        .last
            td
                border-radius: 0px 0px 10px 10px
    .table-popular        
        .most-pupular-text
            color: white 
            text-transform: uppercase            
            font-size: 1.2rem
            font-weight: 500            
        tr
            &:nth-child(even)
                background-color: #a4d4f4 !important
            &:nth-child(odd)
                background-color: #c4dcfc !important
</style>