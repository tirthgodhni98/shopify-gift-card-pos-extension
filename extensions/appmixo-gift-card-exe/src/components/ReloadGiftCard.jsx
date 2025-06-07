import React, { useState } from 'react';
import {
  Text,
  TextField,
  Button,
  Stack,
} from '@shopify/ui-extensions-react/point-of-sale';
import { giftCardService } from '../services/giftCardService.js';

const ReloadGiftCard = () => {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [reloadAmount, setReloadAmount] = useState('');
  const [reloadMessage, setReloadMessage] = useState('');

  const handleSearchGiftCard = async () => {
    setSearchMessage('');
    setSearchResult(null);
    if (!searchNumber && !searchCustomer) {
      setSearchMessage('Please enter a gift card code or customer detail.');
      return;
    }
    try {
      const params = {};
      if (searchNumber) params.code = searchNumber;
      if (searchCustomer) {
        if (searchCustomer.includes('@')) {
          params.email = searchCustomer;
        } else {
          params.name = searchCustomer;
        }
      }
      const data = await giftCardService.searchGiftCard(params);
      if (data && data.length > 0) {
        setSearchResult(data[0]);
      } else {
        setSearchMessage('Gift card not found.');
      }
    } catch (error) {
      setSearchMessage('Error searching for gift card.');
    }
  };

  const handleReloadGiftCard = async () => {
    setReloadMessage('');
    if (!searchResult || !reloadAmount) {
      setReloadMessage('Please enter a reload amount.');
      return;
    }
    try {
      const data = await giftCardService.reloadGiftCard({
        giftCardId: searchResult.id,
        amount: parseFloat(reloadAmount)
      });
      
      if (data && data.success) {
        setReloadMessage('Gift card reloaded successfully!');
      } else {
        setReloadMessage('Failed to reload gift card.');
      }
    } catch (error) {
      setReloadMessage('Error reloading gift card.');
    }
  };

  return (
    <Stack direction="vertical" spacing="loose">
      <Text>Reload/Lookup Gift Card</Text>
      <TextField
        label="Gift Card Code"
        type="text"
        value={searchNumber}
        onChange={setSearchNumber}
        autoComplete="off"
      />
      <TextField
        label="Customer Email or Name"
        type="text"
        value={searchCustomer}
        onChange={setSearchCustomer}
        autoComplete="off"
      />
      <Button onPress={handleSearchGiftCard} title='Search Gift Card'></Button>
      {searchMessage && <Text>{searchMessage}</Text>}
      {searchResult && (
        <>
          <Text>Gift Card Details:</Text>
          <Text>ID: {searchResult.id}</Text>
          <Text>Amount: ${searchResult.amount}</Text>
          <Text>Balance: ${searchResult.balance}</Text>
          <Text>Created At: {searchResult.createdAt}</Text>
          <Text>Masked Code: {searchResult.maskedCode}</Text>
          <Text>Note: {searchResult.note}</Text>
          <TextField
            label="Reload Amount"
            type="text"
            value={reloadAmount}
            onChange={setReloadAmount}
          />
          <Button onPress={handleReloadGiftCard} title='Reload Gift Card'></Button>
          {reloadMessage && <Text>{reloadMessage}</Text>}
        </>
      )}
    </Stack>
  );
};

export default ReloadGiftCard; 