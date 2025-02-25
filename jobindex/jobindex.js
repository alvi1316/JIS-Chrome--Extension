import DataObserver from "../DataObserver.js"

const dataObserver = DataObserver({})

const editRowUI = element => {
    let siblings = element.parentNode.parentNode.children
    for(let i=0; i<siblings.length-1; i++) {
        siblings[i].children.item(0).classList.add("d-none")
        siblings[i].children.item(1).classList.remove("d-none")
    }
    element.parentNode.children.item(0).classList.remove("d-none")
    element.parentNode.children.item(1).classList.add("d-none")
}

const saveRowUI = element => {
    let siblings = element.parentNode.parentNode.children
    let data = []
    for(let i=0; i<siblings.length-1; i++) {
        siblings[i].children.item(0).classList.remove("d-none")
        siblings[i].children.item(1).classList.add("d-none")
        data.push(siblings[i].children.item(1).value)
    }
    element.parentNode.children.item(0).classList.add("d-none")
    element.parentNode.children.item(1).classList.remove("d-none")

    let index = element.parentNode.children.item(2).value
    chrome.runtime.sendMessage({message: "update_scrape_row", index: index, data: data});
}

const renderTableHeaderUI = headers => {
    document.getElementById("table-header").innerHTML = [...headers.map(e => `<th>${e}</th>`), `<th>Edit</th>`].join("")
}

const renderTableRowUI = (rows, cols) => {
    let tbody = rows.map(e => {
        let row = e.data.map((rowData, index) => {
            if(cols[index].type == "text") {
                return (
                    `<td>
                        <div>${rowData}</div>
                        <input class="d-none" type="text" value="${rowData}" />
                    </td>`
                )
            } 
            if(cols[index].type == "textarea") {
                return (
                    `<td>
                        <div class="mh-200 overflow-y-auto">${rowData}</div>
                        <textarea class="d-none">${rowData}</textarea>
                    </td>`
                )
            }
            if(cols[index].type == "select") {
                let found = cols[index].options.find(e => e==rowData)||""
                return (
                    `<td>
                        <div>${rowData}</div>
                        <select class="d-none">
                            ${cols[index].options.map(e => `<option value="${e}" ${e==found?"selected":""}>${e}</option>`).join("")}
                        </select>
                    </td>`
                )
            }
            return `<td>${rowData}</td>`
        })
        row = [
            ...row, 
            `<td>
                <input class="d-none" name="saveRow" type="button" value="Save"/>
                <input name="editRow" type="button" value="Edit"/>
                <input type="hidden" value="${e.index}"/>
            </td>`
        ].join("")
        return `<tr>${row}</tr>`
    }).join("")

    document.getElementById("table-body").innerHTML = tbody
    document.getElementsByName("editRow").forEach(e => e.addEventListener("click", () => editRowUI(e)))
    document.getElementsByName("saveRow").forEach(e => e.addEventListener("click", () => saveRowUI(e)))
}

const renderSearchOptionUI = options => {
    document.getElementById("search_option").innerHTML = options.map(e => `<option value="${e}">${e}</option>`).join("")
}

dataObserver.addListener(data => renderTableHeaderUI([...data.defaultColumns.map(e=>e.columnName), ...data.addedColumns.map(e => e.columnName)]))

dataObserver.addListener(data => {
    let rows = data.rows.map((e, i) => ({index: i, data: e}))
    renderTableRowUI(rows, [...data.defaultColumns, ...data.addedColumns])
})

dataObserver.addListener(data => renderSearchOptionUI(data.defaultColumns.map(e => e.columnName)))

document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({message: "get_all_scrape_row"}, response => {
        if(response == null) {
            return
        }
        dataObserver.setData(() => response)
        dataObserver.notify()
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === "notify_all_scrape_row") {
            if(request.data == null) {
                return
            }
            dataObserver.setData(() => request.data)
            dataObserver.notify()
            return true
        }
    })

    document.getElementById("search_input").addEventListener("input", () => {
        let searchValue = document.getElementById("search_input").value
        let columns = [...dataObserver.data().defaultColumns, ...dataObserver.data().addedColumns]
        let searchOptionIndex = columns.findIndex(e => document.getElementById("search_option").value == e.columnName)        
        if(searchValue == "" || searchValue == null) {
            let rows = dataObserver.data().rows.map((e, i) => ({index: i, data: e}))
            renderTableRowUI(rows, [...dataObserver.data().defaultColumns, ...dataObserver.data().addedColumns])
            return
        }
        if(searchOptionIndex == -1) {
            return
        }
        let rows = dataObserver.data().rows.map((e, i) => ({index: i, data: e}))
        rows = rows.filter(e => e.data[searchOptionIndex].toLowerCase().includes(searchValue.toLowerCase()))
        renderTableRowUI(rows, columns)
    })
})