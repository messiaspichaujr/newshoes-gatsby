/**
 * Script de migração de unidades do WordPress para o Strapi
 * Execução: npm run migrate:wp
 */

const axios = require('axios');

const WP_API_URL = 'https://newshoes.com.br/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME || 'newshoes';
const WP_PASSWORD = process.env.WP_PASSWORD || 'O1JftX93HTkZXB1#HG';

interface WPUnidade {
  id: number;
  title: { rendered: string };
  slug: string;
  featured_media: number;
  _cidade_?: number[];
  _estado_?: number[];
}

interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

/**
 * Busca um termo (cidade/estado) do WordPress
 */
async function getWPTerms(taxonomy: string): Promise<WPTerm[]> {
  try {
    const response = await axios.get(`${WP_API_URL}/${taxonomy}?per_page=100`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ${taxonomy}:`, error.message);
    return [];
  }
}

/**
 * Busca a mídia (imagem) do WordPress
 */
async function getWPMedia(mediaId: number): Promise<any> {
  try {
    if (!mediaId) return null;
    const response = await axios.get(`${WP_API_URL}/media/${mediaId}`);
    return {
      url: response.data.source_url,
      alt: response.data.alt_text,
      title: response.data.title?.rendered,
    };
  } catch (error) {
    console.error(`Erro ao buscar mídia ${mediaId}:`, error.message);
    return null;
  }
}

/**
 * Busca todas as unidades do WordPress
 */
async function getAllWPUnidades(): Promise<WPUnidade[]> {
  try {
    console.log('Buscando unidades do WordPress...');
    const response = await axios.get(`${WP_API_URL}/_unidades_?per_page=100`);
    console.log(`✓ ${response.data.length} unidades encontradas no WordPress`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar unidades do WordPress:', error.message);
    throw error;
  }
}

/**
 * Obtém nome do estado a partir do ID da taxonomia
 */
async function getEstadoName(estadoId: number, estados: WPTerm[]): Promise<string> {
  const estado = estados.find((e) => e.id === estadoId);
  return estado?.name || '';
}

/**
 * Obtém nome da cidade a partir do ID da taxonomia
 */
async function getCidadeName(cidadeId: number, cidades: WPTerm[]): Promise<string> {
  const cidade = cidades.find((c) => c.id === cidadeId);
  return cidade?.name || '';
}

/**
 * Extrai dados completos de uma unidade do WordPress
 */
async function extractUnidadeData(
  wpUnit: WPUnidade,
  estados: WPTerm[],
  cidades: WPTerm[]
): Promise<any> {
  const estadoId = wpUnit._estado_?.[0];
  const cidadeId = wpUnit._cidade_?.[0];

  const estado = estadoId ? await getEstadoName(estadoId, estados) : '';
  const cidade = cidadeId ? await getCidadeName(cidadeId, cidades) : '';
  const media = wpUnit.featured_media ? await getWPMedia(wpUnit.featured_media) : null;

  // Remove HTML tags do título
  const titulo = wpUnit.title.rendered.replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—').replace(/&([a-z0-9]+);/gi, '');

  return {
    nome: titulo,
    slug: wpUnit.slug,
    estado,
    cidade,
    imagem: media?.url,
    imagemAlt: media?.alt || titulo,
  };
}

/**
 * Exporta dados para JSON
 */
async function exportToJSON(): Promise<void> {
  try {
    console.log('\n📦 Iniciando exportação de dados do WordPress...\n');

    // Buscar taxonomias
    const [estados, cidades] = await Promise.all([getWPTerms('_estado_'), getWPTerms('_cidade_')]);

    console.log(`✓ Encontrados ${estados.length} estados`);
    console.log(`✓ Encontradas ${cidades.length} cidades\n`);

    // Buscar unidades
    const unidades = await getAllWPUnidades();

    // Extrair dados de cada unidade
    console.log('Processando unidades...');
    const unidadesData = [];

    for (const unit of unidades) {
      const data = await extractUnidadeData(unit, estados, cidades);
      unidadesData.push(data);
      process.stdout.write('.');
    }

    console.log('\n');
    console.log(`✓ ${unidadesData.length} unidades processadas com sucesso\n`);

    // Salvar em arquivo JSON
    const fs = require('fs');
    const outputPath = `${__dirname}/../../unidades-wp-export.json`;
    fs.writeFileSync(outputPath, JSON.stringify(unidadesData, null, 2));

    console.log(`📄 Dados exportados para: ${outputPath}`);
    console.log('\nAmostra dos dados:');
    console.log(JSON.stringify(unidadesData.slice(0, 2), null, 2));
  } catch (error) {
    console.error('❌ Erro durante exportação:', error.message);
    process.exit(1);
  }
}

// Executar exportação
exportToJSON();
