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

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });


    useEffect(() => {
        if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                style:
                    process.env.REACT_APP_MAP_STYLE_URI_BASE +
                    process.env.REACT_APP_MAP_STYLE_ID_REAL_COV,
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
        map.current.addControl(
            new mapboxgl.FullscreenControl()
        )
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
        map.current.on("style.load", () => {
            // Add an image to use as a custom marker
            if (data.length > 0) {
                    // Add a GeoJSON source with 2 points
                    map.current.addSource("dataPoints", {
                        type: "geojson",
                        data: OSMGeoJSON(data),
                    });

                    // Add a symbol layer
                    map.current.addLayer({
                        id: "points",
                        type: "circle",
                        source: "dataPoints",
                        layout: {
                            'visibility': 'visible',
                        },
                        'paint': {
                            'circle-color': '#4264fb',
                            'circle-radius': 6,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#ffffff'
                        }
                    });
            }
        });
    });

    useEffect(() => {
        map.current.on('mouseenter', 'points', (e) => {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = [e.lngLat.lng , e.lngLat.lat];
            const amenity = e.features[0].properties.amenity;
            const name = e.features[0].properties.name;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup
            .setLngLat(coordinates)
            .setHTML(`
            <div>
                <h2>${amenity}</h2>
                <h3>${name}</h3>
            </div>`
            )
            .addTo(map.current);
        });

        map.current.on('mouseleave', 'points', () => {
            map.current.getCanvas().style.cursor = '';
            popup.remove();
        });
    })

    const handleClickToggle = (e) => {
        if (!map.current.getLayer("points")) {
            return;
        }
        const clickedLayer = e.target.innerText;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.current.getLayoutProperty(
            clickedLayer,
            "visibility"
        );

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === "visible") {
            map.current.setLayoutProperty(clickedLayer, "visibility", "none");
            e.className = "";
        } else {
            e.className = "active";
            map.current.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
    }

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

    const changeStyle = (layer) => {
        const layerId = layer.target.id;
        map.current.setStyle(
            process.env.REACT_APP_MAP_STYLE_URI_BASE + layerId
        );
    }

    return {
        map,
        data,
        handleClickToggle,
        setFilteredData,
        viewState,
        setViewState,
        mapContainer,
        OSMGeoJSON,
        changeStyle,
        filteredData
    }
};

export default useMap;
