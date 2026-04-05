import {formatDistanceToNow} from 'date-fns';
import {de, enUS} from 'date-fns/locale';

export function formatRelativeTimestamp(dateString: string, locale: string): string {
  let date = new Date(dateString);
  if (!dateString) date = new Date();

  const dateFnsLocale = locale === 'de' ? de : enUS;

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: dateFnsLocale,
  });
}
