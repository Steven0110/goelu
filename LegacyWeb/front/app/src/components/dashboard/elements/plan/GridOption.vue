<template lang="pug">
    .grid-option-plan(:style="style")
        .grid-cont
            .outter-container
                .inner-container
                    .name
                        |{{ name }}
                    .description
                        |{{ description }}                        
                    .value
                        span.val
                            |{{vals}} 
                        span.type
                            |&nbsp;{{ types }}
                    .icon
                        img(:src="icon")
</template>
<script>
export default {
    props: ["name", "to", "description", "icon", "background","val"],
    computed: {
			style: function(){
				let styles = {}
				if( this.background )
					styles["background-image"] = "url(\"" + this.background + "\")"
				else
					styles["background-image"] = "red"

				return styles 
			},
            types:function(){
                return this.val.trim().split(' ')[1]
            },
            vals:function(){                
                return this.val.trim().split(' ')[0]
            }

        },
    methods: {	
				
		}
}
</script>
<style lang="sass">
    .grid-option-plan
        background-size: cover
        background-repeat: no-repeat
        text-align: center
        padding: 20px
        height: 550px
        margin-top: 8px
        transition: 0.3s linear all
        &.first
            margin-top: 0
        .grid-cont
            display: block
            width: 100%
            height: 100%
            text-decoration: none
            .outter-container
                position: relative
                height: 100%
                .inner-container
                    position: relative
                    top: 50%
                    transform: translateY(-50%)
                    .name
                        font-family: Raleway
                        font-size: 25pt
                        text-transform: uppercase
                        font-weight: 800
                        color: white
                    .description
                        font-family: Raleway
                        color: white
                        font-size: 17pt
                        font-weight: 600
                    .value
                        span.val
                            display:inline-block 
                            margin:0                
                            font-family: Raleway 
                            font-size: 75pt
                            text-transform: uppercase
                            font-weight: 800
                            color: white
                        span.type
                            display:inline-block 
                            margin:0                
                            font-family: Raleway 
                            font-size: 40pt
                            text-transform: uppercase
                            font-weight: 800
                            color: white                            
                    .icon
                        display: block
                        text-align: center
                        margin-top: 15px
                        img
                            display: inline-block
                            height: 200px  
</style>