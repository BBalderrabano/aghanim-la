import { useTranslation } from 'react-i18next';

const Loading = () => {
    const {t} = useTranslation(['common']);

    return (<>{t('loading')}...</>);
}

export default Loading;