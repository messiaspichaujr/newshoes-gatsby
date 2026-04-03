#!/usr/bin/env node

/**
 * Script de migração de unidades do WordPress para o Strapi
 * Execução: node scripts/migrate-wp-unidades.js
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');

const WP_API_URL = 'https://newshoes.com.br/wp-json/wp/v2';
const STRAPI_API_URL = 'http://localhost:1337/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || 'dev-gateway-token-change-in-production';

// Axios instances
const wpClient = axios.create({
  baseURL: WP_API_URL,
  timeout: 10000,
});

const strapiClient = axios.create({
  baseURL: STRAPI_API_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
});

/**
 * Parse HTML entities
 */
function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'");
}

/**
 * Busca todos os termos (taxonomias) do WordPress
 */
async function getWPTerms(taxonomy) {
  try {
    const response = await wpClient.get(`/${taxonomy}?per_page=100`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar ${taxonomy}:`, error.message);
    return [];
  }
}

/**
 * Busca informações de mídia do WordPress
 */
async function getWPMedia(mediaId) {
  try {
    if (!mediaId) return null;
    const response = await wpClient.get(`/media/${mediaId}`);
    return {
      url: response.data.source_url,
      alt: response.data.alt_text || response.data.title?.rendered,
      title: response.data.title?.rendered,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extrai conteúdo da unidade (descrição, endereço, etc)
 */
async function getWPPostContent(postId) {
  try {
    const response = await wpClient.get(`/_unidades_/${postId}`);
    return response.data.content?.rendered || '';
  } catch (error) {
    return '';
  }
}

/**
 * Busca todas as unidades do WordPress
 */
async function getAllWPUnidades() {
  try {
    console.log('📍 Buscando unidades do WordPress...');
    const response = await wpClient.get('/_unidades_?per_page=100');
    console.log(`✓ ${response.data.length} unidades encontradas`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar unidades:', error.message);
    throw error;
  }
}

/**
 * Encontra um termo pelo ID
 */
function getTermName(termId, terms) {
  const term = terms.find((t) => t.id === termId);
  return term?.name || '';
}

/**
 * Extrai dados de uma unidade do WordPress
 */
async function extractUnidadeData(wpUnit, estados, cidades) {
  const estadoId = wpUnit._estado_?.[0];
  const cidadeId = wpUnit._cidade_?.[0];

  const estado = estadoId ? getTermName(estadoId, estados) : '';
  const cidade = cidadeId ? getTermName(cidadeId, cidades) : '';
  const media = wpUnit.featured_media ? await getWPMedia(wpUnit.featured_media) : null;

  const nome = decodeHTMLEntities(wpUnit.title.rendered);

  return {
    nome,
    slug: wpUnit.slug,
    estado,
    cidade,
    endereco: '',
    whatsapp: '',
    whatsapp_sem_tracos: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  };
}

/**
 * Cria ou atualiza unidade no Strapi
 */
async function createOrUpdateUnidade(data) {
  try {
    // Verifica se já existe (por slug)
    const existingResponse = await strapiClient.get('/unidades', {
      params: {
        filters: {
          slug: {
            $eq: data.slug,
          },
        },
      },
    });

    const existing = existingResponse.data.data;

    if (existing && existing.length > 0) {
      // Atualizar
      const id = existing[0].id;
      await strapiClient.put(`/unidades/${id}`, {
        data,
      });
      return { id, status: 'updated' };
    } else {
      // Criar novo
      const response = await strapiClient.post('/unidades', {
        data,
      });
      return { id: response.data.data.id, status: 'created' };
    }
  } catch (error) {
    console.error(`❌ Erro ao processar ${data.slug}:`, error.response?.data?.error?.message || error.message);
    throw error;
  }
}

/**
 * Salva logs de migração
 */
function saveMigrationLog(results) {
  const logPath = path.join(__dirname, '../migration-log.json');
  const timestamp = new Date().toISOString();
  
  const summary = {
    timestamp,
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    failed: results.filter((r) => r.status === 'failed').length,
    details: results,
  };

  fs.writeFileSync(logPath, JSON.stringify(summary, null, 2));
  console.log(`\n📋 Log salvo em: ${logPath}`);
  return summary;
}

/**
 * Função principal de migração
 */
async function migrate() {
  try {
    console.log('\n🚀 Iniciando migração de unidades do WordPress para Strapi...\n');

    // 1. Buscar taxonomias do WordPress
    console.log('📚 Buscando taxonomias do WordPress...');
    const [estados, cidades] = await Promise.all([
      getWPTerms('_estado_'),
      getWPTerms('_cidade_'),
    ]);

    console.log(`✓ ${estados.length} estados encontrados`);
    console.log(`✓ ${cidades.length} cidades encontradas\n`);

    // 2. Buscar unidades do WordPress
    const wpUnidades = await getAllWPUnidades();

    // 3. Processar e migrar cada unidade
    console.log('📤 Importando unidades no Strapi...\n');
    const results = [];

    for (let i = 0; i < wpUnidades.length; i++) {
      const unit = wpUnidades[i];
      process.stdout.write(`[${i + 1}/${wpUnidades.length}] Processando ${unit.title.rendered}...`);

      try {
        const unidadeData = await extractUnidadeData(unit, estados, cidades);
        const result = await createOrUpdateUnidade(unidadeData);
        console.log(` ✓ ${result.status.toUpperCase()}`);
        results.push({
          id: result.id,
          nome: unidadeData.nome,
          slug: unidadeData.slug,
          status: result.status,
        });
      } catch (error) {
        console.log(` ❌ ERRO`);
        results.push({
          nome: unit.title.rendered,
          slug: unit.slug,
          status: 'failed',
          error: error.message,
        });
      }
    }

    // 4. Salvar logs e exibir resultado
    console.log('\n');
    const summary = saveMigrationLog(results);

    console.log('\n✅ MIGRAÇÃO CONCLUÍDA!');
    console.log(`   Total processado: ${summary.total}`);
    console.log(`   Criadas: ${summary.created}`);
    console.log(`   Atualizadas: ${summary.updated}`);
    console.log(`   Falhadas: ${summary.failed}\n`);

    process.exit(summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Erro fatal durante migração:', error.message);
    process.exit(1);
  }
}

// Executar
migrate();
