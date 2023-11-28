import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { Navigate } from 'react-router-dom';

import { Loading } from 'components/common';
import { enrollRequest, fetchProcessingRecords } from 'utils/client';
import { useDocumentTitle } from 'utils/routing';
import {
  ProcessingRecordsResponse,
  RecordType,
  SearchTerms,
} from 'utils/types';

const ConsentList = loadable(() => import('./ConsentList'));

type Props = {
  enroll?: {
    name: string;
    url: string;
  };
};

const ConsentListPageEntry = ({ enroll }: Props) => {
  const { t } = useTranslation();
  const searchFilters = {
    record_type: [
      RecordType.CONSENT,
      RecordType.LEGAL_OBLIGATION,
      RecordType.LEGITIMATE_INTEREST,
    ],
  };

  const isEnrollEndpointActive = !!enroll?.name && !!enroll?.url;
  const queryClient = useQueryClient();
  const { isFetched: isEnrolled, isLoading: isEnrolling } = useQuery(
    `enroll_${enroll?.name}`,
    () => enrollRequest(enroll?.url),
    {
      enabled: isEnrollEndpointActive,
      staleTime: 1000 * 60 * 15, // 15 minutes
      onSuccess: () => {
        queryClient.invalidateQueries('tos');
        queryClient.invalidateQueries('processingRecords');
      },
    }
  );

  const enabled = !isEnrollEndpointActive || isEnrolled;
  const {
    data,
    isIdle,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    any,
    any,
    ProcessingRecordsResponse,
    [string, SearchTerms]
  >(['processingRecords', searchFilters], fetchProcessingRecords, {
    enabled,
    getNextPageParam: lastPage => lastPage.next_offset,
  });

  // TODO: Implement pagination properly, this is a heavy approach if there's lots of data.
  //       Dashboard has an example implementation on pagination controls.
  if (!isLoading && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }

  useDocumentTitle(t('Consents page'), t('App title'));

  if (isEnrolling) {
    return <Loading />;
  }

  if (enroll?.name) {
    return <Navigate to="/consents" replace />;
  }

  if (isLoading || isIdle || isFetchingNextPage) {
    return <Loading />;
  }

  return <ConsentList processingRecordsQuery={data} />;
};

export default ConsentListPageEntry;
