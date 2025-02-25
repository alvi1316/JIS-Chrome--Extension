const getScrapperType = tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {message: "scrapper_type"}, response => {
        console.log(response)
        if(response == "linkedin_scrapper") {
            document.getElementById("scrape_job").value = "Scrape LinkedIn"
            document.getElementById("scrape_job").classList.add("linkedin")
            return
        }
        if(response == "indeed_scrapper") {
            document.getElementById("scrape_job").value = "Scrape Indeed"
            document.getElementById("scrape_job").classList.add("indeed")
            return
        }
        document.getElementById("scrape_job").disabled = true
        document.getElementById("scrape_job").classList.add("disabled")
    })
}

const scrapeJob = () => {
    document.getElementById("scrape_loading").className = "loading"
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {message: "scrape_job"}, response => {
            if(response == "success") {
                document.getElementById("scrape_loading").className = "success"
            } else {
                document.getElementById("scrape_loading").className = "fail"
            }
            setTimeout(() => {
                document.getElementById("scrape_loading").className = "d-none"
            }, 5000)
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {

    chrome.tabs.query({currentWindow: true, active: true}, getScrapperType);

    document.getElementById("view_index").addEventListener("click", () => {
        chrome.tabs.create({url: chrome.runtime.getURL('../jobindex/jobindex.html')});
    });

    document.getElementById("scrape_job").addEventListener("click", scrapeJob);

    document.getElementById("clear_storage").addEventListener("click", () => {
        chrome.runtime.sendMessage({message: "clear_storage"})
    });

});