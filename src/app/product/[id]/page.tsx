import React, { JSX } from 'react';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params; // ждём, пока Next.js подставит { id }

  return <p>product {id}</p>;
}
