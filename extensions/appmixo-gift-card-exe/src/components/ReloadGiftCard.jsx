import React, { useState, useEffect } from 'react';
import {
  Text,
  TextField,
  EmailField,
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
  const [errors, setErrors] = useState({});
  const [isSearchValid, setIsSearchValid] = useState(false);
  const [isReloadValid, setIsReloadValid] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isReloadLoading, setIsReloadLoading] = useState(false);

  useEffect(() => {
    validateSearchForm();
  }, [searchNumber, searchCustomer]);

  useEffect(() => {
    validateReloadForm();
  }, [reloadAmount, searchResult]);

  const validateSearchForm = () => {
    const newErrors = {};
    if (searchNumber || searchCustomer) {
      if (searchCustomer && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchCustomer)) {
        newErrors.searchCustomer = 'Please enter a valid email address';
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    setIsSearchValid(
      (searchNumber || searchCustomer) && 
      Object.keys(newErrors).length === 0
    );
  };

  const validateReloadForm = () => {
    const newErrors = {};
    if (reloadAmount) {
      if (!/^\d+(\.\d{0,2})?$/.test(reloadAmount)) {
        newErrors.reloadAmount = 'Please enter a valid number (up to 2 decimal places)';
      } else if (parseFloat(reloadAmount) <= 0) {
        newErrors.reloadAmount = 'Amount must be greater than 0';
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    setIsReloadValid(
      reloadAmount && 
      searchResult !== null && 
      Object.keys(newErrors).length === 0
    );
  };

  const handleSearchGiftCard = async () => {
    if (!isSearchValid) return;

    setIsSearchLoading(true);
    setSearchMessage('');
    setSearchResult(null);
    setErrors(prev => ({ ...prev, reloadAmount: '' }));

    try {
      const params = {};
      if (searchNumber) params.code = searchNumber;
      if (searchCustomer) {
        params.email = searchCustomer;
      }
      const data = await giftCardService.searchGiftCard(params);
      if (data && data.length > 0) {
        setSearchResult(data[0]);
      } else {
        setSearchMessage('Gift card not found.');
      }
    } catch (error) {
      setSearchMessage('Error searching for gift card.');
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleReloadGiftCard = async () => {
    if (!isReloadValid) return;

    setIsReloadLoading(true);
    setReloadMessage('');

    try {
      const data = await giftCardService.reloadGiftCard({
        giftCardId: searchResult.id,
        amount: parseFloat(reloadAmount)
      });
      
      if (data && data.success) {
        setReloadMessage('Gift card reloaded successfully!');
        setReloadAmount('');
        setErrors(prev => ({ ...prev, reloadAmount: '' }));
      } else {
        setReloadMessage('Failed to reload gift card.');
      }
    } catch (error) {
      setReloadMessage('Error reloading gift card.');
    } finally {
      setIsReloadLoading(false);
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
        error={errors.search}
        disabled={isSearchLoading || isReloadLoading}
      />
      <EmailField
        label="Customer Email"
        value={searchCustomer}
        onChange={setSearchCustomer}
        autoComplete="off"
        error={errors.searchCustomer}
        disabled={isSearchLoading || isReloadLoading}
      />
      <Button 
        onPress={handleSearchGiftCard} 
        title={isSearchLoading ? 'Searching...' : 'Search Gift Card'}
        disabled={!isSearchValid || isSearchLoading || isReloadLoading}
      />
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
            type="number"
            value={reloadAmount}
            onChange={setReloadAmount}
            error={errors.reloadAmount}
            disabled={isReloadLoading}
          />
          <Button 
            onPress={handleReloadGiftCard} 
            title={isReloadLoading ? 'Reloading...' : 'Reload Gift Card'}
            disabled={!isReloadValid || isReloadLoading}
          />
          {reloadMessage && <Text>{reloadMessage}</Text>}
        </>
      )}
    </Stack>
  );
};

export default ReloadGiftCard; 