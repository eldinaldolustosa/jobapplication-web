import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STATUS_COLORS: Record<string, string> = {
  Enviado: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Feedback: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Entrevista: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Entrevista Técnica': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Negociação: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Contrato: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Rejeitado: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const APPLICATION_STATUSES = [
  'Enviado',
  'Feedback',
  'Entrevista',
  'Entrevista Técnica',
  'Negociação',
  'Contrato',
  'Rejeitado',
] as const;

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
