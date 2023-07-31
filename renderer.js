
const fileContainer = document.getElementById("file-container");
const filesList = document.getElementById("files-list");

updateFilesList();

fileContainer.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
})

fileContainer.addEventListener("drop", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    const files = event.dataTransfer.files;
    for (const file of files)
    {
        filesList.innerHTML += file.name + "<br>";
        await window.api.copyFile({fileToCopy:file.path, copiedFilePath:file.name });
    }
    await updateFilesList();
})

async function updateFilesList() {
     await window.api.getFilesInFolder().then((names)=>{
        filesList.innerHTML = "";
        names.forEach(name => {
            const item = document.createElement("li");
            item.innerHTML = "<a>" + name + "</a>";
            item.classList.add("unselectable");
            item.draggable = true;
            item.ondragstart = (event) => {
                event.preventDefault();
                window.api.startDrag(name);
            }
            filesList.appendChild(item);
        });                
     });
}
