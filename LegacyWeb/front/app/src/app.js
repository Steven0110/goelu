import Vue from "vue"

import App from "./App.vue"
import router from "./router"

/*	Font Awesome 	*/
import { library } 					from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faPhoneAlt, faSitemap, faSearch, faMousePointer,faPlus} 	from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } 			from '@fortawesome/vue-fontawesome'
library.add( faEnvelope )
library.add( faPhoneAlt )
library.add( faSitemap )
library.add( faSearch )
library.add( faMousePointer )
library.add( faPlus )
Vue.component("fa", FontAwesomeIcon)

/*	Axios 	*/
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use( VueAxios, axios )

/*	Sweet Alert 2 	*/
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
const options = {
	confirmButtonColor: '#84adeb',
	cancelButtonColor: '#db5756'
}
Vue.use( VueSweetalert2, options )

/*	Vue Moment 	*/
const moment = require('moment')
require('moment/locale/es')
Vue.use(require('vue-moment'), {
    moment
})

/*	Vue File Drag And Drop 	*/
import "vue2-dropzone/dist/vue2Dropzone.min.css"

/*	Vue Input Mask 	*/
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

/*	Vue Slick	*/
import Slick from 'vue-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import jQuery from "jquery";
window.jQuery = window.$ = jQuery
Vue.use(Slick)

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)

import vuetify from '@/plugins/vuetify'

import VueScrollTo from 'vue-scrollto'
Vue.use(VueScrollTo)

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

import VueGtag from "vue-gtag"
Vue.use(VueGtag, {
	config: { id: "G-LT37ZXETZ1" }
  })

/*import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
	id: 'G-LT37ZXETZ1'
  })*/
  

/*	Vuex 	*/
import { store } from './store/store'

/*	Translations 	*/
import { i18n } from './plugins/i18n.js'

/*	Conekta 	*/
//- Dev
Vue.prototype.$conektaPublic = process.env.CONEKTA_PUBLIC
//- Prod
//Vue.prototype.$conektaPublic = "key_d1aQg4PutGYohyCt2gJXMGw"

/*		Token Header 	*/
axios.interceptors.request.use(
	(config) => {
		let token = localStorage.getItem('token')
		if(token)
			config.headers['Authorization'] = `Bearer ${ token }`

		config.headers["x-api-key"] = process.env.API_KEY
		return config
	},
	(error) => {
		return Promise.reject(error);
	}
)


/*	Global Variables 	*/
var publicKey = process.env.API_KEY
var local = false

if( local ){
	Vue.prototype.baseFS = "https://localhost:9001/"
}else{
	Vue.prototype.baseFS = process.env.FILESERVER
}

Vue.prototype.baseApi = process.env.API_URL
Vue.prototype.env = process.env.ENV
Vue.prototype.publicKey = publicKey //Dev
Vue.prototype.$clone = obj => JSON.parse(JSON.stringify(obj))

new Vue({
	el: "#app",
	router,
	vuetify,
	store,
	i18n,
	render: h => h( App ),
})