// Get the button and dropdown
let autoSaveToggle = document.getElementById("autoSaveToggle");
let intervalDropdown = document.getElementById("intervalSelector");

function toggleAutoSave() {
	chrome.storage.sync.get("autoSaveEnabled", ({ autoSaveEnabled }) => {
		autoSaveToggle.style.backgroundColor = !autoSaveEnabled
			? "#179D4F"
			: "#ED4245"; // Set the color
		autoSaveToggle.textContent = !autoSaveEnabled ? "Enabled" : "Disabled"; // Set the label
		chrome.storage.sync.set({ autoSaveEnabled: !autoSaveEnabled }); // Save settings change
	});
}

function updateSaveInterval(ms) {
	chrome.storage.sync.set({ autoSaveInterval: ms });
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) => {
			console.log(`[Popup] Sent update message to ${tab.id}!`);
			chrome.tabs.sendMessage(tab.id, {
				type: "clearInterval",
				data: { newInterval: ms },
			});
		});
	});
}

chrome.storage.sync.get(
	["autoSaveEnabled", "autoSaveInterval"],
	({ autoSaveEnabled, autoSaveInterval }) => {
		autoSaveToggle.style.backgroundColor = autoSaveEnabled
			? "#179D4F"
			: "#ED4245"; // Set the color
		autoSaveToggle.textContent = autoSaveEnabled ? "Enabled" : "Disabled"; // Set the label
		autoSaveToggle.addEventListener("click", toggleAutoSave);

		for (var i = 0; i < intervalDropdown.children.length; i++) {
			let option = intervalDropdown.children[i];
			if (option.value == autoSaveInterval) option.selected = true;
		}
	}
);

document.addEventListener(
	"input",
	function (event) {
		if (event.target.id !== "intervalSelector") return; // Only run on the select menu
		updateSaveInterval(event.target.value);
	},
	false
);
