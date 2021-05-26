import React from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import './Map.css';
import { showDataOnMap } from './utility';

function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView([coords.lat, coords.lng], map.getZoom(5));
  
    return null;
  }
function Map({countries, casesType, center, zoom}){
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <ChangeMapView coords={center} />
                {/* loop through countries and draw circles on the map */}
                {showDataOnMap(countries, casesType )}
            </LeafletMap>
        </div>
    )
}

export default Map
