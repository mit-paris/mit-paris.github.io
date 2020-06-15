let map;
let service;
let infowindow;
let dbdata = {};
let currentListId = "";
let markers = [];

const searchResult = new Vue({
  el: '#search-result',
  data: {
    places: [],
    place: [],
    favorites: {},
    isShow: true,
  },
  created() {
    currentListId = this.getUserListId();
    $('#togo-link').attr('href',`togo-list.html#${currentListId}`);
    
    this.fetchFromFirebase();
  },
  methods: {
    getUserListId:function(){
      const listId = localStorage.getItem("currentListId");
     
      if(listId === null){
        let uid = this.getUniqueStr();
        localStorage.setItem("currentListId",uid);
        return uid;
    
      }else{
        return listId;
      }
    },
    getUniqueStr: function(myStrong){
      let strong = 1000;
      if (myStrong) strong = myStrong;
      return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
    },
    regStar:function(place, event){
      console.log('event', event);
      console.log(this.favorites);
      if(this.favorites[place.id]){
        removeTogo(place);
        const target = $(event.target);
        $(target).removeClass('fa-star').addClass('fa-star-o');
      }else{
        togoList(place);
        const target = $(event.target);
        $(target).removeClass('fa-star-o').addClass('fa-star');
      }
    },
    fetchFromFirebase: function(){
      const favoritesRef = firebase
        .database()
        .ref(`favorites/${currentListId}`)
        .orderByChild('createdAt');
      favoritesRef.off('child_removed');
      favoritesRef.off('child_added');
        
      favoritesRef.on('child_removed', (favSnapshot) => {
        const placeId = favSnapshot.key;
        this.$set(this.favorites, placeId, null);
      });
      favoritesRef.on('child_added', (favSnapshot) => {
        const placeId = favSnapshot.key;
        const place = favSnapshot.val();
        this.$set(this.favorites, placeId, place);
        this.favorites[placeId] = place;
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
        fields: ['name', 'address_components', 'international_phone_number','price_level', 'reviews','photos']
      };
      
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
    close: function () {
      this.isShow = !this.isShow;
    },
    unv: function () {
      this.isShow = 'false'
    }
  }
});

function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(
    document.getElementById('map'), { zoom: 15});
  service = new google.maps.places.PlacesService(map);
  search('パリ');
};
const input = document.getElementById('search');
const button = document.getElementById('button');
button.addEventListener('click', () => {
  const strQuery = document.getElementById("search").value;
  let marker = new google.maps.Marker();
  ClearAllMarkers();
  search(strQuery);
});
document.addEventListener('keydown',function(e) {
  if(e.which == 13) {
    const strQuery = document.getElementById("search").value;
    let marker = new google.maps.Marker();
    ClearAllMarkers();
    search(strQuery);
  }
});
const getImageURL = (place) => {
  if(place.photos && place.photos[0]){
    return place.photos[0].getUrl();
  }else{
    return null;
  } 
};
const search = (strQuery) => {
  const request = {
    query: strQuery,
    fields: ['name', 'geometry'],
  };
  service.textSearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let rating = 'No info';
      if(results.rating){
        rating = results.rating;
      }
      searchResult.places = results.map( place => ({
        id: place.place_id,
        name: place.name,
        imageURL: getImageURL(place),
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        rating: rating,
        types: place.types,
      }));
      searchResult.places.forEach(place => {
        createMarker(place);
      });
      map.setCenter(results[0].geometry.location);
    }
    $('#details').removeClass('show').addClass('hide');
    $('#search-result').removeClass('hide').addClass('show');
    
  });
};
function createMarker(place) {
  const position = new google.maps.LatLng(place.lat,place.lng);
  const marker = new google.maps.Marker({
    map: map,
    position: position,
  });
  markers.push(marker);
  google.maps.event.addListener(marker, 'click', function() {
    placeDetails.place = place;
    placeDetails.isShow = 'true';
    $('#details').removeClass('hide');
    $('#search-result').addClass('hide');
  });
}
function ClearAllMarkers() {
  markers.forEach(marker => {
    marker.setMap(null);
  })
}

$('.not-show').click(function () {
  $('#details').addClass('hide').removeClass('show');
  $('#search-result').removeClass('hide').addClass('show');
});

$("#block-one").fadeIn(2000);
$(document).ready(function(){
  setTimeout(function() {
    $("#block-two").fadeIn(2000);
    $("#block-one").fadeOut(2000);
  }, 2000);
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
