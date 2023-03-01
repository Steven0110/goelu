import Vue from "vue"
import VueI18n from "vue-i18n"

Vue.use( VueI18n )
export const i18n = new VueI18n({
	locale: "en",
	fallbackLocale: "en",
	messages: {
		en: {
			"administrator": "Master administrator",
			"welcome-back": "Welcome back!",
			"login-instructions": "Log in to your account using email and password.",
			"email-address": "Email Address",
			"password": "Password",
			"remember-me": "Remember me",
			"verification-code": "Verification code",
			"login-btn": "log in",
			"email-is-required": "Email is required",
			"email-must-be-valid": "Email must be valid",
			"password-is-required": "Password is required",
			"new-location": "We have noticed that you are accessing from a new location. Please enter the security code we have sent you to",
			"new-location-2": ".If our email does not reach your inbox, please check the SPAM tray.",
			"access-confirmed": "Access confirmed",
			"login-redirection": "You will be redirected to your account's administrator shortly",
			"invalid-login": "Invalid username and password",
			"invalid-code": "Invalid verification code",
			"unknown-error": "Unknown error",
			"create-account": "Create an account" ,
		},
		es: {
			"administrator": "Administrador maestro",
			"welcome-back": "¡Bienvenido!",
			"login-instructions": "Inicia sesión en tu cuenta con correo electrónico y contraseña.",
			"email-address": "Dirección de correo electrónico",
			"password": "Contraseña",
			"remember-me": "Recuérdame",
			"verification-code": "Código de verificación",
			"login-btn": "iniciar sesión",
			"email-is-required": "El correo electrónico es requerido",
			"email-must-be-valid": "El correo electrónico es inválido",
			"password-is-required": "La contraseña es requerida",
			"new-location": "Hemos notado que estás accediendo desde una nueva ubicación. Por favor ingresa el código de verificación que acabamos de enviarte a ",
			"new-location-2": ".Si nuestro correo electrónico no llega a su bandeja de entrada, verifique la bandeja de SPAM.",
			"access-confirmed": "Acceso confirmado",
			"login-redirection": "Serás redireccionado al administrador de tu cuenta en breve",
			"invalid-code": "Código de verificación incorrecto",
			"unknown-error": "Error desconocido",
			"create-account": "Crea una cuenta" ,			
		},
	}
})