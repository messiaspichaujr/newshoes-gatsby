import type { Schema, Struct } from '@strapi/strapi';

export interface HomeBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_home_benefit_items';
  info: {
    displayName: 'Benefit Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon_name: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeStructureItem extends Struct.ComponentSchema {
  collectionName: 'components_home_structure_items';
  info: {
    displayName: 'Structure Item';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UnidadeReparoItem extends Struct.ComponentSchema {
  collectionName: 'components_unidade_reparo_items';
  info: {
    displayName: 'Item de Reparo';
    icon: 'scissors';
  };
  attributes: {
    nome: Schema.Attribute.String & Schema.Attribute.Required;
    observacao: Schema.Attribute.String;
    preco: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.benefit-item': HomeBenefitItem;
      'home.structure-item': HomeStructureItem;
      'unidade.reparo-item': UnidadeReparoItem;
    }
  }
}
