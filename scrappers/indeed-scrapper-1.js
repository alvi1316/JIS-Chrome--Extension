chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "scrapper_type") {
        let checkElement = document.querySelector(".jobsearch-JobComponent")
        if(checkElement == null) {
            sendResponse("noscrapper")
        } else {
            sendResponse("indeed_scrapper")
        }
        return true
    }
});