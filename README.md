# 🪐 Kometa Delivery

> O Super App Inteligente de Delivery de Angola.

Aplicativo mobile do **Kometa Delivery**, construído em **React Native + Expo Router**, com um Design System próprio inspirado nas Apple Human Interface Guidelines. O objetivo é conectar clientes, restaurantes, mercados, farmácias, lojas e entregadores em Angola através de uma experiência premium, rápida e confiável — e servir de base para o futuro **Kometa Super App** (Ride, Pay, Express, Market, Pharma, Business).

As diretrizes completas de produto, negócio e design vivem em [`CLAUDE.md`](CLAUDE.md) — este README cobre a parte de engenharia: como o projeto está organizado, como rodá-lo e em que estado se encontra.

## Estado atual

Este repositório está na fase de **fundação do Design System**. Não é (ainda) o app completo descrito em `CLAUDE.md` — é a base técnica sobre a qual ele será construído:

- ✅ **Fase 1 — Tokens**: paleta de cores, tipografia, espaçamento, raios, elevação e motion definidos em [`apps/mobile/src/theme/`](apps/mobile/src/theme/), documentados em [`docs/superpowers/DESIGN-SYSTEM.md`](docs/superpowers/DESIGN-SYSTEM.md). Sistema **neutral-first**: verde-jade da marca (`#0A7D53`) reservado para CTA, estado ativo, preço e progresso; neutros carregam 70–80% da interface. Poppins para display/headings, Inter para corpo, rótulos e numerais. Dark mode com base near-black (`#0E1013`), nunca preto absoluto.
- 🚧 **Fase 2 — Atoms**: biblioteca de componentes base (Button, Text, TextField, Icon, Avatar, Badge, Chip, Switch, Checkbox, Radio) em desenho — ver `docs/superpowers/specs/`.
- ⏳ **Próximas fases**: Molecules, Organisms, Templates e as telas de produto (onboarding, home, checkout, tracking).

O app hoje renderiza apenas uma tela mínima (`src/app/index.tsx`) — suficiente para validar que a fundação (tema, fontes, roteamento) funciona de ponta a ponta antes de construir a UI de produto em cima dela.

## Stack tecnológica

| Categoria | Tecnologia |
|---|---|
| Framework | [Expo](https://docs.expo.dev/versions/v57.0.0/) SDK 57 + React Native 0.86 + React 19 |
| Roteamento | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, `src/app`) |
| Linguagem | TypeScript |
| Estilização | [styled-components](https://styled-components.com/docs/basics#react-native) (`styled-components/native`) |
| Tipografia | [Inter](https://github.com/expo/google-fonts) via `@expo-google-fonts/inter` |
| Persistência local | `@react-native-async-storage/async-storage` |
| Build & distribuição | [EAS Build](https://docs.expo.dev/build/introduction/), [EAS Update](https://docs.expo.dev/eas-update/introduction/) |
| Testes | Jest + `jest-expo` |

## Estrutura do projeto

```
kometa/
├── app.json               # Configuração do Expo (nome, bundle id, plugins, EAS)
├── eas.json                # Perfis de build/submit do EAS (development, preview, production)
├── src/
│   ├── app/                # Rotas (Expo Router) — cada arquivo é uma tela
│   │   ├── _layout.tsx     # Layout raiz: carregamento de fontes, Stack, splash screen
│   │   └── index.tsx       # Tela inicial
│   └── theme/              # Design tokens — única fonte de verdade visual
│       ├── palette.ts      # Escalas brutas (o único arquivo com hex literais)
│       ├── semantic.ts     # Tokens semânticos light + dark
│       ├── roles.ts        # Vocabulário de foreground/fill para Text, Icon, Badge
│       ├── typography.ts   # Famílias + escala tipográfica
│       ├── spacing.ts      # Grade de 4pt + constantes de layout
│       ├── radius.ts
│       ├── shadows.ts      # Quatro níveis de elevação, por esquema
│       ├── motion.ts
│       └── mixins.ts       # elevate() / textStyle() / continuousCorners
├── docs/superpowers/
│   ├── DESIGN-SYSTEM.md    # Documentação do Design System (espelha src/theme/)
│   ├── specs/               # Specs de design (brainstorming) por feature
│   └── plans/               # Planos de implementação por feature
├── CLAUDE.md / AGENTS.md   # Visão de produto, regras de negócio e diretrizes para agentes de IA
└── assets/                  # Ícones e splash screen
```

O alias de import `@/*` aponta para `src/*` (ver `tsconfig.json`) — ex.: `import { spacing, radius } from '@/theme'`.

À medida que novas features forem implementadas, esta árvore crescerá seguindo a arquitetura modular descrita em `CLAUDE.md` (`modules/`, `components/`, `hooks/`, `services/` por domínio: delivery, checkout, orders, tracking, wallet, etc.).

## Como começar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- npm
- Um simulador iOS/Android configurado, o app **Expo Go**, ou um dev client (`npx expo run:ios` / `run:android`)

### Instalação

```bash
npm install
```

### Rodar o app

```bash
npx expo start        # abre o Metro bundler — escaneie o QR code ou escolha uma plataforma
npm run ios           # abre diretamente no simulador iOS
npm run android       # abre diretamente no emulador Android
npm run web           # abre no navegador
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm start` | Inicia o Expo/Metro bundler |
| `npm run ios` / `npm run android` / `npm run web` | Inicia o bundler já direcionado para a plataforma |
| `npm test` | Roda a suíte de testes (Jest) |
| `npm run eas:build:dev` / `:preview` / `:prod` | Builds EAS por ambiente (com variantes `:ios` / `:android`) |
| `npm run eas:submit:ios` / `:android` | Submete o build de produção às lojas |
| `npm run eas:update` / `:preview` / `:prod` | Publica uma atualização OTA via EAS Update |

## Testes

```bash
npm test
```

Testes ficam colocados ao lado do código que testam (`*.test.ts`), usando Jest com o preset `jest-expo`.

## Design System

Toda a identidade visual (cores, tipografia, espaçamento, raios, sombras, motion) é centralizada em [`apps/mobile/src/theme/`](apps/mobile/src/theme/) e documentada em [`docs/superpowers/DESIGN-SYSTEM.md`](docs/superpowers/DESIGN-SYSTEM.md). Nenhum componente deve usar valores de estilo "mágicos" (hex, px) diretamente — sempre importe os tokens do tema.

Contraste WCAG é verificado em [`apps/mobile/src/theme/contrast.test.ts`](apps/mobile/src/theme/contrast.test.ts) contra os tokens reais, nos dois esquemas de cor: é portão de build, não recomendação.

## Licença

MIT — ver [`LICENSE`](LICENSE).
