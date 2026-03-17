// components/search/mobile-search.tsx
"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchBar } from "./search-bar"

export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full h-auto pt-12">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-right">البحث عن المنتجات</SheetTitle>
        </SheetHeader>
        <SearchBar 
          placeholder="اكتب اسم المنتج..."
          onResultClick={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}