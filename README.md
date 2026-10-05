# Chá de bebê da Helena

Convite online do chá de bebê da Helena: animação de amanhecer, endereço, confirmação de presença pelo WhatsApp e lista de presentes por Pix.

Site estático, sem build. Abra o `index.html` no navegador para testar.

## Estrutura

```
index.html          página do convite
css/style.css       estilos
js/main.js          confirmação, presentes e animação
js/config.js        telefone, Pix e endereço (fora do repositório)
js/config.example.js modelo do config.js
.github/workflows/  publicação automática com os secrets
assets/             vídeo do convite, capa do link e ícone
```

## Rodar local

Os dados sensíveis ficam em `js/config.js`, que está no `.gitignore`. Se o arquivo não existir, copie o modelo e preencha:

```bash
cp js/config.example.js js/config.js
```

Depois abra o `index.html` ou rode `python -m http.server 8000`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo, `cha-da-helena`) e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "Convite do chá de bebê da Helena"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/cha-da-helena.git
   git push -u origin main
   ```

2. Em **Settings > Secrets and variables > Actions**, crie estes secrets:

   | Secret | Exemplo |
   | --- | --- |
   | `WHATS` | `5531999999999` |
   | `PIX_KEY` | chave Pix |
   | `PIX_NAME` | nome de quem recebe |
   | `ENDERECO` | `Rua, número, cidade - UF, CEP` |
   | `LUGAR` | `Chácara Só Sossego` |

3. Em **Settings > Pages**, em **Source**, escolha **GitHub Actions**.
4. Em **Actions**, rode o workflow "Publicar no GitHub Pages" (ou faça um novo push). O site fica em `https://SEU-USUARIO.github.io/cha-da-helena/`.

O workflow gera o `js/config.js` com os secrets na hora de publicar.

## Editar os dados

- Telefone, Pix e endereço: `js/config.js` no seu computador e os secrets no GitHub.
- Lista de presentes: `GIFTS`, no começo de `js/main.js`, no formato `["Nome", "Descrição", valor]`.
- Data, horário e nome do local que aparecem na animação: `index.html`, dentro de `<div class="stage">`.

## Prévia do link no WhatsApp

Para a imagem de capa aparecer ao colar o link, troque no `index.html` o `og:image` pelo endereço completo depois de publicar:

```html
<meta property="og:image" content="https://SEU-USUARIO.github.io/cha-da-helena/assets/capa.jpg">
```

## Privacidade

Os secrets tiram o telefone, a chave Pix e o endereço do código e do histórico do repositório. Eles continuam visíveis no site publicado, porque o convite precisa mostrar esses dados a quem abre o link. A página tem `noindex` para não aparecer em buscadores.
