import sqlite3

# Sample data
images = [
    ("WalrusTomatoBaby", "Also cute doggo", "https://imghoststoragebucket.s3.ca-central-1.amazonaws.com/eric-welch-eRwWGWkh0vU-unsplash.jpg"),
    ("GoatBallFooter", "Cute Doggo", "https://images-ext-1.discordapp.net/external/YeYPrDAmgl3KMiv-OgyDbVsmo4ehvqiIeVQHpOBiRkw/https/imghoststoragebucket.s3.ca-central-1.amazonaws.com/IMG_20160520_164358.jpg?width=676&height=676")
]

tags = [
    ["Gaming"],
    ["Selfie"],
    ["Educational"],
    ["Philosophy"]
]

image_has_tags = [
    ("WalrusTomatoBaby", "Gaming"),
    ("WalrusTomatoBaby", "Selfie"),
    ("GoatBallFooter", "Educational"),
    ("GoatBallFooter", "Philosophy"),
    ("GoatBallFooter", "Selfie")
]

# Create connection to database
conn = sqlite3.connect("images.db")
# Create cursor
cursor = conn.cursor()

# Drop tables
cursor.execute("DROP TABLE IF EXISTS image;")
cursor.execute("DROP TABLE IF EXISTS tag;")
cursor.execute("DROP TABLE IF EXISTS image_has_tags;")

# Create image table
cursor.execute("""
CREATE TABLE image(
    imageID TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    S3_URL TEXT NOT NULL,
    uploadDate TEXT
);
""")
# Create tag table
cursor.execute("""
CREATE TABLE tag(
    tagName TEXT PRIMARY KEY NOT NULL
);
""")
# Create image_has_tags table
cursor.execute("""
CREATE TABLE image_has_tags(
    imageID TEXT NOT NULL,
    tagName TEXT NOT NULL,
    PRIMARY KEY (imageID,tagName)
);
""")

# Insert sample data
cursor.executemany("INSERT INTO image VALUES (?,?,?,datetime(CURRENT_TIMESTAMP, 'localtime'))", images)
cursor.executemany("INSERT INTO tag VALUES (?)", tags)
cursor.executemany("INSERT INTO image_has_tags VALUES (?,?)", image_has_tags)

conn.commit()
conn.close()
