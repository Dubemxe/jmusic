async function getSpotifyToken(){

const response = await fetch(
"https://jmusic-backend.onrender.com/spotify-token"
);

const data = await response.json();

return data.token;

}

function popupaDiv(){

const panel = document.getElementById("searchbackDiv");

if(panel.classList.contains("open")){
panel.classList.remove("open");
panel.style.right = "-40%";
}else{
panel.classList.add("open");
panel.style.right = "0";
}

}
async function getTrackIdsByArtist(artistName) {
  try {
    const token = await getSpotifyToken();
    const encodedArtistName = encodeURIComponent(artistName);

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

    trackIds = trackIds.slice(0, 8); // top 8

    return trackIds;

  } catch (error) {
    console.error("Error fetching track IDs:", error);
    return [];
  }
}


async function myrepTop5(artistNames) {

  let allTrackIds = [];

  for (const artist of artistNames) {

    const trackIds = await getTrackIdsByArtist(artist);

    console.log(`Track IDs for ${artist}:`, trackIds);

    allTrackIds = allTrackIds.concat(trackIds);
  }

  return allTrackIds;
}



let selectedTrackIds = [];

async function addToFavorites(checkbox) {

  const artistName = checkbox.getAttribute("data-artist");

  const trackIds = await myrepTop5([artistName]);

  if (checkbox.checked) {

    trackIds.forEach(trackId => {

      if (!selectedTrackIds.includes(trackId)) {

        selectedTrackIds.push(trackId);

        console.log("Added:", trackId);

      }

    });

  } else {

    trackIds.forEach(trackId => {

      selectedTrackIds = selectedTrackIds.filter(id => id !== trackId);

      console.log("Removed:", trackId);

    });

  }

  console.log("Selected Tracks:", selectedTrackIds);
}



async function getArtistBio(artistName) {

  const apiKey = "15e5f9128c80ca2ea5b7bb90bbcda271";

  const bioUrl =
    `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

  try {

    const response = await fetch(bioUrl);

    const data = await response.json();

    if (data.artist && data.artist.bio && data.artist.bio.summary) {
      return data.artist.bio.summary;
    }

    return "Biography not available.";

  } catch (error) {

    console.error("Error fetching artist bio:", error);

    return "Error fetching biography.";
  }
}


function popupaDiv() {

  const contentDiv = document.getElementById("searchbackDiv");

  const isHidden =
    window.getComputedStyle(contentDiv).display === "none";

  contentDiv.style.display = isHidden ? "block" : "none";

}


async function searchArtist() {

  const artistQuery =
    document.getElementById("artistSearchInput").value.trim();

  if (!artistQuery) {
    alert("Please enter an artist name");
    return;
  }

  try {

    // get token from your backend
    const token = await getSpotifyToken();

    const searchUrl =
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistQuery)}&type=artist&limit=1`;

    const response = await fetch(searchUrl,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch artist data");
    }

    const data = await response.json();

    const artist = data.artists.items[0];

    if (!artist) {
      console.log("No artist found.");
      return;
    }

    const searchResultsContainer =
      document.getElementById("searchbackDiv");

    searchResultsContainer.innerHTML = "";

    const artistBio = await getArtistBio(artist.name);

    const trackHTML = `
    
      <div class="div1">
        <p class="searchtxt">Search Results</p>
        <img src="styles/images/icons8-x-50 white.png"
             class="imgd"
             onclick="popupaDiv()">
      </div>

      <div id="divdd2">

        <div class="imge"
             style="background-image:url('${artist.images[0]?.url || "styles/images/adPic.jpg"}');">

          <div class="checkdiv">

            <input type="checkbox"
                   class="checkerdh"
                   value="${artist.name}"
                   data-artist="${artist.name}"
                   onclick="addToFavorites(this)">

          </div>

          <div class="bdiv">
            <p class="mark_artistname">${artist.name}</p>
          </div>

        </div>

      </div>

      <p class="bio">${artistBio}</p>

    `;

    searchResultsContainer.innerHTML = trackHTML;

    // open right panel
    popupaDiv();

  } catch (error) {

    console.error("Error fetching artist data:", error);

  }
}



document
  .getElementById("artistSearchInput")
  .addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
      document.getElementById("searchBtn").click();
    }

  });



function completeList() {

  if (selectedTrackIds.length === 0) {

    alert("Please select at least one artist.");

    return;
  }

  const encodedTrackIds =
    encodeURIComponent(selectedTrackIds.join(","));

  window.location.href =
    `mysearchpage.html#trackIds=${encodedTrackIds}`;

}


function formatFollowers(count) {

  if (count >= 1e6) {
    return (count / 1e6).toFixed(1) + "M";
  }

  if (count >= 1e3) {
    return Math.round(count / 1e3) + "K";
  }

  return count;
}

