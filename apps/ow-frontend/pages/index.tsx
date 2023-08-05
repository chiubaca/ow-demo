import React, { useState, useEffect, useRef } from 'react';

import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { Layer, Map, Marker, Popup, Source } from 'react-map-gl/maplibre';

import { TitleInfo, titlesInfoSchema } from '../typeValidation';
import Typography from '@mui/material/Typography';

import type { FillLayer, MapRef } from 'react-map-gl/dist/esm/exports-maplibre';

import { useOsLayers } from '../hooks';

import { ngd } from 'osdatahub';

export const getNgsData = async (featureId: NGSFeatureIds, bbox: Bbox) => {
  try {
    const features = await ngd.features(
      process.env.NEXT_PUBLIC_OS_API_KEY,
      featureId,
      {
        bbox,
        limit: 100,
      }
    );
    return features;
  } catch (error) {
    console.error('Error getting data from OS API', error);
  }
};

export default function Page({
  titles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const mapRef = useRef<MapRef>(null!);

  const [selectedTitle, setSelectedTitle] = useState<null | TitleInfo>(null);

  const [mapState, setMapState] = useState<MapState | null>();

  const { features: buildings } = useOsLayers({
    ngsFeatureId: 'bld-fts-buildingpart-1',
    mapState,
    minZoomLevelToShow: 17,
    getNgsDataFn: getNgsData,
  });

  const layerStyle: FillLayer = {
    id: 'buildings',
    source: 'geojson',
    type: 'fill',
    paint: {
      'fill-color': '#00ffff',
      'fill-outline-color': '#091515',
    },
  };

  return (
    <div>
      {JSON.stringify(mapState)}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -0.1,
          latitude: 51.5,
          zoom: 10,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAP_TILER_KEY}`}
        onMoveEnd={(e) => {
          console.log();

          const { _ne, _sw } = mapRef.current.getBounds();
          const zoomLevel = mapRef.current.getZoom();
          setMapState({
            zoomLevel,
            bbox: [_sw.lng, _sw.lat, _ne.lng, _ne.lat],
          });
        }}
      >
        {buildings && (
          <Source id="buildings" type="geojson" data={buildings}>
            <Layer {...layerStyle} />
          </Source>
        )}

        {selectedTitle && (
          <>
            <Marker
              longitude={selectedTitle.X}
              latitude={selectedTitle.Y}
              anchor="bottom"
            >
              {/* <img src="./pin.png" /> */}
            </Marker>

            <Popup
              anchor="top"
              longitude={Number(selectedTitle.X)}
              latitude={Number(selectedTitle.Y)}
              // onClose={() => setPopupInfo(null)}
            >
              <Typography component={'p'}>
                {selectedTitle['Title Number']}
              </Typography>
              <Typography component={'p'}>
                {selectedTitle['Property Address']}
              </Typography>
              <Typography component={'p'}>{selectedTitle.Tenure}</Typography>
            </Popup>
          </>
        )}
      </Map>

      {titles.map((title, idx) => {
        return (
          <button
            onClick={() => {
              setSelectedTitle(title);
              mapRef.current.flyTo({
                zoom: 17,
                center: [title.X, title.Y],
                pitch: 45,
              });
            }}
            key={idx}
          >
            <Typography component={'h1'}> {title['Title Number']}</Typography>
            <Typography component={'p'}>{title['Property Address']}</Typography>
          </button>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  titles: TitleInfo[];
}> = async () => {
  const res = await fetch(
    'https://owfetechtask.blob.core.windows.net/titledata/testdata.json'
  );
  const titleDetailsResp = await res.json();

  // Validate the data is exactly what we expect it to be. If it isn't the build will fail.
  const titles = titlesInfoSchema.parse(titleDetailsResp);

  return { props: { titles } };
};
