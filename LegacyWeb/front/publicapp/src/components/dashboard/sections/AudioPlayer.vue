<template lang="pug">
	.audio-player
		audio.video-js.vjs-default-skin(id="audioPlayer", playsinline)
</template>

<script>
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'
    import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css'

    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'

    import videojs from 'video.js'
    // eslint-disable-next-line
    import Record from 'videojs-record/dist/videojs.record.js'
    import Loader from "@/components/misc/Loader.vue"

    import WaveSurfer from 'wavesurfer.js'
    import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js'

	export default {
		data() {
			return {
			}
		},
		computed: {
			options: function(){
				let options = {
                    controls: true,
                    autoplay: false,
                    fluid: false,
                    loop: false,
                    height: 300,
                    controlBar: {
                        volumePanel: true
                    },
                    plugins: {
                        wavesurfer: {
                            msDisplayMax: 10,
                            debug: true,
                            waveColor: '#c1d2f7',
                            progressColor: '#1e2c4a',
                            cursorColor: 'white',
                            backgroundColor: "#454a54",
                            hideScrollbar: true,
                        }
                    }
				}
				let encodedURL = (this.$route.query.url || "https://localhost")
				options.plugins.wavesurfer.src = encodedURL

				return options
			}
		},
        mounted() {
            this.player = videojs('#audioPlayer', this.options, () => {
            	console.log( this.options )
                // print version information at startup
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-wavesurfer ' + videojs.getPluginVersion('wavesurfer') +
                    ' and wavesurfer.js ' + WaveSurfer.VERSION;
                videojs.log(msg);
            });

            // device is ready
            this.player.on('deviceReady', () => {
                console.log('device is ready!');
            });

            // user clicked the record button and started recording
            this.player.on('startRecord', () => {
                console.log('started recording!');
            });

            // user completed recording and stream is available
            this.player.on('finishRecord', () => {
            });

            // error handling
            this.player.on('error', (element, error) => {
                console.warn(error);
            });

            this.player.on('deviceError', () => {
                console.error('device error:', this.player.deviceErrorCode);
            });
        },
	}
</script>

<style lang="sass">
	.audio-player
		padding-bottom: 80px
		.video-js
			width: 100%
</style>