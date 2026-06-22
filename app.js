import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMegLsMuc-Ij_hefG5C4MGc-gFjkgvwRE",
    authDomain: "bar-del-nautic-3301a.firebaseapp.com",
    databaseURL: "https://bar-del-nautic-3301a-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "bar-del-nautic-3301a",
    storageBucket: "bar-del-nautic-3301a.firebasestorage.app",
    messagingSenderId: "5914420001",
    appId: "1:5914420001:web:58f346df8538fffd63d460"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const clientesRef = ref(db, "clientes");
const historialRef = ref(db, "historial");

const nombreInput = document.getElementById("nombreInput");
const copasInput = document.getElementById("copasInput");
const addBtn = document.getElementById("addBtn");
const clientesTable = document.getElementById("clientesTable");
const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");

let clientesData = {};

/* Funció historial */
function afegirHistorial(text) {
    const hora = new Date().toLocaleString("ca-ES");
    push(historialRef, { text, hora });
}

/* Afegir client */
addBtn.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    const copas = parseInt(copasInput.value) || 0;

    if (nombre === "") return;

    push(clientesRef, { nombre, copas });
    afegirHistorial(`Afegit client: ${nombre} amb ${copas} copes`);

    nombreInput.value = "";
    copasInput.value = 10;
});

/* Escoltar canvis */
onValue(clientesRef, snapshot => {
    clientesData = snapshot.val() || {};
    renderTabla();
});

/* Renderitzar taula */
function renderTabla() {
    clientesTable.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    Object.entries(clientesData).forEach(([id, cliente]) => {
        if (!cliente.nombre.toLowerCase().includes(search)) return;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.copas}</td>
            <td>
                <button class="action-btn consume-btn" data-id="${id}">-1</button>
                <button class="action-btn delete-btn" data-id="${id}">Eliminar</button>
            </td>
        `;

        clientesTable.appendChild(tr);
    });

    /* Botó -1 */
    document.querySelectorAll(".consume-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nou = Math.max(0, clientesData[id].copas - 1);

            update(ref(db, "clientes/" + id), { copas: nou });
            afegirHistorial(`-1 copa a ${clientesData[id].nombre}`);
        });
    });

    /* Botó eliminar */
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            if (confirm("Segur que vols eliminar aquest client?")) {
                afegirHistorial(`Eliminat client: ${clientesData[id].nombre}`);
                remove(ref(db, "clientes/" + id));
            }
        });
    });
}

/* Buscador */
searchInput.addEventListener("input", renderTabla);

/* Mode fosc */
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
