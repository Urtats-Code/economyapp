const form = document.getElementById('transactionForm')

// button for adding new row
form.addEventListener('submit', (e) =>  {
    e.preventDefault()
    // the most efficient way to do this is by using the querySelector but I want to try the FormData() 
    if(form.transactionAmount.value > 0){
        let transactionFormData = new FormData(form)
        let transactionObj = convertFomrDataTransactionObj(transactionFormData)
        saveTransaction(transactionObj)
        insertRowTransactionTable(transactionObj)
    }else{
        alert("The amount must be over 0");
    }
})

// render items from local storage
document.addEventListener("DOMContentLoaded", (event) => 
{
    let transactionObjectArray = JSON.parse(localStorage.getItem("transactionData"))
    console.log(transactionObjectArray);
    transactionObjectArray.forEach( transactionElement => {insertRowTransactionTable(transactionElement)})
} )


// deletes a row from the local storage by filtering the ID of the transaction
const deleteTransactionObj = (PassingTransactionID) =>{
    
    // other way to do this is by using filter and searching for transactionobjectArray.filter( element => element.transactionID !== transactionID )
    // but it is not the most efficient way as is making another array to delete an item from the origial object array
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"))
    let found = false;
    let iterator = 0;
    console.log(transactionObjArray[iterator].transactionID);
    while( !found && iterator < transactionObjArray.length){
        if(transactionObjArray[iterator].transactionID == PassingTransactionID){
            found = true;
            transactionObjArray.splice(iterator, 1)
        }
        iterator++;
    }

    let JSONTransaciontionArray = JSON.stringify(transactionObjArray)
    localStorage.setItem("transactionData", JSONTransaciontionArray)
}

// generates a random ID
const getNewTransactionID = () => {
    let lastTransactionID = localStorage.getItem("lastTransactionID") || "0"
    // you can also use parseInt() instead of JSON.parse
    let newTransactionID = JSON.parse(lastTransactionID) + 1;
    localStorage.setItem("lastTransactionID", JSON.stringify(newTransactionID))
    return newTransactionID
}

// Create form JSON
const convertFomrDataTransactionObj = (FormData) => {
    let transactionType = FormData.get("transactionType")
    let transactionDescription = FormData.get("transactionDescription") 
    let transactionAmount = FormData.get("transactionAmount")
    let transactionCategory = FormData.get("transactionCategory")
    let newTransactionID = getNewTransactionID();
    return {
        "transactionType" : transactionType,
        "transactionDescription" : transactionDescription,
        "transactionAmount" : transactionAmount,
        "transactionCategory" : transactionCategory,
        "transactionID" : newTransactionID,
    }
}

// insert and delete rows
const insertRowTransactionTable = (transactionObj) => {
    let transactionTableRef = document.getElementById("transactionTable")
    // Ther are various methods of doing this. The most simple way is by insterRow(-1), taking in account that -1 always refers to the last row
    let newTransactionRow = transactionTableRef.insertRow(-1)

    newTransactionRow.setAttribute("data-transaction-id", transactionObj.transactionID)

    let newTransactionCellRef = newTransactionRow.insertCell(0)
    newTransactionCellRef.textContent = transactionObj["transactionType"]

    newTransactionCellRef = newTransactionRow.insertCell(1)
    newTransactionCellRef.textContent = transactionObj['transactionDescription'] 

    newTransactionCellRef = newTransactionRow.insertCell(2)
    newTransactionCellRef.textContent = transactionObj['transactionAmount'] +'$'

    newTransactionCellRef = newTransactionRow.insertCell(3)
    newTransactionCellRef.textContent = transactionObj['transactionCategory']

    let newDeleteCell = newTransactionRow.insertCell(4)
    let deleteButton = document.createElement("button")
    deleteButton.classList.add("deleteButton")
    deleteButton.textContent = "Delete"
    newDeleteCell.appendChild(deleteButton)


    // in order to reset the value of the input field Im using querySelector

    const transactionDescription = document.querySelector("#transactionDescription")
    const transactionAmount = document.querySelector("#transactionAmount")
    const transactionCategory = document.querySelector("#transactionCategory")

    transactionDescription.value = "";
    transactionAmount.value = "";
    transactionCategory.value = "";


    deleteButton.addEventListener("click", (element) => {
        // pick up parent node in this case td to be able to delete de whole row
        let tableTransacationRow = element.target.parentNode.parentNode 
        let transactionID = tableTransacationRow.getAttribute("data-transaction-id")
        element.target.parentNode.parentNode.remove()
        
        deleteTransactionObj(transactionID)
    })
}

// Save transaction data in localStorage
const saveTransaction = (Obj) => {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || []
    myTransactionArray.push(Obj)
    // mutate my array into JSON Element
    let transactionArrayJSON = JSON.stringify(myTransactionArray)
    localStorage.setItem("transactionData", transactionArrayJSON)
}