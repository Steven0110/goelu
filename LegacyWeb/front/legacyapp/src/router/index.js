import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use( VueRouter )
const router = new VueRouter({
	mode: 'history',
	routes,
})

router.beforeEach((to, from ,next) => {
	try{

		if(to.matched.some(record => record.meta.requiresAuth)){
			if( localStorage.getItem("token") == null ){
				next({
					path: "/login",
					params: {
						nextUrl: to.fullPath
					}
				})
			}else{
				next()
			}
		}else{
			if( localStorage.getItem("token") != null )
				next({
					path: "/dashboard",
					params: {
						nextUrl: to.fullPath
					}
				})
			else
				next()
		}
	}catch(err){
		console.log( err )
		localStorage.removeItem("user")
		localStorage.removeItem("token")
		location.reload()
	}
})

export default router;