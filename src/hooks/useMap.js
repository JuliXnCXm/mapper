import { useState, useEffect, useRef, useContext } from "react";
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import * as turf from "@turf/turf";
import MapContext from "../context/MapContext";
import marker2 from "../assests/marker2.png";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const useMap = () => {

    const {data} = useContext(MapContext)
    const [filteredData, setFilteredData] = useState(data);
    const mapContainer = useRef(null);
    const map = useRef();
    mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;
    const [viewState, setViewState] = useState({
        latitude: 4.678728,
        longitude: -74.055687,
        zoom: 10,
    });

    useEffect(() => {
        if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
            style: process.env.REACT_APP_MAP_STYLE_URI,
            container: mapContainer.current,
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
        });
        map.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
            })
        );

    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
            map.current.on("move", () => {
            setViewState({
                latitude: map.current.getCenter().lat.toFixed(4),
                longitude: map.current.getCenter().lng.toFixed(4),
                zoom: map.current.getZoom().toFixed(2),
            });
        });
    });

    useEffect(() => {
        if (filteredData.length > 0) {
            setFilteredData(OSMGeoJSON(filteredData));
        }
    }, [filteredData]);

    useEffect(() => {
        map.current.on("load", () => {
            // Add an image to use as a custom marker
            if (data.length > 0) {
            map.current.loadImage(marker2, (error, image) => {
                if (error) throw error;
                map.current.addImage("custom-marker", image, {
                sdf: true,
                });
                // Add a GeoJSON source with 2 points
                map.current.addSource("dataPoints", {
                type: "geojson",
                data: OSMGeoJSON(data),
                });

                // Add a symbol layer
                map.current.addLayer({
                id: "points",
                type: "symbol",
                source: "dataPoints",
                layout: {
                    "icon-image": "custom-marker",
                    "icon-size": 1,
                    "text-field": ["get", "name"],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 1.25],
                    "text-anchor": "top",
                },
                paint: {
                    "icon-color": "#f78f8f",
                },
                });
            });
            }
        });
    });

    const OSMGeoJSON = (dataMap) => {
        return {
            type: "FeatureCollection",
            features: dataMap.map((element) =>
                turf.point([element.lon, element.lat], {
                    amenity: element.tags.amenity,
                    name: element.tags.name,
                })
            ),
        };
    };

    return {
        map,
        data,
        setFilteredData,
        viewState,
        setViewState,
        mapContainer,
        OSMGeoJSON
    }
};

export default useMap;
