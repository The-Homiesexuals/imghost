import sqlite3

# Create connection to database
conn = sqlite3.connect("images.db")

# Create cursor
cursor = conn.cursor()

# Create images table
cursor.execute("""
CREATE TABLE images(
    imageID TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    S3_URL TEXT NOT NULL
);
""")