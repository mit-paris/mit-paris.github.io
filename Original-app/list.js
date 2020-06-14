let map;
let service;
let infowindow;
let dbdata = {};
let currentUID;

const { hash } = window.location;

let currentListId = hash.slice(1);
console.log(hash,'Hash');

console.log(currentListId,'currentListId');
const resultMap = new Vue({
  el: '#search-result',
  data: {
    places: [],
    photos: [],
    place: [],
    favorites: {},
  },
  created() { 
    this.fetchFromFirebase();
  },
  methods: {
    regStar:function(place, event){
      if(this.favorites[place.id]){
        removeTogo(place);
      }else{
        togoList(place);
      }
    },
      
    fetchFromFirebase(){

      const favoritesRef = firebase
        .database()
        .ref(`favorites/${currentListId}`)
        .orderByChild('createdAt');
      favoritesRef.off('child_removed');
      favoritesRef.off('child_added');
        
      favoritesRef.on('child_removed', (favSnapshot) => {
        const placeId = favSnapshot.key;
        console.log(favSnapshot,'removeFav');
        this.$set(this.favorites, placeId, null);
      });
      
      favoritesRef.on('child_added', (favSnapshot) => {
        const placeId = favSnapshot.key;
        const favorite = favSnapshot.val();
        const place = favorite.place;
    
        let isFound = false;
        for(let i = 0; i < this.places.length; i++){
          if(this.places[i].id == placeId){
            isFound = true;
          }
        }
        if(!isFound){
          this.places.push(place);
        }
        this.$set(this.favorites, placeId, favorite);
        createMarker(place);
      });
    },
  },
});

const placeDetails = new Vue({
  el: '#details',
  data: {
    place: {},
    details: {},
    photos: [],
    photo: [],
    isShow: false,
  },
  watch: {
    place: function (newPlace, oldPlace) {
      this.getDetails(newPlace.id);
    }    
  },
  methods: {
    getDetails(placeId){
      const vm = this;
      const request = {
        placeId: placeId,
        fields: ['name', 'rating', 'international_phone_number', 'reviews','photos']
      };
      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          let author_name = 'No info';
          if(results.reviews){
            author_name = results.reviews[0].author_name;
          }
          let review_text = 'No info';
          if(results.reviews){
            review_text = results.reviews[0].text;
          }
          vm.details.reviewer = author_name;
          vm.details = {
            name: results.name,
            international_phone_number: results.international_phone_number,
            price: results.price_level,
            reviewer: author_name,
            text: review_text,
          };
          let photo = "";
          if(results.photos){
            photo = results.photos.map( photo => photo.getUrl() );
          }
          vm.photos = results.photos.map( photo => photo.getUrl() );
          vm.photos = photo;
        }
      });      
    },
  }
});

function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), { zoom: 15});
};

let center = null;
function createMarker(place) {
  if(!place.lat || !place.lng) return;
  const position = new google.maps.LatLng(place.lat,place.lng);
  const marker = new google.maps.Marker({
    map: map,
    position: position,
  });
  if(center == null){
    map.setCenter(position);
    center = position;
  }
  google.maps.event.addListener(marker, 'click', function() {
    placeDetails.place = place;
    placeDetails.isShow = 'true';
    $('#details').removeClass('hide').addClass('show');
    $('#search-result').removeClass('show').addClass('hide');
  });
};

$('.not-show').click(function () {
  $('#details').addClass('hide').removeClass('show');
  $('#search-result').removeClass('hide').addClass('show');
});

function clipURL() {
  $('body').append('<textarea id="currentURL" style="position:fixed;left:-100%;">'+location.href+'</textarea>');
  $('#currentURL').select();
  document.execCommand('copy');
  $('#currentURL').remove();
  console.log("Copied");
  alert("Copied!");
}

$('.not-show').click(function () {
  $('#details').addClass('hide').removeClass('show');
  $('#search-result').removeClass('hide').addClass('show');
});

const togoList = (place) => {
  firebase
    .database()
    .ref(`favorites/${currentListId}/${place.id}`)
    .set({
      place: place,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    })
    .then(() => {
    });
};
const removeTogo = (place) => {
  firebase
    .database()
    .ref(`favorites/${currentListId}/${place.id}`)
    .remove()
    .then(() => {
    });
};


