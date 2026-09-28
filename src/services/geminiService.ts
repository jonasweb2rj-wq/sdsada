import { GoogleGenAI } from '@google/genai';
import { Property, AiLandingPageResult } from '../types/property';

export async function generatePropertyAiLandingPage(property: Property): Promise<AiLandingPageResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Você é o estrategista de marketing imobiliário e copywriter de elite da corretora Maria Júlia (CRECI/SC 77301-F, Instagram @majudgamba), atuante em Criciúma e Balneário Rincão - Santa Catarina.

Gere uma estratégia completa de Landing Page de Alta Conversão e Anúncios para o seguinte imóvel:
- Código: ${property.code}
- Título: ${property.title}
- Tipo: ${property.type}
- Localização: ${property.neighborhood}, ${property.city} - SC
- Construtora: ${property.builder || 'Não informada'}
- Preço: R$ ${property.price.toLocaleString('pt-BR')}
- Quartos: ${property.bedrooms} (${property.suites} suítes)
- Área Privativa: ${property.privateArea} m²
- Destaques: ${property.features.join(', ')}
- Tags: ${property.tags.join(', ')}

Retorne EXATAMENTE um JSON válido sem markdown ou crases (ou apenas o JSON puro) com a seguinte estrutura:
{
  "headline": "Título de impacto hipnótico para o topo da Landing Page",
  "subheadline": "Subtítulo convincente destacando exclusividade e localização",
  "targetAudience": "Perfil detalhado do comprador ideal (ex: famílias em busca de conforto, médicos, investidores de renda passiva)",
  "keyHighlights": ["Destaque 1", "Destaque 2", "Destaque 3", "Destaque 4"],
  "urgencyHook": "Gatilho de urgência irresistível (ex: Apenas 1 unidade com condição especial até sexta-feira)",
  "instagramAdCopy": "Texto completo para anúncio de feed/carrossel do Instagram com emojis, ganchos e CTA para o direct da @majudgamba",
  "googleAdCopy": {
    "headlines": ["Título Google 1 (máx 30 carac)", "Título Google 2", "Título Google 3"],
    "descriptions": ["Descrição Google 1 (máx 90 carac)", "Descrição Google 2"]
  },
  "reelsScript": {
    "hook": "Primeiros 3 segundos do vídeo (o que falar e o que mostrar para prender a atenção)",
    "body": "Desenvolvimento do vídeo de 30 a 45s mostrando os pontos altos do imóvel",
    "callToAction": "Chamada final para enviar mensagem no WhatsApp da Maria Júlia"
  },
  "whatsappPitch": "Mensagem persuasiva e acolhedora pré-formatada para enviar no WhatsApp a um lead qualificado"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        propertyId: property.id,
        propertyTitle: property.title,
        headline: parsed.headline || `Oportunidade Exclusiva: ${property.title}`,
        subheadline: parsed.subheadline || `Viva o melhor de ${property.city} com a assessoria de Maria Júlia Corretora.`,
        targetAudience: parsed.targetAudience || 'Famílias exigentes e investidores estratégicos do Sul Catarinense.',
        keyHighlights: parsed.keyHighlights || property.features.slice(0, 4),
        urgencyHook: parsed.urgencyHook || 'Condição de negociação diferenciada por tempo limitado.',
        instagramAdCopy: parsed.instagramAdCopy || 'Um novo padrão de vida aguarda você.',
        googleAdCopy: parsed.googleAdCopy || {
          headlines: [`${property.type} em ${property.city}`, `Código ${property.code} - Alto Padrão`, 'Maria Júlia Corretora'],
          descriptions: [`Agende sua visita com Maria Júlia (CRECI 77301-F). Condições exclusivas de financiamento.`, `Excelente localização em ${property.neighborhood}. Consulte agora.`]
        },
        reelsScript: parsed.reelsScript || {
          hook: `Você já imaginou acordar todos os dias com essa vista em ${property.city}?`,
          body: `Hoje eu vou te apresentar o ${property.title}, um imóvel com ${property.privateArea}m² e acabamento impecável.`,
          callToAction: 'Comente "EU QUERO" ou me chame no WhatsApp pelo link da bio da @majudgamba para receber a apresentação completa.'
        },
        whatsappPitch: parsed.whatsappPitch || `Olá! Separei essa oportunidade única no ${property.title} para você. Podemos agendar uma visita?`,
        generatedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn('Gemini API call failed, generating native high-converting strategy fallback', err);
    }
  }

  // Domain-specific high conversion strategy engine
  const priceFmt = `R$ ${property.price.toLocaleString('pt-BR')}`;
  const isLitoral = property.city === 'Balneário Rincão';

  return {
    propertyId: property.id,
    propertyTitle: property.title,
    headline: isLitoral
      ? `O Refúgio à Beira-Mar Que Sua Família Merece em ${property.city}`
      : `O Ápice do Conforto e Sofisticação no Bairro ${property.neighborhood}`,
    subheadline: `Exclusividade ${property.code} · ${property.privateArea}m² privativos · ${property.suites} suítes com atendimento premium de Maria Júlia (CRECI/SC 77301-F)`,
    targetAudience: isLitoral
      ? 'Empresários e famílias de Criciúma e região que buscam lazer premium, segurança e alta valorização à beira-mar.'
      : 'Profissionais liberais, médicos e investidores que priorizam localização nobre, tranquilidade e acabamento de alto padrão.',
    keyHighlights: property.features.length >= 4 ? property.features.slice(0, 4) : [
      `${property.bedrooms} Dormitórios (${property.suites} Suítes)`,
      `${property.garageSpots} Vagas de Garagem Cobertas`,
      `Localização Privilegiada no ${property.neighborhood}`,
      property.isBankFinancing ? 'Financiamento Bancário Aprovado em 24h' : 'Condição Direta com a Construtora'
    ],
    urgencyHook: property.isUrgentOffer
      ? 'Condição especial de negociação com desconto real para propostas fechadas neste mês!'
      : 'Última unidade disponível com essa configuração de planta e orientação solar.',
    instagramAdCopy: `💎 SEU PRÓXIMO CAPÍTULO COMEÇA AQUI: ${property.title.toUpperCase()}

📍 Localizado no cobiçado bairro ${property.neighborhood} em ${property.city}/SC.

✨ Destaques que encantam:
• ${property.privateArea}m² de área privativa planejada
• ${property.suites} suítes com acabamento nobre
• ${property.features[0] || 'Espaço gourmet integrado'}
• ${property.features[1] || 'Vistas panorâmicas deslumbrantes'}

💰 Investimento: ${priceFmt}
${property.isBankFinancing ? '🏦 Aceita financiamento bancário facilitado e FGTS' : '🤝 Aceita proposta direta'}

📲 Quer conhecer antes que seja vendido?
Envie uma mensagem direta para @majudgamba ou toque no link da bio para agendar sua visita exclusiva comigo!

Maria Júlia Gamba | CRECI/SC 77301-F`,
    googleAdCopy: {
      headlines: [
        `${property.type} ${property.neighborhood}`.slice(0, 30),
        `Código ${property.code} - ${property.city}`.slice(0, 30),
        `Maria Júlia Corretora SC`.slice(0, 30)
      ],
      descriptions: [
        `Imóvel de alto padrão com ${property.privateArea}m² e ${property.suites} suítes. Atendimento personalizado CRECI 77301-F.`.slice(0, 90),
        `Agende sua visita com Maria Júlia. Financiamento rápido e condições diferenciadas.`.slice(0, 90)
      ]
    },
    reelsScript: {
      hook: `[Câmera lenta entrando pelo living] Se você pudesse escolher qualquer lugar de ${property.city} para chamar de lar hoje, seria exatamente este!`,
      body: `Oi, eu sou a Maria Júlia, corretora em Criciúma e Rincão. Olha os detalhes deste ${property.type.toLowerCase()} de ${property.privateArea}m² no ${property.neighborhood}: sacada ampla, iluminação natural incrível e acabamento impecável. Cada metro foi pensado para o conforto da sua família.`,
      callToAction: `Quer receber a planta completa e o memorial descritivo no seu WhatsApp? Deixe um "EU QUERO" nos comentários ou toque no link da minha bio!`
    },
    whatsappPitch: `Olá! Aqui é a corretora Maria Júlia. Vi seu interesse no imóvel ${property.code} (${property.title}). É uma das oportunidades mais singulares de ${property.city}, com ${property.privateArea}m² privativos por ${priceFmt}. Gostaria que eu te enviasse o vídeo tour completo e a simulação de financiamento?`,
    generatedAt: new Date().toISOString()
  };
}
