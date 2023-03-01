<template lang="pug">
    .faq-panel
        table.subsection-header.d-none.d-md-block
            tr
                td
                    .subsection-header-icon
                        img(src="/assets/icons/ic_faq_lg.svg")
                td
                    .subsection-header-posticon
                        img(src="/assets/icons/ic_header_faq.svg")
                td
                    .subsection-title
                        |{{ $t('faq-header-title') }}
                td
                    .subsection-description
                        |{{ $t('faq-header-description') }}
        .subsection-header.d-block.d-md-none
            .subsection-header-icon
                img(src="/assets/icons/ic_faq_lg.svg")
            .subsection-header-posticon
                img(src="/assets/icons/ic_header_faq.svg")
            .subsection-title
                |{{ $t('faq-header-title') }}
            .subsection-description
                |{{ $t('faq-header-description') }}
        .content.mt-4.pa-5
            v-row 
                v-col.d-none.d-md-block.order-md-1.order-2( md="3",:class="{'pb-0': $vuetify.breakpoint.mdAndDown}")
                    v-card.elevation-0(width="100%")
                            v-card-title.justify-center
                                .card-title
                                    |{{$t('fas-need-help')}}
                                hr
                            v-card-text
                                .text-center                                
                                    v-icon.mr-1
                                        |mdi-email-outline                                    
                                    |contact@goelu.com
                                .card-img
                                    img(src="/assets/icons/ilustracion_FAQ.svg")
                v-col.order-md-2.order-1.pl-8(cols="12", md="9" , style="word-wrap:break-word")
                    v-expansion-panels(accordion flat)
                        v-expansion-panel(v-for="(item,i) in names_faq" :key="i")
                            v-expansion-panel-header(disable-icon-rotate @click="change(i)")
                                .text-left
                                    v-icon(:color="color[i]" left)
                                        |mdi-stop
                                    |{{$t(item.titulo)}}
                                template(v-slot:actions)
                                    v-icon(v-if="icon_status[i]")                                        
                                        |{{icon_rmv[i]}}
                                    v-icon(v-else)                                        
                                        |{{icon_add[i]}}
                            v-expansion-panel-content
                                v-expansion-panels(accordion flat v-if="completo[i]")
                                    v-expansion-panel(v-for="(panel,j) in item.contenido" :key="j")
                                        v-expansion-panel-header
                                            |{{ $t(panel.panel_title)}}
                                        v-expansion-panel-content
                                            .card(v-for="(contenido,k) in panel.panel_content_title" :key="k")
                                                card(:title="contenido",:text="item.contenido[j].panel_content[k]")
                                .card(v-else v-for="(panel,j) in item.contenido" :key="j")
                                    card(v-for="(contenido,k) in panel.panel_content_title" :key="k" :title="contenido",:text="item.contenido[j].panel_content[k]")
                                  
                                                                                                         
</template>


<script>
import Card from "@/components/dashboard/elements/faq/card.vue"
	export default {
		data() {
			return {
                completo:[true,false,false],
                icon_status:[false,false,false],
                icon_add:["$vuetify.icons.cadda","$vuetify.icons.caddb","$vuetify.icons.caddc"],
                icon_rmv:["$vuetify.icons.rmva","$vuetify.icons.rmvb","$vuetify.icons.rmvc"],                
                color:['cyan lighten-2','indigo','amber lighten-1'],                
                names_faq:[
                    {
                        titulo:'title-faq-how',
                        contenido:[
                            {
                                panel_title:'faq-title-1',
                                panel_content_title:['faq-title-1-title-1','faq-title-1-title-2'],
                                panel_content:['faq-title-1-content-1','faq-title-1-content-2']
                            },
                            {
                                panel_title:'faq-title-2',
                                panel_content_title:['faq-title-2-title-1','faq-title-2-title-2'],
                                panel_content:['faq-title-2-content-1','faq-title-2-content-2']
                            },
                            {
                                panel_title:'faq-title-3',
                                panel_content_title:['faq-title-3-title-1','faq-title-3-title-2','faq-title-3-title-3'],
                                panel_content:['faq-title-3-content-1','faq-title-3-content-2','faq-title-3-content-3']
                            },
                            {
                                panel_title:'faq-title-4',
                                panel_content_title:['faq-title-4-title-1','faq-title-4-title-2','faq-title-4-title-3'],
                                panel_content:['faq-title-4-content-1','faq-title-4-content-2','faq-title-4-content-3']
                            },
                            {
                                panel_title:'faq-title-5',
                                panel_content_title:['faq-title-5-title-1','faq-title-5-title-2','faq-title-5-title-3'],
                                panel_content:['faq-title-5-content-1','faq-title-5-content-2','faq-title-5-content-3']
                            },
                            {
                                panel_title:'faq-title-6',
                                panel_content_title:['faq-title-6-title-1','faq-title-6-title-2'],
                                panel_content:['faq-title-6-content-1','faq-title-6-content-2']
                            },
                            {
                                panel_title:'faq-title-7',
                                panel_content_title:['faq-title-7-title-1','faq-title-7-title-2'],
                                panel_content:['faq-title-7-content-1','faq-title-7-content-2']
                            },
                            {
                                panel_title:'faq-title-8',
                                panel_content_title:['faq-title-8-title-1','faq-title-8-title-2'],
                                panel_content:['faq-title-8-content-1','faq-title-8-content-2']
                            },
                            {
                                panel_title:'faq-title-9',
                                panel_content_title:['faq-title-9-title-1'],
                                panel_content:['faq-title-9-content-1']
                            },
                            {
                                panel_title:'faq-title-10',
                                panel_content_title:['faq-title-10-title-1'],
                                panel_content:['faq-title-10-content-1']
                            },
                            {
                                panel_title:'faq-title-11',
                                panel_content_title:['faq-title-11-title-1'],
                                panel_content:['faq-title-11-content-1']
                            },
                            {
                                panel_title:'faq-title-12',
                                panel_content_title:['faq-title-12-title-1'],
                                panel_content:['faq-title-12-content-1']
                            },
                        ]
                    },
                    {
                        titulo:'title-faq-plan',
                        contenido:[
                            {
                                panel_title:'LOG IN',
                                panel_content_title:['faq-title-13-title-1','faq-title-14-title-1','faq-title-15-title-1'],
                                panel_content:['faq-title-13-content-1','faq-title-14-content-1','faq-title-15-content-1']
                            }
                        ]
                    },
                    {
                        titulo:'title-faq-legacy',
                        contenido:[
                            {
                                panel_title:'LOG IN',
                                panel_content_title:['faq-title-16-title-1','faq-title-17-title-1','faq-title-18-title-1','faq-title-19-title-1','faq-title-20-title-1'],
                                panel_content:['faq-title-16-content-1','faq-title-17-content-1','faq-title-18-content-1','faq-title-19-content-1','faq-title-20-content-1']
                            }
                        ]
                    }
                ]
			}
		},
		activated() {
			
        },
        computed: {
			
		},
		methods: {
            change: function(opt){                
                for(let i=0; i < this.icon_status.length; i+=1){
                    if(opt==i)
                        this.icon_status[i]=!this.icon_status[i]
                    else
                        this.icon_status[i]=false
                }
            }
        },
        components: {
			Card
		}
	}
</script>


<style lang="sass">
    .faq-panel
        position: relative
        padding: 15px
        padding-bottom: 80px
        background-color: rgba(0, 0, 0, 0.05)
        min-height: 100%
        
        .subsection-header
            display: block
            position: relative
            width: 100%
            padding: 10px
            background-color: #448c5c
            background-size: cover
            background-repeat: no-repeat
            overflow: hidden
            
            .subsection-header-icon
                display: inline-block
                width: 60px
                vertical-align: top

                img
                    max-height: 100%                    
                    vertical-align: middle
        
            .subsection-header-posticon
                position: absolute
                width: 150px
                bottom: -35px
                right: 15px
                opacity: 0.3
        
            .subsection-title
                display: inline-block
                font-family: Raleway
                font-weight: 800
                font-size: 20pt
                text-transform: uppercase
                vertical-align: top
                padding-left: 15px
                color: white
                margin-top: 5px

            .subsection-description
                position: relative
                display: inline-block
                font-weight: 800
                font-family: Raleway
                font-size: 12pt
                letter-spacing: 1px
                vertical-align: top
                padding-left: 30px
                margin-top: 8px
                color: white
        
        .content
            position: relative
            background-color: #FFFFFF                  
            .v-card
                background-color: rgba(0, 0, 0, 0.05)
                .v-card__title                                                                                           
                    .card-title
                        word-break: break-word
                    hr
                        width: 80%
                        border
                .v-card__text   
                    .card-img                                                    
                        vertical-align: top
                        img
                            max-height: 100%                    
                            vertical-align: middle
            .v-expansion-panel:not(:first-child):after
                border-top: thin solid
            .v-expansion-panel-content            
                border-top: thin solid
                .v-expansion-panel-content
                    border-top: 0px
                .v-expansion-panel-content__wrap
                    padding-top: 16px


    @media only screen and (min-width: 1921px)
        .faq-panel
            .subsection-header
                .subsection-title
                    font-size: 24pt
                .subsection-description
                    font-size: 15pt


    @media only screen and (max-width: 960px)
        .faq-panel
            padding: 0
            padding-bottom: 25px
            .subsection-header
                padding-left: 90px
                padding-bottom: 15px
                .subsection-description
                    display: block
                    margin-left: 0
                    margin-top: 0
                    padding-left: 0
                .subsection-header-icon
                    position: absolute
                    top: 0
                    bottom: 0
                    margin-top: auto
                    margin-bottom: auto
                    height: 75%
                    left: 10px                                                     
                .subsection-title
                    margin-top: 0
                    margin-left: 0
                    padding-left: 0
                    display: block
            .content
                padding: 10px
</style>