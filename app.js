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

const nombreInput = document.getElementById("nombreInput");
const copasInput = document.getElementById("copasInput");
const addBtn = document.getElementById("addBtn");
const clientesTable = document.getElementById("clientesTable");
const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");

let clientesData = {};

addBtn.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    const copas = parseInt(copasInput.value) || 0;

    if (nombre === "") return;

    push(clientesRef, {
        nombre,
        copas
    });

    nombreInput.value = "";
    copasInput.value = 10;
});

onValue(clientesRef, snapshot => {
    clientesData = snapshot.val() || {};
    renderTabla();
});

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

    document.querySelectorAll(".consume-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nuevo = Math.max(0, clientesData[id].copas - 1);
            update(ref(db, "clientes/" + id), { copas: nuevo });
        });
    });

/* Botons eliminar amb confirmació */
document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;

        if (confirm("Segur que vols eliminar aquest client?")) {
            const clienteRef = ref(db, "clientes/" + id);
            remove(clienteRef);
        }
    });
});


searchInput.addEventListener("input", renderTabla);

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

