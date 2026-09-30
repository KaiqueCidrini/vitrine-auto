# Vitrine Auto

Site de estoque para concessionárias, feito para ser revendido: o mesmo código atende vários clientes, e cada concessionária ganha a própria identidade visual trocando um arquivo de configuração.

O visitante navega pelo estoque, filtra, vê fotos e ficha técnica, e agenda uma visita pelo WhatsApp com a mensagem já preenchida (nome do carro, preço e link). Os funcionários entram num painel restrito para cadastrar e gerenciar os anúncios.

## Stack

| Camada       | Tecnologia                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------ |
| Front e back | Next.js 16 (App Router, Server Components, Server Actions) + React 19 + TypeScript estrito |
| Estilo       | Tailwind CSS 4, com tema por variáveis CSS                                                 |
| Banco        | PostgreSQL 17 + Drizzle ORM (migrations em SQL versionadas no Git)                         |
| Login        | Better Auth (e-mail e senha, sem cadastro público, perfis gerente/vendedor)                |
| Fotos        | sharp (redimensiona, converte para WebP e remove EXIF) + disco local, Vercel Blob ou S3/R2 |
| Validação    | Zod (mesmo schema no formulário e no servidor)                                             |
| Testes       | Vitest                                                                                     |
| Deploy       | Docker Compose + Caddy (HTTPS automático)                                                  |

## Rodando localmente

Pré-requisitos: Node.js 22.12+ e um PostgreSQL. O Docker é só um jeito de ter o Postgres; escolha uma das opções abaixo.

### 1. Banco de dados

**Opção A: Docker**

```bash
docker compose up -d db
```

O `DATABASE_URL` do `.env.example` já aponta para ele.

**Opção B: Postgres na nuvem, grátis e sem instalar nada (bom para testar)**

1. Crie uma conta no [Neon](https://neon.tech) ou no [Supabase](https://supabase.com) e crie um projeto (escolha a região mais próxima, ex.: São Paulo).
2. Copie a _connection string_ do painel. Ela parece com `postgresql://usuario:senha@host/banco?sslmode=require`.
3. Cole em `DATABASE_URL` no seu `.env`, trocando `sslmode=require` por `sslmode=verify-full` (a conexão é a mesma; só evita um aviso do driver do Postgres no terminal).

**Opção C: Postgres instalado na máquina**

Instale pelo [instalador oficial](https://www.postgresql.org/download/). No Windows, o instalador pede uma senha para o usuário `postgres`: use essa senha no `.env`. Não precisa criar o banco; o `npm run db:migrate` cria sozinho.

```
DATABASE_URL=postgres://postgres:SUA_SENHA@localhost:5432/vitrine
```

### 2. Aplicação

```bash
cp .env.example .env    # no Windows (PowerShell): copy .env.example .env
# ajuste o DATABASE_URL conforme a opção escolhida acima
npm install
npm run db:migrate      # cria as tabelas
npm run admin:create    # pergunta nome, e-mail e senha do primeiro gerente
npm run demo:seed       # opcional: 9 carros fictícios com fotos ilustrativas
npm run dev
```

Site: http://localhost:3000 · Painel: http://localhost:3000/admin

## Comandos

| Comando                                   | O que faz                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`                             | Servidor de desenvolvimento                                                    |
| `npm run check`                           | Typecheck + lint + testes (rode antes de cada commit)                          |
| `npm run db:generate -- --name descricao` | Gera uma migration SQL a partir das mudanças no schema                         |
| `npm run db:migrate`                      | Aplica as migrations pendentes                                                 |
| `npm run db:studio`                       | Interface visual para ver o banco                                              |
| `npm run admin:create`                    | Cria um gerente (pergunta os dados; também aceita `--name --email --password`) |
| `npm run demo:seed`                       | Estoque fictício para demonstração                                             |
| `npm run photos:cleanup`                  | Apaga fotos enviadas há mais de 24h que não foram salvas em nenhum anúncio     |

## Estrutura

A organização é por funcionalidade: tudo que é de "veículos" mora junto. Dentro de cada funcionalidade, as pastas dizem onde o código roda.

```
src/
  app/                      Rotas (só compõem telas; sem regra de negócio)
    (public)/               Site: home, /veiculos, /veiculos/[slug]
    admin/                  Login e painel (/admin/veiculos, /admin/equipe, /admin/conta)
    api/auth/               Endpoints do Better Auth
    media/                  Entrega das fotos quando o storage é local
  features/
    vehicles/
      domain/               Regras puras: atributos, formatação, slug, filtros, schema do formulário
      server/               Consultas e gravações no banco, processamento de fotos (server-only)
      client/               Código que roda só no navegador (ex.: reduzir fotos antes do envio)
      actions/              Server Actions: validam, conferem login, chamam o server/
      components/           Componentes do site e do painel (admin/)
    auth/                   Login, sessão, perfis e troca de senha
    team/                   Gestão de funcionários
    contact/                Link e botões de WhatsApp
    home/                   Seções configuráveis da página inicial
    site/                   Cabeçalho e rodapé
  shared/                   Peças sem regra de negócio: db, storage, ui, env, utilitários
  tenants/                  Configuração de cada concessionária
database/migrations/        SQL gerado pelo Drizzle (revisado e versionado)
scripts/                    Migrations, criação de gerente, seed e limpeza
```

Regras que mantêm o código organizado:

- `domain/` não importa nada de banco, Next ou React, e é onde ficam os testes unitários.
- Só `server/` fala com o banco. Componentes e páginas recebem dados prontos (com URLs das fotos já resolvidas).
- Toda Server Action começa com `requireEmployee()` ou `requireAdmin()`. O `proxy.ts` é só uma checagem rápida de cookie; a proteção de verdade está nas actions e páginas.
- Dinheiro é guardado em centavos (`priceInCents`), nunca em número decimal.
- Nomes em inglês no código; textos e URLs em português, que é o que o visitante e o Google veem.

## Criando um cliente novo

1. **Configuração**: copie `src/tenants/demo/` para `src/tenants/<slug-do-cliente>/`, renomeie a constante e preencha nome, cores, fontes, contato, WhatsApp, horários, mensagens e seções da home. O TypeScript e o Zod apontam qualquer campo errado.
2. **Registro**: adicione o cliente em `src/tenants/tenant-registry.ts`.
3. **Arquivos**: coloque o logo (e, se quiser, a imagem do topo e uma versão clara do logo em `logo.srcOnDark`) em `public/tenants/<slug>/`.
4. **Teste**: `npm test` valida todas as configurações, inclusive se o logo existe. Rode `TENANT=<slug> npm run dev` para ver o resultado.
5. **Deploy**: no servidor do cliente, `TENANT=<slug>` no `.env`.

O que dá para mudar só pela configuração:

- **Cores**: 13 cores, incluindo cabeçalho e rodapé. O esquema claro ou escuro é detectado sozinho.
- **Fonte**: Inter, Montserrat ou Outfit no texto; nos títulos, opcionalmente uma serifada (`headingFont`: Playfair Display, Cormorant Garamond ou Fraunces) para um visual mais editorial.
- **Cantos**: arredondamento dos cantos, de reto até bem arredondado. Os botões podem ser "pílula" (`buttonShape: "pill"`, padrão) ou seguir os cantos do tema (`"rounded"`).
- **Logo claro**: `logo.srcOnDark` é usado no cabeçalho transparente, sobre o banner da home, quando o banner é escuro.
- **Home**: ordem e conteúdo das seções (topo, destaques, atalhos por carroceria, diferenciais, chamada de contato).
- **Textos**: mensagens do WhatsApp e SEO.

Os exemplos `demo` e `premium-example` mostram dois visuais bem diferentes com o mesmo código.

Para adicionar uma fonte, instale o pacote `@fontsource-variable/<fonte>`, declare em `src/shared/theme/fonts.ts` e inclua em `FONT_OPTIONS` (texto) ou `HEADING_FONT_OPTIONS` (títulos).

As animações (entrada do banner, itens surgindo ao rolar, carrosséis) ficam em `globals.css`, `shared/ui/reveal.tsx` e `shared/ui/scroll-carousel.tsx`. Elas respeitam a opção "reduzir movimento" do sistema e, sem JavaScript, o conteúdo aparece normalmente. Para um tipo novo de seção na home, adicione o schema em `tenant-config-schema.ts` e o componente em `features/home/sections/`. O `switch` de `home-sections.tsx` acusa erro de compilação se faltar o componente.

## Deploy na Vercel

Bom para testar e evoluir o projeto sem custo, com tudo num painel só. Atenção: o plano gratuito (Hobby) da Vercel é só para uso pessoal, sem fins comerciais. Com cliente pagando, use o plano Pro ou a VPS descrita mais abaixo.

Na Vercel não existe disco permanente nem servidor ligado o tempo todo, então os dados ficam em dois serviços criados pela própria aba **Storage** do projeto:

| O quê | Serviço                         | Grátis no Hobby                                        |
| ----- | ------------------------------- | ------------------------------------------------------ |
| Banco | **Neon** (Postgres, via Vercel) | plano gratuito do Neon, sem cartão                     |
| Fotos | **Vercel Blob** (store público) | 1 GB de armazenamento e 10 GB de transferência por mês |

Você não cria conta no Neon nem copia senha: a Vercel cria o banco e o Blob e injeta as credenciais (`DATABASE_URL`, `BLOB_STORE_ID` etc.) no projeto sozinha. No Hobby não há cobrança surpresa: se passar do limite gratuito, o serviço é pausado em vez de cobrar.

O código já está preparado: as fotos são reduzidas no navegador antes do envio (a Vercel limita cada envio a 4,5 MB) e convertidas para WebP no servidor (cada foto fica com uns 150 a 300 KB, então 1 GB guarda alguns milhares), as conexões com o banco são ajustadas automaticamente, as migrations rodam sozinhas a cada deploy de produção e o `vercel.json` coloca as funções em São Paulo (`gru1`).

### 1. Código no GitHub

Crie um repositório **privado** no GitHub e envie o projeto (no VS Code: aba _Source Control_ → _Publish to GitHub_). O `.env` fica de fora automaticamente pelo `.gitignore`.

### 2. Projeto na Vercel

1. Em [vercel.com](https://vercel.com), entre com a conta do GitHub, clique em **Add New** → **Project** e importe o repositório.
2. Antes de clicar em **Deploy**, abra **Environment Variables** e cadastre:

   | Variável             | Valor                                                                                               |
   | -------------------- | --------------------------------------------------------------------------------------------------- |
   | `BETTER_AUTH_SECRET` | um texto aleatório de 32+ caracteres (gere com `openssl rand -base64 32` ou num gerador de senhas)  |
   | `APP_URL`            | `https://nome-do-projeto.vercel.app` (o nome aparece nessa mesma tela; troque quando tiver domínio) |
   | `TENANT`             | `demo` ou a pasta do seu cliente em `src/tenants/`                                                  |
   | `STORAGE_DRIVER`     | `vercel-blob`                                                                                       |

3. Clique em **Deploy**. **Esse primeiro deploy vai falhar**, porque o banco ainda não existe. É esperado: siga para o passo 3.

### 3. Banco e fotos pela aba Storage

1. No projeto, abra a aba **Storage** → **Create Database** → **Neon** → **Continue**.
   - Região: **São Paulo** (`sa-east-1`), ou a mais próxima que aparecer, para ficar perto das funções.
   - Plano: **Free**.
   - Em **Connect to project**, deixe marcados os três ambientes (Development, Preview e Production) e confirme.
2. Ainda em **Storage**, clique em **Create Database** (ou **Create**) → **Blob**.
   - Acesso: **Public**. Isso é importante: as fotos dos anúncios precisam abrir para qualquer visitante, e o tipo de acesso não pode ser trocado depois.
   - Região: **São Paulo** (`gru1`), ou a mais próxima que aparecer.
   - Conecte ao projeto nos três ambientes.
3. Confira em **Settings** → **Environment Variables** que apareceram `DATABASE_URL` (e outras do Neon) e `BLOB_STORE_ID`.
4. Vá em **Deployments**, clique nos **⋯** do último deploy → **Redeploy**. Agora o build cria as tabelas no banco sozinho (no log aparece "Migrations aplicadas com sucesso.") e o site sobe.

### 4. Primeiro gerente

O cadastro do primeiro gerente é feito uma vez, da sua máquina, apontando para o banco da Vercel:

1. Copie o valor de `DATABASE_URL`: em **Settings** → **Environment Variables**, clique na variável para revelar o valor. Outra opção: aba **Storage** → banco Neon → **.env.local** → **Show secret**.
2. No PowerShell, dentro da pasta do projeto:

   ```powershell
   $env:DATABASE_URL="cole-aqui-o-valor-copiado"
   npm run admin:create
   ```

   A variável vale só para aquele terminal; feche-o depois para voltar a usar o banco local.

3. Abra `https://nome-do-projeto.vercel.app/admin` e entre com o gerente criado. Os vendedores são cadastrados pelo próprio painel, em **Equipe**.

### 5. Domínio próprio

1. Registre o domínio no [Registro.br](https://registro.br) (cerca de R$ 40 por ano para `.com.br`).
2. Na Vercel: **Settings** → **Domains** → **Add Domain**, digite o domínio e aceite a sugestão de redirecionar entre `www` e o domínio sem `www`.
3. A Vercel mostra os registros DNS para cadastrar: um **A** para o domínio sem `www` e um **CNAME** para o `www`. Copie exatamente os valores exibidos no painel.
4. No Registro.br, abra o domínio → **DNS** → **Editar zona** (se pedir, ative o modo avançado) e crie esses dois registros.
5. Aguarde a Vercel marcar o domínio como válido (de minutos a algumas horas). O HTTPS é emitido automaticamente.
6. Troque `APP_URL` para o endereço principal (ex.: `https://www.seudominio.com.br`) e faça **Redeploy**. O login do painel só funciona no endereço que está no `APP_URL`.

### Atualizações e cuidados

- Cada `git push` na branch principal gera um deploy novo automaticamente. Se a atualização trouxer migration nova (arquivo novo em `database/migrations/`), ela é aplicada no próprio build de produção; se a migration falhar, o deploy falha e o site continua na versão anterior.
- Deploys de _preview_ (outras branches) não rodam migrations e têm outro endereço, então o login não funciona neles. Teste o painel no endereço principal.
- Sempre que mudar uma variável de ambiente, faça **Redeploy**: `STORAGE_DRIVER` e `TENANT` entram no build.
- Acompanhe o consumo em **Usage**. Cada foto enviada conta uma operação de escrita no Blob (o Hobby inclui 2 mil por mês); visualizações de fotos já em cache não contam.
- Navegar pelo navegador de arquivos do Blob no painel da Vercel também gasta operações; evite ficar atualizando essa tela.
- O limite de tentativas de login fica em memória; na Vercel ele é menos eficaz, porque cada instância tem a sua. Para produção de verdade, mova o contador para o banco.

### Alternativa: fotos no Cloudflare R2

Se passar de 1 GB de fotos e não quiser pagar a Vercel, o projeto também funciona com o Cloudflare R2 (10 GB grátis, pede cartão para ativar). Crie um bucket com URL pública e um token com permissão **Object Read & Write**, e troque as variáveis:

| Variável               | Valor                                           |
| ---------------------- | ----------------------------------------------- |
| `STORAGE_DRIVER`       | `s3`                                            |
| `S3_BUCKET`            | nome do bucket                                  |
| `S3_REGION`            | `auto`                                          |
| `S3_ENDPOINT`          | `https://<account-id>.r2.cloudflarestorage.com` |
| `S3_ACCESS_KEY_ID`     | do token do R2                                  |
| `S3_SECRET_ACCESS_KEY` | do token do R2                                  |
| `S3_PUBLIC_URL`        | URL pública do bucket                           |

As fotos já enviadas continuam no Blob; a troca vale para os envios novos, então faça isso antes de ter muitos anúncios.

## Deploy em VPS

Qualquer VPS com Docker serve (Hostinger, DigitalOcean, Hetzner, Contabo, Magalu Cloud etc.). Uma máquina com 1 vCPU e 2 GB de RAM dá conta de uma concessionária (o build da imagem é a parte mais pesada: com 2 GB, configure 2 GB de swap).

```bash
# no servidor
git clone <seu-repositorio> vitrine && cd vitrine
cp .env.example .env
# edite o .env: TENANT, APP_URL=https://dominio, DOMAIN, senhas e BETTER_AUTH_SECRET (openssl rand -base64 32)

docker compose --profile production up -d --build
docker compose run --rm tools npm run admin:create -- --name "Gerente" --email gerente@loja.com.br --password "senhaForte123"
```

Aponte o DNS do domínio (registro A) para o IP da VPS antes de subir; o Caddy emite o certificado HTTPS sozinho.

A ordem de subida é garantida pelo compose: banco saudável, depois migrations aplicadas, depois app. Para atualizar a versão:

```bash
git pull && docker compose --profile production up -d --build
```

Tarefas de rotina (agende no `crontab -e` do servidor):

```bash
# limpeza diária de fotos enviadas e nunca salvas
0 4 * * * cd /caminho/vitrine && docker compose run --rm tools npm run photos:cleanup
# backup diário do banco
30 3 * * * cd /caminho/vitrine && docker compose exec -T db pg_dump -U vitrine vitrine | gzip > /backups/vitrine-$(date +\%F).sql.gz
```

As fotos ficam no volume `media-storage`. Inclua esse volume no backup, ou use `STORAGE_DRIVER=s3` com Cloudflare R2 (sem custo de saída de dados), que também tira a carga de imagens do servidor.

## Decisões técnicas

- **Um deploy por cliente**: isolamento total de dados, personalização sem risco de afetar outro cliente e custo previsível. Se um dia virar SaaS multi-cliente, o `tenants/` já concentra tudo que varia.
- **Drizzle em vez de Liquibase**: schema e tipos no mesmo lugar (TypeScript), migrations em SQL legível e versionado, sem Java no deploy.
- **Texto + CHECK em vez de enum do Postgres**: adicionar um valor (ex.: nova carroceria) é uma migration simples.
- **Páginas renderizadas a cada acesso**: o estoque muda o tempo todo e o volume de uma concessionária é baixo. As imagens são otimizadas e cacheadas pelo `next/image`.
- **Uma foto por requisição no upload**: nenhum envio fica grande, o funcionário vê o progresso e uma foto com problema não derruba as outras.
- **Sem cadastro público**: o gerente cria as contas. Vendedor gerencia anúncios; gerente também gerencia a equipe.

## Próximos passos sugeridos

- Testes E2E com Playwright (login, cadastro com foto, vitrine) no CI.
- Contagem de cliques no botão de WhatsApp por veículo (métrica que ajuda a vender o produto).
- Sitemap (`app/sitemap.ts`) com todos os veículos publicados.
- Reordenar fotos arrastando (hoje é por botões, que também funcionam no teclado).
