# Diego Peres — Portfólio Pessoal

Site pessoal em página única (HTML5, CSS3 e JavaScript puro, sem build e sem
dependências de backend), pronto para ser publicado no GitHub Pages.

## Estrutura

```
/
├── index.html          # Conteúdo e estrutura da página
├── css/
│   └── style.css        # Estilos (tema dark/light, layout, animações)
├── js/
│   └── script.js         # Configuração de links, tema, menu e animações
├── assets/
│   ├── favicon.svg       # Ícone da aba do navegador
│   └── og-image.svg      # Imagem de pré-visualização (Open Graph)
├── .nojekyll             # Evita processamento Jekyll no GitHub Pages
└── README.md
```

Abra `index.html` diretamente no navegador — não é necessário servidor local
nem processo de build.

## Personalização

Tudo que precisa ser editado está marcado no código com `PERSONALIZAR`.

### 1. Links (LinkedIn, GitHub) e e-mail

Os dados pessoais nao precisam ficar no codigo versionado. O site le os
valores de [`js/site-config.js`](js/site-config.js), e o workflow
[`deploy-pages.yml`](.github/workflows/deploy-pages.yml) gera esse arquivo
durante o deploy no GitHub Pages.

Crie estas variaveis em **Settings -> Secrets and variables -> Actions**:

- `EMAIL`
- `USER_GITHUB`
- `USER_LINKEDIN`

O workflow aceita tanto **Variables** quanto **Secrets** com esses nomes.

Depois disso, o deploy gera este bloco automaticamente:

```js
window.SITE_CONFIG = {
  linkedin: "https://www.linkedin.com/in/SEU_USUARIO/",
  github: "https://github.com/SEU_USUARIO",
  email: "seuemail@dominio.com",
};
```

Esses valores preenchem automaticamente os botoes e links do site.

Para testar localmente sem commitar seus dados, copie
[`js/site-config.local.example.js`](js/site-config.local.example.js) para
`js/site-config.local.js` e preencha com seus valores. Esse arquivo esta no
`.gitignore` e sobrescreve a configuracao publica apenas no seu ambiente.

### 2. Experiência profissional

Edite a lista `<ol class="timeline">` na seção `#experiencia` em
[`index.html`](index.html). Cada item (`<li class="timeline__item">`) tem
período, cargo, empresa e descrição.

### 3. Textos, SEO e Open Graph

O texto de "Sobre mim" está na seção `#sobre`. As tags de SEO/Open Graph
(`<meta name="description">`, `og:title`, `og:image`, `og:url`,
`rel="canonical"`) estão no `<head>` de `index.html` — atualize `og:url` e
`canonical` para a URL final do seu site.

### 4. Tema

O site abre em **dark mode** por padrão. O botão no menu alterna para o modo
claro e salva a preferência em `localStorage`. As cores ficam em variáveis
CSS no início de [`css/style.css`](css/style.css) (`:root` e
`:root[data-theme="light"]`).

## Publicar no GitHub Pages

1. Faça commit e push destes arquivos para o repositório
   `SEU-USUARIO.github.io` (ou qualquer outro repositório, se preferir
   publicar em um subcaminho).
2. No GitHub, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **Source: Deploy from a branch**.
4. Escolha a branch (`main` ou `master`) e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará disponível em:
   - `https://SEU-USUARIO.github.io` (se o repositório se chamar
     `SEU-USUARIO.github.io`), ou
   - `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` (para qualquer
     outro nome de repositório).

## Configurar um domínio próprio

1. No seu provedor de DNS, crie os registros apontando para o GitHub Pages:
   - Para um domínio raiz (`seudominio.com`): registros **A** apontando para
     os IPs do GitHub Pages (`185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`).
   - Para um subdomínio (`www.seudominio.com`): registro **CNAME** apontando
     para `SEU-USUARIO.github.io`.
2. No repositório, vá em **Settings → Pages → Custom domain**, informe o
   domínio e salve. O GitHub cria automaticamente um arquivo `CNAME` na raiz
   do repositório.
3. Marque a opção **Enforce HTTPS** assim que o certificado estiver
   disponível (pode levar alguns minutos após a configuração do DNS).
4. Atualize as tags `og:url` e `canonical` em `index.html` para o novo
   domínio.
