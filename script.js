const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const volumeBar =
    document.getElementById("volumeBar");

const volumeText =
    document.getElementById("volumeText");

const muteBtn =
    document.getElementById("muteBtn");

const songTitle =
    document.getElementById("songTitle");

const artist =
    document.getElementById("artist");

const statusText =
    document.getElementById("statusText");

const playlist =
    document.getElementById("playlist");

const trackCount =
    document.getElementById("trackCount");

const albumArt =
    document.getElementById("albumArt");


/*
==========================================
PLAYLIST
==========================================

Keep your MP3 files inside:

audio/song1.mp3
audio/song2.mp3
audio/song3.mp3
*/

const songs = [

    {
        title: "Morning Drive",
        artist: "NEXORA Sounds",
        file: "audio/song1.mp3"
    },

    {
        title: "Night Lights",
        artist: "NEXORA Sounds",
        file: "audio/song2.mp3"
    },

    {
        title: "Future Waves",
        artist: "NEXORA Sounds",
        file: "audio/song3.mp3"
    }

];


let currentIndex = 0;


/*
==========================================
LOAD SONG
==========================================
*/

function loadSong(index) {

    if (songs.length === 0) {
        return;
    }

    currentIndex =
        (index + songs.length) %
        songs.length;

    const song =
        songs[currentIndex];

    audio.src = song.file;

    songTitle.textContent =
        song.title;

    artist.textContent =
        song.artist;

    currentTime.textContent =
        "0:00";

    duration.textContent =
        "0:00";

    progressBar.value = 0;

    statusText.textContent =
        "READY TO PLAY";

    updatePlaylist();
}


/*
==========================================
PLAY
==========================================
*/

async function playSong() {

    try {

        await audio.play();

        playBtn.textContent =
            "❚❚";

        statusText.textContent =
            "NOW PLAYING";

        albumArt.classList.add(
            "playing"
        );

    }

    catch (error) {

        console.error(error);

        statusText.textContent =
            "AUDIO FILE NOT FOUND";

        playBtn.textContent =
            "▶";

        albumArt.classList.remove(
            "playing"
        );

    }

}


/*
==========================================
PAUSE
==========================================
*/

function pauseSong() {

    audio.pause();

    playBtn.textContent =
        "▶";

    statusText.textContent =
        "PAUSED";

    albumArt.classList.remove(
        "playing"
    );

}


/*
==========================================
PLAY / PAUSE
==========================================
*/

playBtn.addEventListener(
    "click",
    () => {

        if (audio.paused) {

            playSong();

        } else {

            pauseSong();

        }

    }
);


/*
==========================================
NEXT SONG
==========================================
*/

function nextSong() {

    currentIndex++;

    if (
        currentIndex >=
        songs.length
    ) {

        currentIndex = 0;

    }

    loadSong(currentIndex);

    playSong();

}


nextBtn.addEventListener(
    "click",
    nextSong
);


/*
==========================================
PREVIOUS SONG
==========================================
*/

function previousSong() {

    /*
    If the current song has played
    more than 3 seconds, restart it.
    */

    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }


    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            songs.length - 1;

    }

    loadSong(currentIndex);

    playSong();

}


previousBtn.addEventListener(
    "click",
    previousSong
);


/*
==========================================
TIMEUPDATE EVENT
==========================================
*/

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }


        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressBar.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );


        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/*
==========================================
SEEK
==========================================
*/

progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration) {
            return;
        }


        const newTime =
            (
                progressBar.value /
                100
            ) * audio.duration;


        audio.currentTime =
            newTime;

    }
);


/*
==========================================
ENDED EVENT
==========================================
*/

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


/*
==========================================
LOADED METADATA
==========================================
*/

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/*
==========================================
FORMAT TIME
==========================================
*/

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0")
    );

}


/*
==========================================
VOLUME
==========================================
*/

volumeBar.addEventListener(
    "input",
    () => {

        const value =
            Number(
                volumeBar.value
            );


        audio.volume =
            value;


        volumeText.textContent =
            Math.round(
                value * 100
            ) + "%";


        updateVolumeIcon();

    }
);


/*
==========================================
VOLUME ICON
==========================================
*/

function updateVolumeIcon() {

    if (audio.volume === 0) {

        muteBtn.textContent =
            "🔇";

    }

    else if (
        audio.volume < 0.5
    ) {

        muteBtn.textContent =
            "🔉";

    }

    else {

        muteBtn.textContent =
            "🔊";

    }

}


/*
==========================================
MUTE
==========================================
*/

muteBtn.addEventListener(
    "click",
    () => {

        if (audio.volume > 0) {

            audio.dataset.previousVolume =
                audio.volume;

            audio.volume = 0;

            volumeBar.value = 0;

        }

        else {

            const previous =
                Number(
                    audio.dataset.previousVolume ||
                    0.8
                );

            audio.volume =
                previous;

            volumeBar.value =
                previous;

        }


        volumeText.textContent =
            Math.round(
                audio.volume * 100
            ) + "%";


        updateVolumeIcon();

    }
);


/*
==========================================
RENDER PLAYLIST
==========================================
*/

function renderPlaylist() {

    playlist.innerHTML = "";


    trackCount.textContent =
        songs.length +
        (
            songs.length === 1
                ? " track"
                : " tracks"
        );


    songs.forEach(
        (song, index) => {

            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "track";


            track.dataset.index =
                index;


            const number =
                document.createElement(
                    "div"
                );


            number.className =
                "track-number";


            number.textContent =
                String(
                    index + 1
                ).padStart(2, "0");


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "track-info";


            const title =
                document.createElement(
                    "p"
                );


            title.className =
                "track-title";


            title.textContent =
                song.title;


            const artistName =
                document.createElement(
                    "p"
                );


            artistName.className =
                "track-artist";


            artistName.textContent =
                song.artist;


            info.appendChild(title);

            info.appendChild(
                artistName
            );


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "track-icon";


            icon.textContent =
                "♪";


            track.appendChild(number);

            track.appendChild(info);

            track.appendChild(icon);


            track.addEventListener(
                "click",
                () => {

                    loadSong(index);

                    playSong();

                }
            );


            playlist.appendChild(
                track
            );

        }
    );


    updatePlaylist();

}


/*
==========================================
UPDATE ACTIVE TRACK
==========================================
*/

function updatePlaylist() {

    const tracks =
        document.querySelectorAll(
            ".track"
        );


    tracks.forEach(
        (track, index) => {

            track.classList.toggle(
                "active",
                index === currentIndex
            );

        }
    );

}


/*
==========================================
INITIALIZE
==========================================
*/

audio.volume = 0.8;

loadSong(0);

renderPlaylist();

updateVolumeIcon();
