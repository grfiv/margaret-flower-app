import { supabaseServer } from '@/lib/supabaseServer';
import type { FlowerRow } from '@/lib/types';
import { FlowerCard } from '@/components/flowers/flower-card';
import { MainPageWithSearch } from '@/components/search/main-page-with-search';

interface PageProps {
  searchParams?: Promise<{ 
    q?: string;
    cat_code?: string;
    height_code?: string;
    bloom_code?: string;
    moist_code?: string;
    sun_code?: string;
    wild_code?: string;
    soil_code?: string;
    deer_code?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const q = (resolvedSearchParams?.q ?? '').trim();
  
  // Extract filter parameters
  const filters = {
    cat_code: parseInt(resolvedSearchParams?.cat_code || '0'),
    height_code: parseInt(resolvedSearchParams?.height_code || '0'),
    bloom_code: parseInt(resolvedSearchParams?.bloom_code || '0'),
    moist_code: parseInt(resolvedSearchParams?.moist_code || '0'),
    sun_code: parseInt(resolvedSearchParams?.sun_code || '0'),
    wild_code: parseInt(resolvedSearchParams?.wild_code || '0'),
    soil_code: parseInt(resolvedSearchParams?.soil_code || '0'),
    deer_code: parseInt(resolvedSearchParams?.deer_code || '0'),
  };

  const supabase = await supabaseServer();

  // Helper function to expand compound search codes like your old SQLite app
  async function getExpandedCodes(tableName: string, codeField: string, searchField: string, selectedCode: number): Promise<number[]> {
    if (selectedCode === 0) return [];
    
    const { data } = await supabase
      .from(tableName)
      .select(`${codeField}, ${searchField}`)
      .eq(codeField, selectedCode)
      .single();
    
    if (!data || !data[searchField as keyof typeof data]) {
      // No compound search, just return the selected code
      return [selectedCode];
    }
    
    // Parse semicolon-separated search codes like "1;2;3"
    const searchValue = data[searchField as keyof typeof data] as string;
    return searchValue.split(';').map((code: string) => parseInt(code.trim())).filter((code: number) => !isNaN(code));
  }

  // Helper function to get all codes that match text search (including compound)
  async function getTextSearchCodes(tableName: string, codeField: string, displayField: string, searchField: string, searchTerm: string): Promise<number[]> {
    const { data } = await supabase
      .from(tableName)
      .select(`${codeField}, ${searchField}`)
      .ilike(displayField, `%${searchTerm}%`);
    
    if (!data || data.length === 0) return [];
    
    const allCodes = new Set<number>();
    
    for (const row of data) {
      const searchValue = row[searchField as keyof typeof row] as string;
      const codeValue = row[codeField as keyof typeof row] as number;
      
      if (searchValue && searchValue.trim()) {
        // Has compound search - expand it
        const expandedCodes = searchValue.split(';').map((code: string) => parseInt(code.trim())).filter((code: number) => !isNaN(code));
        expandedCodes.forEach((code: number) => allCodes.add(code));
      } else {
        // No compound search, just add the direct code
        allCodes.add(codeValue);
      }
    }
    
    return Array.from(allCodes);
  }


  let query = supabase
    .from('flowers')
    .select('*')
    .order('latin', { ascending: true });

  // Apply compound filter logic first (like your old app's dropdown selections)
  const [moistCodes, sunCodes, wildCodes, soilCodes, deerCodes] = await Promise.all([
    getExpandedCodes('moisture', 'moist_code', 'moist_search', filters.moist_code),
    getExpandedCodes('sun', 'sun_code', 'sun_search', filters.sun_code),
    getExpandedCodes('wildlife', 'wild_code', 'wildlife_search', filters.wild_code),
    getExpandedCodes('soil', 'soil_code', 'soil_search', filters.soil_code),
    getExpandedCodes('deer', 'deer_code', 'deer_search', filters.deer_code),
  ]);

  if (moistCodes.length > 0) {
    query = query.in('moist_code', moistCodes);
  }
  if (sunCodes.length > 0) {
    query = query.in('sun_code', sunCodes);
  }
  if (wildCodes.length > 0) {
    query = query.in('wild_code', wildCodes);
  }
  if (soilCodes.length > 0) {
    query = query.in('soil_code', soilCodes);
  }
  if (deerCodes.length > 0) {
    query = query.in('deer_code', deerCodes);
  }

  // Apply simple filters (no compound search needed)
  if (filters.cat_code > 0) {
    query = query.eq('cat_code', filters.cat_code);
  }
  if (filters.height_code > 0) {
    query = query.eq('height_code', filters.height_code);
  }
  if (filters.bloom_code > 0) {
    query = query.eq('bloom_code', filters.bloom_code);
  }

  // Apply text search with compound lookup matching
  if (q) {
    const [textMoistCodes, textSunCodes, textWildCodes, textSoilCodes, textDeerCodes, textBloomCodes, textHeightCodes, textCatCodes] = await Promise.all([
      getTextSearchCodes('moisture', 'moist_code', 'moist_display', 'moist_search', q),
      getTextSearchCodes('sun', 'sun_code', 'sun_display', 'sun_search', q),
      getTextSearchCodes('wildlife', 'wild_code', 'wildlife_display', 'wildlife_search', q),
      getTextSearchCodes('soil', 'soil_code', 'soil_display', 'soil_search', q),
      getTextSearchCodes('deer', 'deer_code', 'deer_display', 'deer_search', q),
      supabase.from('bloom').select('bloom_code').ilike('bloom_display', `%${q}%`).then(res => (res.data || []).map(b => b.bloom_code)),
      supabase.from('height').select('height_code').ilike('height_display', `%${q}%`).then(res => (res.data || []).map(h => h.height_code)),
      supabase.from('categories').select('cat_code').ilike('cat_display', `%${q}%`).then(res => (res.data || []).map(c => c.cat_code)),
    ]);

    // Create OR conditions for all search possibilities (like your old app)
    const conditions = [
      `latin.ilike.%${q}%`,
      `common.ilike.%${q}%`,
      `region.ilike.%${q}%`,
      `design_function.ilike.%${q}%`,
      `gardening_tips.ilike.%${q}%`,
      `wildlife_comments.ilike.%${q}%`,
      `ph.ilike.%${q}%`,
    ];

    // Add compound lookup matches
    if (textMoistCodes.length > 0) {
      conditions.push(`moist_code.in.(${textMoistCodes.join(',')})`);
    }
    if (textSunCodes.length > 0) {
      conditions.push(`sun_code.in.(${textSunCodes.join(',')})`);
    }
    if (textWildCodes.length > 0) {
      conditions.push(`wild_code.in.(${textWildCodes.join(',')})`);
    }
    if (textSoilCodes.length > 0) {
      conditions.push(`soil_code.in.(${textSoilCodes.join(',')})`);
    }
    if (textDeerCodes.length > 0) {
      conditions.push(`deer_code.in.(${textDeerCodes.join(',')})`);
    }
    if (textBloomCodes.length > 0) {
      conditions.push(`bloom_code.in.(${textBloomCodes.join(',')})`);
    }
    if (textHeightCodes.length > 0) {
      conditions.push(`height_code.in.(${textHeightCodes.join(',')})`);
    }
    if (textCatCodes.length > 0) {
      conditions.push(`cat_code.in.(${textCatCodes.join(',')})`);
    }

    query = query.or(conditions.join(','));
  }

  const result = await query;
  const flowersData = result.data;
  if (result.error) {
    console.error('flowers query error:', result.error);
    return (
      <MainPageWithSearch searchQuery={q}>
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          Failed to load flowers.
        </p>
      </MainPageWithSearch>
    );
  }

  // Fetch lookup data for display names
  const [heightLookups, categoryLookups] = await Promise.all([
    supabase.from('height').select('height_code, height_display'),
    supabase.from('categories').select('cat_code, cat_display'),
  ]);

  // Create lookup maps
  const heightMap = new Map(
    (heightLookups.data || []).map(h => [h.height_code, h.height_display])
  );
  const categoryMap = new Map(
    (categoryLookups.data || []).map(c => [c.cat_code, c.cat_display])
  );

  // Augment flowers with lookup data
  const flowers: FlowerRow[] = (flowersData || []).map(flower => ({
    ...flower,
    height: flower.height_code ? [{ height_display: heightMap.get(flower.height_code) || '' }] : null,
    categories: flower.cat_code ? [{ cat_display: categoryMap.get(flower.cat_code) || '' }] : null,
  }));

  // Use the augmented flowers data
  const imagesBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/flowers`;
  const iconsBase  = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icons`;

  return (
    <MainPageWithSearch searchQuery={q}>
      {flowers.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No flowers found.</p>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {flowers.map((f) => (
            <FlowerCard key={f.id} flower={f} imagesBase={imagesBase} iconsBase={iconsBase} />
          ))}
        </div>
      )}
    </MainPageWithSearch>
  );
}