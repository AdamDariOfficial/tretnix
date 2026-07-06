import macbook from "@/assets/macbook-mockup.png.asset.json";
import mobile from "@/assets/mobile-mockup.png.asset.json";

/**
 * Hero device mockups. Real desktop + phone PNGs on transparent backgrounds,
 * layered with a subtle blue glow. Uses object-contain so nothing distorts.
 */
export function HeroMockup() {
  return (
    <div className="relative w-full">
      {/* Blue radial glow behind the devices */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(11,99,255,0.35),transparent_62%)] blur-3xl animate-pulse-glow" />
      </div>

      {/* Desktop / laptop */}
      <div className="relative">
        <img
          src={macbook.url}
          alt="Dashboard Tretnix su laptop"
          className="w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Phone — overlaps the laptop in the foreground */}
      <div className="pointer-events-none absolute -bottom-8 -left-4 w-[34%] max-w-[220px] sm:-bottom-14 sm:-left-8 sm:w-[30%] lg:-bottom-16 lg:-left-10 lg:w-[28%] animate-float-slow">
        <img
          src={mobile.url}
          alt="Interfaccia mobile Tretnix"
          className="w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
