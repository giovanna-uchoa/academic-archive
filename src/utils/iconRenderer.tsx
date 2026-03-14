import { BookOpen, BrainCircuit, Code2, Cpu, Database, FlaskConical, FolderKanban, GraduationCap, NotebookPen, TerminalSquare, type LucideIcon } from 'lucide-react';
import Box from '@mui/material/Box';

const ICONS_BY_NAME: Record<string, LucideIcon> = {
  bookopen: BookOpen,
  braincircuit: BrainCircuit,
  code2: Code2,
  cpu: Cpu,
  database: Database,
  flaskconical: FlaskConical,
  folderkanban: FolderKanban,
  graduationcap: GraduationCap,
  notebookpen: NotebookPen,
  terminalsquare: TerminalSquare,
};

function normalizeIconName(icon: string): string {
  return icon
    .replace(/^lucide:/i, '')
    .replace(/[-_\s]/g, '')
    .toLowerCase();
}

function isLikelyEmoji(value: string): boolean {
  return /\p{Extended_Pictographic}/u.test(value);
}

interface RenderSubjectIconOptions {
  size?: number;
  fallbackSize?: string;
}

export function renderSubjectIcon(icon: string | null | undefined, options?: RenderSubjectIconOptions) {
  const size = options?.size ?? 26;
  const fallbackSize = options?.fallbackSize ?? '1.4rem';

  if (!icon || !icon.trim()) {
    return <BookOpen size={size} />;
  }

  const trimmed = icon.trim();
  const key = normalizeIconName(trimmed);
  const Lucide = ICONS_BY_NAME[key];

  if (Lucide) {
    return <Lucide size={size} />;
  }

  if (isLikelyEmoji(trimmed)) {
    return <Box component="span" sx={{ fontSize: fallbackSize, lineHeight: 1 }}>{trimmed}</Box>;
  }

  return <BookOpen size={size} />;
}
