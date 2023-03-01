import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		user: 	{},
		users: 	[],
		files: 	[],
		
		/*		Status indicators 	*/
		gettingUsers: 	false,
		gettingFiles: 	false,
	},
	mutations: {
		setUser(state, user){
			state.user = user
		},
		setUsers(state, users){
			state.users = users
		},
		updateUser(state, user){
			let index
			for( index = 0 ; index < state.users.length ; index++ )
				if(user._id === state.users[ index ]._id)
					break
			state.users.splice(index, 1)
			state.users.push( user )
		},

		/*		Files 		*/
		setFiles(state, files){
			state.files = files
		},
		updateFile(state, file){
			let index
			for( index = 0 ; index < state.files.length ; index++ )
				if(file._id === state.files[ index ]._id)
					break
			state.files.splice(index, 1)
			state.files.push( file )
		},

		/*		Statuses 		*/
		setUsersStatus(state, status){
			state.gettingUsers = status
		},
		setUserStatus(state, status){
			state.gettingUser = status
		},
		setFilesStatus(state, status){
			state.gettingFiles = status
		},
	},
	getters: {
		user: 			state => state.user,
		users: 			state => state.users,
		files: 			state => state.files,
		gettingUsers: 	state => state.gettingUsers,
		gettingFiles: 	state => state.gettingFiles,
	}

})