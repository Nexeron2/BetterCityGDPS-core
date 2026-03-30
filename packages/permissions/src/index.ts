export type DefaultRole = {
  id: string;
  label: string;
  description: string;
};

export const defaultRoles: DefaultRole[] = [
  {
    id: "player",
    label: "Player",
    description: "Default player access with personal cabinet features."
  },
  {
    id: "moderator",
    label: "Moderator",
    description: "Handles reports, sanctions, and moderation queues."
  },
  {
    id: "administrator",
    label: "Administrator",
    description: "Manages settings, events, and dashboard administration."
  },
  {
    id: "privileged-operator",
    label: "Privileged Operator",
    description: "Can access high-risk tools after privileged re-authentication."
  },
  {
    id: "owner",
    label: "Owner",
    description: "Highest-level business and system control."
  }
];