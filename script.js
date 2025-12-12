// ============================================
// DATOS Y ESTADO DE LA APLICACIÓN
// ============================================

let grupos = JSON.parse(localStorage.getItem('optiCorte_grupos')) || [];
let nextCutId = JSON.parse(localStorage.getItem('optiCorte_nextCutId')) || 1;
let nextGroupId = JSON.parse(localStorage.getItem('optiCorte_nextGroupId')) || 1;
let nextMaterialId = JSON.parse(localStorage.getItem('optiCorte_nextMaterialId')) || 1;

// ============================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================

const BARRA_LONGITUD = 600; // Centímetros (6 metros)
const TIPOS_FIERRO = {
    // Fierro Angular
    'angular-1/2': { nombre: 'Fierro Angular 1/2"', categoria: 'angular', color: '#ff9800' },
    'angular-3/4': { nombre: 'Fierro Angular 3/4"', categoria: 'angular', color: '#f57c00' },
    'angular-1': { nombre: 'Fierro Angular 1"', categoria: 'angular', color: '#ef6c00' },
    'angular-1-1/2': { nombre: 'Fierro Angular 1 1/2"', categoria: 'angular', color: '#e65100' },
    'angular-2': { nombre: 'Fierro Angular 2"', categoria: 'angular', color: '#d84315' },
    
    // Tubo
    'tubo-20mm': { nombre: 'Tubo 20mm', categoria: 'tubo', color: '#4caf50' },
    'tubo-25mm': { nombre: 'Tubo 25mm', categoria: 'tubo', color: '#388e3c' },
    'tubo-30mm': { nombre: 'Tubo 30mm', categoria: 'tubo', color: '#2e7d32' },
    'tubo-40mm': { nombre: 'Tubo 40mm', categoria: 'tubo', color: '#1b5e20' },
    'tubo-50mm': { nombre: 'Tubo 50mm', categoria: 'tubo', color: '#0d5302' },
    'tubo-60mm': { nombre: 'Tubo 60mm', categoria: 'tubo', color: '#004d00' },
    
    // Fierro en T
    't-1/2': { nombre: 'Fierro en T 1/2"', categoria: 't', color: '#2196f3' },
    't-3/4': { nombre: 'Fierro en T 3/4"', categoria: 't', color: '#1976d2' },
    't-1': { nombre: 'Fierro en T 1"', categoria: 't', color: '#1565c0' },
    't-1-1/2': { nombre: 'Fierro en T 1 1/2"', categoria: 't', color: '#0d47a1' },
    
    // Fierro Redondo
    'redondo-1/4': { nombre: 'Fierro Redondo 1/4"', categoria: 'redondo', color: '#9c27b0' },
    'redondo-3/8': { nombre: 'Fierro Redondo 3/8"', categoria: 'redondo', color: '#7b1fa2' },
    'redondo-1/2': { nombre: 'Fierro Redondo 1/2"', categoria: 'redondo', color: '#6a1b9a' },
    'redondo-5/8': { nombre: 'Fierro Redondo 5/8"', categoria: 'redondo', color: '#4a148c' },
    'redondo-3/4': { nombre: 'Fierro Redondo 3/4"', categoria: 'redondo', color: '#38006b' },
    
    // Fierro Cuadrado
    'cuadrado-1/2': { nombre: 'Fierro Cuadrado 1/2"', categoria: 'cuadrado', color: '#ff5722' },
    'cuadrado-3/4': { nombre: 'Fierro Cuadrado 3/4"', categoria: 'cuadrado', color: '#e64a19' },
    'cuadrado-1': { nombre: 'Fierro Cuadrado 1"', categoria: 'cuadrado', color: '#d84315' },
    'cuadrado-1-1/2': { nombre: 'Fierro Cuadrado 1 1/2"', categoria: 'cuadrado', color: '#bf360c' },
    
    // Plancha
    'plancha-2x1': { nombre: 'Plancha 2x1 metros', categoria: 'plancha', color: '#795548' },
    'plancha-2.5x1.25': { nombre: 'Plancha 2.5x1.25m', categoria: 'plancha', color: '#6d4c41' },
    'plancha-3x1.5': { nombre: 'Plancha 3x1.5m', categoria: 'plancha', color: '#5d4037' },
    'plancha-1/8': { nombre: 'Plancha 1/8" grosor', categoria: 'plancha', color: '#4e342e' },
    'plancha-1/4': { nombre: 'Plancha 1/4" grosor', categoria: 'plancha', color: '#3e2723' },
    'plancha-3/8': { nombre: 'Plancha 3/8" grosor', categoria: 'plancha', color: '#260e04' }
};

const MATERIALES_ADICIONALES = {
    'bisagra-3': 'Bisagra 3"',
    'bisagra-4': 'Bisagra 4"',
    'bisagra-5': 'Bisagra 5"',
    'bisagra-6': 'Bisagra 6"',
    'chapa-simple': 'Chapa Simple',
    'chapa-doble': 'Chapa Doble',
    'chapa-cerradura': 'Chapa con Cerradura',
    'tornillo-1/2': 'Tornillo 1/2"',
    'tornillo-3/4': 'Tornillo 3/4"',
    'tornillo-1': 'Tornillo 1"',
    'tornillo-1-1/4': 'Tornillo 1 1/4"',
    'tuerca-1/2': 'Tuerca 1/2"',
    'tuerca-3/4': 'Tuerca 3/4"',
    'arandela': 'Arandela',
    'perno': 'Perno',
    'clavo': 'Clavo para madera',
    'pintura': 'Pintura (litro)',
    'sellador': 'Sellador (tubo)',
    'otro': 'Otro material'
};

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarEventListeners();
    inicializarPestañas();
    actualizarListaGruposSelect();
    renderizarGrupos();
    cargarDatosGuardados();
});

function inicializarEventListeners() {
    // Botón crear grupo
    document.getElementById('createGroupBtn').addEventListener('click', crearGrupo);
    
    // Botón añadir corte
    document.getElementById('addCutBtn').addEventListener('click', agregarCorte);
    
    // Botón añadir material
    document.getElementById('addMaterialBtn').addEventListener('click', agregarMaterial);
    
    // Botón optimizar
    document.getElementById('optimizeBtn').addEventListener('click', calcularOptimizacion);
    
    // Botón generar reporte
    document.getElementById('generateReportBtn').addEventListener('click', generarReporteCompras);
    
    // Botón limpiar todo
    document.getElementById('clearAllBtn').addEventListener('click', limpiarTodo);
    
    // Modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', cerrarModales);
    });
    
    // Guardar cambios en modales
    document.getElementById('saveEditBtn').addEventListener('click', guardarEdicionCorte);
    document.getElementById('saveGroupEditBtn').addEventListener('click', guardarEdicionGrupo);
    
    // Material personalizado
    document.getElementById('materialName').addEventListener('change', function() {
        const customGroup = document.getElementById('customMaterialGroup');
        customGroup.style.display = this.value === 'otro' ? 'block' : 'none';
    });
    
    // Permitir Enter en campos de texto
    document.getElementById('groupName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') crearGrupo();
    });
    
    document.getElementById('cutLength').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') agregarCorte();
    });
    
    // Botones para lista de compras
    document.getElementById('copyListBtn')?.addEventListener('click', copiarListaCompras);
    document.getElementById('printListBtn')?.addEventListener('click', imprimirListaCompras);
    document.getElementById('printReportBtn')?.addEventListener('click', imprimirReporte);
    document.getElementById('downloadReportBtn')?.addEventListener('click', descargarReporteImagen);
}

function inicializarPestañas() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remover clase active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Añadir clase active al botón y contenido seleccionado
            this.classList.add('active');
            document.getElementById(tabId + '-form').classList.add('active');
        });
    });
}

function cargarDatosGuardados() {
    if (grupos.length > 0) {
        console.log(`Datos cargados: ${grupos.length} grupos encontrados.`);
    }
}

// ============================================
// FUNCIONES PARA GRUPOS
// ============================================

function crearGrupo() {
    const nombreInput = document.getElementById('groupName');
    const notasInput = document.getElementById('groupNotes');
    const nombre = nombreInput.value.trim();
    const notas = notasInput.value.trim();
    
    if (!nombre) {
        mostrarAlerta('Por favor, ingresa un nombre para el grupo.', 'error');
        nombreInput.focus();
        return;
    }
    
    // Verificar que no exista un grupo con el mismo nombre
    if (grupos.some(grupo => grupo.nombre.toLowerCase() === nombre.toLowerCase())) {
        mostrarAlerta('Ya existe un grupo con ese nombre. Usa un nombre diferente.', 'error');
        return;
    }
    
    const nuevoGrupo = {
        id: nextGroupId++,
        nombre: nombre,
        notas: notas,
        cortes: [],
        materiales: []
    };
    
    grupos.push(nuevoGrupo);
    guardarEnLocalStorage();
    
    // Actualizar interfaz
    actualizarListaGruposSelect();
    renderizarGrupos();
    
    // Limpiar campos y mostrar mensaje
    nombreInput.value = '';
    notasInput.value = '';
    mostrarAlerta(`Grupo "${nombre}" creado correctamente.`, 'success');
    
    // Enfocar el campo de longitud
    document.getElementById('cutLength').focus();
}

function eliminarGrupo(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo y todos sus cortes/materiales?')) {
        return;
    }
    
    grupos = grupos.filter(grupo => grupo.id !== id);
    guardarEnLocalStorage();
    actualizarListaGruposSelect();
    renderizarGrupos();
    mostrarAlerta('Grupo eliminado correctamente.', 'success');
}

function editarGrupo(id) {
    const grupo = grupos.find(g => g.id === id);
    if (!grupo) return;
    
    document.getElementById('editGroupName').value = grupo.nombre;
    document.getElementById('editGroupNotes').value = grupo.notas || '';
    document.getElementById('editGroupId').value = id;
    
    document.getElementById('editGroupModal').classList.add('active');
}

function guardarEdicionGrupo() {
    const id = parseInt(document.getElementById('editGroupId').value);
    const nuevoNombre = document.getElementById('editGroupName').value.trim();
    const nuevasNotas = document.getElementById('editGroupNotes').value.trim();
    
    if (!nuevoNombre) {
        mostrarAlerta('El nombre del grupo no puede estar vacío.', 'error');
        return;
    }
    
    const grupo = grupos.find(g => g.id === id);
    if (grupo) {
        grupo.nombre = nuevoNombre;
        grupo.notas = nuevasNotas;
        guardarEnLocalStorage();
        renderizarGrupos();
        actualizarListaGruposSelect();
        mostrarAlerta('Grupo actualizado correctamente.', 'success');
    }
    
    cerrarModales();
}

// ============================================
// FUNCIONES PARA CORTES
// ============================================

function agregarCorte() {
    const longitud = parseInt(document.getElementById('cutLength').value);
    const tipo = document.getElementById('cutType').value;
    const grupoId = parseInt(document.getElementById('groupSelect').value);
    
    // Validaciones
    if (!longitud || longitud <= 0 || longitud > BARRA_LONGITUD) {
        mostrarAlerta(`La longitud debe estar entre 1 y ${BARRA_LONGITUD} centímetros.`, 'error');
        document.getElementById('cutLength').focus();
        return;
    }
    
    if (!grupoId) {
        mostrarAlerta('Por favor, selecciona un grupo para este corte.', 'error');
        return;
    }
    
    // Encontrar el grupo
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) {
        mostrarAlerta('El grupo seleccionado no existe.', 'error');
        return;
    }
    
    // Crear nuevo corte
    const nuevoCorte = {
        id: nextCutId++,
        longitud: longitud,
        tipo: tipo,
        grupoId: grupoId,
        grupoNombre: grupo.nombre,
        esCorte: true
    };
    
    grupo.cortes.push(nuevoCorte);
    guardarEnLocalStorage();
    
    // Actualizar interfaz
    renderizarGrupos();
    
    // Limpiar campo de longitud
    document.getElementById('cutLength').value = '';
    document.getElementById('cutLength').focus();
    
    mostrarAlerta(`Corte de ${longitud}cm añadido a "${grupo.nombre}".`, 'success');
}

function agregarMaterial() {
    const materialId = document.getElementById('materialName').value;
    let materialNombre;
    
    if (materialId === 'otro') {
        materialNombre = document.getElementById('customMaterialName').value.trim();
        if (!materialNombre) {
            mostrarAlerta('Por favor, ingresa el nombre del material.', 'error');
            document.getElementById('customMaterialName').focus();
            return;
        }
    } else {
        materialNombre = MATERIALES_ADICIONALES[materialId];
    }
    
    const cantidad = parseInt(document.getElementById('materialQuantity').value) || 1;
    const notas = document.getElementById('materialNotes').value.trim();
    const grupoId = parseInt(document.getElementById('materialGroupSelect').value);
    
    if (!grupoId) {
        mostrarAlerta('Por favor, selecciona un grupo para este material.', 'error');
        return;
    }
    
    // Encontrar el grupo
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) {
        mostrarAlerta('El grupo seleccionado no existe.', 'error');
        return;
    }
    
    // Crear nuevo material
    const nuevoMaterial = {
        id: nextMaterialId++,
        nombre: materialNombre,
        tipo: materialId,
        cantidad: cantidad,
        notas: notas,
        grupoId: grupoId,
        grupoNombre: grupo.nombre,
        esCorte: false
    };
    
    grupo.materiales.push(nuevoMaterial);
    guardarEnLocalStorage();
    
    // Actualizar interfaz y limpiar campos
    renderizarGrupos();
    document.getElementById('materialQuantity').value = 1;
    document.getElementById('materialNotes').value = '';
    document.getElementById('customMaterialName').value = '';
    document.getElementById('customMaterialGroup').style.display = 'none';
    
    mostrarAlerta(`${cantidad} ${materialNombre} añadido a "${grupo.nombre}".`, 'success');
}

function eliminarCorte(corteId, grupoId) {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return;
    
    grupo.cortes = grupo.cortes.filter(corte => corte.id !== corteId);
    guardarEnLocalStorage();
    renderizarGrupos();
    mostrarAlerta('Corte eliminado correctamente.', 'success');
}

function eliminarMaterial(materialId, grupoId) {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return;
    
    grupo.materiales = grupo.materiales.filter(mat => mat.id !== materialId);
    guardarEnLocalStorage();
    renderizarGrupos();
    mostrarAlerta('Material eliminado correctamente.', 'success');
}

function editarCorte(corteId, grupoId) {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return;
    
    const corte = grupo.cortes.find(c => c.id === corteId);
    if (!corte) return;
    
    // Llenar el modal con los datos actuales
    document.getElementById('editCutLength').value = corte.longitud;
    document.getElementById('editCutType').value = corte.tipo;
    document.getElementById('editCutId').value = `${corteId}-${grupoId}`;
    
    // Mostrar modal
    document.getElementById('editModal').classList.add('active');
}

function guardarEdicionCorte() {
    const valores = document.getElementById('editCutId').value.split('-');
    const corteId = parseInt(valores[0]);
    const grupoId = parseInt(valores[1]);
    
    const nuevaLongitud = parseInt(document.getElementById('editCutLength').value);
    const nuevoTipo = document.getElementById('editCutType').value;
    
    // Validar nueva longitud
    if (!nuevaLongitud || nuevaLongitud <= 0 || nuevaLongitud > BARRA_LONGITUD) {
        mostrarAlerta(`La longitud debe estar entre 1 y ${BARRA_LONGITUD} centímetros.`, 'error');
        return;
    }
    
    // Encontrar y actualizar el corte
    const grupo = grupos.find(g => g.id === grupoId);
    if (grupo) {
        const corte = grupo.cortes.find(c => c.id !== corteId);
        if (corte) {
            corte.longitud = nuevaLongitud;
            corte.tipo = nuevoTipo;
            guardarEnLocalStorage();
            renderizarGrupos();
            mostrarAlerta('Corte actualizado correctamente.', 'success');
        }
    }
    
    cerrarModales();
}

// ============================================
// ALGORITMO DE OPTIMIZACIÓN
// ============================================

function calcularOptimizacion() {
    // Verificar que haya cortes
    const totalCortes = grupos.reduce((total, grupo) => total + grupo.cortes.length, 0);
    if (totalCortes === 0) {
        mostrarAlerta('No hay cortes para optimizar. Añade cortes primero.', 'error');
        return;
    }
    
    // Obtener configuración
    const separarPorTipo = document.getElementById('separateByType').checked;
    
    let resultados = optimizarPorTipo();
    
    // Mostrar resultados
    mostrarResultados(resultados);
    generarListaComprasSimplificada(resultados);
    
    // Habilitar botón de generar reporte
    document.getElementById('generateReportBtn').disabled = false;
    
    mostrarAlerta(`Optimización completada. Se necesitan ${resultados.totalBarras} barras.`, 'success');
}

function optimizarPorTipo() {
    const resultados = {
        totalBarras: 0,
        porTipo: {},
        barras: [],
        resumenCompras: {}
    };
    
    // Agrupar cortes por tipo de fierro
    const cortesPorTipo = {};
    
    grupos.forEach(grupo => {
        grupo.cortes.forEach(corte => {
            const tipoInfo = TIPOS_FIERRO[corte.tipo];
            const categoria = tipoInfo ? tipoInfo.categoria : corte.tipo;
            
            if (!cortesPorTipo[categoria]) {
                cortesPorTipo[categoria] = [];
            }
            cortesPorTipo[categoria].push({
                ...corte,
                tipoCategoria: categoria,
                tipoNombre: tipoInfo ? tipoInfo.nombre : corte.tipo,
                grupoNombre: grupo.nombre
            });
        });
    });
    
    // Optimizar cada tipo por separado
    for (const [categoria, cortes] of Object.entries(cortesPorTipo)) {
        // Ordenar cortes de mayor a menor
        cortes.sort((a, b) => b.longitud - a.longitud);
        
        const barrasTipo = [];
        
        // Algoritmo First-Fit Decreasing
        for (const corte of cortes) {
            let colocada = false;
            
            // Intentar colocar en barra existente
            for (const barra of barrasTipo) {
                if (barra.espacioDisponible >= corte.longitud) {
                    barra.cortes.push(corte);
                    barra.espacioDisponible -= corte.longitud;
                    colocada = true;
                    break;
                }
            }
            
            // Si no cabe en ninguna barra existente, crear nueva
            if (!colocada) {
                barrasTipo.push({
                    tipo: categoria,
                    tipoNombre: cortes[0].tipoNombre,
                    cortes: [corte],
                    espacioDisponible: BARRA_LONGITUD - corte.longitud,
                    desperdicio: BARRA_LONGITUD - corte.longitud
                });
            }
        }
        
        // Calcular desperdicio real
        barrasTipo.forEach(barra => {
            barra.desperdicio = barra.espacioDisponible;
        });
        
        // Agregar al resumen de compras
        resultados.resumenCompras[categoria] = {
            cantidad: barrasTipo.length,
            nombre: cortes[0].tipoNombre,
            desperdicioTotal: barrasTipo.reduce((sum, barra) => sum + barra.desperdicio, 0)
        };
        
        resultados.porTipo[categoria] = barrasTipo;
        resultados.totalBarras += barrasTipo.length;
        resultados.barras.push(...barrasTipo);
    }
    
    return resultados;
}

// ============================================
// FUNCIONES DE INTERFAZ
// ============================================

function actualizarListaGruposSelect() {
    const select = document.getElementById('groupSelect');
    const materialSelect = document.getElementById('materialGroupSelect');
    const groupsContainer = document.getElementById('groupsContainer');
    
    // Limpiar opciones excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    while (materialSelect.options.length > 1) {
        materialSelect.remove(1);
    }
    
    // Si no hay grupos, mostrar estado vacío
    if (grupos.length === 0) {
        groupsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No hay proyectos creados todavía. Crea tu primer proyecto para comenzar.</p>
            </div>
        `;
        return;
    }
    
    // Añadir opciones a ambos selects
    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.id;
        option.textContent = grupo.nombre;
        select.appendChild(option.cloneNode(true));
        materialSelect.appendChild(option);
    });
    
    // Seleccionar el primer grupo por defecto
    if (grupos.length > 0) {
        select.value = grupos[0].id;
        materialSelect.value = grupos[0].id;
    }
}

function renderizarGrupos() {
    const groupsContainer = document.getElementById('groupsContainer');
    
    if (grupos.length === 0) {
        actualizarListaGruposSelect();
        return;
    }
    
    let html = '';
    
    grupos.forEach(grupo => {
        html += `
            <div class="group-item" data-group-id="${grupo.id}">
                <div class="group-header">
                    <div class="group-title">
                        <i class="fas fa-folder"></i>
                        <span>${grupo.nombre}</span>
                        <span class="badge">${grupo.cortes.length + grupo.materiales.length} items</span>
                    </div>
                    <div class="group-actions">
                        <button class="btn btn-small btn-primary" onclick="editarGrupo(${grupo.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-small btn-clear" onclick="eliminarGrupo(${grupo.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
        `;
        
        // Mostrar notas del grupo
        if (grupo.notas) {
            html += `
                <div class="group-notes">
                    <i class="fas fa-sticky-note"></i>
                    <span>${grupo.notas}</span>
                </div>
            `;
        }
        
        html += `
                <div class="cuts-list">
        `;
        
        // Mostrar cortes
        if (grupo.cortes.length === 0 && grupo.materiales.length === 0) {
            html += `
                <div class="empty-state-small">
                    <p>No hay cortes ni materiales en este proyecto todavía.</p>
                </div>
            `;
        } else {
            grupo.cortes.forEach(corte => {
                const tipoFierro = TIPOS_FIERRO[corte.tipo];
                html += `
                    <div class="cut-item">
                        <div class="cut-info">
                            <span class="cut-length">${corte.longitud} cm</span>
                            <span class="cut-type" data-type="${corte.tipo}" style="background: linear-gradient(45deg, ${tipoFierro ? tipoFierro.color : '#ccc'}, ${tipoFierro ? tipoFierro.color + 'dd' : '#aaa'});">
                                ${tipoFierro ? tipoFierro.nombre : corte.tipo}
                            </span>
                        </div>
                        <div class="cut-actions">
                            <button class="btn-icon" onclick="editarCorte(${corte.id}, ${grupo.id})" title="Editar corte">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="eliminarCorte(${corte.id}, ${grupo.id})" title="Eliminar corte">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            // Mostrar materiales adicionales
            grupo.materiales.forEach(material => {
                html += `
                    <div class="material-item">
                        <div class="material-info">
                            <span class="material-quantity">${material.cantidad} und</span>
                            <span class="material-type" data-type="${material.tipo}">
                                ${material.nombre}
                            </span>
                            ${material.notas ? `<small>${material.notas}</small>` : ''}
                        </div>
                        <div class="material-actions">
                            <button class="btn-icon" onclick="eliminarMaterial(${material.id}, ${grupo.id})" title="Eliminar material">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    groupsContainer.innerHTML = html;
    
    // Añadir estilos para el badge y botones
    const style = document.createElement('style');
    style.textContent = `
        .badge {
            background: linear-gradient(45deg, #2196f3, #0d47a1);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-left: 15px;
            font-weight: 600;
            box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
        }
        .empty-state-small {
            text-align: center;
            padding: 25px;
            color: #78909c;
            font-style: italic;
            background-color: #f5f5f5;
            border-radius: 10px;
            margin: 15px 0;
        }
        .btn-icon {
            background: none;
            border: none;
            color: #5c6bc0;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .btn-icon:hover {
            color: #2196f3;
            background-color: #e8eaf6;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

function mostrarResultados(resultados) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultados.barras || resultados.barras.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudieron calcular resultados. Verifica los datos.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="summary-stats">
            <div class="stat-card">
                <h3><i class="fas fa-bars"></i> Total de Barras</h3>
                <p class="stat-number">${resultados.totalBarras}</p>
            </div>
            <div class="stat-card">
                <h3><i class="fas fa-cut"></i> Cortes Totales</h3>
                <p class="stat-number">${resultados.barras.reduce((total, barra) => total + barra.cortes.length, 0)}</p>
            </div>
            <div class="stat-card">
                <h3><i class="fas fa-trash"></i> Desperdicio Total</h3>
                <p class="stat-number waste">${(resultados.barras.reduce((total, barra) => total + barra.desperdicio, 0) / 100).toFixed(2)} m</p>
            </div>
        </div>
    `;
    
    // Mostrar barras por tipo
    for (const [tipo, barrasTipo] of Object.entries(resultados.porTipo)) {
        const tipoInfo = TIPOS_FIERRO[Object.keys(TIPOS_FIERRO).find(key => TIPOS_FIERRO[key].categoria === tipo)] || 
                        { nombre: tipo, color: '#95a5a6' };
        
        html += `
            <div class="type-section">
                <h3 style="color: ${tipoInfo.color};">
                    <i class="fas fa-cog"></i> ${tipoInfo.nombre}
                    <span class="badge">${barrasTipo.length} barras</span>
                </h3>
        `;
        
        barrasTipo.forEach((barra, index) => {
            const eficiencia = ((BARRA_LONGITUD - barra.desperdicio) / BARRA_LONGITUD * 100).toFixed(1);
            
            html += `
                <div class="bar-result">
                    <div class="bar-header">
                        <div class="bar-title">
                            <i class="fas fa-grip-lines"></i>
                            Barra ${index + 1} (${tipoInfo.nombre.split(' ')[0]})
                        </div>
                        <div class="bar-info">
                            <span class="waste"><i class="fas fa-trash"></i> ${barra.desperdicio} cm desperdiciados</span>
                            <span class="efficiency"><i class="fas fa-chart-line"></i> ${eficiencia}% eficiencia</span>
                        </div>
                    </div>
                    
                    <div class="bar-cuts">
            `;
            
            barra.cortes.forEach((corte, corteIndex) => {
                const tipoCorte = TIPOS_FIERRO[corte.tipo];
                html += `
                    <div class="bar-cut-item">
                        <div>
                            <strong>Corte ${corteIndex + 1}:</strong> ${corte.longitud} cm
                            <br>
                            <small><i class="fas fa-folder"></i> ${corte.grupoNombre}</small>
                        </div>
                        <div class="cut-type-small" style="background: linear-gradient(45deg, ${tipoCorte ? tipoCorte.color : '#ccc'}, ${tipoCorte ? tipoCorte.color + 'aa' : '#aaa'});">
                            ${tipoCorte ? tipoCorte.nombre.split(' ')[0] : corte.tipo}
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    resultsContainer.innerHTML = html;
}

function generarListaComprasSimplificada(resultados) {
    const shoppingContainer = document.getElementById('shoppingListContainer');
    const shoppingActions = document.querySelector('.shopping-actions');
    
    // Agrupar materiales adicionales
    const materialesAgrupados = {};
    grupos.forEach(grupo => {
        grupo.materiales.forEach(material => {
            const key = material.nombre + (material.notas ? ` (${material.notas})` : '');
            if (!materialesAgrupados[key]) {
                materialesAgrupados[key] = {
                    nombre: material.nombre,
                    notas: material.notas,
                    cantidad: 0
                };
            }
            materialesAgrupados[key].cantidad += material.cantidad;
        });
    });
    
    let html = '';
    
    // Mostrar barras necesarias
    for (const [categoria, info] of Object.entries(resultados.resumenCompras)) {
        const tipoInfo = TIPOS_FIERRO[Object.keys(TIPOS_FIERRO).find(key => TIPOS_FIERRO[key].categoria === categoria)];
        html += `
            <div class="shopping-list-item slide-in">
                <div class="shopping-list-header">
                    <div class="shopping-list-title">
                        <i class="fas fa-grip-lines"></i>
                        ${tipoInfo ? tipoInfo.nombre : categoria}
                    </div>
                    <div class="shopping-list-qty">${info.cantidad} ${info.cantidad === 1 ? 'barra' : 'barras'}</div>
                </div>
                <div class="shopping-list-details">
                    <p><i class="fas fa-info-circle"></i> Barras de 6 metros. Desperdicio estimado: ${(info.desperdicioTotal / 100).toFixed(2)} metros</p>
                </div>
            </div>
        `;
    }
    
    // Mostrar materiales adicionales
    for (const [key, material] of Object.entries(materialesAgrupados)) {
        html += `
            <div class="shopping-list-item slide-in">
                <div class="shopping-list-header">
                    <div class="shopping-list-title">
                        <i class="fas fa-box"></i>
                        ${material.nombre}
                    </div>
                    <div class="shopping-list-qty">${material.cantidad} ${material.cantidad === 1 ? 'unidad' : 'unidades'}</div>
                </div>
                ${material.notas ? `
                <div class="shopping-list-details">
                    <p><i class="fas fa-sticky-note"></i> ${material.notas}</p>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    if (!html) {
        html = `
            <div class="empty-state">
                <i class="fas fa-cart-shopping"></i>
                <p>No hay items para la lista de compras.</p>
            </div>
        `;
        shoppingActions.style.display = 'none';
    } else {
        shoppingActions.style.display = 'flex';
    }
    
    shoppingContainer.innerHTML = html;
}

function generarReporteCompras() {
    const resultados = optimizarPorTipo();
    const modal = document.getElementById('reportModal');
    const reportContent = document.getElementById('reportContent');
    
    // Agrupar materiales adicionales
    const materialesAgrupados = {};
    grupos.forEach(grupo => {
        grupo.materiales.forEach(material => {
            const key = material.nombre + (material.notas ? ` (${material.notas})` : '');
            if (!materialesAgrupados[key]) {
                materialesAgrupados[key] = {
                    nombre: material.nombre,
                    notas: material.notas,
                    cantidad: 0
                };
            }
            materialesAgrupados[key].cantidad += material.cantidad;
        });
    });
    
    let html = `
        <div class="report-title">
            <i class="fas fa-shopping-cart"></i>
            LISTA DE COMPRAS - CONSTRUCCIÓN
        </div>
        
        <div class="report-section">
            <h4><i class="fas fa-grip-lines"></i> BARRAS DE FIERRO (6 metros)</h4>
    `;
    
    // Barras de fierro
    for (const [categoria, info] of Object.entries(resultados.resumenCompras)) {
        const tipoInfo = TIPOS_FIERRO[Object.keys(TIPOS_FIERRO).find(key => TIPOS_FIERRO[key].categoria === categoria)];
        html += `
            <div class="report-item">
                <span>${tipoInfo ? tipoInfo.nombre : categoria}</span>
                <strong>${info.cantidad} ${info.cantidad === 1 ? 'barra' : 'barras'}</strong>
            </div>
        `;
    }
    
    html += `
        </div>
        
        <div class="report-section">
            <h4><i class="fas fa-tools"></i> MATERIALES ADICIONALES</h4>
    `;
    
    // Materiales adicionales
    for (const [key, material] of Object.entries(materialesAgrupados)) {
        html += `
            <div class="report-item">
                <span>${material.nombre}${material.notas ? ` (${material.notas})` : ''}</span>
                <strong>${material.cantidad} und</strong>
            </div>
        `;
    }
    
    // Resumen de proyectos
    html += `
        </div>
        
        <div class="report-section">
            <h4><i class="fas fa-clipboard-list"></i> PROYECTOS INCLUIDOS</h4>
    `;
    
    grupos.forEach(grupo => {
        const totalItems = grupo.cortes.length + grupo.materiales.length;
        if (totalItems > 0) {
            html += `
                <div class="report-item">
                    <span>${grupo.nombre}</span>
                    <strong>${totalItems} items</strong>
                </div>
            `;
        }
    });
    
    // Nota final
    html += `
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #e8f5e9; border-radius: 10px; border-left: 5px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32; font-weight: 600;">
                <i class="fas fa-info-circle"></i> NOTA: Todas las barras son de 6 metros (600 cm). 
                Entregar esta lista al proveedor de materiales.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #78909c; font-size: 0.9rem;">
            <p>Generado por OptiCorte PRO - ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
    modal.classList.add('active');
}

// ============================================
// FUNCIONES PARA REPORTES E IMPRESIÓN
// ============================================

function imprimirReporte() {
    const printContent = document.getElementById('reportContent').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lista de Compras - Construcción</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                .report-title { text-align: center; font-size: 24px; margin-bottom: 30px; color: #0d47a1; border-bottom: 3px solid #ff9800; padding-bottom: 10px; }
                .report-section { margin-bottom: 25px; }
                .report-section h4 { color: #ff9800; font-size: 18px; margin-bottom: 15px; }
                .report-item { display: flex; justify-content: space-between; padding: 10px; background-color: #f5f5f5; margin-bottom: 8px; border-radius: 5px; }
                .note { background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 30px; border-left: 5px solid #4caf50; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    renderizarGrupos();
}

async function descargarReporteImagen() {
    try {
        const reportContent = document.getElementById('reportContent');
        const canvas = await html2canvas(reportContent, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `lista-compras-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        mostrarAlerta('Lista de compras descargada como imagen.', 'success');
    } catch (error) {
        console.error('Error al generar imagen:', error);
        mostrarAlerta('Error al generar la imagen. Intenta imprimir en su lugar.', 'error');
    }
}

function copiarListaCompras() {
    const items = document.querySelectorAll('.shopping-list-item');
    let text = 'LISTA DE COMPRAS - CONSTRUCCIÓN\n';
    text += '===============================\n\n';
    
    items.forEach(item => {
        const titulo = item.querySelector('.shopping-list-title').textContent.trim();
        const cantidad = item.querySelector('.shopping-list-qty').textContent.trim();
        text += `• ${titulo}: ${cantidad}\n`;
    });
    
    text += `\nGenerado el: ${new Date().toLocaleDateString()}\n`;
    text += 'Programa: OptiCorte PRO';
    
    navigator.clipboard.writeText(text)
        .then(() => mostrarAlerta('Lista copiada al portapapeles.', 'success'))
        .catch(() => mostrarAlerta('Error al copiar la lista.', 'error'));
}

function imprimirListaCompras() {
    const printContent = document.getElementById('shoppingListContainer').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lista de Compras Simplificada</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #0d47a1; text-align: center; }
                .shopping-list-item { margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h2>Lista de Compras - Construcción</h2>
            ${printContent}
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    renderizarGrupos();
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function mostrarAlerta(mensaje, tipo = 'info') {
    // Eliminar alertas anteriores
    const alertasAnteriores = document.querySelectorAll('.alert-floating');
    alertasAnteriores.forEach(alerta => alerta.remove());
    
    // Crear nueva alerta
    const alerta = document.createElement('div');
    alerta.className = `alert-floating alert-${tipo}`;
    alerta.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(alerta);
    
    // Estilos para la alerta
    const estilos = document.createElement('style');
    estilos.textContent = `
        .alert-floating {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 20px 30px;
            border-radius: 15px;
            color: white;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideIn 0.4s ease, fadeOut 0.4s ease 4.6s forwards;
            max-width: 500px;
            font-size: 1.1rem;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.2);
        }
        .alert-success { 
            background: linear-gradient(45deg, rgba(46, 204, 113, 0.9), rgba(39, 174, 96, 0.9));
            border-color: rgba(46, 204, 113, 0.3);
        }
        .alert-error { 
            background: linear-gradient(45deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9));
            border-color: rgba(231, 76, 60, 0.3);
        }
        .alert-info { 
            background: linear-gradient(45deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9));
            border-color: rgba(52, 152, 219, 0.3);
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(estilos);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

function cerrarModales() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('optiCorte_grupos', JSON.stringify(grupos));
    localStorage.setItem('optiCorte_nextCutId', JSON.stringify(nextCutId));
    localStorage.setItem('optiCorte_nextGroupId', JSON.stringify(nextGroupId));
    localStorage.setItem('optiCorte_nextMaterialId', JSON.stringify(nextMaterialId));
}

function limpiarTodo() {
    if (!confirm('¿ESTÁS SEGURO DE QUE QUIERES ELIMINAR TODOS LOS PROYECTOS, CORTES Y MATERIALES?\n\nEsta acción NO se puede deshacer.')) {
        return;
    }
    
    grupos = [];
    nextCutId = 1;
    nextGroupId = 1;
    nextMaterialId = 1;
    
    localStorage.removeItem('optiCorte_grupos');
    localStorage.removeItem('optiCorte_nextCutId');
    localStorage.removeItem('optiCorte_nextGroupId');
    localStorage.removeItem('optiCorte_nextMaterialId');
    
    actualizarListaGruposSelect();
    renderizarGrupos();
    
    // Limpiar resultados
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-chart-line"></i>
            <p>Los resultados aparecerán aquí después de calcular la optimización.</p>
        </div>
    `;
    
    document.getElementById('shoppingListContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-cart-shopping"></i>
            <p>Aquí aparecerá la lista simplificada para enviar al dueño o comprador.</p>
        </div>
    `;
    
    document.querySelector('.shopping-actions').style.display = 'none';
    document.getElementById('generateReportBtn').disabled = true;
    
    mostrarAlerta('Todos los datos han sido eliminados.', 'success');
}

// ============================================
// FUNCIONES GLOBALES (para acceso desde HTML)
// ============================================

window.eliminarGrupo = eliminarGrupo;
window.editarGrupo = editarGrupo;
window.eliminarCorte = eliminarCorte;
window.editarCorte = editarCorte;
window.eliminarMaterial = eliminarMaterial;

// ============================================
// INICIALIZACIÓN FINAL
// ============================================

console.log('OptiCorte PRO cargado correctamente.');