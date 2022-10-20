/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import '../styles/Map.css'
import useMap from "../hooks/useMap";
import Menu from "./Menu";

const Maps = () => {

    const {
        viewState,
        mapContainer,
        changeStyle,
        handleClickToggle
    } = useMap()

    const [show, setShow] = useState(false);
    const toggleableLayerIds = ["points"];

    return (
        <div>
            <>
                <span
                    id="menu-icon"
                    className="material-icons material-symbols-sharp"
                    onClick={() => setShow(!show)}>
                    expand_content
                </span>
                {
                    show ?
                    <div className="mapperContainer--menu">
                        <div id="menu-toggle">
                        {toggleableLayerIds.map((toggleable, idx) => {
                            return (
                                <a className="active" href="#" key={idx} onClick={handleClickToggle}>{toggleable}</a>
                            )
                        })}
                        </div>
                    </div>
                    : null
                }
            </>
            <div className="sidebar">
            Longitude: {viewState.longitude} | Latitude: {viewState.latitude} |
            Zoom: {viewState.zoom}
            </div>
            <div ref={mapContainer} className="map-container"></div>
            <Menu changeStyle={changeStyle} />
        </div>
    );
}

export default Maps