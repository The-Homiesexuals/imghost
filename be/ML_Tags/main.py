import requests
from PIL import Image
from google.cloud import vision

client = vision.ImageAnnotatorClient()

r = requests.get('https://discord.com/channels/807390623996837939/807390714718584832/807728781653180467', stream=True)

image = vision.Image(content=Image.open(r.raw))
r.close()

response = client.label_detection(image=image)
labels = response.label_annotations

print('Labels:')
for label in labels:
    print(label.description)
