<template lang="pug">
	.topics-subpanel
		v-row
			v-col.order-md-1.order-2(cols="12", md="4")
				.add-topic
					.subtitle
						|{{$t('topics-create')}}
					v-card.new-contact.elevation-0(width="100%")
						v-card-text
							v-form(ref="newTopicForm")
								v-text-field(
		                            append-icon="mdi-format-title",
		                            v-model="newTopic.name",
		                            :label="$t('topics-name')",
		                            :rules="form.validations.required",
		                            background-color="white",
		                            outlined,
		                            required)
								v-textarea(
		                            append-icon="mdi-text",
		                            v-model="newTopic.description",
		                            :label="$t('topics-description')",
		                            :rules="form.validations.required",
		                            background-color="white",
		                            outlined,
		                            required)
					.add-topic-btn-container
						v-btn.elevation-0.add-contact-btn(
							color="#3f64d9",
							raised,
							tile,
							:loading="status.creating"
							@click="addTopic")
							|{{$t('topics-add')}}
			v-col.order-md-2.order-1(cols="12", md="8")
				.topics-list
					.subtitle
						|{{$t('topics-header-title')}}
						
					v-data-table.topics-table.elevation-1(
						:headers="tableHeaders",
						:items="topics",
						:loading="gettingTopics",
						no-data-text="No topics found",
						loading-text="Loading topics...",
						item-key="_id",
						v-model="selected")

						template(v-slot:item._id="{ item }")
							.topic-actions
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#3954b0",
											:small="small",
											@click="editTopic(item)")
											|mdi-pencil
									span
										|{{$t('topics-edit-tip')}}
								v-tooltip(top)
									template(v-slot:activator="{ on }")
										v-icon.mr-1(
											v-on="on",
											color="#901617",
											@click="deleteTopic(item)",
											:small="small")
											|mdi-delete
									span
										|{{$t('topics-delete-tip')}}
		topic-editor(v-if="editingTopic", @close="closeEditModal", :topic="editingTopic", @update="updatedTopic")
</template>

<script>
	import TopicEditor from "@/components/dashboard/elements/topics/TopicEditor.vue"
	export default {
		data() {
			return {
				newTopic: {
					name: "",
					description: ""
				},
				editingTopic: null,
				selected: [],
                form: {
                    validations: {
                        required: [
                            v => !!v || 'This field is required',
                        ],
                        email: [
                            v => !!v || 'This field is required',
				        	v => /.+@.+\..+/.test(v) || 'Email must be valid',
                        ]
                    }
                },
				tableHeaders: [
					{ text: "Name", value: "name", width: 200, align: "center" },
					{ text: "Description", value: "description", align: "center" },
					{ text: "Edit / Delete", value: "_id", align: "center", sortable: false },
				],
                status: {
                	uploading: false,
                	creating: false
                }
			}
		},
		computed: {
			topics: function(){
				return this.$store.getters.topics
			},
			gettingTopics: function(){
				return this.$store.getters.gettingTopics
			},			
			small: function(){
				if(this.$vuetify.breakpoint.width > 1920)
					return false
				if(this.$vuetify.breakpoint.width > 1366)
					return true
				else if(this.$vuetify.breakpoint.width > 1024 && this.$vuetify.breakpoint.width <= 1366)
					return false
				else if(this.$vuetify.breakpoint.width <= 1024)
					return false
			},
		},
		methods: {
			addTopic: function() {
				if( this.$refs.newTopicForm.validate() ){

					this.status.creating = true

					let url = this.baseApi + this.env + "topics"
					this.axios.post(url, this.newTopic)
					.then( response => {
						this.$store.commit("addTopic", response.data.topic)
						this.resetForm()
						this.$swal("Done!", response.data.topic.name + " was added successfully", "success")
					})
					.catch( err => {
						console.log( err )
					})
					.finally(() => {
						this.status.creating = false
					})

				}
			},
			editTopic: function(topic) {
				this.editingTopic = topic
			},
			deleteTopic: function(topic) {
				this.$swal({
					title: `Are you sure you want to delete ${topic.name}?`,
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
				  		this.$store.commit("setTopicsStatus", true)
						let url = this.baseApi + this.env + "topics/" + topic._id
				  		this.axios.delete( url )
				  		.then( result => {
				  			this.$store.commit("removeTopic", topic)
				  			this.$swal("Done!", topic.name + " was deleted successfully", "success")
				  		})
				  		.catch( err => {
				  			console.log( err )
				  		})
				  		.finally(() => {
				  			this.$store.commit("setTopicsStatus", false)
				  		})
				  	}
				})
			},
			closeEditModal: function() {
				this.editingTopic = null
			},
			updatedTopic: function(topic) {
				this.editingTopic = null
				this.$store.commit("updateTopic", topic)
			},
			resetForm: function(){
				this.$refs.newTopicForm.reset()
				this.newTopic = {
					name: "",
					description: ""
				}
			}
		},
		components: {
			TopicEditor
		}
	}
</script>

<style lang="sass">
	.topics-subpanel
		position: relative
		padding: 15px
		padding-top: 0
		padding-left: 0
		padding-bottom: 80px
		.add-topic
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
			.add-topic-btn-container
				text-align: center
				.add-contact-btn
					margin-top: 15px
					.v-btn__content
						font-family: Raleway
						font-size: 12px
						font-weight: 800
						color: white
						padding-left: 25px
						padding-right: 25px
					.v-btn__loader
						color: white
		.topics-list
			padding-top: 7px
			.subtitle
				font-family: Raleway
				font-weight: 700
				color: #222
				text-transform: uppercase
				margin-bottom: 7px
				letter-spacing: 1px
			.topics-table
				*
					font-family: Raleway
				tr
					&:nth-of-type(even)
						background-color: rgba(0, 0, 0, .05)
				.v-data-table-header
					tr
						background-color: rgba(0, 0, 0, .05)
						th
							span
								font-family: Raleway
								text-transform: uppercase
				tbody
					tr
						td
							padding-top: 12px
							padding-bottom: 12px

	@media only screen and (min-width: 1921px)
		.topics-subpanel
			.add-topic
				.subtitle
					font-size: 18pt
				.add-topic-btn-container
					.add-contact-btn
						.v-btn__content
							font-size: 16px
			.topics-list
				.subtitle
					font-size: 18pt
				.topics-table
					tr
						&:nth-of-type(even)
					.v-data-table-header
						tr
							th
								span
									font-size: 16pt
					tbody
						tr
							td
								font-size: 15pt
					.v-data-footer
						*
							font-size: 16pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
	@media only screen and (max-width: 768px)
		.topics-subpanel
			padding: 10px
			.v-data-table
				.v-data-table__wrapper
					&::-webkit-scrollbar-track
						-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar
						width: 10px
						background-color: rgba(255, 255, 255, 0.2)
					&::-webkit-scrollbar-thumb
						background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.44, #DFA64D),color-stop(0.72, #DFA64D),color-stop(0.86, #ab813f))
				table
					width: 180%
					overflow-x: scroll
					margin-top: 50px
					thead
						tr
							th
								border-bottom: none !important
								&:first-child
									position: absolute
									top: 55px
									width: calc(100vw - 20px)
									
									.v-text-field .v-input__slot:before
										display: none
					tbody
						.v-data-table__mobile-row
							display: table-cell !important
							//width: 170px
							text-align: center
							.v-data-table__mobile-row__header
								text-align: center
							.v-data-table__mobile-row__cell
								text-align: center
						tr
							display: table-row
							.v-data-table__mobile-row
								&:nth-child(1)
									width: 150px
						tr
							&:first-child
								.v-data-table__mobile-row
									&:nth-last-child(2)
										.v-data-table__mobile-row__cell
											min-height: 38px
						tr
							.v-data-table__mobile-row
								.v-data-table__mobile-row__cell
									min-height: 38px
						tr.v-data-table__empty-wrapper
							text-align: left

					.snapshot
						padding-left: 0 !important
						text-align: center

					tbody
						tr
							width: 100%

							&:not(:first-child)
								.v-data-table__mobile-row__header
									display: none
	
</style>