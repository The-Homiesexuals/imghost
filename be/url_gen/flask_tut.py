from sentence_url import SentenceURL
from flask import Flask, redirect, url_for, render_template, request, session, flash
from flask_cors import CORS
import json
import database_queries
#from datetime import timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
#app.secret_key = "hello"
#app.permanent_session_lifetime = timedelta(minutes=5)
generator = SentenceURL(3, True, '')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/image", methods=["POST", "GET", "DELETE"])
def upload():
    request_data = request.get_json()
    s3bucket = request_data['s3bucket']
    img_link = s3bucket['location']
    img_name = request_data['img_name']
    img_tags = request_data['img_tags']
    neat_url = generator.generate()
    #return((url, neat_url))
    database_queries.addImage(img_link)
    print(s3bucket, img_name, img_tags, neat_url)
    return(json.dumps(s3bucket))

@app.route("/images", methods=["GET"])
def multiImage():
    return("Yo")

@app.route("/random", methods=["GET"])
def randomImage():
    return("Yoyo")
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
