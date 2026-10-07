/* ==========================================================================
   ACERO VIPER — DADOS CENTRALIZADOS
   Tudo que é conteúdo (textos, imagens, link do grupo) fica aqui.
   Altere aqui, sem mexer nas animações.
   ========================================================================== */

/* >>> LINK DO GRUPO EXCLUSIVO (WhatsApp) — altere apenas esta linha <<< */
export const WHATSAPP_GROUP_URL = "COLE_O_LINK_AQUI";

const A = "assets/"; // caminho relativo (funciona com `npm run dev`, build e abrindo o index.html)

export const product = {
  name: "ACERO VIPER",
  brand: "ACERO",
  model: "VIPER",
  tagline: "DOMINE O TERRENO.",
  heroText: ["Uma nova geração de resistência,", "proteção e performance está chegando."],

  /* As três cores oficiais (fotos reais, fundo removido, mesma escala) */
  colors: [
    {
      name: "PRETA",
      image: A + "product/viper-preta.webp",
      swatch: "#1a1a1a",
      light: "28%", // posição da luz principal nesta etapa
    },
    {
      name: "COYOTE",
      image: A + "product/viper-coyote.webp",
      swatch: "#8a6a45",
      light: "62%",
    },
    {
      name: "AREIA",
      image: A + "product/viper-areia.webp",
      swatch: "#c9ac80",
      light: "40%",
    },
  ],

  /* Transições de cor "troca de escamas" — vídeos gerados no Magnific (start/end = fotos reais),
     fatiados em quadros WebP transparentes (24 fps) e tocados pelo scroll */
  transitions: [
    { from: 0, to: 1, base: A + "sequence/preta-coyote/", count: 86 },
    { from: 1, to: 2, base: A + "sequence/coyote-areia/", count: 96 },
  ],

  /* Tecnologias — textos conforme materiais oficiais. Não adicionar especificações não comprovadas. */
  technologies: [
    {
      id: "ripstop",
      title: "NANO-RIPSTOP",
      label: "resistência",
      headline: "RESISTÊNCIA ONDE MAIS IMPORTA.",
      description:
        "Material desenvolvido para oferecer alta resistência contra rasgos e abrasões.",
      // ponto de foco na bota (0–1, relativo à imagem da cor AREIA) e zoom
      focus: [{ u: 0.64, v: 0.6, scale: 2.7, label: "NANO-RIPSTOP", sub: "resistência" }],
      media: { type: "image", src: A + "details/ripstop-macro.webp", caption: "MACRO · TEXTURA NANO-RIPSTOP" },
    },
    {
      id: "tpu",
      title: "TPU",
      label: "proteção",
      headline: "PROTEÇÃO NOS PONTOS DE IMPACTO.",
      description:
        "Reforços em TPU na região da biqueira e da calcanheira aumentam a proteção e reforçam a estrutura da bota.",
      focus: [
        { u: 0.87, v: 0.66, scale: 2.6, label: "TPU · BIQUEIRA", sub: "proteção" },
        { u: 0.11, v: 0.56, scale: 2.6, label: "TPU · CALCANHEIRA", sub: "estrutura" },
      ],
      media: { type: "zones", items: ["BIQUEIRA", "CALCANHEIRA"] },
    },
    {
      id: "gel",
      title: "GEL PU",
      label: "conforto",
      headline: "CONFORTO PARA CONTINUAR.",
      description:
        "Palmilha em GEL PU desenvolvida para absorver impactos e ajudar a reduzir a fadiga durante o uso prolongado.",
      focus: [{ u: 0.5, v: 0.73, scale: 1.3, label: "PALMILHA GEL PU", sub: "conforto" }],
      media: { type: "impact" },
    },
    {
      id: "solado",
      title: "SOLADO",
      label: "aderência",
      headline: "DOMINE O TERRENO.",
      description:
        "Solado em borracha de alta performance desenvolvido para oferecer aderência e resistência ao desgaste.",
      focus: [{ u: 0.52, v: 0.9, scale: 2.9, label: "SOLADO", sub: "aderência" }],
      media: { type: "image", src: A + "details/solado-areia-800.webp", caption: "BORRACHA · DESENHO DA BANDA DE RODAGEM", contain: true },
    },
  ],

  /* Ficha técnica — somente componentes confirmados nos materiais oficiais.
     Coordenadas relativas à imagem COYOTE. */
  specs: {
    image: A + "details/viper-coyote-spec.webp",
    imageSmall: A + "details/viper-coyote-spec-960.webp",
    points: [
      { id: "cabedal", name: "CABEDAL", text: "Nano-ripstop com reforços em TPU", u: 0.33, v: 0.3, side: "left" },
      { id: "ripstop", name: "NANO-RIPSTOP", text: "Alta resistência contra rasgos e abrasões", u: 0.66, v: 0.62, side: "right" },
      { id: "tpu-b", name: "TPU · BIQUEIRA", text: "Reforço estrutural", u: 0.9, v: 0.72, side: "right" },
      { id: "tpu-c", name: "TPU · CALCANHEIRA", text: "Reforço estrutural", u: 0.07, v: 0.56, side: "left" },
      { id: "palmilha", name: "PALMILHA GEL PU", text: "Absorção de impacto", u: 0.36, v: 0.72, side: "left" },
      { id: "solado", name: "SOLADO", text: "Borracha de alta aderência", u: 0.6, v: 0.9, side: "right" },
    ],
  },

  /* Aplicações — fotos oficiais da campanha */
  applications: [
    { name: "TERRENO", image: A + "applications/terreno.webp", imageSmall: A + "applications/terreno-640.webp" },
    { name: "TRILHA", image: A + "applications/trilha.webp", imageSmall: A + "applications/trilha-640.webp" },
    { name: "OUTDOOR", image: A + "applications/outdoor.webp", imageSmall: A + "applications/outdoor-640.webp" },
    { name: "ROTINA", image: A + "applications/rotina.webp", imageSmall: A + "applications/rotina-640.webp" },
  ],

  cta: {
    primary: "ENTRAR NO GRUPO EXCLUSIVO",
    secondary: "QUERO FAZER PARTE",
    finalHeadline: "SEJA UM DOS PRIMEIROS A SABER.",
    finalText:
      "Entre para o grupo exclusivo de lançamento da ACERO VIPER e receba em primeira mão as novidades, informações e condições especiais do lançamento.",
  },
};
