CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  bookmark_url TEXT NOT NULL,
  bookmark_description TEXT,
  rating INTEGER DEFAULT 1 NOT NULL
);