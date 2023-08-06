import { ngd } from 'osdatahub';

import { useOsLayers } from './useOsLayers';

import type { GeoJSON } from 'geojson';
import type { FillLayer } from 'react-map-gl/dist/esm/exports-maplibre';

type RegisteredLayers = {
  id: string;
  layerName: string;
  isLayerOn: boolean;
  isLayerVisible: boolean;
  mapFeatures: GeoJSON;
  layerStyle: FillLayer;
  onClick: () => void;
}[];

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
    console.warn('Error getting data from OS API', error);
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

export const useRegisteredLayers = (mapState: MapState): RegisteredLayers => {
  const {
    features: buildingFeatures,
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
    features: namedAreaFeatures,
    isLayerVisible: isNamedAreaLayerVisible,
    isLayerOn: isNamedAreaLayerOn,
    toggleLayer: toggleNamedAreaVisibility,
  } = useOsLayers({
    ngsFeatureId: 'gnm-fts-namedarea-1',
    mapState,
    minZoomLevelToShow: 12,
    getNgsDataFn: getNgsData,
  });

  return [
    {
      id: 'buildings',
      layerName: 'Buildings',
      isLayerOn: isBuildingLayerOn,
      isLayerVisible: isBuildingLayerVisible,
      mapFeatures: buildingFeatures,
      layerStyle: buildingLayerStyle,
      onClick: toggleBuildingVisibility,
    },
    {
      id: 'namedArea',
      layerName: 'OS Named Areas',
      isLayerOn: isNamedAreaLayerOn,
      isLayerVisible: isNamedAreaLayerVisible,
      mapFeatures: namedAreaFeatures,
      layerStyle: namedAreaLayerStyle,
      onClick: toggleNamedAreaVisibility,
    },
  ];
};
