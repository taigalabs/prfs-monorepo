import React from 'react';

import en from '@/i18n/en.json';

const I18nContext = React.createServerContext("i18n", en);

export {
  I18nContext,
}
