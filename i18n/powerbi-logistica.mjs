// Power BI para distribuidoras e transportadoras (/servicos/power-bi-para-distribuidoras-e-transportadoras).
// Só em português. Gerado por build-pages.mjs (powerbiLogisticsPage).
//
// Prova: case CargOn (i18n/pages.mjs). Use só o que o case publica: data warehouse,
// ETL, 4 dashboards com previsões, 30 dias até o go-live. Não afirmar aqui o que
// foi previsto nem quantas fontes foram integradas sem confirmar com a Byte.

export const PBI = {
  title: "Power BI para distribuidora e transportadora: 12 indicadores | Agência Byte",
  description: "Power BI para distribuidoras e transportadoras: os 12 indicadores que mudam a operação (OTIF, custo por entrega, margem por SKU, ruptura, giro), de onde vêm os dados e prazo.",
  crumb: "Power BI para distribuidoras e transportadoras",
  eyebrow: "Dados e Power BI · Logística e distribuição",
  h1: "Power BI para distribuidora e transportadora: os 12 indicadores que mudam a operação",
  lead: "Quais números acompanhar, de onde eles vêm e como chegar a um painel em que a operação, o comercial e o financeiro confiam no mesmo número.",
  tldrLabel: "Resposta curta",
  tldr: "Um projeto de Power BI para distribuidora ou transportadora não começa pelo dashboard: começa por unificar os dados do ERP, do TMS e das planilhas numa base única, porque o problema mais comum não é falta de gráfico, é cada área apresentar um número diferente para o mesmo indicador. A Agência Byte entregou para a CargOn, plataforma de logística, um data warehouse com pipelines ETL e quatro dashboards em Power BI com previsões, em 30 dias até o go-live. Para uma transportadora, os indicadores que mais mudam decisão são OTIF por rota e por cliente, custo por entrega e previsão de atraso; para uma distribuidora, margem por SKU, ruptura e giro de estoque.",

  audience: {
    eyebrow: "Para quem",
    h2: "Para quem é esta página",
    intro: "Para empresas que vendem, armazenam ou transportam mercadoria e já têm dados, mas não têm um número em que todos confiem.",
    cards: [
      {
        h3: "Distribuidora: margem por SKU, ruptura, giro, prazo médio de recebimento",
        p: "Muitos SKUs, muitos clientes e margem apertada. A pergunta não é quanto vendeu, é quanto sobrou em cada produto e cliente, o que faltou na prateleira e quanto tempo o dinheiro leva para entrar.",
        items: ["Margem real por SKU, cliente e vendedor", "Ruptura e giro de estoque por depósito", "Prazo médio de recebimento (DSO) e inadimplência", "Curva ABC de produtos e clientes"],
      },
      {
        h3: "Transportadora: OTIF, custo por entrega, ocupação de frota, custo por modal",
        p: "A margem está no detalhe da operação: entrega no prazo e completa, quanto custou cada entrega, quanto do caminhão rodou vazio e qual modal compensa em cada rota.",
        items: ["OTIF por rota, cliente e motorista", "Custo por entrega e por quilômetro", "Ocupação de frota e retorno vazio", "Custo por modal e por rota"],
      },
    ],
  },

  sources: {
    eyebrow: "Origem dos dados",
    h2: "De onde vêm os dados: ERP, TMS, WMS e planilhas",
    intro: "O painel é tão confiável quanto a base por trás dele. Por isso o projeto começa juntando as fontes num data warehouse, com pipelines ETL ou ELT que tratam, padronizam e versionam cada regra de negócio (com dbt, por exemplo). Assim, “faturamento” e “entrega no prazo” têm uma definição só, para todas as áreas.",
    cards: [
      {
        h3: "Integração com TOTVS, Protheus, Sankhya, Omie e Bling",
        p: "Pedidos, notas, estoque, custos e contas a receber saem do ERP: TOTVS (Protheus, Winthor e outras linhas), Sankhya, Omie, Bling e outros. A conexão é por API, por acesso ao banco de dados quando o ERP roda no servidor da empresa, ou por exportação agendada quando não há outra saída. Dados do WMS (endereçamento, separação, inventário) entram na mesma base.",
      },
      {
        h3: "Integração com TMS e rastreamento",
        p: "Do TMS vêm viagens, rotas, ocorrências e fretes. Os XMLs de CT-e e MDF-e trazem valor do frete, origem, destino e carga de cada viagem, mesmo quando o TMS não tem API. Rastreamento e telemetria completam com horário real de chegada, que é o que permite medir janela de entrega e OTIF de verdade.",
      },
    ],
    stack: ["ERP", "TMS", "WMS", "CT-e e MDF-e", "Planilhas", "ETL / ELT", "dbt", "Data warehouse", "Microsoft Fabric", "Power BI"],
  },

  indicators: {
    eyebrow: "Indicadores",
    h2: "Os 12 indicadores, um a um",
    intro: "Seis para distribuidora, seis para transportadora. Muitas empresas fazem as duas coisas e usam os doze.",
    labels: { what: "O que mede", from: "De onde vem", decision: "Decisão que muda" },
    groups: [
      {
        name: "Distribuidora",
        items: [
          { n: "Margem por SKU", what: "Preço de venda menos custo, impostos, frete e desconto, por produto e por cliente.", from: "ERP (notas e custo médio)", decision: "Qual produto e qual cliente parar de empurrar." },
          { n: "Ruptura de estoque", what: "Quanto do pedido não foi atendido por falta de produto, e quanto isso custou em venda.", from: "ERP e WMS", decision: "O que comprar antes de faltar." },
          { n: "Giro de estoque", what: "Quantas vezes o estoque vira venda no período, por SKU e por depósito.", from: "ERP e WMS", decision: "Onde há capital parado." },
          { n: "Prazo médio de recebimento (DSO)", what: "Quantos dias, em média, o dinheiro da venda leva para entrar.", from: "ERP (contas a receber)", decision: "Política de prazo e crédito por cliente." },
          { n: "Curva ABC", what: "Quais produtos e clientes concentram a maior parte do faturamento e da margem.", from: "ERP", decision: "Onde concentrar atenção de compras e do comercial." },
          { n: "Pedido completo (fill rate)", what: "Percentual de pedidos atendidos inteiros, sem corte de item.", from: "ERP e WMS", decision: "Onde o estoque ou a separação estão falhando." },
        ],
      },
      {
        name: "Transportadora",
        items: [
          { n: "OTIF", what: "Entregas no prazo e completas (on time, in full), por rota, cliente e motorista.", from: "TMS e rastreamento", decision: "Qual rota, cliente ou parceiro está derrubando o nível de serviço." },
          { n: "Custo por entrega", what: "Combustível, pedágio, motorista, manutenção e terceiros, divididos pelas entregas.", from: "TMS, ERP e planilhas de frota", decision: "Qual cliente ou rota dá prejuízo." },
          { n: "Ocupação de frota", what: "Quanto da capacidade do veículo foi usada, em peso e volume, e quanto rodou vazio.", from: "TMS e MDF-e", decision: "Consolidar cargas e rever a roteirização." },
          { n: "Custo por modal", what: "Custo por quilo ou por entrega em cada modal e tipo de veículo.", from: "TMS e CT-e", decision: "Qual modal usar em cada rota." },
          { n: "Janela de entrega cumprida", what: "Percentual de chegadas dentro da janela combinada com o cliente.", from: "Rastreamento e TMS", decision: "Ajustar janela, rota ou horário de saída." },
          { n: "Lead time por rota", what: "Tempo real entre coleta e entrega, por rota e por tipo de carga.", from: "TMS, CT-e e rastreamento", decision: "Prometer prazo que dá para cumprir." },
        ],
      },
    ],
  },

  forecast: {
    eyebrow: "Previsão",
    h2: "Do indicador à previsão: quando faz sentido prever atraso e demanda",
    intro: "Prever é o passo seguinte, não o primeiro. Com a base organizada e um histórico consistente, o mesmo data warehouse alimenta modelos de previsão que aparecem dentro do Power BI.",
    yesTitle: "Faz sentido quando",
    yes: [
      "Os indicadores já batem entre as áreas e ninguém questiona a base.",
      "Há histórico suficiente de entregas ou de vendas, sem grandes buracos.",
      "A previsão muda uma decisão concreta: escalar uma entrega, mudar a rota, antecipar uma compra.",
    ],
    examples: "Exemplos: previsão de atraso por rota, cliente e janela de entrega; previsão de demanda por SKU para evitar ruptura e excesso de estoque.",
    noTitle: "Ainda não faz sentido quando",
    no: "Os dados de origem estão incompletos ou cada área ainda usa uma definição diferente para o mesmo número. Nesse caso, o ganho está em arrumar a base e os indicadores primeiro.",
  },

  time: {
    eyebrow: "Prazo",
    h2: "Prazo e etapas de um projeto",
    intro: "Uma primeira entrega costuma ir ao ar em 3 a 6 semanas. Na CargOn, o data warehouse, o ETL e os 4 dashboards foram do início ao go-live em 30 dias.",
    steps: [
      { t: "Diagnóstico", d: "Definimos os indicadores com a gestão e mapeamos as fontes: ERP, TMS, WMS, XMLs e planilhas.", dur: "1 semana" },
      { t: "Base única", d: "Data warehouse e pipelines ETL/ELT, com as regras de cada indicador escritas uma vez só.", dur: "1 a 3 semanas" },
      { t: "Dashboards", d: "Painéis em Power BI com atualização incremental e RLS (row-level security), para cada área, filial ou cliente ver só o que é seu.", dur: "1 a 2 semanas" },
      { t: "Validação", d: "Os números são conferidos com o financeiro e a operação até baterem.", dur: "junto com os painéis" },
    ],
  },

  faq: [
    { q: "Preciso ter um data warehouse para usar Power BI?", a: "Para poucas fontes e poucos usuários, não. Quando o ERP, o TMS e as planilhas precisam ser cruzados e várias áreas usam o mesmo número, um data warehouse evita que cada relatório refaça a conta do seu jeito." },
    { q: "Quais ERPs e TMS vocês integram?", a: "Qualquer sistema com API, acesso ao banco de dados ou exportação de arquivos: TOTVS (Protheus, Winthor e outras linhas), Sankhya, Omie, Bling, TMS de mercado e sistemas próprios. Os XMLs de CT-e e MDF-e também servem de fonte." },
    { q: "Preciso de licença do Power BI ou do Microsoft Fabric?", a: "Depende de quantas pessoas vão ver os painéis e de como vão ser compartilhados. Para poucos usuários, licenças individuais do Power BI bastam; para muitos, uma capacidade do Microsoft Fabric pode sair mais em conta. Indicamos a opção no diagnóstico." },
    { q: "Cada filial ou cliente pode ver só os próprios dados?", a: "Sim. Com RLS (row-level security), o mesmo painel mostra a cada usuário só as linhas que ele pode ver, por filial, região, vendedor ou cliente." },
    { q: "De quanto em quanto tempo os dados atualizam?", a: "Em geral, várias vezes ao dia. Com atualização incremental, só o que mudou é carregado, o que deixa a atualização rápida mesmo com muito histórico." },
    { q: "Quanto custa um projeto de Power BI para logística?", a: "Depende de quantas fontes, indicadores e usuários entram. O diagnóstico de 30 minutos é gratuito e termina com escopo e prazo." },
  ],

  caseLink: "Ver o caso CargOn →",
  caseEyebrow: "Caso real",
  cta: "Quer ver esses indicadores com os dados da sua operação?",
};
