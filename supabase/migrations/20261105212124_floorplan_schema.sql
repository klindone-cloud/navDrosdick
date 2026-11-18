create table public.buildings (
  id bigint generated always as identity primary key,
  name text not null,
  description text
);

create table public.floors (
  id bigint generated always as identity primary key,
  building_id bigint not null references public.buildings(id) on delete cascade,

  level integer not null,
  name text not null,
  image_url text not null,
  image_width integer not null default 1600,
  image_height integer not null default 1000,

  unique(building_id, level)
);

create table public.rooms (
    id bigint generated always as identity primary key,
    floor_id bigint not null references public.floors(id) on delete cascade,
    
    source_id text,
    name text not null,
    room_number text,
    category text not null,
    description text default '',
    polygon jsonb not null,
    search_keywords text[] not null default '{}',
    
    unique(floor_id, source_id)
);

create table public.route_nodes (
    id bigint generated always as identity primary key,
    floor_id bigint not null references public.floors(id) on delete cascade,

    name text,
    x numeric not null,
    y numeric not null,
    node_type text not null,
    accessible boolean not null default true
);

create table public.route_edges (
    id bigint generated always as identity primary key,
    
    from_node_id bigint not null references public.route_nodes(id) on delete cascade,
    to_node_id bigint not null references public.route_nodes(id) on delete cascade,

    distance numeric not null,
    accessible boolean not null default true,

    unique(from_node_id, to_node_id)
);

create index rooms_floor_id_index on public.rooms(floor_id);

create index rooms_name_index on public.rooms(name);

create index route_nodes_floor_id_index on public.route_nodes(floor_id);

alter table public.buildings enable row level security;

alter table public.floors enable row level security;

alter table public.rooms enable row level security;

alter table public.route_nodes enable row level security;

alter table public.route_edges enable row level security;

grant select on public.buildings to anon, authenticated;