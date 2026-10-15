import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { useAppState } from "../../store/AppState";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Sheet } from "../ui/Sheet";
import { getCartPricing } from "./pricing";

interface CheckoutSheetProps {
  open: boolean;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CheckoutSheet({ open, onClose }: CheckoutSheetProps) {
  const { state, actions } = useAppState();
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [applyRewards, setApplyRewards] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmed(false);
      setFulfillment("delivery");
      setApplyRewards(true);
    }
  }, [open]);

  const pricing = useMemo(
    () => getCartPricing(state.cart, state.rewardsBalance, applyRewards),
    [applyRewards, state.cart, state.rewardsBalance]
  );

  const handlePlaceOrder = () => {
    if (pricing.lineItems.length === 0) {
      actions.showToast("Your cart is empty");
      return;
    }

    actions.checkout();
    actions.addSignal("Completed a purchase");
    actions.addAgentActivity("Commerce Agent", "Order completed");
    actions.showToast("Order confirmed! Added to your Digital Locker.");
    setConfirmed(true);
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Checkout">
      {confirmed ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-accent-green/30 bg-accent-green/10 px-5 py-12 text-center">
          <CheckCircle2 size={52} className="text-accent-green" />
          <h3 className="mt-4 text-xl font-semibold text-white">Order confirmed!</h3>
          <p className="mt-2 text-sm text-silver-300">Added to your Digital Locker.</p>
          <Button className="mt-6 w-full" onClick={handleDone}>
            Done
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-silver-400" />
              <h3 className="text-sm font-semibold text-white">Fulfillment</h3>
            </div>
            <div className="mt-3 flex gap-2">
              <Chip label="Delivery" active={fulfillment === "delivery"} onClick={() => setFulfillment("delivery")} />
              <Chip label="Arena Pickup" active={fulfillment === "pickup"} onClick={() => setFulfillment("pickup")} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-navy-900 to-navy-800 p-4">
            <div className="flex items-center justify-between text-silver-300">
              <span className="text-sm font-medium">Payment</span>
              <CreditCard size={18} className="text-accent-gold" />
            </div>
            <div className="mt-4 rounded-2xl bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-silver-500">MLSE One Pay</p>
              <p className="mt-6 text-lg font-semibold text-white">•••• 4242</p>
              <p className="mt-1 text-xs text-silver-400">Stored card · Simulated checkout only</p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Apply rewards discount</h3>
                <p className="mt-1 text-xs text-silver-400">Illustrative 10% member savings when eligible.</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyRewards((value) => !value)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  applyRewards ? "bg-accent-gold" : "bg-white/15"
                }`}
                aria-pressed={applyRewards}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                    applyRewards ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-silver-400" />
              <h3 className="text-sm font-semibold text-white">Order review</h3>
            </div>
            <div className="mt-4 space-y-3">
              {pricing.lineItems.map(({ cartItem, name, price }) => (
                <div key={`${cartItem.itemId}-${cartItem.size}-${cartItem.color}`} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-xs text-silver-400">
                      {cartItem.size} · {cartItem.color} · Qty {cartItem.quantity}
                    </p>
                  </div>
                  <span className="text-silver-200">{formatCurrency(price * cartItem.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between text-silver-300">
                <span>Subtotal</span>
                <span>{formatCurrency(pricing.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-silver-300">
                <span>Rewards discount</span>
                <span>-{formatCurrency(pricing.rewardsDiscount)}</span>
              </div>
              <div className="flex items-center justify-between text-silver-300">
                <span>Taxes</span>
                <span>{formatCurrency(pricing.taxes)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
            </div>
          </section>

          <Button className="w-full" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      )}
    </Sheet>
  );
}
