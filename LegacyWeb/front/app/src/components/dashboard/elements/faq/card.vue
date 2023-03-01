<template lang="pug">
    .card-faq.mb-4
        .title
            |{{ $t(title) }}
        .text(v-html="$t(text)")            
</template>
<script>
export default {
    props: ['title','text'],
		data() {
            return{

            }
        }
}
</script>>
<style lang="sass">
    .card-faq
        .title            
            letter-spacing: 1px            
            font-size: 14px
            font-family: Raleway
            font-weight: bold
        .text
            line-height:28px
            text-align: justify
            font-size:12px
</style>    