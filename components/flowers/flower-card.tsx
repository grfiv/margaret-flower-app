'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import type { FlowerRow } from '@/lib/types';

interface Props {
  flower: FlowerRow;
  /** e.g. `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flowers` */
  imagesBase: string;
  /** e.g. `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icons` */
  iconsBase?: string;
}

interface LookupRow {
  bloom_display?: string | null; bloom_icon?: string | null;
  sun_display?: string | null;   sun_icon?: string | null;
  moist_display?: string | null; moist_icon?: string | null;
  cat_display?: string | null;   cat_icon?: string | null;
  deer_display?: string | null;  deer_icon?: string | null;
  wildlife_display?: string | null; wildlife_icon?: string | null;
  soil_display?: string | null;  soil_icon?: string | null;
  height_display?: string | null; height_icon?: string | null;
  credit_display?: string | null;
}

interface FlowerDetail extends Omit<FlowerRow, 'wildlife_comments' | 'design_function' | 'gardening_tips'> {
  wildlife_comments?: string | null;
  design_function?: string | null;
  gardening_tips?: string | null;
  lookups?: {
    height?: LookupRow | null;
    bloom?: LookupRow[];
    sun?: LookupRow[];
    moisture?: LookupRow[];
    category?: LookupRow[];
    deer?: LookupRow[];
    wildlife?: LookupRow[];
    soil?: LookupRow[];
    credit?: LookupRow | null;
  };
}

export function FlowerCard({ flower, imagesBase, iconsBase }: Props) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<FlowerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const imageUrl = flower.image_name ? `${imagesBase}/${flower.image_name}` : null;

  // Fetch full detail lazily when opening
  useEffect(() => {
    if (!open) return;
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setLoadErr(null);
        const res = await fetch(`/api/flowers/${flower.id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as FlowerDetail;
        if (!aborted) setDetail(data);
      } catch (e) {
        if (!aborted) setLoadErr('Failed to load details.');
        console.error('Flower detail fetch failed', e);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [open, flower.id]);

  const IconLabel = ({ icon, label }: { icon?: string | null; label?: string | null }) => {
    if (!label) return null;
    const url = icon && iconsBase ? `${iconsBase}/${icon}` : null;
    return (
      <div className="flex items-center gap-2">
        {url ? <Image src={url} alt={label} width={24} height={24} className="h-6 w-6" /> : null}
        <span className="text-sm">{label}</span>
      </div>
    );
  };

  const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => {
    if (!children) return null;
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {children}
      </section>
    );
  };

  return (
    <>
      {/* Grid Card */}
      <button
        onClick={() => setOpen(true)}
        className="text-left rounded-xl border bg-white p-3 shadow-sm transition hover:shadow dark:bg-zinc-900"
        aria-label={`Open ${flower.common || flower.latin} details`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={flower.common || flower.latin}
            width={300}
            height={160}
            className="h-40 w-full rounded-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Ws5RV02D//9k="
          />
        ) : (
          <div className="grid h-40 w-full place-items-center rounded-md bg-gray-100 text-sm text-gray-500">
            No image
          </div>
        )}
        <h3 className="mt-2 font-semibold">{flower.common || flower.latin}</h3>
        {flower.common ? (
          <p className="text-sm italic text-gray-600">{flower.latin}</p>
        ) : null}
        <p className="mt-1 text-xs text-gray-500">
          ID: {flower.id}
          {flower.height?.[0]?.height_display ? <> · {flower.height[0].height_display}</> : null}
          {flower.categories?.[0]?.cat_display ? <> · {flower.categories[0].cat_display}</> : null}
        </p>
      </button>

      {/* Modal (scroll-safe) */}
      <Modal open={open} onClose={() => setOpen(false)} title={flower.common || flower.latin}>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {loadErr && <p className="text-sm text-red-600">{loadErr}</p>}

        {!loading && !loadErr && (
          <div className="space-y-5">
            {/* Image constrained to viewport height */}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={flower.common || flower.latin}
                width={600}
                height={400}
                className="w-full max-h-[45vh] rounded-md object-contain"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Ws5RV02D//9k="
              />
            ) : null}

            {/* Latin name under title */}
            {flower.latin && flower.common ? (
              <p className="text-sm italic text-gray-600">{flower.latin}</p>
            ) : null}

            {/* Attributes with icons */}
            <Section title="Attributes">
              <div className="grid gap-3 sm:grid-cols-2">
                {detail?.lookups?.height && (
                  <IconLabel
                    icon={detail.lookups.height.height_icon}
                    label={detail.lookups.height.height_display}
                  />
                )}
                {detail?.lookups?.bloom?.map((x, i) => (
                  <IconLabel key={`b-${i}`} icon={x.bloom_icon} label={x.bloom_display} />
                ))}
                {detail?.lookups?.sun?.map((x, i) => (
                  <IconLabel key={`s-${i}`} icon={x.sun_icon} label={x.sun_display} />
                ))}
                {detail?.lookups?.moisture?.map((x, i) => (
                  <IconLabel key={`m-${i}`} icon={x.moist_icon} label={x.moist_display} />
                ))}
                {detail?.lookups?.category?.map((x, i) => (
                  <IconLabel key={`c-${i}`} icon={x.cat_icon} label={x.cat_display} />
                ))}
                {detail?.lookups?.deer?.map((x, i) => (
                  <IconLabel key={`d-${i}`} icon={x.deer_icon} label={x.deer_display} />
                ))}
                {detail?.lookups?.soil?.map((x, i) => (
                  <IconLabel key={`so-${i}`} icon={x.soil_icon} label={x.soil_display} />
                ))}
              </div>
            </Section>

            {/* Wildlife */}
            {Array.isArray(detail?.lookups?.wildlife) && detail.lookups!.wildlife.length > 0 && (
              <Section title="Wildlife">
                <div className="flex flex-wrap gap-3">
                  {detail.lookups!.wildlife.map((w, i) => (
                    <IconLabel key={`w-${i}`} icon={w.wildlife_icon} label={w.wildlife_display} />
                  ))}
                </div>
              </Section>
            )}

            {/* Long-form sections */}
            {detail?.wildlife_comments && (
              <Section title="Wildlife Notes">
                <p className="text-sm leading-relaxed">{detail.wildlife_comments}</p>
              </Section>
            )}
            {detail?.design_function && (
              <Section title="Design Function">
                <p className="text-sm leading-relaxed">{detail.design_function}</p>
              </Section>
            )}
            {detail?.gardening_tips && (
              <Section title="Gardening Tips">
                <p className="text-sm leading-relaxed">{detail.gardening_tips}</p>
              </Section>
            )}

            {/* Region / pH */}
            {(detail?.region || detail?.ph) && (
              <Section title="Region & Soil pH">
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  {detail?.region && <p><span className="font-medium">Region:</span> {detail.region}</p>}
                  {detail?.ph && <p><span className="font-medium">pH:</span> {detail.ph}</p>}
                </div>
              </Section>
            )}

            {/* Photo credit */}
            {detail?.lookups?.credit && (
              <p className="text-xs text-gray-500">
                Photo credit: {detail.lookups.credit?.credit_display ?? ''}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}