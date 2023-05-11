import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ({ coordinates }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidWRheWt1bWFyMjIiLCJhIjoiY2xoaWg1eDYwMDd5aTNkcDE4cnkxZDBycyJ9.G5r_o_A_51FUAp4SH4iddA';
    const initializeMap = ({ setMap, coordinates }) => {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
        addcoordinatesToMap(map, coordinates);
      });
    };

    if (!map) initializeMap({ setMap, coordinates });
  }, [coordinates, map]);

  const addcoordinatesToMap = (map, coordinates) => {
    const geojson = {
      type: 'FeatureCollection',
      features: coordinates.map((delivery) => {
        if (delivery.Longitude !== undefined && delivery.Latitude !== undefined) {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [delivery.Longitude, delivery.Latitude],
            },
            properties: {
              name: delivery.Name,
            },
          };
        } else {
          return null;
        }
      }).filter((feature) => feature !== null),
    };
  
    const bounds = geojson.features.reduce(
      (bounds, feature) => bounds.extend(feature.geometry.coordinates),
      new mapboxgl.LngLatBounds()
    );
  
    map.fitBounds(bounds, {
      padding: 40,
    });
  
    map.addSource('coordinates', {
      type: 'geojson',
      data: geojson,
    });
  
    // Add layer for points
    map.addLayer({
      id: 'points',
      type: 'circle',
      source: 'coordinates',
      paint: {
        'circle-radius': 8,
        'circle-color': '#B42222',
      },
    });
  
    // Add layer for route lines
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'coordinates',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#888',
        'line-width': 3
      }
    });
  
    // Connect each point with a line
    for (let i = 0; i < coordinates.length - 1; i++) {
      const startPoint = [coordinates[i].Longitude, coordinates[i].Latitude];
      const endPoint = [coordinates[i+1].Longitude, coordinates[i+1].Latitude];
  
      map.addSource(`route-${i}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [startPoint, endPoint]
          }
        }
      });
  
      map.addLayer({
        id: `route-${i}`,
        type: 'line',
        source: `route-${i}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#888',
          'line-width': 3
        }
      });
    }
  
    // Add popups for each point
    map.on('click', 'points', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const name = e.features[0].properties.name;
  
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<h3>${name}</h3>`)
        .addTo(map);
    });
  
    map.on('mouseenter', 'points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
  
    map.on('mouseleave', 'points', () => {
      map.getCanvas().style.cursor = '';
    });
  };
  

  return <div id="map" style={{ height: '100vh' }}></div>;
};

export default Map;
