import MEDIA from './data.js'; //the data file import

const APP = {
    audio: new Audio(), //the Audio Element that will play every track
    currentTrack: 0, //the integer representing the index in the MEDIA array
    // tracks: MEDIA.track,
    init: () => {
        //called when DOMContentLoaded is triggered
        APP.addListeners();
        APP.addAudioListeners();
    },
    addListeners: () => {
        //add event listeners for interface elements
        document.getElementById('btnLoad').addEventListener('click', APP.load)
        document.getElementById('btnPlay').addEventListener('click', APP.play)
        document.getElementById('btnPause').addEventListener('click', APP.pause)
        document.getElementById('btnNext').addEventListener('click', APP.next)
        document.getElementById('btnPrev').addEventListener('click', APP.prev)
        document.querySelector('.progress').addEventListener('click', APP.seek)

        window.addEventListener('visibilitychange', function(){
            if(document.visibilityState === 'visible'){
                //entering page
                if(APP.wasPlaying){
                    APP.play();
                }
            }else{
                //leaving page
                APP.wasPlaying = !APP.audio.paused;
                APP.pause(); 
            }
        });
    },
    addAudioListeners: () => {
        //add event listeners for APP.audio
        // APP.audio.addEventListener('error', APP.audioError)
        // APP.audio.addEventListener('ended', APP.ended)
        // APP.audio.addEventListener('loadStart', APP.loadStart)
        // APP.audio.addEventListener('loadedMetaData', APP.loadedMetaData)
        // APP.audio.addEventListener('canPlay', APP.canPlay)
        APP.audio.addEventListener('durationchange', APP.durationchange)
        APP.audio.addEventListener('timeupdate', APP.timeupdate)
        APP.audio.addEventListener('play', APP.play)
        APP.audio.addEventListener('pause', APP.pause)
    },
    load: (andPlay = false)=> {
        APP.audio.src= `${MEDIA[APP.currentTrack].track}`;
        console.log('audio has been loaded', APP.audio.src);
        andPlay && !(andPlay instanceof Event) && APP.play();
    },
    play: () => {
        //start the track loaded into APP.audio playing
        if(APP.audio.src){
            APP.audio.play(); 
        }else{
            console.warn('you need to load a track first');
        }
    },
    pause: () => {
        //pause the track loaded into APP.audio playing
        APP.audio && APP.audio.pause();
    },
    next: () =>{
        APP.audio.pause();
        APP.currentTrack ++;
        if(APP.currentTrack >= MEDIA.length) APP.currentTrack = 0; 
        APP.load(true);
    },
    prev: () =>{
        APP.audio.pause();
        APP.currentTrack --;
        if(APP.currentTrack <= MEDIA.length) APP.currentTrack = 0; 
        APP.load(true);
    },
    ended: () =>{
        APP.next();
    },
    buildPlaylist: () => {
        //read the contents of MEDIA and create the playlist
    },
    loadCurrentTrack: () => {
        //use the currentTrack value to set the src of the APP.audio element
    },
    convertTimeDisplay: (seconds) => {
        //convert the seconds parameter to `00:00` style display
    },
    durationchange: (ev) =>{
        document.getElementById('total-time').textContent = APP.audio.duration; 
    },
    timeupdate: (ev) =>{
        document.getElementById('current-time').textContent = APP.audio.currentTime;
        APP.showPct ();
    },
    showPct: () =>{
        let pct = APP.audio.currentTime / APP.audio.duration;
        let pctTxt = (pct * 100).toFixed(2);
        document.getElementById('pctPlay').textContent = `${pctTxt}%`; 
        let w = parseInt(document.querySelector('.progress').clientWidth);
        document.querySelector('.progress .played').getElementsByClassName.width = `${pct * w}px`;
    },
    seek: () =>{ //Continue with yt video at 34min if there is time)

    },
};

document.addEventListener('DOMContentLoaded', APP.init);

/*
TODO: 
Load specific tracks when clicked
Load Image of specific track
Play/Pause button switch back n forth
Change time to 00:00 format
*/
