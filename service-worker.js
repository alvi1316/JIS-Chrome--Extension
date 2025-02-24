const getJsonData = async () => {
    let JSON_DATA = (await chrome.storage.local.get(["JSON_DATA"])).JSON_DATA
    if(JSON_DATA == null) {
        await setJsonData({
            defaultColumns: [
                { columnName : "Company Name", type : "text" },
                { columnName : "Role", "type" : "text" },
                { columnName : "Post Link", type : "textarea" },
                { columnName : "Address", type : "text" },
                { columnName : "Job Description", type : "textarea" },
                {
                    columnName : "Application Status",
                    type : "select",
                    options : ["", "Applied", "Interview Scheduled", "Accepted", "Rejected"]
                }
            ],
            addedColumns: [],
            rows: []
        })
    }
    return (await chrome.storage.local.get(["JSON_DATA"])).JSON_DATA
}

const setJsonData = async (JSON_DATA) => {
    return await chrome.storage.local.set({"JSON_DATA" : JSON_DATA})
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getJsonData") {
        getJsonData().then(JSON_DATA => sendResponse(JSON_DATA))
        return true
    }

    if (request.message === "appendAddedColumn") {
        getJsonData().then(JSON_DATA => {
            JSON_DATA.addedColumns.push(request.data)
            setJsonData(JSON_DATA)
            sendResponse(JSON_DATA)
        })
        return true
    }

    if (request.message === "addScrappedData") {
        getJsonData().then(JSON_DATA => {
            let addedValue = JSON_DATA.addedColumns.map(_ => "")
            JSON_DATA.rows.push([...request.data, ...addedValue])
            setJsonData(JSON_DATA)
            chrome.runtime.sendMessage({message: "getLatestJsonData", data: JSON_DATA})
        })
        return true
    }

    if(request.message === "editJsonIndex") {
        getJsonData().then(JSON_DATA => {
            JSON_DATA.rows[request.index] = request.data
            setJsonData(JSON_DATA)
            sendResponse(JSON_DATA)
        })
        return true
    }

    if(request.message === "clearStorage") {
        chrome.storage.local.clear()
    }
});
