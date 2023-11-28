import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TFunctionResult } from 'i18next';

import type { Color } from 'theme';

export type LogItem = {
  key: string;
  title: string | TFunctionResult;
  date: Date | null;
  text: string | TFunctionResult;
  icon: {
    color: Color;
    definition: IconDefinition;
  };
};
