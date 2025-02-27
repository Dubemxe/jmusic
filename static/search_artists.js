async function getTrackIdsByArtist(artistName) {
  try {

    // Encode the artist name for use in the URL
    const encodedArtistName = encodeURIComponent(artistName);

    // Construct the search URL for tracks by the artist
    const searchUrl = `https://v1.nocodeapi.com/jmusic4/spotify/kibKUujvhYKHJxPL/search?q=${encodedArtistName}&type=track`;

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
async function myTop5rep(atrackIds) {
    let allTrackIds = []; // To store track IDs from all artists

    for (const artist of atrackIds) {
        const trackIds = atrackIds;
        console.log(`Track IDs for ${artist}:`, trackIds);

        // Add the trackIds for this artist to the allTrackIds array
        allTrackIds = allTrackIds.concat(trackIds);
    }

    // Convert the entire trackIds array to a string and append it to the URL hash
    const encodedTrackIds = encodeURIComponent(allTrackIds.join(','));
}
function toSearchrep() {
        const selectedArtists = [];
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

        checkboxes.forEach(checkbox => {
                selectedArtists.push(checkbox.value);
        });

        if (selectedArtists.length > 0) {
                myTop5rep(selectedArtists);
        }
}
async function getArtistBio(artistName) {
    const apiKey = '15e5f9128c80ca2ea5b7bb90bbcda271';
    const bioUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(bioUrl);
        const data = await response.json();

        if (data.artist && data.artist.bio && data.artist.bio.summary) {
            return data.artist.bio.summary; // Returns the artist's biography
        } else {
            return "Biography not available.";
        }
    } catch (error) {
        console.error("Error fetching artist bio:", error);
        return "Error fetching biography.";
    }
}

function popupaDiv() {

  const contentDiv = document.getElementById('searchbackDiv');

  // Toggle the visibility of the div
  if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
    contentDiv.style.display = 'block'; // Show the div
  } else {
    contentDiv.style.display = 'none'; // Hide the div
  }
}
let favoriteArtists = []; // Array to store selected artist IDs

function addToFavorites(checkbox) {
    const artistId = checkbox.value;

    if (checkbox.checked) {
        if (!favoriteArtists.includes(artistId)) {
            favoriteArtists.push(artistId);
        }
    } else {
        favoriteArtists = favoriteArtists.filter(id => id !== artistId);
    }

    console.log(favoriteArtists); // Debugging: Check if values update correctly
}
async function searchArtist() {
  // Get the artist's name from the input field
  const artistQuery = document.getElementById('artistSearchInput').value.trim();

  // Check if input is empty
  if (!artistQuery) {
      alert('Please enter an artist name');
      return;
  }
  // Spotify API URL for searching artists
  const searchUrl = `https://v1.nocodeapi.com/jmusic4/spotify/kibKUujvhYKHJxPL/search?q=${encodeURIComponent(artistQuery)}&type=artist`;
  // Fetch the artist's data
  try {
      const response = await fetch(searchUrl);
     if (!response.ok) {
          throw new Error('Failed to fetch artist data');
      }

      const data = await response.json();
      const artist = data.artists.items[0];

      // If no artist is found
      if (!artist) {
          console.log('No artist found. Please try a different name.');
          return;
      }
      // Update the Search Results section
      const searchResultsContainer = document.getElementById('searchbackDiv');
        
      const artistId = await getTrackIdsByArtist(artist.name);
      const artistBio = await getArtistBio(artist.name);

       
  const trackHTML = `
                   <div class="div1">
    <p class="searchtxt">Search Results</p>
    <img src="styles/images/icons8-x-50 white.png" class="imgd" onclick="popupaDiv()">
      </div>

      <div class="div2">
    </div>

              <div id="divdd2">          
              <div class="imge" style="background-image: url('${artist.images[0]?.url || 'styles/images/adPic.jpg'}');">
              <div class="checkdiv">
              <input type="checkbox" class="checkerdh" value="${artistId}" onclick="addToFavorites(this)"> </div>
                   <div class="bdiv">
              <p class="artistname">${artist.name}</p> </div> </div> </div>
              <p class=bio>${artistBio}</p>
          `;
        searchResultsContainer.innerHTML += trackHTML;
    }  catch (error) {
      console.error('Error fetching artist data:', error);
  }
}

document.getElementById('artistSearchInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
           document.getElementById('searchBtn').click();  // Trigger search button click
  }
});
function formatFollowers(count) {
  if (count >= 1e6) {
      return (count / 1e6).toFixed(1) + 'M';
  } else if (count >= 1e3) {
      return Math.round(count / 1e3) + 'K';
  }
  return count;
}
