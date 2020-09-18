import { songsList } from './songs.js';

const Playlist = (_ => {
    const state = {
        currentlyPlayingIndex: null,
        currentSong: null
    };

    let { currentlyPlayingIndex, currentSong } = state;

    const init = _ => {
        renderPlaylist();
        renderPlayInfo();
        listeners();
    };

    const toggleIcon = index => {
        return currentlyPlayingIndex != index? 'fa-play' 
             : currentSong.paused? 'fa-play selected__icon' : 'fa-pause selected__icon';
    };

    const renderPlayInfo = _ => {
        const countEl = document.querySelector('.player__count'),
              buttonEl = document.querySelector('.player__button');

        countEl.textContent = `${songsList.length} Songs`;
        buttonEl.textContent = !currentSong? 'PLAY' 
                             : currentSong && currentSong.paused? 'PLAY' : 'PAUSE';
    };

    const renderPlaylist = _ => {
        const playlistEl = document.querySelector('.player__playlist');
        let html = '';

        songsList.forEach((song, index) => {
            html += `
                <li class="player__item ${currentlyPlayingIndex != index? '' : 'selected__item'}">
                    <section class="item__left">
                        <i class="item__icon fas ${toggleIcon(index)}" id="${index}"></i>
                        <section class="item__details">
                            <p class="item__title">${song.title}</p>
                            <p class="item__artist">${song.artist}</p>
                        </section>
                    </section>
                    <section class="item__right">
                        <p class="item__duration">${song.time}</p>
                    </section>
                </li>
            `;
        });

        playlistEl.innerHTML = html;
    };

    const listeners = _ => {
        const playlistEl = document.querySelector('.player__playlist'),
              buttonEl = document.querySelector('.player__button');
        
        playlistEl.addEventListener('click', event => {
            if(event.target.matches('.item__icon')) {
                let icon = event.target;
                if(currentlyPlayingIndex == icon.id) togglePlayPause();
                else changeAudioSrc(icon.id);
                renderPlayInfo();
                renderPlaylist();
                
            }
        });

        buttonEl.addEventListener('click', event => {
            togglePlayPause();
            renderPlayInfo();
            renderPlaylist();  
        }); 

        currentlyPlayingIndex = 0;
        currentSong = new Audio(songsList[currentlyPlayingIndex].url);

        currentSong.addEventListener('timeupdate', _ => {
            console.log(currentSong.currentTime);
            const progressEl = document.querySelector('.player__bar');
            
            progressEl.style.width = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
        });

        currentSong.addEventListener('ended', _ => {
            currentlyPlayingIndex++;
            changeAudioSrc(currentlyPlayingIndex);
            renderPlayInfo();
            renderPlaylist();
        });
    };


    const togglePlayPause = _ => {
        if(currentSong.paused) currentSong.play();
        else if(!currentSong.paused) currentSong.pause();
    };

    const changeAudioSrc = songId => {
        if(currentlyPlayingIndex >= songsList.length) {
            songId = 0;
            currentlyPlayingIndex = songId;
            currentSong.src = songsList[currentlyPlayingIndex].url;
        } else {
            currentlyPlayingIndex = songId;
            currentSong.src = songsList[currentlyPlayingIndex].url;
            currentSong.play();
        }
    };

    return {
        init
    };
})();

export default Playlist;

