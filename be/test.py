from database_queries import *

connectToDatabase()

print(getImageURL("WalrusTomatoBaby"))
print(getImageURL("notExistantImage"))

print(getImageTags("WalrusTomatoBaby"))
print(getImageTags("notExistantImage"))

deleteImage("YamHairGenome")
deleteImage("HASD")
deleteImage("JugJugJug")

deleteImage("Harold")

addNewImage("YamHairGenome","default_043","long_link")
addNewImage("HASD","unknown","long_link")
addNewImage("JugJugJug","fsdf","long_link")

addTagsToImage("HASD",["Gamer"])
#addTagsToImage("dhgfhd",["Gamer","Selfie"])
addTagsToImage("HASD",["Gamer","Selfie"])
addTagsToImage("YamHairGenome",["Style"])

print(searchImagesByName("Jug"))

print(searchImagesByTag("Selfie"))

print(getAllImages())

disconnectFromDatabase()