import React, { useState, useRef, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Layer, Map, Marker, Popup, Source } from 'react-map-gl/maplibre';

import type { Tenure } from '@ow-demo/ow-ui';
import { AppDrawer, LayersList, TitlesList } from '@ow-demo/ow-ui';

import { useRegisteredLayers } from '../hooks';
import { TitleInfo } from '../typeValidation';

import type { MapRef } from 'react-map-gl/dist/esm/exports-maplibre';

type MainProps = {
  titles: TitleInfo[];
};

type HoverInfo = (null | string)[];

export default function Main({ titles }: MainProps) {
  const mapRef = useRef<MapRef>(null!);

  const [selectedTitle, setSelectedTitle] = useState<null | TitleInfo>(null);

  const [mapState, setMapState] = useState<MapState | null>();

  const layers = useRegisteredLayers(mapState);

  const [hoverInfo, setHoverInfo] = useState<null | HoverInfo>(null);

  const onHover = useCallback((event) => {
    const { features } = event;
    const hoveredFeature = features && features[0];

    const toid = hoveredFeature?.properties?.toid;
    const description = hoveredFeature?.properties?.description;
    const capturespecification =
      hoveredFeature?.properties?.capturespecification;
    const oslandusetiera = hoveredFeature?.properties?.oslandusetiera;

    setHoverInfo([toid, description, capturespecification, oslandusetiera]);
  }, []);

  return (
    <AppDrawer
      title="Your property portfolio 🏠"
      drawerContent={
        <TitlesList
          titles={titles.map((t) => ({
            titleNumber: t['Title Number'],
            propertyAddress: t['Property Address'],
            tenure: t.Tenure.toLowerCase() as Tenure,
            onClick: () => {
              setSelectedTitle(t);
              mapRef.current.flyTo({
                zoom: 19,
                center: [t.X, t.Y],
              });
            },
          }))}
        />
      }
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -0.1,
          latitude: 51.5,
          zoom: 10,
        }}
        interactiveLayerIds={['buildings', 'rail', 'landFeatures']}
        onMouseMove={onHover}
        style={{ width: '100%', height: '90vh' }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAP_TILER_KEY}`}
        onMoveEnd={(e) => {
          const { _ne, _sw } = mapRef.current.getBounds();
          const zoomLevel = mapRef.current.getZoom();
          setMapState({
            zoomLevel,
            bbox: [_sw.lng, _sw.lat, _ne.lng, _ne.lat],
          });
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
        >
          <LayersList
            layers={layers.map((l) => ({
              layerName: l.layerName,
              isVisible: l.isLayerVisible,
              isLayerOn: l.isLayerOn,
              onClick: l.onClick,
            }))}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            maxWidth: 360,
            bgcolor: 'background.paper',
            opacity: 0.8,
          }}
        >
          {hoverInfo &&
            hoverInfo.map((info, idx) => (
              <Typography key={idx}>{info}</Typography>
            ))}
        </Box>

        {layers.map(
          (l) =>
            l.mapFeatures && (
              <Source key={l.id} id={l.id} type="geojson" data={l.mapFeatures}>
                <Layer {...l.layerStyle} />
              </Source>
            )
        )}

        {selectedTitle && (
          <>
            <Marker
              longitude={selectedTitle.X}
              latitude={selectedTitle.Y}
              anchor="bottom"
            />

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
    </AppDrawer>
  );
}
