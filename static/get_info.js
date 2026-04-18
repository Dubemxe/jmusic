async function getSpotifyToken(){

const response = await fetch(
"https://jmusic-backend.onrender.com/spotify-token"
);

const data = await response.json();

return data.token;

}

function changeUrl(url) {
                window.location.href = url;
                }


const selectedArtists = [];

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("add-btn")) return;

    const btn = e.target;
    const card = btn.closest(".artist-card");
    const artistName = card.dataset.artist;

    if(btn.classList.contains("selected")){

        // REMOVE selection
        btn.classList.remove("selected");
        btn.innerHTML = "+";

        const index = selectedArtists.indexOf(artistName);
        if(index > -1){
            selectedArtists.splice(index,1);
        }

    }else{

        // ADD selection
        btn.classList.add("selected");
        btn.innerHTML = "✓";

        selectedArtists.push(artistName);

    }

    console.log("Selected artists:", selectedArtists);

});
async function getTrackIdsByArtist(artistName){

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

if(!searchData.artists.items.length){
return [];
}

const artistId = searchData.artists.items[0].id;

const topTracksResponse = await fetch(
`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
{
headers:{
Authorization:`Bearer ${token}`
}
});

const topTracksData = await topTracksResponse.json();

let trackIds = topTracksData.tracks.map(track=>track.id);

trackIds = trackIds.slice(0,5);

return trackIds;

}catch(error){

console.error("Error fetching tracks:",error);

return [];

}

}

async function myTop5(artistNames) {

    let allTrackIds = [];

    for (const artist of artistNames) {
        const trackIds = await getTrackIdsByArtist(artist);

        allTrackIds = allTrackIds.concat(trackIds);
    }

    allTrackIds.sort(() => 0.5 - Math.random());

    const encodedTrackIds = encodeURIComponent(allTrackIds.join(','));

    window.location.href = `mysearchpage.html#trackIds=${encodedTrackIds}`;
}

function toSearchpage() {

    if (selectedArtists.length > 0) {
        myTop5(selectedArtists);
    } else {
        alert("Select at least one artist");
    }

}


// get info function
async function getArtistInfo(artistName){

try{

const token = await getSpotifyToken();

const response = await fetch(
`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await response.json();

const artist = data.artists.items[0];

if(!artist){
return {artistInfoHTML:"<div>Artist not available</div>"};
}

const artistInfoHTML = `
<div>

<div class="image-wrapper">
<img src="${artist.images[0]?.url || ''}" class="artist_image">
<div class="add-btn">+</div>
</div>

<h2 class="name">${artist.name}</h2>

<div class="artist-stats">
<p class="followers">${fmtCount(artist.followers.total)} Followers</p>
<p class="rating">${artist.popularity}% Spotify Rating</p>
</div>

</div>
`;

return {artistInfoHTML};

}catch(error){

console.error("Artist fetch error:",error);

return {artistInfoHTML:"<div>Error loading artist</div>"};

}

}
function fmtCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (count >= 1000) {
        return Math.floor(count / 1000) + 'K';
    } else {
        return count.toString();
    }
}
function openFullPlayer(){

if(window.innerWidth <= 768){

// mobile → fullscreen
fullPlayer.classList.add("show")

}else{

// desktop → split
document.querySelector(".container").classList.add("split")
fullPlayer.classList.add("show")

}

}
function closeFullPlayer(){

if(window.innerWidth <= 768){

fullPlayer.classList.remove("show")

}else{

document.querySelector(".container").classList.remove("split")
fullPlayer.classList.remove("show")

}

}
const miniPlayer = document.getElementById("miniPlayer")

function playTrack(track){

loadPlayer(track)
playAudio(track.preview_url)

if(window.innerWidth <= 768){

miniPlayer.classList.add("show")

document.getElementById("miniArt").src =
track.album.images[0].url

document.getElementById("miniTitle").textContent =
track.name

document.getElementById("miniArtist").textContent =
track.artists.map(a=>a.name).join(", ")

}else{

openFullPlayer()

}

}
miniPlayer.addEventListener("click",()=>{

openFullPlayer()

})
async function loadHeroSlideshow(){

try{

const token = await getSpotifyToken();

const artistsList = [
"Drake","Burna Boy","Travis Scott",
"Rihanna","Wizkid","Future","Tems"
];

const randomArtist =
artistsList[Math.floor(Math.random() * artistsList.length)];

const response = await fetch(
`https://api.spotify.com/v1/search?q=${encodeURIComponent(randomArtist)}&type=artist&limit=5`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = await response.json();

const artists = data.artists.items;

if(!artists || artists.length === 0){
console.log("No artists found for slideshow");
return;
}

// 
createSlides(artists);

}catch(err){
console.error("Slideshow error:", err);
}

}

function createSlides(artists){

const slideshow = document.getElementById("slideshow");

if(!slideshow) return;

slideshow.innerHTML = "";

artists.forEach((artist, index)=>{

if(!artist.images || artist.images.length === 0) return;

const img = document.createElement("img");

img.src = artist.images[0].url;
img.className = "slide";

if(index === 0){
img.classList.add("active");
}

slideshow.appendChild(img);

});

startSlideshow();

}
function startSlideshow(){

const slides = document.querySelectorAll(".slide");

if(slides.length === 0) return;

let currentSlide = 0;

setInterval(()=>{

slides[currentSlide].classList.remove("active");

currentSlide = (currentSlide + 1) % slides.length;

slides[currentSlide].classList.add("active");

},3000);

}
const artistsDir = [
    "Drake",
    "Davido",
    "21 Savage",
    "Burna Boy",
    "Future",
    "Wizkid",
    "Travis Scott",
    "Gunna",
    "Lil Baby",
    "Tems",
    "Metro Boomin",
    "Young thug",
    "Billie Eilish",
    "rihanna",
    "sza"
];

const artistGrid = document.getElementById("artistGrid");

// shuffle artists
const shuffledArtists = artistsDir.sort(() => 0.5 - Math.random());

// num of cards
const numberOfCards = 9;

shuffledArtists.slice(0, numberOfCards).forEach(artistName => {

    const card = document.createElement("div");
      card.classList.add("artist-card");
      card.dataset.artist = artistName;  
      
      card.innerHTML = `
      <div class="artistInfo">Loading...</div>
      `;


    artistGrid.appendChild(card);

    const infoDiv = card.querySelector(".artistInfo");

    getArtistInfo(artistName)
        .then(({ artistInfoHTML, trackIds }) => {
            infoDiv.innerHTML = artistInfoHTML;
        });

});



const panel = document.getElementById("sidePanel");
const openBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closePanel");

openBtn.addEventListener("click", () => {
    panel.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
});
loadHeroSlideshow();
