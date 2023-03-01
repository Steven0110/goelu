<template lang="pug">
    .circle-image
        img(:src="propsCircle.img")
        .title-circle
            |{{$t(propsCircle.title)}}
        .content-circle
            |{{$t(propsCircle.content)}}
</template>
<script>
    export default {
        props:["propsCircle"],
        data(){
            return {

            }
        }
    }
</script>
<style lang="sass">
.circle-image
    font-family: Raleway
    text-align: center
    img
        max-width: 150px
    .title-circle
        margin-top: 20px
        font-weight: bold        
        font-size: 1.2rem
        line-height: 1.3em
        text-transform: uppercase
    .content-circle
        margin-top: 10px
        font-weight: 500
        font-size: 1rem
        line-height: 1.3em
</style>
