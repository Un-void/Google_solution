function checkDuplicate(newRequest, existingRequests) {
  for (const existing of existingRequests) {
    if (existing.type === newRequest.type && existing.zone === newRequest.zone) {
      const titleSimilarity = calculateSimilarity(existing.title.toLowerCase(), newRequest.title.toLowerCase());
      if (titleSimilarity > 0.6) {
        const timeDiff = Math.abs(new Date() - new Date(existing.createdAt));
        if (timeDiff < 24 * 60 * 60 * 1000) {
          return { isDuplicate: true, duplicateOf: existing.id, similarity: titleSimilarity };
        }
      }
    }
  }
  return { isDuplicate: false };
}

function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

function calculateCredibility(request, user) {
  let score = 70;
  if (user) score += 10;
  if (request.description && request.description.length > 20) score += 5;
  if (request.people && request.people > 0) score += 5;
  if (request.lat && request.lng) score += 5;
  if (request.channel === 'web' || request.channel === 'app') score += 3;
  return Math.min(score, 100);
}

module.exports = { checkDuplicate, calculateCredibility };
