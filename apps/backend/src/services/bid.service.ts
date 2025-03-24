// apps/backend/src/services/bid.service.ts
import {createSupabaseClient} from '../utils/createSupabaseClient';
interface BidQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  filters?: Record<string, string | undefined>;
}
interface token{
  token:string
}
export interface SubmittedBid {
  bid_id: string;
  bid_title: string;
  last_updated_date: string;
  action_available: boolean;
  tender_ref: string;
  user_id: string;
  user_name: string;
  submission_date: string;
  bid_status: string;
}

export interface BidSearchResult {
  bids: SubmittedBid[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getBidsForUser(
  access_token: token,
  userId: string,
  queryParams: BidQueryParams
): Promise<BidSearchResult> {
  const { page = 1, limit = 10, sort_by = 'last_updated_date', filters = {} } = queryParams;
  const offset = (page - 1) * limit;
  const supabase = createSupabaseClient(access_token.token);
  let dbQuery = supabase
    .from('submitted_bids')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .range(offset, offset + limit - 1);

  for (const key in filters) {
    if (filters[key]) {
      dbQuery = dbQuery.eq(key, filters[key]);
    }
  }

  const ascending = false;
  dbQuery = dbQuery.order(sort_by, { ascending });

  const { data, error, count } = await dbQuery;
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    bids: (data || []) as SubmittedBid[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

export async function getBidById(access_token: token,userId: string, bidId: string): Promise<SubmittedBid | null> {
  const supabase = createSupabaseClient(access_token.token);
  const { data, error } = await supabase
    .from('submitted_bids')
    .select('*')
    .eq('user_id', userId)
    .eq('bid_id', bidId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch bid: ${error.message}`);
  }

  return data as SubmittedBid;
}

export async function updateBidStatus(
  access_token: token,
  userId: string,
  bidId: string,
  newStatus: string
): Promise<SubmittedBid | null> {
  const supabase = createSupabaseClient(access_token.token);
  const { data, error } = await supabase
    .from('submitted_bids')
    .update({
      bid_status: newStatus,
      last_updated_date: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('bid_id', bidId)
    .single();

  if (error) {
    throw new Error(`Failed to update bid status: ${error.message}`);
  }

  return data as SubmittedBid;
}

