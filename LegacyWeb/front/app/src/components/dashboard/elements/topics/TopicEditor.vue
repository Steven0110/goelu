<template lang="pug">
	.topic-editor
		v-dialog(v-model="open", max-width="900", persistent)
			v-card.topic-editor-card
				v-card-text
					.topic-editor-title
						|Editing {{topic.name}}
					.topic-editor-form
						v-row
							v-col(cols="12")
								v-form(ref="editTopicInfo")
									v-text-field(
			                            prepend-icon="mdi-format-title",
			                            v-model="edit.name",
			                            label="Name",
			                            :rules="form.validations.required",
			                            background-color="white",
			                            outlined,
			                            required)
									v-textarea(
			                            prepend-icon="mdi-text",
			                            v-model="edit.description",
			                            label="Name",
			                            :rules="form.validations.required",
			                            background-color="white",
			                            outlined,
			                            required)
				v-card-actions.editor-buttons
					v-spacer
					v-btn.elevation-0.white-btn-text(color="#F44336", @click="close")
						|Close
					v-btn.elevation-0.white-btn-text(color="#2963b4", @click="saveTopic", :loading="status.updating")
						|Save
</template>

<script>
	import Loader from "@/components/misc/Loader.vue"
	export default {
		props: ["topic"],
		data() {
			return {
				open: false,
				status: {
					uploading: false,
					updating: false
				},
				edit: {
					name: "",
					description: "",
				},
                form: {
                    validations: {
                        required: [
                            v => !!v || 'This field is required',
                        ]
                    }
                },
			}
		},
		mounted() {
			this.open = true
			this.edit = JSON.parse(JSON.stringify(this.topic))
		},
		methods: {
			close: function(){
				this.open = false
				this.$emit("close")
			},
			saveTopic: function(){
				if( this.$refs.editTopicInfo.validate() ){
					this.status.updating = true

					let url = this.baseApi + this.env + "topics/" + this.edit._id
					let body = {
						name: this.edit.name,
						description: this.edit.description,
					}

					this.axios.put(url, body)
					.then( response => {

						this.$swal("Done!", this.edit.name + " was updated successfully", "success")
						this.open = false
						this.$emit("update", this.edit)

					})
					.catch( err => {
						console.log( err )
					})
					.finally( () => {
						this.status.updating = false
					})
				}
			},
		},
		components: {
			Loader
		}
	}
</script>

<style lang="sass">
	.topic-editor
		.subtitle
			font-family: Raleway
			font-weight: 700
			color: #222
			text-transform: uppercase
			margin-bottom: 7px
			letter-spacing: 1px
		.v-btn
			.v-btn__content
				font-family: Raleway
				font-size: 12px
				font-weight: 800
				color: white
				padding-left: 25px
				padding-right: 25px
			.v-btn__loader
				color: white
	.topic-editor-card
		padding-top: 30px
		padding-bottom: 15px
		.topic-editor-title
			font-family: Raleway
			text-align: center
			font-weight: 700
			font-size: 24pt
			margin-bottom: 20px
		.topic-editor-form
			.v-text-field
				.v-icon
					color: #032eb1
	@media only screen and (min-width: 1921px)
		.topic-editor
			.subtitle
			.v-btn
				.v-btn__content
					font-size: 16px
		.topic-editor-card
			.topic-editor-title
				font-size: 28pt
			input,textarea
				font-size: 16pt
			label
				font-size: 16pt
</style>