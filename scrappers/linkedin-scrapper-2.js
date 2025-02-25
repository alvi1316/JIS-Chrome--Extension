chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === "scrapper_type") {
        sendResponse("linkedin_scrapper")
        return true
    }
    if(request.message === "scrape_job") {    
        let companyName = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.firstElementChild?.innerHTML?.replaceAll("<!---->", "")
        let role = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.firstElementChild?.innerHTML
        let postLink = window.location.href
        let address = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container")?.firstElementChild?.firstElementChild?.innerHTML?.replaceAll("<!---->", "")
        let jobDescription = document.querySelector(".jobs-description__container")?.querySelector(".mt4")?.innerHTML
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
        chrome.runtime.sendMessage({message: "add_scrape_row", data: [...data,""]})
        sendResponse("success")
        return true
    }
});