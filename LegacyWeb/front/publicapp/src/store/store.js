import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		user: {},
		files: 			[],
		
		/*		Status indicators 	*/
		gettingFiles: 			false,
		gettingUser: 			false,
	},
	mutations: {
		setUser(state, user){
			state.user = user
		},
		updateUserPicture({ user }, url){
			Vue.set(user, "pictureURL", url)
		},
		updateUser(state, user){
			state.user = user
		},

		/*		Files 		*/
		setFiles(state, files){
			state.files = files
		},
		/*		Statuses 		*/
		setFilesStatus(state, status){
			state.gettingFiles = status
		},
		setUserStatus(state, status){
			state.gettingUser = status
		},
	},
	getters: {
		user: 					state => state.user,
		gettingFiles: 			state => state.gettingFiles,
		files: 					state => state.files,
	}

})