import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// Helper function to simplify moisture options for better UX
function getSimplifiedMoistureOptions(_moistureData: unknown[]) {
  // Simplify from 6 options to 3 most useful ones
  const simplifiedOptions = [
    { code: 1, display: "Dry" }, // Will match dry, dry or moist, dry or moist or wet via compound search
    { code: 4, display: "Moist" }, // Will match moist, moist or wet via compound search  
    { code: 6, display: "Wet" }, // Will match wet conditions
  ];
  
  return simplifiedOptions;
}

// Helper function to simplify sun options for better UX
function getSimplifiedSunOptions(_sunData: unknown[]) {
  // Simplify from 6 options to 3 most useful ones
  const simplifiedOptions = [
    { code: 1, display: "Full Sun" }, // Will match full sun, full or part sun, any via compound search
    { code: 4, display: "Part Sun" }, // Will match part sun, part sun or shade via compound search
    { code: 6, display: "Shade" }, // Will match shade conditions
  ];
  
  return simplifiedOptions;
}

// Helper function to simplify soil options for better UX
function getSimplifiedSoilOptions(_soilData: unknown[]) {
  // Simplify from 7 options to 3 main soil types
  const simplifiedOptions = [
    { code: 2, display: "Clay" }, // Will match clay, clay or loam, clay or loam or sandy via compound search
    { code: 3, display: "Loam" }, // Will match loam, clay or loam, loam or sandy via compound search
    { code: 4, display: "Sandy" }, // Will match sandy, loam or sandy via compound search
  ];
  
  return simplifiedOptions;
}

// Helper function to simplify wildlife options for better UX
function getSimplifiedWildlifeOptions(_wildlifeData: unknown[]) {
  // Define simplified categories with the codes that should map to them
  const simplifiedOptions = [
    { code: 1, display: "Birds" }, // Maps to "Attracts birds."
    { code: 2, display: "Hummingbirds" }, // Maps to "Attracts hummingbirds."
    { code: 3, display: "Bees" }, // Maps to "Feeds the bees."
    { code: 4, display: "Butterflies & Moths" }, // Maps to "Feeds adult butterflies or moths."
    { code: 5, display: "Butterfly/Moth Larvae" }, // Maps to "Larval host plant."
    { code: 25, display: "Multiple Wildlife" }, // Maps to complex combo "Birds. Hummingbirds. Bees. Adult butterflies or moths."
  ];
  
  return simplifiedOptions;
}

export async function GET() {
  try {
    const supabase = await supabaseServer();

    // Fetch all lookup tables in parallel
    const [
      categoriesRes,
      heightRes,
      bloomRes,
      moistureRes,
      sunRes,
      wildlifeRes,
      soilRes,
      deerRes,
    ] = await Promise.all([
      supabase.from('categories').select('cat_code, cat_display').order('cat_display'),
      supabase.from('height').select('height_code, height_display').order('height_code'),
      supabase.from('bloom').select('bloom_code, bloom_display').order('bloom_display'),
      supabase.from('moisture').select('moist_code, moist_display').order('moist_display'),
      supabase.from('sun').select('sun_code, sun_display').order('sun_display'),
      supabase.from('wildlife').select('wild_code, wildlife_display').order('wildlife_display'),
      supabase.from('soil').select('soil_code, soil_display').order('soil_display'),
      supabase.from('deer').select('deer_code, deer_display').order('deer_display'),
    ]);

    // Check for errors
    const errors = [
      categoriesRes.error,
      heightRes.error,
      bloomRes.error,
      moistureRes.error,
      sunRes.error,
      wildlifeRes.error,
      soilRes.error,
      deerRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('Lookup options fetch errors:', errors);
      return NextResponse.json({ error: 'Failed to fetch lookup options' }, { status: 500 });
    }

    return NextResponse.json({
      categories: (categoriesRes.data || []).map(item => ({ code: item.cat_code, display: item.cat_display })),
      height: (heightRes.data || []).map(item => ({ code: item.height_code, display: item.height_display })),
      bloom: (bloomRes.data || []).map(item => ({ code: item.bloom_code, display: item.bloom_display })),
      moisture: getSimplifiedMoistureOptions(moistureRes.data || []),
      sun: getSimplifiedSunOptions(sunRes.data || []),
      wildlife: getSimplifiedWildlifeOptions(wildlifeRes.data || []),
      soil: getSimplifiedSoilOptions(soilRes.data || []),
      deer: (deerRes.data || []).map(item => ({ code: item.deer_code, display: item.deer_display })),
    });

  } catch (error) {
    console.error('Lookup options API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
