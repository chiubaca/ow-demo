import React, { useState, useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { Map, Marker, Popup } from 'react-map-gl/maplibre';

import { TitleInfo, titlesInfoSchema } from '../typeValidation';
import Typography from '@mui/material/Typography';

import type {
  MapRef,
  Map as IMapBox,
} from 'react-map-gl/dist/esm/exports-maplibre';

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

export default function Page({
  titles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedTitle, setSelectedTitle] = useState<null | TitleInfo>(null);

  const mapRef = useRef<MapRef>(null!);

  return (
    <div>
      <Button variant="contained">Hello World</Button>

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAP_TILER_KEY}`}
      >
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
