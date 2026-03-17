// components/layout/footer.tsx
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  products: [
    { label: "المنتجات الجديدة", href: "/products?sort=newest" },
    { label: "الأكثر مبيعاً", href: "/products?sort=bestsellers" },
    { label: "العروض الخاصة", href: "/offers" },
    { label: "القادم قريباً", href: "/coming-soon" },
  ],
  support: [
    { label: "مركز المساعدة", href: "/help" },
    { label: "شروط الاستخدام", href: "/terms" },
    { label: "سياسة الإرجاع", href: "/returns" },
    { label: "سياسة الخصوصية", href: "/privacy" },
  ],
  company: [
    { label: "من نحن", href: "/about" },
    { label: "تواصل معنا", href: "/contact" },
    { label: "الوظائف", href: "/careers" },
    { label: "المدونة", href: "/blog" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              متجري
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              وجهتك المثالية للتسوق الإلكتروني. نقدم منتجات عالية الجودة بأسعار 
              competitive مع خدمة توصيل سريعة ودعم ممتاز.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">المنتجات</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 mt-8 border-t">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-5 w-5 text-primary" />
            <span>+966 50 123 4567</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-5 w-5 text-primary" />
            <span>support@store.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-5 w-5 text-primary" />
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t text-sm text-muted-foreground">
          <p>© 2024 متجري. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-primary">الشروط</Link>
            <Link href="/privacy" className="hover:text-primary">الخصوصية</Link>
            <Link href="/cookies" className="hover:text-primary">الكوكيز</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}