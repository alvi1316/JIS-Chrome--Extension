chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "scrapeJob") {    
        let companyName = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.firstElementChild?.innerHTML?.replaceAll("<!---->", "")
        let role = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.firstElementChild?.firstElementChild?.innerHTML
        let postLink = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.firstElementChild?.firstElementChild?.href
        let address = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container")?.firstElementChild?.firstElementChild?.innerHTML?.replaceAll("<!---->", "")
        let jobDescription = document.querySelector(".jobs-description__container")?.querySelector(".mt4")?.innerHTML
        if (!jobDescription) {
            jobDescription = new DOMParser().parseFromString(jobDescription, "text/html")
            jobDescription = jobDescription?.body?.textContent    
        }
        companyName ??= ""
        role ??= ""
        postLink ??= ""
        address ??= ""
        jobDescription ??= ""
        let data = [companyName, role, postLink, address, jobDescription]
        for(d of data) {
            if(d == "") {
                sendResponse("failed")
                return
            }
        }
        chrome.runtime.sendMessage({message: "addScrappedData", data: [...data,""]})
        sendResponse("success")
    }
});