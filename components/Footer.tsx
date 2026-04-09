import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050508] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Image src="/logo.svg" alt="Nebulorion Logo" width={180} height={45} className="mb-6 opacity-80" />
            <p className="text-foreground/60 leading-relaxed max-w-sm mb-6">
              Nebulorion Innovations Pvt. Ltd. is a product studio turning bold ideas into intelligent digital platforms — for real people, real problems.
            </p>
            <p className="text-foreground/40 text-sm">
              Innovation at cosmic scale, guided with precision.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">Platforms</h4>
            <ul className="flex flex-col gap-4 text-foreground/60">
              <li><Link href="#products" className="hover:text-primary transition-colors">BUSNEST</Link></li>
              <li><Link href="#products" className="hover:text-primary transition-colors">HYPERSPOT</Link></li>
              <li><Link href="#products" className="hover:text-primary transition-colors">VERIDROP</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">Company</h4>
            <ul className="flex flex-col gap-4 text-foreground/60">
              <li><Link href="#who-we-are" className="hover:text-primary transition-colors">Who We Are</Link></li>
              <li><Link href="#vision" className="hover:text-primary transition-colors">Our Vision</Link></li>
              <li><Link href="#team" className="hover:text-primary transition-colors">Team</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-foreground/40 text-sm">
          <p>© {new Date().getFullYear()} Nebulorion Innovations Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
