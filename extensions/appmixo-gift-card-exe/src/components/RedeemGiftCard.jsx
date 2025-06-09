import React, { useState, useEffect } from 'react';
import {
  Text,
  TextField,
  Button,
  Stack,
} from '@shopify/ui-extensions-react/point-of-sale';
import { giftCardService } from '../services/giftCardService.js';

const RedeemGiftCard = () => {
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemCard, setRedeemCard] = useState(null);
  const [redeemLookupMsg, setRedeemLookupMsg] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');
  const [errors, setErrors] = useState({});
  const [isLookupValid, setIsLookupValid] = useState(false);
  const [isRedeemValid, setIsRedeemValid] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [isRedeemLoading, setIsRedeemLoading] = useState(false);

  useEffect(() => {
    validateLookupForm();
  }, [redeemCode]);

  useEffect(() => {
    validateRedeemForm();
  }, [redeemAmount, redeemCard]);

  const validateLookupForm = () => {
    const newErrors = {};
    if (redeemCode && !redeemCode.trim()) {
      newErrors.redeemCode = 'Gift card code cannot be empty';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    setIsLookupValid(redeemCode.trim() && Object.keys(newErrors).length === 0);
  };

  const validateRedeemForm = () => {
    const newErrors = {};
    if (redeemAmount) {
      if (!/^\d+(\.\d{0,2})?$/.test(redeemAmount)) {
        newErrors.redeemAmount = 'Please enter a valid number (up to 2 decimal places)';
      } else if (parseFloat(redeemAmount) <= 0) {
        newErrors.redeemAmount = 'Amount must be greater than 0';
      } else if (redeemCard && parseFloat(redeemAmount) > redeemCard.balance) {
        newErrors.redeemAmount = 'Amount cannot exceed gift card balance';
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    setIsRedeemValid(
      redeemAmount && 
      redeemCard !== null && 
      Object.keys(newErrors).length === 0
    );
  };

  const handleRedeemLookup = async () => {
    if (!isLookupValid) return;

    setIsLookupLoading(true);
    setRedeemLookupMsg('');
    setRedeemCard(null);
    setRedeemMsg('');
    setDiscountCode('');
    setRemainingBalance('');
    setErrors(prev => ({ ...prev, redeemAmount: '' }));

    try {
      const data = await giftCardService.lookupGiftCard(redeemCode);
      if (data && data.giftCard && data.giftCard.balance > 0) {
        setRedeemCard(data.giftCard);
      } else {
        setRedeemLookupMsg('Gift card not found or no balance available.');
      }
    } catch (error) {
      setRedeemLookupMsg('Error looking up gift card.');
    } finally {
      setIsLookupLoading(false);
    }
  };

  const handleRedeemGiftCard = async () => {
    if (!isRedeemValid) return;

    setIsRedeemLoading(true);
    setRedeemMsg('');
    setDiscountCode('');
    setRemainingBalance('');

    try {
      const data = await giftCardService.redeemGiftCard({
        code: redeemCode,
        amount: parseFloat(redeemAmount)
      });
      
      if (data && data.success) {
        setRedeemMsg('Gift card redeemed successfully!');
        setDiscountCode(data.discountCode);
        setRemainingBalance(data.remainingBalance);
        setRedeemAmount('');
        setErrors(prev => ({ ...prev, redeemAmount: '' }));
      } else {
        setRedeemMsg('Failed to redeem gift card.');
      }
    } catch (error) {
      setRedeemMsg('Error redeeming gift card.');
    } finally {
      setIsRedeemLoading(false);
    }
  };

  return (
    <Stack direction="vertical" spacing="loose">
      <Text>Redeem Gift Card</Text>
      <TextField
        label="Gift Card Code"
        type="text"
        value={redeemCode}
        onChange={setRedeemCode}
        autoComplete="off"
        error={errors.redeemCode}
        disabled={isLookupLoading || isRedeemLoading}
      />
      <Button 
        onPress={handleRedeemLookup} 
        title={isLookupLoading ? 'Looking up...' : 'Lookup Gift Card'}
        disabled={!isLookupValid || isLookupLoading || isRedeemLoading}
      />
      {redeemLookupMsg && <Text>{redeemLookupMsg}</Text>}
      {redeemCard && (
        <>
          <Text>Gift Card Details:</Text>
          <Text>ID: {redeemCard.id}</Text>
          <Text>Balance: ${redeemCard.balance}</Text>
          <Text>Masked Code: {redeemCard.maskedCode}</Text>
          <Text>Note: {redeemCard.note}</Text>
          <TextField
            label="Amount to Redeem"
            type="number"
            value={redeemAmount}
            onChange={setRedeemAmount}
            error={errors.redeemAmount}
            disabled={isRedeemLoading}
          />
          <Button 
            onPress={handleRedeemGiftCard}
            title={isRedeemLoading ? 'Redeeming...' : 'Redeem Gift Card'}
            disabled={!isRedeemValid || isRedeemLoading}
          />
          {redeemMsg && <Text>{redeemMsg}</Text>}
          {discountCode && <Text>Discount Code: {discountCode}</Text>}
          {remainingBalance !== '' && <Text>Remaining Balance: ${remainingBalance}</Text>}
        </>
      )}
    </Stack>
  );
};

export default RedeemGiftCard; 