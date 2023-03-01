<template lang="pug">
    .plans-section
        .register-menu
            index-menu
        .first-section
            .presentation
                v-row(style="height:100%;")
                    v-col.text-center( md = "6", cols = "12" )
                        .plans-first-img-cotainer
                            img( src = "/assets/images/ilustracion_screen_plans-02.svg" )
                    v-col.text-center.text-md-left( md = "6", cols = "12" )
                        .plans-first-text-cotainer
                            p.plans-text-title
                                |{{$t('plans-text-title')}}
                            p.plans-text-content
                                |{{$t('plans-text-content-1')}}
                                br
                                |{{$t('plans-text-content-2')}}
                            v-btn(class="plans-btn" color="primary"  v-scroll-to="'#section-two'")
                                |{{$t('plans-text-btn')}}
        .plans-goelu-section#section-two(v-if="verticalStepper")
            .plans-goelu-section-title.text-center                                    
                span(style="color:rgb(58, 169, 224);")
                    |g
                span
                    |oel
                span(style="color:rgb(58, 169, 224);")
                    |U
                span(style="text-transform: uppercase;") 
                    |{{$t('plans-menu-tag')}}
            .plans-goelu-table
                 v-carousel(height="100%", :cycle="true", interval="8000", :hide-delimiter-background="true", :show-arrows="false" class="custom-carousel")
                    v-carousel-item
                        plan-table-movil(:popular="popular[0]", :name="name[0]", :price="price[0]", :check="check[0]")
                    v-carousel-item
                        plan-table-movil(:popular="popular[1]", :name="name[1]", :price="price[1]", :check="check[1]")
                    v-carousel-item
                        plan-table-movil(:popular="popular[2]", :name="name[2]", :price="price[2]", :check="check[2]")
        .plans-goelu-section#section-two(v-else)
            .plans-goelu-section-title.text-center                                    
                span(style="color:rgb(58, 169, 224);")
                    |g
                span
                    |oel
                span(style="color:rgb(58, 169, 224);")
                    |U
                span(style="text-transform: uppercase;") 
                    |{{$t('plans-menu-tag')}}
            .plans-goelu-table
                v-row
                    v-col(md="3" v-show="!($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)")
                        .table-names
                            table                                
                                tr
                                    td(style="border-radius: 10px 0px 0px 0px")
                                        |{{$t('plans-text-table-price')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-video')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-send')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-delivery')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-legacy')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-email')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-up')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-safeguard')}}
                                tr
                                    td
                                        |{{$t('plans-text-table-preferential')}}
                                tr
                                    td(style="background-color: #25a8e0; border-radius: 0px 0px 0px 10px;")
                                        |&nbsp;
                    v-col(cols="12" md="3")
                        plan-table(:popular="popular[0]", :name="name[0]", :price="price[0]", :check="check[0]")
                    v-col(cols="12" md="3")
                        plan-table(:popular="popular[1]", :name="name[1]", :price="price[1]", :check="check[1]")
                    v-col(cols="12" md="3")
                        plan-table(:popular="popular[2]", :name="name[2]", :price="price[2]", :check="check[2]")
        .plans-goelu-life
            .plans-goelu-life-title
                p.goelu
                    |goelu 
                    span(style="font-family:  'Great Vibes', cursive ;")
                        | {{$t('plans-life-title')}}
                .plans-goelu-life-title-2.mb-5
                    .up-to-years
                        .up-to
                            p
                                |{{$t('plans-life-up')}}
                        .years
                            p
                                |{{$t('plans-life-years')}}
                        .of-use
                            p
                                |{{$t('plans-life-of')}}
            .plans-goelu-life-table(v-if="verticalStepper")
                v-carousel(height="100%", :cycle="true", interval="8000", :hide-delimiter-background="true", :show-arrows="false")
                    v-carousel-item
                        plan-table-life(:feature="tableLife[0]")
                    v-carousel-item
                        plan-table-life(:feature="tableLife[1]")
                    v-carousel-item
                        plan-table-life(:feature="tableLife[2]")
                    v-carousel-item
                        plan-table-life(:feature="tableLife[3]")
            .plans-goelu-life-table(v-else)
                v-row
                    v-col.pr-0(cols=12, md="3")
                        plan-table-life(:feature="tableLife[0]")
                    v-col.pr-0(cols=12, md="3")
                        plan-table-life(:feature="tableLife[1]")
                    v-col.pr-0(cols=12, md="3")
                        plan-table-life(:feature="tableLife[2]")
                    v-col.pr-0(cols=12, md="3")
                        plan-table-life(:feature="tableLife[3]")

        .plans-goelu-gif.text-center
            .step-header-description
                |{{ $t('customize-your-plan') }}
            <img src="/assets/images/gifs/promotion.gif" v-if="gif">
            <img src="/assets/images/gifs/promotion_ESP.gif" v-else>
            

</template>
<script>
import IndexMenu from "@/components/dashboard/elements/IndexMenu.vue"
import PlanTable from "@/components/dashboard/elements/plan/PlanTable.vue"
import PlanTableLife from "@/components/dashboard/elements/plan/PlanTableLife.vue"
import PlanTableMovil from "@/components/dashboard/elements/plan/PlanTableMovil.vue"
export default {
    data(){
        return {
            popular: [false,true,false],
            name: ['5 GB','10 GB','20 GB'],
            price: ['7.50','14.99','29.99'],
            check:  [[true,true,true,true,true,true,false,false],
                     [true,true,true,true,true,true,false,false],
                     [true,true,true,true,true,true,false,false]],
            tableLife: [
                {
                    popular: false,
                    name:"10 GB",
                    price:"420.00",
                    include:["plans-life-get-1","plans-life-get-2","plans-life-get-3","plans-life-get-4","plans-life-get-5","plans-life-get-6"],
                    includeG:["plans-life-get-7","plans-life-get-8-1"]
                },
                {
                    popular: false,
                    name:"20 GB",
                    price:"720.00",
                    include:["plans-life-get-1","plans-life-get-2","plans-life-get-3","plans-life-get-4","plans-life-get-5","plans-life-get-6"],
                    includeG:["plans-life-get-7","plans-life-get-8-2"]
                },
                {
                    popular: true,
                    name:"50 GB",
                    price:"1,399.99",
                    include:["plans-life-get-1","plans-life-get-2","plans-life-get-3","plans-life-get-4","plans-life-get-5","plans-life-get-6"],
                    includeG:["plans-life-get-7","plans-life-get-8-3"]
                },
                {
                    popular: false,
                    name:"100 GB",
                    price:"2,399.99",
                    include:["plans-life-get-1","plans-life-get-2","plans-life-get-3","plans-life-get-4","plans-life-get-5","plans-life-get-6"],
                    includeG:["plans-life-get-7","plans-life-get-8-4"]
                }
            ]
        }
    },
    computed: {
        verticalStepper: function() {
				if(this.$vuetify.breakpoint.width > 960)
					return false
				else
					return true
		},
        gif:function(){
				if(this.$i18n.locale == 'en' )
					return true
				else
					return false
			}
    },
    components: {			
		IndexMenu,       
        "plan-table":PlanTable,
        "plan-table-life":PlanTableLife,
        "plan-table-movil":PlanTableMovil
	}
}
</script>
<style lang="sass" >
.plans-section
    .first-section
        margin-top: 9vh
        height: 90vh 
        .presentation
            height: 100%
            .plans-first-img-cotainer
                position: relative
                top: 50%
                transform: translateY(-50%)
                padding-left: 75px
                padding-right: 75px   
                img
                    max-width: 800px
            .plans-first-text-cotainer
                position: relative
                top: 50%
                transform: translateY(-50%)                
                .plans-text-title
                    font-family: Raleway
                    font-weight: 700
                    font-size: 2rem
                    line-height: 1em
                .plans-text-content                    
                    font-family: Raleway                    
                    font-size: 1rem
                    line-height: 1.5em
    .plans-goelu-section
        background-image: url('/assets/images/goelu_fndo_gris_plans.jpg')
        background-repeat: no-repeat
        background-size: cover
        .plans-goelu-section-title
            padding-top: 30px
            font-family: Raleway
            font-weight: 700
            font-size: 3rem
        .plans-goelu-table
            padding-left: 50px
            padding-right: 50px
            padding-bottom: 30px
            .custom-carousel
                .v-carousel__controls__item.v-btn                    
                    color: #cccccc
                    &:hover                        
                        color: #25a8e0
                    &:hover::before                              
                        opacity: 0 
                .v-carousel__controls__item.v-btn.v-btn--active
                    color: #25a8e0
                    &::before
                        opacity: 0
                               
            .table-names
                table
                    border: 2px solid #f4f4f4 !important
                    border-spacing: 0                    
                    color: white
                    empty-cells: hide                    
                    font-family: Raleway
                    font-weight: 500
                    margin-top: 100px
                    text-align: right
                    width: 100%
                    text-transform: uppercase                    
                    tr
                        &:nth-child(even)
                            background-color: #54bce4
                        &:nth-child(odd)
                            background-color: #25a8e0
                        th
                            height: 50px                        
                        td
                            height: 50px
                            padding-right: 20px
    .plans-goelu-life
        background-image: url('/assets/images/goelu_fndo_azul_plans.jpg')
        background-repeat: no-repeat
        background-size: cover
        padding-bottom: 50px        
        .plans-goelu-life-title
            color: white
            font-family: Raleway
            padding-top: 30px            
            text-align: center
            position: relative
            .goelu
                font-weight: 500
                font-size: 4rem
            .plans-goelu-life-title-2
                padding-left: 40%
                padding-right: 40%
                .up-to-years
                    position: relative
                    height: 100px                
                    .up-to
                        text-align: left
                        text-transform: uppercase
                        font-size: 1.5rem
                        font-weight: 600                    
                        position: absolute
                        width: 100%                    
                        p
                            margin-block-end: 0px    
                    .years                
                        text-transform: uppercase
                        font-size: 2.5rem
                        font-weight: 800
                        margin-block-end: 0px
                        position: absolute 
                        top: 80%
                        transform: translateY(-50%)
                        text-align: center                    
                        margin-top: -36px
                        width: 100%
                    .of-use
                        text-transform: uppercase
                        font-size: 1.5rem
                        text-align: right
                        font-weight: 600
                        margin-block-end: 0px
                        position: absolute   
                        top: 88%                    
                        margin-top: -36px
                        width: 100%
        .plans-goelu-life-table
            padding-left: 10%
            padding-right: 10%   
        
    .plans-goelu-gif        
        padding-top: 100px
        background-color: white
        .step-header-description
            position: relative
            font-family: Raleway
            letter-spacing: 1px
            text-align: center
            font-size: 20px
            text-transform: uppercase
            font-weight: 700            
            &:before
                position: absolute
                content: ''
                height: 2px
                width: 50px
                background: black
                bottom: -10px
                margin-left: auto
                margin-right: auto
                left: 0
                right: 0
        img
            width: 800px               

@media only screen and (max-width: 1610px)
    .plans-section        
        .plans-goelu-life
            .plans-goelu-life-table
                padding-left: 3%
                padding-right: 3%

@media only screen and (max-width: 1264px)
    .plans-section
        .first-section            
            height: auto 
@media only screen and (max-width: 960px)
    .plans-section
        .first-section            
            .presentation
                height: 100%
                .plans-first-img-cotainer                    
                    padding-left: 25px
                    padding-right: 25px
                    img
                        max-width: 400px
                .plans-first-text-cotainer
                    margin-top: 10px
                    padding-left: 25px
                    padding-right: 25px
                    .plans-text-title                                                
                        font-size: 2.4rem                        
                    .plans-text-content                        
                        font-size: 1.3rem
                    .plans-btn
                        margin-top: 10px                 
        .plans-goelu-life        
            .plans-goelu-life-title
                margin-bottom: 10px
                .goelu                    
                    font-size: 3.5rem
                .plans-goelu-life-title-2
                    padding-left: 15%
                    padding-right: 15%
                    margin-bottom: 60px  !important
                    .up-to-years                    
                        height: 120px
                        .up-to                        
                            font-size: 1.8rem                        
                        .years                        
                            font-size: 3.5rem
                            margin-top: 0px
                            top: 60%                        
                        .of-use              
                            font-size: 1.8rem
                            margin-top: 0px
                            top: 70%
            .plans-goelu-life-table
                padding-left: 20%
                padding-right: 20%
@media only screen and (max-width: 520px)
    .plans-section
        .first-section            
            .presentation                
                .plans-first-img-cotainer                                        
                    img
                        max-width: 250px
                .plans-first-text-cotainer                    
                    .plans-text-title                                                
                        font-size: 2rem                        
                    .plans-text-content                        
                        font-size: 1rem
        .plans-goelu-section                
            .plans-goelu-table
                padding-left: 15px
                padding-right: 15px
        .plans-goelu-life        
            .plans-goelu-life-title                
                padding-left: 10px
                padding-right: 10px                
                .goelu                    
                    font-size: 3rem
                .plans-goelu-life-title-2
                    padding-left: 10px
                    padding-right: 10px
                    .up-to-years                    
                        height: 150px
                        .up-to                        
                            font-size: 1.8rem                        
                        .years                        
                            font-size: 3rem
                            top: 60%                         
                        .of-use                        
                            font-size: 1.8rem 
                            top: 80% 
            .plans-goelu-life-table
                padding-left: 10px
                padding-right: 10px 
        .plans-goelu-gif
            img
                max-width: 300px                         
</style>