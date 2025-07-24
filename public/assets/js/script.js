
document.addEventListener("DOMContentLoaded", () => {
    const dataList = document.getElementById("data-list")
    const dataForm = document.getElementById("data-form")
    const dataInput = document.getElementById("data-input")
    let editInput = document.getElementById("edit-id")
    const taskButton = document.getElementById("task-button")
    const taskHeader = document.getElementById("task-header")
    const taskNote = document.getElementById("task-notification")

    // Function to fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await fetch("/data")
            const data = await response.json()
            dataList.innerHTML = "" // Clear the list before rendering
            data.data.forEach((item) => {
                // Create a new list element
                const li = document.createElement("li");
                // Make it flex
                li.classList.add("d-flex")
                // *** BUILD TASK CONTENT
                htmlContent = '<div class="flex-fill border-top border-secondary pt-2">'
                
                    htmlContent += '<p class="task-content task-' + item.id + '">' + item.content + '</p>'
                    htmlContent += '<p class="task-created mr-2 text-secondary d-inline-block">Created At: ' + item.postedAt + '</p>'
                    if(item.editAt){ // only show if the task has been edited. 
                        htmlContent += '<p class="task-edited ml-2 text-secondary d-inline-block"><i>editted: ' + item.editAt +'</i></p>'
                    }
                htmlContent += '</div>'
                // BUILD EDIT & DELETE BUTTONS
                htmlContent += '<div class="border-top border-secondary pt-4">'
                    htmlContent += '<button type="button" class="task-edit btn-success rounded-pill" name="'+ item.id +'">Edit</button>'
                    htmlContent += '<button type="button" class="task-delete btn-danger rounded-pill" name="'+ item.id +'">Delete</button>'
                htmlContent += '</div>'
                
                // add html to the list item
                li.innerHTML = htmlContent
                // add the list item to our unordered list 
                dataList.appendChild(li)
            });
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    document.addEventListener("click", () => {
        // quickly remove the notification box on click. as soon as the user interacts witht he site again after seeing a notification it will dissapear
        taskNote.classList.remove("bg-success")
        taskNote.classList.remove("task-note-visible")
        taskNote.textContent = ""
    })

    // Handle form submission to add new data
    dataForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const newData = { content: dataInput.value }
        let editInput = document.getElementById("edit-id").value
        // If there is nothing in the edit id carrier then we are adding a new record
        if (editInput == ""){
            try {
                // try a post 
                const response = await fetch("./data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                })
                // if the response is good then 
                if (response.ok) {
                    dataInput.value = "" // Clear input field
                    fetchData() // Refresh the list
                    taskNote.classList.add("bg-success")
                    taskNote.classList.add("task-note-visible")
                    taskNote.textContent = "Task Added Successfully"
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
                    taskNote.classList.add("bg-success")
                    taskNote.textContent = "Task updated Successfully"
                    taskButton.textContent = "Add Task"
                    taskNote.classList.add("task-note-visible")
                    taskHeader.textContent = "Add a Task:"
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
                if (response.ok) {

                    dataInput.value = "" // Clear input field
                    fetchData() // Refresh the list
                    taskNote.classList.add("bg-danger")
                    taskNote.classList.add("task-note-visible")
                    taskNote.textContent = "Task Deleted Successfully"
                }
            } catch (error) {
                console.error("Error deleting data:", error)
            }
        }
    // UPDATE
        if (event.target.matches(".task-edit")) {
            // To update we are simply setting the form up to handle the update request
            // get the id from the name of the button
            const editID = event.target.name;
            // grab the content from the corresponding task record
            const editCont = document.querySelector(".task-content.task-"+ editID)
            const editText = editCont.textContent
            // put the content into the input box
            dataInput.value = editText
            // put the ID into a hidden input
            editInput.value = editID
            // change the value of the header and button
            taskButton.textContent = "Edit Task"
            taskHeader.textContent = "Edit a Task:"
            // mainly for mobile, make the screen focus on the form after clicking the button
            taskHeader.scrollIntoView();
        }
    });

    fetchData()
})
 