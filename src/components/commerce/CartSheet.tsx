import { ShoppingCart, Tag } from "lucide-react";
import { merchById } from "../../data/merchandise";
import { useAppState } from "../../store/AppState";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";
import { getCartPricing } from "./pricing";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartSheet({ open, onClose, onCheckout }: CartSheetProps) {
  const { state } = useAppState();
  const pricing = getCartPricing(state.cart, state.rewardsBalance, true);

  return (
    <Sheet open={open} onClose={onClose} title="Your cart">
      <div className="space-y-4">
        {pricing.lineItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-navy-900/70 p-6 text-center">
            <ShoppingCart size={28} className="mx-auto text-silver-500" />
            <p className="mt-3 text-sm font-medium text-white">Your cart is empty</p>
            <p className="mt-1 text-sm text-silver-400">Add some Leafs or Jays gear to get started.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {pricing.lineItems.map(({ cartItem, name, price }) => {
                const merch = merchById(cartItem.itemId);
                return (
                  <div key={`${cartItem.itemId}-${cartItem.size}-${cartItem.color}`} className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{name}</h3>
                        <p className="mt-1 text-xs text-silver-400">
                          {cartItem.size} · {cartItem.color} · Qty {cartItem.quantity}
                        </p>
                        {merch && <p className="mt-1 text-xs text-silver-500">{merch.reason}</p>}
                      </div>
                      <span className="text-sm font-semibold text-accent-gold">{formatCurrency(price * cartItem.quantity)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-silver-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(pricing.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-silver-300">
                  <span className="inline-flex items-center gap-2">
                    <Tag size={14} className="text-accent-gold" />
                    Illustrative rewards discount
                  </span>
                  <span>-{formatCurrency(pricing.rewardsDiscount)}</span>
                </div>
                <div className="flex items-center justify-between text-silver-300">
                  <span>Taxes (13%)</span>
                  <span>{formatCurrency(pricing.taxes)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                  <span>Total</span>
                  <span>{formatCurrency(pricing.total)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={onCheckout}>
              Checkout
            </Button>
          </>
        )}
      </div>
    </Sheet>
  );
}
