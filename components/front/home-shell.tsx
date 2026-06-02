"use client";

import { useState } from "react";
import type { Locale } from "@/lib/db/schema";
import { HomeClient } from "./home-client";
import { SearchHeader } from "./search-header";
import type { CategoryFilterView, ProductCardView } from "./types";

export function HomeShell({
  locale,
  products,
  categories,
  contactEmail
}: {
  locale: Locale;
  products: ProductCardView[];
  categories: CategoryFilterView[];
  contactEmail: string;
}) {
  const [query, setQuery] = useState("");
  return (
    <>
      <SearchHeader locale={locale} query={query} setQuery={setQuery} />
      <HomeClient
        locale={locale}
        products={products}
        categories={categories}
        query={query}
        setQuery={setQuery}
        contactEmail={contactEmail}
      />
    </>
  );
}
