# ACERO VIPER — Landing page de lançamento

Experiência de scroll (GSAP + ScrollTrigger + Lenis) construída com Vite, sem framework.

## Ver agora (sem instalar nada)
Abra `dist/index.html` no navegador (duplo clique).
> Aberto direto do disco, o navegador bloqueia as máscaras de luz do produto — a página funciona, mas a iluminação recortada só aparece rodando por servidor (abaixo).

## Rodar em desenvolvimento
Requer Node.js 18+.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

## Gerar versão final
```bash
npm run build      # gera /dist (pronto para subir em qualquer hospedagem)
npm run preview    # testa o /dist em http://localhost:4173
```

## Onde alterar
| O quê | Arquivo |
|---|---|
| **Link do grupo de WhatsApp** | `src/data/product.js` → `WHATSAPP_GROUP_URL` |
| Textos, cores, tecnologias, ficha técnica, aplicações | `src/data/product.js` |
| Linha do tempo do scroll (hero → cores → expansão → tecnologias) | `src/animations/stage.js` |
| Ficha técnica, aplicações, revelação, CTA | `src/animations/sections.js` |
| Visual (cores, tipografia, responsivo) | `src/styles/main.css` |
| Imagens tratadas | `public/assets/` |

Enquanto o link não for definido, os botões levam para a seção final da própria página.

## Estrutura
```
index.html                 estrutura das seções
src/
  main.js                  inicialização (Lenis, loader, progresso, CTA mobile)
  data/product.js          dados centralizados + link do grupo
  components/render.js     monta cores, tecnologias, ficha e aplicações a partir dos dados
  components/cursor.js     cursor customizado (desktop)
  components/particles.js  partículas de poeira
  animations/stage.js      palco principal controlado pelo scroll
  animations/sections.js   demais seções
  styles/main.css
  assets/gravel.webp       textura de cascalho (seção do solado)
public/assets/
  product/                 3 cores com fundo removido, mesma escala e enquadramento
  details/                 macro do nano-ripstop, solado, vista da ficha técnica
  applications/            fotos oficiais da campanha
  brand/                   logo (vetor extraído do logo.pdf oficial)
```

## Troca de cor por "escamas"
- Vídeos gerados no Magnific (Kling 2.5, 1080p) usando as fotos reais como primeiro e último quadro: `videos-magnific/`.
- Cada vídeo foi convertido em quadros WebP com fundo transparente em `public/assets/sequence/` e é tocado pelo scroll num `<canvas>` (`src/components/sequence.js`).
- Os quadros carregam em segundo plano depois que a página abre; se ainda não carregaram, a foto parada é usada no lugar.

## Sobre os assets
- Cores: **PRETA** (`produtos-viper-mid/preta`), **COYOTE** e **AREIA** — fotos reais, só com fundo removido.
- A foto lateral da PRETA foi ampliada 2× no Magnific (modo Precision, sem alterar o design) e espelhada para ficar com a mesma orientação das outras duas.
- Amarelo de destaque `#FFD100` extraído do logo oficial.
- O still explodido do Reels e o banner com componentes mostram um modelo de cano alto e citam itens (EVA, forro antibacteriano, fast rope) que não aparecem nos materiais da Viper mid — por isso não foram usados.
