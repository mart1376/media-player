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
    UI: () => {
        APP.updateUI();
        APP.playPauseUI();
    },
    addListeners: () => {
        document.getElementById('track__item').addEventListener('click', APP.load);
        document.getElementById('btnNext').addEventListener('click', APP.next);
        document.getElementById('btnPrev').addEventListener('click', APP.prev);
        document.querySelector('.progress').addEventListener('click', APP.seek);
        document.getElementById('playPause').addEventListener('click', APP.playPause);
        document.getElementById('btnShuffle').addEventListener('click', APP.shuffle);
    },
    addAudioListeners: () => {
        APP.audio.addEventListener('error', APP.audioError);
        APP.audio.addEventListener('durationchange', APP.durationchange)
        APP.audio.addEventListener('timeupdate', () => {
            APP.timeupdate();
            APP.playAnimations();
        })

        APP.audio.addEventListener('play', APP.play)
        APP.audio.addEventListener('pause', APP.pause)
        APP.audio.addEventListener('ended', APP.next)
    },
    load: (andPlay = false) => {
        APP.audio.src = `./media/${MEDIA[APP.currentTrack].track}`;
        console.log('audio has been loaded', APP.audio.src);
        // andPlay && !(andPlay instanceof Event);
        APP.loadAlbumCover();
        // APP.play();

        if (andPlay) {
            document.addEventListener('click', function playAudio() {
                APP.play();
                document.removeEventListener('click', playAudio);
            });
        }

    },
    loadAlbumCover: () => {
        const albumCover = document.querySelector('.album_art__full img');
        albumCover.src = `./img/${MEDIA[APP.currentTrack].large}`;
        albumCover.classList.remove('animate');
        void albumCover.offsetWidth;
        albumCover.classList.add('animate');
    },
    duration: () => {
        //TODO: first track duration not correct
        MEDIA.forEach((track) => {
            let tempAudio = new Audio(`./media/${track.track}`);
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
        APP.updateUI();
    },
    pause: () => {
        APP.audio && APP.audio.pause();
        APP.updateUI();
    },
    playPause: () => {
        if (APP.audio.paused) {
            APP.audio.play();
            playPause.innerHTML = `<button id="btnPause" title="play | pause"><i class="material-symbols-rounded ms-controls">pause</i></button>`;
        } else {
            APP.audio.pause();
            playPause.innerHTML = `<button id="btnPlay" title="play | pause"><i class="material-symbols-rounded ms-controls">play_arrow</i></button>`;
        }
        APP.updateUI();
    },
    playPauseUI: () => {
        if (APP.audio.play) {
            playPause.innerHTML = `<button id="btnPause" title="play | pause"><i class="material-symbols-rounded ms-controls">pause</i></button>`;
        } else {
            playPause.innerHTML = `<button id="btnPlay" title="play | pause"><i class="material-symbols-rounded ms-controls">play_arrow</i></button>`;
        }
    },
    playAnimations: () => { //TODO:
        //Header icons 
        const icons = document.querySelectorAll('h1 i');
        icons.forEach(icon => {
            if (!APP.audio.paused) {
                icon.classList.add("jump");
            } else {
                icon.classList.remove("jump");
            }
        });
        //Animation 
        // const albumCover = document.querySelector('.album_art__full img');
        // albumCover.classList.add('jump');
        // APP.addAudioListeners();
    },
    next: () => {
        APP.audio.pause();
        APP.currentTrack++;
        if (APP.currentTrack >= MEDIA.length) APP.currentTrack = 0;
        APP.load();
        APP.play();
        // APP.updateUI();
        // APP.playPauseUI();
        APP.UI();
    },
    prev: () => {
        APP.audio.pause();
        APP.currentTrack--;
        if (APP.currentTrack < 0) APP.currentTrack = 0;
        APP.load();
        APP.play();
        // APP.updateUI();
        // APP.playPauseUI();
        APP.UI();
    },
    shuffle: () => {
        for (let i = MEDIA.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = MEDIA[i];
            MEDIA[i] = MEDIA[j];
            MEDIA[j] = temp;
        }
        APP.currentTrack = 0;
        APP.init();
        // APP.shuffleToggle();
        APP.updateUI();
        APP.playPauseUI();
    },
    // shuffleToggle: () => {
    //     const btnShuffle = document.getElementById('btnShuffle');
    //     if (MEDIA.some(track => track !== MEDIA[APP.currentTrack])) {
    //         btnShuffle.classList.add('active');
    //     } else {
    //         btnShuffle.classList.remove('active');
    //     }
    // },
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
                APP.playPauseUI();
            });
        });
    },
    updateUI: () => {
        const trackItems = document.querySelectorAll('.track__item');
        trackItems.forEach((item, track) => {
            if (track === APP.currentTrack) {
                item.classList.add('current-track');
            } else {
                item.classList.remove('current-track');
            }
        });
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
        let w = parseInt(document.querySelector('.progress').clientWidth);
        document.querySelector('.progress .played').style.width = `${pct * w}px`;
    },
    seek: (ev) => {
        const progressBar = document.querySelector('.progress');
        const duration = APP.audio.duration;
        const clickPosition = ev.x;
        const percentage = clickPosition / progressBar.offsetWidth;
        APP.audio.currentTime = duration * percentage;
        progressBar.value = percentage / 100;
    },
};

document.addEventListener('DOMContentLoaded', APP.init);


