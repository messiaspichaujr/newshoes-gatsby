import type { StrapiApp } from '@strapi/strapi/admin';
// @ts-ignore
import logo from './logo.png';

export default {
  config: {
    locales: ['pt-BR'],
    tutorials: false,
    notifications: { releases: false },

    head: {
      favicon: '/favicon.ico',
      title: 'New Shoes — Admin',
    },

    auth: { logo },
    menu: { logo },

    theme: {
      light: {
        colors: {
          primary100: '#e3f5fc',
          primary200: '#b0e3f5',
          primary500: '#1CAAD9',
          primary600: '#189ec9',
          primary700: '#1490ba',
        },
      },
      dark: {
        colors: {
          primary100: '#0a2d3d',
          primary200: '#0f3d52',
          primary500: '#1CAAD9',
          primary600: '#18a0ce',
          primary700: '#1490ba',
          neutral0: '#0d0d0d',
          neutral100: '#141414',
          neutral150: '#181818',
          neutral200: '#1e1e1e',
          neutral300: '#282828',
          neutral400: '#3a3a3a',
        },
      },
    },

    translations: {
      'pt-BR': {
        // ── Pagina inicial do painel ──
        'HomePage.head.title': 'Painel — New Shoes',
        'HomePage.header.title': 'Ola, {name}!',
        'HomePage.header.subtitle': 'Bem-vindo ao painel de administracao da New Shoes',
        'HomePage.addWidget.button': 'Adicionar painel',
        'HomePage.addWidget.title': 'Adicionar painel',
        'HomePage.addWidget.noWidgetsAvailable': 'Nenhum painel disponivel',
        'HomePage.widget.delete': 'Remover',
        'HomePage.widget.drag': 'Arrastar para mover',
        'HomePage.widget.loading': 'Carregando...',
        'HomePage.widget.error': 'Nao foi possivel carregar.',
        'HomePage.widget.no-data': 'Nenhum conteudo encontrado.',
        'HomePage.widget.no-permissions': 'Voce nao tem permissao para ver este painel.',

        // ── Tour inicial (mostrado na primeira vez) ──
        'app.components.GuidedTour.title': 'Primeiros passos',
        'app.components.GuidedTour.skip': 'Pular tour',
        'app.components.GuidedTour.create-content': 'Criar conteudo',
        'app.components.GuidedTour.CTB.create.title': 'Crie sua estrutura de dados',
        'app.components.GuidedTour.CTB.create.cta.title': 'Ir para estrutura de dados',
        'app.components.GuidedTour.CTB.success.title': 'Passo 1: Concluido ✅',
        'app.components.GuidedTour.CM.create.title': 'Crie e publique conteudo',
        'app.components.GuidedTour.CM.success.title': 'Passo 2: Concluido ✅',
        'app.components.GuidedTour.CM.success.cta.title': 'Testar a API',
        'app.components.GuidedTour.apiTokens.create.title': 'Gere um token de API',
        'app.components.GuidedTour.apiTokens.create.cta.title': 'Gerar token',
        'app.components.GuidedTour.apiTokens.success.title': 'Passo 3: Concluido ✅',
        'app.components.GuidedTour.apiTokens.success.cta.title': 'Voltar ao inicio',
        'app.components.GuidedTour.home.CTB.title': 'Estrutura do conteudo',
        'app.components.GuidedTour.home.CTB.cta.title': 'Ir para estrutura',
        'app.components.GuidedTour.home.CM.title': 'Criar e publicar conteudo',
        'app.components.GuidedTour.home.apiTokens.cta.title': 'Testar a API',

        // ── Widgets: ultimas edicoes / publicacoes ──
        'widget.last-edited.title': 'Editados recentemente',
        'widget.last-edited.single-type': 'Tipo unico',
        'widget.last-edited.no-data': 'Nenhum conteudo editado ainda.',
        'widget.last-published.title': 'Publicados recentemente',
        'widget.last-published.no-data': 'Nenhum conteudo publicado ainda.',
        'widget.chart-entries.title': 'Registros',
        'widget.chart-entries.count.label': '{count, plural, =0 {registros} one {registro} other {registros}}',

        // ── Widget: estatisticas ──
        'widget.key-statistics.title': 'Estatisticas',
        'widget.key-statistics.list.admins': 'Administradores',
        'widget.key-statistics.list.apiTokens': 'Tokens de API',
        'widget.key-statistics.list.assets': 'Arquivos',
        'widget.key-statistics.list.components': 'Componentes',
        'widget.key-statistics.list.contentTypes': 'Tipos de conteudo',
        'widget.key-statistics.list.entries': 'Registros',
        'widget.key-statistics.list.locales': 'Idiomas',
        'widget.key-statistics.list.webhooks': 'Webhooks',

        // ── Widget: perfil e atividade ──
        'widget.profile.title': 'Meu perfil',
        'widget.last-activity.title': 'Ultima atividade',
        'widget.last-activity.no-activity': 'Nenhuma atividade registrada.',
        'widget.last-activity.link': 'Ver historico completo',

        // ── Menu lateral ──
        'app.components.LeftMenu.navbrand.title': 'New Shoes',
        'app.components.LeftMenu.navbrand.workplace': 'Painel Admin',

        // ── Acoes globais ──
        'global.save': 'Salvar',
        'global.cancel': 'Cancelar',
        'global.delete': 'Excluir',
        'global.publish': 'Publicar',
        'global.unpublish': 'Despublicar',
        'global.search': 'Buscar',
        'global.filters': 'Filtros',
        'global.sort': 'Ordenar',
        'global.edit': 'Editar',
        'global.back': 'Voltar',
        'global.name': 'Nome',
        'global.status': 'Status',
        'global.create': 'Criar',
        'global.select-all-entries': 'Selecionar todos',
        'global.last-change.redo': 'Refazer',
        'global.last-change.undo': 'Desfazer',
        'global.last-changes.discard': 'Descartar alteracoes',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    // Oculta o tour guiado e ajusta visuais para a marca New Shoes
    const style = document.createElement('style');
    style.id = 'newshoes-admin-styles';
    style.textContent = `
      /* Oculta o tour guiado apos fechamento */
      [data-testid="guided-tour-homepage"] { display: none !important; }

      /* Logo maior na sidebar */
      nav img, header img { max-height: 36px !important; object-fit: contain; }

      /* Barra lateral com tom mais escuro */
      nav[class*="LeftMenu"] { background: #0d0d0d !important; border-right: 1px solid #1e1e1e !important; }

      /* Nome da marca em destaque no menu */
      [class*="NavBrand"] { border-bottom: 1px solid #1CAAD9 !important; padding-bottom: 12px !important; }

      /* Botoes primarios com cor da marca */
      button[class*="ButtonPrimary"], [class*="Button"][data-variant="default"] {
        background: #1CAAD9 !important;
      }
    `;
    document.head.appendChild(style);
  },
};
