import { mockIcons } from '@/lib/makeData';
import { Icon } from '@/models/dtos';

export default async function GetLocalIcons() {
  const response = mockIcons() as Icon[];
  return { data: response, error: null };
}
