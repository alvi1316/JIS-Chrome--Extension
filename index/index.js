import DataObserver from "./DataObserver.js"

const dataObserver = DataObserver({})

const optionsObserver = DataObserver([])

const setDefaultColumnsUI = defaultColumns => {
    if(defaultColumns == null || defaultColumns.length == 0) {
        return
    }
    let innerHtml = defaultColumns.map(e => `<div class="row w-100 custom-row-style">${e.columnName}</div>`).join("")
    document.getElementById("default_columns").innerHTML = innerHtml
}

const setAddedColumnsUI = addedColumns => {
    let innerHtml = addedColumns.map(e => {
        return(
            `<div class="col border-dark solid-1 p-5">
                <div>Name: ${e.columnName}</div>
                <div style='color: red;'>Type: ${e.type}</div>
            </div>`
        )
    }).join("")
    innerHtml == "" ?
    document.getElementById("added_columns_header").classList.add("d-none") :
    document.getElementById("added_columns_header").classList.remove("d-none");
    document.getElementById("added_columns").innerHTML = innerHtml
}

const makeOptionInvisible = index => {
    optionsObserver.setData(prev => {
        if(index < 0 || index > prev.length-1) {
            return prev
        }
        prev[index].visible = false
        return prev
    })
    optionsObserver.notify()
}

const setOptionsUI = options => {
    document.getElementById("option_values").innerHTML = ""
    options.map((e,i) => {
        let input = document.createElement('input')
        input.type = "button"
        input.title = "Cancel"
        input.value = "🗙"
        if(e.visible) {        
            input.addEventListener("click", () => makeOptionInvisible(i))
        }
        let div = document.createElement('div');
        div.innerHTML = e.optionName
        let parent = document.createElement('div');
        parent.classList.add("row")
        parent.classList.add("gap-5")
        parent.appendChild(div)
        parent.appendChild(input)
        return {div: parent, visible: e.visible}
    })
    .filter(e => e.visible)
    .map(e => document.getElementById("option_values").appendChild(e.div))
}

dataObserver.addListener(data => setDefaultColumnsUI(data.defaultColumns))

dataObserver.addListener(data => setAddedColumnsUI(data.addedColumns))

optionsObserver.addListener(options => setOptionsUI(options))

document.addEventListener("DOMContentLoaded", () => {

    chrome.runtime.sendMessage({message: "getJsonData"}, response => {
        if(response == null) {
            return
        }
        dataObserver.setData(() => response)
        dataObserver.notify()
    });

    document.getElementById("column_add").addEventListener("click", () => {
        let colName = document.getElementById("column_name").value
        let type = document.getElementById("column_type").value
        if(colName == "") {
            return
        }
        if(type == "text") {
            chrome.runtime.sendMessage({message: "appendAddedColumn", data: {columnName: colName, type: type}}, response => {
                if(response == null) {
                    return
                }
                dataObserver.setData(() => response)
                dataObserver.notify()
                document.getElementById("column_name").value = ""
            });
            return
        }
        if(type == "select") {
            let options = optionsObserver.data.filter(e => e.visible).map(e => e.optionName)
            if(options.length == 0) {
                return
            }
            let data = {
                columnName : colName,
                type : "select",
                default : "",
                options : ["", ...options]
            }
            chrome.runtime.sendMessage({message: "appendAddedColumn", data: data}, response => {
                if(response == null) {
                    return
                }
                dataObserver.setData(() => response)
                dataObserver.notify()
                document.getElementById("column_name").value = ""
                optionsObserver.setData(_ => [])
                document.getElementById("option_name").value = ""
            });
        }
    })

    document.getElementById("option_add").addEventListener("click", () => {
        let optionName = document.getElementById("option_name").value
        if(optionName == "") {
            return;
        }
        let duplicate = optionsObserver.data.find(e => e.visible && e.optionName == optionName)
        if(duplicate != null) {
            return
        }
        optionsObserver.setData(prev => {
            prev.push({optionName: optionName, visible: true})
            return prev
        })
        optionsObserver.notify()
    })

    document.getElementById("column_type").addEventListener("change", e => {
        if(e.target.value === "select") {
            document.getElementById("add_option_wrapper").classList.remove("d-none")    
            return
        }
        document.getElementById("add_option_wrapper").classList.add("d-none")
    })

    document.getElementById("view_index").addEventListener("click", () => {
        chrome.tabs.create({url: chrome.runtime.getURL('../jobindex/jobindex.html')});
    });

    document.getElementById("scrape_job").addEventListener("click", () => {
        document.getElementById("scrape_loading").classList.remove("d-none")
        document.getElementById("scrape_loading").classList.add("loading")
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {message: "scrapeJob"}, response => {

                if(response == "success") {
                    document.getElementById("scrape_loading").classList.remove("loading")
                    document.getElementById("scrape_loading").classList.add("success")
                    setTimeout(() => {
                        document.getElementById("scrape_loading").classList.remove("success")
                        document.getElementById("scrape_loading").classList.add("d-none")
                    }, 3000)
                } else {
                    document.getElementById("scrape_loading").classList.remove("loading")
                    document.getElementById("scrape_loading").classList.add("fail")
                    setTimeout(() => {
                        document.getElementById("scrape_loading").classList.remove("fail")
                        document.getElementById("scrape_loading").classList.add("d-none")
                    }, 3000)
                }
            });
        });
    });

    document.getElementById("clear_storage").addEventListener("click", () => chrome.runtime.sendMessage({message: "clearStorage"}))
});