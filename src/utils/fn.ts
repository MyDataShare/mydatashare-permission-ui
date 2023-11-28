import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBan,
  faBoxArchive,
  faBuilding,
  faCalendarExclamation,
  faCircleCheck,
  faCircleInfo,
  faExclamationCircle,
  faFileSignature,
  faHandshake,
  faHourglassEmpty,
  faMinus,
  faScaleBalanced,
} from '@fortawesome/pro-light-svg-icons';
import i18n from 'i18next';
import {
  appLngAlpha2Codes,
  appLngAlpha3Codes,
  LocaleAlpha2,
  LocaleAlpha3,
} from 'locales';
import { camelCase } from 'lodash';

import {
  ALLOWED_EXTERNAL_DOMAINS,
  LINKS_PRIVACY,
  LINKS_TOS,
} from './constants';
import { Color, theme } from 'theme';
import type {
  AccessItem,
  DataConsumer,
  Metadata,
  ProcessingRecord,
  ProcessingRecordHistoryItem,
  ProcessingRecordParticipant,
  RecordType,
  UserProvidedDataTemplateFields,
  UserProvidedDataTranslatableField,
} from 'utils/types';
import {
  ActivationMode,
  InfoBoxVariant,
  ParticipantRole,
  ParticipantStatus,
  RecordStatus,
  TerminalStatus,
  UserProvidedDataTemplate,
} from 'utils/types';

export const getRecordTypeIcon = (type: RecordType): IconDefinition =>
  ({
    consent: faHandshake,
    legal_obligation: faScaleBalanced,
    legitimate_interest: faBuilding,
    mds_contract_tos: faFileSignature,
    service_tos: faFileSignature,
  }[type]);

export const getRecordStatusColor = (status: RecordStatus): string => {
  return theme.colors[`status${capitalize(status)}` as Color];
};

export const getRecordStatusIcon = (
  status: RecordStatus | ParticipantStatus,
  userParticipantStatus?: ParticipantStatus
): IconDefinition => {
  let statusToUse = status;
  if (userParticipantStatus) {
    if (!Object.values(TerminalStatus).includes(status)) {
      if (status !== userParticipantStatus) {
        return faCircleInfo;
      }
      statusToUse = userParticipantStatus;
    }
  }
  return {
    active: faCircleCheck,
    declined: faBan,
    expired: faCalendarExclamation,
    not_applicable: faMinus,
    pending: faHourglassEmpty,
    suspended: faExclamationCircle,
    withdrawn: faBoxArchive,
  }[statusToUse];
};

/**
 * Use in conjunction with getRecordStatusInfoKey to build the translation key and count parameter.
 * @param consumer The DataConsumer object as returned by getRecordDataFromResponse
 * @param nonUserParticipants The nonUserParticipants property value as returned by
 *        getRecordDataFromResponse
 */
export const getRecordStatusInfoCount = (
  consumer: DataConsumer,
  nonUserParticipants: ProcessingRecordParticipant[]
) => {
  if (consumer.activation_mode === ActivationMode.ANY_ACTIVATOR_ACTIVATES) {
    // If mode "any" --> count = nOtherThanUserAccepted + 1
    return (
      nonUserParticipants.filter(
        prp =>
          prp.role !== ParticipantRole.DATA_SUBJECT &&
          prp.status === ParticipantStatus.ACTIVE
      ).length + 1
    );
  } else if (
    consumer.activation_mode === ActivationMode.ALL_ACTIVATORS_ACTIVATE
  ) {
    // if mode "all" --> count = nOtherThanUserNeeded + 1
    return (
      nonUserParticipants.filter(
        prp =>
          prp.role !== ParticipantRole.DATA_SUBJECT &&
          prp.status !== ParticipantStatus.ACTIVE
      ).length + 1
    );
  }
  return 0;
};

/**
 * Get a translation key for showing dynamic information about a record's status. Use
 * getRecordStatusInfoCount to get the count parameter.
 */
export const getRecordStatusInfoKey = (
  prefix: string,
  consumer: DataConsumer,
  record: ProcessingRecord,
  userParticipant: ProcessingRecordParticipant
) => {
  const tMode = camelCase(consumer.activation_mode);
  let ret = `${prefix}-${tMode}`;
  if (consumer.activation_mode === ActivationMode.AUTOMATICALLY_ACTIVATED) {
    return ret;
  }
  const tRole = camelCase(userParticipant.role);
  const tPRPStatus = camelCase(userParticipant.status);
  ret = `${ret}-${tRole}-${tPRPStatus}`;
  if (consumer.activation_mode === ActivationMode.DATA_SUBJECT_ACTIVATES) {
    return ret;
  }
  const tStatus = camelCase(record.status);
  return `${ret}-${tStatus}`;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const getDataConsumerDynamicAttrTranslation = (
  attrs: UserProvidedDataTemplateFields,
  fieldName: UserProvidedDataTranslatableField
) => {
  const alpha3 = getLanguageAlpha3();
  if (alpha3 in attrs.translations && fieldName in attrs.translations[alpha3]) {
    return attrs.translations[alpha3][fieldName];
  }
  return attrs[fieldName];
};

export const getLanguageAlpha2 = (): LocaleAlpha2 => {
  const lng = i18n.language;
  const supportedLng = appLngAlpha2Codes.find(alpha2 => alpha2 === lng);
  if (supportedLng) {
    return supportedLng;
  }
  return 'en';
};

export const getLanguageAlpha3 = (): LocaleAlpha3 => {
  const alpha2 = getLanguageAlpha2();
  return appLngAlpha3Codes[alpha2];
};

export const getMetadata = (
  obj: { 'metadatas.uuid': string[] },
  metadataType: string,
  metadatas: Metadata[]
) =>
  Object.values(metadatas).find(
    meta =>
      obj['metadatas.uuid']?.includes(meta.uuid) && meta.type === metadataType
  );

export const getTosLink = (lng: string) => {
  if (lng in LINKS_TOS) return LINKS_TOS[lng];
  return LINKS_TOS.en;
};

export const getUserProvidedDataTemplate = (
  dataConsumer: DataConsumer,
  metadatas: Record<string, Metadata>
): UserProvidedDataTemplate | undefined => {
  const userProvidedDataTemplate = getMetadata(
    dataConsumer,
    'user_provided_data_template',
    Object.values(metadatas)
  ) as UserProvidedDataTemplate;
  return userProvidedDataTemplate;
};

export const validateUserProvidedDataTemplate = (
  userProvidedDataTemplate: UserProvidedDataTemplate | undefined
) => {
  if (!userProvidedDataTemplate) return false;
  if (!Array.isArray(userProvidedDataTemplate?.json_data?.data)) {
    return false;
  }
  userProvidedDataTemplate.json_data.data.forEach(attrs => {
    if (
      !('name' in attrs) ||
      !('maxLength' in attrs) ||
      !('translations' in attrs) ||
      !('fin' in attrs.translations) ||
      !('eng' in attrs.translations) ||
      !('swe' in attrs.translations) ||
      !('name' in attrs.translations.fin) ||
      !('name' in attrs.translations.eng) ||
      !('name' in attrs.translations.swe)
    ) {
      return false;
    }
  });
  return true;
};

export const getPrivacyLink = (lng: string) => {
  if (lng in LINKS_PRIVACY) return LINKS_PRIVACY[lng];
  return LINKS_PRIVACY.en;
};

export const getTranslationObj = (
  stringOrObj: string | Record<string, any>
) => {
  let lang: string | undefined;
  let val: string;
  if (typeof stringOrObj === 'object' && 'lang' in stringOrObj) {
    lang = stringOrObj.lang;
    val = stringOrObj.val;
  } else {
    val = stringOrObj as string;
  }
  return { val, lang };
};

export const getLocaleString = (date: Date) => {
  let lang = i18n.language;
  if (lang.includes('en')) {
    lang = 'en-FI'; // Don't show AM/PM time
  }
  return date.toLocaleString(lang, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getReturnUrl = () => {
  const returnUrl = getSearchParams().return_url;

  if (returnUrl) {
    try {
      const decodedUrl = decodeURIComponent(returnUrl);
      if (
        decodedUrl.startsWith('http://') ||
        decodedUrl.startsWith('https://')
      ) {
        return decodedUrl;
      }
    } catch (e) {
      console.error('Could not URL decode', returnUrl);
    }
  }
  return null;
};

export const goToExternalUrl = (url: string) => {
  if (ALLOWED_EXTERNAL_DOMAINS?.find(u => u.startsWith(url))) {
    window.location.assign(url);
  }
  console.error('return_url is not allowed');
};

const splitParams = (paramString: string) => {
  const argPairs = paramString.split('&');
  const params = argPairs.reduce((acc, item) => {
    const [key, val] = item.split('=');
    acc[key] = val || '';
    return acc;
  }, {} as Record<string, string>);

  return params;
};

export const getSearchParams = (search?: string) => {
  return splitParams((search || window.location.search).substring(1));
};

export const getItemsSortedByDate = (
  items: Record<string, ProcessingRecordHistoryItem | AccessItem>
) =>
  Object.values(items)
    .map(item => ({ ...item, created: new Date(item.created) }))
    .sort((first, second) => +second.created - +first.created);

export const recordStatusToInfoBoxVariant = (
  status: RecordStatus
): InfoBoxVariant => {
  switch (status) {
    case RecordStatus.ACTIVE:
      return 'primary';
    case RecordStatus.DECLINED:
      return 'error';
    case RecordStatus.PENDING:
      return 'secondary';
    case RecordStatus.EXPIRED:
    case RecordStatus.WITHDRAWN:
    case RecordStatus.SUSPENDED:
      return 'error';
  }
};
