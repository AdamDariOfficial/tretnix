import macbook from "@/assets/macbook-mockup.png.asset.json";
import mobile from "@/assets/mobile-mockup.png.asset.json";

/**
 * Hero device mockups. Real desktop + phone PNGs on transparent backgrounds,
 * optically composed with a blue glow.
 */
export function HeroMockup() {
  return (
    <div className="relative w-full">
      {/* Blue radial glow behind the devices */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[95%] w-[105%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(11,99,255,0.38),transparent_62%)] blur-3xl animate-pulse-glow" />
      </div>

      {/* Laptop */}
      <div className="relative px-[6%]">
        <img
          src={macbook.url}
          alt="Dashboard Tretnix su laptop"
          className="w-full object-contain drop-shadow-[0_50px_60px_rgba(0,0,0,0.55)]"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Phone — overlaps foreground bottom-left */}
      <div className="pointer-events-none absolute bottom-[-4%] left-[-2%] w-[26%] max-w-[210px] sm:w-[24%] lg:w-[22%] animate-float-slow">
        <img
          src={mobile.url}
          alt="Interfaccia mobile Tretnix"
          className="w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
