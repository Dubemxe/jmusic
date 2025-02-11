function changeUrl(url) {
                window.location.href = url;
                }



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
    const searchUrl = `https://v1.nocodeapi.com/jmusic4/spotify/kibKUujvhYKHJxPL/search?q=${encodeURIComponent(artistName)}&type=artist`;

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
    const trackIds =  getTrackIdsByArtist(); //topTrackIds.tracks.map(track => track.id);

    // Handle the display in HTML format
    const artistInfoHTML = `
      <div>
        <img src="${artist.images[0].url}" alt="${artist.name}" class="artist_image">

        <h2 class="name">${artist.name}</h2>
        <p class="followers">Followers: ${fmtCount(artist.followers.total)}</p>
        <p class="rating">Rating on spotify: ${artist.popularity}%</p>
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

// Use put the display in  div1

const artistName = 'Drake';
const artistInfoDiv = document.getElementById('artistInfo');

getArtistInfo(artistName)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv.innerHTML = artistInfoHTML;
  });
// for div2
const artistName2 = 'Davido';
const artistInfoDiv2 = document.getElementById('artistInfo2');

getArtistInfo(artistName2)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv2.innerHTML = artistInfoHTML;
  });

// for div3
const artistName3 = '21';
const artistInfoDiv3 = document.getElementById('artistInfo3');

getArtistInfo(artistName3)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv3.innerHTML = artistInfoHTML;
  });
// for div4
const artistName4 = 'Phyno';
const artistInfoDiv4 = document.getElementById('artistInfo4');

getArtistInfo(artistName4)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv4.innerHTML = artistInfoHTML;
  });
// for div5
const artistName5 = 'Tyler The';
const artistInfoDiv5 = document.getElementById('artistInfo5');

getArtistInfo(artistName5)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv5.innerHTML = artistInfoHTML;
  });

// for div6
const artistName6 = 'Gunna';
const artistInfoDiv6 = document.getElementById('artistInfo6');

getArtistInfo(artistName6)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv6.innerHTML = artistInfoHTML;
  });

// for div7
const artistName7 = 'Tyla';
const artistInfoDiv7 = document.getElementById('artistInfo7');

getArtistInfo(artistName7)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv7.innerHTML = artistInfoHTML;
  });
// for div8
const artistName8 = 'NLE';
const artistInfoDiv8 = document.getElementById('artistInfo8');

getArtistInfo(artistName8)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv8.innerHTML = artistInfoHTML;
  });


// for div9
const artistName9 = 'Kendrick';
const artistInfoDiv9 = document.getElementById('artistInfo9');

getArtistInfo(artistName9)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv9.innerHTML = artistInfoHTML;
  });

// for div10
const artistName10 = 'BigxTha';
const artistInfoDiv10 = document.getElementById('artistInfo10');

getArtistInfo(artistName10)
  .then(({ artistInfoHTML, trackIds }) => {
    artistInfoDiv10.innerHTML = artistInfoHTML;
  });
