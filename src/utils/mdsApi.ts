import i18next from 'i18next';
import { getTranslation, LANGUAGES, LANGUAGES_ALPHA_3 } from 'mydatashare-core';

import type { DataConsumer, IdentifiersApiResponse, Metadata } from './types';

export const getConsumerTranslations = (
  consumer: DataConsumer,
  lang: string,
  metadatas: Record<string, Metadata>
) => {
  return Object.fromEntries(
    ['name', 'description', 'purpose', 'legal'].map(field => [
      `${field}Tr`,
      translationHelper(consumer, field, lang, metadatas, false),
    ])
  );
};

export const translationHelper = (
  obj: Record<string, unknown>,
  field: string,
  language: string,
  metadatas: Record<string, Metadata>,
  notFoundError: boolean
): { val: string; lang: string } => {
  const ret: { val: string; lang: string } = getTranslation(
    obj,
    field,
    language,
    metadatas,
    {
      notFoundError,
      returnUsedLanguage: true,
    }
  );
  if ('lang' in ret && ret.lang in LANGUAGES_ALPHA_3) {
    return { ...ret, lang: LANGUAGES_ALPHA_3[ret.lang] };
  }
  return ret;
};

export const formatUsername = ({
  givenName,
  familyName,
}: {
  givenName: string;
  familyName: string;
}) => {
  let username = '';
  if (givenName) {
    username += givenName;
  }
  if (familyName) {
    if (username) username += ' ';
    username += familyName;
  }
  return username;
};

export const getUsername = (
  response: IdentifiersApiResponse,
  identifierUuid?: string
) => {
  if (
    response &&
    response.id_provider_infos &&
    Object.keys(response.id_provider_infos).length > 0
  ) {
    const idProviderInfo = Object.values(response.id_provider_infos).find(
      info => {
        if (identifierUuid) {
          return (
            info.identifier_uuid === identifierUuid &&
            (!!info.first_name || !!info.last_name)
          );
        }
        return !!info.first_name || !!info.last_name;
      }
    );
    if (idProviderInfo) {
      return {
        givenName: idProviderInfo.first_name,
        familyName: idProviderInfo.last_name,
      };
    }
  }
  return null;
};

export const getRequiredTranslation = (
  obj: Record<string, unknown>,
  field: string,
  metadatas: Record<string, Metadata>,
  notFoundError = false
) =>
  translationHelper(
    obj,
    field,
    LANGUAGES[i18next.language],
    metadatas,
    notFoundError
  );
