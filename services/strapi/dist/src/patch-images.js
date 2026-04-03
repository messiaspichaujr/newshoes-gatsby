/**
 * Patch imagem_url for all existing Strapi unidades.
 * Run once after adding the imagem_url field to the schema:
 *
 *   docker compose exec strapi npx ts-node src/patch-images.ts
 *
 * Requires STRAPI_URL and STRAPI_TOKEN env vars (or falls back to localhost defaults).
 */
const https = require('https');
const http = require('http');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || process.env.STRAPI_GATSBY_TOKEN || 'dev-gatsby-token-change-in-production';
// slug → imagem_url from WordPress
const IMAGE_MAP = {
    'balneario-camboriu': '',
    'bauru-vila-universitaria': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-01-at-11.20.58.jpeg',
    'londrina': 'https://newshoes.com.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-24-at-09.47.22-768x1024.jpeg',
    'belo-horizonte': 'https://newshoes.com.br/wp-content/uploads/2024/12/belo-horizonte-mg.jpg',
    'cachoeira-campo-grande': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-16-at-17.42.06-637x1024.jpeg',
    'cascavel-centro': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-01-at-09.09.13-682x1024.jpeg',
    'centro-caxias-do-sul': 'https://newshoes.com.br/wp-content/uploads/2025/07/Caxias-do-sul-576x1024.jpeg',
    'chapeco': 'https://newshoes.com.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-10-at-11.14.18-1024x768.jpeg',
    'sao-paulo-alphaville': 'https://newshoes.com.br/wp-content/uploads/2025/05/Alphaville-Horizontal-1024x768.jpeg',
    'paineiras-campinas': 'https://newshoes.com.br/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-05-at-09.12.32-1024x768.jpeg',
    'curitiba-seminario': 'https://newshoes.com.br/wp-content/uploads/2024/12/Captura-de-tela-2025-01-26-125558.png',
    'curitiba-cabral': 'https://newshoes.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-06-at-12.00.08-768x1024.jpeg',
    'curitiba-ecoville': 'https://newshoes.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-06-at-12.00.09-768x1024.jpeg',
    'curitiba-merces': 'https://newshoes.com.br/wp-content/uploads/2025/11/loja-merces-1024x576.jpeg',
    'divinopolis': 'https://newshoes.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-30-at-08.41.31.jpeg',
    'dourados': '',
    'fiusa-riberao-preto': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-04-at-16.03.21-768x1024.jpeg',
    'florianopolis-trindade': 'https://newshoes.com.br/wp-content/uploads/2024/12/Adobe-Express-file-1024x820.jpg',
    'goiania-setor-bueno': 'https://newshoes.com.br/wp-content/uploads/2025/05/Setor-Bueno-GO-1024x461.jpeg',
    'grageru-aracaju': 'https://newshoes.com.br/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-16.43.53-768x1024.jpeg',
    'guarapuava-parana': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-16-at-17.31.41-768x1024.jpeg',
    'indaiatuba': 'https://newshoes.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-11-at-11.25.51-576x1024.jpeg',
    'itajai-centro': 'https://newshoes.com.br/wp-content/uploads/2024/12/itajai-sc.jpg',
    'jaragua-do-sul': 'https://newshoes.com.br/wp-content/uploads/2025/07/NS-Jaragua-1024x768.jpeg',
    'joinville-america': '',
    'joinville-anita-garibaldi': 'https://newshoes.com.br/wp-content/uploads/2024/12/WhatsApp-Image-2025-08-01-at-12.50.51-1024x768.jpeg',
    'joinville-saguacu': 'https://newshoes.com.br/wp-content/uploads/2024/12/joinville-saguacu.jpg',
    'macapa-amapa': 'https://newshoes.com.br/wp-content/uploads/2026/02/Macapa-768x1024.jpeg',
    'palmas-centro': 'https://newshoes.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-29-at-10.49.10-1024x768.jpeg',
    'porto-alegre-moinhos': '',
    'recife-casa-forte': 'https://newshoes.com.br/wp-content/uploads/2025/10/CASA-FORTE-1024x768.jpeg',
    'rio-verde-centro': 'https://newshoes.com.br/wp-content/uploads/2025/05/Rio-Verde-Noite-fachada-576x1024.jpeg',
    'pituba-salvador': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-01-at-09.09.11-1-768x1024.jpeg',
    'santos': 'https://newshoes.com.br/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-22-at-19.01.43-768x1024.jpeg',
    'sao-paulo-mooca': 'https://newshoes.com.br/wp-content/uploads/2025/07/NS-Mooca-1024x768.jpeg',
    'savassi': 'https://newshoes.com.br/wp-content/uploads/2026/03/26268943-26cd-4c03-bd1b-49f336a3ba9d-768x1024.jpg',
    'shopping-da-ilha-sao-luis': 'https://newshoes.com.br/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-23-at-09.07.51.jpeg',
    'vilaromana': '',
    'vitoria-da-conquista-candeias': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-01-at-11.17.12-546x1024.jpeg',
    'volta-redonda': 'https://newshoes.com.br/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-05-at-15.01.09-768x1024.jpeg',
};
function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(STRAPI_URL + path);
        const lib = url.protocol === 'https:' ? https : http;
        const data = body ? JSON.stringify(body) : undefined;
        const req = lib.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method,
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            },
        }, (res) => {
            let raw = '';
            res.on('data', (c) => (raw += c));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                }
                catch {
                    resolve(raw);
                }
            });
        });
        req.on('error', reject);
        if (data)
            req.write(data);
        req.end();
    });
}
async function main() {
    var _a;
    console.log(`\n🔄 Patching imagem_url for all unidades at ${STRAPI_URL}\n`);
    const res = await request('GET', '/api/unidades?locale=pt-BR&pagination[pageSize]=100&fields=slug,documentId');
    const units = (res === null || res === void 0 ? void 0 : res.data) || [];
    if (!units.length) {
        console.error('❌ No units returned. Check STRAPI_URL and STRAPI_TOKEN.');
        process.exit(1);
    }
    console.log(`Found ${units.length} units.\n`);
    let updated = 0, skipped = 0, missing = 0;
    for (const unit of units) {
        const slug = unit.slug;
        const imgUrl = IMAGE_MAP[slug];
        if (imgUrl === undefined) {
            console.log(`  ⚠️  ${slug} — not in IMAGE_MAP, skipping`);
            missing++;
            continue;
        }
        if (!imgUrl) {
            console.log(`  —  ${slug} — no image available`);
            skipped++;
            continue;
        }
        const patchRes = await request('PUT', `/api/unidades/${unit.documentId}`, {
            data: { imagem_url: imgUrl },
        });
        if ((_a = patchRes === null || patchRes === void 0 ? void 0 : patchRes.data) === null || _a === void 0 ? void 0 : _a.slug) {
            console.log(`  ✓  ${slug}`);
            updated++;
        }
        else {
            console.log(`  ✗  ${slug} — unexpected response:`, JSON.stringify(patchRes).slice(0, 120));
        }
    }
    console.log(`\nDone. updated=${updated}  no_image=${skipped}  not_mapped=${missing}\n`);
}
main().catch(e => { console.error(e); process.exit(1); });
