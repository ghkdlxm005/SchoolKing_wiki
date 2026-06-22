---
title: System Wiki 홈
sidebar_position: 1
slug: /intro
tags: [overview]
---

# 🏫👑 School KING — 시스템 위키

Roblox 게임 **School KING**의 시스템 설계·기록 위키입니다.
이 위키는 **코드보다 위에 있는 구조 레이어**로, 6개월 뒤에도 시스템을 복구할 수 있게 모든 변경을 기록합니다.

## 역할 분담

| 담당 | 일 |
| --- | --- |
| **사람(설계자)** | 시스템 구조 설계, 검증, 버그/기능 기록, 문서화 |
| **Claude(AI)** | 코드 구현 |

## 어디로 갈까

- [🗺️ Project Overview](./overview/index.md) — 전체 그림부터.
- [🏗️ System Architecture](./architecture/index.md) — 게임 시스템 구조.
- [✨ Feature History](./features/index.md) — 무엇을, 왜 추가했나.
- [🐞 Bug History](./bugs/index.md) — 버그와 해결.
- [📘 Lessons Learned](./lessons/index.md) — 재발 방지 규칙.
- [✅ TODO / Future Plan](./todo/index.md) — 다음 할 일.
- [🔑 Keyword Index](./keywords/index.md) — Weapon·Ammo·UI·Event 검색 허브.

## 기록 원칙

1. 모든 변경은 **왜 바꿨는지**를 함께 적는다.
2. 버그는 `BUG-####`, 기능은 `FEAT-####`, 교훈은 `LESSON-####` ID로 관리한다.
3. 새 문서는 `_templates/`의 양식을 복사해 만든다.

> 편집 방법은 [📖 위키 사용법](./위키-사용법/01-위키-둘러보기/index.md) 참고. 검색은 오른쪽 위 🔍.
