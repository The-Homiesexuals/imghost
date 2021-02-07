import sqlite3

global conn
global cursor

# Connection funcitons
def connectToDatabase():
    global conn
    global cursor
    conn = sqlite3.connect("images.db", check_same_thread=False)
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

def getAllImages():
    global cursor
    cursor.execute("SELECT imageID FROM image")
    result = cursor.fetchall()
    return result

def getRandomImage():
    global cursor
    cursor.execute("SELECT imageID FROM image ORDER BY RANDOM() LIMIT 1")
    result = cursor.fetchone()
    return result[0]

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

# DELETING/REMOVING
def deleteImage(imageID):
    if getImageURL(imageID) == None:
        return False
    global conn
    global cursor
    cursor.execute("DELETE FROM image WHERE imageID=\""+imageID+"\"")
    cursor.execute("DELETE FROM image_has_tags WHERE imageID=\""+imageID+"\"")
    conn.commit()
    return True

def removeTagsFromImage(imageID, tags):
    if getImageURL(imageID) == None:
        raise Exception("Image " + imageID + " does not exist")
    if len(tags) == 0:
        return False
    global conn
    global cursor
    for tag in tags:
        cursor.execute("DELETE FROM image_has_tags WHERE imageID=\""+imageID+"\" AND tagName=\""+tag+"\"")
    conn.commit()
    return True