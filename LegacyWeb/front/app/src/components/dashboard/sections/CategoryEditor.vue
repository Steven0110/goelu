<template lang="pug">
	.category-editor
		.subsection-header
			.subsection-header-icon
				img(src="/assets/icons/ic_categories_lg.svg")
			.subsection-title
				|Categories
			.subsection-description
				|Add or remove topics and categories

		v-tabs(v-model="tabs", color="#cd674c")
			v-tab(key="topics-tab", disabled)
				|Topics
			v-tab(key="categories-tab")
				|Categories

		.return-bar
			router-link(:to="{path: '/dashboard/categories'}")
				span
					v-icon(color="black")
						|mdi-chevron-left
				span
					|Return to categories
		v-row
			v-col(cols="6")
				.edit-category
					.trigger
						|{{ category }}
					.subtitle
						|Category Info
					v-card.edit-category-card(width="100%")
						v-card-text
							v-form(ref="editCategoryForm")
								v-text-field(
									append-icon="mdi-format-title",
									v-model="edittingCategory.name",
									label="Category Name *",
									:rules="form.validations.required",
									background-color="white",
									outlined,
									required)

								v-select(
									append-icon="mdi-chevron-down",
									:items="topics",
									item-text="name",
									item-value="_id",
									v-model="edittingCategory.topic",
									:rules="form.validations.required",
									outlined,
									label="Topic *")

								v-textarea(
									append-icon="mdi-text",
									v-model="edittingCategory.description",
									label="Description *",
									:rules="form.validations.required",
									background-color="white",
									outlined,
									required)
					
					//loader(position="absolute", background="white", v-show="status.deleting || status.updating", image="/assets/icons/loading.gif")

			v-col(cols="6")
				.edit-category-contacts
					.subtitle
						|Contacts

					v-expansion-panels.contacts-expansion-panel(hover)
						v-expansion-panel
							v-expansion-panel-header
								|Select to add contacts
							v-expansion-panel-content
								.contacts-list
									v-checkbox(
										v-model="edittingCategory.contacts",
										v-for="contact in contacts",
										:value="contact._id",
										color="#a44933",
										:key="contact._id")

										template(v-slot:label)
											.contact-info
												.contact-picture
													img(:src="contact.pictureURL")
												.contact-name
													|{{ contact.name }}

					v-alert(color="orange", icon="mdi-alert", ref="alert", :value="false", dismissible)
						|You must choose at least one contact

			v-col(cols="6")
				v-row.category-actions
					v-col(cols="4")
						v-btn.elevation-0.add-category-btn(
							color="#cd684c",
							raised,
							tile,
							:loading="status.deleting"
							block,
							@click="deleteCategory")
							|Delete category
					v-col(cols="4")
						v-btn.elevation-0.add-category-btn(
							color="#999999",
							raised,
							tile,
							block,
							@click="$router.push({path: '/dashboard/categories'})")
							|Cancel
					v-col(cols="4")
						v-btn.elevation-0.add-category-btn(
							color="#3f64d9",
							raised,
							tile,
							block,
							:loading="status.creating"
							@click="updateCategory")
							|Done
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		data(){
			return {
				edittingCategory: {},
				status: {
					deleting: false,
					updating: false,
				},
				tabs: 1,
                form: {
                    validations: {
                        required: [
                            v => !!v || 'This field is required',
                        ],
                    }
                },
			}
		},
		computed: {
			category: function() {
				let categories = this.$store.getters.categories
				let cat = {}
				
				for( let i = 0 ; i < categories.length ; i++ )
					if( categories[ i ]._id == this.$route.params.id)
						cat = categories[ i ]

				if( cat.contacts )
					cat.contacts = cat.contacts.map(a => a._id || a)

				this.edittingCategory = cat

				return null
			},
			contacts: function(){
				return this.$store.getters.contacts
			},
			topics: function(){
				return this.$store.getters.topics
			},
			gettingCategories: function(){
				return this.$store.getters.gettingCategories
			},
		},
		methods: {
			deleteCategory: function() {
				this.$swal({
					title: `Are you sure you want to delete ${this.edittingCategory.name}?`,
					text: "This action can not be undone",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes, delete",
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then(result => {

				  	if(result.value) {

				  		this.status.deleting = true
				  		this.$store.commit("setCategoriesStatus", true)

						let url = this.baseApi + this.env + "category/" + this.edittingCategory._id

				  		this.axios.delete( url )
				  		.then( result => {
				  			this.$store.commit("removeCategory", this.edittingCategory)
				  			this.$swal("Done!", this.edittingCategory.name + " was deleted successfully", "success")
				  			.then( () => {
				  				this.$router.push({path: "/dashboard/categories"})
				  			})
				  		})
				  		.catch( err => {
				  			console.log( err )
				  		})
				  		.finally(() => {
				  			this.status.deleting = true
				  			this.$store.commit("setCategoriesStatus", false)
				  		})

				  	}
				})

			},
			updateCategory: function() {

				if( this.edittingCategory._id === undefined )
					this.$router.push({path: "/dashboard/categories"})

				if( this.$refs.editCategoryForm.validate() ){
					if( this.edittingCategory.contacts.length > 0 ){

						this.status.updating = true

						let url = this.baseApi + this.env + "category/" + this.edittingCategory._id
						let body = JSON.parse(JSON.stringify(this.edittingCategory))
						body.topic = body.topic._id

						this.axios.put(url, body)
						.then( response => {
							body.topic = this.getTopicById( body.topic )
							this.$store.commit("updateCategory", body)
							this.$swal("Done!", body.name + " was updated successfully", "success")
				  			.then( () => {
				  				this.$router.push({path: "/dashboard/categories"})
				  			})
						})
						.catch( err => {
							console.log( err )
						})
						.finally(() => {
							this.status.updating = false
						})

					}else{
						this.$refs.alert.toggle()
					}

				}
			},
			getTopicById: function(topicId) {
				let topics = this.topics
				for( let i = 0 ; i < topics.length ; i++ )
					if( topics[ i ]._id == topicId )
						return topics[ i ]
				return false
			},
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.category-editor
		padding-bottom: 80px
		position: relative
		padding: 15px
		padding-top: 0

		.subsection-header
			display: block
			position: relative
			width: 100%
			padding: 15px
			padding-left: 25px
			padding-bottom: 0emailRemover
			background-image: url('/assets/images/bg_categories_title.jpg')
			background-size: 100% 100%
			background-repeat: no-repeat
			.subsection-header-icon
				display: inline-block
				width: 60px
				vertical-align: top
				img
					max-height: 100%

			.subsection-title
				display: inline-block
				font-family: Raleway
				font-weight: 800
				font-size: 20pt
				text-transform: uppercase
				vertical-align: top
				margin-left: 10px
				margin-top: 10px
				color: white
				letter-spacing: 2px
			.subsection-description
				position: relative
				display: inline-block
				font-weight: 800
				font-family: Raleway
				font-size: 12pt
				letter-spacing: 1px
				vertical-align: top
				margin-top: 20px
				margin-left: 40px
				color: white
		.v-tabs
			.v-tab
				max-width: none !important
				width: 50%
				font-family: Raleway
				font-weight: 800
				&.v-tab--active
		.return-bar
			padding-top: 15px
			padding-bottom: 7px
			a
				color: inherit
				text-transform: uppercase
				font-size: 14pt
				font-family: Raleway
				font-weight: 700
				text-decoration: none
				letter-spacing: 1px
				&:hover
					text-decoration: none
		.edit-category
			position: relative
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px

			.v-text-field
				.v-icon
					color: #032eb1
			.edit-category-card
				.contacts-expansion-panel
					margin-bottom: 25px
					.v-expansion-panel-header
						padding-left: 10px
						padding-right: 12px
						text-transform: uppercase !important
						font-family: Raleway
						font-weight: 700
						font-size: 10pt
						letter-spacing: 1px
					.v-expansion-panel-content
						.v-expansion-panel-content__wrap
							padding: 0
							.v-input--checkbox
								margin-top: 0px
								padding-top: 2px
								padding-bottom: 2px
								padding-left: 25px
								padding-right: 25px
								&:hover
									background-color: rgba(164, 73, 51, 0.05)
								.v-messages
									display: none
								.v-input--selection-controls__ripple
									z-index: 10
								.contact-info
									.contact-picture
										display: inline-block
										float: left
										margin-left: 5px
										margin-right: 15px
										img
											width: 25px
											height: 25px
											border-radius: 50%
											margin-top: 8px
									.contact-name
										display: inline-block
										float: left
										margin-top: 11px
										font-family: Raleway
										font-weight: 700
		.edit-category-contacts
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.contacts-expansion-panel
				margin-bottom: 25px
				.v-expansion-panel-header
					padding-left: 15px
					padding-right: 15px
					text-transform: uppercase !important
					font-family: Raleway
					font-weight: 700
					font-size: 10pt
					letter-spacing: 1px
				.v-expansion-panel-content
					.v-expansion-panel-content__wrap
						padding: 0
						.v-input--checkbox
							margin-top: 0px
							padding-top: 2px
							padding-bottom: 2px
							padding-left: 25px
							padding-right: 25px
							&:hover
								background-color: rgba(164, 73, 51, 0.05)
							.v-messages
								display: none
							.v-input--selection-controls__ripple
								z-index: 10
							.contact-info
								.contact-picture
									display: inline-block
									float: left
									margin-left: 5px
									margin-right: 15px
									img
										width: 25px
										height: 25px
										border-radius: 50%
										margin-top: 8px
								.contact-name
									display: inline-block
									float: left
									margin-top: 11px
									font-family: Raleway
									font-weight: 700
		.category-actions
			.v-btn__content
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn__loader
				color: white
	@media only screen and (min-width: 1367px)
		.category-editor
			.v-tabs
				border: 1px solid rgba(0, 0, 0, 0.1)
				.v-tab
					font-size: 14pt
			.edit-category
				.subtitle
					font-size: 14pt
				.edit-category-card
					.contacts-expansion-panel
						.v-expansion-panel-header
							font-size: 12pt
			.edit-category-contacts
				.subtitle
					font-size: 14pt
				.contacts-expansion-panel
					.v-expansion-panel-header
						font-size: 12pt
			.category-actions
				.v-btn__content
					font-size: 14px
	@media only screen and (min-width: 1921px)
		.category-editor
			.subsection-header
				.subsection-title
					font-size: 24pt
				.subsection-description
					font-size: 15pt
			.v-tabs
				.v-tab
					font-size: 18pt
			.edit-category
				.subtitle
					font-size: 18pt
				.edit-category-card
					.contacts-expansion-panel
						.v-expansion-panel-header
							font-size: 16pt
			.edit-category-contacts
				.subtitle
					font-size: 18pt
				.contacts-expansion-panel
					.v-expansion-panel-header
						font-size: 16pt
			.category-actions
				.v-btn__content
					font-size: 18px
			.v-select__selection
				font-size: 16pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
</style>