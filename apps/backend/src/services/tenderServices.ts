import { supabase } from '../utils/supabaseClient';

// Type definitions
interface SearchQueryParams {
  query?: string | string[];
  category?: string | string[];
  location?: string | string[];
  status?: string | string[];
  deadline_from?: string | string[];
  deadline_to?: string | string[];
  sort_by?: string | string[];
  page?: string | string[];
  limit?: string | string[];
}

interface RawTenderData {
  'title-titre-eng': string;
  'referenceNumber-numeroReference': string;
  'tenderDescription-descriptionAppelOffres-eng': string;
  'tenderStatus-appelOffresStatut-eng': string;
  'tenderClosingDate-appelOffresDateCloture': string;
  'expectedContractStartDate-dateDebutContratPrevue': string;
  'expectedContractEndDate-dateFinContratPrevue': string;
  'procurementCategory-categorieApprovisionnement': string;
  'regionsOfDelivery-regionsLivraison-eng': string;
  'publicationDate-datePublication': string;
}

export interface TransformedTender {
  title: string;
  referenceNumber: string;
  description: string;
  status: string;
  closingDate: string;
  contractStartDate: string;
  contractEndDate: string;
  category: string;
  regions: string;
  publicationDate: string;
}

interface TenderSearchResult {
  tenders: TransformedTender[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function searchTendersService(queryParams: SearchQueryParams): Promise<TenderSearchResult> {
  // Parameter processing with type safety
  const getStringParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) return param[0];
    return param;
  };

  const query = getStringParam(queryParams.query);
  const category = getStringParam(queryParams.category);
  const location = getStringParam(queryParams.location);
  const status = getStringParam(queryParams.status);
  const deadline_from = getStringParam(queryParams.deadline_from);
  const deadline_to = getStringParam(queryParams.deadline_to);
  const sort_by = getStringParam(queryParams.sort_by) || 'newest';

  // Pagination with defaults
  const page = Math.max(1, Number(getStringParam(queryParams.page)) || 1);
  const limit = Math.max(1, Number(getStringParam(queryParams.limit))) || 10;
  const offset = (page - 1) * limit;

  let dbQuery = supabase
    .from('open_tender_notices')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);

  // Filter conditions
  if (query) dbQuery = dbQuery.ilike('title-titre-eng', `%${decodeURIComponent(query)}%`);
  if (category) dbQuery = dbQuery.eq('procurementCategory-categorieApprovisionnement', category);
  if (location) dbQuery = dbQuery.ilike('regionsOfDelivery-regionsLivraison-eng', `%${decodeURIComponent(location)}%`);
  if (status) dbQuery = dbQuery.eq('tenderStatus-appelOffresStatut-eng', status);
  if (deadline_from) dbQuery = dbQuery.gte('tenderClosingDate-appelOffresDateCloture', deadline_from);
  if (deadline_to) dbQuery = dbQuery.lte('tenderClosingDate-appelOffresDateCloture', deadline_to);

  // Sorting
  switch (sort_by) {
    case 'newest':
      dbQuery = dbQuery.order('publicationDate-datePublication', { ascending: false });
      break;
    case 'oldest':
      dbQuery = dbQuery.order('publicationDate-datePublication', { ascending: true });
      break;
    // Add more sorting options if needed
  }

  const { data, error, count } = await dbQuery;

  if (error) throw new Error(`Database error: ${error.message}`);

  // Data transformation
  const transformedTenders: TransformedTender[] = (data as RawTenderData[]).map(tender => ({
    title: tender['title-titre-eng'],
    referenceNumber: tender['referenceNumber-numeroReference'],
    description: tender['tenderDescription-descriptionAppelOffres-eng'],
    status: tender['tenderStatus-appelOffresStatut-eng'],
    closingDate: tender['tenderClosingDate-appelOffresDateCloture'],
    contractStartDate: tender['expectedContractStartDate-dateDebutContratPrevue'],
    contractEndDate: tender['expectedContractEndDate-dateFinContratPrevue'],
    category: tender['procurementCategory-categorieApprovisionnement'],
    regions: tender['regionsOfDelivery-regionsLivraison-eng'],
    publicationDate: tender['publicationDate-datePublication'],
  }));

  return {
    tenders: transformedTenders,
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  };
}