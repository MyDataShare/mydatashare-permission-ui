import {
  ENDPOINT_ACCESS_ITEMS,
  ENDPOINT_AUTH_ITEMS,
  ENDPOINT_CREATE_PROCESSING_RECORD,
  ENDPOINT_HISTORY_ITEMS,
  ENDPOINT_METADATA,
  ENDPOINT_PROCESSING_RECORD,
  ENDPOINT_PROCESSING_RECORD_PARTICIPANT,
  ENDPOINT_PROCESSING_RECORDS,
  MDS_API_URL,
} from './constants';
import { getUserFromStorage, removeUserFromStorage } from './storage';
import {
  AccessItemsResponse,
  ActivationMode,
  AuthItemsResponse,
  ParticipantRole,
  ParticipantStatus,
  ProcessingRecordHistoryItemsResponse,
  ProcessingRecordResponse,
  ProcessingRecordsResponse,
  RecordData,
  RecordStatus,
  SearchTerms,
  User,
} from './types';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  params?: Record<string, string>;
  payload?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  config?: Record<string, unknown>;
  baseUrl?: string;
  fullUrl?: string;
  offset?: number | string;
  isPaginated?: boolean;
}

/**
 * Make async calls to the backend API.
 *
 * If the request response status code is 401, the user is automatically logged out.
 *
 * Options:
 * - `method`: The http method to use, defaults to GET.
 * - `token`: If given, `token` is added to the `Authorization` header using the `Bearer` prefix.
 * - `params`: URL parameters (query strings) as an object.
 * - `payload`: Request body as an object. If given, `Content-Type` will  be set to `application/json`
 * - `headers`: Additional headers as an object.
 * - `config`: Additional fetch configurations as an object.
 * - `baseUrl`: The base URL to use for the endpoint, defaults to MDS API.
 * - `fullUrl`: Optional full URL to make the request to, without needing to separately give base URL and endpoint.
 * - `offset`: Specifies the offset of the first item to return. Defaults to 0. Only applied when isPaginated is true.
 * - `isPaginated`: Whether the request is paginated: if it is, offset is added to the request.
 * @param {string} endpoint The endpoint to call, e.g. "/user"
 * @param {object} param1 Optional options and fetch configurations
 * @return {object} The response JSON content.
 */
const client = async (
  endpoint: string,
  {
    method = 'GET',
    params,
    payload,
    headers,
    config,
    baseUrl,
    fullUrl,
    offset = 0,
    isPaginated = false,
  }: RequestOptions = {}
) => {
  const { token } = getUserFromStorage();
  const fetchConfig = {
    method,
    body: payload ? JSON.stringify(payload) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': payload ? 'application/json' : undefined,
      ...headers,
    },
    ...config,
  };

  let url;
  if (baseUrl) url = `${baseUrl}/${endpoint}`;
  else if (fullUrl) url = fullUrl;
  else url = `${MDS_API_URL}/${endpoint}`;

  let init = { ...params };
  if (method === 'POST') {
    if (isPaginated) {
      init = { ...params, offset: `${offset}`, order_by: 'created_desc' };
    }
  }
  if (Object.keys(init).length) {
    url += `?${new URLSearchParams(init)}`;
  }
  // @ts-ignore: Check types
  const res = await fetch(url, fetchConfig);

  if (res.status === 401) {
    // TODO: Clear query cache, also check dashboard and demo
    console.log('Re-authentication needed, logging out user');
    removeUserFromStorage();
    // @ts-ignore: Check types
    window.location.assign(window.location);
    return Promise.reject(new Error('Authentication is needed'));
  }

  const resData = await res.json();
  if (res.ok) return resData;

  return Promise.reject(resData);
};

export const handleQueryError = (
  isError: boolean,
  isSuccess: boolean,
  isLoading: boolean,
  errorMessage = 'errorQuery'
) => {
  if (!isLoading && (isError || !isSuccess)) {
    throw new Error(errorMessage);
  }
};

export type MetadataPayload = {
  model: string;
  model_uuid: string;
  type: string;
  name: string;
  subtype1?: string;
  subtype2?: string;
  json_data: Record<string, any>;
  metadataUuid?: string;
};

const buildMetadataPayload = (payload: MetadataPayload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([k, _]) => k !== 'metadataUuid')
  );

// TODO: Create type MetadataResponse
export const createMetadata = async (
  payload: MetadataPayload
): Promise<Record<string, any>> => {
  return client(ENDPOINT_METADATA, {
    method: 'POST',
    payload: buildMetadataPayload(payload),
  });
};

export const enrollRequest = async (url?: string): Promise<void> => {
  if (!url) return Promise.resolve();
  await client(ENDPOINT_CREATE_PROCESSING_RECORD, {
    method: 'POST',
    fullUrl: url,
  });
  return Promise.resolve();
};

export const deleteMetadata = async (metadataUuid: string): Promise<void> => {
  return client(`${ENDPOINT_METADATA}/${metadataUuid}`, {
    method: 'DELETE',
  });
};

export const fetchAuthItems = async (): Promise<AuthItemsResponse> =>
  client(ENDPOINT_AUTH_ITEMS, { method: 'POST', isPaginated: true });

export const fetchAccessItems = async ({
  queryKey,
}: {
  queryKey: [
    string,
    { prUuid: string; pageParam?: Date | string; limit?: string }
  ];
}): Promise<AccessItemsResponse> => {
  const [, { prUuid, pageParam: offset = new Date(3000, 1), limit }] = queryKey;
  return client(ENDPOINT_ACCESS_ITEMS, {
    method: 'POST',
    params: {
      offset_type: 'created_before',
      ...(limit && { limit: `${limit}` }),
    },
    offset: offset instanceof Date ? offset.toISOString() : offset,
    isPaginated: true,
    payload: { processing_record_uuid: prUuid },
  });
};

export const fetchRecordHistoryItems = async ({
  queryKey,
}: {
  queryKey: [
    string,
    { prUuid: string; pageParam?: Date | string; limit?: number }
  ];
}): Promise<ProcessingRecordHistoryItemsResponse> => {
  const [, { prUuid, pageParam: offset = new Date(3000, 1), limit }] = queryKey;
  return client(ENDPOINT_HISTORY_ITEMS, {
    method: 'POST',
    params: {
      offset_type: 'created_before',
      ...(limit && { limit: `${limit}` }),
    },
    offset: offset instanceof Date ? offset.toISOString() : offset,
    isPaginated: true,
    payload: { processing_record_uuid: prUuid },
  });
};

export const fetchProcessingRecord = async ({
  queryKey,
}: {
  queryKey: [string, { uuid?: string }];
}): Promise<ProcessingRecordResponse> => {
  const [, { uuid }] = queryKey;
  return client(`${ENDPOINT_PROCESSING_RECORD}/${uuid}`);
};

export const fetchProcessingRecords = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: [string, SearchTerms];
  pageParam?: number;
}): Promise<ProcessingRecordsResponse> => {
  const [, searchTerms] = queryKey;
  return client(ENDPOINT_PROCESSING_RECORDS, {
    method: 'POST',
    payload: { ...searchTerms },
    offset: pageParam,
    isPaginated: true,
  });
};

// TODO: Create type MetadataResponse
// TODO: Add param for metadata uuid
export const updateMetadata = async (
  payload: MetadataPayload
): Promise<Record<string, any>> => {
  return client(`${ENDPOINT_METADATA}/${payload.metadataUuid}`, {
    method: 'PATCH',
    payload: { json_data: buildMetadataPayload(payload).json_data },
  });
};

export type UpdateParticipantArgs = {
  uuid: string;
  newStatus: ParticipantStatus;
  language?: string | null;
};

export const updateParticipant = async ({
  uuid,
  newStatus,
  language = 'eng',
}: UpdateParticipantArgs): Promise<Record<string, any>> =>
  client(`${ENDPOINT_PROCESSING_RECORD_PARTICIPANT}/${uuid}`, {
    method: 'PATCH',
    payload: {
      status: newStatus,
      ...(newStatus === ParticipantStatus.ACTIVE &&
        language && { accepted_language: language }),
    },
  });

export const getRecordDataFromResponse = (
  response: ProcessingRecordsResponse | ProcessingRecordResponse,
  user?: User
): RecordData[] => {
  if (!response || !response.processing_records || !response.data_consumers) {
    return [];
  }
  const userIdentifierUuids = user
    ? user.identifiers.map(({ uuid }) => uuid)
    : [];
  return Object.values(response.processing_records).map(record => {
    const consumer = response.data_consumers[record.data_consumer_uuid];
    const consumerOrg = response.organizations[consumer.organization_uuid];
    let provider = null;
    let providerOrg = null;
    if (record.data_provider_uuid && response.data_providers) {
      provider = response.data_providers[record.data_provider_uuid];
      providerOrg = response.organizations[provider.organization_uuid];
    }
    const participants = record['processing_record_participants.uuid'].map(
      prpUuid => response.processing_record_participants[prpUuid]
    );
    const dataSubjectParticipant = participants.find(
      prp => prp.role === ParticipantRole.DATA_SUBJECT
    );
    if (!dataSubjectParticipant) {
      // Should not happen, but raise to guarantee dataSubjectParticipant exists in RecordData
      throw new Error('Record has no data subject');
    }
    const userParticipant = participants.find(prp =>
      userIdentifierUuids.includes(prp.identifier_uuid)
    );
    if (!userParticipant) {
      // Should not happen, but raise to guarantee userParticipant exists in RecordData
      throw new Error('User not found in participants');
    }
    const nonDataSubjectParticipants = participants.filter(
      prp => prp.role !== ParticipantRole.DATA_SUBJECT
    );
    const nonUserParticipants = participants.filter(
      prp => prp.uuid !== userParticipant.uuid
    );
    const isMultiActivated = [
      ActivationMode.ALL_ACTIVATORS_ACTIVATE,
      ActivationMode.ANY_ACTIVATOR_ACTIVATES,
    ].includes(consumer.activation_mode);
    const isOnBehalfUser =
      isMultiActivated && userParticipant.uuid === dataSubjectParticipant.uuid;
    const acceptedLanguage =
      record.status === RecordStatus.ACTIVE
        ? userParticipant.accepted_language
        : null;
    const isPendingUserActivation =
      record.status === RecordStatus.PENDING &&
      !isOnBehalfUser &&
      userParticipant.status === ParticipantStatus.PENDING;
    return {
      acceptedLanguage,
      record,
      consumer,
      consumerOrg,
      dataSubjectParticipant,
      isMultiActivated,
      isOnBehalfUser,
      isPendingUserActivation,
      metadatas: response.metadatas,
      nonDataSubjectParticipants,
      nonUserParticipants,
      participants: response.processing_record_participants,
      provider,
      providerOrg,
      userParticipant,
    };
  });
};

export default client;
