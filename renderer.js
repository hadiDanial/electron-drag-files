
const fileContainer = document.getElementById("file-container");
const filesList = document.getElementById("files-list");

fileContainer.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
})

fileContainer.addEventListener("drop", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    filesList.innerHTML = "";
    
    const files = event.dataTransfer.files;
    for (const file of files)
    {
        filesList.innerHTML += file.name + "<br>";
        await window.api.copyFile({fileToCopy:file.path, copiedFilePath:file.name });
    }
})