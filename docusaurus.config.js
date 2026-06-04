// @ts-check
// SchoolKing 팀 위키 설정
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SchoolKing 위키',
  tagline: '로블록스 SchoolKing 팀 위키',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages 주소
  url: 'https://ghkdlxm005.github.io',
  baseUrl: '/SchoolKing_wiki/',

  // GitHub Pages 배포 설정
  organizationName: 'ghkdlxm005',
  projectName: 'SchoolKing_wiki',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // GitHub에서 바로 수정 링크
          editUrl: 'https://github.com/ghkdlxm005/SchoolKing_wiki/tree/main/',
        },
        blog: {
          blogTitle: '공지·개발일지',
          blogSidebarTitle: '최근 글',
          showReadingTime: false,
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
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
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'SchoolKing 위키',
        logo: {
          alt: 'SchoolKing 로고',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'wikiSidebar',
            position: 'left',
            label: '위키',
          },
          {to: '/blog', label: '공지·개발일지', position: 'left'},
          {
            href: 'https://github.com/ghkdlxm005/SchoolKing_wiki',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '바로가기',
            items: [
              {label: '위키 홈', to: '/docs/intro'},
              {label: '공지·개발일지', to: '/blog'},
              {
                label: 'GitHub 저장소',
                href: 'https://github.com/ghkdlxm005/SchoolKing_wiki',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SchoolKing Team. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
