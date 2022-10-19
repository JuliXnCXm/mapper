import React from "react";
import '../styles/Map.css'
import useMap from "../hooks/useMap";
import marker2 from '../assests/marker2.png'


const Maps = ({dataMap}) => {

    const {
        viewState,
        mapContainer,
    } = useMap()

    return (
        <div className="App">
            <div className="sidebar">
            Longitude: {viewState.longitude} | Latitude: {viewState.latitude} |
            Zoom: {viewState.zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default Maps