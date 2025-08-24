create schema if not exists app;
create table if not exists app.events(
  id bigserial primary key,
  title text not null,
  city text not null,
  venue_name text not null,
  start_time timestamptz not null,
  price_text text,
  category text
);
