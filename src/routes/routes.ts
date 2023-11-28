import { ComponentType } from 'react';

import { ENROLL_NAMES_AND_ENDPOINTS } from '../utils/constants';
import Consent from './consent';
import ConsentList from './consent-list';

type TranslationKey = string;

// TODO: Use generics so that props can be validated
type Route = {
  path: string;
  component: ComponentType<any>;
  label: TranslationKey;
  props?: Record<string, any>;
};

const routes: Route[] = [
  {
    path: '/consents',
    component: ConsentList,
    label: 'Consents',
  },
  { path: '/processing-record/:id', component: Consent, label: 'Permit' },
  ...ENROLL_NAMES_AND_ENDPOINTS.map(([name, url]) => ({
    path: `/enroll/${name}`,
    component: ConsentList,
    props: { enroll: { name, url } },
    label: 'Consents',
  })),
];

export default routes;
