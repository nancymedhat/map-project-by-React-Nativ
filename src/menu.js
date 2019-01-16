import React, { Component } from 'react';
import * as Data from './data.json'
import PropTypes from 'prop-types'


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state={
      query:"",
      results:[],
    }
  }

// take the selected item and open the infoWindow of the selected item
  handleClick(item){
    var markTitle=item.innerText;
    var markers=this.props.markers;
    var element=markers.filter((marker)=>(marker.title===markTitle));
    this.props.openInfoWindow(element[0]);
  }

// take the search query and filter the markers and show the filtered markers on the map
  updateQuery(query){
    this.props.closeInfoWindow();

    this.setState({
      query:query
    });
    var filteredPlaces=[];
    var places=Data.places;

    places.forEach(function(location) {
      if (location.name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        filteredPlaces.push(location);
      }
  );

  this.setState({
    results:filteredPlaces
  });

this.props.updateMarkers(filteredPlaces);
  }

  render() {
    return (
      <div>
      {this.props.open ?(

        <nav className="side-nav-open">
        <h3>Filter Locations</h3>
        <div>
        <input type="text" placeholder="Filter locations" role="search" aria-label="filter locations" value={this.state.query} onChange={(event)=>this.updateQuery(event.target.value)}/>
        <ul>
          {this.state.query==="" ?(
            Data.places.map((place)=>(<li key={place.name}
                                          tabIndex="0"
                                          role="button"
                                          onClick={(event)=>this.handleClick(event.target)}
                                          onKeyPress={(event)=>this.handleClick(event.target)}>{place.name}</li>))
          ):(
            this.state.results.map((place)=>(<li key={place.name}
                                                 tabIndex="0"
                                                 role="button"
                                                 onClick={(event)=>this.handleClick(event.target)}
                                                 onKeyPress={(event)=>this.handleClick(event.target)}>{place.name}</li>))

          )
          }
        </ul>
        </div>
        </nav>
      ):(
        <nav className="side-nav-close">
        <h3>Filter Locations</h3>
        <div>
        <button type="button" name="button" className="butn">Filter</button>
        <ul>
          {
          Data.places.map((place)=>(<li key={place.name}>{place.name}</li>))
          }
        </ul>
        </div>
        </nav>

      )}
      </div>
    );
  }
}

Menu.propTypes={
  open:PropTypes.bool.isRequired,
  markers:PropTypes.array.isRequired,
  openInfoWindow:PropTypes.func.isRequired,
  closeInfoWindow:PropTypes.func.isRequired,
  updateMarkers:PropTypes.func.isRequired
}

export default Menu;
