// components/account/addresses-list.tsx
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AddressesList() {
  return (
    <div>
      <Button variant="outline" className="mb-4">
        <Plus className="ml-2 h-4 w-4" />
        إضافة عنوان جديد
      </Button>
      <div className="text-center py-8 text-muted-foreground">
        لا توجد عناوين محفوظة
      </div>
    </div>
  )
}