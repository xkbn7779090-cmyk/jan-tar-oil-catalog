# Jan Tar Art Catalog

A rebuilt bilingual catalog of Jan Tar's oil paintings, based on the artist's current Editorial 2026 database.

**Live site:** [jan-tar-oil-catalog-2026.xkbn.chatgpt.site](https://jan-tar-oil-catalog-2026.xkbn.chatgpt.site)

## Catalog state

- 128 canonical works covering #100–#227
- 258 verified image files, all referenced exactly once
- English and Russian descriptions
- Search, material/size/price/status filters, sorting and responsive layouts
- Accessible detail viewer with image and work navigation
- #123 restored from its two image assets and deliberately marked for review
- #228 image files treated as extra detail views of #227 Long Hush, not as a separate work
- Duplicate records resolved for #150, #198, #199 and #200

The primary editorial source is [Jan Tar — Art Catalog / Editorial 2026](https://app.notion.com/p/3b347eee0e8d8157910de1515a311c28?pvs=204). Painting images are served from the public [Art archive](https://github.com/xkbn7779090-cmyk/Art).

## Local development

```sh
pnpm install
pnpm run catalog:verify
pnpm run dev
```

## Production and Sites checks

```sh
pnpm run build
pnpm run test:sites
```

The production client is emitted to `dist/client`; the Sites-ready worker and metadata are emitted to `dist/server` and `dist/.openai`.

## Catalog data

The normalized catalog is stored in `src/data/catalog.json`, with source-cleanup decisions recorded in `src/data/audit.json`. Visual implementation checks and comparison evidence are documented in `design-qa.md` and `qa/`.
