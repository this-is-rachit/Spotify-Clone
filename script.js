let currentSong = new Audio();
let songs = [];
let currfolder;

function convertSeconds(seconds) {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="Images/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Various Artists</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>     
            <img class="invert" src="Images/play.svg" alt="">
        </div>
         </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play()
        play.src = "Images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`/Songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer= document.querySelector(".cardContainer")
    let array= Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];         
        if(e.href.includes("/Songs") && !e.href.includes(".htaccess")){
            let folder= e.href.split("/").slice(-2)[0]
            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <img width="30px" height="30px" src="Play Button.png" alt="">
            </div>
            <img src="Songs/${folder}/cover.jpg" alt="">
            <h3 style="font-weight: lighter;">${response.title}</h3>
            <p style="font-family: monospace;">${response.description}</p>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
           await getSongs(`Songs/${item.currentTarget.dataset.folder}/`)
           playMusic(songs[0])
        })
    })
}

async function main() {
    await getSongs("Songs/Bhajan")
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Images/pause.svg"
        } else {
            currentSong.pause()
            play.src = "Images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)}/${convertSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Reference buttons by ID
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");

    previousButton.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        console.log(songs)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log("Current index: ", index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        } else {
            console.log("No previous song available");
        }
    })

    nextButton.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log("Current index: ", index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        } else {
            console.log("No next song available");
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

   

}

main()
