/* ══════════════════════════════════════════════
   ADI — AdiOS AI Chatbot v1.0
   Client-side knowledge-base chatbot
   No external APIs. Pure vanilla JS.
   Session state persisted in-memory (module-level variable).
══════════════════════════════════════════════ */

'use strict';

/* ─── Knowledge Base & Response Engine ─── */

const ADI_KB = {

  // ─── GREETINGS ───
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'howdy', 'good morning', 'good evening', 'good afternoon', 'namaste', 'yo', 'sup', 'what\'s up', 'whats up'],
    responses: [
      "Hey there! 👋 I'm Adi — AdiOS's onboard intelligence layer. I can help you navigate our sovereign AI OS, understand our three engines, or explore use cases for your industry. What's on your mind?",
      "Hello! Great to see you here. I'm Adi, your guide to the AdiOS ecosystem — India's first sovereign AI Operating System. What would you like to query?"
    ],
    followups: ["What is AdiOS?", "Tell me about the three engines", "How do I get access?"]
  },

  // ─── WHAT IS ADIOS ───
  what_is_adios: {
    patterns: ['what is adios', 'what is adi os', 'explain adios', 'tell me about adios', 'what does adios do', 'adios platform', 'what is this', 'what are you', 'about adios'],
    responses: [
      "AdiOS is an AI Operating System — not a SaaS tool or chatbot wrapper. It's built for India's regulated enterprises, connecting AI compute to real applications while keeping your data within Indian borders. Think of it as the missing integration layer between India's ₹10,300 Cr GPU infrastructure and the apps that need to use it intelligently.",
      "Booting up an answer... AdiOS is sovereign AI infrastructure — an operating system that lets India's banks, hospitals, government agencies, and farms run AI queries in 127ms with full compliance baked in. One query interface, three specialized engines, zero data movement across borders."
    ],
    followups: ["What are the three engines?", "Why do we need sovereign AI?", "Who is it built for?"]
  },

  // ─── THREE ENGINES ───
  three_engines: {
    patterns: ['three engines', '3 engines', 'engines', 'brain engine', 'lakehouse engine', 'governance engine', 'how does it work', 'architecture', 'how adios works', 'under the hood'],
    responses: [
      "AdiOS runs on three engines working in parallel through a single query:\n\n🧠 Brain Engine — The semantic knowledge layer. Knows WHO, WHAT, WHY. Every fact is confidence-scored and provenance-tracked — no black boxes.\n\n📊 Lakehouse Engine — The analytical data layer. Knows WHEN, WHERE, HOW MUCH. Lightning-fast queries on billion-row datasets without moving a byte.\n\n🛡️ Governance Engine — Policy-as-architecture. Controls WHO MAY SEE WHAT. Compliance is embedded at the kernel level, not bolted on.\n\nAsk once → all three engines answer in parallel.",
      "Query routing initiated... Three engines, one OS: the Brain Engine handles semantic intelligence (confidence-scored knowledge graphs), the Lakehouse Engine handles analytical queries (SQL at 127ms), and the Governance Engine embeds compliance at the kernel level. They communicate through a proprietary zero-copy transport layer — completely within your infrastructure."
    ],
    followups: ["How fast is it?", "What is the trust model?", "How is compliance embedded?"]
  },

  // ─── BRAIN ENGINE ───
  brain_engine: {
    patterns: ['brain engine', 'knowledge graph', 'semantic', 'confidence score', 'provenance', 'who what why', 'facts', 'knowledge base', 'semantic knowledge'],
    responses: [
      "The Brain Engine is AdiOS's semantic knowledge layer — it answers WHO, WHAT, and WHY. Every fact stored is confidence-scored (0.70 to 0.95+) and has its provenance tracked, so you can trace exactly where each data point came from. No hallucinations you can't audit. Regulators can trace every answer.",
      "Loading knowledge graph... The Brain Engine maintains a sovereign knowledge graph where every entity, relationship, and claim has a confidence score attached. Three tiers: personal observation (0.70) → domain-reviewed (0.85) → enterprise truth (0.95+). If an AI answer can't prove itself, it shouldn't be trusted."
    ],
    followups: ["What is the trust model?", "How does confidence scoring work?", "What about data provenance?"]
  },

  // ─── LAKEHOUSE ENGINE ───
  lakehouse_engine: {
    patterns: ['lakehouse', 'data engine', 'analytics', 'sql', 'query', 'data analysis', 'when where how much', 'analytical', 'data layer', '127ms'],
    responses: [
      "The Lakehouse Engine is AdiOS's analytical powerhouse — answering WHEN, WHERE, and HOW MUCH. It runs high-speed SQL queries on billion-row datasets at 127ms, built on a proprietary stack. Critically: compute goes to the data, not the other way around. Your data never moves, never crosses borders.",
      "Querying data layer... The Lakehouse Engine delivers compliance-grade analytics with zero data movement. You get full analytical capability — time-series, aggregations, cross-dataset joins — while your data stays sovereign. That's 1.5 million times faster than the manual processes most Indian enterprises use today."
    ],
    followups: ["How does zero data movement work?", "What about compliance?", "Which industries benefit most?"]
  },

  // ─── GOVERNANCE ENGINE ───
  governance_engine: {
    patterns: ['governance', 'compliance', 'dpdp', 'rbi', 'irdai', 'sebi', 'regulation', 'policy', 'who may see', 'data sovereignty', 'kernel', 'compliance layer'],
    responses: [
      "The Governance Engine is AdiOS's compliance kernel — it controls WHO MAY SEE WHAT at the architecture level. DPDP, RBI, IRDAI, and SEBI rules aren't a checklist — they're machine-executable policies embedded before any query runs. Compliance is checked inline, not reviewed 3 weeks later.",
      "Compliance kernel active... Most platforms bolt compliance on as an afterthought — AdiOS embeds it at the kernel level. Every query is policy-checked before execution. If a DPDP rule says a piece of data can't leave a region, the engine enforces it automatically. Zero manual review cycles."
    ],
    followups: ["What regulations does it cover?", "How does DPDP compliance work?", "What about audit trails?"]
  },

  // ─── SOVEREIGNTY ───
  sovereignty: {
    patterns: ['sovereign', 'sovereignty', 'data stays', 'india data', 'border', 'foreign cloud', 'data leaves', 'cross border', 'keep data in india', 'on premise', 'on-prem'],
    responses: [
      "Sovereignty is core to AdiOS's architecture, not a feature flag. Your data stays within Indian borders — always. When you query our platform, compute travels to the data, not the other way around. No bytes cross to foreign hyperscalers. Every query is DPDP-safe by design.",
      "Sovereignty mode active... India's DPDP Act is clear: sensitive data must stay in India. But most AI platforms route everything through US or EU data centers. AdiOS is built offline-first, sovereignty-native — it boots to a knowledge graph in your own infrastructure in 90 seconds."
    ],
    followups: ["What is the DPDP Act?", "How does offline-first work?", "Tell me about the governance engine"]
  },

  // ─── TRUST MODEL ───
  trust_model: {
    patterns: ['trust', 'confidence', 'accuracy', 'hallucination', 'prove', 'audit trail', 'black box', 'transparent', 'explainable', 'provenance', 'sources'],
    responses: [
      "AdiOS has a three-tier confidence scoring model: 0.70 (personal observation — your local data) → 0.85 (domain-reviewed — expert-validated) → 0.95+ (enterprise truth — fully verified). Every answer comes with its provenance chain attached. No black boxes. Regulators can audit any output.",
      "Trust architecture loaded... Unlike LLMs that hallucinate without warning, AdiOS scores every fact. When you get an answer at 0.95 confidence, it means that claim has been cross-validated by multiple enterprise-grade sources with a full audit trail. You can trace exactly where each data point came from."
    ],
    followups: ["How does the brain engine work?", "What about regulator audits?", "Show me a use case"]
  },

  // ─── SPEED / PERFORMANCE ───
  performance: {
    patterns: ['127ms', 'fast', 'speed', 'performance', 'query time', 'milliseconds', 'how fast', 'time', 'slow', 'latency', '1.5 million', 'faster'],
    responses: [
      "127ms — that's the query time for a fully sovereign, compliance-checked, provenance-tracked answer across a billion-row dataset. For context, the manual alternative takes 7 months. That's 1.5 million times faster. And yes, compliance is still embedded — it doesn't trade speed for sovereignty.",
      "Performance metrics loaded: 127ms query time, compliance embedded inline, zero data movement. The key is our proprietary zero-copy transport layer — all three engines communicate without serializing data between them. The result: enterprise-grade intelligence at real-time speed."
    ],
    followups: ["What makes it so fast?", "How does zero-copy work?", "See it in action?"]
  },

  // ─── BFSI USE CASE ───
  bfsi: {
    patterns: ['bfsi', 'banking', 'finance', 'insurance', 'financial', 'bank', 'nbfc', 'loan', 'risk', 'credit', 'rbi compliance', 'irdai compliance'],
    responses: [
      "For BFSI, AdiOS is transformative: risk assessment that cross-references a borrower's history across your entire knowledge graph in milliseconds, compliance automation that's RBI/IRDAI-ready out of the box, and customer intelligence that stays within Indian borders. No more 3-week regulatory review cycles.",
      "BFSI module queried... Banks and insurers face a triple constraint: speed of AI, depth of compliance, and sovereignty of data. AdiOS solves all three simultaneously. A loan officer gets a 127ms risk decision with full provenance — auditable by RBI without any data leaving India."
    ],
    followups: ["Tell me about other industries", "How does compliance work?", "Request a demo?"]
  },

  // ─── GOVERNMENT USE CASE ───
  government: {
    patterns: ['government', 'govt', 'defense', 'military', 'courts', 'e-courts', 'public health', 'citizen services', 'public sector'],
    responses: [
      "Government is AdiOS's natural home. We're built for e-Courts (cross-case intelligence, judgment provenance), defense (sensitive data sovereign by design), and citizen services (unified intelligence across departments without data silos). DPDP compliance is built in, not retrofitted.",
      "Government sector module active... Imagine a district court querying decades of case law across all courts in 127ms, or a public health department cross-referencing patient data across 200 hospitals — fully anonymized, fully sovereign, no data ever exported. That's the AdiOS government proposition."
    ],
    followups: ["How about agriculture?", "Tell me about defense use cases", "What about data privacy?"]
  },

  // ─── AGRICULTURE USE CASE ───
  agriculture: {
    patterns: ['agriculture', 'farming', 'farmers', 'kvk', 'icar', 'fpo', 'crop', 'pest', 'seeds', 'agri', 'rural', 'farm'],
    responses: [
      "Agriculture is our most compelling demo. India has 731 KVKs, 113 ICAR institutes, and 15,000+ FPOs — each generating knowledge, none connected. AdiOS unifies this into a sovereign knowledge graph. A farmer asking 'Which cotton variety had best pest resistance in my district over 3 monsoons?' gets an answer in 127ms with 0.95 confidence. The old way took 7 months.",
      "Loading agriculture intelligence... India's agricultural knowledge is fragmented across institutions. AdiOS's Brain Engine + Lakehouse Engine work together: semantic knowledge from KVKs/ICAR cross-referenced with 3 years of sensor and FPO data. Result: 0.95 confidence answers for farmers, fully anonymized, DPDP-safe."
    ],
    followups: ["What other sectors do you cover?", "How does the knowledge graph work?", "How many data sources?"]
  },

  // ─── HEALTHCARE USE CASE ───
  healthcare: {
    patterns: ['healthcare', 'health', 'hospital', 'patient', 'medical', 'clinical', 'doctor', 'pharma', 'medicine'],
    responses: [
      "Healthcare AI has one non-negotiable: patient data sovereignty. AdiOS enables cross-hospital intelligence — pattern detection, treatment optimization, research — without patient data ever leaving its source institution. Zero-copy means anonymization happens in-memory. No central patient database. Just federated sovereign intelligence.",
      "Healthcare module queried... With AdiOS, a hospital network can query for rare condition patterns across 50 hospitals in real-time without centralizing patient records. Compliance with health data regulations is embedded, not bolted on. Doctors get intelligence; patients keep privacy."
    ],
    followups: ["What about data privacy?", "Tell me about other sectors", "How does federated work?"]
  },

  // ─── EARLY ACCESS / DEMO ───
  early_access: {
    patterns: ['early access', 'demo', 'trial', 'get started', 'sign up', 'waitlist', 'how do i get', 'access', 'try it', 'request', 'boot demo', 'join', 'contact'],
    responses: [
      "Ready to boot! We're in early access — the best way in is through our Boot Demo request at the top of the page. For enterprise discussions and custom pricing, reach out directly to contact@adiosplat.io or call +91 7762006300. Our team at Hyderabad HQ is ready to deep-dive.",
      "Access module loading... We're running a selective early access program for India's regulated enterprises. Hit 'Request Boot Demo' at the top — or if you already know you want to talk enterprise, email contact@adiosplat.io. We're in Hyderabad; expect a response within 24 hours."
    ],
    followups: ["What's the pricing model?", "Who is AdiOS for?", "What happens in a demo?"]
  },

  // ─── PRICING ───
  pricing: {
    patterns: ['pricing', 'price', 'cost', 'how much', 'subscription', 'free tier', 'enterprise plan', 'plan', 'paid', 'affordable', 'rupees', 'inr'],
    responses: [
      "We're in early access — custom pricing applies for enterprise deployments. Our model has three tiers: a Free tier for exploration, a standard subscription at ₹2,500/month, and Enterprise with custom pricing. We also offer Model Router access (sovereign AI models) and a marketplace for compliance modules. Reach out to contact@adiosplat.io for your specific use case.",
      "Pricing query received. AdiOS has subscription tiers (Free → ₹2,500/month → Enterprise custom), plus revenue streams from Model Router (access to Sarvam AI, Gnani.ai, BharatGen with 15% margin) and marketplace (AI agents, compliance modules, data products at 15-20% revenue share). For detailed enterprise pricing: contact@adiosplat.io."
    ],
    followups: ["What's included in enterprise?", "What is the Model Router?", "What's in the marketplace?"]
  },

  // ─── MARKETPLACE ───
  marketplace: {
    patterns: ['marketplace', 'models', 'agents', 'plugins', 'modules', 'extensions', 'ecosystem', 'app store', 'model router'],
    responses: [
      "The AdiOS Marketplace is where the ecosystem lives: sovereign AI models (Sarvam AI, Gnani.ai, BharatGen, Soket Labs), compliance modules (DPDP, RBI, IRDAI, SEBI as per-regulation subscriptions), AI agents, and certified data products. The Model Router lets you access any sovereign model through one interface with built-in compliance.",
      "Marketplace module active... Think of it as India's sovereign AI app store. Developers and enterprises can publish models, agents, and compliance modules. We take 15-20% revenue share and handle all the compliance certification. For users, it means one interface to India's entire sovereign AI ecosystem."
    ],
    followups: ["What models are available?", "How do I publish to the marketplace?", "What is DPDP compliance?"]
  },

  // ─── INDIA AI ECOSYSTEM ───
  india_ai: {
    patterns: ['india ai', 'indiaai', 'sarvam', 'gnani', 'bharatgen', 'soket', 'sovereign model', 'indian ai', 'yotta', 'e2e networks', 'tata communications', 'gpu', 'compute'],
    responses: [
      "India is building serious AI infrastructure — ₹10,300 Cr deployed, 38,000+ GPUs via IndiaAI, and homegrown sovereign model vendors: Sarvam AI, Gnani.ai, BharatGen, Soket Labs. Compute from IndiaAI, Yotta, E2E Networks, Tata. AdiOS is the missing integration layer that connects all of this to actual enterprise applications while keeping everything sovereign.",
      "India's AI stack query... The pieces are there: compute (IndiaAI, Yotta, E2E), models (Sarvam, Gnani, BharatGen, Soket Labs), regulations (DPDP, IndiaAI governance). What's been missing is the OS layer — the integration platform that makes all of it work together for regulated enterprises. That's AdiOS."
    ],
    followups: ["How does AdiOS fit in the stack?", "What is the Model Router?", "Who are your competitors?"]
  },

  // ─── COMPETITION / PALANTIR ───
  competition: {
    patterns: ['competitor', 'palantir', 'vs', 'alternative', 'compared to', 'competition', 'other options', 'microsoft azure', 'aws', 'google cloud', 'hyperscaler'],
    responses: [
      "Our closest conceptual comparison is Palantir — but Palantir is built for Western defense and enterprise markets. There's no India-focused sovereign AI OS. Foreign hyperscalers (AWS, Azure, GCP) move your data outside Indian borders. AdiOS is purpose-built for India's regulatory environment, India's data sovereignty requirements, and India's enterprise reality.",
      "Competitive analysis loaded... Palantir operates in the same general space but targets Western markets. Microsoft, AWS, Google — they're hyperscalers, not sovereignty-native. No existing platform combines sovereign compliance, multi-engine intelligence, and India-native regulation support in one OS. AdiOS is filling a gap that nobody else is addressing."
    ],
    followups: ["What's your unique advantage?", "How does sovereignty work?", "What about DPDP compliance?"]
  },

  // ─── OFFLINE-FIRST ───
  offline: {
    patterns: ['offline', 'offline first', 'no internet', 'edge', 'on premise', 'on-prem', 'local', 'air gap', 'disconnected', 'boots in 90'],
    responses: [
      "AdiOS is offline-first by design — it boots to a full knowledge graph in 90 seconds, entirely within your own infrastructure. No cloud dependency. No phone-home. Your queries never leave your premises unless you choose otherwise. For defense, healthcare, and financial institutions that need complete air-gap capability, this is essential.",
      "Offline-first architecture confirmed. AdiOS initializes all three engines locally — Brain, Lakehouse, and Governance — without requiring external connectivity. 90-second boot time means even in connectivity-constrained environments (remote government offices, field hospitals, rural KVKs), the full intelligence stack is available."
    ],
    followups: ["What does 90-second boot mean?", "How does it work on-prem?", "What about cloud deployment?"]
  },

  // ─── COMPANY / FOUNDERS ───
  company: {
    patterns: ['company', 'who built', 'founder', 'malay', 'malay baral', 'team', 'hyderabad', 'incorporated', 'cin', 'about the company', 'who made adios'],
    responses: [
      "AdiOS Platform Private Limited is based in Hyderabad, India — founded by Malay Baral. We're registered under CIN U58201TS2026PTC211867. We're building India's sovereign AI OS, which means deep collaboration with the Indian AI ecosystem: IndiaAI, sovereign model vendors, and regulated enterprises. Contact: contact@adiosplat.io | +91 7762006300.",
      "Company profile loaded... AdiOS Platform Private Limited, Hyderabad. Founded by Malay Baral. The mission is simple: give India's regulated enterprises — banks, hospitals, government agencies, farmers — AI intelligence that's as sovereign as the land they operate in. Reach us at contact@adiosplat.io."
    ],
    followups: ["How do I reach the team?", "Are you hiring?", "What's the vision?"]
  },

  // ─── DPDP ACT ───
  dpdp: {
    patterns: ['dpdp', 'data protection', 'privacy', 'personal data', 'consent', 'pdpb', 'data act', 'privacy law'],
    responses: [
      "The Digital Personal Data Protection (DPDP) Act is India's landmark data privacy law. It mandates that personal data of Indian citizens must be stored and processed within India, with explicit consent for collection and usage. AdiOS makes DPDP compliance automatic — it's embedded in the Governance Engine, not reviewed by a lawyer after the fact.",
      "DPDP compliance module active. India's DPDP Act creates real operational obligations for enterprises handling personal data. AdiOS's Governance Engine treats DPDP as machine-executable policy — every query is automatically DPDP-checked before execution. No data crosses borders. Consent tracking is built in."
    ],
    followups: ["What other regulations do you cover?", "How is compliance embedded?", "What about RBI guidelines?"]
  },

  // ─── TECHNICAL QUESTIONS ───
  technical: {
    patterns: ['technology', 'stack', 'built on', 'how built', 'technical', 'implementation', 'what technology', 'open source', 'api', 'integration', 'sdk'],
    responses: [
      "AdiOS is built on a proprietary stack with 7 patent claims pending — I can't share specific technology names at this stage. What I can say: the Brain Engine uses a high-performance knowledge graph, the Lakehouse Engine runs analytical queries at 127ms on billion-row datasets, and the Governance Engine enforces policies at the kernel level. The engines communicate via a zero-copy transport layer.",
      "Technical stack classified (patents pending)... What I can share: all three engines run on proprietary infrastructure designed from the ground up for India's sovereignty requirements. Zero external dependencies in the query path. 90-second boot. 127ms query time. 7 patent claims. For deep technical discussions, our team at contact@adiosplat.io can go into detail under NDA."
    ],
    followups: ["What are the patent claims about?", "Is there an API?", "How do I integrate?"]
  },

  // ─── BOOT TIME ───
  boot_time: {
    patterns: ['90 seconds', 'boot', 'startup', 'initialize', 'how long', 'boot time', 'starts in', 'ready in'],
    responses: [
      "90 seconds from cold start to a fully operational knowledge graph — Brain Engine, Lakehouse Engine, and Governance Engine all initialized and talking through the IPC bus. For context, a traditional enterprise data platform takes days to configure and hours to run a single query. AdiOS boots faster than most team meetings start.",
      "Boot sequence: 90 seconds. That's the time from zero to a fully sovereign, compliance-ready, three-engine AI OS running in your infrastructure. All data stays local, no cloud calls, no configuration wizard. Boot → Query → Answer. That's the AdiOS experience."
    ],
    followups: ["What happens during the 90 seconds?", "Can it run offline?", "What are the hardware requirements?"]
  },

  // ─── MODEL ROUTER ───
  model_router: {
    patterns: ['model router', 'ai models', 'llm', 'sarvam', 'gnani', 'sovereign model', 'language model', 'chatgpt', 'gpt', 'gemini', 'openai', 'models available'],
    responses: [
      "The Model Router is AdiOS's gateway to India's sovereign AI model ecosystem — Sarvam AI, Gnani.ai, BharatGen, Soket Labs, and more. One API, all sovereign models, with compliance and provenance built in. We don't route you to GPT-4 or Gemini — only models that keep your data within Indian borders. 15% margin on usage.",
      "Model Router module queried... Rather than locking you into one model, AdiOS routes your queries to the best available sovereign model for your use case — all through one interface, all compliant, all India-sovereign. Sarvam for multilingual, Gnani.ai for voice intelligence, BharatGen for general tasks. We handle compliance; you get capability."
    ],
    followups: ["Which models are available?", "How does pricing work?", "What about custom models?"]
  },

  // ─── IPC BUS ───
  ipc_bus: {
    patterns: ['ipc', 'ipc bus', 'zero copy', 'engines communicate', 'parallel', 'transport', 'how engines talk'],
    responses: [
      "The three engines communicate through a proprietary zero-copy transport — data is never serialized, copied, or moved between engines. They share memory directly. This is the secret to 127ms query time: all three engines answer your query in parallel, and the results are assembled in-memory without any data leaving the system.",
      "IPC Bus active... Zero-copy transport means when the Brain Engine needs to tell the Lakehouse Engine about a confidence score, it doesn't write it to disk or serialize it over a network. Pure in-memory reference passing. That's how three engines can collaborate on one query and still return an answer in 127ms."
    ],
    followups: ["How fast is a query?", "What are the three engines?", "Tell me about performance"]
  },

  // ─── FEEDBACK / THANKS ───
  thanks: {
    patterns: ['thanks', 'thank you', 'great', 'awesome', 'cool', 'nice', 'excellent', 'perfect', 'helpful', 'got it', 'understood', 'makes sense', 'interesting'],
    responses: [
      "Glad that helped! I'm here whenever you have more questions about AdiOS. Is there a specific use case or technical aspect you'd like to dig deeper into?",
      "Happy to help! If you're curious about a specific industry, a particular engine, or want to get started with a demo — just ask. Or reach out to our team at contact@adiosplat.io for a deeper conversation."
    ],
    followups: ["Tell me more about the engines", "Request early access", "Explore use cases"]
  },

  // ─── WHO IS THIS FOR ───
  target_audience: {
    patterns: ['who is it for', 'target', 'customers', 'users', 'who uses', 'industries', 'sectors', 'regulated', 'enterprise', 'who should use'],
    responses: [
      "AdiOS is built for India's regulated enterprises — industries where data sovereignty, compliance, and audit trails aren't optional:\n\n• BFSI (banks, NBFCs, insurance)\n• Government (central, state, defense, judiciary)\n• Agriculture (KVKs, ICAR, FPOs, cooperative banks)\n• Healthcare (hospitals, pharma, public health)\n\nIf your enterprise operates under RBI, IRDAI, SEBI, DPDP, or any state-level regulation — AdiOS was built for you.",
      "Industry targeting active... Any enterprise in India that (a) handles sensitive data, (b) must comply with data localization regulations, and (c) needs real-time AI intelligence. BFSI for compliance-grade financial AI, Government for sovereign intelligence, Agriculture for unified knowledge across 731 KVKs, Healthcare for patient data sovereignty."
    ],
    followups: ["Tell me about BFSI use cases", "Agriculture use case?", "Healthcare intelligence?"]
  },

  // ─── DEFAULT FALLBACK ───
  fallback: {
    patterns: [],
    responses: [
      "That's a great question! It's a bit outside my current knowledge module — for detailed technical discussions or specific enterprise requirements, reach out to our team at contact@adiosplat.io. They'd love to chat and can go much deeper than I can. 🚀",
      "Hmm, let me be honest — that's beyond what I can query right now. Our team at contact@adiosplat.io handles deeper technical and commercial discussions. Alternatively, try asking about our three engines, use cases, or early access!"
    ],
    followups: ["What is AdiOS?", "What industries do you serve?", "How do I get access?"]
  }
};

/* ─── Response Matcher ─── */

function adiGetResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  // Score each category
  let bestScore = 0;
  let bestCategory = 'fallback';

  for (const [categoryKey, category] of Object.entries(ADI_KB)) {
    if (categoryKey === 'fallback') continue;

    let score = 0;
    for (const pattern of category.patterns) {
      if (input.includes(pattern)) {
        // Longer pattern = more specific match = higher score
        score += pattern.length * 2;
      }
      // Partial word match
      const words = pattern.split(' ');
      for (const word of words) {
        if (word.length > 3 && input.includes(word)) {
          score += word.length;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = categoryKey;
    }
  }

  const category = ADI_KB[bestCategory];
  const responses = category.responses;
  // Pick a response — alternate between them for variety
  const responseIdx = Math.floor(Math.random() * responses.length);
  const response = responses[responseIdx];

  return {
    text: response,
    followups: category.followups || ADI_KB.fallback.followups
  };
}

/* ─── In-Memory Session State ─── */
// In-memory conversation state — persists for the page session.

var _adiSession = null;

function adiGetSession() {
  if (!_adiSession) {
    _adiSession = { messages: [], opened: false, hasWelcomed: false };
  }
  return _adiSession;
}

function adiSaveSession(session) {
  _adiSession = session;
}

/* ─── Time formatter ─── */

function adiFormatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ══════════════════════════════════════════════
   MAIN CHATBOT INIT
══════════════════════════════════════════════ */

function initAdiChat() {
  // Build DOM
  adiInjectHTML();

  // Get references
  const chatBtn = document.getElementById('adi-chat-btn');
  const chatWindow = document.getElementById('adi-chat-window');
  const closeBtn = document.getElementById('adi-close-btn');
  const messagesEl = document.getElementById('adi-messages');
  const inputEl = document.getElementById('adi-input');
  const sendBtn = document.getElementById('adi-send-btn');
  const badge = document.getElementById('adi-badge');

  if (!chatBtn || !chatWindow) return;

  // Restore session
  const session = adiGetSession();

  // Animate button entrance after a delay
  setTimeout(() => {
    chatBtn.classList.add('adi-btn-visible');
    // Show badge if not yet opened
    if (!session.opened) {
      setTimeout(() => badge?.classList.add('adi-badge-visible'), 1200);
    }
  }, 1500);

  // Restore previous messages
  if (session.messages.length > 0) {
    session.messages.forEach(msg => {
      renderMessage(msg.role, msg.text, msg.time, false);
    });
    setTimeout(() => scrollToBottom(messagesEl), 100);
  }

  // Toggle chat window
  chatBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('adi-window-open');
    chatBtn.classList.toggle('adi-chat-open', isOpen);

    if (isOpen) {
      badge?.classList.remove('adi-badge-visible');
      session.opened = true;
      adiSaveSession(session);

      // Show welcome message if first time
      if (!session.hasWelcomed) {
        session.hasWelcomed = true;
        adiSaveSession(session);
        setTimeout(() => showWelcome(messagesEl, session), 400);
      } else {
        setTimeout(() => scrollToBottom(messagesEl), 100);
      }

      // Focus input
      setTimeout(() => inputEl?.focus(), 500);
    }
  });

  // Close button
  closeBtn?.addEventListener('click', () => {
    chatWindow.classList.remove('adi-window-open');
    chatBtn.classList.remove('adi-chat-open');
  });

  // Send on button click
  sendBtn?.addEventListener('click', () => sendMessage(inputEl, messagesEl, session));

  // Send on Enter (Shift+Enter for newline)
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl, messagesEl, session);
    }
  });

  // Auto-resize textarea
  inputEl?.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.classList.contains('adi-window-open')) {
      chatWindow.classList.remove('adi-window-open');
      chatBtn.classList.remove('adi-chat-open');
    }
  });
}

/* ─── HTML Injection ─── */

function adiInjectHTML() {
  const html = `
    <!-- ADI CHATBOT — Floating Button -->
    <button id="adi-chat-btn" aria-label="Chat with Adi — AdiOS AI Assistant" aria-haspopup="dialog">
      <div class="adi-btn-icon-chat" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#1a1f2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="9" cy="10" r="1" fill="#1a1f2e"/>
          <circle cx="12" cy="10" r="1" fill="#1a1f2e"/>
          <circle cx="15" cy="10" r="1" fill="#1a1f2e"/>
        </svg>
      </div>
      <div class="adi-btn-close-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
          <path d="M18 6L6 18M6 6l12 12" stroke="#1a1f2e" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
      <span id="adi-badge" class="adi-badge" aria-label="1 new message">1</span>
    </button>

    <!-- ADI CHATBOT — Chat Window -->
    <div id="adi-chat-window" role="dialog" aria-label="Chat with Adi" aria-modal="true">
      <!-- Header -->
      <div class="adi-header">
        <div class="adi-avatar" aria-hidden="true">
          <img src="assets/icon-128.jpg" alt="Adi" width="36" height="36" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg viewBox=\\'0 0 36 36\\' fill=\\'none\\'><circle cx=\\'18\\' cy=\\'18\\' r=\\'18\\' fill=\\'#d4a843\\'></circle><text x=\\'18\\' y=\\'23\\' text-anchor=\\'middle\\' fill=\\'#1a1f2e\\' font-size=\\'14\\' font-weight=\\'700\\'>A</text></svg>'">
        </div>
        <div class="adi-header-info">
          <div class="adi-header-name">Adi</div>
          <div class="adi-header-status">
            <span class="adi-status-dot" aria-hidden="true"></span>
            <span class="adi-status-text">Online</span>
          </div>
        </div>
        <div class="adi-header-actions">
          <button id="adi-close-btn" class="adi-header-btn" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div id="adi-messages" class="adi-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

      <!-- Input -->
      <div class="adi-input-area">
        <textarea
          id="adi-input"
          placeholder="Ask about AdiOS..."
          rows="1"
          aria-label="Type your message"
          autocomplete="off"
          spellcheck="false"
        ></textarea>
        <button id="adi-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="adi-chat-footer">
        <span class="adi-chat-footer-text">
          AdiOS Platform · <a href="mailto:contact@adiosplat.io">contact@adiosplat.io</a>
        </span>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'adi-chat-container';
  container.innerHTML = html;
  document.body.appendChild(container);
}

/* ─── Welcome Message ─── */

function showWelcome(messagesEl, session) {
  const welcomeText = "Hey! I'm Adi — your guide to the AdiOS ecosystem. 👋\n\nI can help you understand our sovereign AI operating system, explore use cases, or answer questions about our platform.\n\nWhat would you like to know?";

  const quickStarters = [
    "What is AdiOS?",
    "How does sovereign AI work?",
    "What industries do you serve?",
    "How do I get early access?"
  ];

  renderMessage('adi', welcomeText, adiFormatTime(), true, quickStarters, true);
  scrollToBottom(messagesEl);

  // Save welcome to session
  session.messages.push({ role: 'adi', text: welcomeText, time: adiFormatTime() });
  adiSaveSession(session);
}

/* ─── Render Message ─── */

function renderMessage(role, text, time, animated = true, quickReplies = [], isWelcome = false) {
  const messagesEl = document.getElementById('adi-messages');
  if (!messagesEl) return;

  const msgEl = document.createElement('div');
  msgEl.className = `adi-msg adi-msg-${role}${isWelcome ? ' adi-welcome-msg' : ''}`;
  if (!animated) {
    msgEl.style.animation = 'none';
  }

  // Format text: handle newlines
  const formattedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  const bubbleHTML = `<div class="adi-msg-bubble"><p>${formattedText}</p></div>`;

  let quickRepliesHTML = '';
  if (quickReplies && quickReplies.length > 0) {
    const btns = quickReplies.map((q, i) =>
      `<button class="adi-quick-btn" style="animation-delay: ${i * 80}ms" data-query="${q.replace(/"/g, '&quot;')}">${q}</button>`
    ).join('');
    quickRepliesHTML = `<div class="adi-quick-replies">${btns}</div>`;
  }

  const timeHTML = `<span class="adi-msg-time">${time}</span>`;

  msgEl.innerHTML = bubbleHTML + quickRepliesHTML + timeHTML;

  // Wire up quick-reply buttons
  messagesEl.appendChild(msgEl);
  scrollToBottom(messagesEl);

  // Attach quick-reply listeners
  msgEl.querySelectorAll('.adi-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        // Remove quick replies after click
        const container = btn.closest('.adi-quick-replies');
        if (container) container.remove();

        // Trigger user message
        const session = adiGetSession();
        processUserMessage(query, document.getElementById('adi-messages'), session);
      }
    });
  });

  return msgEl;
}

/* ─── Send Message ─── */

function sendMessage(inputEl, messagesEl, session) {
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  inputEl.style.height = 'auto';

  processUserMessage(text, messagesEl, session);
}

function processUserMessage(text, messagesEl, session) {
  const time = adiFormatTime();

  // Render user message
  renderMessage('user', text, time);

  // Save to session
  session.messages.push({ role: 'user', text, time });
  adiSaveSession(session);

  // Show typing indicator
  const typingEl = showTyping(messagesEl);

  // Simulate thinking time (400-900ms for authenticity)
  const thinkTime = 400 + Math.random() * 500;

  setTimeout(() => {
    // Remove typing indicator
    typingEl?.remove();

    // Get response
    const result = adiGetResponse(text);
    const responseTime = adiFormatTime();

    // Render Adi's response with follow-up suggestions
    renderMessage('adi', result.text, responseTime, true, result.followups);

    // Save to session
    session.messages.push({ role: 'adi', text: result.text, time: responseTime });
    adiSaveSession(session);

    scrollToBottom(messagesEl);
  }, thinkTime);
}

/* ─── Typing Indicator ─── */

function showTyping(messagesEl) {
  const typingEl = document.createElement('div');
  typingEl.className = 'adi-typing';
  typingEl.setAttribute('aria-label', 'Adi is thinking');
  typingEl.innerHTML = `
    <div class="adi-typing-bubble">
      <span class="adi-typing-label">Adi is thinking</span>
      <span class="adi-dot" aria-hidden="true"></span>
      <span class="adi-dot" aria-hidden="true"></span>
      <span class="adi-dot" aria-hidden="true"></span>
    </div>
  `;
  messagesEl.appendChild(typingEl);
  scrollToBottom(messagesEl);
  return typingEl;
}

/* ─── Scroll to Bottom ─── */

function scrollToBottom(messagesEl) {
  if (!messagesEl) return;
  requestAnimationFrame(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

/* ─── Init on DOM Ready ─── */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdiChat);
} else {
  initAdiChat();
}
