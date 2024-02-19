function displayInvoice() {
    fetch('/invoices')
        .then(res=>res.json())
        .then(data=> displayData(data))
}

function displayEstimate() {
    fetch('/estimates')
        .then(res=>res.json())
        .then(data=> displayData(data))
}

function displayData(data) {
    const container = document.getElementById('pdfContainer')
    container.innerHTML = ''
    console.log(data)

    data.forEach(
        item => {
            const div = document.createElement("div")
            const p = document.createElement("p")
            const delBtn = document.createElement("button")
            const dataContent = Object.entries(item).map(([key, value]) => `${value}`);

            p.setAttribute("data-id", dataContent[0])
            p.textContent = dataContent[1]

            div.className = "d-flex flex-row justify-content-around"
            delBtn.className = "delBtn btn btn-danger"
            delBtn.textContent = "Supprimer"
            delBtn.addEventListener("click", ()=>{

                const regex = new RegExp("invoice\\b")

                if (regex){

                    fetch(`/invoices/${dataContent[0]}`, {method: 'DELETE'})
                        .then(res =>{
                            if (res.ok){
                                displayInvoice()
                            } else {
                                console.error("echec de la suppression de la facture")
                            }
                        })
                        .catch(err =>{
                            console.error("erruer lors de la suppresion :",err)
                        })

                } else {
                    fetch(`/estimates/${dataContent[0]}`, {method: 'DELETE'})
                        .then(res =>{
                            if (res.ok){
                                displayEstimate()
                            } else {
                                console.error("echec de la suppression de la facture")
                            }
                        })
                        .catch(err =>{
                            console.error("erruer lors de la suppresion :",err)
                        })
                }
                })

            div.appendChild(p)
            div.appendChild(delBtn)
            container.appendChild(div)
            console.log(dataContent)
        }
    )
}