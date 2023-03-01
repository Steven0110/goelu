import Login 		from "@/pages/Login.vue"
import Forgot		from "@/pages/Forgot.vue"
import UserAdmin	from "@/pages/UserAdmin.vue"
import MainPanel	from "@/components/dashboard/sections/MainPanel.vue"
import FileManager	from "@/components/dashboard/sections/FileManager.vue"
import AudioManager	from "@/components/dashboard/sections/AudioManager.vue"
import VideoManager	from "@/components/dashboard/sections/VideoManager.vue"
import DocViewer	from "@/components/dashboard/sections/DocViewer.vue"
import PdfViewer	from "@/components/dashboard/sections/PdfViewer.vue"
import VideoViewer	from "@/components/dashboard/sections/VideoViewer.vue"
import AudioPlayer	from "@/components/dashboard/sections/AudioPlayer.vue"
import Profile		from "@/components/dashboard/sections/Profile.vue"
import ProfileEditor from "@/components/dashboard/sections/ProfileEditor.vue"

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
	{
		path: '/forgot',
		component: Forgot,
		name: "Forgot"
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
				/*components: {
					panel: MainPanel
				}*/
				redirect: "videos",
			},
			{
				path: 'files',
				name: "m-files",
				components: {
					panel: FileManager
				}
			},
			{
				path: 'audios',
				name: "m-audios",
				components: {
					panel: AudioManager
				}
			},
			{
				path: 'videos',
				name: "m-videos",
				components: {
					panel: VideoManager
				}
			},
			{
				path: 'document-viewer',
				name: "m-document",
				components: {
					panel: DocViewer
				}
			},
			{
				path: 'pdf-viewer',
				name: "m-pdf",
				components: {
					panel: PdfViewer
				}
			},
			{
				path: 'video-viewer',
				name: "m-video",
				components: {
					panel: VideoViewer
				}
			},
			{
				path: 'audio-player',
				name: "m-audio",
				components: {
					panel: AudioPlayer
				}
			},
			{
				path: 'profile',
				name: "m-profile",
				components: {
					panel: Profile
				}
			},
			{
				path: 'profile/edit',
				name: "m-profile-editor",
				components: {
					panel: ProfileEditor
				}
			},
		]
	},
];