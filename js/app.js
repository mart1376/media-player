import MEDIA from './data.js';

const APP = {
    audio: new Audio(),
    currentTrack: 0,
    init: () => {
        APP.load();
        APP.addListeners();
        APP.addAudioListeners();
        APP.buildPlaylist();
        APP.selectedTrack();
    },
    addListeners: () => {
        document.getElementById('track__item').addEventListener('click', APP.load);
        document.getElementById('btnNext').addEventListener('click', APP.next);
        document.getElementById('btnPrev').addEventListener('click', APP.prev);
        document.querySelector('.progress').addEventListener('click', APP.seek);
        document.getElementById('playPause').addEventListener('click', APP.playPause);
        document.querySelector('.progress').addEventListener('click', APP.seek);

        window.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                if (APP.wasPlaying) {
                    APP.play();
                }
            } else {
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
        APP.audio.addEventListener('ended', APP.next)
    },
    load: (andPlay = false) => {
        APP.audio.src = `./media/${MEDIA[APP.currentTrack].track}`;
        console.log('audio has been loaded', APP.audio.src);
        andPlay && !(andPlay instanceof Event);
        //Album cover load
        const albumCover = document.querySelector('.album_art__full img');
        albumCover.src = `./img/${MEDIA[APP.currentTrack].large}`;
        andPlay && !(andPlay instanceof Event);
    },
    duration: () => { //TODO:
        MEDIA.forEach((track) => {
            let tempAudio = new Audio(`./media/${MEDIA[APP.currentTrack++].track}`);
            tempAudio.addEventListener('durationchange', (ev) => {
                let duration = ev.target.duration;
                track['duration'] = duration;
                let thumbnails = document.querySelectorAll('.track__item img');
                thumbnails.forEach((thumb, index) => {
                    if (thumb.src.includes(track.thumbnail)) {
                        let timeString = APP.convertTimeDisplay(duration);
                        thumb.closest('.track__item').querySelector('time').textContent = timeString;
                    }
                })
            })
        });
    },
    play: () => {
        if (APP.audio.src) {
            APP.audio.play();
        } else {
            console.warn('you need to load a track first');
        }

    },
    pause: () => {
        APP.audio && APP.audio.pause();
    },
    playPause: () => {
        if (APP.audio.paused) {
            APP.audio.play();
            playPause.innerHTML = `<button id="btnPause" title="play | pause"><i class="material-symbols-rounded ms-controls">pause</i></button>`;
        } else {
            APP.audio.pause();
            playPause.innerHTML = `<button id="btnPlay" title="play | pause"><i class="material-symbols-rounded ms-controls">play_arrow</i></button>`;
        }
    },
    next: () => {
        APP.audio.pause();
        APP.currentTrack++;
        if (APP.currentTrack >= MEDIA.length) APP.currentTrack = 0;
        APP.load(true);
        APP.updateUI();
    },
    prev: () => {
        APP.audio.pause();
        APP.currentTrack--;
        if (APP.currentTrack < 0) APP.currentTrack = 0;
        APP.load(true);
        APP.updateUI();
    },
    ended: () => {
        APP.next();
    },
    buildPlaylist: () => {
        playlist.innerHTML = MEDIA.map(song => {
            return `
            <li class="track__item" id="track__item">
                <div class="track__thumb">
                    <img src="./img/${song.thumbnail}" alt="" />
                </div>
                <div class="track__details">
                    <p class="track__title">${song.title}</p>
                    <p class="track__artist">${song.artist}</p>
                </div>
                <div class="track__time" id="track__time">
                    <time datetime=""></time>
                </div>
            </li>`
        }).join(' ');
        APP.duration();
    },
    selectedTrack: () => {
        const trackItems = document.querySelectorAll('.track__item');
        trackItems.forEach((item) => {
            item.addEventListener('click', () => {
                const index = Array.from(trackItems).indexOf(item);
                APP.currentTrack = index;
                APP.load(true);
                APP.updateUI();
            });
        });
    },
    updateUI: () => {
        const trackItems = document.querySelectorAll('.track__item');
        trackItems.forEach((item, index) => {
            if (index === APP.currentTrack) {
                item.classList.add('current-track');
            } else {
                item.classList.remove('current-track');
            }
        });
        APP.playPause();
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
    durationchange: (ev) => {
        document.getElementById('total-time').textContent = APP.convertTimeDisplay(APP.audio.duration);
    },
    timeupdate: (ev) => {
        document.getElementById('current-time').textContent = APP.convertTimeDisplay(APP.audio.currentTime);
        APP.showPct();
    },
    audioError: () => {
    },
    showPct: () => {
        let pct = APP.audio.currentTime / APP.audio.duration;
        let pctTxt = (pct * 100).toFixed(2);
        document.getElementById('pctPlay').textContent = `${pctTxt}%`;
        let w = parseInt(document.querySelector('.progress').clientWidth);
        document.querySelector('.progress .played').getElementsByClassName.width = `${pct * w}px`;
    },
    seek: () => {
    },
};

document.addEventListener('DOMContentLoaded', APP.init);


