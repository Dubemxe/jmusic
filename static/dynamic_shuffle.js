const discoverArtists = [
  {
    name: "Drake",
    image: "styles/images/drake.jpg"
  },
  {
    name: "Wizkid",
    image: "styles/images/wizkid.jpg"
  },
  {
    name: "Burna Boy",
    image: "styles/images/burna.jpg"
  },
  {
    name: "Future",
    image: "styles/images/future.jpg"
  },
  {
    name: "Tems",
    image: "styles/images/tems.jpg"
  }
];

const carousel = document.getElementById("artistCarousel");

discoverArtists.forEach(artist => {

  const card = document.createElement("div");
  card.className = "artist-card-stack";

  card.innerHTML = `
    <img src="${artist.image}" alt="${artist.name}">
    <p>${artist.name}</p>
  `;

  carousel.appendChild(card);

});
