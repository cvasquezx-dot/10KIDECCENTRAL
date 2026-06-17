// ============================================
// script.js - TODA LA LÓGICA (NO MODIFICAR)
// ============================================

// Configuración
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwMBpzD7m6EjmN6xmNNU74jqlG1U3zJb86TySYMFSP8BhxikioQty9w678MjAEvDqkO/exec';
const GOOGLE_SHEET_ID = '1ZDN_H9VmvKFq9i3VIjzV0pjSa97_EHw4JjVgrJ_fDwk';
const CONTRASENA_ORGANIZADOR = "carrera2024";

let imagenBase64 = '';
let imagenNombre = '';

// Menú lateral
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

// Renderizar Registro
function renderRegistro() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">📝 Registro de corredor</h2>
        <form id="formInscripcion">
            <div class="form-group">
                <label>NOMBRE COMPLETO</label>
                <input type="text" id="nombre" name="nombre" placeholder="Ej: Juan Pérez" required>
            </div>
            <div class="form-group">
                <label>EDAD</label>
                <input type="number" id="edad" name="edad" placeholder="Ej: 25" min="1" max="120" required>
            </div>
            <div class="form-group">
                <label>GÉNERO</label>
                <select id="genero" name="genero" required>
                    <option value="">Selecciona</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
            </div>
            <div class="form-group">
                <label>NÚMERO DE TELÉFONO</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ej: 12345678" maxlength="8" pattern="[0-9]{8}" required>
                <small style="color: #9aaab8; font-size: 0.65rem;">📌 Debe tener exactamente 8 dígitos</small>
            </div>
            <div class="form-group">
                <label>FORMA DE PAGO</label>
                <select id="formaPago" name="formaPago" required>
                    <option value="">Selecciona</option>
                    <option value="Efectivo">💵 Efectivo</option>
                    <option value="Depósito">🏦 Depósito</option>
                    <option value="Transferencia">💳 Transferencia</option>
                </select>
            </div>
            <div class="form-group photo-section" id="photoSection">
                <label>📸 COMPROBANTE DE PAGO <span style="color:#c0392b;">*</span></label>
                <div class="photo-area" id="uploadArea">
                    <div class="camera-icon">📷</div>
                    <p>Haz clic o arrastra tu comprobante</p>
                    <small>JPG, PNG · máx 5MB</small>
                </div>
                <input type="file" id="foto" accept="image/*" style="display:none">
                <div class="photo-preview" id="previewArea">
                    <div class="preview-image">
                        <img id="previewImg" src="" alt="Vista previa">
                        <br>
                        <button type="button" class="remove-photo-btn" id="removePhotoBtn" style="display:none;">🗑️ Eliminar</button>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn-primary">✅ INSCRIBIRME</button>
        </form>
    `;
    initFormEvents();
    initPagoLogic();
}

// Lógica de pago
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

// Eventos del formulario
function initFormEvents() {
    const uploadArea = document.getElementById('uploadArea');
    const fotoInput = document.getElementById('foto');
    const previewDiv = document.getElementById('previewArea');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removePhotoBtn');

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

    const form = document.getElementById('formInscripcion');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const edad = document.getElementById('edad').value;
            const genero = document.getElementById('genero').value;
            const telefono = document.getElementById('telefono').value;
            const formaPago = document.getElementById('formaPago').value;

            if (!nombre || nombre.length < 3) return alert('❌ Nombre mínimo 3 letras');
            if (!edad || edad < 1 || edad > 120) return alert('❌ Edad entre 1 y 120');
            if (!genero) return alert('❌ Selecciona un género');
            if (!/^[0-9]{8}$/.test(telefono)) return alert('❌ El teléfono debe tener exactamente 8 dígitos');
            if (!formaPago) return alert('❌ Selecciona una forma de pago');

            if ((formaPago === 'Depósito' || formaPago === 'Transferencia') && !imagenBase64) {
                alert('❌ Debes subir el comprobante de pago');
                return;
            }

            let estadoPago = (formaPago === 'Efectivo') ? 'PENDIENTE' : 'CANCELADO';

            const fd = new FormData();
            fd.append('nombre', nombre);
            fd.append('edad', edad);
            fd.append('genero', genero);
            fd.append('telefono', telefono);
            fd.append('formaPago', formaPago);
            fd.append('estadoPago', estadoPago);
            fd.append('image', imagenNombre);
            fd.append('himage', imagenBase64);

            try {
                const btn = document.querySelector('#formInscripcion button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = '⏳ ENVIANDO...';
                btn.disabled = true;

                const resp = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: fd });
                const json = await resp.json();

                btn.textContent = originalText;
                btn.disabled = false;

                if (json.result === 'success') {
                    alert(`✅ ¡${nombre} inscrito correctamente!\n\nEstado de pago: ${estadoPago}`);
                    form.reset();
                    if (removeBtn) removeBtn.click();
                    document.getElementById('photoSection').classList.remove('visible');
                    document.getElementById('formaPago').value = '';
                } else {
                    alert('❌ Error al guardar: ' + (json.error || 'Desconocido'));
                }
            } catch (err) {
                alert('❌ Error de conexión. Verifica tu internet.');
                console.error(err);
            }
        });
    }
}

// Información
function renderInfo() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">ℹ️ Información de la carrera</h2>
        <ul class="info-list">
            <li><div class="info-icon">📅</div><div class="info-text"><strong>FECHA</strong><span>15 de Junio, 2025</span></div></li>
            <li><div class="info-icon">📍</div><div class="info-text"><strong>LUGAR</strong><span>Ciudad de las Artes, Valencia</span></div></li>
            <li><div class="info-icon">⏰</div><div class="info-text"><strong>SALIDA</strong><span>09:30h</span></div></li>
            <li><div class="info-icon">🏆</div><div class="info-text"><strong>DISTANCIAS</strong><span>3K · 5K · 9K</span></div></li>
        </ul>
        <div style="margin-top:1.5rem; padding:1rem; background:#eef2f5; border-radius:16px;">
            <p style="font-weight:500;">🎽 Incluye: Dorsal oficial, chip, camiseta técnica y avituallamiento</p>
            <p style="font-size:0.8rem; margin-top:0.5rem; color:#1a3a4a;">💰 Formas de pago: Efectivo · Depósito · Transferencia</p>
        </div>
    `;
}

// Organizador
function renderOrganizador() {
    mainContent.innerHTML = `
        <h2 style="margin-bottom:1.5rem;">🔐 Acceso organizadores</h2>
        <div id="contenidoOrganizador">
            <div class="admin-stats" id="estadoOrganizador">
                <p>🔒 Acceso restringido</p>
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

// Cambiar sección
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
