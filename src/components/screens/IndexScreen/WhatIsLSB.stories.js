import React from 'react';
import { storiesOf } from '@storybook/react';
import WhatIsLSB from './WhatIsLSB';

storiesOf('Screens|IndexScreen/WhatIsLSB', module)
  .addParameters({ component: WhatIsLSB })
  .add('default', () => <WhatIsLSB />);
