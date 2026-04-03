/**
 * Script de migração de unidades do WordPress para o Strapi
 * Execução: npm run migrate:wp
 */
const axios = require('axios');
const WP_API_URL = 'https://newshoes.com.br/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME || 'newshoes';
const WP_PASSWORD = process.env.WP_PASSWORD || 'O1JftX93HTkZXB1#HG';
/**
 * Busca um termo (cidade/estado) do WordPress
 */
async function getWPTerms(taxonomy) {
    try {
        const response = await axios.get(`${WP_API_URL}/${taxonomy}?per_page=100`);
        return response.data;
    }
    catch (error) {
        console.error(`Erro ao buscar ${taxonomy}:`, error.message);
        return [];
    }
}
/**
 * Busca a mídia (imagem) do WordPress
 */
async function getWPMedia(mediaId) {
    var _a;
    try {
        if (!mediaId)
            return null;
        const response = await axios.get(`${WP_API_URL}/media/${mediaId}`);
        return {
            url: response.data.source_url,
            alt: response.data.alt_text,
            title: (_a = response.data.title) === null || _a === void 0 ? void 0 : _a.rendered,
        };
    }
    catch (error) {
        console.error(`Erro ao buscar mídia ${mediaId}:`, error.message);
        return null;
    }
}
/**
 * Busca todas as unidades do WordPress
 */
async function getAllWPUnidades() {
    try {
        console.log('Buscando unidades do WordPress...');
        const response = await axios.get(`${WP_API_URL}/_unidades_?per_page=100`);
        console.log(`✓ ${response.data.length} unidades encontradas no WordPress`);
        return response.data;
    }
    catch (error) {
        console.error('Erro ao buscar unidades do WordPress:', error.message);
        throw error;
    }
}
/**
 * Obtém nome do estado a partir do ID da taxonomia
 */
async function getEstadoName(estadoId, estados) {
    const estado = estados.find((e) => e.id === estadoId);
    return (estado === null || estado === void 0 ? void 0 : estado.name) || '';
}
/**
 * Obtém nome da cidade a partir do ID da taxonomia
 */
async function getCidadeName(cidadeId, cidades) {
    const cidade = cidades.find((c) => c.id === cidadeId);
    return (cidade === null || cidade === void 0 ? void 0 : cidade.name) || '';
}
/**
 * Extrai dados completos de uma unidade do WordPress
 */
async function extractUnidadeData(wpUnit, estados, cidades) {
    var _a, _b;
    const estadoId = (_a = wpUnit._estado_) === null || _a === void 0 ? void 0 : _a[0];
    const cidadeId = (_b = wpUnit._cidade_) === null || _b === void 0 ? void 0 : _b[0];
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
        imagem: media === null || media === void 0 ? void 0 : media.url,
        imagemAlt: (media === null || media === void 0 ? void 0 : media.alt) || titulo,
    };
}
/**
 * Exporta dados para JSON
 */
async function exportToJSON() {
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
    }
    catch (error) {
        console.error('❌ Erro durante exportação:', error.message);
        process.exit(1);
    }
}
// Executar exportação
exportToJSON();
