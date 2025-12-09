/* ------------------------------------------------------------------
   VARIABLES GLOBALES
------------------------------------------------------------------- */
let milCalcHistory = [];
let datosRegistrados = [];
let currentLanguage = 'es';
let modoDisparo = 'indirecto';  // Modo inicial indirecto
let manualModoDisparo = 'indirecto'; // Modo inicial para vista datos

/* ------------------------------------------------------------------
   FUNCIONES DE IDIOMAS
------------------------------------------------------------------- */
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('currentLanguage', lang);
  updateUI();
  updateResultado();
  updateImageAltText();
}

function getCurrentLanguage() {
  const savedLang = localStorage.getItem('currentLanguage');
  return (savedLang && i18n[savedLang]) ? savedLang : 'es';
}

function updateUI() {
  const langData = i18n[currentLanguage];

  /* Actualizar los elementos con data‑i18n */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langData[key]) el.textContent = langData[key];
  });

  /* Actualizar elementos con data‑i18n-alt (para atributos alt) */
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (langData[key]) el.alt = langData[key];
  });

  /* Actualizar tooltips de botones de modo - verificar existencia */
  const btnDirecto = document.getElementById('btnDirecto');
  const btnIndirecto = document.getElementById('btnIndirecto');
  const btnManualDirecto = document.getElementById('btnManualDirecto');
  const btnManualIndirecto = document.getElementById('btnManualIndirecto');
  
  if (btnDirecto) btnDirecto.title = langData.directFireTooltip;
  if (btnIndirecto) btnIndirecto.title = langData.indirectFireTooltip;
  if (btnManualDirecto) btnManualDirecto.title = langData.directFireTooltip;
  if (btnManualIndirecto) btnManualIndirecto.title = langData.indirectFireTooltip;
  
  /* Actualizar placeholders */
  const distancia = document.getElementById('distancia');
  const terrenoMIL = document.getElementById('terrenoMIL');
  const inputTerreno = document.getElementById('inputTerreno');
  const inputCanon = document.getElementById('inputCanon');
  const inputDistancia = document.getElementById('inputDistancia');
  
  if (distancia) distancia.placeholder = langData.distance;
  if (terrenoMIL) terrenoMIL.placeholder = langData.terrainElevation;
  if (inputTerreno) inputTerreno.placeholder = langData.terrainElevation;
  if (inputCanon) inputCanon.placeholder = langData.canonMIL;
  if (inputDistancia) inputDistancia.placeholder = langData.distance;
  
  /* Actualizar título del botón de navegación */
  const btnNav = document.getElementById('btnNavegar');
  const vistaCalc = document.getElementById('vistaCalculadora');
  if (btnNav && vistaCalc) {
    if (vistaCalc.classList.contains('activa')) {
      btnNav.title = langData.toggleViewBtnFront;
    } else {
      btnNav.title = langData.toggleViewBtnBack;
    }
  }

  /* Actualizar botones de modo */
  updateFireModeButtons();
  renderMILCalcHistory();
  renderDatosGuardados();

  /* Marcar botón de idioma activo */
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-lang="${currentLanguage}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function updateImageAltText() {
  // Función placeholder para futuras imágenes
  // No hace nada si no hay imágenes
}

/* ------------------------------------------------------------------
   MODO DE DISPARO (calculadora)
------------------------------------------------------------------- */
function toggleFireMode(mode) {
  modoDisparo = mode;
  const btnDirecto = document.getElementById('btnDirecto');
  const btnIndirecto = document.getElementById('btnIndirecto');

  if (btnDirecto) btnDirecto.classList.toggle('active', mode === 'directo');
  if (btnIndirecto) btnIndirecto.classList.toggle('active', mode === 'indirecto');
}

function updateFireModeButtons() {
  const langData = i18n[currentLanguage];
  const selectorSPA = document.getElementById('selectorSPA');
  const btnDirecto = document.getElementById('btnDirecto');
  const btnIndirecto = document.getElementById('btnIndirecto');

  if (!selectorSPA || !btnDirecto || !btnIndirecto) return;

  const spaType = selectorSPA.value;

  btnDirecto.title = langData.directFireTooltip;
  btnIndirecto.title = langData.indirectFireTooltip;

  /* Bishop no tiene modo directo */
  if (spaType === "Bishop SP 25pdr") {
    btnDirecto.disabled = true;
    if (modoDisparo === 'directo') toggleFireMode('indirecto');
  } else {
    btnDirecto.disabled = false;
  }
}

/* ------------------------------------------------------------------
   RESET DE BOTONES DE MODO DE DISPARO
------------------------------------------------------------------- */
function resetFireModeButtons() {
  // Vista calculadora
  const spaCalc = document.getElementById('selectorSPA');
  const btnDirCalc = document.getElementById('btnDirecto');
  const btnIndCalc = document.getElementById('btnIndirecto');
  
  if (spaCalc && btnDirCalc && btnIndCalc) {
    const spaType = spaCalc.value;
    
    if (spaType === "Bishop SP 25pdr") {
      btnDirCalc.disabled = true;
      if (modoDisparo === 'directo') toggleFireMode('indirecto');
    } else {
      btnDirCalc.disabled = false;
    }
  }
  
  // Vista datos
  const spaDatos = document.getElementById('inputSPA');
  const btnDirDatos = document.getElementById('btnManualDirecto');
  const btnIndDatos = document.getElementById('btnManualIndirecto');
  
  if (spaDatos && btnDirDatos && btnIndDatos) {
    const spaType = spaDatos.value;
    
    if (spaType === "Bishop SP 25pdr") {
      btnDirDatos.disabled = true;
      setManualFireMode('indirecto');
    } else {
      btnDirDatos.disabled = false;
      setManualFireMode(manualModoDisparo);
    }
  }
}

/* ------------------------------------------------------------------
   TABLA DE CONVERSIONES RÁPIDAS
------------------------------------------------------------------- */

// Datos de ejemplo de la tabla de conversiones
const quickConversionData = [
  { distance: 50, kv2: -17, sherman: -17, brummbar: -17, panzer3: -17, churchill: -8, bishop: null },
  { distance: 100, kv2: 14, sherman: 14, brummbar: 14, panzer3: 14, churchill: 11, bishop: null },
  { distance: 150, kv2: 39, sherman: 39, brummbar: 39, panzer3: 39, churchill: 27, bishop: null },
  { distance: 200, kv2: 64, sherman: 64, brummbar: 64, panzer3: 64, churchill: 44, bishop: 133 },
  { distance: 250, kv2: 88, sherman: 88, brummbar: 88, panzer3: 88, churchill: 61, bishop: 150 },
  { distance: 300, kv2: 113, sherman: 113, brummbar: 113, panzer3: 113, churchill: 78, bishop: 167 },
  { distance: 350, kv2: 140, sherman: 140, brummbar: 140, panzer3: 140, churchill: 95, bishop: 184 },
  { distance: 400, kv2: 164, sherman: 164, brummbar: 164, panzer3: 164, churchill: 112, bishop: 200 },
  { distance: 450, kv2: 188, sherman: 188, brummbar: 188, panzer3: 188, churchill: 128, bishop: 216 },
  { distance: 500, kv2: 213, sherman: 213, brummbar: 213, panzer3: 213, churchill: 146, bishop: 233 },
  { distance: 550, kv2: 240, sherman: 240, brummbar: 240, panzer3: 240, churchill: 162, bishop: 250 },
  { distance: 600, kv2: 262, sherman: 262, brummbar: 262, panzer3: 262, churchill: 177, bishop: 267 }
];

function generateQuickTable() {
  const tbody = document.getElementById('quickTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  quickConversionData.forEach(row => {
    const tr = document.createElement('tr');
    
    // Distancia
    const tdDist = document.createElement('td');
    tdDist.textContent = row.distance;
    tdDist.style.fontWeight = 'bold';
    tdDist.style.color = '#d9c45f';
    tr.appendChild(tdDist);
    
    // KV-2
    const tdKv2 = document.createElement('td');
    tdKv2.textContent = row.kv2 !== null ? row.kv2 : 'N/A';
    tdKv2.className = 'kv2-mil';
    tr.appendChild(tdKv2);
    
    // Sherman 105
    const tdSherman = document.createElement('td');
    tdSherman.textContent = row.sherman !== null ? row.sherman : 'N/A';
    tdSherman.className = 'sherman-mil';
    tr.appendChild(tdSherman);
    
    // Brummbär
    const tdBrummbar = document.createElement('td');
    tdBrummbar.textContent = row.brummbar !== null ? row.brummbar : 'N/A';
    tdBrummbar.className = 'brummbar-mil';
    tr.appendChild(tdBrummbar);
    
    // Panzer III
    const tdPanzer3 = document.createElement('td');
    tdPanzer3.textContent = row.panzer3 !== null ? row.panzer3 : 'N/A';
    tdPanzer3.className = 'panzer3-mil';
    tr.appendChild(tdPanzer3);
    
    // Churchill
    const tdChurchill = document.createElement('td');
    tdChurchill.textContent = row.churchill !== null ? row.churchill : 'N/A';
    tdChurchill.className = 'churchill-mil';
    tr.appendChild(tdChurchill);
    
    // Bishop
    const tdBishop = document.createElement('td');
    tdBishop.textContent = row.bishop !== null ? row.bishop : 'N/A';
    tdBishop.className = 'bishop-mil';
    tr.appendChild(tdBishop);
    
    tbody.appendChild(tr);
  });
}

function updateQuickTableTranslations() {
  const langData = i18n[currentLanguage];
  
  // Actualizar encabezados si existen
  document.querySelectorAll('[data-i18n="tableKv2MIL"]').forEach(el => {
    if (langData.tableKv2MIL) el.textContent = langData.tableKv2MIL;
  });
  
  document.querySelectorAll('[data-i18n="tableShermanMIL"]').forEach(el => {
    if (langData.tableShermanMIL) el.textContent = langData.tableShermanMIL;
  });
  
  document.querySelectorAll('[data-i18n="tableBrummbarMIL"]').forEach(el => {
    if (langData.tableBrummbarMIL) el.textContent = langData.tableBrummbarMIL;
  });
  
  document.querySelectorAll('[data-i18n="tablePanzer3MIL"]').forEach(el => {
    if (langData.tablePanzer3MIL) el.textContent = langData.tablePanzer3MIL;
  });
  
  document.querySelectorAll('[data-i18n="tableChurchillMIL"]').forEach(el => {
    if (langData.tableChurchillMIL) el.textContent = langData.tableChurchillMIL;
  });
  
  document.querySelectorAll('[data-i18n="tableBishopMIL"]').forEach(el => {
    if (langData.tableBishopMIL) el.textContent = langData.tableBishopMIL;
  });
}

/* ------------------------------------------------------------------
   CÁLCULO MIL
------------------------------------------------------------------- */
function getSPATable() {
  const selectorSPA = document.getElementById('selectorSPA');
  if (!selectorSPA) return null;
  
  const spaType = selectorSPA.value;
  if (!conversionTables[spaType]) return null;
  return modoDisparo === 'directo'
         ? conversionTables[spaType].directo
         : conversionTables[spaType].indirecto;
}

function interpolateMIL(distance) {
  const table = getSPATable();
  if (!table) {
    alert('❌ No hay tabla disponible para este SPA');
    return null;
  }

  const sorted = [...table].sort((a,b)=>a.m-b.m);
  const minDist = sorted[0].m;
  const maxDist = sorted[sorted.length-1].m;

  if (distance < minDist)
    return { mil: sorted[0].mil, warning:`⚠️ Distancia mínima: ${minDist}m` };
  if (distance > maxDist)
    return { mil: sorted[sorted.length-1].mil,
             warning:`⚠️ Distancia máxima: ${maxDist}m` };

  const exact = sorted.find(e=>e.m===distance);
  if (exact) return { mil: exact.mil, warning:null };

  for(let i=0;i<sorted.length-1;i++){
    const a=sorted[i], b=sorted[i+1];
    if(distance>a.m && distance<b.m){
      const ratio=(distance-a.m)/(b.m-a.m);
      return { mil:a.mil + ratio*(b.mil - a.mil), warning:null };
    }
  }
  return null;
}

function calculateMILFinal() {
  const distanciaEl = document.getElementById('distancia');
  const terrenoEl = document.getElementById('terrenoMIL');
  const warningDiv = document.getElementById('warningDiv');
  const resultadoMIL = document.getElementById('resultadoMIL');
  const infoDisparo = document.getElementById('infoDisparo');
  const selectorSPA = document.getElementById('selectorSPA');
  
  if (!distanciaEl || !terrenoEl || !resultadoMIL || !infoDisparo || !selectorSPA) {
    console.error('Elementos necesarios no encontrados');
    return;
  }
  
  if (!distanciaEl.value || !terrenoEl.value) {
    alert(i18n[currentLanguage].saveDataError);
    return;
  }
  
  const distance   = parseFloat(distanciaEl.value);
  const terrainMIL = parseFloat(terrenoEl.value);

  if (warningDiv) warningDiv.innerHTML = '';

  if (isNaN(distance) || isNaN(terrainMIL)) {
    alert('⚠️ Por favor, introduce valores válidos');
    return;
  }

  const result = interpolateMIL(distance);
  if (!result) { alert('❌ Error al calcular MIL'); return; }

  if (result.warning && warningDiv)
    warningDiv.innerHTML = `<div class="warning">${result.warning}</div>`;

  const finalMIL = (result.mil - terrainMIL).toFixed(2);
  resultadoMIL.textContent = `${finalMIL} MIL`;
  const spaType = selectorSPA.value;
  const modoText = i18n[currentLanguage][modoDisparo==='directo'?'directFire':'indirectFire'];
  infoDisparo.innerHTML = `<strong>${spaType}</strong> | ${modoText} | ${distance}m`;

  const historyEntry = {
    spa: spaType,
    modo: modoDisparo,
    distancia: distance,
    terreno: terrainMIL,
    resultado: finalMIL,
    fecha: new Date().toLocaleTimeString()
  };

  milCalcHistory.unshift(historyEntry);
  if (milCalcHistory.length>20) milCalcHistory.pop();

  saveMILCalcHistory();
  renderMILCalcHistory();
}

/* ------------------------------------------------------------------
   HISTORIAL DE CÁLCULOS
------------------------------------------------------------------- */
function renderMILCalcHistory() {
  const list = document.getElementById('listaHistorialMIL');
  if (!list) return;
  
  list.innerHTML = '';

  if (milCalcHistory.length===0){
    list.innerHTML=`<li style="color:#888;text-align:center;">${i18n[currentLanguage].noRecentCalcs}</li>`;
    return;
  }

  milCalcHistory.forEach(entry=>{
    const li=document.createElement('li');
    const modoText=i18n[currentLanguage][entry.modo==='directo'?'directFire':'indirectFire'];
    li.innerHTML=
      `<span class="resaltar-mil">${entry.resultado} MIL</span> | 
       <span class="resaltar-spa">${entry.spa}</span> | 
       <span class="resaltar-modo">${modoText}</span> | 
       ${entry.distancia}m | Terreno: ${entry.terreno}
       <span style="color:#666;font-size:11px;float:right;">${entry.fecha}</span>`;
    list.appendChild(li);
  });
}

function saveMILCalcHistory(){
  localStorage.setItem('milCalcHistory', JSON.stringify(milCalcHistory));
}

function clearMILCalcHistory(){
  if(confirm(i18n[currentLanguage].deleteDataConfirm)){
    milCalcHistory=[];
    saveMILCalcHistory();
    renderMILCalcHistory();
  }
}

/* ------------------------------------------------------------------
   DATOS GUARDADOS POR EL USUARIO
------------------------------------------------------------------- */
function setManualFireMode(mode) {
  const inputSPA = document.getElementById('inputSPA');
  const btnDirecto = document.getElementById('btnManualDirecto');
  const btnIndirecto = document.getElementById('btnManualIndirecto');
  
  if (!inputSPA || !btnDirecto || !btnIndirecto) return;
  
  const spa = inputSPA.value;
  
  // Si es Bishop y modo directo, forzar modo indirecto
  if (spa === "Bishop SP 25pdr" && mode === "directo") {
    mode = "indirecto";
  }
  
  manualModoDisparo = mode;

  // Activar / desactivar los botones visualmente
  btnDirecto.classList.toggle('active', mode === 'directo');
  btnIndirecto.classList.toggle('active', mode === 'indirecto');

  /* Si el SPA es Bishop no puede usar modo directo */
  if (spa === "Bishop SP 25pdr") {
    btnDirecto.disabled = true;
  } else {
    btnDirecto.disabled = false;
  }
}

function guardarDatoManual() {
  const inputSPA = document.getElementById('inputSPA');
  const inputTerreno = document.getElementById('inputTerreno');
  const inputCanon = document.getElementById('inputCanon');
  const inputDistancia = document.getElementById('inputDistancia');
  
  if (!inputSPA || !inputTerreno || !inputCanon || !inputDistancia) {
    console.error('Elementos del formulario no encontrados');
    return;
  }
  
  const spa = inputSPA.value;
  const modo = manualModoDisparo;
  const terreno = parseFloat(inputTerreno.value);
  const canon = parseFloat(inputCanon.value);
  const distancia = parseFloat(inputDistancia.value);

  if (isNaN(terreno)||isNaN(canon)||isNaN(distancia)){
    alert(i18n[currentLanguage].saveDataError); 
    return;
  }

  datosRegistrados.push({
    id: Date.now(),
    spa,
    modo_disparo: modo,
    elevacion_terreno: terreno,
    mil_canon: canon,
    distancia,
    fecha: new Date().toISOString()
  });

  guardarDatosJSON();
  renderDatosGuardados();
  limpiarFormularioDatos();
  alert(i18n[currentLanguage].saveDataSuccess);
}

function limpiarFormularioDatos(){
  const inputTerreno = document.getElementById('inputTerreno');
  const inputCanon = document.getElementById('inputCanon');
  const inputDistancia = document.getElementById('inputDistancia');
  
  if (inputTerreno) inputTerreno.value='';
  if (inputCanon) inputCanon.value='';
  if (inputDistancia) inputDistancia.value='';
}

function renderDatosGuardados() {
  const list = document.getElementById('listaDatosGuardados');
  const contadorDatos = document.getElementById('contadorDatos');
  
  if (!list) return;
  
  if (contadorDatos) contadorDatos.textContent = datosRegistrados.length;
  list.innerHTML='';

  if(datosRegistrados.length===0){
    list.innerHTML=`<li style="color:#888;text-align:center;">${i18n[currentLanguage].noDataRegistered}</li>`;
    return;
  }

  [...datosRegistrados].reverse().forEach(dato=>{
    const li=document.createElement('li');
    li.className='dato-item';
    const modoText=i18n[currentLanguage][dato.modo_disparo==='directo'?'directFire':'indirectFire'];
    li.innerHTML=
      `<span class="dato-info">
        <span class="resaltar-spa">${dato.spa}</span> | 
        <span class="resaltar-modo">${modoText}</span> | 
        MIL: <span class="resaltar-mil">${dato.mil_canon}</span> | 
        Dist: <span class="resaltar-distancia">${dato.distancia}m</span> | 
        Terreno: <span class="resaltar-terreno">${dato.elevacion_terreno}</span>
      </span>
      <button class="btn-eliminar btn-danger" onclick="eliminarDato(${dato.id})">✕</button>`;
    list.appendChild(li);
  });
}

function eliminarDato(id){
  if(confirm(i18n[currentLanguage].deleteDataConfirm)){
    datosRegistrados=datosRegistrados.filter(d=>d.id!==id);
    guardarDatosJSON();
    renderDatosGuardados();
  }
}

function guardarDatosJSON(){
  localStorage.setItem('datosRegistrados', JSON.stringify(datosRegistrados));
}

function cargarDatosJSON(){
  const saved=localStorage.getItem('datosRegistrados');
  if(saved) datosRegistrados=JSON.parse(saved);
}

function borrarTodosDatos(){
  if(confirm(i18n[currentLanguage].deleteAllConfirm)){
    datosRegistrados=[];
    guardarDatosJSON();
    renderDatosGuardados();
  }
}

function exportarJSON(){
  if(datosRegistrados.length===0){
    alert(i18n[currentLanguage].exportError); return;
  }

  const blob=new Blob([JSON.stringify(datosRegistrados,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`datos_spa_hll_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------
   IMPORTAR CSV
------------------------------------------------------------------- */
function importarCSV(){
  const csvFile = document.getElementById('csvFile');
  if (!csvFile) return;
  
  const file = csvFile.files[0];
  if(!file){ alert(i18n[currentLanguage].importError); return; }

  const reader=new FileReader();
  reader.onload=e=>procesarCSV(e.target.result);
  reader.readAsText(file);
}

function procesarCSV(content){
  const lines=content.split('\n').filter(line=>line.trim());
  let importados=0, errores=0;
  const startIdx = lines[0].toLowerCase().includes('spa') ? 1 : 0;

  for(let i=startIdx;i<lines.length;i++){
    const cols=lines[i].split(',').map(c=>c.trim());
    if(cols.length<5){ errores++; continue; }

    const [spa, modo, terreno, canon, distancia] = cols;
    const t=parseFloat(terreno), c=parseFloat(canon), d=parseFloat(distancia);

    if(isNaN(t)||isNaN(c)||isNaN(d)){ errores++; continue; }

    datosRegistrados.push({
      id: Date.now()+i,
      spa,
      modo_disparo: modo.toLowerCase().includes('direc') ? 'directo' : 'indirecto',
      elevacion_terreno:t,
      mil_canon:c,
      distancia:d,
      fecha:new Date().toISOString()
    });
    importados++;
  }

  guardarDatosJSON();
  renderDatosGuardados();
  alert(`${i18n[currentLanguage].importSuccess}\n- ${importados} registros\n- ${errores} errores`);
  
  const csvFileInput = document.getElementById('csvFile');
  if (csvFileInput) csvFileInput.value='';
}

/* ------------------------------------------------------------------
   VISTA DE CALCULADORA / DATOS
------------------------------------------------------------------- */
function toggleVista(){
  const vistaCalc=document.getElementById('vistaCalculadora');
  const vistaDatos=document.getElementById('vistaDatos');
  const btnNav=document.getElementById('btnNavegar');

  if (!vistaCalc || !vistaDatos || !btnNav) return;

  if(vistaCalc.classList.contains('activa')){
    vistaCalc.classList.remove('activa');
    vistaDatos.classList.add('activa');
    btnNav.textContent='×';
    btnNav.classList.add('en-datos');
    btnNav.title=i18n[currentLanguage].toggleViewBtnBack;
  }else{
    vistaDatos.classList.remove('activa');
    vistaCalc.classList.add('activa');
    btnNav.textContent='+';
    btnNav.classList.remove('en-datos');
    btnNav.title=i18n[currentLanguage].toggleViewBtnFront;
  }
  
  // Resetear botones al cambiar de vista
  setTimeout(resetFireModeButtons, 10);
}

/* ------------------------------------------------------------------
   CARGA Y GUARDADO DE DATOS AL INICIAR
------------------------------------------------------------------- */
function loadHistory(){
  const savedCalc=localStorage.getItem('milCalcHistory');
  if(savedCalc) milCalcHistory=JSON.parse(savedCalc);

  cargarDatosJSON();
  currentLanguage=getCurrentLanguage();
  
  // Inicializar modo manual
  setManualFireMode(manualModoDisparo);
  
  updateUI();

  // Renderizar el resultado de la última operación (si existe)
  updateResultado();
  
  // Configurar modal de imagen
  setupImageModal();
  
  // Generar tabla de conversiones rápidas
  generateQuickTable();
}

function setupImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById("modalImage");
  const captionText = document.getElementById("modalCaption");
  const quickConversionImage = document.getElementById('quickConversionImage');
  const closeBtn = document.querySelector('.close-modal');

  if (quickConversionImage && modal && modalImg && captionText) {
    quickConversionImage.onclick = function() {
      modal.style.display = "block";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
    }
  }

  if (closeBtn && modal) {
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
  }

  if (modal) {
    modal.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
  }
}

/* ------------------------------------------------------------------
   FUNCIÓN QUE RE‑RENDERIZA EL RESULTADO AL CAMBIAR DE IDIOMA
------------------------------------------------------------------- */
function updateResultado(){
  if(!milCalcHistory.length) return;

  const last=milCalcHistory[0];
  const resEl=document.getElementById('resultadoMIL');
  const infoEl=document.getElementById('infoDisparo');

  if(!resEl||!infoEl) return;

  resEl.textContent=`${last.resultado} MIL`;
  const modoText=i18n[currentLanguage][last.modo==='directo'?'directFire':'indirectFire'];
  infoEl.innerHTML=`<strong>${last.spa}</strong> | ${modoText} | ${last.distancia}m`;
}

/* ------------------------------------------------------------------
   EVENT LISTENERS
------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  // Botones de navegación y cálculo
  const btnNavegar = document.getElementById('btnNavegar');
  const calcularBtn = document.getElementById('calcularBtn');
  const borrarHistorialMIL = document.getElementById('borrarHistorialMIL');

  if (btnNavegar) btnNavegar.addEventListener('click', toggleVista);
  if (calcularBtn) calcularBtn.addEventListener('click', calculateMILFinal);
  if (borrarHistorialMIL) borrarHistorialMIL.addEventListener('click', clearMILCalcHistory);

  // Botones de modo en vista calculadora
  const btnDirecto = document.getElementById('btnDirecto');
  const btnIndirecto = document.getElementById('btnIndirecto');
  
  if (btnDirecto) btnDirecto.addEventListener('click',()=>toggleFireMode('directo'));
  if (btnIndirecto) btnIndirecto.addEventListener('click',()=>toggleFireMode('indirecto'));

  // Botones de modo en vista datos
  const btnManualDirecto = document.getElementById('btnManualDirecto');
  const btnManualIndirecto = document.getElementById('btnManualIndirecto');
  
  if (btnManualDirecto) btnManualDirecto.addEventListener('click',()=>setManualFireMode('directo'));
  if (btnManualIndirecto) btnManualIndirecto.addEventListener('click',()=>setManualFireMode('indirecto'));

  // Selectores de idioma
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.addEventListener('click',()=>setLanguage(btn.dataset.lang));
  });

  // Eventos de datos
  const btnGuardarDato = document.getElementById('btnGuardarDato');
  const btnImportarCSV = document.getElementById('btnImportarCSV');
  const btnExportarJSON = document.getElementById('btnExportarJSON');
  const btnBorrarDatos = document.getElementById('btnBorrarDatos');
  
  if (btnGuardarDato) btnGuardarDato.addEventListener('click', guardarDatoManual);
  if (btnImportarCSV) btnImportarCSV.addEventListener('click', importarCSV);
  if (btnExportarJSON) btnExportarJSON.addEventListener('click', exportarJSON);
  if (btnBorrarDatos) btnBorrarDatos.addEventListener('click', borrarTodosDatos);

  // Eventos al cambiar SPA
  const selectorSPA = document.getElementById('selectorSPA');
  const inputSPA = document.getElementById('inputSPA');
  
  if (selectorSPA) selectorSPA.addEventListener('change', resetFireModeButtons);
  if (inputSPA) inputSPA.addEventListener('change', resetFireModeButtons);

  // Eventos Enter en inputs
  const distancia = document.getElementById('distancia');
  const terrenoMIL = document.getElementById('terrenoMIL');
  
  if (distancia) {
    distancia.addEventListener('keyup',e=>{
      if(e.key==='Enter') calculateMILFinal();
    });
  }
  
  if (terrenoMIL) {
    terrenoMIL.addEventListener('keyup',e=>{
      if(e.key==='Enter') calculateMILFinal();
    });
  }

  const inputTerreno = document.getElementById('inputTerreno');
  const inputCanon = document.getElementById('inputCanon');
  const inputDistancia = document.getElementById('inputDistancia');
  
  if (inputTerreno) {
    inputTerreno.addEventListener('keyup',e=>{
      if(e.key==='Enter') guardarDatoManual();
    });
  }
  
  if (inputCanon) {
    inputCanon.addEventListener('keyup',e=>{
      if(e.key==='Enter') guardarDatoManual();
    });
  }
  
  if (inputDistancia) {
    inputDistancia.addEventListener('keyup',e=>{
      if(e.key==='Enter') guardarDatoManual();
    });
  }

  // Cerrar modal con tecla ESC
  document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.key === 'Escape' && modal && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });

  // Cargar al iniciar
  loadHistory();
});

// Hacer funciones accesibles globalmente para eventos onclick en HTML
window.eliminarDato = eliminarDato;