const regex = /https:\/\/(?:www.desmos|desmos).com\/calculator\/(.+)/;
const isApple = () => navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);

let saveTimeout;

function saveDocument({ autoSaveInterval, autoSaveEnabled }) {
	if (regex.test(window.location.href)) {
		if (autoSaveEnabled) {
			if (isApple())
				document.dispatchEvent(
					new KeyboardEvent("keydown", { key: "s", metaKey: true })
				);
			else
				document.dispatchEvent(
					new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
				);

			console.log(
				`[Desmos Auto Save] Saved graph using method ${
					isApple() ? "cmd-s" : "ctrl-s"
				}. Saving again in ${autoSaveInterval}.`
			);
		}
	}

	saveTimeout = setTimeout(() => {
		chrome.storage.sync.get(
			["autoSaveInterval", "autoSaveEnabled"],
			(settingsResponse) => {
				saveDocument(settingsResponse);
			}
		);
	}, autoSaveInterval || 60000);
}

chrome.storage.sync.get("autoSaveInterval", ({ autoSaveInterval }) => {
	saveTimeout = setTimeout(() => {
		chrome.storage.sync.get(
			["autoSaveInterval", "autoSaveEnabled"],
			(settingsResponse) => {
				saveDocument(settingsResponse);
			}
		);
	}, autoSaveInterval || 60000);
});

chrome.runtime.onMessage.addListener((message) => {
	if (
		message.type === "clearInterval" &&
		message.data?.newInterval &&
		saveTimeout
	) {
		console.log(
			`[Desmos Auto Save] Received an update interval message. Setting interval to ${message.data?.newInterval}`
		);

		clearInterval(saveTimeout);

		saveTimeout = setTimeout(() => {
			chrome.storage.sync.get(
				["autoSaveInterval", "autoSaveEnabled"],
				(settingsResponse) => {
					saveDocument(settingsResponse);
				}
			);
		}, message.data.newInterval || 60000);
	}
});
