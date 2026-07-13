export type HealthScoreInput = {
  photos: number;
  floorplan: boolean;
  videoTour: boolean;
  epc: boolean;
  staging: boolean;
  gardenPhotos: boolean;
  kitchenPhotos: boolean;
  bathroomPhotos: boolean;
  descriptionComplete: boolean;
  socialPosted: boolean;
};

export function calculatePropertyHealthScore(input: HealthScoreInput) {
  const photoScore = Math.min(input.photos, 20) * 2;
  const bonus = [
    input.floorplan,
    input.videoTour,
    input.epc,
    input.staging,
    input.gardenPhotos,
    input.kitchenPhotos,
    input.bathroomPhotos,
    input.descriptionComplete,
    input.socialPosted,
  ].reduce((total, value) => total + (value ? 3 : 0), 0);

  const score = Math.max(0, Math.min(100, photoScore + bonus + 10));
  const suggestions = buildHealthSuggestions(input, score);

  return { score, suggestions };
}

export function buildHealthSuggestions(input: HealthScoreInput, score: number) {
  const suggestions: string[] = [];

  if (input.photos < 12) {
    suggestions.push("Add more photography to create a stronger first impression.");
  }

  if (!input.floorplan) {
    suggestions.push("Adding a floorplan increases enquiries.");
  }

  if (!input.videoTour) {
    suggestions.push("Create a video tour to improve engagement.");
  }

  if (!input.gardenPhotos) {
    suggestions.push("Add garden photographs.");
  }

  if (!input.kitchenPhotos) {
    suggestions.push("Showcase the kitchen with a clear daylight shot.");
  }

  if (!input.bathroomPhotos) {
    suggestions.push("Include bathroom photography so viewers know the finish standard.");
  }

  if (!input.descriptionComplete) {
    suggestions.push("Complete the property description with lifestyle context and measurements.");
  }

  if (!input.socialPosted) {
    suggestions.push("Publish the listing to social media for extra reach.");
  }

  if (!input.epc) {
    suggestions.push("Add the EPC document before launch.");
  }

  if (score >= 90) {
    suggestions.unshift("This listing is launch-ready with only minor optimisation opportunities.");
  }

  return suggestions.length > 0 ? suggestions : ["The property marketing pack looks complete."];
}