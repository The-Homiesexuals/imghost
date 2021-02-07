from sentence_url import SentenceURL
from flask import Flask, redirect, url_for, render_template, request, session, flash
from flask_cors import CORS
import json
import database_queries
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
    img_link = s3bucket['location']
    img_name = request_data['img_name']
    img_tags = request_data['img_tags']
    pretty_url = generator.generate()
    #return((url, neat_url))
    database_queries.addNewImage(pretty_url, img_name, img_link)
    print(s3bucket, img_name, img_tags, pretty_url)
    json_dict = {
        "s3bucket": s3bucket,
        "img_name": img_name,
        "img_tags": img_tags,
        "pretty_url": pretty_url }

    return(json.dumps(json_dict))


@app.route("/image/<pretty_url>", methods=["GET", "DELETE"])
def fetchDelete(pretty_url):
    if request.method == "GET":
        request_data = request.get_json()
        find_image = request_data['pretty_url']
        image_found = database_queries.getImageURL(find_image)
        json_dict = {
            "img_url": image_found
        }
        return(json.dump(json_dict))
    else:
         request_data = request.get_json()
         find_image = request_data['pretty_url']
         image_found = database_queries.deleteImage(find_image)
         json_dict = {
             "img_url": image_found
         }
         return(json.dump(json_dict))

@app.route("/images", methods=["GET"])
def multiImage():
    images_found = database_queries.getAllImages(find_image)
    json_dict = {
        "img_urls": images_found
    }
    return(json.dump(json_dict))

@app.route("/random", methods=["GET"])
def randomImage():
    image_found = database_queries.getRandImage(find_image)
    json_dict = {
        "img_url": image_found
    }
    return(json.dump(json_dict))


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
