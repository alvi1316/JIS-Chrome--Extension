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

### How To Use
- After installation pin the extenstion:
  
![Screenshot 2025-02-24 171858](https://github.com/user-attachments/assets/d17db8ea-a45e-4343-b373-33894680c0a3)

![Screenshot 2025-02-24 171945](https://github.com/user-attachments/assets/eb5051f6-fce1-49e8-9a53-7454c774c79b)

- Go to LinkedIn job page like this one:
  
![Screenshot 2025-02-24 172100](https://github.com/user-attachments/assets/9ee095bc-d6bf-4eab-897d-a6932e0e253d)

- Open the extension popup:

![Screenshot 2025-02-24 172341](https://github.com/user-attachments/assets/5de4017f-aecc-49b7-bdfa-03e8055070aa)


- Click on `Scrape Job` button to scrape the job. If it is successful it would show a tick mark on the side of the button otherwise it would show a cross mark.

![Screenshot 2025-02-24 172419](https://github.com/user-attachments/assets/0252f099-0e2b-47db-af33-9dd65970289d)


- Click on `View Job Index` to see all scraped jobs. This page lets users edit each row and save application status.

![Screenshot 2025-02-24 172521](https://github.com/user-attachments/assets/e8e44155-f649-49bc-94f5-c3ce1154a4f7)

![Screenshot 2025-02-24 172604](https://github.com/user-attachments/assets/f8a85ae1-3183-460f-9304-44a997de3cb0)

![Screenshot 2025-02-24 172621](https://github.com/user-attachments/assets/1b8e5dcb-3dc5-4c2c-bcba-58a5735936bb)

![image](https://github.com/user-attachments/assets/9b626df9-14ae-4fea-b729-69da1fda8ac5)
