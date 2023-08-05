import { useEffect, useState } from 'react';

import type { GeoJSON } from 'geojson';

export type UseOsLayerParams = {
  ngsFeatureId: NGSFeatureIds;
  mapState: MapState | null;
  minZoomLevelToShow: number;
  getNgsDataFn: (featureId: NGSFeatureIds, bbox: Bbox) => Promise<GeoJSON>;
};

export const useOsLayers = ({
  ngsFeatureId,
  mapState,
  minZoomLevelToShow,
  getNgsDataFn,
}: UseOsLayerParams) => {
  const [isLayerVisible, setIsLayerVisible] = useState<boolean>(false);

  const [isLayerOn, setIsLayerOn] = useState<boolean>(true);

  const [features, setFeatures] = useState<GeoJSON | null>();

  const toggleLayer = () => setIsLayerOn(!isLayerOn);

  useEffect(() => {
    if (!isLayerOn) {
      setIsLayerOn(false);
      setFeatures(null);
      return;
    }

    // Only fetch data on given minZoomLevel to save on API allowance
    if (mapState?.zoomLevel >= minZoomLevelToShow) {
      const getFeatures = async () => {
        const features = await getNgsDataFn(ngsFeatureId, mapState.bbox);

        return features;
      };
      getFeatures()
        .then((features) => {
          setFeatures(features);
          setIsLayerVisible(true);
        })
        .catch((error) => {
          console.warn('Error setting features', error);
          setFeatures(null);
        });

      return;
    }
    setIsLayerVisible(false);
    setFeatures(null);
  }, [getNgsDataFn, isLayerOn, mapState, minZoomLevelToShow, ngsFeatureId]);

  return {
    features,
    isLayerOn,
    isLayerVisible,
    toggleLayer,
  };
};
