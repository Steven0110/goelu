import Login 		from "@/pages/Login.vue"
import Forgot		from "@/pages/Forgot.vue"
import UserAdmin	from "@/pages/UserAdmin.vue"
import MainPanel	from "@/components/dashboard/sections/MainPanel.vue"
import FileManager		from "@/components/dashboard/sections/FileManager.vue"

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
				components: {
					panel: MainPanel
				}
			},
			{
				path: 'file-manager',
				components: {
					panel: FileManager
				}
			},
		]
	},
];