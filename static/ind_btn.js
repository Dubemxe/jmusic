function msToTime(duration) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

async function searchSong_onpage() {
    try {
        const query = document.getElementById('searchQuery').value.trim();
        if (!query) {
            console.log('Please enter a song title');
           return;
        }
        document.getElementById('searchMessage').textContent = `Here's the results for "${query}"`;
        
        // Personal nocodeapi url
        const searchUrl = `https://v1.nocodeapi.com/jmusic6/spotify/lQcmZrFNcMqfCRzc/search?q=${encodeURIComponent(query)}&type=track`;

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
        const songListHTML = trackItems.map((track, index) =>  {
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
          return trackHTML;
        }).join('');

        document.getElementById('ResSong_list').innerHTML = songListHTML;

        } catch (error) {
                console.error('Error searching for the song:', error);
    }
}
