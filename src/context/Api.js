const overpass_query = `
        [out:json];
        area["ISO3166-1"="CO"][admin_level=2];
        (node["amenity"="restaurant"](area);
        way["amenity"="restaurant"](area);
        rel["amenity"="restaurant"](area);
        );
        out center;
    `;
const overpass_url = "http://overpass-api.de/api/interpreter";

module.exports = { overpass_query, overpass_url };