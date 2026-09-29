<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Convenções do projeto

Leia o README (seção "Estrutura") antes de alterar código. Resumo:

- Organização por funcionalidade em `src/features/<feature>/{domain,server,client,actions,components}`.
- `domain/` é puro (sem banco, Next ou React) e tem testes em `*.test.ts` ao lado do arquivo.
- Só `server/` acessa o banco (Drizzle). Arquivos de `server/` importam `"server-only"`.
- Toda Server Action começa com `requireEmployee()` ou `requireAdmin()` e valida a entrada com Zod.
- Tudo que varia entre concessionárias fica em `src/tenants/`; componentes usam os tokens do tema (`bg-primary`, `text-foreground`...), nunca cores de marca fixas no código.
- Mudou o schema em `src/shared/db/schema/`? Rode `npm run db:generate -- --name <descricao>` e revise o SQL gerado.
- Nomes em inglês no código; textos de interface, comentários e URLs públicas em português.
- Antes de concluir: `npm run check`.
