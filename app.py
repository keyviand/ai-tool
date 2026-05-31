from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def score_candidate(resume_text, required_skills):
    resume_text = resume_text.lower()

    score = 0
    matched = []
    missing = []

    for skill in required_skills:
        skill = skill.strip().lower()

        if skill in resume_text:
            score += 1
            matched.append(skill)
        else:
            missing.append(skill)

    percentage = round((score / len(required_skills)) * 100, 2)

    return percentage, matched, missing


@app.route("/", methods=["GET", "POST"])
def home():
    candidates_ranked = []

    if request.method == "POST":
        job_title = request.form["job_title"]
        skills_input = request.form["skills"]
        required_skills = skills_input.split(",")

        names = request.form.getlist("candidate_name")
        resumes = request.form.getlist("resume")

        for i in range(len(names)):
            if not names[i].strip():
                continue

            score, matched, missing = score_candidate(
                resumes[i],
                required_skills
            )

            if score >= 75:
                status = "Strong Match"
            elif score >= 50:
                status = "Review"
            else:
                status = "Low Match"

            candidates_ranked.append({
                "name": names[i],
                "score": score,
                "matched": matched,
                "missing": missing,
                "status": status
            })

        candidates_ranked.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return render_template(
            "results.html",
            job_title=job_title,
            candidates=candidates_ranked
        )

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
