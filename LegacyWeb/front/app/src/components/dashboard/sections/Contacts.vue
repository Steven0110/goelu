<template lang="pug">
	.contacts-panel
		table.subsection-header.d-none.d-md-block
			tr
				td
					.subsection-header-icon
						img(src="/assets/icons/ic_contacts_lg.svg")
				td
					.subsection-header-posticon
						img(src="/assets/icons/ic_header_contact.svg")
				td
					.subsection-title
						|{{ $t('contacts-header-title') }}
				td
					.subsection-description
						|{{ $t('contacts-header-description') }}

		.subsection-header.d-block.d-md-none
			.subsection-header-icon
				img(src="/assets/icons/ic_contacts_lg.svg")
			.subsection-header-posticon
				img(src="/assets/icons/ic_header_contact.svg")
			.subsection-title
				|{{ $t('contacts-header-title') }}
			.subsection-description
				|{{ $t('contacts-header-description') }}
		.content

			v-tabs(v-model="tabs", color="#3A6BD6")
				v-tab(key="contacts-tab")
					|{{ $t('contacts') }}
				v-tab(key="groups-tab")
					|{{ $t('groups') }}
			v-tabs-items(v-model="tabs", touchless)
				v-tab-item(key="contacts-tab")
					contacts
				v-tab-item(key="groups-tab")
					groups
</template>

<script>
	import Contacts 	from "@/components/dashboard/elements/contacts/Contacts.vue"
	import Groups 		from "@/components/dashboard/elements/contacts/Groups.vue"
	export default {
		data() {
			return {
				tabs: null
			}
		},
		components: {
			Contacts,
			Groups
		},
		activated() {
			if( this.$route.query.newGroup )
				this.tabs = 1
		}
	}	
</script>

<style lang="sass">
	.contacts-panel
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
			padding-bottom: 10px
			background-color: #486FD6
			background-size: 100% 100%
			background-repeat: no-repeat
			overflow: hidden

			.subsection-header-posticon
				position: absolute
				width: 200px
				bottom: -35px
				right: 0
				opacity: 0.3

			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%
					vertical-align: middle

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				padding-left: 15px
				color: white
				letter-spacing: 2px
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
			.v-tabs
				.v-tab
					max-width: none !important
					width: 50%
					font-weight: 600
					&.v-tab--active
						box-shadow: 0px 0px 15px -10px black

	@media only screen and (min-width: 1367px)
		.contacts-panel
			.content
	@media only screen and (min-width: 1921px)
		.contacts-panel
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
	@media only screen and (max-width: 768px)
		.contacts-panel
			padding: 0
			padding-bottom: 50px
			.subsection-header
				padding-left: 90px
				padding-bottom: 15px
				.subsection-description
					display: block
					margin-left: 0
					margin-top: 0
					padding-left: 15px
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
					display: block

				.subsection-header-posticon
					width: 180px
			.content
				padding: 0
</style>