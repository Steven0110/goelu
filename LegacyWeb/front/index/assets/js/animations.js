function animateCSS(element, animationName, animationSpeed, callback) {
    const node = element
    node.classList.add('animated', animationName)

    if( animationSpeed )
    	node.classList.add( animationSpeed )

    function handleAnimationEnd() {
        
        node.classList.remove('animated', animationName)
    	
    	if( animationSpeed )
        	node.classList.remove(animationSpeed)

        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

$(window).scroll(function() {
	$(".hold-animation").each(function(i, e){
        let top_of_element = $(this).offset().top;
        let bottom_of_element = $(this).offset().top + $(this).outerHeight();
        let bottom_of_screen = $(window).scrollTop() + window.innerHeight;
        let top_of_screen = $(window).scrollTop();

        if((bottom_of_screen - 100 > top_of_element) && (top_of_screen < bottom_of_element)){
			$(e).removeClass("hold-animation");
			let animationName = $(e).attr("data-animation")
			let animationSpeed = $(e).attr("data-animation-speed") || ""
			animateCSS(e, animationName, animationSpeed, function(){
				console.log("Done")
			})
			//$(e).addClass();
        }
    })
})