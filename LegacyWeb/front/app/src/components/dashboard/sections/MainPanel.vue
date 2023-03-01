<template lang="pug">
	.main-panel
		v-row
			v-col.pl-6.pt-0(cols="12", md="6")
				v-row
					v-col.pr-1.pb-0(cols="12")
						video-player(src="/assets/images/slider.jpg", title="The first time I saw you", date="", description="Jhonny Walker's birth day")
				v-row
					v-col.pr-1(md="6", cols="12")
						plan-card
					v-col.pr-1.pl-2(md="6", cols="12", :class="{'pl-1': $vuetify.breakpoint.mdAndUp}")
						accounts-card
				v-row
					v-col.pr-1.pt-0(cols="12")
						files-analytics
				v-row
					v-col.pr-1.pt-0(cols="12", :class="{'pb-0': $vuetify.breakpoint.smAndDown}")
						recent-activity
			v-col.pl-4.pt-0.pr-4(cols="12", md="6")
				v-row.options-grid.d-none.d-md-flex
					v-col.pr-2.pl-1(sm="6", :class="{'pl-3': $vuetify.breakpoint.mdAndDown}")
						grid-option.first(
							:name="$t('upload-file-grid-title')",
							:description="$t('upload-file-grid-description')",
							:to="{path: '/dashboard/upload'}",
							icon="/assets/icons/ic_upload_lg.svg",
							background="/assets/images/bg_upload.jpg",
							)
						grid-option.mt-3(
							:name="$t('file-manager-grid-title')",
							:description="$t('file-manager-grid-description')",
							:to="{path: '/dashboard/file-manager'}",
							icon="/assets/icons/ic_file_manager_lg.svg",
							background="/assets/images/bg_file_manager.jpg",
							)
					v-col.pr-1.pl-1(sm="6", :class="{'pl-3': $vuetify.breakpoint.smAndDown}")
						grid-option.first(
							:name="$t('record-grid-title')",
							:description="$t('record-grid-description')",
							:to="{path: '/dashboard/record'}",
							icon="/assets/icons/ic_record_lg.svg",
							background="/assets/images/bg_record.jpg",
							)
						grid-option.mt-3(
							:name="$t('calendar-grid-title')",
							:description="$t('calendar-grid-description')",
							:to="{path: '/dashboard/calendar'}",
							icon="/assets/icons/ic_calendar_lg010.svg",
							background="/assets/images/bg_calendar.jpg",
							)
				v-row
					v-col.pr-1.pl-1.pt-0(cols="12", :class="{'pl-3': $vuetify.breakpoint.smAndDown}")
						consuming-analytics
				v-row
					v-col.pr-1.pl-1.pt-0(cols="12", :class="{'pl-3': $vuetify.breakpoint.smAndDown}")
						events

</template>

<script>
	import VideoPlayer	 		from "@/components/dashboard/elements/VideoPlayer.vue"
	import GridOption 			from "@/components/dashboard/elements/GridOption.vue"
	import Events 				from "@/components/dashboard/elements/analytics/Events.vue"
	import FilesAnalytics 		from "@/components/dashboard/elements/analytics/FilesAnalytics.vue"
	import ConsumingAnalytics 	from "@/components/dashboard/elements/analytics/ConsumingAnalytics.vue"
	import RecentActivity		from "@/components/dashboard/elements/analytics/RecentActivity.vue"
	import PlanCard				from "@/components/dashboard/elements/cards/PlanCard.vue"
	import AccountsCard			from "@/components/dashboard/elements/cards/AccountsCard.vue"

	export default {
		components: {
			GridOption,
			VideoPlayer,
			Events,
			FilesAnalytics,
			RecentActivity,
			PlanCard,
			AccountsCard,
			ConsumingAnalytics
		},
		mounted(){
		}
	}
</script>

<style lang="sass">
	.main-panel
		position: relative
		display: block
		width: 100%
		padding-right: 15px
		background-color: rgba(0, 0, 0, 0.05)
		padding-bottom: 50px
</style>