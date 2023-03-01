import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


/*	Icons 	*/
import Home       from '@/components/icons/Home.vue'
import Calendar   from '@/components/icons/Calendar.vue'
import Categories from '@/components/icons/Categories.vue'
import Contacts   from '@/components/icons/Contacts.vue'
import Files      from '@/components/icons/Files.vue'
import Logout     from '@/components/icons/Logout.vue'
import Record     from '@/components/icons/Record.vue'
import Upload     from '@/components/icons/Upload.vue'
import Email      from '@/components/icons/Email.vue'
import Back       from '@/components/icons/Back.vue'
import Lock       from '@/components/icons/Lock.vue'

Vue.use(Vuetify)

const opts = {
  	icons: {
    	values: {
      		cback:      { component: Back },
          	cemail:     { component: Email },
      		clock:      { component: Lock },
          	chome:      { component: Home },
      		ccalendar:  { component: Calendar },
      		ccategories:{ component: Categories },
      		ccontacts:  { component: Contacts },
      		cfiles:     { component: Files },
      		clogout:    { component: Logout },
      		crecord:    { component: Record },
      		cupload:    { component: Upload },
    	},
    	iconfont: 'mdiSvg'
  	},
    theme: {
      themes: {
        light: {
          primary: "#25a8e0"
        },
        dark: {
          primary: "#25a8e0"
        }
      }
    }
}

export default new Vuetify(opts)