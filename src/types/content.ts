export type ContentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ContentPiece {
  id: string;
  title: string;
  video_url: string;
  status: ContentStatus;
  feedback: string | null;
  created_at: string;
}
