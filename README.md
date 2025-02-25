## JIS(JOB-INDEX-SCRAPER)-Chrome--Extension
### Description
This extenstion lets users scrape job description from LinkedIn. In future it will support other job boards (Ex: Indeed, Glassdoor).
### Installation Steps
- Clone this repo with command `git clone https://github.com/alvi1316/JIS-Chrome-Extension.git`.
- Open chrome and go to `chrome://extensions/`.
- Enable developer mode.
- Click `load unpacked` button and select root folder of this repo.
- Restart browser.
  

### Sequence Diagram
- The extension has `service-worker.js` that is running in the background and responsible for reading and writing data.
- The extension has `linkedin-scrapper-1.js` and `linkedin-scrapper-2.js` which are responsible for scraping content from the webpage. We will be adding more scrapers for other job boards.
- The extension has `index.js` which works with `index.html` as a popup script to handle UI events.
- The extension has `jobindex.html` and `jobindex.js` responsible for searching and updating existing data. 

```mermaid
sequenceDiagram

    par Get Initial Data
    index ->> service-worker: sendMessage('getJsonData')
    activate service-worker
    service-worker ->> index: sendResponse(data)
    deactivate service-worker
    end

    par Scrape Data
    index ->> scraper: sendMessage('scrapeJob')
    activate scraper
    scraper ->> service-worker: sendMessage('addScrappedData')
    deactivate scraper 
    activate service-worker
    service-worker ->> jobindex: sendMessage('getLatestJsonData')
    deactivate service-worker
    end

    par Update Row
    jobindex ->> service-worker: sendMessage('editJsonIndex')
    activate service-worker
    service-worker ->> jobindex: sendResponse(latest-Data)
    deactivate service-worker
    end
```