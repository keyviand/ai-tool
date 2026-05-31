function addCandidate() {
    const candidateList = document.getElementById("candidateList");

    const box = document.createElement("div");
    box.className = "candidate-box";

    box.innerHTML = `
        <label>Candidate Name</label>
        <input type="text" class="candidate-name" placeholder="Candidate Name">

        <label>Resume Text</label>
        <textarea class="candidate-resume" rows="6" placeholder="Paste resume text here"></textarea>
    `;

    candidateList.appendChild(box);
}

function scoreCandidate(resumeText, requiredSkills) {
    const resume = resumeText.toLowerCase();

    let matched = [];
    let missing = [];

    requiredSkills.forEach(skill => {
        const cleanSkill = skill.trim().toLowerCase();

        if (cleanSkill.length === 0) {
            return;
        }

        if (resume.includes(cleanSkill)) {
            matched.push(cleanSkill);
        } else {
            missing.push(cleanSkill);
        }
    });

    const totalSkills = matched.length + missing.length;
    const score = totalSkills === 0 ? 0 : Math.round((matched.length / totalSkills) * 100);

    return {
        score: score,
        matched: matched,
        missing: missing
    };
}

function getStatus(score) {
    if (score >= 75) {
        return {
            text: "Strong Match",
            className: "strong"
        };
    }

    if (score >= 50) {
        return {
            text: "Review",
            className: "review"
        };
    }

    return {
        text: "Low Match",
        className: "low"
    };
}

function analyzeCandidates() {
    const jobTitle = document.getElementById("jobTitle").value || "Selected Job";
    const skillsInput = document.getElementById("skills").value;

    const requiredSkills = skillsInput.split(",").map(skill => skill.trim()).filter(skill => skill !== "");

    const names = document.querySelectorAll(".candidate-name");
    const resumes = document.querySelectorAll(".candidate-resume");

    let results = [];

    for (let i = 0; i < names.length; i++) {
        const name = names[i].value.trim();
        const resume = resumes[i].value.trim();

        if (name === "" || resume === "") {
            continue;
        }

        const analysis = scoreCandidate(resume, requiredSkills);
        const status = getStatus(analysis.score);

        results.push({
            name: name,
            score: analysis.score,
            matched: analysis.matched,
            missing: analysis.missing,
            statusText: status.text,
            statusClass: status.className
        });
    }

    results.sort((a, b) => b.score - a.score);

    displayResults(jobTitle, results);
}

function displayResults(jobTitle, results) {
    const resultsSection = document.getElementById("resultsSection");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsTable = document.getElementById("resultsTable");

    resultsSection.style.display = "block";
    resultsTitle.textContent = `Results for ${jobTitle}`;
    resultsTable.innerHTML = "";

    if (results.length === 0) {
        resultsTable.innerHTML = `
            <tr>
                <td colspan="5">No candidates were entered.</td>
            </tr>
        `;
        return;
    }

    results.forEach(candidate => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${candidate.name}</td>
            <td>${candidate.score}%</td>
            <td>${candidate.matched.join(", ") || "None"}</td>
            <td>${candidate.missing.join(", ") || "None"}</td>
            <td class="${candidate.statusClass}">${candidate.statusText}</td>
        `;

        resultsTable.appendChild(row);
    });
}
