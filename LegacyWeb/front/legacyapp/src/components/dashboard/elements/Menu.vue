<template lang="pug">
	.menu
		.option
			router-link(:to="{path: '/dashboard/'}")
				img(src="/assets/icons/ic_contact.svg")
		.option
			router-link(:to="{path: '/dashboard/file-manager'}")
				img(src="/assets/icons/ic_file_manager.svg")
		.option(@click="logout")
			router-link(:to="{path: '#'}")
				img(src="/assets/icons/ic_signout.svg")
</template>

<script>
	export default {
		methods: {
			logout: function(){
				this.$swal({
					title: "Are you sure you want to logout?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: "Yes",
					cancelButtonText: 'Cancel',
					reverseButtons: true
				})
				.then( result => {
					if( result.value ){
						localStorage.removeItem("token")
						localStorage.removeItem("user")
						this.$router.push({path: "/"})
					}
				})
			},
		},
	}
</script>

<style lang="sass">
	.menu
		position: fixed
		top: 9vh
		left: 0
		bottom: 0
		background-color: #2b2f3b
		width: 50px
		padding-top: 15px
		padding-bottom: 15px
		.option
			position: relative
			width: 50px
			height: 50px
			background-color: transparent
			transition: 0.2s linear all
			
			&.active
				background-color: #26d3c1
			&:hover
				background-color: #26d3c1
				transition: 0.2s linear all
			a
				width: 100%
				height: 100%
				display: block
				img
					position: absolute
					top: 0
					left: 0
					right: 0
					bottom: 0
					margin: auto
					max-width: 50%
</style>