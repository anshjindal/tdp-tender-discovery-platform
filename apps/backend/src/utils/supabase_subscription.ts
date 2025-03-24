// apps/backend/src/subscriptions/initSupaBaseSubscription.ts
import { supabase } from '../utils/supabaseClient';
import { Server } from 'socket.io';
import { createSupabaseClient } from './createSupabaseClient';
interface token{
  token:string
}
export function initSupaBaseSubscription(acces_token: token,io: Server) {
  const supabase = createSupabaseClient(acces_token.token);
  // INSERT
  supabase
    .channel('submitted_bids_insert')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'submitted_bids' },
      (payload) => {
        console.log('INSERT on submitted_bids:', payload.new);
        
        io.emit('bidInserted', { bid: payload.new });
      }
    )
    .subscribe();

  // UPDATE
  supabase
    .channel('submitted_bids_update')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'submitted_bids' },
      (payload) => {
        console.log('UPDATE on submitted_bids:', payload.new);
        io.emit('bidUpdated', { bid: payload.new });
      }
    )
    .subscribe();

  // DELETE
  supabase
    .channel('submitted_bids_delete')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'submitted_bids' },
      (payload) => {
        console.log('DELETE on submitted_bids:', payload.old);
        io.emit('bidDeleted', { bid: payload.old });
      }
    )
    .subscribe();

  //  submitted_tenders subscriptions
  // INSERT
  supabase
    .channel('submitted_tenders_insert')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'submitted_tenders' },
      (payload) => {
        console.log('INSERT on submitted_tenders:', payload.new);
        io.emit('tenderInserted', { tender: payload.new });
      }
    )
    .subscribe();

  // UPDATE
  supabase
    .channel('submitted_tenders_update')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'submitted_tenders' },
      (payload) => {
        console.log('UPDATE on submitted_tenders:', payload.new);
        io.emit('tenderUpdated', { tender: payload.new });
      }
    )
    .subscribe();

  // DELETE
  supabase
    .channel('submitted_tenders_delete')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'submitted_tenders' },
      (payload) => {
        console.log('DELETE on submitted_tenders:', payload.old);
        io.emit('tenderDeleted', { tender: payload.old });
      }
    )
    .subscribe();
}

