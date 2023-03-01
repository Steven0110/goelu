<template lang="pug">
	.menux
		.d-flex.align-center.mobile-menu-logo.d-block.d-lg-none(style="height:100%;")
			img.mobilex-menu-logo(src="assets/images/goelu_g_logo.svg")
		.relative.desktopx.d-none.d-lg-block
			.logo
				a(href='https://goelu.com/')
					img.img.img-responsive(src='assets/images/goelU.svg')
			.options
				.language-selector
					.valign-parent
						p.valign-child
							span.language-option.english-switcher(@click="changeLanguage('en')", :class="{active: locale == 'en'}")
								|EN
							span
								|&nbsp;/&nbsp;
							span.language-option.spanish-switcher(@click="changeLanguage('es')", :class="{active: locale == 'es'}")
								|ES
				//.option
					.valign-parent
						router-link#plansLink.valign-child(:to="{path: '/plans'}" ,:class="{active: $route.name == 'Plans'}")
							|{{ $t('plans-menu-tag') }}
				.option.submenu
					.valign-parent
						a.valign-child(href='javascript:void(0);')
							|{{ $t('login') }}
					.dropdown
						a#adminLink.valign-child(href='https://account.goelu.com/') 
							|{{ $t('administrator') }}
						a#userLink.valign-child(href='http://user.goelu.com/')
							|{{ $t('user') }}
						a#legacyLink.valign-child(href='https://legacy.goelu.com/')
							|{{ $t('legacy-manager') }}
				//.option
					.valign-parent
						router-link#registerLink.valign-child( @click.native="actionSuscribe",:to="{path: '/register'}",:class="{active: $route.name == 'Register'}")
							|{{ $t('subscribe') }}
				.option
					.valign-parent
						router-link#partnershipLink.valign-child( :to="{path: '/partnership'}",:class="{active: $route.name == 'Partnership'}")
							|{{ $t('m-partnership') }}
				//.option
					.valign-parent
						a#hiw-link.valign-child(href='https://goelu.com/how-it-works')
							|{{ $t('m-hiw') }}
				.option
					.valign-parent
						a#home-link.valign-child(href='https://goelu.com/')
							|{{ $t('m-home') }}
		.relative.mobilex.d-block.d-lg-none(:class="{inactive: !mobileMenu, active: mobileMenu}")
			.logo
				a(href='https://goelu.com/')
					img(src='assets/images/logo.svg')
			.options
				.option
					.valign-parent
						a.valign-child(href='https://goelu.com/')
							|{{ $t('m-home') }}
				.option
					.valign-parent
						a.valign-child(href='https://goelu.com/how-it-works')
							|{{ $t('m-hiw') }}
				.option
					.valign-parent
						router-link#partnershipLink.valign-child( :to="{path: '/partnership'}",:class="{active: $route.name == 'Partnership'}")
							|{{ $t('m-partnership') }}
				.option
					.valign-parent
						router-link#plansLink.valign-child(:to="{path: '/plans'}")
							|{{ $t('plans-menu-tag') }}
				.option
					.valign-parent
						router-link#registerLink2.valign-child(:to="{path: '/register'}")
							|{{ $t('subscribe') }}
				.option.submenu
					.valign-parent
						a.valign-child(href='javascript:void(0);')
							|{{ $t('login') }}
						img.dropdown-icon(src='/assets/icons/dropdown.png')
					.mobilex-dropdown
						a.valign-child(href='https://account.goelu.com')
							|{{ $t('administrator') }}
						a.valign-child(href='https://user.goelu.com')
							|{{ $t('user') }}
						a.valign-child(href='https://legacy.goelu.com')
							|{{ $t('legacy-manager') }}
				.language-selector
					.valign-parent
						img.language-option.english-switcher.icon-flag(src='https://cdn4.iconfinder.com/data/icons/rounded-square-national-flags/512/USA-512.png', @click="changeLanguage('en')", :class="{active: locale == 'en'}")
						img.language-option.spanish-switcher.icon-flag(src='https://cdn.countryflags.com/thumbs/spain/flag-button-square-250.png', @click="changeLanguage('es')", :class="{active: locale == 'es'}")
		.mobilex-menu-toggle-container.d-block.d-lg-none
			.mobilex-menu-toggle(@click="mobileMenu =! mobileMenu", :class="{open: mobileMenu}")
				span
				span
				span
</template>

<script>
	export default {
		data() {
			return {
				mobileMenu: false
			}
		},
		methods: {
			changeLanguage: function( locale ) {
				this.$i18n.locale = locale
			},
            actionSuscribe: function(){                
                this.$gtag.event('suscribe',{'event_category': 'register'})                
            },
        actionFree: function(){                                
                this.$gtag.event('free-trial',{'event_category': 'register'})								
        }
		},
		computed: {
			locale: function(){
				return this.$i18n.locale
			}
		}
	}
</script>

<style lang="sass">

.mobilex-menu-toggle
  width: 40px
  height: 30px
  position: relative
  -webkit-transform: rotate(0deg)
  -moz-transform: rotate(0deg)
  -o-transform: rotate(0deg)
  transform: rotate(0deg)
  -webkit-transition: .5s ease-in-out
  -moz-transition: .5s ease-in-out
  -o-transition: .5s ease-in-out
  transition: .5s ease-in-out
  cursor: pointer
  width: 30px
  height: 23px
  position: absolute
  top: 50%
  transform: translateY(-50%)

  span
    display: block
    position: absolute
    height: 3px
    width: 100%
    background: #ccc
    border-radius: 9px
    opacity: 1
    left: 0
    -webkit-transform: rotate(0deg)
    -moz-transform: rotate(0deg)
    -o-transform: rotate(0deg)
    transform: rotate(0deg)
    -webkit-transition: .25s ease-in-out
    -moz-transition: .25s ease-in-out
    -o-transition: .25s ease-in-out
    transition: .25s ease-in-out

    &:nth-child(1)
      top: 0px
      -webkit-transform-origin: left center
      -moz-transform-origin: left center
      -o-transform-origin: left center
      transform-origin: left center

    &:nth-child(2)
      top: 10px
      -webkit-transform-origin: left center
      -moz-transform-origin: left center
      -o-transform-origin: left center
      transform-origin: left center

    &:nth-child(3)
      top: 20px
      -webkit-transform-origin: left center
      -moz-transform-origin: left center
      -o-transform-origin: left center
      transform-origin: left center

  &.open span
    &:nth-child(1)
      -webkit-transform: rotate(45deg)
      -moz-transform: rotate(45deg)
      -o-transform: rotate(45deg)
      transform: rotate(45deg)
      top: 10px
      left: 4px

    &:nth-child(2)
      width: 0%
      opacity: 0

    &:nth-child(3)
      -webkit-transform: rotate(-45deg)
      -moz-transform: rotate(-45deg)
      -o-transform: rotate(-45deg)
      transform: rotate(-45deg)
      top: 32px
      left: 4px

.menux
  width: 100%
  height: 9vh
  top: 0
  z-index: 300
  position: fixed
  left: 0
  opacity: 0.95
  background-color: #f2f2f2
  border-bottom: 1px solid rgba(255, 255, 255, 0.3)
  transition: 0.2s linear all
  .relative
    position: relative !important
  .valign-parent
    width: 100%
    height: 100%
    display: table
  .valign-child
    width: 100%
    height: 100%
    display: table-cell
    vertical-align: middle

  .mobilex-menu-logo
    max-height: 100%
    width: 35px
    margin-left: 10px

  .logo
    width: 10%
    position: relative
    display: table
    text-align: center
    float: left
    height: 9vh
    transition: 0.2s linear all

    a
      height: 9vh
      display: table-cell
      vertical-align: middle

    img
      display: inline-block
      max-height: 90%
      max-width: 85%
      vertical-align: middle

  .options
    float: left
    width: 90%
    height: 9vh
    border-right: 1px solid rgba(0, 0, 0, 0.07)
    transition: 0.2s linear all

    .option
      position: relative
      float: right
      padding-right: 25px
      padding-left: 25px
      height: 100%
      border: 1px solid rgba(0, 0, 0, 0.07)
      border-bottom: none
      border-right: none
      border-top: none
      font-family: Raleway, sans-serif
      font-weight: 700
      font-size: 8pt
      text-transform: uppercase
      transition: 0.3s linear all

    .language-selector
      float: right
      padding-right: 25px
      padding-left: 25px
      height: 100%
      border: 1px solid rgba(255, 255, 255, 0.3)
      border-bottom: none
      border-right: none
      border-top: none
      transition: 0.3s linear all
      font-family: Raleway, sans-serif
      font-weight: 700
      font-size: 8pt
      width: 150px
      color: white
      text-align: center
      transition: 0.2s linear all
      width: 102px

      span
        display: inline-block
        color: #bbb
        transition: 0.2s linear all

        &.language-option
          &.active
            color: #3aa9e0
            transition: 0.2s linear all

          &:hover
            cursor: pointer
            color: #3aa9e0
            transition: 0.2s linear all

    .option
      &:nth-child(2)
        border-right: 1px solid rgba(0, 0, 0, 0.07)

      &:hover
        transition: 0.3s linear all

        a
          transition: 0.3s linear all
          color: #3aa9e0
          text-decoration: none

      a
        text-decoration: none
        &.active
          transition: 0.3s linear all
          color: #3aa9e0

        transition: 0.3s linear all
        color: #444

        &:hover
          text-decoration: none

      .dropdown
        display: block
        width: 175%
        position: absolute
        left: -2px
        transition: 0.2s linear all
        opacity: 0
        overflow: hidden
        height: 0

        a
          width: 100%
          display: block
          padding-top: 15px
          padding-bottom: 15px
          padding-left: 15px
          padding-right: 15px
          border-bottom: 1px solid rgba(255, 255, 255, 0.3)
          border-right: 1px solid rgba(255, 255, 255, 0.3)
          border-left: 1px solid rgba(255, 255, 255, 0.3)
          transition: 0.2s linear all

      &.submenu:hover .dropdown
        opacity: 1
        height: 144px
        transition: 0.2s linear all

        a
          transition: 0.2s linear all
          height: 48px
          background-color: #9e9e9e
          color: white

          &:hover
            background-color: #828282

  .mobilex
    background: #2a2f3b
    position: fixed !important
    height: 100vh
    right: 0
    width: 60%
    padding-top: 80px
    padding-top: 9vh

    &.active
      transform: translate(0)
      transition: 0.2s linear all

    &.inactive
      transform: translate(100%)
      transition: 0.2s linear all

    .logo
      display: block
      width: 100%
      text-align: center
      position: relative
      text-align: center

      a
        display: block
        width: 100%

      img
        display: inline-block
        max-width: 60%

    .options
      height: 9vh

      .option
        &:not(.submenu)
          text-align: right
          height: 100%
          transition: 0.3s linear all
          font-family: "Lato-Bold"
          font-size: 12px
          height: 50px
          padding: 0 30px 0 20px

        &:hover
          background-color: #454d61
          transition: 0.3s linear all

        margin-top: 10px

        a
          color: rgba(255, 255, 255, 0.7)

          &:hover
            text-decoration: none

        &.submenu
          position: relative
          transition: 0.3s linear all
          font-family: "Lato-Bold"
          font-size: 12px
          text-align: right
          padding: 10px 50px 15px 20px
          height: auto

          > .valign-parent
            position: relative

          .dropdown-icon
            position: absolute
            height: 13px
            width: 13px
            right: -20px
            top: 50%
            transform: translateY(-50%) rotate(0deg)
            transition: 0.2s linear all
            filter: invert(1)

          &:hover .dropdown-icon
            transform: translateY(-50%) rotate(180deg)
            transition: 0.2s linear all

        .mobilex-dropdown
          position: relative
          padding-top: 10px
          height: 0
          overflow: hidden
          transition: 0.2s linear all

          a
            display: block
            padding-top: 10px
            padding-bottom: 10px
            height: auto
            opacity: 0
            transition: 0.2s linear all

        &.submenu:hover .mobilex-dropdown
          height: 125px
          transition: 0.2s linear all

          a
            opacity: 1
            transition: 0.2s linear all

            &:hover
              transition: 0.2s linear all

    .search
      width: 5%
      height: 9vh
      text-align: center
      border-bottom: 1px solid rgba(255, 255, 255, 0.5)

      img
        width: 15px

.mobilex-menu-toggle-container
  position: fixed
  z-index: 100
  right: 20px
  top: 0px
  width: 30px
  height: 9vh

.menux
  .mobilex .icon-flag
    width: 40px
    display: inline-block
    margin-left: 10px
    border-radius: 50%

  &.scrolled
    background-color: #2e2e2e

    .dropdown
      background-color: #2e2e2e

  &.override-active
    background-color: #2e2e2e
    transition: 0.2s linear all
    border-bottom: 1px solid rgba(0, 0, 0, 0.3)

  &.scrolled
    .options
      .option a
        color: white

      .language-selector span
        color: #bbb

        &.language-option
          &.active, &:hover
            color: white

      .option:not(.submenu):hover
        background-color: #eeeeee

        a
          color: black

    .logo
      border-right: 1px solid rgba(255, 255, 255, 0.3)
      transition: 0.2s linear all

    .options
      border-right: 1px solid rgba(255, 255, 255, 0.3)
      transition: 0.2s linear all

      .option, .language-selector
        border: 1px solid rgba(255, 255, 255, 0.3)
        border-bottom: none
        border-right: none
        border-top: none
        transition: 0.2s linear all

@media only screen and (min-width: 1440px)
  .menux .options
    .option
      font-size: 9pt

    .language-selector
      font-size: 9pt
      width: 135px

@media only screen and (min-width: 1920px)
  .menux .options
    .option
      font-size: 10pt

    .language-selector
      font-size: 10pt
      width: 135px

@media only screen and (min-width: 2560px)
  .menux .options
    .option
      font-size: 12pt

    .language-selector
      font-size: 12pt
      width: 135px

@media only screen and (max-width: 768px)
  .menux
    background-color: #2E2E2E
    padding-top: 5px
    padding-bottom: 5px
    border: none

    .options
      border: none

      .option
        border: none

    .mobilex .options
      width: 100%

      .option
        width: 100%

    .options .language-selector
      width: 100%
      display: block
      text-align: right
      border: none
      margin-top: 15px

      .language-option
        transition: 0.1s linear all

        &.active
          box-shadow: 0px 0px 5px 4px white
          transition: 0.1s linear all
</style>