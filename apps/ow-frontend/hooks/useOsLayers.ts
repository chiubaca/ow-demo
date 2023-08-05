import { useEffect, useState } from 'react';

import type { GeoJSON } from 'geojson';

type UseOsLayerProps = {
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
}: UseOsLayerProps) => {
  const [features, setFeatures] = useState<GeoJSON | null>();

  useEffect(() => {
    // Only fetch data on given minZoomLevel to save on API allowance
    if (mapState?.zoomLevel >= minZoomLevelToShow) {
      const getFeatures = async () => {
        const features = await getNgsDataFn(ngsFeatureId, mapState.bbox);

        return features;
      };
      getFeatures()
        .then((features) => {
          console.log('got features', features);
          setFeatures(features);
        })
        .catch((error) => {
          console.log();
          console.error('Error setting features', error);
          setFeatures(null);
        });

      return;
    }

    setFeatures(null);
  }, [mapState]);

  return { features };
};
