// @ts-check
// School KING 공개 위키 설정
// 공개 사이트: 게임 위키 + 패치 노트만. 내부 문서는 비공개 개발 저장소에 둔다.

import {themes as prismThemes} from 'prism-react-renderer';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'School KING',
  tagline: '학교에서 벌어지는 무브먼트 슈터, School KING 공식 위키',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://ghkdlxm005.github.io',
  baseUrl: '/SchoolKing_wiki/',
  organizationName: 'ghkdlxm005',
  projectName: 'SchoolKing_wiki',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['ko', 'en'],
        indexBlog: true,
        docsRouteBasePath: '/wiki',
        blogRouteBasePath: '/patch-notes',
        blogDir: './patch-notes',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'wiki',
          sidebarPath: './sidebars.js',
          showLastUpdateTime: process.env.CI === 'true',
        },
        blog: {
          routeBasePath: 'patch-notes',
          path: 'patch-notes',
          blogTitle: '패치 노트',
          blogDescription: 'School KING 업데이트 내역',
          blogSidebarTitle: '전체 패치',
          blogSidebarCount: 'ALL',
          postsPerPage: 10,
          showReadingTime: false,
          authorsMapPath: 'authors.yml',
          onInlineTags: 'ignore',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
          feedOptions: {type: 'rss', title: 'School KING 패치 노트'},
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {autoCollapseCategories: false, hideable: true},
      },
      navbar: {
        title: 'School KING',
        logo: {alt: 'School KING', src: 'img/logo.svg'},
        items: [
          {to: '/patch-notes', label: '패치 노트', position: 'left'},
          {type: 'docSidebar', sidebarId: 'wikiSidebar', position: 'left', label: '위키'},
          {to: '/wiki/modes', label: '모드', position: 'left'},
          {to: '/wiki/weapons', label: '무기', position: 'left'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '위키',
            items: [
              {label: '게임 소개', to: '/wiki/intro'},
              {label: '모드', to: '/wiki/modes'},
              {label: '무기', to: '/wiki/weapons'},
              {label: '조작키', to: '/wiki/controls'},
            ],
          },
          {
            title: '소식',
            items: [{label: '패치 노트', to: '/patch-notes'}],
          },
        ],
        copyright: `© ${new Date().getFullYear()} School KING. Roblox 게임 팬·플레이어를 위한 위키입니다.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
