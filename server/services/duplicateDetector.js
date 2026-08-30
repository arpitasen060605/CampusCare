// Stop words set for normalization
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's',
  't', 'can', 'will', 'just', 'don', 'should', 'now', 'this', 'that', 'these',
  'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'has', 'have', 'had',
  'having', 'do', 'does', 'did', 'doing', 'it', 'me', 'us', 'we', 'they', 'them'
]);

// Helper to tokenize text into unigrams & bigrams
const tokenizeText = (text = '') => {
  if (!text || typeof text !== 'string') return [];
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const tokens = [...words];

  for (let i = 0; i < words.length - 1; i++) {
    tokens.push(`${words[i]}_${words[i + 1]}`);
  }

  return tokens;
};

const getTermFrequencyMap = (tokens) => {
  const map = new Map();
  for (const t of tokens) {
    map.set(t, (map.get(t) || 0) + 1);
  }
  return map;
};

// Calculate Cosine + Jaccard similarity vector score
const computeVectorSimilarity = (tokens1, tokens2) => {
  if (!tokens1.length || !tokens2.length) return 0;

  const tf1 = getTermFrequencyMap(tokens1);
  const tf2 = getTermFrequencyMap(tokens2);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const [term, freq1] of tf1.entries()) {
    magnitude1 += freq1 * freq1;
    if (tf2.has(term)) {
      dotProduct += freq1 * tf2.get(term);
    }
  }

  for (const freq2 of tf2.values()) {
    magnitude2 += freq2 * freq2;
  }

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  const cosineSim = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  let intersection = 0;
  for (const elem of set1) {
    if (set2.has(elem)) intersection++;
  }
  const union = new Set([...set1, ...set2]).size;
  const jaccardSim = union > 0 ? intersection / union : 0;

  return (0.7 * cosineSim) + (0.3 * jaccardSim);
};

/**
 * Intelligent Duplicate Detector Service
 * Compares new complaint title/description/location against existing complaints.
 *
 * @param {Object} newComplaint - { title, description, location, category }
 * @param {Array} existingComplaints - Array of existing Complaint documents
 * @param {Number} threshold - Configurable threshold (default 0.50)
 */
const findDuplicateComplaints = (newComplaint, existingComplaints = [], threshold = 0.50) => {
  if (!newComplaint || !existingComplaints.length) {
    return {
      isDuplicate: false,
      similarity: 0,
      threshold,
      matchCount: 0,
      matches: [],
    };
  }

  const newTitleTokens = tokenizeText(newComplaint.title || '');
  const newDescTokens = tokenizeText(newComplaint.description || '');

  const matchedItems = [];

  for (const candidate of existingComplaints) {
    if (newComplaint._id && candidate._id && newComplaint._id.toString() === candidate._id.toString()) {
      continue;
    }

    const candidateTitleTokens = tokenizeText(candidate.title || '');
    const candidateDescTokens = tokenizeText(candidate.description || '');

    // Calculate focused title similarity and description similarity
    const titleSim = computeVectorSimilarity(newTitleTokens, candidateTitleTokens);
    const descSim = computeVectorSimilarity(newDescTokens, candidateDescTokens);

    // Primary score is 60% Title similarity + 40% Description similarity
    let combinedScore = (0.6 * titleSim) + (0.4 * descSim);

    // Boost if title similarity alone is strong (>0.45)
    if (titleSim > 0.45) {
      combinedScore = Math.max(combinedScore, titleSim * 1.25);
    }

    // Boost if location matches
    if (newComplaint.location && candidate.location &&
        newComplaint.location.toLowerCase().includes(candidate.location.toLowerCase())) {
      combinedScore = combinedScore + 0.10;
    }

    const finalSim = Math.min(0.99, Math.max(0.0, Math.round(combinedScore * 100) / 100));

    if (finalSim >= threshold) {
      matchedItems.push({
        _id: candidate._id,
        complaintId: candidate.complaintId || 'CMP-EXST',
        title: candidate.title,
        description: candidate.description,
        category: candidate.category,
        location: candidate.location,
        status: candidate.status,
        createdAt: candidate.createdAt,
        similarity: finalSim,
      });
    }
  }

  matchedItems.sort((a, b) => b.similarity - a.similarity);
  const highestSimilarity = matchedItems.length > 0 ? matchedItems[0].similarity : 0;

  return {
    isDuplicate: matchedItems.length > 0,
    similarity: highestSimilarity,
    threshold,
    matchCount: matchedItems.length,
    matches: matchedItems,
  };
};

module.exports = {
  findDuplicateComplaints,
  tokenizeText,
  computeVectorSimilarity,
};
