import { ShoppingBag } from "lucide-react";
import { MERCHANDISE_SPECIALS } from "../../data/merchandiseSpecials";
import { useAppState } from "../../store/AppState";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";

const teamBadgeClasses: Record<string, string> = {
  jays: "bg-jays-700/80 text-white",
  leafs: "bg-leafs-700/80 text-white",
  raptors: "bg-accent-red/80 text-white",
};

export function MerchandiseSpecialsSection() {
  const { actions } = useAppState();

  const handleAddToCart = (id: string, name: string) => {
    actions.addToCart({ itemId: id, size: "M", color: "Default", quantity: 1 });
    actions.addSignal(`Added to cart: ${name}`);
    actions.showToast(`${name} added to your cart`);
  };

  return (
    <section className="mt-6">
      <SectionHeader eyebrow="Fan Shop" title="Merchandise Specials For You" />
      <div className="flex gap-3 overflow-x-auto px-4 pb-1">
        {MERCHANDISE_SPECIALS.map((item) => (
          <div
            key={item.id}
            className="w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-navy-800"
          >
            <div className="relative flex h-32 items-center justify-center bg-white p-3">
              <span
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${teamBadgeClasses[item.teamColor]}`}
              >
                {item.team}
              </span>
              <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
            </div>
            <div className="space-y-2 p-3">
              <div>
                <h3 className="text-sm font-semibold leading-snug text-white">{item.name}</h3>
                <p className="mt-0.5 text-xs text-silver-500">{item.reason}</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-accent-gold">${item.price.toFixed(2)}</span>
                {item.originalPrice ? (
                  <span className="text-xs text-silver-500 line-through">${item.originalPrice.toFixed(2)}</span>
                ) : null}
              </div>
              <Button size="sm" className="w-full" onClick={() => handleAddToCart(item.id, item.name)}>
                <ShoppingBag size={14} className="mr-1 inline -mt-0.5" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
