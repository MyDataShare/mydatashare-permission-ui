import { InputTypes } from 'components/form';

export type User = {
  token?: string;
  idToken?: string;
  givenName?: string;
  familyName?: string;
  username?: string;
  identifiers: Identifier[];
};

/* eslint-disable camelcase */

type IdProviderInfo = {
  attributes?: string[] | null;
  created: string;
  deleted: boolean;
  first_name: string;
  id_provider_uuid: string;
  identifier_uuid: string;
  language: string;
  last_name: string;
  source: string;
  suppressed_fields: string[];
  updated: string;
  uuid: string;
};

type IdType = {
  country: string;
  created: string;
  deleted: boolean;
  description: string;
  'metadatas.uuid': string[];
  name: string;
  suppressed_fields: string[];
  type: string;
  updated: string;
  uuid: string;
  verify_interval: number;
};

export type Identifier = {
  created: string;
  deleted: boolean;
  group_id?: string | null;
  id: '060494-9245-test-gov_id';
  'id_provider_infos.uuid': IdProviderInfo['uuid'][];
  id_type_uuid: IdType['uuid'];
  'metadatas.uuid': Metadata['uuid'][];
  'organization_identifiers.uuid': string[];
  suppressed_fields: string[];
  updated: string;
  uuid: string;
  verified?: boolean | null;
};

export type Metadata = {
  created: string;
  deleted: boolean;
  json_data: Record<string, any>;
  model: string;
  model_uuid: string;
  name: string;
  subtype1: string | null;
  subtype2: string | null;
  suppressed_fields: string[];
  type: string;
  updated: string;
  uuid: string;
};

export type UserProvidedDataTranslatableField =
  | 'label'
  | 'help'
  | 'placeholder';

export type UserProvidedDataTemplateFields = {
  name: string;
  label: string;
  maxLength: number;
  help?: string;
  placeholder?: string;
  type?: InputTypes;
  required?: boolean;
  translations: {
    fin: { label: string; help?: string; placeholder?: string };
    eng: { label: string; help?: string; placeholder?: string };
    swe: { label: string; help?: string; placeholder?: string };
  };
};

export type UserProvidedDataTemplate = Metadata & {
  json_data: {
    data: UserProvidedDataTemplateFields[];
  };
};

export interface IdentifiersApiResponse {
  id_provider_infos: Record<string, IdProviderInfo>;
  id_types: Record<string, IdType>;
  identifiers: Record<string, Identifier>;
  metadatas: Record<string, Metadata>;
  organizations?: Record<string, Record<string, any>>;
  organization_identifiers?: Record<string, Record<string, any>>;
}

export type SearchTerms = {
  data_consumer_uuid?: string;
  data_provider_uuid?: string;
  group_id?: string;
  status?: RecordStatus | RecordStatus[];
  record_type?: RecordType | RecordType[];
};

export enum AccessStatus {
  COMPLETED = 'completed',
  INTROSPECTED = 'introspected',
}

export enum ActivationMode {
  DATA_SUBJECT_ACTIVATES = 'data_subject_activates',
  ALL_ACTIVATORS_ACTIVATE = 'all_activators_activate',
  ANY_ACTIVATOR_ACTIVATES = 'any_activator_activates',
  AUTOMATICALLY_ACTIVATED = 'automatically_activated',
}

export enum ParticipantRole {
  ACTIVATOR = 'activator',
  DATA_SUBJECT = 'data_subject',
}

export enum ParticipantStatus {
  ACTIVE = 'active',
  DECLINED = 'declined',
  NOT_APPLICABLE = 'not_applicable',
  PENDING = 'pending',
}

export enum RecordType {
  CONSENT = 'consent',
  LEGAL_OBLIGATION = 'legal_obligation',
  LEGITIMATE_INTEREST = 'legitimate_interest',
  MDS_CONTRACT_TOS = 'mds_contract_tos',
  SERVICE_TOS = 'service_tos',
}

export enum RecordStatus {
  ACTIVE = 'active',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  WITHDRAWN = 'withdrawn',
}

export enum TerminalStatus {
  EXPIRED = RecordStatus.EXPIRED,
  WITHDRAWN = RecordStatus.WITHDRAWN,
}

export type DataConsumer = {
  created: string;
  default_language: string;
  deleted: boolean;
  description: string;
  legal: string;
  major_version: number;
  'metadatas.uuid': string[];
  minor_version: number;
  name: string;
  organization_uuid: string;
  post_cancellation?: string | null;
  pre_cancellation?: string | null;
  purpose: string;
  record_type: RecordType;
  activation_mode: ActivationMode;
  suppressed_fields: string[];
  suspended: boolean;
  updated: string;
  uuid: string;
};

export type ProcessingRecord = {
  created: string;
  data_consumer_uuid: string;
  data_provider_uuid: string;
  deleted: false;
  expires: string | null;
  group_id?: number | null;
  'metadatas.uuid': string[];
  not_valid_before: null;
  'processing_record_participants.uuid': string[];
  record_type: RecordType;
  status: RecordStatus;
  reference: string;
  suppressed_fields?: string[];
  terminal_state_activated: string | null;
  terminal_status: TerminalStatus;
  updated: string;
  uuid: string;
};

export type ProcessingRecordParticipant = {
  uuid: string;
  accepted_language: string | null;
  identifier_display_name: string | null;
  identifier_uuid: string;
  notification_email_address: string | null;
  processing_record_uuid: string;
  role: ParticipantRole;
  status: ParticipantStatus;
};

type DataProvider = {
  access_gateway_uuid: string;
  created: string;
  default_language: string;
  deleted: boolean;
  description: string;
  has_live_preview: boolean;
  input_pr_identifier: boolean;
  major_version: number;
  'metadatas.uuid': string[];
  minor_version: number;
  name: string;
  organization_uuid: string;
  static_preview: string;
  suppressed_fields: string[];
  suspended: boolean;
  updated: string;
  uuid: string;
};

type Organization = {
  country: string;
  created: string;
  default_language: string;
  deleted: boolean;
  description: string;
  group_id?: number | null;
  legal_entity_type: string;
  'metadatas.uuid': string[];
  name: string;
  suppressed_fields: string[];
  updated: string;
  uuid: string;
};

type AuthItemRecord = {
  uuid: string;
  created: string;
  updated: string;
  deleted: boolean;
  suppressed_fields: string[];
  id_provider_uuid: string;
  auth_params: string;
  name: string;
  description: string;
  url_group_id: number;
  translation_id: number;
};

type IdProvider = {
  uuid: string;
  created: string;
  updated: string;
  deleted: boolean;
  suppressed_fields: string[];
  type: string;
  name: string;
  description: string;
  id: string;
  url_group_id: number;
  translation_id: number;
};

export type AccessItem = {
  created: string;
  deleted: boolean;
  identifier_uuid: Identifier['uuid'];
  introspection_status: RecordStatus;
  reason: string;
  request_id: string;
  success: boolean;
  status: AccessStatus;
  updated: string;
  uuid: string;
};

/**
 * Note all status related fields use plain string type, since they may contain some deprecated
 * values that are not present in current status enums.
 */
export type ProcessingRecordHistoryItem = {
  client_id_uuid: string;
  created: string;
  domain: string;
  identifier_uuid: Identifier['uuid'];
  migration_version: string;
  new_prp_accepted_language: string;
  new_pr_derived_status: string;
  new_prp_status: string;
  old_prp_accepted_language: string;
  old_pr_derived_status: string;
  old_prp_status: string;
  organization_uuid: Organization['uuid'];
  processing_record_participant_uuid: ProcessingRecordParticipant['uuid'];
  processing_record_uuid: ProcessingRecord['uuid'];
  request_id: string;
  suppressed_fields: string[];
  updated: string;
  uuid: string;
};

export type AuthItem = {
  description: string;
  name: string;
  uuid: string;
  getUrls: (urlType: string) => {
    json_data: {
      description: string;
      url: string;
      [key: string]: any;
    };
    [key: string]: any;
  }[];
  getIdProvider: () => {
    id: string;
    name: string;
    [key: string]: any;
  };
  performAuthorization: (id: string, uri: string, scope: string) => void;
  [key: string]: any;
};

export interface AuthItemsResponse {
  auth_items: Record<string, AuthItemRecord>;
  id_providers: Record<string, IdProvider>;
  metadatas: Record<string, Metadata>;
}

export interface ProcessingRecordsResponse {
  data_consumers: Record<string, DataConsumer>;
  data_providers: Record<string, DataProvider>;
  metadatas: Record<string, Metadata>;
  organizations: Record<string, Organization>;
  processing_records: Record<string, ProcessingRecord>;
  processing_record_participants: Record<string, ProcessingRecordParticipant>;
}

export type ProcessingRecordResponse = ProcessingRecordsResponse & {
  id_providers_infos: Record<string, Record<string, any>>;
  id_types: Record<string, Record<string, any>>;
  identifiers: Record<string, Record<string, any>>;
};

export interface AccessItemsResponse {
  access_items: Record<string, AccessItem>;
  limit: number;
  next_offset?: string;
  offset: any[];
  offset_type?: string;
  status: number;
}

export interface ProcessingRecordHistoryItemsResponse {
  processing_record_history_items: Record<string, ProcessingRecordHistoryItem>;
  identifiers: Record<string, Identifier>;
  limit: number;
  metadatas: Record<string, Metadata>;
  next_offset?: string;
  offset: any[];
  offset_type?: string;
  organizations: Record<string, Organization>;
  status: number;
}

/* eslint-enable camelcase */

export interface RecordData {
  acceptedLanguage: string | null;
  consumer: DataConsumer;
  consumerOrg: Organization;
  dataSubjectParticipant: ProcessingRecordParticipant;
  isMultiActivated: boolean;
  isOnBehalfUser: boolean;
  isPendingUserActivation: boolean;
  nonDataSubjectParticipants: ProcessingRecordParticipant[];
  nonUserParticipants: ProcessingRecordParticipant[];
  userParticipant: ProcessingRecordParticipant;
  participants: Record<string, ProcessingRecordParticipant>;
  provider: DataProvider | null;
  providerOrg: Organization | null;
  metadatas: Record<string, Metadata>;
  record: ProcessingRecord;
}

export type InfoBoxVariant = 'primary' | 'secondary' | 'error';

type LocationState = {
  path: string;
  search: string;
  hash: string;
};

export interface Location {
  pathname: string;
  search: string;
  hash: string;
  key: string;
  state: LocationState | null;
}
