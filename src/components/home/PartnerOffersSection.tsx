import { Sparkles } from "lucide-react";
import { PARTNER_OFFERS } from "../../data/rewards";
import { SectionHeader } from "../ui/SectionHeader";

export function PartnerOffersSection() {
  return (
    <section className="mt-6">
      <SectionHeader eyebrow="Sponsors" title="Partner Offers" />
      <div className="px-4 space-y-2">
        {PARTNER_OFFERS.map((offer) => (
          <div key={offer.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-navy-800 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
              <Sparkles size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">
                {offer.partnerName}: {offer.benefit}
              </p>
              <p className="flex items-center gap-1 text-xs text-silver-500 mt-0.5">
                <Sparkles size={10} className="text-accent-teal shrink-0" /> {offer.relevance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
