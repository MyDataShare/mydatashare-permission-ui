import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Loading } from 'components/common';
import { fetchProcessingRecord, handleQueryError } from 'utils/client';
import { useDocumentTitle } from 'utils/routing';
import { ProcessingRecordResponse } from 'utils/types';

const Consent = loadable(() => import('./Consent'));

const ConsentPageEntry = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isError, isIdle, isLoading, isSuccess } = useQuery<
    any,
    any,
    ProcessingRecordResponse,
    [string, { uuid?: string }]
  >(['processingRecord', { uuid: id }], fetchProcessingRecord);

  useDocumentTitle(t('Consent page'), t('App title'));

  if (isLoading || isIdle) {
    return <Loading />;
  }

  handleQueryError(isError, isSuccess, isLoading);

  return <>{data && <Consent processingRecordQuery={data} />}</>;
};

export default ConsentPageEntry;
