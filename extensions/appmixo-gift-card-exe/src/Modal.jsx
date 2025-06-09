import React, { useState } from 'react';
import {
  reactExtension,
  Screen,
  SegmentedControl,
  Stack,
  ScrollView,
} from '@shopify/ui-extensions-react/point-of-sale';

import CreateGiftCard from './components/CreateGiftCard.jsx';
import ReloadGiftCard from './components/ReloadGiftCard.jsx';
import RedeemGiftCard from './components/RedeemGiftCard.jsx';

const Modal = () => {
  const [selected, setSelected] = useState('1');

  return (
    <Screen name="SegmentedControl" title="Gift Card Actions">
      <Stack direction="vertical" paddingHorizontal="ExtraExtraLarge">
        <SegmentedControl
          segments={[
            { id: '1', label: 'Create11', disabled: false },
            { id: '2', label: 'Reload/Lookup', disabled: false },
            { id: '3', label: 'Redeem00', disabled: false },
          ]}
          selected={selected}
          onSelect={setSelected}
        />
        <ScrollView>
          {selected === '1' && <CreateGiftCard />}
          {selected === '2' && <ReloadGiftCard />}
          {selected === '3' && <RedeemGiftCard />}
        </ScrollView>
      </Stack>
    </Screen>
  );
};

export default reactExtension('pos.home.modal.render', () => <Modal />);