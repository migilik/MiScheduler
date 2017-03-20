CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name VARCHAR(140) NOT NULL
);

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(256) NOT NULL,
  timezone VARCHAR(64) NOT NULL
);

CREATE TABLE candidate_datetimes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  datetime INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE invitations (
  user_id INTEGER NOT NULL,
  candidate_datetime_id INTEGER NOT NULL,
  status VARCHAR(8),
  PRIMARY KEY (user_id, candidate_datetime_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (candidate_datetime_id) REFERENCES candidate_datetimes(id),
);
