async function getSpotifyToken(){

const response = await fetch(
"https://jmusic-backend.onrender.com/spotify-token"
);

const data = await response.json();

return data.token;

}
const songList = document.getElementById("songList")
const fullPlayer = document.getElementById("fullPlayer")

const albumArt = document.getElementById("albumArt")
const songTitle = document.getElementById("songTitle")
const songArtist = document.getElementById("songArtist")
const songDuration = document.getElementById("songDuration")
const currentTime = document.getElementById("currentTime")

const playPauseBtn = document.getElementById("playPauseBtn")
const favBtn = document.getElementById("favBtn")
const closeBtn = document.getElementById("closeBtn")

let currentSong = null
let isPlaying = false



// OPEN PLAYER

function openFullPlayer(){

fullPlayer.classList.add("show")

}


// CLOSE PLAYER

function closeFullPlayer(){

fullPlayer.classList.remove("show")

}

closeBtn.addEventListener("click",closeFullPlayer)



// PLAY AUDIO

function playAudio(url){

if(!url){

alert("No preview available")

return

}

if(currentSong){

currentSong.pause()

}

currentSong = new Audio(url)

currentSong.play()

isPlaying = true

playPauseBtn.innerHTML =
'<img src="styles/images/icons8-pause-64.png" class="ppnp">'

}



// PLAY / PAUSE BUTTON

playPauseBtn.addEventListener("click",()=>{

if(!currentSong) return

if(isPlaying){

currentSong.pause()

isPlaying=false

playPauseBtn.innerHTML =
'<img src="styles/images/icons8-play-50.png" class="ppnp">'

}else{

currentSong.play()

isPlaying=true

playPauseBtn.innerHTML =
'<img src="styles/images/icons8-pause-64.png" class="ppnp">'

}

})



// FAVORITE BUTTON

let isFav=false

favBtn.addEventListener("click",()=>{

isFav=!isFav

favBtn.textContent = isFav ? "❤️" : "♡"

})



// TIME FORMAT

function msToTime(duration){

const minutes = Math.floor(duration/60000)

const seconds = ((duration%60000)/1000).toFixed(0)

return minutes+":"+(seconds<10?"0":"")+seconds

}



// LOAD SONG DATA

function loadPlayer(track){

albumArt.innerHTML =
`<img src="${track.album.images[0].url}" class="player-art">`

songTitle.textContent = track.name

songArtist.textContent =
track.artists.map(a=>a.name).join(", ")

songDuration.textContent =
msToTime(track.duration_ms)

}



// RENDER SONGS

function renderSongs(tracks){

songList.innerHTML=""

tracks.forEach((track,index)=>{

const artists =
track.artists.map(a=>a.name).join(", ")

const songHTML = `

<div class="musicInfo">

<img
src="${track.album.images[0].url}"
class="albumImage"

onclick="
loadPlayer(${index});
openFullPlayer();
playAudio('${track.preview_url}')
">

<div class="artistsDets">

<p class="songTitle">${track.name}</p>

<p class="artistName">${artists} · ${track.album.name}</p>

</div>

<p class="duration">
${msToTime(track.duration_ms)}
</p>

</div>

`

songList.innerHTML += songHTML

})

}



// SEARCH SONGS

async function searchSong_onpage(){

try{

const query =
document.getElementById("artistSearchInput")
.value.trim()

if(!query) return

const url =
`https://v1.nocodeapi.com/jmusicdm/spotify/KAIfcEwQNVgCQtXA/search?q=${encodeURIComponent(query)}&type=track`

const res = await fetch(url)

const data = await res.json()

const tracks = data.tracks.items

renderSongs(tracks)

}catch(error){

console.error(error)

}

}



// LOAD FROM HOMEPAGE TRACK IDS

function getTrackIdsFromHash(){

const hash = window.location.hash

const match = hash.match(/trackIds=([^&]*)/)

if(match){

return decodeURIComponent(match[1]).split(",")

}

return []

}



async function loadTracksFromIds(ids){

try{
  const token = await getSpotifyToken();
  
  const searchResponse = await fetch(
  `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
  {
  headers:{
  Authorization:`Bearer ${token}`
  }
  });
  
  const searchData = await searchResponse.json();

renderSongs(searchData.tracks)

}catch(error){

console.error(error)

}

}



// PAGE LOAD

const ids = getTrackIdsFromHash()

if(ids.length>0){

loadTracksFromIds(ids)

}



// ENTER KEY SEARCH

document
.getElementById("artistSearchInput")
.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

searchSong_onpage()

}

})
