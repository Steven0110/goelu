<template lang="pug">
    v-dialog( max-width="800", persistent, :value="show")
        v-card.pre-view-card.px-4(style="background-color: #f4f4f4")
            v-card-title.pb-4.pl-1.font-weight-bold
                |Script {{$t(script)}}
            v-card-text( style="background-color:white")
                .pre-view-title-text.pt-4
                    |{{$t('samples-scripts-examples-dialog-title')}}
                p.pre-view-text(v-html="$t(title)")
                .pre-view-title-text.pt-4
                    |{{$t('samples-scripts-examples-dialog-description')}}
                p.pre-view-text.t#text(v-html="$t(description)")
            v-card-actions.py-5
                v-spacer
                v-btn(small, color="#b54f4e", @click="$emit('close')", dark)
                    |{{ $t('buttom-close') }}
                v-btn(small, color="#1043a3",v-clipboard:copy="message",@click="$emit('close')", dark)
                    |{{ $t('buttom-copy') }}
                v-spacer
</template>
<script>
export default {
        props: ["show","title","description","script"],
		data() {
			return { 
                               
			}
		},
		computed: {
            message:function(){
                let el=document.createElement( 'html' )
                el.innerHTML=this.$t(this.description)
                return el.innerText
            }
		},
		methods: {            
		},
		components: {
		}
}
</script>
<style lang="sass">
    .pre-view-card        
        .pre-view-title-text
            color: #032eb1
            letter-spacing: 1px
            text-transform: uppercase
            font-size: 18px
            font-family: Raleway
        .pre-view-text
            line-height:28px
            text-align: justify
            font-size:18px

</style>