# @imbrace/ui

Shared React component library for the IMbrace webapp ([`imbrace-fe`](https://github.com/imbraceltd/imbrace-fe)).
Built with React 18 + MUI + Emotion + Vite.

Requirements: Node ≥ 20, pnpm ≥ 9.

## Install & build

```bash
git clone https://github.com/imbraceltd/imbrace-ui.git
cd imbrace-ui
pnpm install
pnpm build        # tsc + vite build → produces dist/ (main.js + main.d.ts)
```

`pnpm build` is required before another project can consume the library —
the package entry points (`dist/main.js`, `dist/main.d.ts`) only exist after a build.

## Use it from imbrace-fe

`imbrace-fe` consumes this library via a relative file path, **not** a package
registry. Clone both repos as siblings and build the UI lib first:

```
parent/
├── imbrace-ui      # build this first → dist/
└── imbrace-fe      # package.json: "@imbrace/ui": "file:../imbrace-ui"
```

After rebuilding `dist/`, run `pnpm install --force` inside `imbrace-fe` to
refresh the cached `file:` link.

## Develop

```bash
pnpm storybook        # Storybook component explorer → http://localhost:6006
pnpm dev              # standalone playground (vite.config.playground.ts)
pnpm lint             # eslint (max-warnings 0)
```

## License

- [`LICENSE.md`](LICENSE.md) — Sustainable Use License (covers files without `.ee.` in path)
- [`LICENSE_EE.md`](LICENSE_EE.md) — Enterprise License (covers files with `.ee.` in path)
