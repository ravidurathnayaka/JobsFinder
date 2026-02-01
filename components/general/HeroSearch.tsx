"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { countryList } from "@/app/utils/countriesList";

export function HeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || "worldwide"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location && location !== "worldwide") params.set("location", location);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <section className="rounded-lg pt-4 pb-5  sm:pt-5 sm:pb-5  md:py-5 mb-6">
      <div className="max-w-7xl mx-auto text-left">
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl mb-2 text-foreground">
          Find your dream job or let companies find you
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          Search by job title or keywords, anywhere in the world.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 w-full sm:items-stretch"
        >
          <Input
            type="text"
            placeholder="Job title or keywords"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 flex-1 h-[40px] min-h-[40px] text-sm py-2 box-border"
          />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full sm:w-[160px] h-[40px] min-h-[40px] shrink-0 py-2 box-border">
              <SelectValue placeholder="Anywhere" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worldwide">Anywhere</SelectItem>
              {countryList.slice(0, 50).map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.flagEmoji} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            size="sm"
            className="w-full sm:w-auto h-[40px] min-h-[40px] px-5 shrink-0 box-border"
          >
            <Search className="w-4 h-4 mr-1.5 shrink-0" />
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
