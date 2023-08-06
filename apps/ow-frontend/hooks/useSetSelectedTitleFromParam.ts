/**
 * Hook to set the selected title by a given valid title-id url param
 */

import { useEffect } from 'react';
import { TitleInfo } from '../typeValidation';

type Params = {
  titles: TitleInfo[];
  setSelectedTitle: React.Dispatch<React.SetStateAction<TitleInfo>>;
};

export const useSetSelectedTitleFromParam = ({
  titles,
  setSelectedTitle,
}: Params) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const titleIdParam = queryParams.get('title-id');

    if (titleIdParam) {
      console.log('got title id in url!', titleIdParam);
      const selectedTitle = titles.find(
        (title) => title['Title Number'] === titleIdParam
      );
      setSelectedTitle(selectedTitle);
    }
  }, [setSelectedTitle, titles]);
};
