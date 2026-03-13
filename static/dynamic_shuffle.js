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
    image: "styles/images/burnaboy.jpg"
  },
  {
    name: "Future",
    image: "styles/images/future.jpg"
  },
  {
    name: "Travis Scott",
    image: "styles/images/travis.jpg"
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

