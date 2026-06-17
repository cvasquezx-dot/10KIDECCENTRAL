// ============================================
// script.js - TODA LA LÓGICA
// ============================================

// Configuración
// ⚠️ ACTUALIZA ESTA URL CON LA QUE TE DÉ GOOGLE APPS SCRIPT
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyUZmZ5JCrUSCpfw0MONDU74EI7YNLr5q3wfk25vurxZZ-xDxQawXm95FZ4RKDU2cY/exec';
const GOOGLE_SHEET_ID = '1ZDN_H9VmvKFq9i3VIjzV0pjSa97_EHw4JjVgrJ_fDwk';
const CONTRASENA_ORGANIZADOR = "carrera2024";

let imagenBase64 = '';
let imagenNombre = '';

// ============================================
// MENÚ LATERAL
// ============================================
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const menuItems = document.querySelectorAll('.menu-item');
const mainContent = document.getElementById('mainContent');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebarFunc() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openSidebar);
closeMenu.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

// ============================================
// RENDERIZAR REGISTRO
// ============================================
function renderRegistro() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">DATOS PARA LA INSCRIPCIÓN</h2>
        <form id="formInscripcion">
            <div class="form-group">
                <label>NOMBRE COMPLETO</label>
                <input type="text" id="nombre" name="nombre" placeholder="Ej: PETER PARKER" required>
            </div>
            <div class="
