import requests
import io
from PIL import Image
from google.cloud import vision

client = vision.ImageAnnotatorClient()

response = requests.get('https://imghoststoragebucket.s3.ca-central-1.amazonaws.com/download.jpg')
img = vision.Image(content=Image.open(io.BytesIO(response.content)))

response = client.label_detection(image=image)
labels = response.label_annotations

print('Labels:')
for label in labels:
    print(label.description)