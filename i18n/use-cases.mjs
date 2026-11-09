// Casos de uso de IA (/casos-de-uso e /casos-de-uso/<slug>), gerados por build-pages.mjs.
// Por enquanto só em português; inglês e espanhol entram depois da revisão do texto.
// A ordem de USE_CASE_ORDER é a ordem dos cards na página de entrada.

export const USE_CASE_ORDER = [
  "atendimento-whatsapp-ia",
  "leitura-automatica-de-documentos",
  "triagem-de-pedidos-e-leads",
  "assistente-documentos-da-empresa",
  "relatorios-automaticos",
];

const pt = {
  ui: {
    nav: "Casos de uso",
    eyebrow: "Caso de uso",
    scenarioEyebrow: "O cenário", scenarioTitle: "Como funciona hoje, sem automação.",
    flowEyebrow: "Como fica com IA", flowTitle: "O fluxo, passo a passo.",
    flowLabel: "Fluxo do processo automatizado",
    proposalEyebrow: "Proposta de exemplo", proposalTitle: "O que seria entregue.",
    deliverables: "Entregas", systems: "// sistemas que se conectam", stages: "Etapas", deadline: "Prazo típico",
    deadlineNote: "O prazo final é definido na proposta, depois da descoberta.",
    faqTitle: "Perguntas sobre este caso.",
    cta: "Quer ver como ficaria na sua empresa?",
    serviceLink: "Ver o serviço de Automação com IA →",
    more: "Ver caso de uso →",
    otherEyebrow: "Outros casos de uso", otherTitle: "Veja também.",
  },
  hub: {
    title: "Casos de uso de IA para empresas: exemplos práticos | Agência Byte",
    description: "Exemplos de como a IA entra na operação de uma empresa: atendimento no WhatsApp, leitura de notas fiscais e documentos, triagem de pedidos, assistente interno e relatórios automáticos.",
    eyebrow: "Casos de uso",
    h1: "Casos de uso de IA para empresas",
    lead: "Exemplos práticos de onde a inteligência artificial tira trabalho manual da operação. Cada caso mostra como é hoje, como fica com IA, o que seria entregue e o prazo típico.",
    itemList: "Casos de uso de IA da Agência Byte",
    cta: "Não achou o seu caso? Conte o seu processo.",
  },
  items: {
    "atendimento-whatsapp-ia": {
      name: "Atendimento com IA no WhatsApp",
      card: "Responde clientes 24 horas, consulta pedidos no seu sistema e passa para uma pessoa quando precisa.",
      title: "Atendimento com IA no WhatsApp 24 horas | Caso de uso | Agência Byte",
      description: "Como funciona um agente de IA no WhatsApp que responde clientes 24 horas, consulta pedidos no ERP ou no e-commerce e passa para uma pessoa quando precisa. Fluxo, entregas e prazo típico.",
      h1: "Atendimento com IA no WhatsApp, 24 horas por dia",
      lead: "Um agente de IA responde os clientes no WhatsApp a qualquer hora, consulta o status do pedido no seu sistema e passa a conversa para uma pessoa quando o assunto pede.",
      scenario: {
        text: "O cliente pergunta do pedido às 22h e só é respondido no dia seguinte. De manhã, a fila do WhatsApp já está cheia, e boa parte das mensagens é a mesma pergunta: \"cadê o meu pedido?\".",
        pains: [
          "Fora do horário comercial, ninguém responde, e o cliente compra no concorrente.",
          "Para responder, o atendente abre o ERP, procura o pedido e copia o status para a conversa.",
          "Perguntas repetidas sobre prazo, frete e troca ocupam o dia da equipe.",
          "O histórico fica espalhado entre celulares, e ninguém sabe o que já foi combinado.",
        ],
      },
      flow: [
        { t: "Cliente manda mensagem", d: "A qualquer hora, no número de WhatsApp da empresa." },
        { t: "IA entende o pedido", d: "Identifica o cliente e o assunto: status, prazo, troca, orçamento." },
        { t: "Consulta o sistema", d: "Busca o pedido no ERP ou no e-commerce e responde com o dado real." },
        { t: "Passa para uma pessoa", d: "Reclamação, negociação ou dúvida fora do roteiro vai para o atendente, com o resumo." },
        { t: "Tudo fica registrado", d: "A conversa e o resultado entram no CRM ou no sistema de atendimento." },
      ],
      proposal: {
        deliverables: [
          "Agente de IA no WhatsApp com as regras e o tom de voz da empresa.",
          "Consulta de pedidos, prazos e status direto no seu sistema.",
          "Transferência para atendente humano, com resumo da conversa.",
          "Registro das conversas no CRM e painel com os principais assuntos.",
        ],
        systems: ["WhatsApp Business API", "ERP (Bling, Tiny, Omie e outros)", "E-commerce", "CRM"],
        stages: [
          { t: "Descoberta", d: "Levantamento das perguntas mais comuns e dos dados que a IA pode consultar.", dur: "2 a 3 dias" },
          { t: "Montagem do agente", d: "Integração com o WhatsApp e com o sistema, regras e respostas.", dur: "2 a 3 semanas" },
          { t: "Teste com a equipe", d: "O agente responde em ambiente de teste e a equipe ajusta as respostas.", dur: "1 semana" },
          { t: "Go-live e ajustes", d: "Entrada em produção, acompanhamento das conversas e melhorias.", dur: "1 semana" },
        ],
        deadline: "4 a 6 semanas",
      },
      faq: [
        { q: "O cliente sabe que está falando com uma IA?", a: "Sim. A recomendação é deixar claro desde a primeira mensagem, e o cliente pode pedir para falar com uma pessoa a qualquer momento." },
        { q: "E se a IA não souber responder?", a: "Ela não inventa. Quando a pergunta sai do que foi configurado, a conversa vai para um atendente, com o resumo do que o cliente já disse." },
        { q: "Preciso trocar o número de WhatsApp?", a: "Não necessariamente. O número atual pode ser migrado para a API oficial do WhatsApp. Avaliamos isso na descoberta." },
        { q: "A IA consegue consultar o meu ERP?", a: "Sim, se o sistema tiver API ou outra forma de acesso aos dados. Bling, Tiny, Omie e a maioria dos e-commerces oferecem isso." },
      ],
    },
    "leitura-automatica-de-documentos": {
      name: "Leitura automática de documentos",
      card: "Notas fiscais, CT-e, contratos e comprovantes lidos pela IA e lançados no ERP.",
      title: "Leitura automática de notas fiscais, CT-e e documentos com IA | Caso de uso | Agência Byte",
      description: "Como a IA lê notas fiscais, CT-e, contratos e comprovantes, confere os dados e lança no ERP sem digitação. Fluxo, entregas, sistemas e prazo típico.",
      h1: "Leitura automática de documentos com IA",
      lead: "Notas fiscais, CT-e, contratos e comprovantes chegam por e-mail ou upload, a IA extrai os dados, confere e lança no ERP. A equipe só revisa o que a IA marcar como dúvida.",
      scenario: {
        text: "Todo dia chegam dezenas de PDFs por e-mail. Alguém abre um por um, copia CNPJ, valor, vencimento e itens para o ERP, e confere de novo no fim do mês, quando o fechamento não bate.",
        pains: [
          "Horas por semana gastas digitando o que já está escrito no documento.",
          "Erro de digitação em valor ou vencimento vira multa, juros ou cobrança errada.",
          "Documentos ficam parados na caixa de entrada esperando alguém ter tempo.",
          "Ninguém sabe ao certo quais documentos já foram lançados.",
        ],
      },
      flow: [
        { t: "Documento chega", d: "Por e-mail, upload, pasta compartilhada ou WhatsApp." },
        { t: "IA lê e extrai", d: "Identifica o tipo do documento e extrai os campos: CNPJ, valores, datas, itens." },
        { t: "Confere os dados", d: "Compara com o pedido, o fornecedor e as regras da empresa." },
        { t: "Lança no ERP", d: "Cria o lançamento, a conta a pagar ou o registro certo no sistema." },
        { t: "Pessoa revisa exceções", d: "Só o que não bateu vai para revisão, com o motivo indicado." },
      ],
      proposal: {
        deliverables: [
          "Leitura de notas fiscais, CT-e, contratos, boletos e comprovantes.",
          "Regras de conferência com pedidos, fornecedores e valores.",
          "Lançamento automático no ERP ou no financeiro.",
          "Fila de revisão para exceções e histórico de cada documento lido.",
        ],
        systems: ["E-mail", "Google Drive ou OneDrive", "ERP", "Financeiro", "SEFAZ (XML de NF-e e CT-e)"],
        stages: [
          { t: "Descoberta", d: "Tipos de documento, campos necessários e regras de conferência.", dur: "2 a 3 dias" },
          { t: "Leitura e regras", d: "Modelos de extração, conferência e integração com o ERP.", dur: "2 a 3 semanas" },
          { t: "Teste com documentos reais", d: "Rodamos com documentos dos últimos meses e medimos a precisão.", dur: "1 semana" },
          { t: "Go-live e ajustes", d: "Entrada em produção com a fila de revisão ativa.", dur: "1 semana" },
        ],
        deadline: "3 a 5 semanas",
      },
      faq: [
        { q: "A IA lê documento escaneado ou foto?", a: "Sim. PDFs digitais, documentos escaneados e fotos legíveis. Quando existe o XML da nota, ele é usado primeiro, por ser mais preciso." },
        { q: "E se a IA errar um valor?", a: "As regras de conferência comparam o documento com o pedido e o fornecedor. O que não bate não é lançado: vai para revisão de uma pessoa." },
        { q: "Funciona com o meu ERP?", a: "Funciona com ERPs que tenham API ou importação de arquivos. Na descoberta confirmamos como lançar no seu sistema." },
        { q: "Quais documentos dá para automatizar?", a: "Notas fiscais, CT-e, boletos, comprovantes de pagamento, contratos, pedidos de compra e outros documentos com estrutura parecida." },
      ],
    },
    "triagem-de-pedidos-e-leads": {
      name: "Triagem de pedidos e leads",
      card: "Solicitações de vários canais classificadas e enviadas para a pessoa certa.",
      title: "Triagem de pedidos e leads com IA | Caso de uso | Agência Byte",
      description: "Como a IA recebe solicitações de e-mail, WhatsApp, formulário e marketplace, classifica cada uma e envia para a pessoa ou a fila certa, com o resumo pronto. Fluxo, entregas e prazo típico.",
      h1: "Triagem de pedidos e leads com IA",
      lead: "Solicitações chegam por e-mail, WhatsApp, formulário e marketplace. A IA lê cada uma, classifica por tipo e urgência, e envia para a pessoa ou a fila certa, já com o resumo.",
      scenario: {
        text: "Pedidos, orçamentos, reclamações e currículos chegam misturados no mesmo e-mail e no mesmo WhatsApp. Alguém precisa ler tudo, decidir para quem vai e encaminhar à mão. Quando essa pessoa falta, a fila para.",
        pains: [
          "Lead bom espera horas porque ficou no meio de mensagens sem importância.",
          "A mesma solicitação é respondida por duas pessoas, ou por nenhuma.",
          "Não existe registro de quantas solicitações chegaram e de quanto tempo levaram.",
          "O vendedor recebe o contato sem contexto e precisa perguntar tudo de novo.",
        ],
      },
      flow: [
        { t: "Solicitação chega", d: "E-mail, WhatsApp, formulário do site ou marketplace." },
        { t: "IA classifica", d: "Tipo (pedido, orçamento, suporte, reclamação), urgência e potencial do lead." },
        { t: "Completa os dados", d: "Busca o cliente no CRM e anexa o histórico e os dados da empresa." },
        { t: "Envia para a pessoa certa", d: "Cria o registro no CRM ou no sistema e avisa o responsável." },
        { t: "Acompanha o prazo", d: "Se ninguém responder no tempo combinado, o gestor é avisado." },
      ],
      proposal: {
        deliverables: [
          "Classificação automática por tipo, urgência e potencial.",
          "Regras de distribuição por região, produto ou equipe.",
          "Criação do registro no CRM com resumo e histórico do cliente.",
          "Alertas de prazo e painel com volume e tempo de resposta.",
        ],
        systems: ["E-mail", "WhatsApp", "Formulários do site", "Marketplaces", "CRM", "Slack ou Teams"],
        stages: [
          { t: "Descoberta", d: "Canais de entrada, tipos de solicitação e regras de distribuição.", dur: "2 a 3 dias" },
          { t: "Classificação e integrações", d: "Conexão dos canais, modelo de classificação e envio para o CRM.", dur: "2 a 3 semanas" },
          { t: "Teste com solicitações reais", d: "Comparamos a classificação da IA com a da equipe e ajustamos.", dur: "1 semana" },
          { t: "Go-live e ajustes", d: "Entrada em produção e acompanhamento dos primeiros dias.", dur: "1 semana" },
        ],
        deadline: "3 a 5 semanas",
      },
      faq: [
        { q: "Como a IA sabe para quem enviar?", a: "Pelas regras que a sua empresa já usa, como região, produto, tamanho do cliente ou carteira do vendedor. A IA classifica e as regras distribuem." },
        { q: "E se a classificação estiver errada?", a: "A pessoa que recebe pode reclassificar em um clique. Esses ajustes são usados para melhorar a classificação." },
        { q: "Preciso de um CRM?", a: "Ajuda, mas não é obrigatório. A distribuição pode ser feita para e-mail, Slack, Teams ou uma planilha, e o CRM pode entrar depois." },
        { q: "Dá para priorizar os leads com mais chance de fechar?", a: "Sim. A IA pode dar uma nota para cada lead com base nos critérios que a sua equipe de vendas usa, e os melhores vão primeiro." },
      ],
    },
    "assistente-documentos-da-empresa": {
      name: "Assistente sobre os documentos da empresa",
      card: "A equipe pergunta e a IA responde com base nos manuais e políticas internas.",
      title: "Assistente de IA sobre manuais e políticas internas | Caso de uso | Agência Byte",
      description: "Como funciona um assistente de IA que responde a equipe com base nos manuais, políticas e procedimentos da empresa, sempre indicando a fonte. Fluxo, entregas e prazo típico.",
      h1: "Assistente de IA sobre os documentos da empresa",
      lead: "A equipe pergunta em linguagem comum e a IA responde com base nos manuais, políticas e procedimentos da empresa, sempre indicando de qual documento tirou a resposta.",
      scenario: {
        text: "A resposta existe, mas está em um PDF de 80 páginas, numa pasta que pouca gente sabe onde fica. Então a equipe pergunta para a pessoa mais antiga, que para o que está fazendo para responder pela décima vez.",
        pains: [
          "Funcionário novo leva semanas para aprender procedimentos que já estão escritos.",
          "Cada pessoa responde de um jeito, e o procedimento oficial não é seguido.",
          "As pessoas mais experientes passam o dia respondendo dúvidas.",
          "Manuais desatualizados convivem com versões novas e ninguém sabe qual vale.",
        ],
      },
      flow: [
        { t: "Documentos organizados", d: "Manuais, políticas e procedimentos reunidos em uma base." },
        { t: "Pessoa pergunta", d: "No chat interno, no Teams, no Slack ou no WhatsApp." },
        { t: "IA busca nos documentos", d: "Encontra os trechos que respondem à pergunta." },
        { t: "Responde com a fonte", d: "A resposta vem com o nome do documento e o trecho usado." },
        { t: "Sem resposta, avisa", d: "Se não estiver nos documentos, a IA diz que não sabe e indica quem procurar." },
      ],
      proposal: {
        deliverables: [
          "Base de conhecimento com os documentos da empresa, atualizada automaticamente.",
          "Assistente de IA no canal que a equipe já usa.",
          "Respostas com a fonte indicada e controle de acesso por área.",
          "Relatório das perguntas mais feitas e das que ficaram sem resposta.",
        ],
        systems: ["Google Drive", "SharePoint ou OneDrive", "Notion ou Confluence", "Microsoft Teams", "Slack", "WhatsApp"],
        stages: [
          { t: "Descoberta", d: "Quais documentos entram, quem pode ver o quê e onde a equipe vai perguntar.", dur: "2 a 3 dias" },
          { t: "Base e assistente", d: "Organização dos documentos, busca e integração com o canal.", dur: "2 a 3 semanas" },
          { t: "Teste com a equipe", d: "Um grupo usa no dia a dia e avalia as respostas.", dur: "1 semana" },
          { t: "Go-live e ajustes", d: "Liberação para todos e acompanhamento das perguntas.", dur: "1 semana" },
        ],
        deadline: "3 a 5 semanas",
      },
      faq: [
        { q: "A IA pode inventar uma resposta?", a: "Ela é configurada para responder só com base nos documentos e mostrar a fonte. Quando a resposta não está lá, ela diz que não sabe." },
        { q: "Cada pessoa vê só o que pode ver?", a: "Sim. O acesso segue as permissões por área: um documento do RH, por exemplo, só aparece para quem tem acesso a ele." },
        { q: "Quando um manual muda, a IA atualiza?", a: "Sim. A base é sincronizada com a pasta de documentos, e a versão nova passa a valer na próxima atualização." },
        { q: "Os documentos da empresa são usados para treinar a IA de terceiros?", a: "Não. Os documentos são consultados no momento da pergunta, com provedores e contratos que não usam os dados para treinamento." },
      ],
    },
    "relatorios-automaticos": {
      name: "Relatórios que se montam sozinhos",
      card: "O resumo semanal sai pronto, sem ninguém juntar planilha.",
      title: "Relatórios automáticos com IA: resumo semanal sem planilha | Caso de uso | Agência Byte",
      description: "Como montar relatórios e resumos semanais automaticamente: os dados saem dos sistemas, a IA escreve o resumo e o relatório chega pronto no e-mail ou no WhatsApp. Fluxo, entregas e prazo típico.",
      h1: "Relatórios que se montam sozinhos",
      lead: "Os dados saem direto dos sistemas, os números são calculados sempre do mesmo jeito e a IA escreve o resumo do que mudou. Toda segunda-feira, o relatório chega pronto.",
      scenario: {
        text: "Toda sexta, alguém passa a tarde exportando planilhas do ERP, do CRM e do financeiro, junta tudo, monta gráficos e escreve o resumo da semana. Quando essa pessoa sai de férias, o relatório não sai.",
        pains: [
          "Horas por semana gastas juntando planilhas em vez de analisar.",
          "Cada área calcula o mesmo indicador de um jeito diferente.",
          "Um erro de fórmula passa despercebido e a decisão é tomada com o número errado.",
          "O relatório chega tarde, quando o problema já cresceu.",
        ],
      },
      flow: [
        { t: "Dados saem dos sistemas", d: "ERP, CRM, financeiro e planilhas são lidos automaticamente." },
        { t: "Indicadores calculados", d: "Cada número segue uma única definição, igual para todas as áreas." },
        { t: "IA escreve o resumo", d: "O que subiu, o que caiu e o que pede atenção, em texto simples." },
        { t: "Relatório enviado", d: "Chega por e-mail, WhatsApp ou Teams no dia e na hora combinados." },
        { t: "Detalhe no dashboard", d: "Quem quiser se aprofundar abre o dashboard com os mesmos números." },
      ],
      proposal: {
        deliverables: [
          "Coleta automática dos dados dos sistemas da empresa.",
          "Definição única dos indicadores, documentada.",
          "Resumo escrito pela IA, com destaques e alertas.",
          "Envio programado e dashboard em Power BI com os mesmos números.",
        ],
        systems: ["ERP", "CRM", "Financeiro", "Google Sheets ou Excel", "Power BI", "E-mail, WhatsApp ou Teams"],
        stages: [
          { t: "Descoberta", d: "Quais relatórios existem hoje, de onde vêm os dados e quem recebe.", dur: "2 a 3 dias" },
          { t: "Dados e indicadores", d: "Conexão com os sistemas e cálculo dos indicadores.", dur: "1 a 2 semanas" },
          { t: "Resumo e envio", d: "Texto gerado pela IA, formato do relatório e programação do envio.", dur: "1 semana" },
          { t: "Validação", d: "Comparamos com o relatório manual até os números baterem.", dur: "1 semana" },
        ],
        deadline: "2 a 4 semanas",
      },
      faq: [
        { q: "A IA pode errar os números?", a: "Os números não são calculados pela IA: vêm direto dos sistemas, com fórmulas fixas. A IA só escreve o texto a partir desses números." },
        { q: "Dá para ter relatório diário, além do semanal?", a: "Sim. A frequência e o horário de envio são definidos por você, e cada pessoa pode receber só o que interessa à sua área." },
        { q: "Preciso ter Power BI?", a: "Não. O relatório pode chegar só por e-mail ou WhatsApp. O dashboard em Power BI é opcional, para quem quer ver os detalhes." },
        { q: "E se um sistema não tiver API?", a: "Dá para ler exportações automáticas, banco de dados ou planilhas compartilhadas. Avaliamos o melhor caminho na descoberta." },
      ],
    },
  },
};

export const USE_CASES = { pt };
