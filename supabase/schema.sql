create table if not exists catalog_items (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null default 'Bakery',
  image text not null default '',
  price text not null default '',
  note text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_typically_available boolean not null default true,
  show_price boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists catalog_categories (
  name text primary key,
  sort_order integer not null default 0
);

create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id text primary key,
  quote text not null,
  name text not null,
  source text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_items_public_idx
  on catalog_items (is_active, is_featured, sort_order, name);

create index if not exists testimonials_public_idx
  on testimonials (is_active, sort_order, name);

alter table catalog_items enable row level security;
alter table catalog_categories enable row level security;
alter table site_content enable row level security;
alter table testimonials enable row level security;
