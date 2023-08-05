import React, { useState, useRef } from 'react';
import { ngd } from 'osdatahub';
import Typography from '@mui/material/Typography';
import { Layer, Map, Marker, Popup, Source } from 'react-map-gl/maplibre';

import type { Tenure } from '@ow-demo/ow-ui';
import { AppDrawer, TitlesList } from '@ow-demo/ow-ui';

import { useOsLayers } from '../hooks';
import { TitleInfo } from '../typeValidation';

import type { FillLayer, MapRef } from 'react-map-gl/dist/esm/exports-maplibre';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

type MainProps = {
  titles: TitleInfo[];
};

const getNgsData = async (featureId: NGSFeatureIds, bbox: Bbox) => {
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

const buildingLayerStyle: FillLayer = {
  id: 'buildings',
  source: 'geojson',
  type: 'fill',
  paint: {
    'fill-color': '#ef920688',
    'fill-outline-color': '#09151586',
  },
};

const namedAreaLayerStyle: FillLayer = {
  id: 'namedArea',
  source: 'geojson',
  type: 'fill',
  paint: {
    'fill-color': '#828282a7',
    'fill-outline-color': '#c71d1d',
    'fill-opacity': 0.25,
  },
};

export default function Main({ titles }: MainProps) {
  const mapRef = useRef<MapRef>(null!);

  const [selectedTitle, setSelectedTitle] = useState<null | TitleInfo>(null);

  const [mapState, setMapState] = useState<MapState | null>();

  const {
    features: buildings,
    isLayerVisible: isBuildingLayerVisible,
    isLayerOn: isBuildingLayerOn,
    toggleLayer: toggleBuildingVisibility,
  } = useOsLayers({
    ngsFeatureId: 'bld-fts-buildingpart-1',
    mapState,
    minZoomLevelToShow: 17,
    getNgsDataFn: getNgsData,
  });

  const {
    features: namedArea,
    isLayerVisible: isNamedAreaLayerVisible,
    isLayerOn: isNamedAreaLayerOn,
    toggleLayer: toggleNamedAreaVisibility,
  } = useOsLayers({
    ngsFeatureId: 'gnm-fts-namedarea-1',
    mapState,
    minZoomLevelToShow: 12,
    getNgsDataFn: getNgsData,
  });

  return (
    <AppDrawer
      title="Property portfolio"
      drawerContent={
        <TitlesList
          titles={titles.map((t) => ({
            titleNumber: t['Title Number'],
            propertyAddress: t['Property Address'],
            tenure: t.Tenure.toLowerCase() as Tenure,
            onClick: () => {
              console.log('click!!');

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
        style={{ width: '100%', height: '93vh' }}
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
        <LayerOverLay
          layers={[
            {
              layerName: 'Buildings',
              isVisible: isBuildingLayerVisible,
              isLayerOn: isBuildingLayerOn,
              onClick: toggleBuildingVisibility,
            },
            {
              layerName: 'OS Areas',
              isVisible: isNamedAreaLayerVisible,
              isLayerOn: isNamedAreaLayerOn,
              onClick: toggleNamedAreaVisibility,
            },
          ]}
        />

        {namedArea && (
          <Source id="namedArea" type="geojson" data={namedArea}>
            <Layer {...namedAreaLayerStyle} />
          </Source>
        )}

        {buildings && (
          <Source id="buildings" type="geojson" data={buildings}>
            <Layer {...buildingLayerStyle} />
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
    </AppDrawer>
  );
}

type LayerOverlayProps = {
  layers: {
    isVisible: boolean;
    isLayerOn: boolean;
    layerName: string;
    onClick: () => void;
  }[];
};

const LayerOverLay = ({ layers }: LayerOverlayProps) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List
      sx={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="All layers" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {layers.map((l, index) => {
            return (
              <ListItemButton
                onClick={l.onClick}
                disabled={!l.isVisible}
                sx={{ pl: 4 }}
                key={index}
              >
                <ListItemIcon>
                  {l.isLayerOn ? <Visibility /> : <VisibilityOff />}
                </ListItemIcon>
                <ListItemText primary={l.layerName} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
};
