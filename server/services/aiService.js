const { GoogleGenerativeAI } = require('@google/generative-ai');

// Strict Enums
const ALLOWED_CATEGORIES = [
  'Sanitation',
  'Electrical',
  'Water Supply',
  'Infrastructure',
  'Security',
  'Internet',
  'Transportation',
  'Hostel',
  'Academic',
  'Maintenance',
  'Other',
];

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const ALLOWED_DEPARTMENTS = [
  'Maintenance',
  'Electrical',
  'Sanitation',
  'Security',
  'IT',
  'Administration',
  'Hostel',
  'Transport',
  'Academic',
];

// Deterministic Keyword-Based Fallback Classifier
const fallbackClassifier = ({ title = '', description = '', location = '' }) => {
  const text = `${title} ${description} ${location}`.toLowerCase();

  let category = 'Other';
  let priority = 'Medium';
  let department = 'Maintenance';
  let priorityReason = 'Standard campus complaint logged for technician review.';
  const keywords = [];

  // 1. Sanitation & Water Supply
  if (text.includes('washroom') || text.includes('toilet') || text.includes('dirty') || text.includes('clean') || text.includes('smell') || text.includes('garbage')) {
    category = 'Sanitation';
    department = 'Sanitation';
    keywords.push('sanitation', 'hygiene');
    if (text.includes('water') || text.includes('no water') || text.includes('tap')) {
      priority = 'High';
      priorityReason = 'Essential washroom facility unavailable; high hygiene impact on campus users.';
      keywords.push('washroom', 'water', 'dirty');
    } else {
      priority = 'Medium';
      priorityReason = 'Sanitation cleaning requested for campus area.';
      keywords.push('cleaning', 'washroom');
    }
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('dripping') || text.includes('overflow')) {
    category = 'Water Supply';
    department = 'Maintenance';
    priority = text.includes('leak') || text.includes('flood') ? 'High' : 'Medium';
    priorityReason = 'Active water leakage or supply failure reported; requires prompt plumbing repair.';
    keywords.push('water', 'plumbing', 'leakage');
  }
  // 2. Electrical
  else if (text.includes('electrical') || text.includes('power') || text.includes('spark') || text.includes('wire') || text.includes('bulb') || text.includes('light') || text.includes('switch') || text.includes('fan')) {
    category = 'Electrical';
    department = 'Electrical';
    if (text.includes('spark') || text.includes('smoke') || text.includes('shock') || text.includes('fire')) {
      priority = 'Critical';
      priorityReason = 'Hazardous electrical fault detected; immediate safety dispatch required.';
      keywords.push('electrical', 'hazard', 'safety');
    } else {
      priority = 'High';
      priorityReason = 'Electrical power or fixture failure impacting room usability.';
      keywords.push('power', 'electrical', 'fixture');
    }
  }
  // 3. Internet & IT
  else if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('lms') || text.includes('computer') || text.includes('pc')) {
    category = 'Internet';
    department = 'IT';
    if (text.includes('down') || text.includes('offline') || text.includes('outage') || text.includes('blackout')) {
      priority = 'High';
      priorityReason = 'Network infrastructure outage affecting academic LMS & student study.';
      keywords.push('wifi', 'network', 'outage');
    } else {
      priority = 'Medium';
      priorityReason = 'Slow connectivity or IT device issue logged.';
      keywords.push('internet', 'it-support');
    }
  }
  // 4. Security
  else if (text.includes('security') || text.includes('theft') || text.includes('stolen') || text.includes('intruder') || text.includes('guard') || text.includes('gate') || text.includes('lock')) {
    category = 'Security';
    department = 'Security';
    priority = text.includes('theft') || text.includes('stolen') || text.includes('intruder') ? 'Critical' : 'High';
    priorityReason = 'Campus safety or security incident flagged for immediate officer review.';
    keywords.push('security', 'safety', 'campus-guard');
  }
  // 5. Hostel
  else if (text.includes('hostel') || text.includes('room') || text.includes('bed') || text.includes('mess') || text.includes('warden')) {
    category = 'Hostel';
    department = 'Hostel';
    priority = 'Medium';
    priorityReason = 'Residential hostel facility request.';
    keywords.push('hostel', 'residential');
  }
  // 6. Transportation
  else if (text.includes('bus') || text.includes('transport') || text.includes('shuttle') || text.includes('parking')) {
    category = 'Transportation';
    department = 'Transport';
    priority = 'Medium';
    priorityReason = 'Campus shuttle or transport service feedback.';
    keywords.push('transport', 'bus');
  }
  // 7. Academic
  else if (text.includes('projector') || text.includes('board') || text.includes('lab') || text.includes('classroom') || text.includes('library') || text.includes('exam')) {
    category = 'Academic';
    department = 'Academic';
    priority = 'Medium';
    priorityReason = 'Classroom or academic lab facility issue.';
    keywords.push('academic', 'classroom');
  }

  // Extract clean keywords if empty
  if (keywords.length === 0) {
    keywords.push('campus', 'complaint', category.toLowerCase());
  }

  const locationSummary = location ? `at ${location}` : '';
  const summary = `${title || 'Campus Issue'} ${locationSummary}: ${category} request requiring ${department} action.`;

  return {
    category,
    priority,
    department,
    summary,
    location: location || 'Campus',
    keywords: Array.from(new Set(keywords)),
    priorityReason,
  };
};

// Validate and normalize AI or fallback response against strict allowed enums
const validateAIResponse = (data, inputContext) => {
  let category = ALLOWED_CATEGORIES.includes(data.category) ? data.category : 'Other';
  let priority = ALLOWED_PRIORITIES.includes(data.priority) ? data.priority : 'Medium';
  let department = ALLOWED_DEPARTMENTS.includes(data.department) ? data.department : 'Maintenance';

  // Specific mapping for common Gemini variations
  if (data.category === 'Water' || data.category === 'Plumbing') category = 'Water Supply';
  if (data.category === 'IT' || data.category === 'Network') category = 'Internet';

  if (data.department === 'IT Services' || data.department === 'Networking') department = 'IT';
  if (data.department === 'Plumbing' || data.department === 'Facilities') department = 'Maintenance';

  const summary = data.summary && typeof data.summary === 'string'
    ? data.summary.trim()
    : `${inputContext.title || 'Campus Issue'}: ${category} complaint requiring ${department} team attention.`;

  const priorityReason = data.priorityReason && typeof data.priorityReason === 'string'
    ? data.priorityReason.trim()
    : `Tagged as ${priority} priority based on urgency keywords and location impact.`;

  const keywords = Array.isArray(data.keywords) && data.keywords.length > 0
    ? data.keywords.map(k => String(k).toLowerCase().trim())
    : [category.toLowerCase(), department.toLowerCase()];

  return {
    category,
    priority,
    department,
    summary,
    location: data.location || inputContext.location || 'Campus',
    keywords: Array.from(new Set(keywords)),
    priorityReason,
  };
};

// Main AI Analyzer Function
const analyzeComplaint = async ({ title = '', description = '', location = '' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If GEMINI_API_KEY is not configured or dummy, use deterministic fallback
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] GEMINI_API_KEY not set. Executing deterministic keyword fallback classifier...');
    const rawFallback = fallbackClassifier({ title, description, location });
    return validateAIResponse(rawFallback, { title, description, location });
  }

  try {
    console.log('[AI Service] Invoking Google Gemini API for automated triage...');
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are an AI Campus Complaint Classifier for a college management platform.
Analyze the following complaint and return a STRICT JSON object only. Do NOT include markdown codeblocks (no \`\`\`json).

Allowed Categories (pick exact match):
- Sanitation
- Electrical
- Water Supply
- Infrastructure
- Security
- Internet
- Transportation
- Hostel
- Academic
- Maintenance
- Other

Allowed Priorities (pick exact match):
- Low
- Medium
- High
- Critical

Allowed Departments (pick exact match):
- Maintenance
- Electrical
- Sanitation
- Security
- IT
- Administration
- Hostel
- Transport
- Academic

JSON Schema:
{
  "category": "<Exact Allowed Category>",
  "priority": "<Exact Allowed Priority>",
  "department": "<Exact Allowed Department>",
  "summary": "<1-2 sentence executive summary of the issue>",
  "location": "<Extracted or formatted building location>",
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "priorityReason": "<1 sentence rationale explaining why this priority level was assigned>"
}

Complaint Details:
Title: "${title}"
Description: "${description}"
Location: "${location}"`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    console.log('[AI Service Raw Output]:', responseText);

    // Clean JSON response (strip markdown ticks if any)
    const cleanedJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJsonText);

    return validateAIResponse(parsedData, { title, description, location });
  } catch (error) {
    console.warn('[AI Service Warning] Gemini API call failed or timed out:', error.message);
    console.log('[AI Service] Executing deterministic fallback classifier...');
    const rawFallback = fallbackClassifier({ title, description, location });
    return validateAIResponse(rawFallback, { title, description, location });
  }
};

module.exports = {
  analyzeComplaint,
  fallbackClassifier,
  ALLOWED_CATEGORIES,
  ALLOWED_PRIORITIES,
  ALLOWED_DEPARTMENTS,
};
