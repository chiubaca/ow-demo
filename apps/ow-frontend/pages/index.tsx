import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { TitleInfo, titlesInfoSchema } from '../typeValidation';

import Main from '../components';

export default function Page({
  titles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Main titles={titles} />;
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
