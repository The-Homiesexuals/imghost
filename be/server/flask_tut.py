from sentence_url import SentenceURL
from flask import Flask, redirect, url_for, render_template, request, session, flash, Response
from flask_cors import CORS
import json
import database_queries
import ML_Tags
#from datetime import timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
database_queries.connectToDatabase()
#app.secret_key = "hello"
#app.permanent_session_lifetime = timedelta(minutes=5)
generator = SentenceURL(3, True, '')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/image", methods=["POST"])
def upload():
    request_data = request.get_json()
    s3bucket = request_data['s3bucket']
    S3_URL = s3bucket['location']
    title = request_data['img_name']
    tags = request_data['img_tags']
    imageId = generator.generate()
    #return((url, neat_url))
    database_queries.addNewImage(imageId, title, S3_URL)
    database_queries.addTagsToImage(imageId, tags.split(',') + ML_Tags.generateImageTags(S3_URL))
    #print(s3bucket, title, tags, imageId)
    json_dict = {
        "s3bucket": s3bucket,
        "title": title,
        "tags": tags,
        "imageId": imageId }

    return(json.dumps(json_dict))


@app.route("/image/<imageId>", methods=["GET", "DELETE"])
def fetchDelete(imageId):
    if request.method == "GET":
        #print("Here is thingy ->", imageId)
        image_found = database_queries.getImageData(imageId)
        #print(image_found)

        json_dict = {
            "S3_URL": image_found[0],
            "title": image_found[1],
            "date": image_found[2],
            "tags": image_found[3]
        }
        return(json.dumps(json_dict))
    else:
         database_queries.deleteImage(imageId)
         return Response("{'a':'b'}", status=202, mimetype='application/json')

@app.route("/images/", methods=["GET"])
def multiImage():
    images_found = database_queries.getAllImages()
    #print(images_found)
    json_list = []
    for i in images_found:
        image_found = database_queries.getImageData(i[0])
        json_dict1 = {
            "S3_URL": image_found[0],
            "title": image_found[1],
            "date": image_found[2],
            "tags": image_found[3],
            "imageId": i[0]
        }
        json_list.append(json_dict1)

    json_dict2 = {
        "images": json_list
    }
    #print(json_dict2)
    return(json.dumps(json_dict2))

@app.route("/random", methods=["GET"])
def randomImage():
    image_found = database_queries.getRandomImage()
    json_dict = {
        "img_url": image_found
    }
    return(json.dumps(json_dict))

"""
@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        user = request.form["nm"]
        session["user"] = user
        flash("Login Succesful!")
        return redirect(url_for("user"))
    else:
        if "user" in session:
            flash("Already Logged In!")
            return redirect(url_for("user"))
        return render_template("login.html")

@app.route("/user")
def user():
    if "user" in session:
        user = session["user"]
        return f"<h1>{user}</h1>"
    else:
        return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

"""

if __name__ == "__main__":
    app.run(debug=True)
