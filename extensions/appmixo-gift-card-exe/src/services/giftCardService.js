import { API_ENDPOINTS } from '../constants/api';

export const giftCardService = {
  createGiftCard: async (data) => {
    const response = await fetch(API_ENDPOINTS.CREATE_GIFT_CARD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  searchGiftCard: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_ENDPOINTS.SEARCH_GIFT_CARD}?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  reloadGiftCard: async (data) => {
    const response = await fetch(API_ENDPOINTS.RELOAD_GIFT_CARD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  lookupGiftCard: async (code) => {
    const response = await fetch(API_ENDPOINTS.LOOKUP_GIFT_CARD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return response.json();
  },

  redeemGiftCard: async (data) => {
    const response = await fetch(API_ENDPOINTS.REDEEM_GIFT_CARD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
}; 