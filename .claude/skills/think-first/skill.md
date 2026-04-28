---
name: think-first
description: Orienta o Claude a pensar antes de agir. Para tarefas simples, sempre buscar a menor mudança possível antes de criar soluções complexas.
---

# Think First

Sempre que receber uma tarefa, siga esta ordem:

## 1. Entenda antes de codar
- Leia os arquivos relevantes primeiro
- Entenda a arquitetura existente e como o projeto resolve problemas
- Verifique se já existe uma config, flag ou caminho que resolve o problema

## 2. Busque a menor mudança possível
- Pergunte: "Qual é a mudança mínima que resolve isso?"
- Trocar um caminho, alterar uma config ou mudar um valor > criar arquivos novos, converter formatos ou reinventar soluções
- Se a solução parecer complexa, pare e repense — provavelmente existe um jeito mais simples

## 3. Valide com o usuário
- Se a tarefa parece simples mas pode ter N abordagens, confirme a abordagem antes de implementar
- Não assuma que precisa converter, criar ou rebuildar nada sem necessidade

## Regras
- **Nunca** crie arquivos novos se pode editar um existente
- **Nunca** converta formatos se pode apenas trocar um caminho
- **Nunca** faça rebuild/docker restart sem motivo real
- **Sempre** prefira 1 linha de mudança sobre 10 linhas de workaround
