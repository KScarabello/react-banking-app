CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(180),
    email varchar(180),
    img TEXT,
    auth_id TEXT
)