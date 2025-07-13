import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '@/types/product';
import type { Pet } from '@/types/pet';

export interface CartItem {
  id: string;
  type: 'product' | 'pet';
  item: Product | Pet;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: Product | Pet; type: 'product' | 'pet'; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CART_STORAGE_KEY = 'monito-cart';

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const shipping = subtotal > 5000000 ? 0 : 30000; // Free shipping over 5M VND, else 30k
  const total = subtotal + tax + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    tax,
    shipping,
    total,
    totalItems,
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, type, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item._id && cartItem.type === type
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: item._id,
          type,
          item,
          quantity,
          price: 'price' in item ? item.price : (item as any).price || 0,
        };
        newItems = [...state.items, newItem];
      }
      break;
    }

    case 'REMOVE_ITEM': {
      newItems = state.items.filter((item) => item.id !== action.payload.id);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        newItems = state.items.filter((item) => item.id !== id);
      } else {
        newItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      break;
    }

    case 'CLEAR_CART': {
      newItems = [];
      break;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }

  const totals = calculateCartTotals(newItems);

  return {
    items: newItems,
    ...totals,
  };
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

interface CartContextType {
  state: CartState;
  addItem: (item: Product | Pet, type: 'product' | 'pet', quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item: Product | Pet, type: 'product' | 'pet', quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, type, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: string) => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const isInCart = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 