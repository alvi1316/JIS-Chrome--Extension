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
    if(request.message === "scrape_job") {   
        let companyName = document.querySelector("[data-testid='inlineHeader-companyName']")?.firstChild?.firstChild?.text
        if(companyName == null) {
            companyName = document.querySelector(".jobsearch-JobInfoHeader-companyNameLink")?.innerHTML
        }
        let role = document.querySelector(".jobsearch-JobInfoHeader-title")?.innerHTML
        if(role == null) {
            role = document.querySelector("[data-testid='simpler-jobTitle']")?.innerHTML
        }
        const params = new URLSearchParams(new URL(window.location).search)
        const paramsObject = {}
        for (const [key, value] of params.entries()) {
        paramsObject[key] = value
        }
        let postLink = paramsObject['vjk']
        if(postLink == null) {
            postLink = paramsObject['jk']
        }
        let address = document.querySelector("[data-testid='job-location']")?.innerHTML
        if(address == null) {
            address = document.querySelector("[data-testid='jobsearch-JobInfoHeader-companyLocation']")?.innerHTML
        }
        if(address == null) {
            address = document.querySelector("[data-testid='inlineHeader-companyLocation']")?.innerHTML
        }
        let jobDescription = document.querySelector("#jobDescriptionText")?.innerHTML
        if(jobDescription == null) {
            jobDescription = document.querySelector(".jobsearch-JobComponent-description")?.innerHTML
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
        postLink = "https://www.indeed.com/viewjob?jk="+postLink
        data = [companyName, role, postLink, address, jobDescription]
        chrome.runtime.sendMessage({message: "add_scrape_row", data: [...data,""]})
        sendResponse("success")
        return true
    }
});