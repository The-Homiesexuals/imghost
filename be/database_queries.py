
# List all images and their tags
# SELECT title,tagName FROM image JOIN image_has_tags WHERE image.imageID=image_has_tags.imageID;

# List all tags of an image "searchImageName"
# SELECT tagName FROM image_has_tags WHERE image_has_tags.imageID="searchImageName";

# List all imageIDs of images with tag "searchTagName"
# SELECT imageID FROM image_has_tags WHERE image_has_tags.tagName="searchTagName";

# List all image names of images with tag "searchTagName"
# SELECT title FROM image JOIN image_has_tags WHERE image_has_tags.imageID=image.imageID AND tagName="searchTagName";

import sqlite3

global conn
global cursor

# Connection funcitons
def connectToDatabase():
    global conn
    global cursor
    conn = sqlite3.connect("images.db")
    cursor = conn.cursor()

def disconnectFromDatabase():
    global conn
    conn.close()

# GET/QUERYS
def getImageURL(imageID):
    global cursor
    cursor.execute("SELECT S3_URL FROM image WHERE imageID=\""+imageID+"\"")
    result = cursor.fetchone()
    if result == None:
        return None
    return result[0]

def getImageTags(imageID):
    global cursor
    cursor.execute("SELECT tagName FROM image_has_tags WHERE image_has_tags.imageID=\""+imageID+"\"")
    result = cursor.fetchall()
    return result

def searchImagesByName(name, maxResults=-1):
    global cursor
    cursor.execute("SELECT imageID FROM image WHERE title LIKE \"%"+name+"%\"")
    if maxResults == -1:
        return cursor.fetchall()
    return cursor.fetchmany(maxResults)

def searchImagesByTag(tag, maxResults=-1):
    global cursor
    cursor.execute("SELECT imageID FROM image_has_tags WHERE tagName=\""+tag+"\"")
    if maxResults == -1:
        return cursor.fetchall()
    return cursor.fetchmany(maxResults)

# POST/INSERTING
def addNewImage(imageID,title,URL):
    if imageID == None or title == None or URL == None:
        return False
    elif getImageURL(imageID) != None:
        raise Exception("Image " + imageID + " already exists")
    global conn
    global cursor
    cursor.execute("INSERT INTO image VALUES (?,?,?)", (imageID,title,URL))
    conn.commit()
    return True

def addTagsToImage(imageID,tags):
    if getImageURL(imageID) == None:
        raise Exception("Image " + imageID + " does not exist")
    elif len(tags) == 0:
        return False
    global conn
    global cursor
    for tag in tags:
        cursor.execute("REPLACE INTO tag VALUES (\""+tag+"\")")
    conn.commit()
    for tag in tags:
        cursor.execute("REPLACE INTO image_has_tags VALUES (\""+imageID+"\",\""+tag+"\")")
    conn.commit()
    return True

# DELETING
def deleteImage(imageID):
    if getImageURL(imageID) == None:
        return False
    global conn
    global cursor
    cursor.execute("DELETE FROM image WHERE imageID=\""+imageID+"\"")
    cursor.execute("DELETE FROM image_has_tags WHERE imageID=\""+imageID+"\"")
    conn.commit()
    return True
