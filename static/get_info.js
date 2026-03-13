function changeUrl(url) {
                window.location.href = url;
                }



async function getTrackIdsByArtist(artistName) {
  try {

    // Encode the artist name for use in the URL
    const encodedArtistName = encodeURIComponent(artistName);

    // Construct the search URL for tracks by the artist
    const searchUrl = `https://v1.nocodeapi.com/jmusicdn1/spotify/uGxXHgbuCDfpIJMm/search?q=${encodedArtistName}&type=track`;

    // Make a GET request to the search URL with the Spotify API access token
    const response = await fetch(searchUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch tracks by artist');
    }

    // Parse the response JSON
    const data = await response.json();
        let trackIds = data.tracks.items.map(item => item.id);

    // Set limit to 5
    trackIds = trackIds.slice(0, 5);

    // Return the array of track IDs
    //console.log("Top tracks:", trackIds);
    return trackIds;
  } catch (error) {
    console.error('Error fetching track IDs by artist:', error);
    return [];
  }
}

async function myTop5(artistNames) {
    let allTrackIds = []; // To store track IDs from all artists

    for (const artist of artistNames) {
        const trackIds = await getTrackIdsByArtist(artist);
        console.log(`Track IDs for ${artist}:`, trackIds);

        // Add the trackIds for this artist to the allTrackIds array
        allTrackIds = allTrackIds.concat(trackIds);
    }

    // Convert the entire trackIds array to a string and append it to the URL hash
    const encodedTrackIds = encodeURIComponent(allTrackIds.join(','));
   window.location.href = `mysearchpage.html#trackIds=${encodedTrackIds}`;
}
function toSearchpage() {
        const selectedArtists = [];
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

        checkboxes.forEach(checkbox => {
                selectedArtists.push(checkbox.value);
        });

        if (selectedArtists.length > 0) {
                myTop5(selectedArtists);
        }
}

// get info function
async function getArtistInfo(artistName) {
  try {
          const accessToken =  '';
    const searchUrl = `https://v1.nocodeapi.com/jmusicdm1/spotify/uWWdmvHDFKQQHmLq/search?q=${encodeURIComponent(artistName)}&type=artist`;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch artist info');
    }
    const searchData = await response.json();
    const artist = searchData.artists.items[0];
    if (!artist) {
      return '<div>Artist not available</div>';
    }

// Extract track IDs from the artist's top tracks
    const topTracksResponse = await fetch(artist.href /*+ '/top-tracks?country=US'*/, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    //  Extracting the artist's top track IDs
    const topTrackIds = await topTracksResponse.json();
    const trackIds =  getTrackIdsByArtist(); 

    // Handle the display in HTML format
    const artistInfoHTML = `
      <div>
           <div class="image-wrapper">
        <img src="${artist.images[0].url}" alt="${artist.name}" class="artist_image">
        <div class="add-btn">+</div>

    </div>

        <h2 class="name">${artist.name}</h2>
        
    <div class="artist-stats">
        <p class="followers">${fmtCount(artist.followers.total)} Followers</p>
        <p class="rating"> ${artist.popularity}% Spotify Rating</p>
              </div>
      </div>
    `;
     return  { artistInfoHTML, trackIds };
  } catch (error) {
    console.error('Error fetching artist info:', error);
    return '<div>Error fetching artist info</div>';
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


const artists = [
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
const shuffledArtists = artists.sort(() => 0.5 - Math.random());

// num of cards
const numberOfCards = 9;

shuffledArtists.slice(0, numberOfCards).forEach(artistName => {

    const card = document.createElement("div");
    card.classList.add("artist-card");

    card.innerHTML = `
        <input type="checkbox" value="${artistName}" class="hidden-checkbox">
        <div class="artistInfo">Loading...</div>
    `;

    artistGrid.appendChild(card);

    const infoDiv = card.querySelector(".artistInfo");

    getArtistInfo(artistName)
        .then(({ artistInfoHTML, trackIds }) => {
            infoDiv.innerHTML = artistInfoHTML;
        });

});

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

const panel = document.getElementById("sidePanel");
const openBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closePanel");

openBtn.addEventListener("click", () => {
    panel.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
});

const cards = document.querySelectorAll(".artist-card-stack");

let positions = ["left","center","right"];

function updatePositions(){

    cards.forEach((card,i)=>{

        card.classList.remove("left","center","right");

        card.classList.add(positions[i]);

    });

}

updatePositions();

function rotateCards(){

    positions.unshift(positions.pop());

    updatePositions();

}

setInterval(rotateCards,3500);

