// Parágrafo de abertura e números do hero da home, em português, inglês e espanhol.
// Fonte única: o React (i18n/home.jsx) e o HTML gerado pelo build-pages.mjs
// (conteúdo lido por robôs que não rodam JavaScript) leem daqui, então os dois
// mostram sempre o mesmo texto.
export const HERO_TEXT = {
  pt: {
    lead: "A Agência Byte desenvolve sistemas sob medida, integra ERP, CRM e marketplaces e aplica IA em atendimento, documentos e relatórios. Atendemos indústria, logística e distribuição de acordo com o seu fluxo, com o primeiro módulo em produção em 3 a 6 semanas.",
    stats: [["Primeiro módulo", "3–6 semanas"], ["Suporte", "< 4h úteis"], ["Divina Argila", "4 sistemas integrados e Go-Live em 40 dias"]],
  },
  en: {
    lead: "Agência Byte builds custom systems, integrates ERP, CRM and marketplaces, and applies AI to customer service, documents and reports. We serve manufacturing, logistics and distribution companies according to their workflow, with the first module in production in 3 to 6 weeks.",
    stats: [["First module", "3–6 weeks"], ["Support", "< 4 business hours"], ["Divina Argila", "4 systems integrated and go-live in 40 days"]],
  },
  es: {
    lead: "Agência Byte desarrolla sistemas a medida, integra ERP, CRM y marketplaces y aplica IA en atención, documentos e informes. Atendemos industria, logística y distribución de acuerdo con su flujo, con el primer módulo en producción en 3 a 6 semanas.",
    stats: [["Primer módulo", "3–6 semanas"], ["Soporte", "< 4 h hábiles"], ["Divina Argila", "4 sistemas integrados y go-live en 40 días"]],
  },
};
