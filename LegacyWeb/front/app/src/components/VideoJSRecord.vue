<template lang="pug">
    .video-recorder
        .video-container
            video.video-js.vjs-default-skin(id="myVideo", playsinline)
            loader(position="absolute", background="transparent", v-show="status.saving", image="/assets/icons/loading.svg")
        .record-text(v-show="!status.recording && !status.recorded")
            |{{$t('text-start-record')}}
        .recording-icon(v-show="status.recording")
        //.apple-video-player(v-show="status.recorded")
            video-player.video-player-box(
                ref="videoPlayer",
                :playsinline="true",
                :options="playerOptions")
        .content
            v-row(v-show="file.tmpInfo.name")
                v-col(cols="12")
                    .file-info.mobile
                        .file-info-title
                            |{{$t('text-file-info')}}

                        .data(v-if="file.tmpInfo.type")
                            p(v-show="file.tmpInfo.size")
                                span.data-title
                                    |{{$t('text-file-size')}}:&nbsp;
                                span.data-value
                                    |{{ file.tmpInfo.size | sizeMB }} MB.
            v-row
                v-col(cols="12", md="6", :class="{'pb-0': $vuetify.breakpoint.smAndDown}")
                    v-form(ref="fileInfo")
                        v-card.mb-3.input-card.elevation-0(width="100%")
                            v-card-text
                                .required-dot
                                    |*
                                v-text-field(
                                    v-model="file.title",
                                    :label="$t('input-select-title')",
                                    maxlength="50",
                                    :placeholder="$t('input-select-title-des')",
                                    :rules="form.validations.required",
                                    background-color="white",
                                    required)

                        v-card.mb-3.input-card.elevation-0(width="100%")
                            v-card-text
                                .required-dot
                                    |*
                                v-textarea(
                                    v-model="file.description",
                                    :placeholder="$t('input-select-descrition-des')",
                                    :label="$t('input-select-descrition')",
                                    maxlength="140",
                                    :rules="form.validations.required",
                                    background-color="white",
                                    required)

                        v-card.mb-3.input-card.select-card.elevation-0(width="100%")
                            v-card-text
                                v-select(v-model="file.topic", :label="$t('input-select-topic')", :items="topicsOptions", background-color="white", item-text="name", item-value="_id")
                                .text-right
                                    v-btn(@click="redirectNewTopic", color="#054fbd", text)
                                        |{{$t('buttom-add-topic')}}
                    v-row
                        v-col(cols="12")
                            p.title-send
                                |{{$t('text-sending-file')}}
                            p.subtitle-send
                                |{{$t('text-how-would')}}
                            v-radio-group(v-model="file.relationship.type", :row="$vuetify.breakpoint.mdAndUp", :disabled="!!$route.query.event")
                                v-radio(:label="$t('buttom-send-it')", value="now", color="#60A99E")
                                v-radio(:label="$t('buttom-add-to')", value="event", color="#60A99E", @change="show.calendar = true", @click.native="show.calendar = true")
                                v-radio(:label="$t('buttom-to-be-sent')", value="legacy", color="#60A99E")

                        v-col.pt-0(cols="12", v-show="file.relationship.type == 'legacy'")
                            v-card.mb-3.input-card.elevation-0(width="100%")
                                v-card-text
                                    .required-dot
                                        |*
                                    v-textarea(
                                        v-model="file.relationship.notes",
                                        :label="$t('input-select-title-des')",
                                        :placeholder="$t('input-select-descrition-des')",
                                        background-color="white",
                                        required)
                            v-checkbox.permission-checkbox(v-model="file.relationship.allowLegacy")
                                template(v-slot:label)
                                    div
                                        |{{$t('buttom-alloy-my-legacy')}}
                                        v-tooltip(top)
                                            template(v-slot:activator="{ on }")
                                                v-icon.ml-1(v-on="on")
                                                    |mdi-help-circle
                                            |{{$t('text-this-meand')}}

                v-col(cols="12", md="6", :class="{'pt-0': $vuetify.breakpoint.smAndDown}")
                    v-row
                        v-col.pt-0(cols="12", md="6")
                            v-expansion-panels(flat)
                                v-expansion-panel.contact-group-selector
                                    v-expansion-panel-header
                                        |{{$t('input-select-groups')}}
                                    v-expansion-panel-content
                                        v-card.elevation-0
                                            v-card-text
                                                .contacts-list
                                                    v-checkbox(
                                                        v-model="file.relationship.groups",
                                                        v-for="(group, index) in groups",
                                                        :value="group._id",
                                                        :color="getRowColor( index )",
                                                        :key="group._id")

                                                        template(v-slot:label)
                                                            .contact-info
                                                                .contact-picture(:style="{backgroundImage:'url('+group.pictureURL+')'}")
                                                                .contact-name
                                                                    |{{ group.name }}
                                                .empty-label(v-if="groups.length == 0")
                                                    |{{$t('text-dont-groups')}}
                                            v-card-actions
                                                v-spacer
                                                v-btn(@click="redirectNewGroup", color="#054fbd", text)
                                                    |{{$t('buttom-add-group')}}

                        v-col.pt-0(cols="12", md="6")
                            v-expansion-panels(flat)
                                v-expansion-panel.contact-group-selector
                                    v-expansion-panel-header
                                        |{{$t('input-select-contacts')}}
                                    v-expansion-panel-content
                                        v-card.elevation-0
                                            v-card-text
                                                .contacts-list
                                                    v-checkbox(
                                                        v-model="file.relationship.contacts",
                                                        v-for="(contact, index) in contacts",
                                                        :value="contact._id",
                                                        :color="getRowColor( index )",
                                                        :key="contact._id")

                                                        template(v-slot:label)
                                                            .contact-info
                                                                .contact-picture(:style="{backgroundImage:'url('+contact.pictureURL+')'}")
                                                                .contact-name
                                                                    |{{ contact.name }}
                                                .empty-label(v-if="contacts.length == 0")
                                                    |{{$t('text-dont-contacts')}}
                                            v-card-actions
                                                v-spacer
                                                v-btn(@click="redirectNewContact", color="#054fbd", text)
                                                    |{{$t('buttom-add-contact')}}
                    v-row
                        v-col(cols="12")
                            .file-info
                                .action-buttons
                                    v-btn.mr-1.ml-1.elevation-0(
                                        color="red darken-2",
                                        raised, 
                                        :disabled="!file.tmpInfo.type",
                                        @click="reset")
                                        |{{$t('buttom-delete')}}
                                    v-btn.done-button.mr-1.ml-1.elevation-0(
                                        color="#2963b4",
                                        :disabled="!file.tmpInfo.type",
                                        :loading="status.saving",
                                        raised,
                                        @click="updateFile")
                                        |{{$t('buttom-done')}}
                
            v-row
                v-col(cols="12")
                    v-btn.mobile-done-button.d-block.d-md-none.elevation-0(
                        color="#2963b4",
                        :disabled="!file.tmpInfo.type",
                        :loading="status.saving",
                        block
                        raised,
                        @click="updateFile")
                        |{{$t('buttom-save-video')}}
        .record-video-calendar(v-show="show.calendar")
            .outter-container(:style="fixedWidth")
                .inner-container
                    scheduler(v-model="event", @cancel="show.calendar = false, file.relationship.type = 'now'", @close="show.calendar = false", @update="updateCalendar", from="video", ref="scheduler")
</template>

<script>
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'

    import { videoPlayer } from "vue-video-player"

    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'

    import videojs from 'video.js'
    // eslint-disable-next-line
    import Record from 'videojs-record/dist/videojs.record.js'
    import Scheduler from "@/components/dashboard/elements/Scheduler.vue"
    import Loader from "@/components/misc/Loader.vue"

    export default {
        data() {
            return {
                player: "",
                status: {
                    recording: false,
                    recorded: false,
                    saving: false
                },
                event: {
                    category: "6ea1ecf045fc341311e44ef8",
                },
                show: {
                    calendar: false
                },
                options: {
                    controls: true,
                    autoplay: false,
                    fluid: false,
                    loop: false,
                    height: 600,
                    videoMimeType: "video/webm;codecs=vp8",
                    controlBar: {
                        volumePanel: true
                    },
                    plugins: {
                        // configure videojs-record plugin
                        record: {
                            audio: true,
                            video: true,
                            //debug: true,
                            maxLength: 36000
                        }
                    }
                },
                form: {
                    validations: {
                        required: [
                            v => !!v || 'This field is required',
                        ]
                    }
                },
                playerOptions: {},
                file: {
                    tmpInfo: {
                        name: "",
                        lastModified: null,
                        size: 0,
                        type: null,
                        width: 0,
                        height: 0
                    },
                    relationship: {
                        type: "now", // "event", "legacy",
                        contacts: [],
                        groups: [],
                        eventDate: null,
                        sentDate: null,
                    },
                    title: "",
                    description: "",
                    groups: [],
                    contacts: []
                }
            };
        },
        activated: function(){
            this.preloadEvent()
        },
        mounted() {
            this.preloadEvent()
            /* eslint-disable no-console */
            this.player = videojs('#myVideo', this.options, () => {
            });

            // device is ready
            this.player.on('deviceReady', () => {
                console.log('device is ready!');
                this.player.recordToggle.trigger('click')
            });

            // user clicked the record button and started recording
            this.player.on('startRecord', () => {
                this.status.recording = true
                console.log('started recording!');
            });

            // user completed recording and stream is available
            this.player.on('finishRecord', () => {

                this.status.saving = true
                this.status.recorded = true
                this.status.recording = false

                this.player.record().stopDevice()
                this.player.recordToggle.hide()

                let url = this.baseFS + "upload-media"
                let formData = new FormData()
                formData.append("file", this.player.recordedData)

                this.axios.post(url, formData)
                .then(result => {

                    
                    let file = result.data.file

                    this.file.tmpInfo.name          = file.filename
                    //this.file.tmpInfo.lastModified  = new Date( file.lastModified )
                    this.file.tmpInfo.size          = file.size
                    this.file.tmpInfo.type          = file.mimetype
                    //this.file.tmpInfo.width         = file.width
                    //this.file.tmpInfo.height        = file.width
                    this.file.tmpInfo.tmpPath       = file.path

                })
                .catch( err => {
                    alert(JSON.stringify(err))
                    console.log( err )
                })
                .finally(() => {
                    this.status.saving = false
                })
            });

            // error handling
            this.player.on('error', (element, error) => {
                console.warn(error);
            });

            this.player.on('deviceError', () => {
                console.error('device error:', this.player.deviceErrorCode);
                this.$swal("Webcam and microphone not found", "Be sure to install the proper drivers in your computer.", "error")
            });
        },
        filters: {
            sizeMB: function( value ){
                if( value && typeof value == "number" )
                    return parseFloat(value / 1000000).toFixed(2)
                else return ""
            }
        },
        computed: {
            contacts: function(){
                return this.$store.getters.contacts
            },
            groups: function(){
                return this.$store.getters.groups
            },
            topics: function(){
                return this.$store.getters.topics
            },
            topicsOptions: function(){
                let topics = this.$clone(this.$store.getters.topics)
                topics.unshift({_id: "", name: "No topic"})
                return topics
            },
            fixedWidth: function() {
                if( this.$vuetify.breakpoint.width > 1904 )
                    return { "padding-left": "450px", "padding-right": "450px" }
                else if( this.$vuetify.breakpoint.width <= 1904 && this.$vuetify.breakpoint.width > 1264)
                    return { "padding-left": "150px", "padding-right": "150px" }
                else if( this.$vuetify.breakpoint.width <= 1264 && this.$vuetify.breakpoint.width > 960)
                    return { "padding-left": "15px", "padding-right": "15px" }
                else if( this.$vuetify.breakpoint.width <= 960 && this.$vuetify.breakpoint.width > 600)
                    return { "padding-left": "30px", "padding-right": "30px" }
                else
                    return { "padding-left": "0px", "padding-right": "0px" }

            }
        },
        methods: {
            redirectNewTopic: function(){
				this.$router.push({path: '/dashboard/topics',query: {returnable: "true", from: "upload"}})
			},
            preloadEvent: function() {
                if(this.$route.query.keep){
                    if(this.$route.query.contact)
                        this.file.contacts.push(this.$route.query.contact)
                    if(this.$route.query.event){
                        this.event.name = this.$route.query.eventName
                        this.event.date = new Date(this.$route.query.eventDate)
                        this.event.time = this.$route.query.eventTime

                        //Adjust Date time
                        let hh = this.event.time.split(":")[0]
                        let mm = this.event.time.split(":")[1]

                        this.event.date.setHours(Number( hh ))
                        this.event.date.setMinutes(Number( mm ))

                        this.event.date.setDate( this.event.date.getDate() + 1)

                        this.file.relationship.type = "event"
                    }
                }
            },
            showRecorder: function() {
                if( this.getBrowser() == "safari" ){
                    if( this.status.recorded )
                        return false
                    else
                        return true
                }else
                    return true
            },
            updateFile: function() {
                if( this.$refs.fileInfo.validate() ){
                    if(this.file.relationship.type=="legacy"){
						if((this.file.relationship.allowLegacy==="undefined" || !this.file.relationship.allowLegacy) && this.file.relationship.contacts.length === 0 && this.file.relationship.groups.length === 0){
							this.$swal({
								title: "Error",
								text: "You need to add a contact or allow it to your legacy contacts",
								type: "error",
							})
							return
						}							
					}

                    this.status.saving = true
                    let body = {
                        file: {
                            tmpPath:    this.file.tmpInfo.tmpPath,
                            size:       this.file.tmpInfo.size,
                            name:       this.file.tmpInfo.name,
                            fileType:   this.file.tmpInfo.type,
                            title:      this.file.title,
                            description:this.file.description,
                            relationship: this.file.relationship,
                        }
                    }
                    
                    if( this.event.name && this.event.date ){
                        body.event = this.event
                        body.file.relationship.eventDate = this.event.date
                    }

                    //Send file now
                    if( this.file.relationship.type == "now")
                        body.event = {
                            name: " ",
                            date: new Date(2000, 0, 1),
                            time: "00:00",
                        }

                    if( this.file.topic )
                        body.file.topic = this.file.topic

                    let url = this.baseFS + "upload/file"
                    let fileId
                    
                    this.axios.post(url, body)
                    .then(response => {
                        
                        if( response.data.event )
                            this.$store.commit("addEvent", response.data.event)

                        fileId = response.data.file._id

                        //Replaces Topics id with name
                        response.data.file.topic = this.getTopicById(response.data.file.topic)
                        this.$store.commit("addFile", response.data.file)
                        return this.$swal("Done!", "The video was saved successfully", "success")
                    })
                    .then(() => {
                        this.reset()
                        this.$refs.scheduler.reset()
                        
                        if( this.$route.query.returnable && this.$route.query.keep)
                            this.$router.push({path: '/dashboard/calendar' })
                        else
                            this.$router.push({path: "/dashboard/file-manager"})
                    })
                    .catch( err => {
                        console.log( err )
                    })
                    .finally(() => {
                        this.status.saving = false
                    })
                }
            },
            getContactsByGroupId: function(id){
                let groups = this.$store.getters.groups
                for(let group of groups){
                    if( group._id == id)
                        return group
                }
                return false
            },
            getRowColor: function( i ) {
                let mod = i % 4
                switch( mod ) {
                    case 0:
                        return "#60AB9D"
                    case 1:
                        return "#ab7c6c"
                    case 2:
                        return "#5a68a1"
                    case 3:
                        return "#608bab"
                }
            },
            getRowClass: function( i ) {
                let mod = i % 4
                switch( mod ) {
                    case 0:
                        return {"row-1": true}
                    case 1:
                        return {"row-2": true}
                    case 2:
                        return {"row-3": true}
                    case 3:
                        return {"row-4": true}
                }
            },
            reset: function(){
                this.player.record().reset()
                this.player.recordToggle.enable()
                this.file = {
                    tmpInfo: {
                        name: "",
                        lastModified: null,
                        size: 0,
                        type: null,
                        width: 0,
                        height: 0,
                    },
                    title: "",
                    description: "",
                    groups: [],
                    relationship: {
                        type: "now", // "event", "legacy",
                        contacts: [],
                        eventDate: null,
                        sentDate: null,
                    }
                }

                this.$refs.fileInfo.reset()
            },
            updateCalendar: function(info){

            },
            redirectNewGroup: function() {
                this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newGroup: "true", from: "video"}})
            },
            redirectNewContact: function() {
                this.$router.push({path: '/dashboard/contacts', query: {returnable: "true", newContact: "true", from: "video"}})
            },
            getTopicById: function(id){
                let topics = this.topics
                for(let topic of topics)
                    if( topic._id == id)
                        return [topic]

                return ""
            },
            getBrowser: function() {
                var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

                // Firefox 1.0+
                var isFirefox = typeof InstallTrigger !== 'undefined';

                // Safari 3.0+ "[object HTMLElementConstructor]"
                var isSafari = false
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('safari') != -1) { 
                    if (ua.indexOf('chrome') > -1) {}
                    else {
                        isSafari = true
                    }
                }

                // Internet Explorer 6-11
                var isIE = /*@cc_on!@*/false || !!document.documentMode;

                // Edge 20+
                var isEdge = !isIE && !!window.StyleMedia;

                // Chrome 1 - 79
                var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

                // Edge (based on chromium) detection
                var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

                if( isOpera )
                    return "opera"
                else if( isFirefox )
                    return "firefox"
                else if( isSafari )
                    return "safari"
                else if( isIE )
                    return "ie"
                else if( isEdge )
                    return "edge"
                else if( isChrome )
                    return "chrome"
                else
                    return "edgechromium"

            },
        },
        beforeDestroy() { 
            if(this.player) {
                this.player.dispose();
            }
        },
        components: {
            Scheduler,
            "video-player": videoPlayer,
            Loader
        }
    }
</script>

<style lang="sass">
    .video-recorder
        position: relative
        .video-container
            position: relative
            .video-js.vjs-default-skin
                width: 100%
                .vjs-icon-av-perm
                    &:before
                        content: "\f105" !important
        .apple-video-player
            .video-js
                width: 100%
                height: 600px
        .v-radio
            .v-input--selection-controls__ripple
                margin-left: 7px
        .record-text
            font-family: "Raleway",
            font-size: 18pt
            letter-spacing: 1px
            position: absolute
            top: 330px
            text-align: center
            width: 100%
            z-index: 15
            font-weight: 600
            left: 0
            color: white
        .recording-icon
            padding: 15px
            border-radius: 50%
            position: absolute
            left: 15px
            top: 15px
            animation-name: recording
            animation-duration: 1.5s
            animation-iteration-count: infinite
        .content
            position: relative
            padding: 15px
            background-color: #f2f2f2
            .file-info
                text-align: center
                &.mobile
                    margin-bottom: 15px
                .file-info-title
                    color: black
                    text-align: center
                    font-family: Raleway
                    font-size: 14pt
                    font-weight: 700
                    text-transform: uppercase
                .data
                    margin-top: 15px
                    margin-bottom: 15px
                    p
                        margin-top: 0
                        margin-bottom: 0
                        .data-title
                            font-family: Raleway
                            font-weight: 600
                        .data-value
                            font-family: Raleway
                .action-buttons
                    text-align: center
            .title-send
                font-family: Raleway
                font-size: 20px
                font-weight: 700
                margin-bottom: 0
            .subtitle-send
                font-family: Raleway

            .input-card
                position: relative
                .required-dot
                    position: absolute
                    right: 15px
                    top: 15px
                    color: #032eb1
                    font-size: 20px
                .v-card__text
                    padding-bottom: 5px
                    .v-select__slot
                        label
                            color: #032eb1
                            letter-spacing: 1px
                            text-transform: uppercase
                            font-size: 14px
                            font-family: Raleway
                    .v-text-field
                        .v-input__slot
                            &:before,&:after
                                display: none
                        .v-text-field__slot
                            label
                                text-transform: uppercase
                                letter-spacing: 1px
                                color: #032eb1
                                font-size: 16px
                                font-family: Raleway
                            &:before,&:after
                                display: none

                    .v-textarea
                        .v-input__slot
                            &:before,&:after
                                display: none
                    .v-select
                        .v-input__slot
                            margin-bottom: 0
                            &:before,&:after
                                display: none
            .action-buttons
                .v-btn
                    .v-btn__content
                        font-family: Raleway
                        color: white
                        font-weight: 700
                .done-button
                    .v-btn__loader
                        color: white
            .mobile-done-button
                .v-btn__content
                    font-family: Raleway
                    color: white
                    font-weight: 700
        .record-video-calendar
            position: fixed
            left: 0
            top: 0
            bottom: 0
            right: 0
            padding-top: 9vh
            z-index: 100
            .outter-container
                position: relative
                background-color: rgba(0, 0, 0, 0.4)
                height: 100%
                padding: 50px
                padding-top: 0px
                .inner-container
                    border-radius: 25px
                    top: 50%
                    transform: translateY(-50%)
                    position: relative
        .contact-group-selector
            .v-expansion-panel-content__wrap
                padding: 0px
            .v-expansion-panel-header
                font-family: Raleway
                font-size: 12pt
                font-weight: 700
                letter-spacing: 1px
                text-transform: uppercase
                padding-left: 15px
                margin-bottom: 0
                color: #777
            .v-expansion-panel-content
                .v-card
                    .v-card__text
                        padding-left: 0px
                        padding-right: 0px
            .empty-label
                text-align: center
        .upload-subtitle
            font-family: Raleway
            font-size: 14pt
            font-weight: 700
            letter-spacing: 1px
            text-transform: uppercase
            padding-left: 15px
            margin-bottom: 15px

        .contacts-list
            .v-input--checkbox
                margin-top: 0px
                padding-top: 6px
                padding-bottom: 2px
                padding-left: 25px
                padding-right: 25px
                &:hover
                    background-color: rgba(164, 73, 51, 0.05)
                .v-messages
                    display: none
                .v-input--selection-controls__ripple
                    z-index: 10
                    margin-top: 7px
                    margin-left: 7px
                .contact-info
                    .contact-picture
                        display: inline-block
                        float: left
                        margin-left: 5px
                        margin-right: 15px
                        border-radius: 50%
                        width: 30px
                        height: 30px
                        overflow: hidden
                        background-size: cover
                        background-position: center
                    .contact-name
                        display: inline-block
                        float: left
                        margin-top: 11px
                        font-family: Raleway
                        font-weight: 700

    @media only screen and (max-width: 640px)
        .video-recorder
            .video-container
                .video-js.vjs-default-skin
                    height: calc(100vh - 240px)
                    width: 100%
                    .vjs-icon-av-perm
            .record-text
                top: 20vh
            .record-video-calendar
                padding-top: 56px
                .outter-container
                    padding: 0
                    .inner-container
                        border-radius: 0
                        height: 100%
    @media only screen and (max-width: 480px)
        .video-recorder
            .video-container
            .record-text
                top: 10vh


    @keyframes recording
        0%
            background-color: red
        50%
            background-color: transparent
        100%
            background-color: red
</style>