import axios from 'axios';
import { useToast } from '@/components/ui/toast';
import { $t } from './i18n';
import { HttpStatusCode } from '@/enums';

type ErrorHandlerOptions = {
  title?: string;
  showToast?: boolean;
  fallbackMessage?: string;
  logToConsole?: boolean;
};

const { toast } = useToast();

export function handleError(error: any, options: ErrorHandlerOptions = {}): void {
  const { title = $t('common.error'), showToast = true, fallbackMessage = $t('common.generalError'), logToConsole = true } = options;

  let message = fallbackMessage;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const status = data.status ?? error.status;

    switch (status) {
      case HttpStatusCode.BAD_REQUEST:
        message = $t('common.invalidRequest');
        break;
      case HttpStatusCode.UNAUTHORIZED:
        message = $t('common.sessionExpired');
        break;
      case HttpStatusCode.FORBIDDEN:
        message = $t('common.noPermission');
        break;
      case HttpStatusCode.NOT_FOUND:
        message = data?.message || $t('common.notFound');
        break;
      case HttpStatusCode.UNPROCESSABLE_ENTITY:
        message = $t('common.invalidPayload');
        break;
      case HttpStatusCode.SERVER_ERROR:
        message = data?.message || $t('common.systemError');
        break;
      default:
        message = data?.message || fallbackMessage;
    }
  } else if (error instanceof Error) {
    message = error.message || fallbackMessage;
  }

  if (logToConsole) console.error(title, error);
  if (showToast) {
    toast({
      title: title,
      description: message,
      variant: 'destructive',
    });
  }
}
