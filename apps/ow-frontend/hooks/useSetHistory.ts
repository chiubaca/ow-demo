import { useEffect } from 'react';
import { TitleInfo } from '../typeValidation';

export const useSetHistory = (selectedTitle: TitleInfo) => {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    if (!selectedTitle) {
      return;
    }
    console.log('set history state', window);

    urlSearchParams.set('title-id', selectedTitle['Title Number']);

    const url = new URL(window.location.toString());

    url.searchParams.set('title-id', selectedTitle['Title Number']);

    history.pushState({}, '', url);
  }, [selectedTitle]);
};
