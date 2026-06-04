import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

// 홈 → 위키 첫 페이지로 바로 이동
export default function Home() {
  return <Redirect to={useBaseUrl('/docs/intro')} />;
}
