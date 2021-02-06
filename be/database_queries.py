
# List all images and their tags
# SELECT title,tagName FROM image JOIN image_has_tags WHERE image.imageID=image_has_tags.imageID;

# List all tags of an image "searchImageName"
# SELECT tagName FROM image_has_tags WHERE image_has_tags.imageID="searchImageName";

# List all imageIDs of images with tag "searchTagName"
# SELECT imageID FROM image_has_tags WHERE image_has_tags.tagName="searchTagName";

# List all image names of images with tag "searchTagName"
# SELECT title FROM image JOIN image_has_tags WHERE image_has_tags.imageID=image.imageID AND tagName="searchTagName";