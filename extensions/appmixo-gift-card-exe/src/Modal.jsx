import React, { useState } from 'react';
import {
  reactExtension,
  Screen,
  SegmentedControl,
  Stack,
  Text,
  TextField,
  Button,
  ScrollView,
} from '@shopify/ui-extensions-react/point-of-sale';

const Modal = () => {
  const [selected, setSelected] = useState('1');
  // States for segment 1 (Create Gift Card)
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [giftCardList, setGiftCardList] = useState([]);
  // States for segment 2 (Search Gift Card)
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [reloadAmount, setReloadAmount] = useState('');
  const [reloadMessage, setReloadMessage] = useState('');
  // Redeem Gift Card states
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemCard, setRedeemCard] = useState(null);
  const [redeemLookupMsg, setRedeemLookupMsg] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');

  const handleCreateGiftCard = async () => {
    try {
      const response = await fetch('https://4c9f-2405-201-200c-601f-dcf1-a565-a871-42f7.ngrok-free.app/api/create-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: name,
          amount: parseFloat(amount)
        }),
      });
      const data = await response.json();
      const giftCard = {
        amount: amount,
        email: email,
        name: name,
        id: data.id || Date.now()
      };
      setMessage('Gift card created successfully!');
      setGiftCardList([...giftCardList, giftCard]);
      setAmount('');
      setEmail('');
      setName('');
    } catch (error) {
      setMessage('Failed to create gift card.');
    }
  };

  const handleSearchGiftCard = async () => {
    setSearchMessage('');
    setSearchResult(null);
    if (!searchNumber) {
      setSearchMessage('Please enter a gift card number.');
      return;
    }
    try {
      const response = await fetch('https://4c9f-2405-201-200c-601f-dcf1-a565-a871-42f7.ngrok-free.app/api/search-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftCardNumber: searchNumber,
          customerEmail: searchCustomer
        }),
      });
      const data = await response.json();
      if (data && data.giftCard) {
        setSearchResult(data.giftCard);
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
      // Replace with your actual backend endpoint for reloading gift cards
      const response = await fetch('https://4c9f-2405-201-200c-601f-dcf1-a565-a871-42f7.ngrok-free.app/api/reload-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftCardId: searchResult.id,
          amount: parseFloat(reloadAmount)
        }),
      });
      const data = await response.json();
      if (data && data.success) {
        setReloadMessage('Gift card reloaded successfully!');
      } else {
        setReloadMessage('Failed to reload gift card.');
      }
    } catch (error) {
      setReloadMessage('Error reloading gift card.');
    }
  };

  // Handler to lookup gift card via BJE API
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
      // Replace with your BJE Admin API endpoint
      const response = await fetch('https://4c9f-2405-201-200c-601f-dcf1-a565-a871-42f7.ngrok-free.app/api/lookup-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode }),
      });
      const data = await response.json();
      if (data && data.giftCard && data.giftCard.balance > 0) {
        setRedeemCard(data.giftCard);
      } else {
        setRedeemLookupMsg('Gift card not found or no balance available.');
      }
    } catch (error) {
      setRedeemLookupMsg('Error looking up gift card.');
    }
  };

  // Handler to redeem gift card
  const handleRedeemGiftCard = async () => {
    setRedeemMsg('');
    setDiscountCode('');
    setRemainingBalance('');
    if (!redeemCard || !redeemAmount) {
      setRedeemMsg('Please enter an amount to redeem.');
      return;
    }
    try {
      // Replace with your BJE Admin API endpoint for redeem
      const response = await fetch('https://4c9f-2405-201-200c-601f-dcf1-a565-a871-42f7.ngrok-free.app/api/redeem-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemCode,
          amount: parseFloat(redeemAmount)
        }),
      });
      const data = await response.json();
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
    <Screen name="SegmentedControl" title="Gift Card Actions">
      <Stack direction="vertical" paddingHorizontal="ExtraExtraLarge">
        <SegmentedControl
          segments={[
            { id: '1', label: 'Create', disabled: false },
            { id: '2', label: 'Reload/Lookup', disabled: false },
            { id: '3', label: 'Redeem', disabled: false },
          ]}
          selected={selected}
          onSelect={setSelected}
        />
        <ScrollView>
          {selected === '1' && (
            <>
              <Text>Create Gift Card</Text>
              <TextField
                label="Amount"
                type="text"
                value={amount}
                onChange={setAmount}
              />
              <TextField
                label="Recipient Name"
                type="text"
                value={name}
                onChange={setName}
              />
              <TextField
                label="Recipient Email"
                type="text"
                value={email}
                onChange={setEmail}
              />
              <Button onPress={handleCreateGiftCard} title='Create Gift Card'></Button>
              {message && <Text>{message}</Text>}
              {giftCardList.length > 0 && (
                <>
                  <Text>Gift Cards Created:</Text>
                  {giftCardList.map((card, index) => (
                    <Text key={index}>
                      Card #{index + 1}: Amount: ${card.amount} | Name: {card.name} | Email: {card.email}
                    </Text>
                  ))}
                </>
              )}
            </>
          )}
          {selected === '2' && (
            <>
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
                  <Button onPress={handleReloadGiftCard} title="Reload Gift Card"></Button>
                  {reloadMessage && <Text>{reloadMessage}</Text>}
                </>
              )}
            </>
          )}
          {selected === '3' && (
            <>
              <Text>Redeem Gift Card</Text>
              <TextField
                label="Gift Card Code"
                type="text"
                value={redeemCode}
                onChange={setRedeemCode}
                autoComplete="off"
              />
              <Button onPress={handleRedeemLookup} title="Lookup Gift Card"></Button>
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
                  <Button onPress={handleRedeemGiftCard} title="Redeem Gift Card"></Button>
                  {redeemMsg && <Text>{redeemMsg}</Text>}
                  {discountCode && <Text>Discount Code: {discountCode}</Text>}
                  {remainingBalance !== '' && <Text>Remaining Balance: ${remainingBalance}</Text>}
                </>
              )}
            </>
          )}
        </ScrollView>
      </Stack>
    </Screen>
  );
};

export default reactExtension('pos.home.modal.render', () => <Modal />);