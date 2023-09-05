import { useTranslation } from 'react-i18next';

const getMessageCountLabel = (count) => {
    const { t } = useTranslation();
  
    switch (count) {
      case 0:
        return t('messages_none');
      case 1:
        return t('messages_one', { count });
      case 2:
      case 3:
      case 4:
        return t('messages_few', { count });
      default:
        return t('messages_many', { count });
    }
  };

  export default getMessageCountLabel;