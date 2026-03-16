import {
  Github,
  Gitlab,
  Linkedin,
  Mail,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const socialIconMap: Record<string, { icon: LucideIcon; label: string }> = {
  github: { icon: Github, label: 'GitHub' },
  gitlab: { icon: Gitlab, label: 'GitLab' },
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  mail: { icon: Mail, label: 'Email' },
};

export type SocialLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export function getSocialLinks(): SocialLink[] {
  const socials: SocialLink[] = [];

  Object.entries(import.meta.env).forEach(([key, value]) => {
    if (!key.startsWith('VITE_SOCIAL_') || typeof value !== 'string' || !value) return;

    const name = key.replace('VITE_SOCIAL_', '').toLowerCase();
    const config = socialIconMap[name];

    if (!config) return;

    const href =
      name === 'mail'
        ? `mailto:${value}`
        : value;

    socials.push({
      href,
      icon: config.icon,
      label: config.label,
    });
  });

  return socials;
}