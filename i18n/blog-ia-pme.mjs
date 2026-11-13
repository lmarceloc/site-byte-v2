// Post pilar: Automação com IA para PME (/blog/automacao-com-ia-para-pme). Só em português.
// Gerado por build-pages.mjs (iaPmePost). O checklist de prontidão usa o script /checklist.js.
//
// Cada processo da lista "se pagam primeiro" aponta para um caso de uso publicado
// (chave = slug em português, ver i18n/use-cases.mjs). Não colocar números de
// antes e depois de cliente sem confirmar com a Byte.

export const IA_PME = {
  published: "2026-11-13",
  title: "Automação com IA para PME: 7 processos que se pagam e 3 que não valem | Agência Byte",
  description: "Quais processos automatizar com IA primeiro numa PME: os 7 que se pagam (WhatsApp, nota fiscal, triagem, conciliação…), os 3 que não valem, quanto custa e um checklist de prontidão.",
  crumb: "Automação com IA para PME",
  eyebrow: "Guia · Automação com IA",
  h1: "Automação com IA para PME: os 7 processos que se pagam primeiro, e os 3 que não valem",
  lead: "Um guia para escolher por onde começar sem gastar com o processo errado, com um checklist para saber se a sua empresa está pronta.",
  readTime: "9 min de leitura",

  short: {
    h2: "Resposta curta: por onde começar",
    text: "Para uma PME, os processos que se pagam primeiro com IA são os que têm três características ao mesmo tempo: volume alto, regra estável e erro barato. Na prática isso significa atendimento no WhatsApp com consulta ao sistema, leitura automática de nota fiscal e CT-e, e triagem de pedidos e leads. Não vale automatizar processo que muda toda semana, processo com menos de cerca de 50 ocorrências por mês, nem decisão com risco jurídico sem revisão humana. A Agência Byte trabalha todos esses fluxos com aprovação humana nos pontos que importam e custo por execução previsível.",
    criteria: [
      ["Volume alto", "acontece dezenas ou centenas de vezes por mês"],
      ["Regra estável", "o passo a passo é o mesmo há meses"],
      ["Erro barato", "um erro é pego e corrigido sem prejuízo grande"],
    ],
  },

  pays: {
    h2: "Os 7 que se pagam primeiro",
    intro: "Os sete passam no teste das três características. Os três primeiros costumam dar o retorno mais rápido; os outros quatro entram logo em seguida.",
    labels: { does: "O que a IA faz", human: "Onde fica a pessoa", link: "Ver o caso de uso →" },
    items: [
      {
        h3: "Atendimento no WhatsApp com consulta ao sistema",
        useCase: "atendimento-whatsapp-ia",
        why: "As mesmas perguntas chegam o dia inteiro: status do pedido, prazo, segunda via, horário. Um agente de IA ligado à WhatsApp Business API responde na hora consultando o ERP ou o CRM, em vez de responder de memória.",
        does: "Entende a pergunta, consulta o sistema por API ou webhook e responde com o dado real.",
        human: "Fallback para uma pessoa quando o cliente pede, quando o assunto é reclamação ou quando a IA não tem certeza.",
      },
      {
        h3: "Leitura de nota fiscal, CT-e e comprovante",
        useCase: "leitura-automatica-de-documentos",
        why: "Digitar dados de documento é trabalho de alto volume e regra estável. OCR somado a um LLM lê PDFs, imagens e XMLs, extrai os campos e lança no ERP, sem depender de layout fixo como um RPA tradicional.",
        does: "Lê o documento, extrai fornecedor, valores, impostos e itens, e lança no sistema.",
        human: "Aprovação humana só para o que fica abaixo da confiança mínima ou foge da regra.",
      },
      {
        h3: "Triagem de pedidos e leads por canal",
        useCase: "triagem-de-pedidos-e-leads",
        why: "Pedidos e contatos chegam por e-mail, WhatsApp, site e marketplace. Separar, classificar e mandar para a pessoa certa toma horas e atrasa a resposta para quem mais importa.",
        does: "Classifica cada entrada por tipo, urgência e potencial, cria o registro no CRM e avisa o responsável.",
        human: "A equipe comercial recebe o lead já qualificado e decide a abordagem.",
      },
      {
        h3: "Conciliação bancária",
        useCase: "automacao-de-processos-administrativos",
        why: "Bater extrato com contas a pagar e a receber é repetitivo, tem regra clara e acontece todo dia. A maior parte das linhas casa sozinha; o que sobra é exceção.",
        does: "Cruza o extrato com os lançamentos do ERP, concilia o que casa e separa as divergências.",
        human: "O financeiro trata só as exceções e aprova os ajustes.",
      },
      {
        h3: "Relatório semanal automático",
        useCase: "relatorios-automaticos",
        why: "Alguém passa a segunda-feira juntando planilhas para montar o mesmo relatório. É volume previsível com regra fixa.",
        does: "Puxa os números dos sistemas, monta o resumo, destaca o que fugiu do normal e envia no horário.",
        human: "A gestão lê e decide. Ninguém mais monta.",
      },
      {
        h3: "Assistente sobre documentos internos",
        useCase: "assistente-documentos-da-empresa",
        why: "A equipe pergunta a mesma coisa sobre política, procedimento e manual de produto. Com RAG, o assistente responde com base nos documentos da empresa e cita a fonte.",
        does: "Busca o trecho certo nos documentos internos e responde com a referência.",
        human: "Quem cuida do documento mantém o conteúdo atualizado; a IA não inventa política nova.",
      },
      {
        h3: "Resposta a avaliação e pós-venda",
        useCase: null,
        why: "Avaliação em marketplace e Google, pesquisa de satisfação e contato pós-entrega seguem padrões. Responder rápido e no tom certo mexe na reputação e na recompra.",
        does: "Lê a avaliação, classifica o sentimento, rascunha a resposta e dispara o contato de pós-venda.",
        human: "Avaliação negativa ou com risco de reclamação formal passa por aprovação humana antes de sair.",
      },
    ],
  },

  skip: {
    h2: "Os 3 que não valem (e por quê)",
    intro: "Automatizar o processo errado custa duas vezes: o projeto e a manutenção de algo que não para de mudar.",
    items: [
      { h3: "Processo que muda toda semana", p: "Se a regra muda toda semana, a automação precisa mudar junto. O custo de manutenção come o ganho. Primeiro estabilize o processo; depois automatize." },
      { h3: "Processo com volume abaixo de ~50 ocorrências/mês", p: "Abaixo de cerca de 50 ocorrências por mês, o tempo economizado raramente paga o projeto e o custo por execução. Um modelo pronto, um formulário ou um ajuste no sistema resolvem melhor." },
      { h3: "Decisão com risco jurídico sem revisão humana", p: "Demissão, crédito, contrato, resposta a órgão público: a IA pode preparar, resumir e sugerir, mas a decisão final precisa de human-in-the-loop. Além do risco jurídico, a LGPD exige cuidado com decisões automatizadas sobre pessoas." },
    ],
  },

  before: {
    h2: "Antes de automatizar: elimine, junte, simplifique",
    intro: "Automatizar um processo ruim só faz o erro acontecer mais rápido. Antes de qualquer agente de IA ou fluxo no n8n, passe o processo por três perguntas:",
    steps: [
      ["Elimine", "Esse passo precisa existir? Relatório que ninguém lê e aprovação que ninguém recusa podem simplesmente sair."],
      ["Junte", "Duas pessoas fazem partes da mesma coisa em sistemas diferentes? Juntar reduz a quantidade de integrações."],
      ["Simplifique", "Dá para padronizar a entrada? Um formulário no lugar de e-mail livre deixa a automação mais barata e mais confiável."],
    ],
    outro: "Só o que sobra depois disso entra na automação de processos.",
  },

  cost: {
    h2: "Quanto custa e em quanto tempo se paga",
    p1: "O custo tem duas partes: o projeto (desenho, integração com ERP, CRM e WhatsApp, testes) e a operação mensal, que é basicamente o custo por execução do LLM, mensagens do WhatsApp e servidor. A segunda parte é previsível: dá para estimar pelo volume do processo antes de começar.",
    p2: "O retorno vem das horas que a equipe deixa de gastar e dos erros que deixam de acontecer. O payback é rápido quando o volume é alto e a regra é estável, que é exatamente o critério dos 7 processos acima. Para estimar o ROI do seu caso, comece pelo custo do trabalho manual de hoje.",
    calc: "Calcule quanto o trabalho manual custa hoje →",
    p3: "Um primeiro fluxo em produção costuma levar de 3 a 6 semanas, com aprovação humana nos pontos que importam desde o primeiro dia.",
  },

  checklist: {
    h2: "Checklist: sua empresa está pronta?",
    intro: "Marque o que vale para o processo que você quer automatizar.",
    items: [
      "O processo acontece pelo menos 50 vezes por mês.",
      "O passo a passo é o mesmo há alguns meses.",
      "Dá para escrever o passo a passo em uma página.",
      "Os dados chegam em formato digital: e-mail, PDF, XML, WhatsApp ou sistema.",
      "Os sistemas envolvidos têm API, webhook ou exportação de arquivo.",
      "Um erro pode ser pego e corrigido sem prejuízo grande.",
      "Existe uma pessoa dona do processo para aprovar as exceções.",
      "Você sabe, mesmo que por alto, quanto tempo a equipe gasta nisso hoje.",
      "Os dados pessoais envolvidos podem ser tratados de acordo com a LGPD.",
      "O processo já passou pelo elimine, junte, simplifique.",
    ],
    results: [
      { min: 8, title: "Pronta para automatizar", text: "Esse processo é um bom candidato. O próximo passo é medir o volume e desenhar o fluxo com os pontos de aprovação humana." },
      { min: 5, title: "Quase lá", text: "Dá para automatizar, mas vale resolver os itens desmarcados primeiro. Um diagnóstico curto mostra o que ajustar antes." },
      { min: 0, title: "Arrume o processo primeiro", text: "Hoje, automatizar sairia caro. Comece estabilizando e simplificando o processo; a automação vem depois." },
    ],
    score: "{n} de {total} itens marcados",
    cta: "Revisar meu processo em 30 min, sem custo →",
    wa: "Oi! Fiz o checklist de automação com IA no site: {n} de {total} itens ({title}). Quero entender por onde começar.",
  },

  cta: "Quer saber quais desses 7 se pagam na sua empresa?",
};
