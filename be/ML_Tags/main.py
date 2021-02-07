import requests
import io
from google.cloud import vision

client = vision.ImageAnnotatorClient.from_service_account_file('./vision_api_key.json')

def generateImageTags(URL):
    r = requests.get(URL, stream=True)

    image = vision.Image(content=r.raw.read())

    response = client.label_detection(image=image)
    labels = response.label_annotations

    return list(map(lambda x:x.description, labels))

if __name__ == "__main__":
    print(generateImageTags('https://imghoststoragebucket.s3.ca-central-1.amazonaws.com/download.jpg'))
    # Image is Master cheif helmet wallpaper
