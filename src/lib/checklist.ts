export const checklistTemplate = [
  "Photos Taken",
  "Drone Photos",
  "Floorplan",
  "EPC",
  "Description",
  "AI Staging",
  "Video Tour",
  "Window Card",
  "Rightmove",
  "Zoopla",
  "Facebook",
  "Instagram",
  "Email Campaign",
] as const;

export type ChecklistItem = {
  label: string;
  done: boolean;
};

export function calculateChecklistProgress(items: ChecklistItem[]) {
  if (items.length === 0) {
    return 0;
  }

  const completed = items.filter((item) => item.done).length;
  return Math.round((completed / items.length) * 100);
}