import React, { useState } from 'react';
import {
  Text,
  TextField,
  Button,
  Stack,
} from '@shopify/ui-extensions-react/point-of-sale';
import { giftCardService } from '../services/giftCardService.js';

const CreateGiftCard = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [giftCardList, setGiftCardList] = useState([]);

  const handleCreateGiftCard = async () => {
    try {
      const data = await giftCardService.createGiftCard({
        email,
        name,
        amount: parseFloat(amount)
      });
      
      const giftCard = {
        amount,
        email,
        name,
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

  return (
    <Stack direction="vertical" spacing="loose">
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
    </Stack>
  );
};

export default CreateGiftCard; 