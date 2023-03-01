$(document).ready(function(){

	/*	Mobile Menu Toggle */
	$(".mobile-menu-toggle").click(function(){
		$(this).toggleClass('open')
		$(".menu .mobile").toggleClass("active")
		$(".menu .mobile").toggleClass("inactive")
	})

	/*	Default English */
	$(".hide-english").show()

    $("#preloader").addClass('hidden');
    setTimeout(() => {
    	$("#preloader").addClass("removed");
    }, 1100)

    /*	Custom Links 	*/
    $("#adminLink").click(function() {
    	let url = "https://account.goelu.com?lang=" + (localStorage.getItem("locale") || "en")
    	location.href = url
    })
    $("#userLink").click(function() {
    	let url = "https://user.goelu.com?lang=" + (localStorage.getItem("locale") || "en")
    	location.href = url
    })
    $("#legacyLink").click(function() {
    	let url = "https://legacy.goelu.com?lang=" + (localStorage.getItem("locale") || "en")
    	location.href = url
    })
    $("#registerLink").click(function() {
    	let url = "https://account.goelu.com/register?lang=" + (localStorage.getItem("locale") || "en")
		gtag('event', 'suscribe', {	'event_category': 'register'})
    	location.href = url
    })
    $("#registerLink2").click(function() {
    	let url = "https://account.goelu.com/register?lang=" + (localStorage.getItem("locale") || "en")
		gtag('event', 'suscribe', {	'event_category': 'register'})
    	location.href = url
    })
	$("#trial").click(function() {
    	let url = "https://account.goelu.com/free-trial?lang=" + (localStorage.getItem("locale") || "en")
		gtag('event', 'free-trial', {	'event_category': 'register'})
		location.href = url;    	
    })
	$("#trial-free").click(function() {
    	let url = "https://account.goelu.com/free-trial?lang=" + (localStorage.getItem("locale") || "en")
		gtag('event', 'free-trial', {	'event_category': 'register'})
		location.href = url;    	
    })

    /*	Detect section 	*/
    if(location.pathname == "/how-it-works"){
    	$("#hiw-link").addClass("active")
    }else if(location.pathname == "/"){
    	$("#home-link").addClass("active")
    }
	/*		LANGUAGE TRANSLATION 	*/

	/*		Translations 	*/
	$.i18n({
    	locale: 'en'
	}).load({
		en: {
			"home": "HOME",
			'slider-1-title': 'Transcend the limits of time',
			"login": "log in",
			"testimonials": "testimonials",
			"tutorials": "tutorials",
			"how-it-works": "How it works",
			"section-1-title": "TRANSCEND THE LIMITS OF TIME",
			"section-1-p-1": "We were built with the single idea of helping people to transcend the limits of time by giving you goelU’s best tools to preserve your most important ideas and messages.",
			"section-1-p-2": "Once they are uploaded into goelU’s servers, we make sure they are delivered to the intended person at the exact time.",
			"in": "In",
			"administrator": "Administrator",
			"user": "User",
			"legacy-contact": "LEGACY MANAGER",
			"features-title": "The value of experience",
			"features-1": "we are aware of the value of your life experiences.",
			"features-2": "This is the reason why we make our main goal to help you create unique content to pass it on to your family and loved ones.",
			"spec-1-title": "LET YOUR FAMILY GET TO KNOW YOU",
			"spec-1-text": "What music do you like? Your opinion about a movie? In our tutorials you will find a grand variety of topics we suggest to make your videos about.",
			"spec-2-title": "COMMUNICATE TO SPECIFIC FAMILY MEMBERS",
			"spec-2-text": "Create content about every topic you like. Then create groups or individual profiles and choose exactly who is intended for.",
			"spec-3-title": "YOUR PRIVACY IS OUR BIGGEST CONCERN",
			"spec-3-text": "The second you upload a video, you can be absolutely sure we use the best security tools to ensure your information is protected.",
			"spec-4-title": "GOELU’S LAB",
			"spec-4-text": "In Our lab you will be able to upload any video and insert an audio explaining what is going on in it. If you have any old video you want to explain to your family, this is the best tool for it!",
			"spec-5-title": "MESSAGES FOR THE GENERATIONS TO COME",
			"spec-5-text": "There is no need anymore for the phrase “What your grandfather used to say”. Share your wisdom directly with the next generation.",
			"spec-6-title": "FAMILY RECIPES",
			"spec-6-text": "Teach your secret family recipes only to the people you want to pass it on to.",
			"calendar-title": "CALENDAR",
			"calendar-p-1": "Be sure you will always be there.",
			"calendar-p-2": "Schedule your videos for every important moment and event for each of your family member. Make videos for your family’s birthdays, record an audio for your children’s graduations or just upload a letter.",
			"calendar-p-3": "Make sure they don’t miss you on any special occasion.",
			"only-spanish-1": " ",
			"video-p-1": "our main objective is that, no matter what, you’ll never have to ask yourself...",
			"video-p-2": "What grandpa or grandma would’ve said about this?",
			"video-p-3": "UPLOAD YOUR VIDEOS",
			"video-p-4": "In goelU® you can upload videos of yourself explaining any situation with the absolute certainty that it will be accessed only by the people you authorize to see it.",
			"testimonial-1-text": "goelU® gave me the opportunity to trancend time assuring that my family won’t miss my opinion on my favourite topics.",
			"copyright": "Copyright",
			"terms-of-use": "Terms of use",
			"privacy-policy": "Privacy policy",
			"hiw-main": "HOW IT WORKS",
			"hiw-1-title": "CREATE YOUR ACCOUNT",
			"hiw-1-text": "It’s easy! Customize your plan to enjoy all of our products! Choose how many gigabytes and years you want your plan to last. Design your plan to transcend the limits of time!",
			"hiw-2-title": "CUSTOMIZE YOUR ACCOUNT",
			"hiw-2-text": "Add your contacts and create groups. Create categories to organize your content!",
			"hiw-3-title": "CREATE OR UPLOAD YOUR CONTENT",
			"hiw-3-text": "Create or upload your audios, videos and files and schedule its delivery with our tools. Stay present in the lives of your loved ones!",
			"hiw-4-title": "GOELU’S CALENDAR",
			"hiw-4-text": "With goelU’s Calendar create content to be triggered at the exact date and time. Schedule content for birthdays, anniversaries, or holidays.",
			"hiw-5-title": "GOELU’S LAB",
			"hiw-5-text": "In our LAB you will be able to upload any video and insert an audio explaining what is going on in it. If you have any old video you want to explain to your family, this is the best tool for it!",
			"hiw-6-title": "CHOOSE YOUR RECIPIENTS",
			"hiw-6-text": "Upload or create content for specific people. Make sure your messages will be delivered to the person you created the content for.",
			"hiw-7-title": "RECIPIENTS WILL BE NOTIFIED VIA E-MAIL",
			"hiw-7-text": "They will receive an email immediately after you create your content or on the date you set on goelU’s calendar.",
			"hiw-8-title": "COSTUMER SERVICE",
			"hiw-8-text": "goelU’s experts will be by your side in every step of the process to help you generate the best content for your family and friends.",
			"hiw-9-title": "BE PRESENT WITH YOUR FAMILY FOREVER",
			"hiw-9-text": "If you pass away prematurely don’t worry about missing important events of your closest people. Let us be your tool that assures you won’t be limited by time to stay present in your loved one’s dearest moments",
			"suscribe": "Subscribe",
			"free-trial":"Free trial",
		},
		es: {
			"home": "INICIO",
			'slider-1-title': 'Trasciende los límites del tiempo',
			"login": "iniciar sesión",
			"testimonials": "Testimonios",
			"tutorials": "tutoriales",
			"how-it-works": "Cómo funciona",
			"section-1-title": "Trasciende los límites del tiempo",
			"section-1-p-1": "Este sitio fue creado con la única intención de ayudar a las personas con las herramientas de goelU® para preservar sus ideas y mensajes más importantes a través del tiempo.",
			"section-1-p-2": "Una vez que los videos con tus ideas se cargan en los servidores de goelU®, nos aseguramos de que se entreguen a la persona indicada en el momento que tu nos señales.",
			"in": "En",
			"administrator": "Administrador",
			"user": "Usuario",
			"legacy-contact": "LEGACY MANAGER",
			"features-title": "El valor de la experiencia",
			"features-1": "somos conscientes del valor de tus experiencias de vida.",
			"features-2": "Esta es la razón por la cual nuestro objetivo es ayudarte a crear contenido único y asegurarnos que se transmita a tu familia y seres queridos.",
			"spec-1-title": "QUE TU FAMILIA TE CONOZCA",
			"spec-1-text": "¿Que música te gusta? ¿Tu opinión sobre una película? En nuestros tutoriales encontrará una gran variedad de temas sobre los que sugerimos hacer sus videos.",
			"spec-2-title": "COMUNICARSE CON MIEMBROS ESPECÍFICOS DE LA FAMILIA",
			"spec-2-text": "Crea contenido sobre cada tema que te guste. Luego crea grupos o perfiles individuales y elige exactamente para quién está destinado.",
			"spec-3-title": "TU PRIVACIDAD ES NUESTRA MAYOR PREOCUPACIÓN",
			"spec-3-text": "En el momento en que sube un video, puedes estar absolutamente seguro de que usamos las mejores herramientas de seguridad para garantizar que tu información esté protegida.",
			"spec-4-title": "LABORATORIO DE GOELU®",
			"spec-4-text": "En nuestro laboratorio, podrás subir cualquier video y insertar tus comentarios para dar explicación adicional. Si tienes videos antiguos que quieres explicar a tu familia, esta es la herramienta ideal!",
			"spec-5-title": "TUS MENSAJES PARA LAS GENERACIONES QUE VIENEN",
			"spec-5-text": "Graba mensajes para que cuando ya no estes, las generaciones futuras no se pierdan de tus consejos, de mensajes en momentos importantes o simplemente de lo todo lo que sentías por ellos.",
			"spec-6-title": "SECRETOS FAMILIARES",
			"spec-6-text": "Asegurate de las técnicas secretas de tu familia se queden entre ustedes. Comparte tus recetas culinarias, tus técnicas para tu trabajo o hasta como ser el mejor en algún juego de mesa. El cielo es límite para que puedas transmitir tus conocimientos a tu familia.",
			"calendar-title": "CALENDARIO",
			"calendar-p-1": "Asegúrate de siempre estar ahí.",
			"calendar-p-2": "Programa un mensaje para cada momento importante de la vida de tu familia.",
			"only-spanish-1": "Haz un video para los cumpleaños de tu alguien especial, graba un audio para las graduaciones de tus hijos o simplemente sube una carta.",
			"calendar-p-3": "Te ayudamos a que no te extrañen en ninguna ocasión especial.",
			"video-p-1": "nuestro objetivo principal es que, pase lo que pase, nunca tendrás que preguntarte ...",
			"video-p-2": "¿Qué es lo que el abuelo o la abuela habría dicho sobre esto?",
			"video-p-3": "Sube tus videos",
			"video-p-4": "goelU® es tu platafroma para que por medios audiovisuales expliques cualquier situación con la absoluta certeza de que el ser querido a quien se lo dirijas lo vea en el momento preciso para que nunca se pierdan de tu presencia en temas o momentos importantes.",
			"testimonial-1-text": "goelU® me dio la oportunidad de trascender en el tiempo asegurando que mi familia no se perderá mi opinión sobre mis temas favoritos.",
			"terms-of-use": "Términos de uso",
			"copyright": "Derechos de autor",
			"privacy-policy": "Política de privacidad",
			"hiw-main": "CÓMO FUNCIONA",
			"hiw-1-title": "CREA TU CUENTA",
			"hiw-1-text": "¡Es fácil! ¡Personaliza tu plan para disfrutar de todos nuestros productos! Elige cuántos gigabytes y cuántos años deseas que dure tu plan. ¡Diseña tu plan para trascender los límites del tiempo!",
			"hiw-2-title": "PERSONALIZA TU CUENTA",
			"hiw-2-text": "Agrega tus contactos y crea grupos. Crea temas para organizar tus contenidos.",
			"hiw-3-title": "CREA O SUBE TU CONTENIDO",
			"hiw-3-text": "Crea o sube tus audios, videos y archivos y programa su entrega con nuestras herramientas. ¡Mantente presente en la vida de sus seres queridos!",
			"hiw-4-title": "CALENDARIO DE GOELU®",
			"hiw-4-text": "Con el Calendario de goelU, crea contenido para que se active en la fecha y hora exactas. Programa contenido para cumpleaños, aniversarios o días festivos.",
			"hiw-5-title": "LABORATORIO DE GOELU®",
			"hiw-5-text": "En nuestro LAB podrás subir cualquier video e insertar un audio explicando lo que sucede en él. Si tienes algún video antiguo que quieras explicarle a tu familia, ¡esta es la mejor herramienta para ello!",
			"hiw-6-title": "ELIGE TUS DESTINATARIOS",
			"hiw-6-text": "Sube o crea contenido para personas en específico. Asegúrate de que tus mensajes se entreguen a la persona para la que creaste el contenido.",
			"hiw-7-title": "LOS DESTINATARIOS SERÁN NOTIFICADOS POR CORREO ELECTRÓNICO",
			"hiw-7-text": "Los destinatarios recibirán un correo electrónico inmediatamente después de que crees contenido para ellos o en la fecha que establezcas en el calendario de GoelU®.",
			"hiw-8-title": "SERVICIO AL CLIENTE",
			"hiw-8-text": "Los expertos de goelU estarán a tu lado en cada paso del proceso para ayudarte a generar el mejor contenido para tu familia y amigos.",
			"hiw-9-title": "ESTAR PRESENTE CON TU FAMILIA PARA SIEMPRE",
			"hiw-9-text": "Si falleces prematuramente, no te preocupes por perderte los eventos importantes de tus personas más cercanas. Permítenos ser tu herramienta que te asegure que no estarás limitado por el tiempo para estar presente en los momentos más queridos de tus seres amados.",
			"suscribe": "Suscribir",
			"free-trial":"Prueba gratis",
		}
	});

	/*		Language Triggers 	*/
	$(".english-switcher").click( setEnglish )
	$(".spanish-switcher").click( setSpanish )


	//$("body").i18n()

	/* Set locale */
	$.i18n().locale = localStorage.getItem("locale")

	if( localStorage.getItem("locale") == "es" ){
		setSpanish(true)
	}else{
		setEnglish(true)
	}

	$("body").i18n()
})

function setEnglish(wait) {
	localStorage.setItem("locale", "en")

	if( wait === true ){
		setTimeout(function(){
			$zopim.livechat.set({language: 'en'})
		}, 2000)
	}else
		$zopim.livechat.set({language: 'en'})

	$.i18n().locale = "en"
	$("body").i18n()
	$(".english-switcher").addClass("active")
	$(".spanish-switcher").removeClass("active")
	$(".hide-english").hide()

}

function setSpanish(wait) {
	localStorage.setItem("locale", "es")

	if( wait === true ){
		setTimeout(function(){
			$zopim.livechat.set({language: 'es'})
		}, 2000)
	}else
		$zopim.livechat.set({language: 'es'})

	$.i18n().locale = "es"
	$("body").i18n()
	$(".spanish-switcher").addClass("active")
	$(".english-switcher").removeClass("active")
	$(".hide-english").show()

}


function goToTerms() {
	if( $.i18n().locale == "es" )
		window.open("https://www.iubenda.com/condiciones-de-uso/94397736", "_blank")
	else
		window.open("https://www.iubenda.com/terms-and-conditions/82638648", "_blank")
}
function goToPolicy() {
	if( $.i18n().locale == "es" )
		window.open("https://www.iubenda.com/privacy-policy/94397736", "_blank")
	else
		window.open("https://www.iubenda.com/privacy-policy/82638648", "_blank")
}