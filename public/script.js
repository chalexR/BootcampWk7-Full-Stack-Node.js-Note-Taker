document.addEventListener("DOMContentLoaded", () => {
    const dataList = document.getElementById("data-list")
    const dataForm = document.getElementById("data-form")
    const dataInput = document.getElementById("data-input")
    let editInput = document.getElementById("edit-id")
    const taskButton = document.getElementById("task-button")

    // Function to fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await fetch("/data")
            const data = await response.json()
            dataList.innerHTML = "" // Clear the list before rendering
            data.data.forEach((item) => {
                const li = document.createElement("li");
                //li.textContent = item.id + ": " + JSON.stringify(item)
                htmlContent = '<div class="">'
                
                htmlContent += '<p class="task-content task-' + item.id + '">' + item.content + '</p>'
                htmlContent += '<p class="task-created">Created At: ' + item.postedAt + '</p>'
                if(item.editAt){
                    htmlContent += '<p class="task-edited"><i>editted: ' + item.editAt +'</i></p>'
                }
                htmlContent += '</div>'
                htmlContent += '<div class="">'
                htmlContent += '<button type="button" class="task-edit" name="'+ item.id +'">Edit</button>'
                htmlContent += '<button type="button" class="task-delete" name="'+ item.id +'">Delete</button>'
                htmlContent += '</div>'

                li.innerHTML = htmlContent
                dataList.appendChild(li)
            });
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    // Handle form submission to add new data
    dataForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const newData = { content: dataInput.value }
        let editInput = document.getElementById("edit-id")
        if (editInput == ""){
            try {
                const response = await fetch("./data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                })
                console.log(response)
                if (response.ok) {
                    dataInput.value = "" // Clear input field
                    fetchData() // Refresh the list
                }
            } catch (error) {
                console.error("Error adding data:", error)
            }
        }else{
            let editInput = document.getElementById("edit-id")
            editID = parseInt(editInput.value)
            try {
                const response = await fetch("/data/"+ editID, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                })
                console.log(response)
                if (response.ok) {
                    dataInput.value = "" // Clear input field
                    editInput.value = ""
                    taskButton.textContent = "Add Task"
                    fetchData() // Refresh the list
                }
            } catch (error) {
                console.log("Error adding data:", error)
            }
        }
    })

    // Handle edit & delete requests, because the buttons are loaded in dynamically we can't use a simple event listener. 
    // Here we are listening to an event on the container box and the checking that the target matches one of the delete buttons
    dataList.addEventListener("click", async (event) => {
    // DELETE
        if (event.target.matches(".task-delete")) {
            const delID = event.target.name;
            try {
                const response = await fetch("/data/"+ delID, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: "",
                })
                console.log(response)
                if (response.ok) {
                    // TODO: Add a notification
                    dataInput.value = "" // Clear input field
                    fetchData() // Refresh the list
                }
            } catch (error) {
                console.error("Error deleting data:", error)
            }
        }
    // UPDATE
        if (event.target.matches(".task-edit")) {
            const editID = event.target.name;
            const editCont = document.querySelector(".task-content.task-"+ editID)
            const editText = editCont.textContent
            dataInput.value = editText
            editInput.value = editID
            taskButton.textContent = "Edit Task"

            /*
            try {
                const response = await fetch("/data/"+ delID, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: "",
                })
                console.log(response)
                if (response.ok) {
                    // TODO: Add a notification
                    dataInput.value = "" // Clear input field
                    fetchData() // Refresh the list
                }
            } catch (error) {
                console.error("Error deleting data:", error)
            }
            */
        }
    });

    fetchData()
})
 