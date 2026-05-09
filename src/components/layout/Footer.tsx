import Image from "next/image";

export function Footer() {
  return (
    <footer className="h-15 w-full border-t border-white/8 bg-[#0A0A0A] py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
             <Image
                src="/OTKM_logo.svg"
                alt="OTKM"
                 width={18}
                 height={18}
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-white/30">
            OnchainTokenomist
          </span>
        </div>

        {/* Network */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15c6e6c0] animate-pulse" />
          <span className="text-xs font-mono text-white/20 uppercase tracking-widest">
            Nexus Testnet
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href={process.env.NEXT_PUBLIC_NEXUS_TESTNET_EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors duration-200"
          >
            Explorer
          </a>
          <span className="text-white/10">|</span>
          <span className="text-xs font-mono text-white/20 uppercase tracking-widest">
            v0.1.0
          </span>
        </div>
      </div>
    </footer>
  );
}