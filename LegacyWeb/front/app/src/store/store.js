import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		user: 			{pictureURL: ""},
		files: 			[],
		events: 		[],
		groups: 		[],
		plan: 			{},
		contacts: 		[],
		topics: 		[],
		lastActivities: [],
		validSession: 	true,

		/*		Status indicators 	*/
		gettingEvents: 			false,
		gettingUser: 			false,
		gettingFiles: 			false,
		gettingLastActivities: 	false,
		gettingAnalytics: 		false,
		gettingContacts: 		false,
		gettingTopics: 			false,
		gettingGroups: 			false,

		/*	General Storage 	*/
		card: {},
		locale: "en"
	},
	mutations: {
		setLocale(state, locale){
			state.locale = locale
		},
		setSessionValidity(state, validSession){
			state.validSession = validSession
		},
		setUser(state, user){
			state.user = user
		},
		updateUserPicture({ user }, url){
			Vue.set(user, "pictureURL", url)
		},
		addLegacyContact(state, legacyUser){
			state.user.legacyUsers.push( legacyUser )
		},
		deleteLegacyUser({ user }, legacyUser){
			let i
			let legacyUsers = user.legacyUsers
			for( i = 0 ; i < legacyUsers.length ; i++ )
				if( user.legacyUsers[ i ].email === legacyUser.email ){
					legacyUsers.splice( i, 1 )
				}
			
			Vue.set(user, "legacyUsers", legacyUsers)
		},
		updateLegacyUser({ user }, legacyUser){
			let i
			let legacyUsers = user.legacyUsers
			for( i = 0 ; i < legacyUsers.length ; i++ )
				if( user.legacyUsers[ i ].email === legacyUser.email ){
					user.legacyUsers[ i ] = legacyUser
					console.log(user.legacyUsers[ i ] = legacyUser)
				}
			
			Vue.set(user, "legacyUsers", legacyUsers)
		},
		updateUser(state, user){
			state.user = user
		},
		setPlan(state, plan){
			state.plan = plan
		},

		/*		Files 		*/
		setFiles(state, files){
			state.files = files
		},
		addFile(state, file){
			state.files.push( file )
		},
		updateFile(state, file){
			let index
			for( index = 0 ; index < state.files.length ; index++ )
				if(file._id === state.files[ index ]._id)
					break
			state.files.splice(index, 1)
			state.files.push( file )
		},
		removeFile(state, file){
			let index = state.files.indexOf( file )
			state.files.splice( index, 1 )
		},

		/*		Events 		*/
		setEvents(state, events){
			state.events = events
		},
		addEvent(state, event){
			state.events.push( event )
		},
		removeEvent(state, event){
			let index
			for( index = 0 ; index < state.events.length ; index++ )
				if(event._id === state.events[ index ]._id)
					break

			state.events.splice( index, 1 )
		},
		updateEvent(state, event){
			let index
			for( index = 0 ; index < state.events.length ; index++ )
				if(event._id === state.events[ index ]._id)
					break
			state.events.splice(index, 1)
			state.events.push( event )
		},
		
		/*		Contacts 		*/
		setContacts(state, contacts){
			state.contacts = contacts
		},
		addContact(state, contact){
			state.contacts.push( contact )
		},
		removeContact(state, contact){
			let index = state.contacts.indexOf( contact )
			state.contacts.splice( index, 1 )
		},
		updateContact(state, contact){
			let index
			for( index = 0 ; index < state.contacts.length ; index++ )
				if(contact._id === state.contacts[ index ]._id)
					break
			state.contacts.splice(index, 1)
			state.contacts.push( contact )
		},
		
		/*		Topics 		*/
		setTopics(state, topics){
			state.topics = topics
		},
		addTopic(state, topic){
			state.topics.push( topic )
		},
		removeTopic(state, topic){
			let index = state.topics.indexOf( topic )
			state.topics.splice( index, 1 )
		},
		updateTopic(state, topic){
			let index
			for( index = 0 ; index < state.topics.length ; index++ )
				if(topic._id === state.topics[ index ]._id)
					break
			state.topics.splice(index, 1)
			state.topics.push( topic )
		},

		/*		Contacts Groups 		*/
		setGroups(state, groups){
			state.groups = groups
		},
		addGroup(state, group){
			state.groups.push( group )
		},
		removeGroup(state, group){
			let index = state.groups.indexOf( group )
			state.groups.splice( index, 1 )
		},
		updateGroup(state, group){
			let index
			for( index = 0 ; index < state.groups.length ; index++ )
				if(group._id === state.groups[ index ]._id)
					break
			state.groups.splice(index, 1)
			state.groups.push( group )
		},

		/*		Last ACtivities 		*/
		setLastActivity(state, activities){
			state.lastActivities = activities
		},

		/*		Status Indicators 		*/
		setEventsStatus(state, status){
			state.gettingEvents = status
		},
		setFilesStatus(state, status){
			state.gettingFiles = status
		},
		setLastActivitiesStatus(state, status){
			state.gettingLastActivities = status
		},
		setAnalyticsStatus(state, status){
			state.gettingAnalytics = status
		},
		setContactsStatus(state, status){
			state.gettingContacts = status
		},
		setTopicsStatus(state, status){
			state.gettingTopics = status
		},
		setGroupsStatus(state, status){
			state.gettingGroups = status
		},
		setUserStatus(state, status){
			state.gettingUser = status
		},

		/*	General Mutators*/
		setCard(state, card){
			state.card = card
		}
	},
	getters: {
		locale:					state => state.locale,
		sessionValidity:		state => state.validSession,
		user: 					state => state.user,
		plan: 					state => state.plan,
		files: 					state => state.files,
		events:					state => state.events,
		contacts:				state => state.contacts,
		groups:					state => state.groups,
		topics:					state => state.topics,
		card:					state => state.card,
		lastActivities: 		state => state.lastActivities,
		gettingEvents: 			state => state.gettingEvents,
		gettingFiles: 			state => state.gettingFiles,
		gettingLastActivities: 	state => state.gettingLastActivities,
		gettingAnalytics:		state => state.gettingAnalytics,
		gettingContacts:		state => state.gettingContacts,
		gettingTopics:			state => state.gettingTopics,
		gettingGroups:			state => state.gettingGroups,
		gettingUser:			state => state.gettingUser,
	}

})