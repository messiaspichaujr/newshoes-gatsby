const crypto = require('crypto');

const unidades = [
  { nome: "Balneário Camboriú", slug: "balneario-camboriu", endereco: "Rua Itália 333 - Nações, Balneário Camboriú", whatsapp: "+55 (47) 92663729", whatsapp_sem_tracos: "5547992663729", instagram: "https://www.instagram.com/newshoes.bc/", estado: "SC", cidade: "Balneário Camboriú" },
  { nome: "Bauru - Vila Universitária", slug: "bauru-vila-universitaria", endereco: "Rua Antônio Alves 29-43, Vila Universitária, Bauru/SP", whatsapp: "(14) 99905-0011", whatsapp_sem_tracos: "14999050011", instagram: "@newshoes.bauru", estado: "SP", cidade: "Bauru" },
  { nome: "Bela Suiça - Londrina", slug: "londrina", endereco: "Rua Adhemar Pereira de Barros, 1600, Londrina 86047250", whatsapp: "+55 (43) 88489088", whatsapp_sem_tracos: "554388489088", instagram: "https://www.instagram.com/newshoes.londrina/", estado: "PR", cidade: "Londrina" },
  { nome: "Belo Horizonte - Buritis", slug: "belo-horizonte", endereco: "Av. Professor Mário Werneck, 2249 - Loja 03 - Buritis - CEP 30575-180", whatsapp: "3198778639", whatsapp_sem_tracos: "+55 (31) 9877-8639", instagram: "https://www.instagram.com/newshoes.buritis/", estado: "MG", cidade: "Belo Horizonte" },
  { nome: "Cachoeira - Campo Grande", slug: "cachoeira-campo-grande", endereco: "Rua Jeribá, 452 - Chácara Cachoeira, Campo Grande, 79040120", whatsapp: "(67) 99977-1720", whatsapp_sem_tracos: "67999771720", instagram: "https://www.instagram.com/newshoes.chacara_cachoeira/", estado: "MS", cidade: "Campo Grande" },
  { nome: "Cascavel - Centro", slug: "cascavel-centro", endereco: "R. São Paulo, 2452 - Centro, Cascavel - PR, 85801-021, Brasil", whatsapp: "(45) 98431-7843", whatsapp_sem_tracos: "45984317843", instagram: "@newshoes.cascavelcentro", estado: "PR", cidade: "Cascavel" },
  { nome: "Centro - Caxias do Sul", slug: "centro-caxias-do-sul", endereco: "Rua Marques do Herval 491,LJ 02, Centro, Caxias do Sul 95020260", whatsapp: "+55 (54) 999548899", whatsapp_sem_tracos: "+55 (54) 999548899", instagram: "https://www.instagram.com/newshoescaxiasdosul/", estado: "RS", cidade: "Caxias do Sul" },
  { nome: "Chapecó", slug: "chapeco", endereco: "R. Rui Barbosa, 1131 - Centro Chapecó - SC, 89801-147", whatsapp: "(49) 9167-3390", whatsapp_sem_tracos: "4991673390", instagram: "https://www.instagram.com/newshoes.chapecocentro/", estado: "SC", cidade: "Chapecó" },
  { nome: "São Paulo - Alphaville", slug: "sao-paulo-alphaville", endereco: "Calçada das Azaleias, 62 — Centro Comercial Alphaville.", whatsapp: "+55 (11) 98912-4265", whatsapp_sem_tracos: "5511989124265", instagram: "https://www.instagram.com/newshoes.alphaville/", estado: "SP", cidade: "Barueri" },
  { nome: "Campinas - Paineiras", slug: "paineiras-campinas", endereco: "Av. José Bonifácio, 1536, Jd. Paineiras, Campinas/SP", whatsapp: "(19) 98123-5393", whatsapp_sem_tracos: "19981235393", instagram: "https://www.instagram.com/newshoes.paineiras/", estado: "SP", cidade: "Campinas" },
  { nome: "Curitiba - Batel", slug: "curitiba-seminario", endereco: "R. Bpo. Dom José, 2725 - Seminário, Curitiba - PR, 80440-165", whatsapp: "(41) 99879-8214", whatsapp_sem_tracos: "41998798214", instagram: "https://www.instagram.com/newshoes.batel/", estado: "PR", cidade: "Curitiba" },
  { nome: "Curitiba - Cabral", slug: "curitiba-cabral", endereco: "Av. Paraná, 756 - Cabral, Curitiba - PR, 80035-130", whatsapp: "41 9879-8214", whatsapp_sem_tracos: "4198798214", instagram: "https://www.instagram.com/newshoes.curitiba/", estado: "PR", cidade: "Curitiba" },
  { nome: "Curitiba - Ecoville", slug: "curitiba-ecoville", endereco: "R. Paulo Gorski, 861 - Mossunguê, Curitiba - PR, 81200-000", whatsapp: "41 9607-3079", whatsapp_sem_tracos: "4196073079", instagram: "https://www.instagram.com/newshoes.curitiba/", estado: "PR", cidade: "Curitiba" },
  { nome: "Curitiba - Mercês", slug: "curitiba-merces", endereco: "Alameda Augusto Stellfeld, 600 - Centro, Curitiba - PR, 80410-140", whatsapp: "41 9879-8214", whatsapp_sem_tracos: "4198798214", instagram: "https://www.instagram.com/newshoes.curitiba/", estado: "PR", cidade: "Curitiba" },
  { nome: "Divinópolis", slug: "divinopolis", endereco: "Av. JK, 1712 - Bom Pastor, Divinópolis - MG - CEP: 35500-155", whatsapp: "(37) 9952-8759", whatsapp_sem_tracos: "3799528759", instagram: "https://www.instagram.com/newshoes.divinopolis/", estado: "MG", cidade: "Divinópolis" },
  { nome: "Dourados", slug: "dourados", endereco: "Rua Doutor Camilo Ermelindo da Silva, 1150 - D Vila Planalto", whatsapp: "67 99900-6680", whatsapp_sem_tracos: "67999006680", instagram: "https://www.instagram.com/newshoes.dourados/", estado: "MS", cidade: "Dourados" },
  { nome: "Ribeirão Preto - Fiusa", slug: "fiusa-riberao-preto", endereco: "Avenida Professor João Fiúsa, 2.700 - Alto da Boa Vista, Ribeirão Preto - SP, 14024-260.", whatsapp: "(016)99755-4070", whatsapp_sem_tracos: "16997554070", instagram: "https://www.instagram.com/newshoes.fiusa/", estado: "SP", cidade: "Ribeirão Preto" },
  { nome: "Florianópolis - Trindade", slug: "florianopolis-trindade", endereco: "R. Lauro Linhares, 796 - Loja 06 - Trindade, Florianópolis - SC, 88036-001", whatsapp: "(48) 98821-1991", whatsapp_sem_tracos: "48988211991", instagram: "https://www.instagram.com/newshoes.trindade/", estado: "SC", cidade: "Florianópolis" },
  { nome: "Goiânia - Setor Bueno", slug: "goiania-setor-bueno", endereco: "Av. T-4, 327 - Setor Bueno Goiânia, Brazil", whatsapp: "+55 (62) 8117-6888", whatsapp_sem_tracos: "6281176888", instagram: "https://www.instagram.com/newshoes.bueno/", estado: "GO", cidade: "Goiânia" },
  { nome: "Aracaju - Grageru", slug: "grageru-aracaju", endereco: "Rua manoel espirito santo 165 loja 1 Grageru, Aracaju - SE 49025-440", whatsapp: "+55 79 99808 6688", whatsapp_sem_tracos: "(79) 99808 6688", instagram: "https://www.instagram.com/newshoes.grageru/", estado: "SE", cidade: "Aracaju" },
  { nome: "Guarapuava", slug: "guarapuava-parana", endereco: "Rua Marechal Floriano Peixoto, 2549 - Centro", whatsapp: "(42) 98401-2048", whatsapp_sem_tracos: "42984012048", instagram: "https://www.instagram.com/newshoes.guarapuava/", estado: "PR", cidade: "Guarapuava" },
  { nome: "Indaiatuba", slug: "indaiatuba", endereco: "R. Humaitá, 678 - Vila Almeida, Indaiatuba - SP, 13330-665", whatsapp: "(19) 97171-7075", whatsapp_sem_tracos: "19971717075", instagram: "https://www.instagram.com/newshoes.indaiatuba/", estado: "SP", cidade: "Indaiatuba" },
  { nome: "Itajaí - Centro", slug: "itajai-centro", endereco: "Rua Abercio Werner, 42- SL 02. Centro, Itajaí-SC 88302-050", whatsapp: "(47) 99132-8082", whatsapp_sem_tracos: "47991328082", instagram: "https://www.instagram.com/newshoes.itajai/", estado: "SC", cidade: "Itajaí" },
  { nome: "Jaraguá do Sul", slug: "jaragua-do-sul", endereco: "Rua Frederico Curt Alberto Vasel, 11 - Vila Nova, Jaraguá do Sul 89259510", whatsapp: "+55 (47) 991155625", whatsapp_sem_tracos: "5547991155625", estado: "SC", cidade: "Jaraguá do Sul" },
  { nome: "Joinville - América", slug: "joinville-america", endereco: "R. Jaraguá, 617 - América, Joinville - SC, 89204-650", estado: "SC", cidade: "Joinville" },
  { nome: "Joinville - Anita Garibaldi", slug: "joinville-anita-garibaldi", endereco: "R. Anita Garibaldi, 413 - Anita Garibaldi, Joinville - SC, 89203-300", whatsapp: "+55 (47) 9229-0117", whatsapp_sem_tracos: "4792290117", instagram: "https://www.instagram.com/lavanderianewshoes/", estado: "SC", cidade: "Joinville" },
  { nome: "Joinville - Saguaçu", slug: "joinville-saguacu", endereco: "Rua Itaiópolis 1874 - Saguaçu, 89221-155", whatsapp: "(47) 99229-0117", whatsapp_sem_tracos: "47992290117", instagram: "https://www.instagram.com/lavanderianewshoes/", estado: "SC", cidade: "Joinville" },
  { nome: "Macapá", slug: "macapa-amapa", endereco: "Av. Profa. Cora de Carvalho, 1520 - Central, Macapá, CEP: 68.900-040 AP Macapá", whatsapp: "(96) 98437-6914", whatsapp_sem_tracos: "96984376914", instagram: "https://www.instagram.com/newshoes.macapa/", estado: "AP", cidade: "Macapá" },
  { nome: "Palmas - Centro", slug: "palmas-centro", endereco: "Av. LO 5, 13 - Quadra 206 - Plano Diretor Sul, Palmas - TO, 77021-026", whatsapp: "(63) 99135-0615", whatsapp_sem_tracos: "63991350615", instagram: "https://www.instagram.com/newshoes.palmascentro/", estado: "TO", cidade: "Palmas" },
  { nome: "Porto Alegre - Moinhos", slug: "porto-alegre-moinhos", endereco: "Rua Professor Carmen de Souza Santos, 149 - Rio Branco, 90420-105", whatsapp: "(51) 99747-6940", whatsapp_sem_tracos: "51997476940", instagram: "http://www.instagram.com/newshoes.moinhos", estado: "RS", cidade: "Porto Alegre" },
  { nome: "Recife - Casa Forte", slug: "recife-casa-forte", endereco: "Rua do Chacon, 82, Casa Forte, Recife, 52061-400", whatsapp: "(81) 98245-2107", whatsapp_sem_tracos: "81982452107", instagram: "https://www.instagram.com/newshoes.casaforte/", estado: "PE", cidade: "Recife" },
  { nome: "Rio Verde - Centro", slug: "rio-verde-centro", endereco: "Rua Gumercindo Ferreira, 138, centro Rio Verde, Goias, Brazil", whatsapp: "+55 (64) 9307-3243", whatsapp_sem_tracos: "6493073243", instagram: "https://www.instagram.com/newshoes.rioverde/", estado: "GO", cidade: "Rio Verde" },
  { nome: "Salvador - Pituba", slug: "pituba-salvador", endereco: "R. Minas Gerais, 95 loja 2- Pituba Salvador - BA, 41830-020", whatsapp: "(71) 99627-0177", whatsapp_sem_tracos: "71 996270177", instagram: "@newshoes.pituba", estado: "BA", cidade: "Salvador" },
  { nome: "Santos", slug: "santos", endereco: "Rua Goiás 160 - Gonzaga, Santos, Sao Paulo, Brazil 11050101", whatsapp: "13996110404", whatsapp_sem_tracos: "13996110404", instagram: "https://www.instagram.com/newshoes.santos/", estado: "SP", cidade: "Santos" },
  { nome: "São Paulo - Mooca", slug: "sao-paulo-mooca", endereco: "Av Paes de Barros, 420 - Mooca São Paulo, Brazil", whatsapp: "+55 (11) 91070-0934", whatsapp_sem_tracos: "11910700934", instagram: "https://www.instagram.com/newshoes.mooca/", estado: "SP", cidade: "São Paulo" },
  { nome: "Belo Horizonte - Savassi", slug: "savassi", endereco: "Rua Piauí, 1291 - B. Funcionários - Belo Horizonte - BH - CEP: 30150-323 BH", whatsapp: "31 99966-1291", whatsapp_sem_tracos: "31999661291", instagram: "https://www.instagram.com/newshoes.bhsul/", estado: "MG", cidade: "Belo Horizonte" },
  { nome: "São Luís - Shopping da Ilha", slug: "shopping-da-ilha-sao-luis", endereco: "Av. Daniel de La Touche 987 | Cohama Shopping da Ilha | Piso 1 | São Luis | MA", whatsapp: "98 99982-8935", whatsapp_sem_tracos: "98999828935", instagram: "https://www.instagram.com/newshoes.shoppingdailha/", estado: "MA", cidade: "São Luís" },
  { nome: "São Paulo - Vila Romana", slug: "vilaromana", endereco: "Rua Tito, 1053 - Bairro Vila Romana - São Paulo/SP", whatsapp: "11 94559-9459", whatsapp_sem_tracos: "11945599459", instagram: "https://www.instagram.com/newshoes.vilaromana", estado: "SP", cidade: "São Paulo" },
  { nome: "Vitória da Conquista - Candeias", slug: "vitoria-da-conquista-candeias", endereco: "Av. Rosa Cruz, 1188 - 05 - Candeias, Vitória da Conquista - BA, 45020-200", whatsapp: "(77) 99979 - 2025", whatsapp_sem_tracos: "77999792025", instagram: "@newshoes.conquista", estado: "BA", cidade: "Vitória da Conquista" },
  { nome: "Volta Redonda", slug: "volta-redonda", endereco: "Rua 33, nº 65 – Vila Santa Cecília – Volta Redonda – CEP 27260-010", whatsapp: "(24) 99205-1514", whatsapp_sem_tracos: "24992051514", instagram: "https://www.instagram.com/newshoes.voltaredonda/", estado: "RJ", cidade: "Volta Redonda" },
];

export default async ({ strapi }) => {
  // 1. Seed unidades
  const count = await strapi.db.query('api::unidade.unidade').count();
  if (count === 0) {
    strapi.log.info(`Seed: importing ${unidades.length} unidades...`);
    for (const u of unidades) {
      const doc = await strapi.documents('api::unidade.unidade').create({
        data: u,
        locale: 'pt-BR',
      });
      await strapi.documents('api::unidade.unidade').publish({
        documentId: doc.documentId,
        locale: 'pt-BR',
      });
    }
    strapi.log.info(`Seed: ${unidades.length} unidades imported successfully.`);
  } else {
    strapi.log.info(`Seed: ${count} unidades already exist, skipping data import.`);
  }

  // 2. Ensure i18n locales (ll-CC pattern: pt-BR, en-US, es-ES)
  const requiredLocales = [
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'en-US', name: 'English (United States)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
  ];

  for (const loc of requiredLocales) {
    const exists = await strapi.db.query('plugin::i18n.locale').findOne({
      where: { code: loc.code },
    });
    if (!exists) {
      await strapi.db.query('plugin::i18n.locale').create({
        data: { code: loc.code, name: loc.name },
      });
      strapi.log.info(`Seed: created locale ${loc.code}`);
    }
  }

  // Remove default 'en' locale (we use en-US instead)
  const legacyEn = await strapi.db.query('plugin::i18n.locale').findOne({
    where: { code: 'en' },
  });
  if (legacyEn) {
    await strapi.db.query('plugin::i18n.locale').delete({ where: { id: legacyEn.id } });
    strapi.log.info('Seed: removed legacy "en" locale (using en-US instead)');
  }

  // Set pt-BR as default locale
  const store = strapi.store({ type: 'plugin', name: 'i18n' });
  const currentDefault = await store.get({ key: 'default_locale' });
  if (currentDefault !== 'pt-BR') {
    await store.set({ key: 'default_locale', value: 'pt-BR' });
    strapi.log.info('Seed: set default locale to pt-BR');
  }

  // 3. Set public permissions for unidade API
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (publicRole) {
    const permissions = [
      { action: 'api::unidade.unidade.find', role: publicRole.id },
      { action: 'api::unidade.unidade.findOne', role: publicRole.id },
    ];

    for (const perm of permissions) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action: perm.action, role: perm.role },
      });
      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: perm,
        });
      }
    }
    strapi.log.info('Seed: public permissions set for unidades API.');
  }

  // 4. Create admin user if none exists
  const adminCount = await strapi.db.query('admin::user').count();
  if (adminCount === 0) {
    const adminEmail = process.env.STRAPI_ADMIN_EMAIL || 'admin@newshoes.com.br';
    const adminPassword = process.env.STRAPI_ADMIN_PASSWORD || 'Admin1234!';
    const adminFirstName = process.env.STRAPI_ADMIN_FIRSTNAME || 'Admin';
    const adminLastName = process.env.STRAPI_ADMIN_LASTNAME || 'NewShoes';

    const superAdminRole = await strapi.db.query('admin::role').findOne({
      where: { code: 'strapi-super-admin' },
    });

    if (superAdminRole) {
      const hashedPassword = await strapi.service('admin::auth').hashPassword(adminPassword);
      await strapi.db.query('admin::user').create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstname: adminFirstName,
          lastname: adminLastName,
          isActive: true,
          blocked: false,
          roles: [superAdminRole.id],
        },
      });
      strapi.log.info(`Seed: admin user created (${adminEmail})`);
    }
  }

  // 5. Create API token for Gatsby if it doesn't exist
  const existingGatsbyToken = await strapi.db.query('admin::api-token').findOne({
    where: { name: 'gatsby' },
  });
  if (!existingGatsbyToken) {
    const plainToken = process.env.STRAPI_GATSBY_TOKEN || 'dev-gatsby-token-change-in-production';
    const salt = strapi.config.get('admin.apiToken.salt') ||
                 process.env.API_TOKEN_SALT ||
                 'strapiTokenSalt123';
    const hashedToken = crypto.createHmac('sha512', salt).update(plainToken).digest('hex');

    await strapi.db.query('admin::api-token').create({
      data: {
        name: 'gatsby',
        description: 'Full access token for Gatsby frontend',
        type: 'full-access',
        accessKey: hashedToken,
      },
    });
    strapi.log.info('Seed: API token "gatsby" created.');
  }
};
