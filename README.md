# 🪐 Cometa Delivery

> O Super App Inteligente de Delivery de Angola.

Aplicativo mobile do **Cometa Delivery**, construído em **React Native + Expo Router**, com um Design System próprio inspirado nas Apple Human Interface Guidelines. O objetivo é conectar clientes, restaurantes, mercados, farmácias, lojas e entregadores em Angola através de uma experiência premium, rápida e confiável — e servir de base para o futuro **Cometa Super App** (Ride, Pay, Express, Market, Pharma, Business).

As diretrizes completas de produto, negócio e design vivem em [`CLAUDE.md`](CLAUDE.md) — este README cobre a parte de engenharia: como o projeto está organizado, como rodá-lo e em que estado se encontra.

## Estado atual

Este repositório está na fase de **fundação do Design System**. Não é (ainda) o app completo descrito em `CLAUDE.md` — é a base técnica sobre a qual ele será construído:

- ✅ **Fase 1 — Tokens**: paleta de cores, tipografia, espaçamento, raios, elevação e motion definidos em [`src/constants/theme.ts`](src/constants/theme.ts), seguindo a especificação em [`docs/superpowers/DESIGN-SYSTEM.md`](docs/superpowers/DESIGN-SYSTEM.md) (Apple HIG: Inter, laranja `#FF9500` como cor primária, neutros em escala de cinza, dark mode com preto verdadeiro).
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
cometa/
├── app.json               # Configuração do Expo (nome, bundle id, plugins, EAS)
├── eas.json                # Perfis de build/submit do EAS (development, preview, production)
├── src/
│   ├── app/                # Rotas (Expo Router) — cada arquivo é uma tela
│   │   ├── _layout.tsx     # Layout raiz: carregamento de fontes, Stack, splash screen
│   │   └── index.tsx       # Tela inicial
│   └── constants/
│       └── theme.ts        # Design tokens: colors, typography, spacing, radius, elevation, motion
├── docs/superpowers/
│   ├── DESIGN-SYSTEM.md    # Especificação de design que alimenta theme.ts
│   ├── specs/               # Specs de design (brainstorming) por feature
│   └── plans/               # Planos de implementação por feature
├── CLAUDE.md / AGENTS.md   # Visão de produto, regras de negócio e diretrizes para agentes de IA
└── assets/                  # Ícones e splash screen
```

O alias de import `@/*` aponta para `src/*` (ver `tsconfig.json`) — ex.: `import { colors } from '@/constants/theme'`.

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

Toda a identidade visual (cores, tipografia, espaçamento, raios, sombras, motion) é centralizada em [`src/constants/theme.ts`](src/constants/theme.ts) e documentada em [`docs/superpowers/DESIGN-SYSTEM.md`](docs/superpowers/DESIGN-SYSTEM.md). Nenhum componente deve usar valores de estilo "mágicos" (hex, px) diretamente — sempre importe os tokens do tema.

## Licença

MIT — ver [`LICENSE`](LICENSE).
