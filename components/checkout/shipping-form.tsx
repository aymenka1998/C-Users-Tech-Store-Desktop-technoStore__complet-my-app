import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ShippingForm() {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">الاسم الأخير</Label>
          <Input id="lastName" name="lastName" placeholder="اللقب" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" name="firstName" placeholder="الاسم" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">العنوان بالتفصيل</Label>
        <Input id="address" name="address" placeholder="اسم الشارع، رقم البناية، الشقة" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input id="phone" name="phone" type="tel" placeholder="05XXXXXXXX" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">المدينة</Label>
          <Input id="city" name="city" placeholder="الجزائر، وهران، إلخ" required />
        </div>
      </div>
    </div>
  )
}