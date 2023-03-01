<template lang="pug">
	.scripts-subpanel
		.section-subtitle
			|{{$t('samples-scripts-examples-title')}}
		v-row
			v-col(md="4", cols="12")
				v-expansion-panels
					v-expansion-panel
						v-expansion-panel-header
							|{{ $t('scripts-text-family') }}
						v-expansion-panel-content
							.script-demo
								.script-name
									|{{ $t('scripts-text-family-name-1') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(0)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-family-name-2') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(1)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use																	
							.script-demo
								.script-name
									|{{ $t('scripts-text-family-name-3') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(2)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
			v-col(md="4", cols="12")
				v-expansion-panels
					v-expansion-panel
						v-expansion-panel-header
							|{{ $t('scripts-text-mystories') }}
						v-expansion-panel-content
							.script-demo
								.script-name
									|{{ $t('scripts-text-mystories-name-1') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(3)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-mystories-name-2') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(4)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-mystories-name-3') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(5)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-mystories-name-4') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(6)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
			v-col(md="4", cols="12")
				v-expansion-panels
					v-expansion-panel
						v-expansion-panel-header
							|{{ $t('scripts-text-lessons') }}
						v-expansion-panel-content
							.script-demo
								.script-name
									|{{ $t('scripts-text-lessons-name-1') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(7)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-lessons-name-2') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(8)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-lessons-name-3') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(9)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
							.script-demo
								.script-name
									|{{ $t('scripts-text-lessons-name-4') }}
								v-btn.view-btn(color="blue", small, tile, outlined, @click="showView(10)")
									|{{$t('buttom-view')}}
								//-v-btn.use-btn(color="blue", small, tile, outlined)
									|Use
		pre-view(:show="showForward", @close="closeFileEditor",:title="title[num]",:description="description[num]",:script="scrip")
</template>

<script>
import PreView from "@/components/dashboard/elements/samples/PreView.vue"
	export default {
		data() {
			return {
				showForward:false,
				title:['scripts-text-family-name-1','scripts-text-family-name-2','scripts-text-family-name-3',
						'scripts-text-mystories-name-1','scripts-text-mystories-name-2','scripts-text-mystories-name-3','scripts-text-mystories-name-4',
						'scripts-text-lessons-name-1','scripts-text-lessons-name-2','scripts-text-lessons-name-3','scripts-text-lessons-name-4'],
				description:['scripts-text-family-content-1','scripts-text-family-content-2','scripts-text-family-content-3',
							  'scripts-text-mystories-content-1','scripts-text-mystories-content-2','scripts-text-mystories-content-3','scripts-text-mystories-content-4',							
							  'scripts-text-lessons-content-1','scripts-text-lessons-content-2','scripts-text-lessons-content-3','scripts-text-lessons-content-4'],
				num:0				
			}
		},
		computed: {
			scrip:function(){
				if(this.num<3)
					return "scripts-text-family"
				else if(this.num>2 && this.num<7)
					return "scripts-text-mystories"
				else
					return "scripts-text-lessons"
			}
		},
		methods: {
			 closeFileEditor: function(){
				this.showForward=false					
			 },
			 showView:function(n){
				 this.showForward=true	
				 this.num=n			 
			 }
		},
		components: {
			'pre-view':PreView
		}
	}
</script>


<style lang="sass">
	.scripts-subpanel
		padding: 15px
		background-color: #f2f2f2
		.section-subtitle
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-weight: 700
			text-transform: uppercase
			font-size: 20px
		.v-expansion-panel
			&:before
				box-shadow: none
			.v-expansion-panel-header
				text-transform: uppercase
				font-weight: 600
				letter-spacing: 1px
			.v-expansion-panel-content__wrap
				padding: 0

			.script-demo
				position: relative
				padding-top: 10px
				padding-bottom: 10px
				padding-left: 25px
				padding-right: 25px
				.script-name
					font-weight: 500
					font-size: 16px 
				.v-btn.view-btn
					position: absolute
					right: 90px
					top: 50%
					transform: translateY(-50%)
					opacity: 0
					transition: 0.2s linear all
				.v-btn.use-btn
					position: absolute
					right: 25px
					top: 50%
					transform: translateY(-50%)
					opacity: 0
					transition: 0.2s linear all

				&:hover
					background-color: rgba(33, 150, 243, 0.05)

					.v-btn
						opacity: 1
						transition: 0.2s linear all


	@media only screen and (min-width: 1265px)
		.scripts-subpanel
	@media only screen and (min-width: 1904px)
		.scripts-subpanel
	@media only screen and (max-width: 1264px)
		.scripts-subpanel
	@media only screen and (max-width: 960px)
		.scripts-subpanel
			padding: 15px
			.script-demo
	@media only screen and (max-width: 600px)
		.scripts-subpanel
</style>