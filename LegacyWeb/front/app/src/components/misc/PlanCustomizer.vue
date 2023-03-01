<template lang="pug">
	.plan-customizer
		.variable-block
			.variable-title
				|{{ $t('for-how-many') }}
			.variable-quantity
				|{{ years | yearsText }} {{ yearsTranslatedText }}
			v-slider(
				v-model="years",
				:min="minYears || 1",
				:max="99",
				track-color="#eee",
				@change="update")
		.variable-block
			.variable-title
				|{{ $t('how-many-gigabytes') }}
			.variable-quantity
				|{{ storage | storageText }}
			v-slider(
				v-model="storage",
				:min="minStorage || 5",
				:max="1000",
				step="5",
				track-color="white",
				@change="update",
				:height="20")

		v-row(dense).plan-info
			v-col.pa-0(md="4", cols="12")
				.data-block.first
					.data-inner-block
						.data-title
							|{{ $t('plan-almacenamiento') }}
						.data-value
							|{{ storage | storageText }}
			v-col.pa-0(md="4", cols="12")
				.data-block.second
					.data-inner-block
						.data-title
							|{{ $t('time') }}
						.data-value
							|{{ years | yearsText }} {{ yearsTranslatedText }}
			v-col.pa-0(md="4", cols="12")
				.data-block.third
					.data-inner-block
						.data-title
							|{{ $t('price') }}
						.data-value-stroked(v-show="years >= 3")
							|${{ cost.normal | formatCurrency }}
						.data-value
							|${{ cost.realR | formatCurrency }}
						.data-footer
							|{{ $t('us-dollars') }}
		v-row.mt-3(v-if="show_coupon==0")
			v-spacer
			v-col.pb-0.text-center(md="4",cols="8")
				v-btn(text color="primary", @click="show_coupon=1")
					v-icon(left)
						|mdi-plus
					|{{$t('coupon-add')}}				
			v-spacer
		v-row.mt-3(v-else-if="show_coupon==1")
			v-spacer
			v-col.pb-0.text-center(md="4",cols="8")
				v-text-field(label="Coupon", outlined, v-model="coupon")
				v-btn(color="primary", @click="verifyCoupon")
					|{{$t('buttom-add')}}
				v-btn.ml-1(color="error" @click="show_coupon=0")
					|{{$t('buttom-close')}}
			v-spacer
		v-row.mt-3.coupon(v-else-if="show_coupon==2")
			v-spacer
			v-col.pb-0.text-center(md="4",cols="8")
				p.code-active
					|{{coupon}}
				p.code-text
					|{{$t('coupon-accept')}}
			v-spacer
</template>

<script>
	export default {
		props: ["value", "minYears", "minStorage"],
		data() {
			return {
				storage: this.value.storage,
				years: this.value.years,
				show_coupon:0,
				couponDesc:0,
				coupon:""
			}
		},
		methods: {
			verifyCoupon:function(){
				let url = this.baseApi + this.env + "user/verify-code"
				let body = {coupon: this.coupon}
				this.axios.post(url, body)
				.then(result => {					
					this.show_coupon = 2
					this.couponDesc = parseInt(result.data.discount)
					this.update()
				})
				.catch( err => console.log("This email is already registered."))
			},
			update: function() {
				let today = new Date()
				let endDate = new Date(today.setFullYear(today.getFullYear() + Number(this.years)))

				let emitter = {
					cost: this.cost.realR,
					discount: this.cost.normalR,
					endDate: endDate,
					storage: this.storage,
					years: this.years,
					yearsText: this.$options.filters.yearsText( this.years ) + " " + this.yearsTranslatedText,
					storageText: this.$options.filters.storageText( this.storage ),
					coupon: this.coupon
				}
				emitter.name = `${emitter.yearsText} - ${emitter.storageText}`

				this.$emit("input", emitter)

			}
		},
		mounted(){
			this.update()
		},
		activated(){
			this.update()
		},
		filters: {
			yearsText: function( value ) {
				if( value == 1 )
					return `${value}`
				else
					return `${value}`
			},
			storageText: function( value ) {
				return `${value} GB`
			},
			formatCurrency: function( value ) {
				return parseFloat(value).toFixed(2).replace('.', '.').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			},
		},
		computed: {
			yearsTranslatedText: function(){
				return Number(this.years) == 1 ? this.$t('year') : this.$t('years')
			},
			cost: function() {

				let pricePerYear = 29.99, discountPercentage = 0

				let storageCost = this.storage * 1.4995

				/*	Calculo del porcentaje de descuento 	*/
				if( this.years >= 3 && this.years < 5)
					discountPercentage = 0.05
				else if( this.years >= 5 && this.years < 10)
					discountPercentage = 0.07
				else if( this.years >= 10 )
					discountPercentage = 0.1

				let normalPrice = this.years * storageCost				
				let realPrice = normalPrice - normalPrice * discountPercentage 
				if(this.couponDesc!=0)
					realPrice=normalPrice-((normalPrice*this.couponDesc)/100)

				/* 	Redondeo 	*/
				let normalPriceR = Math.round(normalPrice) * 10
				let realPriceR = Math.round(realPrice) - 0.01
				
				return {realR: realPriceR, normalR: normalPriceR, real: realPrice, normal: normalPrice}
			}
		}
	}
</script>

<style lang="sass">
	.plan-customizer
		.variable-block
			padding-top: 35px
			padding-bottom: 35px
			padding-left: 25px
			padding-right: 25px
			margin-left: -4px
			margin-right: -4px
			background-color: white
			.variable-title
				font-family: Raleway
				font-weight: 700
				text-align: center
				text-transform: uppercase
				font-size: 1.1rem
			.variable-quantity
				font-family: Raleway
				font-weight: 700
				text-align: center
				color: #25a8e0
				text-transform: uppercase
				font-size: 1rem
				margin-top: 10px
				margin-bottom: 10px
			&:nth-child(2)
				background-color: #ebebeb

		.plan-info
			.data-block
				padding-top: 40px
				padding-bottom: 40px
				padding-left: 15px
				padding-right: 15px
				height: 200px
				position: relative
				.data-inner-block
					position: relative
					top: 50%
					transform: translateY(-50%)
					.data-title
						font-size: 1rem
						font-family: Raleway
						text-transform: uppercase
						text-align: center
						font-weight: 700
					.data-value
						font-size: 2rem
						font-family: Raleway
						text-transform: uppercase
						text-align: center
						font-weight: 800
					.data-value-stroked
						font-size: 1.2rem
						font-family: Raleway
						text-transform: uppercase
						text-align: center
						font-weight: 500
						text-decoration: line-through
					.data-footer
						position: absolute
						bottom: -25px
						left: 0
						right: 0
						margin-left: auto
						margin-right: auto
						font-size: 0.8rem
						color: #777
						text-align: center
						text-transform: uppercase
						font-family: Raleway
						padding-top: 15px

				&.first
					background-color: #e6f6ff
				&.second
					background-color: #f5f5f5
				&.third
					background-color: #ebebeb


		.v-slider
			.v-slider__track-container
				height: 10px
				.v-slider__track-background,.v-slider__track-fill
					border-radius: 5px
			.v-slider__thumb-container
				.v-slider__thumb
					height: 20px
					width: 20px
					margin-left: -5px
				&:hover
					.v-slider__thumb
						&:before
							margin-left: 4px
							margin-top: 3px
		.coupon
			color: rgb(37, 168, 224)			
			.code-active
				font-size: 2rem
				font-family: Raleway
				text-transform: uppercase
			.code-text
				font-size: 1rem
				font-family: Raleway
</style>