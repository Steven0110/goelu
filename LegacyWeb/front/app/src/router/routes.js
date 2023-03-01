import Login 			from "@/pages/Login.vue"
//import Register			from "@/pages/Register.vue"
import Forgot			from "@/pages/Forgot.vue"
import UserAdmin		from "@/pages/UserAdmin.vue"
import MainPanel		from "@/components/dashboard/sections/MainPanel.vue"
import UploadFile		from "@/components/dashboard/sections/UploadFile.vue"
import Record			from "@/components/dashboard/sections/Record.vue"
import Contacts			from "@/components/dashboard/sections/Contacts.vue"
import Plan				from "@/components/dashboard/sections/Plan.vue"
import FileManager		from "@/components/dashboard/sections/FileManager.vue"
import HowItWorks		from "@/components/dashboard/sections/HowItWorks.vue"
import Samples			from "@/components/dashboard/sections/Samples.vue"
import Topics			from "@/components/dashboard/sections/Topics.vue"
import MyCalendar		from "@/components/dashboard/sections/MyCalendar.vue"
import DocViewer		from "@/components/dashboard/sections/DocViewer.vue"
import PdfViewer		from "@/components/dashboard/sections/PdfViewer.vue"
import ImageViewer		from "@/components/dashboard/sections/ImageViewer.vue"
import VideoViewer		from "@/components/dashboard/sections/VideoViewer.vue"
import AudioPlayer		from "@/components/dashboard/sections/AudioPlayer.vue"
import Profile			from "@/components/dashboard/sections/Profile.vue"
import ProfileEditor 	from "@/components/dashboard/sections/ProfileEditor.vue"
import FAQ 				from "@/components/dashboard/sections/FAQ.vue"
import VideoTutorials	from "@/components/dashboard/elements/tutorials/VideoTutorials.vue"
import FreeTrial 		from "@/pages/FreeTrial.vue"
//import Plans 			from "@/pages/Plans.vue"
import Partnership 		from "@/pages/Partnership.vue"


export default [
	{
		path: '/',
		redirect: "login",
	},
	{
		path: '/login',
		component: Login,
		name: "Login"
	},
	/*{
		path: '/register',
		component: Register,
		name: "Register"
	},*/
	{
		path: '/forgot',
		component: Forgot,
		name: "Forgot"
	},
	{
		path: '/free-trial',
		component: FreeTrial,
		name: "FreeTrial"
	},
	/*{
		path:'/plans',
		component: Plans,
		name: "Plans"
	},*/
	{
		path:'/partnership',
		component: Partnership,
		name: "Partnership"
	},
	{
		path: '/dashboard',
		component: UserAdmin,
		meta: {
			requiresAuth: true
		},
		children: [
			{
				path: '/',
				components: {
					panel: MainPanel
				},
				name: "m-home"
			},
			{
				path: 'plan',
				components: {
					panel: Plan
				},
				name: "m-plan"
			},
			{
				path: 'upload',
				components: {
					panel: UploadFile
				},
				name: "m-upload"
			},
			{
				path: 'file-manager',
				components: {
					panel: FileManager
				},
				name: "m-filemanager"
			},
			{
				path: 'record',
				components: {
					panel: Record
				},
				name: "m-record"
			},
			{
				path: 'contacts',
				components: {
					panel: Contacts
				},
				name: "m-contacts"
			},
			{
				path: 'calendar',
				components: {
					panel: MyCalendar
				},
				name: "m-calendar"
			},
			{
				path: 'topics',
				components: {
					panel: Topics
				},
				name: "m-topics"
			},
			{
				path: 'how-it-works',
				components: {
					panel: HowItWorks
				},
				name: "m-hiw"
			},
			{
				path: 'samples',
				components: {
					panel: Samples
				},
				name: "m-samples"
			},
			{
				path: 'tutorials',
				components: {
					panel: VideoTutorials
				},
				name: "m-tutorials"
			},
			{
				path: 'document-viewer',
				components: {
					panel: DocViewer
				},
				name: "m-document"
			},
			{
				path: 'pdf-viewer',
				components: {
					panel: PdfViewer
				},
				name: "m-pdf"
			},
			{
				path: 'image-viewer',
				components: {
					panel: ImageViewer
				},
				name: "m-image"
			},
			{
				path: 'video-viewer',
				components: {
					panel: VideoViewer
				},
				name: "m-video"
			},
			{
				path: 'audio-player',
				components: {
					panel: AudioPlayer
				},
				name: "m-audio"
			},
			{
				path: 'profile',
				components: {
					panel: Profile
				},
				name: "m-profile"
			},
			{
				path: 'profile/edit',
				components: {
					panel: ProfileEditor
				},
				name: "m-profile-editor"
			},
			{
				path: 'faq',
				components: {
					panel: FAQ
				},
				name: "m-faq"
			}
		]
	},
];