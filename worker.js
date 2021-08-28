chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ autoSaveEnabled: true, autoSaveInterval: 60000 });
	console.log(`[Installed] Set default settings and enabled auto save!`);
});
