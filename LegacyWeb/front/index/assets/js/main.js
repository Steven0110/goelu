$(document).ready(function(){
		$("#suscribe-load-1").hide()
		$("#suscribe-load-2").hide()		
		window.setTimeout(function alert(){
			$('#exampleModalCenter').modal({
				keyboard: false
			  })
			$('#exampleModalCenter').modal('show')
		},6000)
	

	/*	Main Slider */
	$("#slider").slick({
  		dots: false,
  		infinite: true,
  		speed: 300,
  		arrows: true,
  		autoplay: true,
  		//fade: true,
  		cssEase: "linear"
	})

	/*	Testimonials Slider */
	$("#testimonialsSlider").slick({
  		dots: true,
  		infinite: true,
  		speed: 300,
  		arrows: false,
  		autoplay: true,
  		//fade: true,
  		cssEase: "linear"
	})

	$('.carousel').carousel({
		interval: 7000,
		pause: false,
	  })		
	
    /*	Custom Links 	*/
	$("#plansLink").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
    $("#adminLink").click(function() {
    	
		let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
    $("#userLink").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
    $("#legacyLink").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
    $("#registerLink").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
		gtag('event', 'suscribe', {	'event_category': 'register'})
    	location.href = url
    })

    $("#registerLink2").click(function() {
		let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
		gtag('event', 'suscribe', {	'event_category': 'register'})
    	location.href = url
    })

	$("#trial").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
		gtag('event', 'free-trial', {	'event_category': 'register'})			
		location.href = url;    	
    })
	$("#trial2").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
		gtag('event', 'free-trial', {	'event_category': 'register'})
		location.href = url;    	
    })
	$("#trial-free").click(function() {
		gtag('event', 'free-trial', {	'event_category': 'register'})
		let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
		location.href = url;    	
    })
	$("#plans").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
	$("#parthership").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
	$("#plans-m").click(function() {
    	let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
	$("#parthership-m").click(function() {
		let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
	$("#parthership-slider").click(function() {
		let url = "https://steven0110.github.io/goelu/LegacyWeb/front/publicapp/public/"
    	location.href = url
    })
	/*	Mobile Menu Toggle */
	$(".mobile-menu-toggle").click(function(){
		$(this).toggleClass('open')
		$(".menu .mobile").toggleClass("active")
		$(".menu .mobile").toggleClass("inactive")
	})

	/*	Menu Scroll Effects*/
	$(window).scroll(function (event) {
    	if( screen.width > 768){
    		let y = $(window).scrollTop();
    		if( y >= 100 )
    			$(".menu").addClass("scrolledx")
    		else
    			$(".menu").removeClass("scrolledx")
    	}
	});

	/*	Default English */
	$(".hide-english").show()

    $("#preloader").addClass('hidden');
    setTimeout(() => {
    	$("#preloader").addClass("removed");
    }, 1100)

    $(".demo").click(function(){
    	console.log($("#preloader"))
    })

    /*	Video popups*/
    $(".video-button-text").click( openPopup )
    $(".video-image-poster").click( openPopup )

    $(".close-video-popup").click(function(e) {
    	$(".video-popup").fadeOut()

    	/* Stop all videos 	*/
    	videojs('video-2').pause();
    	videojs('video-3').pause();
    	videojs('video-4').pause();
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
			"main-section-title": "We help you communicate with your loved ones even if you have passed away ",
			"main-section-text": "Create or upload videos, audios, or files to be sent on a future date or whenever a significant event happens.",
			"login": "log in",
			"testimonials": "testimonials",
			"tutorials": "tutorials",
			"how-it-works": "How it works",
			"section-1-title": "TRANSCEND THE LIMITS OF TIME",
			"section-1-p-1": "INNOVATE THE WAY",
			"section-1-p-2": "YOU WILL BE REMEMBERED",
			"in": "In",
			"administrator": "Administrator",
			"user": "User",
			"legacy-contact": "LEGACY MANAGER",
			"features-title": "The value of experience",
			"features-1": "we are aware of the value of your life experiences.",
			"features-2": "Our main goal is to help you create unique content to pass it on to your family and loved ones.",
			"spec-1-title": "LET YOUR FAMILY GET TO KNOW YOU",
			"spec-1-text": "What music do you like? Your opinion about a movie? Your loved ones will have the opportunity to know you even after your death.",
			"spec-2-title": "GOELU’S CALENDAR",
			"spec-2-text": "Create content to be triggered at the exact date and time. Schedule content for birthdays, anniversaries, or holidays.",
			"spec-3-title": "YOUR PRIVACY IS OUR BIGGEST CONCERN",
			"spec-3-text": "The second you upload a video, you can be absolutely sure we use the best security tools to ensure your information is protected.",
			"spec-4-title": "GOELU’S LAB",
			"spec-4-text": "In Our lab you will be able to upload any video and insert an audio explaining what is going on in it. ",
			"spec-5-title": "MESSAGES FOR THE GENERATIONS TO COME",
			"spec-5-text": "There is no need anymore for the phrase “What your grandfather used to say”. Share your wisdom directly with the next generation.",
			"spec-6-title": "LEGACY MANAGER",
			"spec-6-text": "Assign a legacy manager to send your content when you pass away. Use it for when you don’t know a specific date or whom you are sending them to.",
			"calendar-title": "CALENDAR",
			"calendar-p-1": "Be sure you will always be there.",
			"calendar-p-2": "Schedule your videos for every important moment and event for each of your family member. Make videos for your family’s birthdays, record an audio for your children’s graduations or just upload a letter.",
			"calendar-p-3": "Make sure they don’t miss you on any special occasion.",
			"only-spanish-1": " ",
			"video-p-1": "We provide a new tool for communicating with your loved ones once you are gone.",
			"video-p-2": "What is goelu?",
			"video-p-3": "UPLOAD YOUR VIDEOS",
			"video-p-4": "We are a website where you create or upload videos, audios, or files and send or schedule their delivery in a future date to ensure your loved ones won’t miss you in any important event of their lives.",
			"tutorials-1-title": "GET TO KNOW US",
			"features-1-text": "Make sure they don’t miss you on any special occasion.",
			"testimonial-1-text": "My work is hard. Not knowing if I am coming back from my missions is always a tough idea. With goelU at least I know my children will not miss my thoughts on every important event in their lives.",
			"testimonial-2-text": "As an influencer I am used to be in front of the camera for thousands of people. goelU made me save my best ones for my kids! Even if for any reason I am not here, ill be with them.",
			"copyright": "Copyright",
			"terms-of-use": "Terms of use",
			"privacy-policy": "Privacy policy",
			"suscribe": "Subscribe",
			"suscribe-1": "Subscribe to our",
			"suscribe-2": " newsletter",
			"suscribe-text":"Join our subscribers list to get the latest news, updates and special offers delivered directly in your inbox. Innovate the way you will be remembered!",
			"video-1-title": "Calendar",
			"video-1-text": "Use our Calendar tool to schedule content for specific dates like birthdays, anniversaries or festivities.",
			"video-2-title": "Legacy Manager",
			"video-2-text": "Ask your legacy manager to send your content if any special occasion takes place like a wedding, graduation or a childbirth",
			"video-3-title": "Files",
			"video-3-text": "Explain those special moments captured by a picture, pdf or audio. Give context to any file and let your loved ones understand you better",
			"watch-video": "Watch video",
			"free-trial":"Free trial",
			"free-trial-title":"Start your free trial today!",			
			"free-trial-title-2":"Enjoy our platform for a whole month free of charge!",			
			"free-trial-text":"Record or upload up to 100 MB of any content and schedule it using any of our tools.",
			"free-trial-text-2":"Innovate the way you will be remembered",
			"email":"Enter your email",
			"newsletter-1":"Don't miss out on our promos!",
			"newsletter-2":"Subscribe and be the first to know about our discounts!",
			"error-susc-1":"You are already registered",
			"error-susc-2":"An unexpected error occurred",
			"susses-1":"Subscription ended",
			"parthership-slider-title":"Let’s innovate the way you will be remembered.",
			"parthership-slider-content":"We can upgrade your line of work, giving more value to human connection and legacies. Our Main goal is to bring people closer to their family not allowing time to be an impediment",
			"parthership-slider-btn":"more information",
		},
		es: {
			"home": "INICIO",
			'slider-1-title': 'Trasciende los límites del tiempo',
			"main-section-title": "Te ayudamos a comunicarte con tus seres queridos incluso después de tu muerte.",
			"main-section-text": "Crea o sube videos, audios o archivos para enviarlos en una fecha futura o cuando ocurra un evento significativo.",
			"login": "iniciar sesión",
			"testimonials": "Testimonios",
			"tutorials": "tutoriales",
			"how-it-works": "Cómo funciona",
			"section-1-title": "Trasciende los límites del tiempo",
			"section-1-p-1": "INNOVA LA FORMA",
			"section-1-p-2": "EN LA QUE SERÁS RECORDADO",
			"in": "En",
			"administrator": "Administrador",
			"user": "Usuario",
			"legacy-contact": "LEGACY MANAGER",
			"features-title": "El valor de la experiencia",
			"features-1": "somos conscientes del valor de tus experiencias de vida.",
			"features-2": "Nuestro principal objetivo es ayudarte a crear contenido único para transmitirlo a tu familia y seres queridos.",
			"spec-1-title": "QUE TU FAMILIA TE CONOZCA",
			"spec-1-text": "¿Que música te gusta? ¿Tu opinión sobre una película? Tus seres queridos tendrán la oportunidad de conocerte incluso después de tu muerte.",
			"spec-2-title": "CALENDARIO DE GOELU",
			"spec-2-text": "Crea contenido para que se mande en la fechas y horas exactas. Programa contenido para cumpleaños, aniversarios o días festivos.",
			"spec-3-title": "TU PRIVACIDAD ES NUESTRA MAYOR PREOCUPACIÓN",
			"spec-3-text": "En el momento en que subes un video, puedes estar absolutamente seguro de que usamos las mejores herramientas de seguridad para garantizar que tu información esté protegida.",
			"spec-4-title": "LABORATORIO DE GOELU®",
			"spec-4-text": "En nuestro laboratorio podrás cargar cualquier video e insertar tus comentarios  para dar explicación adicional. Si tienes videos antiguos que quieres explicar a tu familia, ¡esta es la herramienta ideal!",
			"spec-5-title": "TUS MENSAJES PARA LAS GENERACIONES QUE VIENEN",
			"spec-5-text": "Graba mensajes para que cuando ya no estes, las generaciones futuras no se pierdan de tus consejos, de mensajes en momentos importantes o simplemente de lo todo lo que sentías por ellos.",
			"spec-6-title": "LEGACY MANAGER",
			"spec-6-text": "Asigna a tus legacy managers para enviar tu contenido cuando fallezcas. Úsalo para cuando no sepas una fecha específica en la que acontece un evento o cuando no sepas a quién se lo estás enviando.",
			"calendar-title": "CALENDARIO",
			"calendar-p-1": "Asegúrate de siempre estar ahí.",
			"calendar-p-2": "Programa un mensaje para cada momento importante de la vida de tu familia.",
			"only-spanish-1": "Haz un video para los cumpleaños de tu alguien especial, graba un audio para las graduaciones de tus hijos o simplemente sube una carta.",
			"calendar-p-3": "Te ayudamos a que no te extrañen en ninguna ocasión especial.",
			"video-p-1": "Ofrecemos una nueva herramienta para comunicarte con tus seres queridos una vez que te hayas ido.",
			"video-p-2": "¿Qué es goelu?",
			"video-p-3": "Sube tus videos",
			"video-p-4": "Somos un sitio web donde tú creas o subes videos, audios o archivos y envías o programas su entrega en una fecha futura, con el objetivo de asegurar que tus seres queridos no te extrañarán en ningún evento importante de sus vidas.",
			"tutorials-1-title": "CONÓCENOS",
			"features-1-text": "Asegúrate de que tus seres queridos no te extrañen en ninguna ocasión especial.",
			"testimonial-1-text": "Mi trabajo es difícil, no saber si regresaré de las misiones siempre es una idea muy dura. Con goelU al menos sé que mis hijos no se perderán de saber mis pensamientos en cada momento especial de sus vidas.",
			"testimonial-2-text": "Como influencer estoy acostumbrada a estar frente a una cámara por miles de personas. ¡Con goelU guardé los mejores para mis hijos! Incluso si por alguna razón no estoy aquí, Yo estaré con ellos.",
			"terms-of-use": "Términos de uso",
			"copyright": "Derechos de autor",
			"privacy-policy": "Política de privacidad",
			"suscribe": "Suscribir",
			"suscribe-1": "Suscríbete a nuestro",
			"suscribe-2": " newsletter",
			"suscribe-text":"Únete a nuestra lista de suscriptores para recibir las últimas noticias, actualizaciones y ofertas especiales directamente en su bandeja de entrada. ¡Innove la forma en que será recordado!",
			"video-1-title": "Calendario",
			"video-1-text": "Utiliza nuestra herramienta Calendario para programar contenido para fechas específicas como cumpleaños, aniversarios o festividades.",
			"video-2-title": "Legacy Manager",
			"video-2-text": "Pídele a tu Legacy Manager que envíe su contenido en alguna ocasión especial como una boda, una graduación o en el nacimiento de un nuevo miembro de la familia.",
			"video-3-title": "Sube tus archivos",
			"video-3-text": "Explica esos momentos especiales capturados por una imagen, pdf o audio. Dale contexto a cualquier archivo y permite que tus seres queridos te comprendan mejor.",
			"watch-video": "Ver video",
			"free-trial":"Prueba gratis",
			"free-trial-title":"¡Comieza tu prueba gratis hoy!",			
			"free-trial-title-2":"¡Disfruta de nuestra plataforma durante todo un mes gratis!",			
			"free-trial-text":"Graba o sube hasta 100 MB de cualquier contenido y prográmalo con cualquiera de nuestras herramientas.",
			"free-trial-text-2":"Innova la forma en la que serás recordado",
			"email": "Introduce tu correo electrónico",
			"newsletter-1":"¡No te pierdas nuestras promociones!",
			"newsletter-2":"¡Suscríbete y sé el primero en conocer nuestros descuentos!",
			"error-susc-1":"Usted ya está registrado",
			"error-susc-2":"Ocurrió un error inesperado",
			"susses-1":"Suscripción finalizada",
			"parthership-slider-title":"INOVEMOS LA FORMA EN QUE SERÁS RECORDADO. ",
			"parthership-slider-content":"Nosotros podemos mejorar su línea de trabajo, dando más valor a la conexión humana y los legados. Nuestro principal objetivo es acercar a las personas a su familia sin dejar que el tiempo sea un impedimento",
			"parthership-slider-btn":"MÁS INFORMACIÓN",
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

	$("#mc-embedded-subscribe").click(function(){
		let mail=$('#mce-EMAIL').val()		
		let body=JSON.stringify({email:mail})
		$("#suscribe-text-2").hide()				
		$("#suscribe-load-2").show()
		$.ajax({
			type:"POST",
			contentType: "application/json",
			url:"https://6in5wbnt2e.execute-api.us-west-2.amazonaws.com/prod/suscribe",
			data:body,
			success:function(datos){				
				sweetAlert("Succes", $.i18n('susses-1'), "success")				
			 },
			 error:function(jqXHR, textStatus, errorThrown){  				
				if(jqXHR.status == 400)
					sweetAlert("Error",$.i18n('error-susc-1'), "error")
				else{
					sweetAlert("Error",$.i18n('error-susc-2'),"error")
				}							
			},
			complete:function(){
				$("#suscribe-text-2").show()
				$("#suscribe-load-2").hide()					
			},
			dataType: "json"
		})
	})

	$(".mc-embedded-subscribe").click(function(){
		let mail=$('.mce-EMAIL').val()		
		let body=JSON.stringify({email:mail})		
		$("#suscribe-text-1").hide()				
		$("#suscribe-load-1").show()	
		$.ajax({
			type:"POST",
			contentType: "application/json",
			url:"https://6in5wbnt2e.execute-api.us-west-2.amazonaws.com/prod/suscribe",
			data:body,
			success:function(datos){ 
				sweetAlert("Succes",$.i18n('susses-1'), "success")								
			 },
			 error:function(jqXHR, textStatus, errorThrown){
				if(jqXHR.status == 400)
					sweetAlert("Error", $.i18n('error-susc-1'), "error")
				else{
					sweetAlert("Error",$.i18n('error-susc-2'),"error")
				}				
			},
			complete:function(){
				$("#suscribe-text-1").show()
				$("#suscribe-load-1").hide()	
				$('#exampleModalCenter').modal('hide')
			},
			dataType: "json"
		})
	})
})

function openPopup(e) {
	console.log(e)
	let el = $(e.currentTarget)
	let pupupNumber = el.data("videoId") || 1

	$(`#v-popup-${pupupNumber}`).fadeIn()
}

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