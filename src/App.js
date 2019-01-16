import React, { Component } from 'react';
import './App.css';
import Menu from './menu.js'
import * as Data from './data.json'


class App extends Component {
   constructor(props) {
     super(props);
     this.state={
       isOpen:true,
       infoWindow:"",
       map:"",
       markers:[]
     }

     this.initMap = this.initMap.bind(this);
     this.openInfoWindow=this.openInfoWindow.bind(this);
     this.closeInfoWindow=this.closeInfoWindow.bind(this);
     this.updateMarkers=this.updateMarkers.bind(this);
   }

// load map script
  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCkGcWPb3fQaqTLLb6aHd2ejm9qIX4kifA&callback=initMap')
    }

// initialize the map , infoWindow , bounds of map , markers
  initMap() {
    var self = this;
      var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 31.200092, lng: 29.918739},
          zoom: 15,
      });
      map.err
      var InfoWindow = new window.google.maps.InfoWindow({});
      this.setState({
        infoWindow:InfoWindow,
        map:map
      });

      var bounds=new window.google.maps.LatLngBounds();
      var markers=[];

      Data.places.map((place)=>{
        var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(place.location.lat, place.location.lng),
                map: map,
                title:place.name
            });

            bounds.extend(marker.position);
            markers.push(marker);

        marker.addListener('click',function () {
          self.closeInfoWindow();
          self.openInfoWindow(marker);
        });

      });

      map.fitBounds(bounds);

      this.setState({
        markers:markers
      });

      window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    window.gm_authFailure = function() {
           var map=document.getElementById('map');
           map.firstElementChild.remove()
           var node = document.createElement("h2");
            var textnode = document.createTextNode("Google maps failed to load!");
            node.appendChild(textnode);
            map.appendChild(node);
        }

    }

// redraw the filtered marker
    updateMarkers(filteredPlaces){
      this.state.markers.map((marker)=>{
        marker.setVisible(false);
      });

      this.state.markers.forEach(function(marker) {
        for (var i = 0; i < filteredPlaces.length; i++) {
          if(filteredPlaces[i].name===marker.title){
            marker.setVisible(true);
            break;
            }
          }
        }
      );
    }

// open the infoWindow
    openInfoWindow(marker){
      this.state.map.setCenter(marker.getPosition());
      this.state.map.panBy(0, -100);
      this.state.infoWindow.setContent("Loading...");
      this.getInfo(marker.title);
      this.state.infoWindow.open(this.state.map,marker);
    }

// get the info from the API
    getInfo(title){
      var self = this;
      var url ="https://en.wikipedia.org/w/api.php?&origin=*&action=query&format=json&prop=extracts&exintro=1&titles="+title;

    fetch( url, {
    method: 'POST',
} ).then( function ( response ) {
    if ( response.ok ) {
        return response.json();
    }
    throw new Error( 'Network response was not ok: ' + response.statusText );
} ).then( function ( data ) {
    // do something with data
    var Data=data.query.pages;
    var string="<h4>"+title+"</h4>";
    self.state.infoWindow.setContent(`<div id="info">`+string+Data[Object.keys(Data)[0]].extract+"</div>");
}).catch(function (err) {
  self.state.infoWindow.setContent("Network Error");
});
  }

// close the infoWindow
  closeInfoWindow(){
    this.state.infoWindow.close();
  }

// open and close the side bar
  toggleSideBar = ()=> {
	this.setState({
		isOpen: !this.state.isOpen
	});
}

  render() {
    return (
      <div className="App">

        <Menu open={this.state.isOpen}
              markers={this.state.markers}
              openInfoWindow={this.openInfoWindow}
              closeInfoWindow={this.closeInfoWindow}
              updateMarkers={this.updateMarkers}/>

        <div className="main">
        <header className="header">
          <img src="icon.svg" alt="bar icon" onClick={this.toggleSideBar} className="bar-icon"/>
          <h1>Neighborhood Map</h1>
        </header>
        <div id="map"></div>

        </div>
      </div>
    );
  }
}

export default App;

// to load the google map script
function loadMapJS(src) {
 var ref = window.document.getElementsByTagName("script")[0];
 var script = window.document.createElement("script");
 script.src = src;
 script.async = true;
 script.onerror = function () {
     document.write("Google Maps can't be loaded");
 };
 ref.parentNode.insertBefore(script, ref);
}
