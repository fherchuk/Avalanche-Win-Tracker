fetch("/status")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Extract data from the response
    const { responseData } = data;
    const { prevGameData, nextGameData } = responseData;

    // Update DOM elements with fetched data
    document.getElementById("nextGame").innerText = nextGameData.text;
    document.getElementById("result").innerText = prevGameData.resultString;

    const resultHeader = document.getElementById("result-header");
    resultHeader.innerText = prevGameData.displayStatus[0];
    resultHeader.style.color = prevGameData.displayStatus[1];

    document.getElementById("homeTeam").src = prevGameData.homeLogo;
    document.getElementById("awayTeam").src = prevGameData.awayLogo;
    document.getElementById("nextTeam").src = nextGameData.logo;
  })
  .catch((error) => {
    // Handle errors
    console.error("Error fetching game data:", error);
  });
