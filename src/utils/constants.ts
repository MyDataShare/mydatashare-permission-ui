import { snakeCase, toUpper } from 'lodash';

import { getEnvVar } from './env';

export const LINKS_TOS: Record<string, string> = {
  fi: 'https://tos.vastuugroup.fi/fi/MyDataShare_terms.pdf',
  en: 'https://tos.vastuugroup.fi/en/MyDataShare_terms.pdf',
  sv: 'https://tos.vastuugroup.fi/sv/MyDataShare_terms.pdf',
};
export const LINKS_PRIVACY: Record<string, string> = {
  fi: 'https://www.vastuugroup.fi/fi-fi/tietosuoja',
  en: 'https://www.vastuugroup.fi/fi-en/data-protection',
};

const STABLE_API_VER = 'v3.0';
const LATEST_API_VER = 'v3.1';

export const CONTENT_MAX_WIDTH = 960;
export const CONTENT_MAX_WIDTH_PX = `${CONTENT_MAX_WIDTH}px`;
export const NO_BREAK_SPACE = '\u{00A0}';

// TODO: When AccessItems search endpoint is added to embedded wallet domain, remove wallet scope
export const SCOPE = 'openid embedded_wallet wallet';
export const REDIRECT_PATH_AUTHENTICATED = '/consents';
export const REDIRECT_PATH_UNAUTHENTICATED = '/';
export const REDIRECT_URI = `${window.location.origin}/login`;
export const POST_LOGOUT_REDIRECT_URI = `${window.location.origin}${REDIRECT_PATH_UNAUTHENTICATED}`;

export const AUTH_ITEM_NAMES = getEnvVar('REACT_APP_AUTH_ITEM_NAMES')?.split(
  ';'
);
export const ALLOWED_EXTERNAL_DOMAINS = getEnvVar(
  'REACT_APP_EXTERNAL_DOMAINS'
)?.split(';');

export const MDS_API_URL = getEnvVar('REACT_APP_MDS_API_URL');
export const WALLET_URL = getEnvVar('REACT_APP_WALLET_URL');

export const V3_1_PROD_DEPLOY_DATE = new Date(
  getEnvVar('REACT_APP_V3_1_PROD_DEPLOY_DATE') || '2023-09-08T00:00:00.000Z'
);

// Dynamic enrollments and endpoints
export const ENROLL_NAMES =
  getEnvVar('REACT_APP_ENROLL_NAMES')?.split(';') || [];

// @ts-ignore False positive, url cannot be undefined because of the filter call.
export const ENROLL_NAMES_AND_ENDPOINTS: Array<[string, string]> =
  ENROLL_NAMES.map(name => [
    name,
    getEnvVar(`REACT_APP_ENROLL_URL_${toUpper(snakeCase(name))}`),
  ]).filter(([_, url]) => !!url);

// Endpoints
export const ENDPOINT_AUTH_ITEMS = `public/${STABLE_API_VER}/auth_items`;
export const ENDPOINT_IDENTIFIERS = `embedded_wallet/${STABLE_API_VER}/identifiers`;
export const ENDPOINT_METADATA = `embedded_wallet/${STABLE_API_VER}/metadata`;
export const ENDPOINT_ACCESS_ITEMS = `wallet/${STABLE_API_VER}/access_items`;

export const ENDPOINT_PROCESSING_RECORDS = `embedded_wallet/${LATEST_API_VER}/processing_records`;
export const ENDPOINT_PROCESSING_RECORD = `embedded_wallet/${LATEST_API_VER}/processing_record`;
export const ENDPOINT_PROCESSING_RECORD_PARTICIPANT = `embedded_wallet/${LATEST_API_VER}/processing_record_participant`;
export const ENDPOINT_HISTORY_ITEMS = `embedded_wallet/${LATEST_API_VER}/processing_record_history_items`;

/* Enroller backend PR create endpoint */
export const ENDPOINT_CREATE_PROCESSING_RECORD = 'api/processing_record';
