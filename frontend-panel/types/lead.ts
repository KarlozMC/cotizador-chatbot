export interface Lead {
  id: string;
  customer_name: string | null;
  event_type: string | null;
  event_date: string | null;
  event_zone: string | null;
  event_place: string | null;
  decoration_type: string | null;
  decoration_size: string | null;
  theme_or_colors: string | null;
  budget: number | null;
  quote_category: string | null;
  requires_transport: boolean | null;
  is_urgent: boolean;
  days_until_event: number | null;
  status: string;
  internal_summary: string | null;
  created_at: string;
}