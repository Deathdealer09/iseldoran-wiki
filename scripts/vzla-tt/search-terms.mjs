#!/usr/bin/env node
/*
 * Search vocabulary for the "Venezuelans in Trinidad" study.
 *
 * Three layers, because a single-language term list under-samples badly:
 *
 *   seed      - the terms named in the research brief
 *   expansion - Venezuelan Spanish, Trinidadian English, slang, place names and
 *               the vocabulary of the crossing itself
 *   hashtag   - platform-native tags, which surface content that keyword search
 *               misses entirely
 *
 * `platform_query: true` marks terms suitable for an API keyword field. Long
 * conversational phrases are left false: they work when a human searches, but
 * behave poorly as API keywords and burn quota.
 *
 * Discovery is expected to be iterative. Terms found in collected material
 * should be added here with kind "discovered" so the vocabulary and the study
 * grow together, and so a later reader can see how the sample was reached.
 */

/** @typedef {{term:string, lang:string, kind:string, platform_query:boolean, note?:string}} Term */

/** @type {Term[]} */
export const SEARCH_TERMS = [
  /* -- Seed terms from the brief --------------------------------------- */
  { term: "venezolanos en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "venezolanos Trinidad y Tobago", lang: "es", kind: "seed", platform_query: true },
  { term: "vivir en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "trabajar en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "Trinidad vs Venezuela", lang: "es", kind: "seed", platform_query: true },
  { term: "vida en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "me fui a Trinidad", lang: "es", kind: "seed", platform_query: false },
  { term: "regresar a Venezuela", lang: "es", kind: "seed", platform_query: true },
  { term: "volver a Venezuela", lang: "es", kind: "seed", platform_query: true },
  { term: "venezolana en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "venezolano en Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "Trinidad Tobago venezolanos", lang: "es", kind: "seed", platform_query: true },
  { term: "migrantes venezolanos Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "cómo tratan a los venezolanos en Trinidad", lang: "es", kind: "seed", platform_query: false },
  { term: "trabajo para venezolanos Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "experiencia Trinidad venezolano", lang: "es", kind: "seed", platform_query: false },
  { term: "extraño Venezuela", lang: "es", kind: "seed", platform_query: true },
  { term: "prefiero Trinidad", lang: "es", kind: "seed", platform_query: true },
  { term: "prefiero Venezuela", lang: "es", kind: "seed", platform_query: true },

  /* -- Venezuelan Spanish and slang ------------------------------------- */
  { term: "chamo Trinidad", lang: "es-VE", kind: "expansion", platform_query: true, note: "chamo: mate, guy" },
  { term: "pana en Trinidad", lang: "es-VE", kind: "expansion", platform_query: true, note: "pana: friend" },
  { term: "me vine pa Trinidad", lang: "es-VE", kind: "expansion", platform_query: false, note: "colloquial para -> pa" },
  { term: "irse pa Trinidad", lang: "es-VE", kind: "expansion", platform_query: false },
  { term: "conseguir trabajo en Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "cuánto se gana en Trinidad", lang: "es", kind: "expansion", platform_query: false },
  { term: "alquiler en Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "comida venezolana Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "arepas en Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "remesas a Venezuela", lang: "es", kind: "expansion", platform_query: true },
  { term: "mandar dinero a Venezuela", lang: "es", kind: "expansion", platform_query: true },

  /* -- Status, documents, authorities ----------------------------------- */
  { term: "registro venezolanos Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "permiso de trabajo Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "deportación venezolanos Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "inmigración Trinidad venezolanos", lang: "es", kind: "expansion", platform_query: true },
  { term: "ACNUR Trinidad", lang: "es", kind: "expansion", platform_query: true, note: "UNHCR in Spanish" },

  /* -- The crossing ------------------------------------------------------ */
  { term: "Güiria Trinidad", lang: "es", kind: "expansion", platform_query: true, note: "main departure port" },
  { term: "peñero Trinidad", lang: "es", kind: "expansion", platform_query: true, note: "small boat" },
  { term: "cruzar a Trinidad", lang: "es", kind: "expansion", platform_query: true },
  { term: "Cedros Icacos venezolanos", lang: "en", kind: "expansion", platform_query: true, note: "arrival points" },

  /* -- Trinidadian English and place names ------------------------------ */
  { term: "Venezuelans in Trinidad", lang: "en", kind: "expansion", platform_query: true },
  { term: "Venezuelan migrants Trinidad", lang: "en", kind: "expansion", platform_query: true },
  { term: "Spanish speaking Trinidad", lang: "en", kind: "expansion", platform_query: false },
  { term: "Venezolana Trini", lang: "en", kind: "expansion", platform_query: true },
  { term: "venezolanos Chaguanas", lang: "es", kind: "expansion", platform_query: true },
  { term: "venezolanos Port of Spain", lang: "es", kind: "expansion", platform_query: true },
  { term: "venezolanos San Fernando", lang: "es", kind: "expansion", platform_query: true },
  { term: "venezolanos Arima", lang: "es", kind: "expansion", platform_query: true },

  /* -- Comparison and intention ----------------------------------------- */
  { term: "mejor en Trinidad que en Venezuela", lang: "es", kind: "expansion", platform_query: false },
  { term: "me quiero devolver a Venezuela", lang: "es", kind: "expansion", platform_query: false },
  { term: "vale la pena Trinidad", lang: "es", kind: "expansion", platform_query: false },
  { term: "xenofobia Trinidad", lang: "es", kind: "expansion", platform_query: true },

  /* -- Hashtags ---------------------------------------------------------- */
  { term: "#venezolanosentrinidad", lang: "es", kind: "hashtag", platform_query: true },
  { term: "#venezolanosentt", lang: "es", kind: "hashtag", platform_query: true },
  { term: "#venezolanosenelexterior", lang: "es", kind: "hashtag", platform_query: true },
  { term: "#trinidadandtobago", lang: "en", kind: "hashtag", platform_query: true },
  { term: "#venezuelaytrinidad", lang: "es", kind: "hashtag", platform_query: true },
  { term: "#migrantesvenezolanos", lang: "es", kind: "hashtag", platform_query: true },
];

/** Terms suitable for an API keyword field. */
export const queryTerms = () => SEARCH_TERMS.filter((t) => t.platform_query).map((t) => t.term);

/** Terms meant for a human searching by hand, including conversational phrases. */
export const manualTerms = () => SEARCH_TERMS.map((t) => t.term);
