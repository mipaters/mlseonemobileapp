import { useMemo, useState } from "react";
import { Award, Film, Shirt, ShoppingCart, Star, Ticket } from "lucide-react";
import { MERCH_SECTIONS, merchById } from "../../data/merchandise";
import type { DigitalLockerItem, MerchandiseItem } from "../../types";
import { useAppState } from "../../store/AppState";
import { Button } from "../../components/ui/Button";
import { MerchCard } from "../../components/commerce/MerchCard";
import { ProductDetailSheet } from "../../components/commerce/ProductDetailSheet";
import { CartSheet } from "../../components/commerce/CartSheet";
import { CheckoutSheet } from "../../components/commerce/CheckoutSheet";

const lockerTypeMeta: Record<DigitalLockerItem["type"], { icon: typeof Shirt; accent: string }> = {
  Merchandise: { icon: Shirt, accent: "text-accent-gold" },
  "Ticket Stub": { icon: Ticket, accent: "text-jays-600" },
  Badge: { icon: Award, accent: "text-accent-green" },
  Highlight: { icon: Film, accent: "text-leafs-600" },
  Experience: { icon: Star, accent: "text-accent-gold" },
};

function resolveLockerName(item: DigitalLockerItem) {
  return merchById(item.name)?.name ?? item.name;
}

export function DigitalLockerPage() {
  const { state } = useAppState();
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const lockerGroups = useMemo(() => {
    return (["Merchandise", "Ticket Stub", "Badge", "Highlight", "Experience"] as const).map((type) => ({
      type,
      items: state.digitalLocker.filter((item) => item.type === type),
    }));
  }, [state.digitalLocker]);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative space-y-8 px-4 pb-24 pt-4">
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-leafs-700 p-5">
        <p className="text-sm font-medium text-silver-300">Profile</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Digital Locker</h1>
        <p className="mt-2 text-sm text-silver-400">
          Your fan collectibles, past purchases, and personalized gear recommendations in one place.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Locker collection</h2>
          <p className="text-sm text-silver-400">Everything you have unlocked or purchased across the app.</p>
        </div>

        <div className="space-y-4">
          {lockerGroups.map(({ type, items }) => {
            if (items.length === 0) return null;
            const meta = lockerTypeMeta[type];
            const Icon = meta.icon;

            return (
              <article key={type} className="rounded-2xl border border-white/10 bg-navy-900/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <Icon size={20} className={meta.accent} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{type}</h3>
                    <p className="text-xs text-silver-500">{items.length} item{items.length === 1 ? "" : "s"}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {items.map((item) => {
                    const merch = merchById(item.name);
                    const teamLabel =
                      item.teamId === "both"
                        ? "Leafs + Jays"
                        : item.teamId === "leafs"
                          ? "Leafs"
                          : item.teamId === "jays"
                            ? "Jays"
                            : merch?.teamId === "both"
                              ? "Leafs + Jays"
                              : merch?.teamId === "leafs"
                                ? "Leafs"
                                : merch?.teamId === "jays"
                                  ? "Jays"
                                  : "";

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">{resolveLockerName(item)}</p>
                          <p className="mt-1 text-xs text-silver-500">{teamLabel || "MLSE One collectible"}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-navy-950/50 px-3 py-1 text-xs text-silver-300">
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Shop by section</h2>
          <p className="text-sm text-silver-400">Explore curated drops that fit your Leafs and Jays fandom.</p>
        </div>

        {MERCH_SECTIONS.map((section) => {
          const items = section.itemIds
            .map((itemId) => merchById(itemId))
            .filter((item): item is NonNullable<typeof item> => Boolean(item));

          return (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{section.title}</h3>
                <span className="text-xs text-silver-500">{items.length} picks</span>
              </div>
              <div className="-mx-4 overflow-x-auto px-4 pb-1">
                <div className="flex gap-3">
                  {items.map((item) => (
                    <MerchCard key={`${section.id}-${item.id}`} item={item} onOpen={() => setSelectedItem(item)} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {cartCount > 0 && (
        <div className="sticky bottom-4 z-20">
          <Button className="flex w-full items-center justify-center gap-2 shadow-2xl" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </Button>
        </div>
      )}

      <ProductDetailSheet item={selectedItem} open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} />
      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
        }}
      />
    </div>
  );
}
