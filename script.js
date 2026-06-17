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
            <div class="form-group">
                <label>EDAD</label>
                <input type="number" id="edad" name="edad" placeholder="Ej: 25" min="1" max="99" required>
            </div>
            <div class="form-group">
                <label>GÉNERO</label>
                <select id="genero" name="genero" required>
                    <option value="">SELECCIONA</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                </select>
            </div>
            <div class="form-group">
                <label>NÚMERO DE TELÉFONO</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ej: 12345678" maxlength="8" pattern="[0-9]{8}" required>
                <small style="color: rgba(255,255,255,0.4); font-size: 0.65rem;">Debe tener 8 dígitos</small>
            </div>
            <div class="form-group">
                <label>FORMA DE PAGO</label>
                <select id="formaPago" name="formaPago" required>
                    <option value="">Selecciona</option>
                    <option value="Efectivo">💵 EFECTIVO </option>
                    <option value="Depósito">🏦 DEPÓSITO </option>
                    <option value="Transferencia">💳 TRANSFERENCIA </option>
                </select>
            </div>
            <div class="form-group photo-section" id="photoSection">
                <label>COMPROBANTE DE PAGO <span style="color:#ff3b30;">*</span></label>
                <div class="photo-area" id="uploadArea">
                    <div class="camera-icon">📷</div>
                    <p> Suba el comprobante de pago del deposito o transferencia</p>
                    <small>JPG, PNG · máx 5MB</small>
                </div>
                <input type="file" id="foto" accept="image/*" style="display:none">
                <div class="photo-preview" id="previewArea">
                    <div class="preview-image">
                        <img id="previewImg" src="" alt="Vista previa">
                        <br>
                        <button type="button" class="remove-photo-btn" id="removePhotoBtn" style="display:none;">ELIMINAR</button>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn-primary"> ¡¡INSCRIBITE AHORA MISMO!!</button>
        </form>
    `;
    initFormEvents();
    initPagoLogic();
}

// ============================================
// LÓGICA DE PAGO (mostrar/ocultar foto)
// ============================================
function initPagoLogic() {
    const formaPago = document.getElementById('formaPago');
    const photoSection = document.getElementById('photoSection');
    const fotoInput = document.getElementById('foto');

    if (!formaPago) return;

    formaPago.addEventListener('change', function() {
        const valor = this.value;
        if (valor === 'Depósito' || valor === 'Transferencia') {
            photoSection.classList.add('visible');
            fotoInput.setAttribute('required', 'required');
        } else {
            photoSection.classList.remove('visible');
            fotoInput.removeAttribute('required');
            const previewDiv = document.getElementById('previewArea');
            const previewImg = document.getElementById('previewImg');
            const removeBtn = document.getElementById('removePhotoBtn');
            if (previewDiv) {
                imagenBase64 = '';
                imagenNombre = '';
                fotoInput.value = '';
                previewImg.src = '';
                previewDiv.classList.remove('active');
                if (removeBtn) removeBtn.style.display = 'none';
            }
        }
    });
}

// ============================================
// EVENTOS DEL FORMULARIO
// ============================================
function initFormEvents() {
    const uploadArea = document.getElementById('uploadArea');
    const fotoInput = document.getElementById('foto');
    const previewDiv = document.getElementById('previewArea');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removePhotoBtn');

    // === MANEJO DE FOTO ===
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fotoInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                procesarImagen(file);
            } else {
                alert('❌ Sube un archivo de imagen válido');
            }
        });
    }

    if (fotoInput) {
        fotoInput.addEventListener('change', (e) => {
            if (e.target.files[0]) procesarImagen(e.target.files[0]);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            imagenBase64 = '';
            imagenNombre = '';
            fotoInput.value = '';
            previewImg.src = '';
            previewDiv.classList.remove('active');
            removeBtn.style.display = 'none';
        });
    }

    function procesarImagen(file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ La imagen no puede superar los 5MB');
            fotoInput.value = '';
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('❌ Formato no válido. Usa JPG o PNG');
            return;
        }
        imagenNombre = file.name;
        const reader = new FileReader();
        reader.onload = (ev) => {
            imagenBase64 = ev.target.result.split(',')[1];
            previewImg.src = ev.target.result;
            previewDiv.classList.add('active');
            removeBtn.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }

    // === FUNCIÓN PARA VERIFICAR DUPLICADOS (SOLO POR NOMBRE) ===
    async function verificarDuplicado(nombre) {
        try {
            // Limpiar el nombre para comparación (mayúsculas, sin espacios extra)
            const nombreLimpio = nombre.trim().toUpperCase();
            
            const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;
            const response = await fetch(url);
            const text = await response.text();
            const json = JSON.parse(text.substr(47).slice(0, -2));
            
            const rows = json.table.rows;
            for (let row of rows) {
                if (row.c && row.c.length > 0) {
                    const nombreExistente = row.c[1] ? row.c[1].v : '';
                    const nombreExistenteLimpio = nombreExistente.trim().toUpperCase();
                    if (nombreExistenteLimpio === nombreLimpio) {
                        return true; // Ya existe un duplicado por nombre
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error al verificar duplicados:', error);
            return false; // Si hay error, permitimos el envío
        }
    }

    // === MANEJO DEL ENVÍO ===
    const form = document.getElementById('formInscripcion');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const edad = document.getElementById('edad').value;
            const genero = document.getElementById('genero').value;
            const telefono = document.getElementById('telefono').value;
            const formaPago = document.getElementById('formaPago').value;

            // Validaciones básicas
            if (!nombre || nombre.length < 3) return alert('❌ INGRESE SU NOMBRE CORRECTAMENTE');
            if (!edad || edad < 1 || edad > 120) return alert('❌ INGRESE SU EDAD CORRECTAMENTE');
            if (!genero) return alert('❌ SELECCIONE SU GENERO');
            if (!/^[0-9]{8}$/.test(telefono)) return alert('❌ INGRESE SU NUMERO DE TELEFONO CORRECTAMENTE (8 dígitos)');
            if (!formaPago) return alert('❌ SELECCIONE SU FORMA DE PAGO');

            if ((formaPago === 'Depósito' || formaPago === 'Transferencia') && !imagenBase64) {
                alert('❌ SUBA SU COMPROBANTE DE PAGO');
                return;
            }

            // === VERIFICAR DUPLICADO POR NOMBRE ===
            const esDuplicado = await verificarDuplicado(nombre);
            if (esDuplicado) {
                alert(`⚠️ EL NOMBRE "${nombre.trim().toUpperCase()}" YA ESTÁ REGISTRADO.\n\nNo puedes inscribirte dos veces con el mismo nombre. Si crees que es un error, contacta a los organizadores.`);
                return;
            }

            // Mostrar modal de confirmación
            mostrarConfirmacion(nombre, edad, genero, telefono, formaPago);
        });
    }

    // === FUNCIÓN PARA MOSTRAR MODAL DE CONFIRMACIÓN ===
    function mostrarConfirmacion(nombre, edad, genero, telefono, formaPago) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmData = document.getElementById('confirmData');
        const btnConfirm = document.getElementById('btnConfirmSend');
        const btnCancel = document.getElementById('btnCancelSend');
        const errorMsg = document.getElementById('errorConfirm');

        // Llenar los datos en el modal
        confirmData.innerHTML = `
            <p><strong>👤 Nombre:</strong> ${nombre}</p>
            <p><strong>🎂 Edad:</strong> ${edad} años</p>
            <p><strong>⚧ Género:</strong> ${genero}</p>
            <p><strong>📱 Teléfono:</strong> ${telefono}</p>
            <p><strong>💰 Forma de pago:</strong> ${formaPago}</p>
            ${imagenBase64 ? '<p><strong>📸 Comprobante:</strong> <span style="color: #00B4FF;">Adjuntado ✅</span></p>' : ''}
        `;

        // Mostrar modal
        confirmModal.style.display = 'flex';
        errorMsg.style.display = 'none';

        // Configurar botón de confirmación
        btnConfirm.onclick = async function() {
            btnConfirm.disabled = true;
            btnConfirm.textContent = '⏳ ENVIANDO...';
            errorMsg.style.display = 'none';

            try {
                const estadoPago = (formaPago === 'Efectivo') ? 'PENDIENTE' : 'CANCELADO';

                const fd = new FormData();
                fd.append('nombre', nombre);
                fd.append('edad', edad);
                fd.append('genero', genero);
                fd.append('telefono', telefono);
                fd.append('formaPago', formaPago);
                fd.append('estadoPago', estadoPago);
                fd.append('image', imagenNombre);
                fd.append('himage', imagenBase64);

                const resp = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: fd });
                const json = await resp.json();

                btnConfirm.disabled = false;
                btnConfirm.textContent = '✅ SÍ, ENVIAR INSCRIPCIÓN';

                if (json.result === 'success') {
                    confirmModal.style.display = 'none';
                    alert(`✅ ¡${nombre}, TE HAZ INSCRITO CORRECTAMENTE!\n\nESTADO DE PAGO: ${estadoPago}`);
                    form.reset();
                    if (removeBtn) removeBtn.click();
                    document.getElementById('photoSection').classList.remove('visible');
                    document.getElementById('formaPago').value = '';
                    // Resetear imagenBase64
                    imagenBase64 = '';
                    imagenNombre = '';
                } else {
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = '❌ Error al guardar: ' + (json.error || 'Desconocido');
                }
            } catch (err) {
                btnConfirm.disabled = false;
                btnConfirm.textContent = '✅ SÍ, ENVIAR INSCRIPCIÓN';
                errorMsg.style.display = 'block';
                errorMsg.textContent = '❌ ERROR DE CONEXION, VERIFICA TU INTERNET';
                console.error(err);
            }
        };

        // Cancelar
        btnCancel.onclick = function() {
            confirmModal.style.display = 'none';
        };

        // Cerrar al hacer clic fuera
        confirmModal.onclick = function(e) {
            if (e.target === confirmModal) {
                confirmModal.style.display = 'none';
            }
        };
    }
}

// ============================================
// INFORMACIÓN
// ============================================
function renderInfo() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">INFORMACION DE LA CARRERA</h2>
        <ul class="info-list">
            <li><div class="info-icon">📅</div><div class="info-text"><strong>FECHA</strong><span>AGOSTO 2026</span></div></li>
            <li><div class="info-icon">📍</div><div class="info-text"><strong>LUGAR</strong><span>PARQUE CENTRAL</span></div></li>
            <li><div class="info-icon">⏰</div><div class="info-text"><strong>SALIDA</strong><span>09:30h</span></div></li>
            <li><div class="info-icon">🏆</div><div class="info-text"><strong>DISTANCIA</strong><span>10K</span></div></li>
        </ul>
        <div style="margin-top:1.5rem; padding:1rem; background:rgba(255,255,255,0.05); border-radius:16px; border: 1px solid rgba(255,255,255,0.08);">
            <p style="font-weight:500; color: #ffffff;">🎽 Incluye KIT: Playera, Refacción y Medalla</p>
            <p style="font-size:0.8rem; margin-top:0.5rem; color: rgba(255,255,255,0.6);">💰 FORMAS DE PAGO: Efectivo · Depósito · Transferencia</p>
        </div>
    `;
}

// ============================================
// ORGANIZADOR
// ============================================
function renderOrganizador() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">🔐 ACCESO ORGANIZADORES</h2>
        <div id="contenidoOrganizador">
            <div class="admin-stats" id="estadoOrganizador">
                <p>🔒 ACCESO RESTRINGUIDO</p>
                <p style="font-size:0.65rem;">Ingresa la contraseña para acceder al panel</p>
            </div>
            <div class="btn-group">
                <button id="btnMostrarLoginOrganizador" class="btn-outline" style="flex:1;">🔐 INICIAR SESIÓN</button>
            </div>
            <div id="panelOrganizadorOpciones" style="display:none; margin-top:1rem;">
                <div class="admin-stats">
                    <p>✅ ACCESO CONCEDIDO</p>
                    <p style="font-size:0.7rem;">Los datos incluyen estado de pago</p>
                </div>
                <div class="btn-group">
                    <button id="btnExcel" class="btn-outline" style="flex:1;">📊 VER SHEET</button>
                    <button id="btnVaciarTodo" class="btn-outline btn-danger" style="flex:1;">⚠️ VACIAR</button>
                </div>
                <button id="btnCerrarSesion" class="btn-outline" style="width:100%; margin-top:0.8rem;">🚪 CERRAR SESIÓN</button>
            </div>
        </div>
    `;
    initOrganizadorEvents();
}

function initOrganizadorEvents() {
    const loginModal = document.getElementById('loginModal');

    document.getElementById('btnMostrarLoginOrganizador').onclick = () => {
        loginModal.style.display = 'flex';
        document.getElementById('errorLogin').style.display = 'none';
    };

    document.getElementById('btnLogin').onclick = () => {
        const pwd = document.getElementById('passwordOrganizador').value;
        if (pwd === CONTRASENA_ORGANIZADOR) {
            loginModal.style.display = 'none';
            document.getElementById('panelOrganizadorOpciones').style.display = 'block';
            document.getElementById('estadoOrganizador').innerHTML = '<p>✅ ACCESO CONCEDIDO</p><p style="font-size:0.65rem;">Panel de control activo</p>';
            document.getElementById('btnMostrarLoginOrganizador').style.display = 'none';
            document.getElementById('errorLogin').style.display = 'none';
        } else {
            document.getElementById('errorLogin').style.display = 'block';
        }
    };

    document.getElementById('btnCancelarLogin').onclick = () => {
        loginModal.style.display = 'none';
    };

    document.getElementById('btnCerrarSesion').onclick = () => {
        document.getElementById('panelOrganizadorOpciones').style.display = 'none';
        document.getElementById('estadoOrganizador').innerHTML = '<p>🔒 Acceso restringido</p><p style="font-size:0.65rem;">Ingresa contraseña</p>';
        document.getElementById('btnMostrarLoginOrganizador').style.display = 'block';
        alert('🔐 Sesión de organizador cerrada');
    };

    document.getElementById('btnExcel').onclick = () => {
        window.open(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`, '_blank');
    };

    document.getElementById('btnVaciarTodo').onclick = () => {
        if (confirm('⚠️ ¿Eliminar TODOS los inscritos? Las fotos NO se eliminarán automáticamente.')) {
            alert('📌 Ve a Google Sheets y elimina las filas manualmente');
        }
    };

    window.onclick = (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
    };
}

// ============================================
// CAMBIAR SECCIÓN
// ============================================
function changeSection(section) {
    if (section === 'registro') renderRegistro();
    else if (section === 'info') renderInfo();
    else if (section === 'organizador') renderOrganizador();

    menuItems.forEach(i => i.classList.remove('active'));
    document.querySelector(`.menu-item[data-section="${section}"]`).classList.add('active');

    if (window.innerWidth <= 900) closeSidebarFunc();
}

menuItems.forEach(i => {
    i.addEventListener('click', () => changeSection(i.dataset.section));
});

renderRegistro();
