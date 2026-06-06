"use client";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  projectId: string;
  price?: string;
  currency?: string;
}

/**
 * MarketplaceSEO
 *
 * In Next.js App Router, we use generateMetadata for tags.
 * This component now focuses strictly on providing Schema.org
 * JSON-LD structured data for institutional search engine indexing.
 */
export default function MarketplaceSEO({
  title,
  description,
  image,
  projectId,
  price,
  currency,
}: SEOProps) {
  const url = `https://crevy.io/marketplace/${projectId}`;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a valid use case for setting JSON-LD
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: title,
          image: [image],
          description: description,
          sku: projectId,
          brand: {
            "@type": "Brand",
            name: "Crevy",
          },
          offers: {
            "@type": "Offer",
            url: url,
            priceCurrency: currency || "USD",
            price: price || "0.00",
            availability: "https://schema.org/InStock",
          },
        }),
      }}
    />
  );
}
