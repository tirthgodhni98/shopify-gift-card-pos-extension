import React, { useState, useEffect } from 'react';
import {
  Text,
  TextField,
  EmailField,
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
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [amount, email, name]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    if (amount) {
      if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
        newErrors.amount = 'Please enter a valid number (up to 2 decimal places)';
      } else if (parseFloat(amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    }

    // Validate email
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate name
    if (name && !name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }

    setErrors(newErrors);
    setIsValid(
      amount && 
      email && 
      name.trim() && 
      Object.keys(newErrors).length === 0
    );
  };

  const handleCreateGiftCard = async () => {
    if (!isValid) return;

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
      setErrors({});
    } catch (error) {
      setMessage('Failed to create gift card.');
    }
  };

  return (
    <Stack direction="vertical" spacing="loose">
      <Text>Create Gift Card</Text>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={setAmount}
        error={errors.amount}
      />
      <TextField
        label="Recipient Name"
        type="text"
        value={name}
        onChange={setName}
        error={errors.name}
      />
      <EmailField
        label="Recipient Email"
        value={email}
        onChange={setEmail}
        error={errors.email}
      />
      <Button 
        onPress={handleCreateGiftCard} 
        title='Create Gift Card'
        disabled={!isValid}
      ></Button>
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