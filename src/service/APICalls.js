
const Endpoints = {
    // Base: "http://www.nalcaci.freemyip.com:8081/server/",
    Base: "http://localhost:8080/v1/",
    Service: {
        GetItems: "items",          // get
        AddItem: "addItem",         // post
        UpdateItem: "updateItem/",  // put
        DeleteItem: "removeItem/"   // delete
    }
}

function getItems(callback) {
    let endpoint = Endpoints.Base + Endpoints.Service.GetItems;
    fetch(endpoint)
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            callback(responseData, null);
        })
        .catch(err => {
            callback(null, err);
        });
}

function addItem(reqInput, callback) {
    let endpoint = Endpoints.Base + Endpoints.Service.AddItem;
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqInput)
    })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            callback(responseData, null);
        })
        .catch(err => {
            callback(null, err);
        });
}

function updateItem(reqInput, id, callback) {
    let endpoint = Endpoints.Base + Endpoints.Service.UpdateItem + id;
    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqInput)
    })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            callback(responseData, null);
        })
        .catch(err => {
            callback(null, err);
        });
}

function deleteItem(id, callback) {
    let endpoint = Endpoints.Base + Endpoints.Service.DeleteItem + id;
    fetch(endpoint, { method: 'DELETE' })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            callback(responseData, null);
        })
        .catch(err => {
            callback(null, err);
        });
}

export { getItems, addItem, updateItem, deleteItem }