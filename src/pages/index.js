import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const MODES = [
  {
    to: '/wiki/modes/crown',
    tag: '최대 4인',
    title: '왕관 뺏기',
    desc: '처치로 점수를 모으고 왕관을 지켜라. 1500점 먼저 또는 5분 뒤 최고 점수.',
  },
  {
    to: '/wiki/modes/tennis',
    tag: '1 vs 1',
    title: '1대1 · 테니스장',
    desc: '테니스장에서 벌이는 라운드제 결투. 먼저 5라운드를 따내면 승리.',
  },
  {
    to: '/wiki/modes/ai',
    tag: '혼자',
    title: 'AI 대전',
    desc: '같은 규칙·무기를 쓰는 봇, 연습 상대 CleanUP Alpha와 대결.',
  },
];

const WEAPONS = [
  
  {to: '/wiki/weapons/leg-crutch', name: '목발', role: '자동 소총 · 기본'},
  {to: '/wiki/weapons/compass', name: '컴퍼스', role: '3점사 소총'},
  {to: '/wiki/weapons/toaster', name: '토스터', role: '샷건'},
  {to: '/wiki/weapons/silicon-gun', name: '실리콘건', role: '레이저'},
  {to: '/wiki/weapons/sniper', name: '스나이퍼', role: '저격총'},
  {to: '/wiki/weapons/dustpan', name: '쓰레받이', role: '근접 · 기본'},
];

export default function Home() {
  return (
    <Layout title="홈" description="School KING 공식 위키 — 모드, 무기, 패치 노트">
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.kicker}>ROBLOX · 아레나 무브먼트 슈터</p>
          <h1 className={styles.title}>School KING</h1>
          <p className={styles.lead}>
            교실과 복도가 전장이 된다. 컴퍼스, 목발, 토스터 같은 학교 물건을 무기로 들고
            슬라이딩과 그래플링으로 뛰어다니며 왕관을 차지하자.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/patch-notes">최신 패치 노트</Link>
            <Link className={styles.secondary} to="/wiki/intro">처음 왔다면</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>게임 모드</h2>
            <Link to="/wiki/modes">전체 보기</Link>
          </div>
          <div className={styles.grid3}>
            {MODES.map((m) => (
              <Link key={m.to} to={m.to} className={styles.card}>
                <span className={styles.tag}>{m.tag}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>무기</h2>
            <Link to="/wiki/weapons">수치 비교</Link>
          </div>
          <div className={styles.grid6}>
            {WEAPONS.map((w) => (
              <Link key={w.to} to={w.to} className={styles.weapon}>
                <strong>{w.name}</strong>
                <span>{w.role}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.grid3}>
            <Link to="/wiki/controls" className={styles.card}>
              <h3>조작키</h3>
              <p>사격, 조준, 근접, 투척, 슬라이딩까지 한눈에.</p>
            </Link>
            <Link to="/wiki/movement" className={styles.card}>
              <h3>이동</h3>
              <p>슬라이딩, 벽 튕기기, 집라인, 유리벽 부수기.</p>
            </Link>
            <Link to="/wiki/items" className={styles.card}>
              <h3>투척물·아이템</h3>
              <p>컵·캔, 그래플링 훅, 책, 에너지 드링크, 연막.</p>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
