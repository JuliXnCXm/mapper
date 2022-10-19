import { React, createContext, useState, useEffect } from "react";
import { overpass_url, overpass_query } from "./Api";

const MapContext = createContext();

const MapProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(true);
    const [query , setQuery] = useState(overpass_query);

    useEffect(() => {
        fetch(overpass_url + "?data=" + query)
            .then(async (res) => {
                if (res.status === 200) {
                    let json = await res.json();
                    setData(json.elements);
                    if (data.length > 0) {
                        setTimeout(() => setIsLoading(false), 4000);
                    }
                } else {
                    console.log("Error");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err);
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            });
    }, [query, data.length])

    const getData = async (newQuery) => {
        setQuery(newQuery);
        fetch(overpass_url + "?data=" + query)
        .then(async (res) => {
            if (res.status === 200) {
                let json = await res.json();
                setData(json.elements);
                console.log(data.length)
                if (data.length > 0) {
                    setTimeout(() => setIsLoading(false), 4000);
                }
            } else {
            console.log("Error");
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
            }
        })
        .catch((err) => {
            console.log(err);
            setTimeout(() => {
            window.location.href = "/";
            }, 3000);
        });
    };

    const dataObject = {
        isLoading,
        getData,
        data
    };

    return (
        <MapContext.Provider value={dataObject}>{children}</MapContext.Provider>
    );
};

export { MapProvider };
export default MapContext;
