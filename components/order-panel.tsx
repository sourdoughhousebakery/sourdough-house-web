import { Bell, CreditCard, ShoppingBag, Timer } from "lucide-react";
import { getHotplateUrl } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

const orderSteps = [
  { title: "Watch the drop", description: "Hotplate shows what is available this week.", Icon: Bell },
  { title: "Reserve favorites", description: "Pick bread, sweets, and seasonal specials before they sell out.", Icon: ShoppingBag },
  { title: "Pay securely", description: "Checkout runs through Hotplate, not a loose form or DM thread.", Icon: CreditCard },
  { title: "Pickup fresh", description: "Arrive at the pickup window and take home the good stuff.", Icon: Timer }
];

export function OrderPanel() {
  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-gradient-to-br from-gold to-rust p-6 text-white shadow-lift md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/75">Order online</p>
          <h2 className="mt-3 font-serif text-5xl leading-none">Fresh bread, easy pickup.</h2>
          <p className="mt-5 text-lg leading-8 text-white/82">
            Hotplate keeps the weekly menu current, handles payment, and makes it easy to get notified when the next bake opens.
          </p>
          <div className="mt-7">
            <ButtonLink href={getHotplateUrl()} external variant="dark">
              Open Hotplate
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {orderSteps.map(({ title, description, Icon }) => (
            <article key={title} className="rounded-3xl bg-white/16 p-5 backdrop-blur-sm">
              <Icon aria-hidden size={24} />
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/78">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

