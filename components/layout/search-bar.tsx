"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"
import { getProducts } from "@/lib/strapi"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onResultClick?: () => void
}

interface StrapiProduct {
  id: number
  name?: string
  slug?: string
  price?: number
  image?: Array<{ url?: string; formats?: { thumbnail?: { url?: string } } }> | { url?: string; data?: { attributes?: { url?: string } } }
  images?: Array<{ url?: string }>
  category?: { name?: string; data?: { attributes?: { name?: string } } }
}

export function SearchBar({ 
  placeholder = "ابحث عن أحدث المنتجات...",
  className = "",
  onResultClick 
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<StrapiProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchResults = async (query: string) => {
    if (query.length < 2) { setResults([]); return }
    setIsLoading(true)
    try {
      const res = await getProducts({ filters: { name: { $contains: query } }, pageSize: 5 })
      setResults(res.data || [])
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((nextValue: string) => { fetchResults(nextValue) }, 500),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowResults(true)
    debouncedSearch(value)
  }

  const clearSearch = () => { setSearchTerm(""); setResults([]); setShowResults(false) }
  const handleResultClick = () => { setShowResults(false); onResultClick?.() }

  function getImageUrl(item: StrapiProduct): string {
    // Strapi v5: image مصفوفة
    if (Array.isArray(item.image)) {
      const img = item.image[0]
      const url = img?.url || img?.formats?.thumbnail?.url || ""
      if (url) return url.startsWith("http") ? url : `${baseUrl}${url}`
    }
    // Strapi v4
    if (item.image && !Array.isArray(item.image)) {
      const url = (item.image as { url?: string }).url || ""
      if (url) return url.startsWith("http") ? url : `${baseUrl}${url}`
    }
    return "/images/placeholder.jpg"
  }

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      <div className="relative w-full group">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pr-10 w-full rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all h-11"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>
        {searchTerm && (
          <button onClick={clearSearch} className="absolute left-3 top-1/2 -translate-y-1/2 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50" type="button">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-60 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="p-2">
              <p className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase tracking-widest text-right">
                نتائج البحث ({results.length})
              </p>
              <div className="max-h-75 overflow-y-auto">
                {results.map((product) => {
                  const item = (product as Record<string, unknown> & StrapiProduct)
                  const imgUrl = getImageUrl(item)
                  const categoryName = typeof item.category === 'object' && item.category !== null
                    ? (item.category as { name?: string }).name
                    : undefined

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${item.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl transition-colors group text-right"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image 
                          src={imgUrl}
                          alt={item.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-primary font-black mt-0.5">
                          {item.price?.toLocaleString()} دج
                        </p>
                        {categoryName && (
                          <p className="text-[10px] text-gray-400 truncate">{categoryName}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
              <Link
                href={`/products?search=${encodeURIComponent(searchTerm)}`}
                onClick={handleResultClick}
                className="block w-full p-3 text-center text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-gray-100 mt-2"
              >
                عرض جميع النتائج
              </Link>
            </div>
          ) : !isLoading ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                لا توجد نتائج لـ &ldquo;{searchTerm}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">جرب بحثاً بكلمات مختلفة</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}