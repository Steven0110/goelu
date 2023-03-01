import Vue from "vue"

import App from "./App.vue"
import router from "./router"

/*	Vue Bootstrap 	*/
//import BootstrapVue from 'bootstrap-vue'
//Vue.use(BootstrapVue)
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
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
Vue.use(require("vue-moment"))

import vuetify from '@/plugins/vuetify'

/*	Vuex 	*/
import { store } from './store/store'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)

/*	Translations 	*/
import { i18n } from './plugins/i18n.js'

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