import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Redirect home page straight to the first wiki page
export default function Home() {
  return <Redirect to={useBaseUrl('/docs/intro')} />;
}
