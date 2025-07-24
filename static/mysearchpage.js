const fullPlayer = document.getElementById('fullPlayer');
const closeBtn = document.getElementById('closeBtn');
const openBtn = document.getElementById('openPlayerBtn');
const container = document.querySelector('.container');
const openFp = document.getElementById('ofp');


function openFullPlayer() {
  fullPlayer.classList.add('show');
}

function closeFullPlayer() {
  fullPlayer.classList.remove('show');

  const leftSide = document.getElementById('leftside');
  const searchBar = document.getElementById('searchbar');
  const accImg = document.getElementById('accimg');

  searchBar.style.width = "800px";
  leftSide.style.width = "1241px";
  accImg.style.marginLeft = "150px";
  accImg.style.marginRight = "0";
}

function adjustSize() {
  const leftSide = document.getElementById('leftside');
  const searchBar = document.getElementById('searchbar');
  const searchBtn = document.getElementsByClassName('searchBtn')

  searchBar.style.width = "300px";
  leftSide.style.width = "700px";
  searchBtn.style.marginRight = "30px";

}
closeBtn.addEventListener('click', closeFullPlayer);

const songImage = document.getElementById('songImage');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const songDuration = document.getElementById('songDuration');
const currentTime = document.getElementById('currentTime');

const playPauseBtn = document.getElementById('playPauseBtn');
const favBtn = document.getElementById('favBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isPlaying = false;
let isFavorited = false;

// Simulated song object
const sampleSong = {
  title: "Lose Yourself",
  artist: "Eminem",
  duration: "5:26",
  artistImage: "https://i.scdn.co/image/ab67616d0000b273dff7e6223f9a7ff3bce8aa55"
};

// Initialize player
function showPlayer(song) {
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songDuration.textContent = song.duration;
  songImage.src = song.artistImage;
  currentTime.textContent = "1:23"; // Replace with real time tracking

  fullPlayer.classList.remove('hidden');
}

// Controls
playPauseBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playPauseBtn.innerHTML = isPlaying
  ? '<img src="images/icons8-pause-64 (1).png" class="ppnp" alt="Pause">'
  : '<img src="images/icons8-play-50.png" class="ppnp" alt="Play">';
});

favBtn.addEventListener('click', () => {
  isFavorited = !isFavorited;
  favBtn.classList.toggle('active');
  favBtn.textContent = isFavorited ? '❤️' : '♡';
});

closeBtn.addEventListener('click', () => {
  fullPlayer.classList.add('hidden');
});

shuffleBtn.addEventListener('click', () => {
  alert("Shuffle toggled!");
});

prevBtn.addEventListener('click', () => {
  alert("Previous track");
});

nextBtn.addEventListener('click', () => {
  alert("Next track");
});

// Launch player
showPlayer(sampleSong);


// When user clicks the close (X) button
closeBtn.addEventListener('click', () => {
  fullPlayer.style.display = 'none';
  container.classList.add('expanded');
  openBtn.classList.remove('hidden');
});

// When user clicks the "Now Playing" button
openBtn.addEventListener('click', () => {
  fullPlayer.style.display = 'flex';
  container.classList.remove('expanded');
  openBtn.classList.add('hidden');
});


function changeUrl(url) {
  window.location.href = url;
  }
let currentSong = null; //stores the current song being played

function playAudio(url) {
    if (currentSong) {
            currentSong.pause(); // pause the song playing
            //currentSong.currentTime = 0; // resets the song to the start
    }
    currentSong = new Audio(url);
    currentSong.play(); //play the song clicked
}
function getAudio(previewUrl) {
         if (previewUrl) {
                 playAudio(previewUrl);
         } else { console.log("No audio for this track");
         }
}
function pauseAudio() {
    if (currentSong) {
        currentSong.pause(); // Pause the current audio
    }
}
function addFont() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}
addFont();
// Search function to retrieve music data from the spotify api
async function searchSong() {
    try {
        const query = document.getElementById('searchQuery').value.trim();
        if (!query) {
            console.log('Please enter a song title');
           return;
        }
        // Store the query in sessionStorage to use on the results page
        sessionStorage.setItem('searchQuery', query);
        
        // Personal nocodeapi url
        const searchUrl = `https://v1.nocodeapi.com/jmusic07/spotify/MeWPnrNxyFEDFNsQ/search?q=${encodeURIComponent(query)}&type=track`;

        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Failed to search for the song'); 
        }

        const data = await response.json();
         const trackItems = data.tracks.items;

        if (trackItems.length === 0) {
            console.log('No songs found');
            return;
        }
         // Store the search results in sessionStorage
        sessionStorage.setItem('searchResults', JSON.stringify(trackItems));
             // Redirect to the results page
        window.location.href = 'search_results.html';/*
        const songListHTML = trackItems.map((track, index) =>  {
            const artists = track.artists.map(artist => artist.name).join(', ');
            const trackHTML = `
        <div class="musicInfo" onclick="getAudio('${track.preview_url}')">
        <img src="${track.album.images[0].url}" alt="${track.name}" class="albumImage" id="popup_image${index}" onclick="popupDiv(${index})">
        <div id="content_div${index}" class="content_div">
        <div class="img_box">
         <img src="${track.album.images[0].url}" alt="${track.name}" class="pp_img">
        <button class="xbtn" onclick="popupDiv(${index})"><img src="styles/images/icons8-x-50 (1).png" class="xicon"></button>
        </div>
        <p class="p1">${track.name}</p>
        <p class="dp">${artists} </p>
        <p class="dp">Released on ${track.album.release_date}</p>
        <p class="dp1">From the ${track.album.name} Album</p>
        </div>
        <p class="artistName">${artists} </p>
        <p class="songTitle"> - ${track.name}</p>
        <p class="duration">${msToTime(track.duration_ms)}</p>
        ${track.preview_url ? `<p> </p>` : `<p class="noPreview">No Preview Available</p>`}
        </div>
        `;
          return trackHTML;
        }).join('');

        document.getElementById('songList').innerHTML = songListHTML;*/

        } catch (error) {
                console.error('Error searching for the song:', error);
    }
}

async function getTrackIdByArtist(artistName) {
  try {
    // Encode the artist name for use in the URL
    const encodedArtistName = encodeURIComponent(artistName);

    // Construct the search URL for tracks by the artist
    const searchUrl = `https://v1.nocodeapi.com/jmusic07/spotify/MeWPnrNxyFEDFNsQ/search?q=${encodedArtistName}&type=track`;

    // Make a GET request to the search URL with the Spotify API access token
    const response = await fetch(searchUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch tracks by artist');
    }

    // Parse the response JSON
    const data = await response.json();

    // Extract the track IDs from the response
    let trackIds = data.tracks.items.map(item => item.id);

    trackIds = trackIds.slice(0, 5);

    // Return the array of track IDs
    return trackIds;
  } catch (error) {
    console.error('Error fetching track IDs by artist:', error);
     return [];
  }
}

document.getElementById('searchQuery').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
           document.getElementById('sBtn').click();  // Trigger search button click
  }
});

function msToTime(duration) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

async function getSongInform(trackIds) {
try {
        const trackIdsStr = trackIds.join(',');
        const trackInfoUrl = `https://v1.nocodeapi.com/jmusic07/spotify/MeWPnrNxyFEDFNsQ/tracks?ids=${trackIdsStr}`;
        const response = await fetch(trackInfoUrl);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch song info');
        }
  // Parse the response JSON
        const data = await response.json();

    data.tracks.forEach((track, index) => {
        const songHTML = `
         <div class="musicInfo" onclick="getAudio('${track.preview_url}')" class="musicInfo" style="font-family: 'Manrope', sans-serif;">
        <img src="${track.album.images[0].url}" alt="${track.name}" class="albumImage" id="popup_image${index}" onclick="popupDiv(${index})">
        <div class="artistsDets">
        <p class="songTitle" style="font-family: 'Manrope'">${track.name}</p>
        <p class="artistName" style="font-family: 'Manrope'">${track.artists.map(artist => artist.name).join(', ')} . ${track.album.name}</p>
        </div>
        <p class="duration" style="font-family: 'Manrope'">${msToTime(track.duration_ms)}</p> 
        <div id="content_div${index}" class="content_div">
        <div class="img_box">
        <img src="${track.album.images[0].url}" alt="${track.name}" class="pp_img">
        <button class="xbtn" onclick="popupDiv(${index})"><img src="styles/images/icons8-x-50 white.png" class="xicon"></button>
        </div>
        <p class="p1" style="font-family: 'Manrope'">${track.name}</p>
        <p class="dp" style="font-family: 'Manrope'">${track.artists.map(artist => artist.name).join(', ')} </p>
        <p class="dp" style="font-family: 'Manrope'">Released on ${track.album.release_date}</p>
        <p class="dp" style="font-family: 'Manrope'">From the ${track.album.name} Album</p>
        </div>
         ${track.preview_url ? `<p> </p>` : `<p class="noPreview" style="font-family: 'Manrope'">No Audio Available</p>`}
        </div>
        `;
        document.getElementById('songList').innerHTML += songHTML;
    });
   } catch (error) {
        console.error('Error fetching song info:', error);
    }
}

function popupDiv(index) {

  const contentDiv = document.getElementById(`content_div${index}`);

  // Toggle the visibility of the div
  if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
    contentDiv.style.display = 'block'; // Show the div
  } else {
    contentDiv.style.display = 'none'; // Hide the div
  }
}

// Function to extract trackIds from the URL hash
function getTrackIdsFromHash() {
    const hash = window.location.hash;

    // Check if the hash contains the trackIds parameter
    const trackIdsParam = hash.match(/trackIds=([^&]*)/);
    if (trackIdsParam && trackIdsParam[1]) {
        // Decode the track IDs and split them into an array
        return decodeURIComponent(trackIdsParam[1]).split(',');
    }
  return [];
}

// Example: Fetch the track IDs when the page loads
const trackIds = getTrackIdsFromHash();
if (trackIds.length > 0) {
    // Use the trackIds to fetch song information
    console.log(trackIds);
    getSongInform(trackIds);
}

window.onload = function() {
    const searchResults = JSON.parse(sessionStorage.getItem('searchResults'));

    if (!searchResults) {
        console.log('No search results found');
        return;
    }

    const resultsContainer = document.getElementById('ResSong_list');
    searchResults.forEach((track, index) => {
        const artists = track.artists.map(artist => artist.name).join(', ');
        const trackHTML = `
                 <div class="musicInfo" onclick="getAudio('${track.preview_url}')" style="font-family: 'Manrope'">
        <img src="${track.album.images[0].url}" alt="${track.name}" class="albumImage" id="popup_image${index}" onclick="popupDiv(${index})">
         <div class="artistsDets">
        <p class="songTitle" style="font-family: 'Manrope'">${track.name}</p>
        <p class="artistName" style="font-family: 'Manrope'">${track.artists.map(artist => artist.name).join(', ')} . ${track.album.name}</p>
        </div>
        <p class="duration" style="font-family: 'Manrope'">${msToTime(track.duration_ms)}</p>
                <div id="content_div${index}" class="content_div">
        <div class="img_box">
         <img src="${track.album.images[0].url}" alt="${track.name}" class="pp_img">
        <button class="xbtn" onclick="popupDiv(${index})"><img src="styles/images/icons8-x-50 white.png" class="xicon"></button>
        </div>
        <p class="p1" style="font-family: 'Manrope'">${track.name}</p>
        <p class="dp" style="font-family: 'Manrope'">${artists} </p>
        <p class="dp" style="font-family: 'Manrope'">Released on ${track.album.release_date}</p>
        <p class="dp1" style="font-family: 'Manrope'">From the ${track.album.name} Album</p>
        </div>
        ${track.preview_url ? `<p> </p>` : `<p class="noPreview">No Preview Available</p>`}
            </div>
        `;
        resultsContainer.innerHTML += trackHTML;
    });
}
 // Retrieve the query from sessionStorage
    const searchQuery = sessionStorage.getItem('searchQuery');

    // Display the message on the results page
    if (searchQuery) {
        document.getElementById('searchMessage').textContent = `Here's the result for "${searchQuery}"`;
    }
