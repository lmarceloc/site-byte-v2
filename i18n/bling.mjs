// Integração Bling com marketplaces: página de serviço + 3 páginas por canal.
// Só em português: Bling é um ERP brasileiro e o público é o lojista brasileiro.
// Gerado por build-pages.mjs (blingPage). Rotas em ./routes.mjs (chaves "bling" e "bling:<canal>").
//
// Cuidado ao editar: não colocar aqui números da API do Bling (limites, validade
// de token) nem preços sem conferir na documentação oficial. Prazos usam só o
// que a Byte já publicou: Divina Argila em 40 dias e primeiro módulo em 3 a 6 semanas.

export const BLING_CHANNELS = ["mercado-livre", "tiktok-shop", "shopee"];

const CITABLE =
  "O Bling já integra nativamente com Mercado Livre, Shopee e TikTok Shop para sincronizar pedidos, estoque e preço. A integração via API passa a fazer sentido em cinco situações: quando o produto é kit ou tem composição, quando a regra fiscal muda por canal ou por filial, quando o estoque é compartilhado com loja física, quando o pedido precisa chegar à produção e não só ao financeiro, e quando o preço muda por canal. A Agência Byte integrou Bling, Trello, TikTok Shop e Mercado Livre para a Divina Argila, fábrica própria com venda em marketplace, em 40 dias: o pedido passou a chegar à fábrica junto com a emissão.";

export const BLING = {
  ui: {
    eyebrow: "Integração Bling",
    tldr: "Resposta curta",
    native: "Nativo no Bling",
    limit: "Onde trava",
    api: "Com integração via API",
    channelsEyebrow: "Por canal",
    channelsTitle: "Integração Bling com cada marketplace.",
    more: "Ver integração →",
    parent: "Visão geral: Bling com marketplaces →",
    caseEyebrow: "Caso real",
    caseLink: "Ver o caso Divina Argila →",
    cta: "Quer saber se o seu caso precisa de API?",
    crumb: "Integração Bling com marketplaces",
  },

  hub: {
    title: "Integração Bling com Mercado Livre e TikTok Shop: quando usar API | Agência Byte",
    description: "O que o Bling já faz sozinho com Mercado Livre, Shopee e TikTok Shop, os 5 limites que pedem integração via API (kits, fiscal, estoque, produção e preço por canal) e quanto tempo leva.",
    h1: "Integração Bling com Mercado Livre e TikTok Shop: o que o Bling faz sozinho e quando você precisa de API",
    lead: "Para a maioria das lojas, a integração nativa do Bling resolve. Este guia mostra onde ela para, e como saber se o seu caso pede uma integração via API do Bling.",
    tldr: CITABLE,
    sections: [
      {
        id: "o-que-o-bling-faz",
        eyebrow: "Sem desenvolvimento",
        h2: "O que o Bling já faz sem nenhum desenvolvimento",
        intro: "O Bling é um ERP online com integrações nativas com os principais marketplaces do Brasil: Mercado Livre, Shopee, TikTok Shop, Magalu e Amazon, além de lojas como Nuvemshop e Shopify. Para conectar, basta autorizar a conta do canal dentro do Bling. Sem código, ele cobre o fluxo padrão de uma loja:",
        list: [
          "Importa os pedidos de cada marketplace para um só lugar.",
          "Sincroniza estoque e preço do Bling para os anúncios.",
          "Emite a NF-e do pedido e envia os dados da nota para o canal.",
          "Gera etiquetas e acompanha o envio, incluindo Mercado Envios no Mercado Livre.",
          "Vincula cada anúncio a um SKU do cadastro de produtos.",
        ],
        outro: "Se a sua loja vende produto simples, com uma regra fiscal, um estoque e o mesmo preço em todo canal, a integração nativa costuma bastar. Não pague por API antes de esgotar o que o Bling já faz.",
      },
    ],
    limitsEyebrow: "Os limites",
    limitsH2: "Os 5 limites nativos que fazem o lojista procurar integração via API",
    limitsIntro: "Os problemas aparecem quando a operação foge do fluxo padrão. Estes são os cinco casos que mais levam uma loja a integrar o Bling via API:",
    limits: [
      {
        id: "kits-e-composicao",
        h3: "Kits, combos e composição de produto",
        native: "O Bling aceita produto com composição e calcula o estoque do kit a partir dos itens.",
        limit: "A conta complica quando o mesmo item entra em kits diferentes em cada canal, quando o combo é montado só no anúncio, ou quando a composição é de insumo de produção, não de produto pronto. O estoque some de um lado e sobra do outro, e o anúncio continua vendendo o que não existe.",
        api: "A integração aplica a regra de composição de cada canal, baixa o estoque dos componentes certos e pausa o anúncio do kit quando um item acaba.",
      },
      {
        id: "regras-fiscais",
        h3: "Regras fiscais por canal e por filial",
        native: "O Bling usa a natureza de operação e as regras de tributação configuradas para emitir a NF-e.",
        limit: "Quando cada canal fatura por uma filial diferente, ou a mesma venda muda de CFOP, natureza ou tributação conforme canal, estado de destino e tipo de cliente, a configuração manual vira fonte de erro e nota rejeitada.",
        api: "A integração decide a filial e a regra fiscal de cada pedido antes da emissão, de forma consistente, e registra o motivo de cada escolha.",
      },
      {
        id: "estoque-compartilhado",
        h3: "Estoque compartilhado entre canais e loja física",
        native: "O Bling envia um saldo de estoque para os anúncios de cada canal.",
        limit: "Se a loja física vende do mesmo estoque e o PDV não está no Bling, ou se parte do estoque fica num depósito do marketplace, o saldo enviado não representa o que existe. Em dia de pico, isso vira venda sem produto.",
        api: "A integração junta os saldos de todos os depósitos e da loja física, reserva estoque por canal quando faz sentido e atualiza os anúncios a cada movimento, via webhook.",
      },
      {
        id: "pedido-para-producao",
        h3: "Pedido do marketplace para a produção",
        native: "O pedido entra no Bling, gera a nota e segue para o financeiro e a expedição.",
        limit: "Para quem fabrica ou personaliza, o pedido precisa chegar a quem produz, com o que produzir e o prazo. Sem isso, alguém copia o pedido para planilha, WhatsApp ou quadro de tarefas, e o erro entra junto.",
        api: "A integração cria o cartão de produção automaticamente (no Trello, por exemplo), com itens, variações e prazo do canal, e devolve o status ao Bling quando o pedido fica pronto.",
      },
      {
        id: "preco-por-canal",
        h3: "Preço dinâmico por canal",
        native: "O Bling permite listas de preço e ajuste de preço por integração.",
        limit: "Comissão, frete subsidiado, cupom e campanha mudam de canal para canal e de semana para semana. Recalcular preço à mão em cada anúncio para manter a margem não escala.",
        api: "A integração calcula o preço de cada canal a partir do custo, da comissão e da margem mínima, e atualiza os anúncios pela API do Bling.",
      },
    ],
    when: {
      eyebrow: "Decisão",
      h2: "Quando integrar via API compensa",
      intro: "Integração via API do Bling (API v3, com autorização por token OAuth e webhooks) compensa quando o trabalho manual em volta do Bling já custa mais que o projeto. Na prática:",
      yes: [
        "Alguém da equipe copia pedido do Bling para outro lugar todos os dias.",
        "Você já vendeu produto sem estoque por causa de kit ou de loja física.",
        "Nota fiscal volta rejeitada por regra que muda de canal para canal.",
        "O preço dos anúncios é recalculado à mão a cada campanha.",
        "A fábrica ou a expedição descobre o pedido tarde.",
      ],
      noTitle: "Quando não compensa",
      no: "Se o volume é pequeno e o fluxo é o padrão, ajuste a configuração do Bling ou use um conector pronto antes. Uma integração própria também precisa ser monitorada: a API do Bling tem limite de requisições (rate limit) e o token precisa ser renovado. Por isso a Byte entrega a integração com fila, reprocessamento e alerta de falha.",
      calc: "Use a calculadora de automação para estimar quanto o trabalho manual custa hoje →",
    },
    time: {
      eyebrow: "Prazo",
      h2: "Quanto tempo leva",
      intro: "Um primeiro módulo em produção costuma levar de 3 a 6 semanas. Na Divina Argila, com 4 sistemas, foram 40 dias do início ao go-live: integração, testes, ajustes e a operação rodando no modo novo. O prazo depende de quantos canais, quantas regras e quais sistemas entram.",
      steps: [
        { t: "Diagnóstico", d: "Mapeamos canais, SKUs, kits, regras fiscais e onde o pedido precisa chegar.", dur: "1 semana" },
        { t: "Integração", d: "API do Bling e dos canais, webhooks, regras de estoque, fiscal e preço.", dur: "2 a 4 semanas" },
        { t: "Validação", d: "Pedidos reais em paralelo com a operação atual, até os números baterem.", dur: "1 semana" },
        { t: "Operação", d: "Monitoramento, alertas e ajustes depois da virada.", dur: "contínuo" },
      ],
    },
    faq: [
      { q: "O Bling integra com Mercado Livre, Shopee e TikTok Shop sem programação?", a: "Sim. As integrações nativas sincronizam pedidos, estoque e preço e emitem a NF-e. A integração via API só é necessária quando a operação foge do fluxo padrão, como kits por canal, regra fiscal por filial ou pedido que precisa chegar à produção." },
      { q: "Preciso trocar o Bling para ter uma integração sob medida?", a: "Não. A integração usa a API v3 do Bling e mantém o Bling como centro da operação. O que muda é o que acontece em volta dele, de forma automática." },
      { q: "A integração via API substitui a integração nativa do Bling?", a: "Normalmente não. A nativa continua cuidando do que faz bem, e a integração via API cobre só as regras que ela não cobre. Isso reduz custo e risco." },
      { q: "E se o Bling ou o marketplace ficar fora do ar?", a: "Os pedidos e atualizações entram numa fila e são reprocessados quando o sistema volta. Se a falha persistir, a equipe recebe um alerta. Nenhum pedido se perde em silêncio." },
      { q: "Funciona com Tiny, Olist ou outro ERP?", a: "Sim. O mesmo tipo de integração vale para outros ERPs com API, como o Tiny. Na descoberta avaliamos o que cada sistema permite." },
      { q: "Quanto custa uma integração do Bling via API?", a: "Depende de quantos canais, regras e sistemas entram. O diagnóstico de 30 minutos é gratuito e termina com escopo e prazo." },
    ],
  },

  channels: {
    "mercado-livre": {
      name: "Mercado Livre",
      card: "Anúncios com variação, Mercado Envios e Full, kits e preço por comissão.",
      title: "Integração Bling com Mercado Livre: limites e quando usar API | Agência Byte",
      description: "O que a integração nativa do Bling com o Mercado Livre cobre, onde ela para (variações, Full, kits, preço por comissão) e quando vale integrar via API.",
      h1: "Integração Bling com Mercado Livre: o que é nativo e quando usar API",
      lead: "O Bling integra com o Mercado Livre sem desenvolvimento. Estes são os pontos em que lojas maiores ou com produção própria passam a precisar de uma integração via API.",
      tldr: "O Bling importa os pedidos do Mercado Livre, sincroniza estoque e preço dos anúncios, emite a NF-e e acompanha o envio pelo Mercado Envios. A integração via API passa a compensar quando há kits ou combos montados no anúncio, estoque dividido com o Full ou com loja física, preço que precisa acompanhar comissão e frete, ou pedido que precisa chegar à produção. A Agência Byte fez essa integração para a Divina Argila, junto com TikTok Shop e Trello, em 40 dias.",
      native: [
        "Importação dos pedidos e dos dados do comprador.",
        "Sincronização de estoque e preço com os anúncios.",
        "Emissão de NF-e e envio dos dados da nota para o Mercado Livre.",
        "Etiquetas e rastreio pelo Mercado Envios.",
      ],
      limits: [
        { h3: "Anúncios com variação e SKUs", p: "Um anúncio com cor e tamanho precisa de cada variação ligada ao SKU certo. Com muitos anúncios e kits, o vínculo manual quebra e o estoque de uma variação vai para outra." },
        { h3: "Estoque no Full e fora dele", p: "No Mercado Envios Full, parte do estoque fica no centro de distribuição do Mercado Livre. Se o mesmo produto também vende em outros canais ou na loja física, é preciso decidir quanto vai para cada lado e acompanhar os dois saldos." },
        { h3: "Preço que acompanha comissão e frete", p: "Comissão por categoria, tipo de anúncio e frete grátis mudam a margem de cada venda. Manter o preço certo à mão em centenas de anúncios não escala." },
        { h3: "Pedido que precisa virar produção", p: "Para quem fabrica, o pedido do Mercado Livre precisa chegar à fábrica com prazo. Foi o caso da Divina Argila: hoje o pedido vira cartão no Trello junto com a emissão." },
      ],
      faq: [
        { q: "O Bling emite nota fiscal para pedidos do Mercado Livre?", a: "Sim. A emissão da NF-e é nativa, e os dados da nota seguem para o Mercado Livre. A integração via API entra quando a regra fiscal muda por filial ou por tipo de venda." },
        { q: "A integração funciona com o Mercado Envios Full?", a: "Sim. O ponto de atenção é o estoque: o que está no Full fica no centro de distribuição do Mercado Livre, e a integração precisa considerar esse saldo junto com os demais depósitos." },
        { q: "Quanto tempo leva integrar Bling e Mercado Livre via API?", a: "Um primeiro módulo costuma entrar em produção em 3 a 6 semanas. Na Divina Argila, Bling, Mercado Livre, TikTok Shop e Trello foram do início ao go-live em 40 dias, com testes e ajustes incluídos." },
      ],
    },
    "tiktok-shop": {
      name: "TikTok Shop",
      card: "Picos de venda em live, afiliados, kits e pedido direto para a produção.",
      title: "Integração Bling com TikTok Shop: limites e quando usar API | Agência Byte",
      description: "Como o Bling integra com o TikTok Shop, onde a integração nativa para (picos de live, kits, estoque compartilhado, produção) e quando vale integrar via API.",
      h1: "Integração Bling com TikTok Shop: o que é nativo e quando usar API",
      lead: "O TikTok Shop vende em picos: uma live ou um vídeo de afiliado pode gerar em uma hora o volume de uma semana. É aí que os limites da integração nativa aparecem primeiro.",
      tldr: "O Bling integra nativamente com o TikTok Shop para importar pedidos, sincronizar estoque e preço e emitir a NF-e. A integração via API passa a compensar quando os picos de venda em live e afiliados exigem estoque atualizado em tempo real, quando há kits e combos, quando o estoque é dividido com outros canais e loja física, ou quando o pedido precisa chegar à produção. A Agência Byte integrou Bling, TikTok Shop, Mercado Livre e Trello para a Divina Argila em 40 dias.",
      native: [
        "Importação dos pedidos do TikTok Shop para o Bling.",
        "Sincronização de estoque e preço com os produtos da loja.",
        "Emissão de NF-e dos pedidos.",
        "Acompanhamento do envio.",
      ],
      limits: [
        { h3: "Picos de venda em live e afiliados", p: "Em uma live, o estoque precisa baixar a cada venda, não a cada ciclo de sincronização. Sem isso, a loja vende mais do que tem e precisa cancelar pedidos, o que pesa na avaliação." },
        { h3: "Kits e combos montados para a campanha", p: "Combos criados para uma live ou para um afiliado mudam de composição com frequência. A baixa de estoque dos itens precisa seguir a composição de cada combo." },
        { h3: "Estoque dividido com outros canais", p: "O mesmo produto vende no TikTok Shop, no Mercado Livre e na loja física. O pico de um canal não pode deixar os outros vendendo o que já acabou." },
        { h3: "Pedido direto para a produção", p: "Na Divina Argila, todo pedido do TikTok Shop vira um cartão no Trello para a fábrica produzir e expedir, sem ninguém copiar o pedido." },
      ],
      faq: [
        { q: "O Bling tem integração nativa com o TikTok Shop?", a: "Sim. Pedidos, estoque, preço e nota fiscal funcionam pela integração nativa. A API entra quando o volume em picos, os kits ou a produção exigem regras que a integração nativa não cobre." },
        { q: "Como evitar vender sem estoque durante uma live?", a: "Atualizando o estoque de todos os canais a cada venda, via webhook, e reservando uma quantidade para a live quando o produto também vende em outros canais." },
        { q: "Quanto tempo leva integrar Bling e TikTok Shop via API?", a: "Um primeiro módulo costuma entrar em produção em 3 a 6 semanas. Na Divina Argila, a integração com TikTok Shop, Mercado Livre, Bling e Trello levou 40 dias do início ao go-live, com testes e ajustes incluídos." },
      ],
    },
    shopee: {
      name: "Shopee",
      card: "Campanhas e datas duplas, muitas variações, cupons e preço por canal.",
      title: "Integração Bling com Shopee: limites e quando usar API | Agência Byte",
      description: "O que a integração nativa do Bling com a Shopee cobre, onde ela para (campanhas, variações, kits, preço por canal) e quando vale integrar via API.",
      h1: "Integração Bling com Shopee: o que é nativo e quando usar API",
      lead: "A Shopee concentra vendas em campanhas e datas como 11.11 e 12.12, com muitos anúncios e variações. A integração nativa do Bling cobre o dia a dia; os limites aparecem no volume e na margem.",
      tldr: "O Bling integra nativamente com a Shopee para importar pedidos, sincronizar estoque e preço e emitir a NF-e. A integração via API passa a compensar quando as campanhas geram picos que exigem estoque em tempo real, quando há muitas variações e kits ligados a SKUs, quando o preço precisa acompanhar comissão, cupom e frete, ou quando o pedido precisa chegar à produção. É o mesmo tipo de projeto que a Agência Byte fez para a Divina Argila com Mercado Livre e TikTok Shop, em 40 dias.",
      native: [
        "Importação dos pedidos da Shopee para o Bling.",
        "Sincronização de estoque e preço com os anúncios.",
        "Emissão de NF-e dos pedidos.",
        "Etiquetas e acompanhamento do envio.",
      ],
      limits: [
        { h3: "Picos em campanhas e datas duplas", p: "Em datas como 11.11 e 12.12, o volume multiplica em poucas horas. O estoque precisa baixar a cada venda em todos os canais, e a fila de pedidos não pode travar a emissão." },
        { h3: "Muitas variações e kits", p: "Anúncios com dezenas de variações e kits exigem vínculo correto com cada SKU. Um vínculo errado manda estoque para a variação errada." },
        { h3: "Preço com comissão, cupom e frete", p: "Comissão, programas de frete e cupons mudam a margem de cada venda. O preço de cada anúncio precisa ser recalculado para não vender com prejuízo na campanha." },
        { h3: "Pedido que precisa virar produção", p: "Para quem fabrica ou personaliza, o pedido precisa chegar a quem produz com itens, variações e prazo, sem cópia manual." },
      ],
      faq: [
        { q: "O Bling integra com a Shopee sem programação?", a: "Sim. Pedidos, estoque, preço e nota fiscal funcionam pela integração nativa. A integração via API entra quando campanhas, variações, kits ou preço por canal exigem regras próprias." },
        { q: "Como manter o estoque certo nas datas duplas da Shopee?", a: "Atualizando o estoque de todos os canais a cada venda, via webhook, com fila e reprocessamento para que nenhum pedido se perca no pico." },
        { q: "Quanto tempo leva integrar Bling e Shopee via API?", a: "Um primeiro módulo costuma entrar em produção em 3 a 6 semanas, dependendo de quantas regras e sistemas entram." },
      ],
    },
  },
};
