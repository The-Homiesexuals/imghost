import sqlite3

# Sample data
images = [
    ("WalrusTomatoBaby", "gamer pic", "https://www.google.com/search?q=gamer+pic&rlz=1C1CHBF_enCA837CA839&sxsrf=ALeKk000C8TOOoCam3ZgIGtF4ifgGCzjvg:1612583280016&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjvtc3srNTuAhXFZs0KHbzRDL4Q_AUoAXoECBUQAw&biw=1857&bih=977#imgrc=H4H8t7TbOZhvdM"),
    ("GoatBallFooter", "PHIL 1001 Notes Diagram A", "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcarleton.ca%2Fphilosophy%2Fpeople%2Fphilippe-antoine-hoyeck%2F&psig=AOvVaw2KAZSF2W2fvceDXa0C2OBR&ust=1612670298516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIj_oJSv1O4CFQAAAAAdAAAAABAf")
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
    S3_URL TEXT NOT NULL
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
cursor.executemany("INSERT INTO image VALUES (?,?,?)", images)
cursor.executemany("INSERT INTO tag VALUES (?)", tags)
cursor.executemany("INSERT INTO image_has_tags VALUES (?,?)", image_has_tags)

conn.commit()
conn.close()
