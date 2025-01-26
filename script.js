const AIO_USERNAME = "nafij";
const AIO_KEY = "aio_MeVq00ozHHJ2qedkNnqqBBcgOzkS";
const BASE_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds`;

/* Fetch the current states of feeds */
async function fetchFeedStates() {
    const feeds = ['feed1', 'feed2', 'feed3', 'feed4'];

    for (let feed of feeds) {
        try {
            const response = await fetch(`${BASE_URL}/${feed}/data/last`, {
                headers: { "X-AIO-Key": AIO_KEY }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${feed}. Status: ${response.status}`);
            }

            const data = await response.json();
            const state = data.value;
            console.log(`Current state of ${feed}: ${state}`);
            updateButtonColors(feed, state);
        } catch (error) {
            console.error(`Error fetching feed state for ${feed}:`, error);
        }
    }
}

/* Toggle feed values */
async function toggleFeed(feedName, value) {
    try {
        const response = await fetch(`${BASE_URL}/${feedName}/data`, {
            method: 'POST',
            headers: {
                "X-AIO-Key": AIO_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "value": value.toString() })
        });

        if (!response.ok) {
            throw new Error(`Failed to update feed. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Feed updated: ${feedName}, new state: ${data.value}`);
        updateButtonColors(feedName, data.value);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("status").innerText = `Error: ${error.message}`;
    }
}

/* Update button colors based on feed state */
function updateButtonColors(feedName, state) {
    const onButton = document.getElementById(`toggle${capitalize(feedName)}`);
    const offButton = document.getElementById(`toggle${capitalize(feedName)}Off`);

    if (state === "1") {
        onButton.style.backgroundColor = "#4CAF50";
        offButton.style.backgroundColor = "#00BCD4";
    } else {
        onButton.style.backgroundColor = "#3E5D5F";
        offButton.style.backgroundColor = "#D32F2F";
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", fetchFeedStates);
