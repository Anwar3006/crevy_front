"use client";

import Head from "next/head";

interface MarketplaceSEOProps {
  title: string;
  description: string;
  image: string;
  projectId: string;
  price: string;
}

export default function MarketplaceSEO({
  title,
  description,
  image,
  projectId,
  price,
}: MarketplaceSEOProps) {
  const fullTitle = `${title} — Crevy Carbon Marketplace`;
  const url = `https://crevy.app/marketplace/detail?id=${projectId}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Crevy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product schema */}
      <meta property="product:price:amount" content={price} />
      <meta property="product:price:currency" content="USD" />

      <link rel="canonical" href={url} />
    </Head>
  );
}
