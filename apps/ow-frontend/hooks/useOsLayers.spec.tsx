import { renderHook } from '@testing-library/react';

import { useOsLayers } from './useOsLayers';

export const mockGetNgsData = async (
  _featureId: NGSFeatureIds,
  _bbox: Bbox
) => {
  return {
    type: 'FeatureCollection',
    features: [],
  } as any;
};

describe('useOsLayers', () => {
  test('should _not_ fetch data when zoom level is less than minZoomLevelToShow', async () => {
    const { result } = renderHook(() =>
      useOsLayers({
        ngsFeatureId: 'bld-fts-buildingline-1',
        mapState: {
          zoomLevel: 1,
          bbox: [0, 0, 0, 0],
        },
        minZoomLevelToShow: 15,
        getNgsDataFn: mockGetNgsData,
      })
    );

    expect(result.current.features).toEqual(null);
  });
});
