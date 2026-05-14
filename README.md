# Krypta²

Frontend repository for our cardgourmet platform.

Our Stack:
- Language: https://www.typescriptlang.org/
- Runtime: https://vite.dev/
- Framework: https://react.dev/
- Component Library: https://mantine.dev/
- Routing: https://tanstack.com/router
- Linting and reformatting: https://biomejs.dev/
- Package Management: https://pnpm.io/
- State Management: https://github.com/pmndrs/zustand

To get started run `pnpm install` and then `pnpm dev`. Make sure to have `pnpm` installed beforehand.

## Linter Setup

For IntelliJ there is an official plugin available: https://biomejs.dev/guides/editors/first-party-extensions/#intellij when configured correctly you should have Biome running on save and also during the Strg+Alt+L shortcut.

For VSCode there is, of course, also one available: https://biomejs.dev/guides/editors/first-party-extensions/#vs-code

### Pre-Commit

To make sure the code is always properly formatted, we use [pre-commit](https://pre-commit.com/). To set it up use:

```sh
pip install pre-commit

pre-commit install
```

## Update API Schema

Make sure to have dependencies installed before running the following commands.

```shell
npx openapi-typescript https://api.cardgourmet.dev/openapi.json -o ./src/schema/api.d.ts
```


