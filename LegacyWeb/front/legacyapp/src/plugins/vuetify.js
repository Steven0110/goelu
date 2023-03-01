import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


/*	Icons 	*/
import Email 	from '@/components/icons/Email.vue'
import Lock 	from '@/components/icons/Lock.vue'

Vue.use(Vuetify)

const opts = {
  	icons: {
    	values: {
      		cemail: {component: Email},
      		clock: {component: Lock},
    	},
    	iconfont: 'mdiSvg'
  	},
}

export default new Vuetify(opts)