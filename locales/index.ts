export { ptBR } from './pt-BR';
export { enUS } from './en-US';
export { esES } from './es-ES';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
];

