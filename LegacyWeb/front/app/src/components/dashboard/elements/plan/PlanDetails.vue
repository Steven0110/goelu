<template lang="pug">
	.plan-details.ma-4
		v-row
			v-col.px-8(md=6, cols=12)
				.img-contain.d-none.d-md-block( :class="{'pb-0': $vuetify.breakpoint.mdAndDown}")
					img(src="/assets/images/goelu_plan_storage-01.png" )
				grid-option.mt-4(
				:name="$t('my-plan-time')",
				:description="$t('your-plan-includes')",
				:to="{path: '/dashboard/upload'}",
				icon="/assets/icons/ic_plan_storage_lg.svg",
				background="/assets/images/bg_plans_time.jpg",
				:val="years($store.getters.plan.name)"
				)
			v-col.px-8(md=6, cols=12)
				.statistics-planes
					consuming-analytics
					v-row
						.pl-8.my-2
							p.font-weight-bold
								|STORAGE: {{storage($store.getters.plan.name)}}
					v-row
						.pl-8.font-weight-thin
							|{{$t('my-plan-your-subs')}} {{date($store.getters.plan.endDate)}}
					v-row
						.pl-8.mt-2.font-weight-thin
							|{{$t('my-plan-your-memories')}}
				grid-option.mt-4(
				:name="$t('my-plan-storage')",
				:description="$t('your-plan-includes')",
				:to="{path: '/dashboard/upload'}",
				icon="/assets/icons/ic_plan_time_lg.svg",
				background="/assets/images/bg_plans_storage.jpg",
				:val="storage($store.getters.plan.name)"
				)
</template>

<script>
	import GridOption 			from "@/components/dashboard/elements/plan/GridOption.vue"
	import ConsumingAnalytics 	from "@/components/dashboard/elements/analytics/ConsumingAnalytics.vue"

	export default {
		data() {
			return {
				aux:""
			}
		},
		components: {
			GridOption,
			ConsumingAnalytics
		},
		beforeCreate() {				
								
		},
		computed: {
			
		},
		methods: {	
			years:function(params) {
				if(params!=undefined)
					return params.split('-')[0]
				else
					return ""
			},
			storage:function(params) {
				if(params!=undefined)
					return params.split('-')[1]
				else
					return ""
			},
			date: function(params){
				if(params!=undefined)
					return params.split('T')[0]
				else
					return ""
			}		
		}
	}
</script>

<style lang="sass">
	.plan-details
		position: relative		
		min-height: 100%
		.img-contain			
			width: 100%
			height: 300px
			text-decoration: none
			display: block
			text-align: center			
			background-color: white !important
			img
				display: inline-block
				height: 300px
		.statistics-planes
			height: 300px
			background-color: white !important
	
	@media only screen and (max-width: 600px)
		.plan-details
			.statistics-planes
				height: 4r00px
</style>