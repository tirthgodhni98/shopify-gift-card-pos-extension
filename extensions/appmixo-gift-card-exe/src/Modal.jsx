import React, { useState } from 'react';
import {
  Text,
  Screen,
  ScrollView,
  Navigator,
  reactExtension,
  TextField,
  Button,
} from '@shopify/ui-extensions-react/point-of-sale';

const Modal = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [giftCardList, setGiftCardList] = useState([]);

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
      console.log('Gift Card Created:', data);
      
      // Create a properly structured gift card object
      const giftCard = {
        amount: amount,
        email: email,
        name: name,
        id: data.id || Date.now()
      };
      
      setMessage('Gift card created successfully!');
      setGiftCardList([...giftCardList, giftCard]);
      
      // Clear the form
      setAmount('');
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Error creating gift card:', error);
      setMessage('Failed to create gift card.');
    }
  };

  return (
    <Navigator>
      <Screen name="CreateGiftCard" title="Create Gift Card">
        <ScrollView>
          <Text>Enter Gift Card Details</Text>

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

          <Button
            onPress={handleCreateGiftCard}
            title="Create Gift Card"
          >
          </Button>

          {message && <Text>{message}</Text>}

          {giftCardList.length > 0 && (
            <>
              <Text style={{ marginTop: 20, marginBottom: 10 }}>Gift Cards Created:</Text>
              {giftCardList.map((card, index) => (
                <Text key={index} style={{ marginBottom: 8 }}>
                  Card #{index + 1}: Amount: ${card.amount} | Name: {card.name} | Email: {card.email}
                </Text>
              ))}
            </>
          )}
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

export default reactExtension('pos.home.modal.render', () => <Modal />);