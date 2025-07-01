document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim()=== "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{0,14}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;
    }
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch details");
            }
            const data = await response.json();
            displayUserData(data);
        }
        catch {
            statsContainer.innerHTML = `<p>No Data Found</p>`;
        }
        finally {
            searchButton.textContent = "Searh";
            searchButton.disabled = false;
        }
    }
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(data) {
        const totalQues = data.totalQuestions;
        const totalHardQues = data.totalHard;
        const totalMediumQues = data.totalMedium;
        const totalEasyQues = data.totalEasy;
        const solvedTotalQues = data.totalSolved;
        const solvedTotalEasyQues = data.easySolved;
        const solvedTotalMediumQues = data.mediumSolved;
        const solvedTotalHardQues = data.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Acceptance Rate", value:data.acceptanceRate},
            {label: "Ranking", value:data.ranking},
            {label: "Contribution Points", value:data.contributionPoints}
        ];


        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                `<div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                    </div>`
        ).join("");
    }
    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log(username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    })
})