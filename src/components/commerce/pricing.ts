import { merchById } from "../../data/merchandise";
import type { CartItem } from "../../types";

export interface CartLineItem {
  cartItem: CartItem;
  price: number;
  name: string;
}

export interface CartPricing {
  lineItems: CartLineItem[];
  subtotal: number;
  rewardsDiscount: number;
  taxes: number;
  total: number;
}

export function getCartPricing(cart: CartItem[], rewardsBalance: number, applyRewards = true): CartPricing {
  const lineItems = cart.flatMap((cartItem) => {
    const merch = merchById(cartItem.itemId);
    if (!merch) return [];
    return [
      {
        cartItem,
        price: merch.price,
        name: merch.name,
      },
    ];
  });

  const subtotal = lineItems.reduce((sum, line) => sum + line.price * line.cartItem.quantity, 0);
  const rewardsDiscount = applyRewards && rewardsBalance > 5000 ? subtotal * 0.1 : 0;
  const taxableAmount = Math.max(0, subtotal - rewardsDiscount);
  const taxes = taxableAmount * 0.13;

  return {
    lineItems,
    subtotal,
    rewardsDiscount,
    taxes,
    total: taxableAmount + taxes,
  };
}
