const url = "https://jsonplaceholder.typicode.com/photos";
let apiResponse = [];


function xmlFetchApi() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = xhr.response;
            apiResponse = data.map(item => {  //aca le agrega la variable 'abilitado' a cada item para usarla en lo habilitado y desabilitado.
                item.abilitado = true;
                return item;
            });
            renderTable(apiResponse);
        } else {
            console.log(`Error al traer los datos. Estado: ${xhr.status}`);
        }
    }
}


function toggleAbilitado() {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Please enter an ID");
        return;
    }
    const album = apiResponse.find(album => String(album.id) === String(id));
    if (album) {
        album.abilitado = !album.abilitado;
        renderTable(apiResponse);
    } else {
        alert("Album not found");
    }
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr"); //En la tabla deberia estar la foto, pero la api de donde la sacas esta muy viejo, o directamente caido
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.url}</td>
            <td>${item.thumbnailUrl}</td>
            <td>${item.abilitado ? "abilitado" : "desabilitado"}</td>
        `; //la URL la voy a dejar como texto por eso, pero si tuviese foto seria: "<td><img src="${item.thumbnailUrl}" alt=""></td>"
        tableBody.appendChild(tr);
    });
}

function addAlbum() {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Please enter an ID");
        return;
    }

    const existingAlbum = apiResponse.find(album => String(album.id) === String(id));
    if (existingAlbum && !existingAlbum.abilitado) {
        alert("El álbum está desabilitado y no se puede modificar.");
        return;
    }

    const title = document.getElementById("title").value;
    const urlVal = document.getElementById("url").value;
    const thumbnailUrl = document.getElementById("thumbnailUrl").value;

    const data = {
        id: id,
        title: title,
        url: urlVal,
        thumbnailUrl: thumbnailUrl,
        abilitado: true
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
            const newAlbum = { ...xhr.response, id: id, abilitado: true };
            if (existingAlbum) {
                const index = apiResponse.findIndex(album => String(album.id) === String(id));
                apiResponse[index] = newAlbum;
            } else {
                apiResponse.push(newAlbum);
            }
            renderTable(apiResponse);
        }
    }
}

//Este pedazo de codigo sirve para actualizar el form para el usuario.
//Dependiendo del valor del id, va a mostrar la informacion correspondiente para que el usuario pueda editarla, 
//si no encuentra ningun id va a mostrar los cuadrados de texto del form sin informacion.

document.getElementById('id').addEventListener('input', function () {
    const idValue = this.value;
    const existingAlbum = apiResponse ? apiResponse.find(album => String(album.id) === String(idValue)) : null;
    if (existingAlbum) {
        document.getElementById('title').value = existingAlbum.title || '';
        document.getElementById('url').value = existingAlbum.url || '';
        document.getElementById('thumbnailUrl').value = existingAlbum.thumbnailUrl || '';
    } else {
        document.getElementById('title').value = '';
        document.getElementById('url').value = '';
        document.getElementById('thumbnailUrl').value = '';
    }
});


function updateAlbum() {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Please enter an ID");
        return;
    }

    const existingAlbum = apiResponse.find(album => String(album.id) === String(id));
    if (existingAlbum && !existingAlbum.abilitado) {
        alert("El álbum está desabilitado y no se puede modificar.");
        return;
    }

    const title = document.getElementById("title").value;
    const inputUrl = document.getElementById("url").value;
    const thumbnailUrl = document.getElementById("thumbnailUrl").value;

    const data = {
        id: id,
        title: title,
        url: inputUrl,
        thumbnailUrl: thumbnailUrl
    };

    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url + "/" + id, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const updated = xhr.response;
            const index = apiResponse.findIndex(album => String(album.id) === String(id));
            if (index !== -1) {
                const wasAbilitado = apiResponse[index].abilitado;
                apiResponse[index] = { ...updated, id: id, abilitado: wasAbilitado };
            } else {
                apiResponse.push({ ...updated, id: id, abilitado: true });
            }
            renderTable(apiResponse);
        }
    }
}

function deleteAlbum() {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Please enter an ID");
        return;
    }

    const existingAlbum = apiResponse.find(album => String(album.id) === String(id));
    if (existingAlbum && !existingAlbum.abilitado) {
        alert("El álbum está desabilitado y no se puede modificar.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + "/" + id, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const index = apiResponse.findIndex(album => String(album.id) === String(id));
            if (index !== -1) {
                apiResponse.splice(index, 1);
            }
            renderTable(apiResponse);
        }
    }
}