export type ShelfStatus = 'want_to_read' | 'reading' | 'read';
export type ReviewStatus = 'draft' | 'pending' | 'published' | 'hidden' | 'rejected';

export class RatingService {
  private values = new Map<string, number>();
  upsert(userId: string, workId: string, value: number) { if (value < 1 || value > 5) throw new Error('rating must be 1–5'); this.values.set(`${userId}:${workId}`, value); const ratings = [...this.values.entries()].filter(([key]) => key.endsWith(`:${workId}`)).map(([, v]) => v); return { count: ratings.length, average: ratings.reduce((a,b) => a+b, 0) / ratings.length }; }
}
export class BookshelfService {
  private items = new Map<string, {status:ShelfStatus; progress?:number}>();
  save(userId:string, workId:string, status:ShelfStatus, progress?:number) { const item={status, progress: status === 'reading' && progress !== undefined ? Math.max(0, Math.min(100, progress)) : undefined}; this.items.set(`${userId}:${workId}`, item); return item; }
  get(userId:string, workId:string) { return this.items.get(`${userId}:${workId}`); }
}
type Review = {id:string;userId:string;workId:string;title:string;body:string;status:ReviewStatus; spoiler?:string};
type Audit = {reviewId:string; actor:string; from:ReviewStatus; to:ReviewStatus; note:string; at:string};
export class ReviewService {
  private reviews = new Map<string, Review>(); private actions: Audit[]=[];
  submit(input: Omit<Review,'id'|'status'>) { const existing=[...this.reviews.values()].find(r=>r.userId===input.userId&&r.workId===input.workId); if(existing) return this.edit(input.userId, existing.id, input); const review={...input,id:`review-${this.reviews.size+1}`,status:'pending' as ReviewStatus}; this.reviews.set(review.id,review); return review; }
  edit(userId:string,id:string, input:Partial<Pick<Review,'title'|'body'|'spoiler'>>) { const review=this.reviews.get(id); if(!review) throw new Error('not found'); if(review.userId!==userId) throw new Error('only owner may edit'); Object.assign(review,input); review.status='pending'; return review; }
  moderate(actor:string,id:string,to:Extract<ReviewStatus,'published'|'hidden'|'rejected'>,note:string) { if(actor!=='moderator'&&actor!=='admin') throw new Error('moderator role required'); const r=this.reviews.get(id); if(!r) throw new Error('not found'); this.actions.push({reviewId:id,actor,from:r.status,to,note,at:new Date().toISOString()}); r.status=to; return r; }
  audit(){return this.actions;}
}
