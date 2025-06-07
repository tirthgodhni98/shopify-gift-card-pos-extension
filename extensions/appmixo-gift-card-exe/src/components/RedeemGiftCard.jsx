import React, { useState } from 'react';
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

  const handleRedeemLookup = async () => {
    setRedeemLookupMsg('');
    setRedeemCard(null);
    setRedeemMsg('');
    setDiscountCode('');
    setRemainingBalance('');
    if (!redeemCode) {
      setRedeemLookupMsg('Please enter a gift card code.');
      return;
    }
    try {
      const data = await giftCardService.lookupGiftCard(redeemCode);
      if (data && data.giftCard && data.giftCard.balance > 0) {
        setRedeemCard(data.giftCard);
      } else {
        setRedeemLookupMsg('Gift card not found or no balance available.');
      }
    } catch (error) {
      setRedeemLookupMsg('Error looking up gift card.');
    }
  };

  const handleRedeemGiftCard = async () => {
    setRedeemMsg('');
    setDiscountCode('');
    setRemainingBalance('');
    if (!redeemCard || !redeemAmount) {
      setRedeemMsg('Please enter an amount to redeem.');
      return;
    }
    try {
      const data = await giftCardService.redeemGiftCard({
        code: redeemCode,
        amount: parseFloat(redeemAmount)
      });
      
      if (data && data.success) {
        setRedeemMsg('Gift card redeemed successfully!');
        setDiscountCode(data.discountCode);
        setRemainingBalance(data.remainingBalance);
      } else {
        setRedeemMsg('Failed to redeem gift card.');
      }
    } catch (error) {
      setRedeemMsg('Error redeeming gift card.');
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
      />
      <Button onPress={handleRedeemLookup} title='Lookup Gift Card'></Button>
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
            type="text"
            value={redeemAmount}
            onChange={setRedeemAmount}
          />
          <Button onPress={handleRedeemGiftCard}>Redeem Gift Card</Button>
          {redeemMsg && <Text>{redeemMsg}</Text>}
          {discountCode && <Text>Discount Code: {discountCode}</Text>}
          {remainingBalance !== '' && <Text>Remaining Balance: ${remainingBalance}</Text>}
        </>
      )}
    </Stack>
  );
};

export default RedeemGiftCard; 