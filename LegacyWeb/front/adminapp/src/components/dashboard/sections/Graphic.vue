<template lang="pug">
    .graphic-subpanel
        v-select(:items="coupon",label="Outlined style",outlined,v-model="selection")
        v-btn(depressed,color="primary", @click="slection")
            |Mostrar
        apexchart.mt-10(type="line" height="350" width="50%" :options="chartOptions" :series="series" ref="chart")
</template>

<script>


export default {
    data() {
			return {
                selection: "",                
                series: [{
                    name: " ",
                    data: [0]
                }],
                chartOptions: {
                    chart: {                    
                        type: 'line',
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    title: {
                        text: 'Estadisticas',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: [' ']
                    }
                }
            }
        },
        methods:{
            slection:function(){
                /*result = data
                .filter(({ id }) => ids.includes(id))
                .map(({ name }) => name);*/ 
                let data={
                    coupon:this.selection
                }
                if(this.selection != '')
                {
                    let url = this.baseApi + this.env + "admin/coupon/used"
                    this.axios.post(url, data)
                    .then( response => {
                            let mont =[]
                            let day = []
                        	if(response.data.logCoupon.length != 0){
                                let dato = response.data.logCoupon														
                                let dat1 = new Date(response.data.logCoupon[0].date)
                                let dat2 = new Date(response.data.logCoupon[response.data.logCoupon.length-1].date)                                
                                let dif =dat2.getMonth()-dat1.getMonth()
                                let aux = dat1.getMonth()
                                for(let x=0;x <= dif; x++){
                                    switch(aux){
                                        case 0:
                                            mont.push('Jan')
                                            break;
                                        case 1:
                                            mont.push('Feb')
                                            break;
                                        case 2:
                                            mont.push('Mar')
                                            break;
                                        case 3:
                                            mont.push('Apr')
                                            break;
                                        case 4:
                                            mont.push('May')
                                            break;
                                        case 5:
                                            mont.push('Jun')
                                            break;
                                        case 6:
                                            mont.push('Jul')
                                            break;
                                        case 7:
                                            mont.push('Aug')
                                            break;
                                        case 8:
                                            mont.push('Sep')
                                            break;
                                        case 9:
                                            mont.push('Oct')
                                            break;
                                        case 10:
                                            mont.push('Nov')
                                            break;
                                        case 11:
                                            mont.push('Dec')
                                            break;
                                    }
                                    let axuD=dato.filter(function esSuficientementeGrande(elemento) {
                                            return new Date(elemento.date).getMonth() === aux
                                    })
                                    day.push(axuD.length)
                                    aux++
                                }
                            }
                            else{
                                 mont.push(' ')
                                 day.push(0)
                            }                                              
                            this.series = [{
                                name: this.selection,
                                data: day
                            }]               
                            this.chartOptions={
                                title: {
                                    text: 'Estadisticas de ' + this.selection
                                },
                                xaxis: {
                                    categories: mont 
                                }
                            }
                            
                        })					
                        .catch( err => {
                            console.log( err )
                        })
                        .finally( () => {
                            console.log('termino')
                        })
                }

                /* this.series = [{
                        name: this.selection,
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
                }]               
                this.chartOptions={
                    title: {
                        text: 'Estadisticas de ' + this.selection
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
                    }
                }
                console.log(this.selection)*/
            }
        },
        computed: {
            coupon:function(){
                return this.$store.getters.contacts.map(({ coupon }) => coupon)
            }
        },
  mounted () {    
  }
}
</script>

<style lang="sass">
    .graphic-subpanel
        padding: 15px
        background-color: #f2f2f2
        height: 100%
</style>