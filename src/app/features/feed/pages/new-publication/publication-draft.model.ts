export interface PublicationDraft {
  title: string;
  content: string;
  attachments: File[];
  visibility: string;
  tags?: string[];
  location?: string;
}
