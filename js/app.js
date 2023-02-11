import MEDIA from './data.js'; 

const APP = {
    audio: new Audio(), 
    currentTrack: 0, 
    init: () => {
        APP.addListeners();
        APP.addAudioListeners();
        APP.load();
        APP.buildPlaylist();
    },
    addListeners: () => {
        document.getElementById('track__item').addEventListener('click', APP.load)
        document.getElementById('btnPlay').addEventListener('click', APP.play)
        document.getElementById('btnPause').addEventListener('click', APP.pause)
        document.getElementById('btnNext').addEventListener('click', APP.next)
        document.getElementById('btnPrev').addEventListener('click', APP.prev)
        document.querySelector('.progress').addEventListener('click', APP.seek)
        // document.getElementById('playPause').addEventListener('click', APP.playPause)

        window.addEventListener('visibilitychange', function(){
            if(document.visibilityState === 'visible'){
                if(APP.wasPlaying){
                    APP.play();
                }
            }else{
                APP.wasPlaying = !APP.audio.paused;
                APP.pause(); 
            }
        });
    },
    addAudioListeners: () => {
        APP.audio.addEventListener('error', APP.audioError);
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
        if(APP.audio.src){
            APP.audio.play(); 
        }else{
            console.warn('you need to load a track first');
        }
    },
    pause: () => {
        APP.audio && APP.audio.pause();
    },
    playPause:() =>{
        const playPause = document.getElementById('playPause').addEventListener('click', APP.playPause);
        let isPlaying = false;
            if(isPlaying){
                playPause.innerHTML = `<button id="playPause" title="play | pause"><i class="material-symbols-rounded ms-controls">play_arrow</i></button>`;
                isPlaying = false;
            }else {
                playPause.innerHTML = `<button id="playPause" title="play | pause"><i class="material-symbols-rounded ms-controls">pause</i></button>`;
                isPlaying = true;
            }
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
        if(APP.currentTrack < 0) APP.currentTrack = 0; 
        APP.load(true);
    },
    ended: () =>{
        APP.next();
    },
    buildPlaylist: () => {
        const albumCover = document.querySelector('.album_art__full img');
        playlist.innerHTML = MEDIA.map(song => {
            return `
            <li class="track__item id="track__item">
                <div class="track__thumb">
                    <img src="${song.thumbnail}" alt="" />
                </div>
                <div class="track__details">
                    <p class="track__title">${song.title}</p>
                    <p class="track__artist">${song.artist}</p>
                </div>
                <div class="track__time">
                    <time datetime="">${song.time}</time>
                </div>
            </li>`
        }).join(' ');
        //Album cover
        albumCover.src=`${MEDIA[APP.currentTrack].large}`;
        //Selected song css
        const trackIndicator = document.querySelector('.playlist li');
        MEDIA.map(() => {
            if (MEDIA[APP.currentTrack]) {
                trackIndicator.classList.add('current-track');
            }
        });
        APP.loadCurrentTrack();

    },
    loadCurrentTrack: () => {
        document.querySelector('li').addEventListener('click', APP.load(MEDIA[APP.currentTrack].track));
    },
    convertTimeDisplay: (seconds) => {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = (seconds % 60).toFixed(0);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }
        return minutes + ":" + remainingSeconds;
    },
    durationchange: (ev) =>{
        document.getElementById('total-time').textContent = APP.convertTimeDisplay(APP.audio.duration); 
    },
    timeupdate: (ev) =>{
        document.getElementById('current-time').textContent = APP.convertTimeDisplay(APP.audio.currentTime);
        APP.showPct ();
    },
    audioError: () => {
        
    },
    showPct: () =>{
        let pct = APP.audio.currentTime / APP.audio.duration;
        let pctTxt = (pct * 100).toFixed(2);
        document.getElementById('pctPlay').textContent = `${pctTxt}%`; 
        let w = parseInt(document.querySelector('.progress').clientWidth);
        document.querySelector('.progress .played').getElementsByClassName.width = `${pct * w}px`;
    },
    seek: () =>{
    },
};

document.addEventListener('DOMContentLoaded', APP.init);
