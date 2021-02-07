from database_queries import *
import json

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
addTagsToImage("HASD",["Gamer","Selfie","Educational","Balls"])
addTagsToImage("YamHairGenome",["Style"])

print(searchImagesByName("Jug"))

print(searchImagesByTag("Selfie"))

print(getAllImages())

print(getImageTags("HASD"))
removeTagsFromImage("HASD",["Selfie"])
print(getImageTags("HASD"))

print(getImageData("HASD"))

print(searchImagesByTags(['Gamer','Selfie']))

disconnectFromDatabase()