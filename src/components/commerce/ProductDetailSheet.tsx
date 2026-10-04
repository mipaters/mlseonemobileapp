import { useEffect, useMemo, useState } from "react";
import { Bookmark, ShoppingBag, Sparkles } from "lucide-react";
import type { MerchandiseItem } from "../../types";
import { useAppState } from "../../store/AppState";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Sheet } from "../ui/Sheet";

interface ProductDetailSheetProps {
  item: MerchandiseItem | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailSheet({ item, open, onClose }: ProductDetailSheetProps) {
  const { state, actions } = useAppState();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (!open || !item) return;
    setSelectedSize(item.sizes[0] ?? "");
    setSelectedColor(item.colors[0] ?? "");
  }, [item, open]);

  const pointCost = useMemo(() => (item ? item.price * 100 : 0), [item]);
  const canPurchase = Boolean(item && selectedSize && selectedColor);
  const canRedeem = canPurchase && state.rewardsBalance >= pointCost;

  if (!item) {
    return (
      <Sheet open={open} onClose={onClose} title="Product details">
        <div />
      </Sheet>
    );
  }

  const teamLabel = item.teamId === "both" ? "Leafs + Jays" : item.teamId === "leafs" ? "Leafs" : "Jays";

  const handleSave = () => {
    actions.showToast(`Saved ${item.name} for later`);
  };

  const handleAddToCart = () => {
    if (!canPurchase) {
      actions.showToast("Choose a size and color first");
      return;
    }

    actions.addToCart({
      itemId: item.id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    actions.addSignal(`Added ${item.name} to cart`);
    actions.showToast(`${item.name} added to cart`);
    onClose();
  };

  const handleRedeem = () => {
    if (!canPurchase) {
      actions.showToast("Choose a size and color first");
      return;
    }

    if (!canRedeem) {
      actions.showToast("Not enough points for this item");
      return;
    }

    actions.redeemReward(`merch-${item.id}`, pointCost);
    actions.addSignal(`Redeemed merch with points: ${item.name}`);
    actions.showToast(`Redeemed ${item.name} with points`);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Product details">
      <div
        className="rounded-2xl p-5"
        style={{
          background: `linear-gradient(135deg, ${item.image[0]}, ${item.image[1]})`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white">{teamLabel}</span>
          <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white">{item.category}</span>
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-white">{item.name}</h3>
        <p className="mt-2 text-sm text-white/85">{item.reason}</p>
        <p className="mt-4 text-xl font-bold text-white">${item.price}</p>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-silver-400" />
            <h4 className="text-sm font-semibold text-white">Select size</h4>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {item.sizes.map((size) => (
              <Chip key={size} label={size} active={selectedSize === size} onClick={() => setSelectedSize(size)} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-silver-400" />
            <h4 className="text-sm font-semibold text-white">Select color</h4>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {item.colors.map((color) => (
              <Chip key={color} label={color} active={selectedColor === color} onClick={() => setSelectedColor(color)} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
          <p className="text-sm text-silver-300">Redeem with points</p>
          <p className="mt-1 text-lg font-semibold text-accent-gold">{new Intl.NumberFormat().format(pointCost)} pts</p>
          <p className="mt-1 text-xs text-silver-500">Illustrative member redemption value for this item.</p>
        </section>

        <div className="grid grid-cols-1 gap-3">
          <Button variant="secondary" onClick={handleSave} className="w-full">
            <Bookmark size={16} className="mr-2 inline" />
            Save
          </Button>
          <Button onClick={handleAddToCart} className="w-full">
            Add to Cart
          </Button>
          <Button variant="ghost" onClick={handleRedeem} className="w-full border border-accent-gold/20">
            Redeem with Points
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
