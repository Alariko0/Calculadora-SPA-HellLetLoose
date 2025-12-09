// ================================================
// TABLAS COMUNES PARA OPTIMIZACIÓN
// ================================================

// Sistema de cache global
const interpolationCache = new Map();

// Tabla común para la mayoría de SPA (KV-2, Sherman M4A3 105, etc.)
const commonDirectTable = [
  {m:20, mil:-87},{m:25, mil:-35},{m:30, mil:-30},{m:35, mil:-27},{m:40, mil:-23},
  {m:45, mil:-20},{m:50, mil:-17},{m:55, mil:-15},{m:60, mil:-12},{m:65, mil:-10},
  {m:70, mil:-4},{m:75, mil:1},{m:80, mil:4},{m:85, mil:6},{m:90, mil:9},
  {m:95, mil:11},{m:100, mil:14},{m:105, mil:16},{m:110, mil:19},{m:115, mil:21},
  {m:120, mil:24},{m:125, mil:26},{m:130, mil:29},{m:135, mil:31},{m:140, mil:34},
  {m:145, mil:36},{m:150, mil:39},{m:155, mil:42},{m:160, mil:45},{m:165, mil:48},
  {m:170, mil:50},{m:175, mil:53},{m:180, mil:55},{m:185, mil:57},{m:190, mil:60},
  {m:195, mil:62},{m:200, mil:64},{m:205, mil:66},{m:210, mil:68},{m:215, mil:70},
  {m:220, mil:73},{m:225, mil:75},{m:230, mil:78},{m:235, mil:80},{m:240, mil:83},
  {m:245, mil:85},{m:250, mil:88},{m:255, mil:90},{m:260, mil:93},{m:265, mil:95},
  {m:270, mil:98},{m:275, mil:100},{m:280, mil:103},{m:285, mil:105},{m:290, mil:108},
  {m:295, mil:111},{m:300, mil:113},{m:305, mil:116},{m:310, mil:119},{m:315, mil:121},
  {m:320, mil:124},{m:325, mil:127},{m:330, mil:129},{m:335, mil:132},{m:340, mil:135},
  {m:345, mil:137},{m:350, mil:140},{m:355, mil:143},{m:360, mil:145},{m:365, mil:148},
  {m:370, mil:150},{m:375, mil:153},{m:380, mil:155},{m:385, mil:157},{m:390, mil:160},
  {m:395, mil:162},{m:400, mil:164},{m:405, mil:167},{m:410, mil:169},{m:415, mil:171},
  {m:420, mil:174},{m:425, mil:176},{m:430, mil:179},{m:435, mil:181},{m:440, mil:183},
  {m:445, mil:186},{m:450, mil:188},{m:455, mil:190},{m:460, mil:193},{m:465, mil:195},
  {m:470, mil:197},{m:475, mil:200},{m:480, mil:202},{m:485, mil:205},{m:490, mil:208},
  {m:495, mil:210},{m:500, mil:213},{m:505, mil:216},{m:510, mil:218},{m:515, mil:221},
  {m:520, mil:224},{m:525, mil:226},{m:530, mil:229},{m:535, mil:232},{m:540, mil:234},
  {m:545, mil:237},{m:550, mil:240},{m:555, mil:242},{m:560, mil:245},{m:565, mil:248},
  {m:570, mil:250},{m:575, mil:252},{m:580, mil:254},{m:585, mil:256},{m:590, mil:258},
  {m:595, mil:260},{m:600, mil:262}
];

const commonIndirectTable = [
  {m:200, mil:533},{m:205, mil:530},{m:210, mil:527},{m:215, mil:524},{m:220, mil:520},
  {m:225, mil:517},{m:230, mil:514},{m:235, mil:510},{m:240, mil:507},{m:245, mil:504},
  {m:250, mil:500},{m:255, mil:497},{m:260, mil:493},{m:265, mil:490},{m:270, mil:487},
  {m:275, mil:483},{m:280, mil:480},{m:285, mil:477},{m:290, mil:473},{m:295, mil:470},
  {m:300, mil:467},{m:305, mil:463},{m:310, mil:460},{m:315, mil:456},{m:320, mil:453},
  {m:325, mil:450},{m:330, mil:446},{m:335, mil:443},{m:340, mil:440},{m:345, mil:436},
  {m:350, mil:433},{m:355, mil:430},{m:360, mil:427},{m:365, mil:424},{m:370, mil:420},
  {m:375, mil:417},{m:380, mil:414},{m:385, mil:410},{m:390, mil:407},{m:395, mil:403},
  {m:400, mil:400},{m:405, mil:397},{m:410, mil:393},{m:415, mil:390},{m:420, mil:386},
  {m:425, mil:383},{m:430, mil:380},{m:435, mil:376},{m:440, mil:373},{m:445, mil:370},
  {m:450, mil:367},{m:455, mil:364},{m:460, mil:360},{m:465, mil:357},{m:470, mil:354},
  {m:475, mil:350},{m:480, mil:347},{m:485, mil:344},{m:490, mil:340},{m:495, mil:337},
  {m:500, mil:333},{m:505, mil:330},{m:510, mil:327},{m:515, mil:323},{m:520, mil:320},
  {m:525, mil:317},{m:530, mil:313},{m:535, mil:310},{m:540, mil:307},{m:545, mil:303},
  {m:550, mil:300},{m:555, mil:296},{m:560, mil:293},{m:565, mil:290},{m:570, mil:286},
  {m:575, mil:283},{m:580, mil:280},{m:585, mil:276},{m:590, mil:273},{m:595, mil:270},
  {m:600, mil:267}
];

// Tabla especial para Churchill
const churchillDirectTable = [
  {m:20, mil:-20},{m:25, mil:-17},{m:30, mil:-15},{m:35, mil:-13},{m:40, mil:-11},
  {m:45, mil:-9},{m:50, mil:-8},{m:55, mil:-6},{m:60, mil:-4},{m:65, mil:-2},
  {m:70, mil:0},{m:75, mil:2},{m:80, mil:4},{m:85, mil:6},{m:90, mil:7},
  {m:95, mil:9},{m:100, mil:11},{m:105, mil:12},{m:110, mil:14},{m:115, mil:16},
  {m:120, mil:17},{m:125, mil:19},{m:130, mil:21},{m:135, mil:22},{m:140, mil:24},
  {m:145, mil:25},{m:150, mil:27},{m:155, mil:28},{m:160, mil:30},{m:165, mil:31},
  {m:170, mil:33},{m:175, mil:35},{m:180, mil:37},{m:185, mil:38},{m:190, mil:40},
  {m:195, mil:42},{m:200, mil:44},{m:205, mil:46},{m:210, mil:48},{m:215, mil:50},
  {m:220, mil:52},{m:225, mil:53},{m:230, mil:55},{m:235, mil:57},{m:240, mil:58},
  {m:245, mil:60},{m:250, mil:61},{m:255, mil:63},{m:260, mil:65},{m:265, mil:66},
  {m:270, mil:68},{m:275, mil:70},{m:280, mil:71},{m:285, mil:73},{m:290, mil:75},
  {m:295, mil:76},{m:300, mil:78},{m:305, mil:80},{m:310, mil:81},{m:315, mil:83},
  {m:320, mil:84},{m:325, mil:86},{m:330, mil:88},{m:335, mil:89},{m:340, mil:91},
  {m:345, mil:93},{m:350, mil:95},{m:355, mil:97},{m:360, mil:99},{m:365, mil:101},
  {m:370, mil:102},{m:375, mil:104},{m:380, mil:105},{m:385, mil:107},{m:390, mil:108},
  {m:395, mil:110},{m:400, mil:112},{m:405, mil:113},{m:410, mil:115},{m:415, mil:117},
  {m:420, mil:118},{m:425, mil:120},{m:430, mil:122},{m:435, mil:123},{m:440, mil:125},
  {m:445, mil:126},{m:450, mil:128},{m:455, mil:130},{m:460, mil:132},{m:465, mil:135},
  {m:470, mil:138},{m:475, mil:140},{m:480, mil:142},{m:485, mil:143},{m:490, mil:144},
  {m:495, mil:145},{m:500, mil:146},{m:505, mil:148},{m:510, mil:149},{m:515, mil:150},
  {m:520, mil:152},{m:525, mil:153},{m:530, mil:155},{m:535, mil:157},{m:540, mil:159},
  {m:545, mil:160},{m:550, mil:162},{m:555, mil:163},{m:560, mil:165},{m:565, mil:166},
  {m:570, mil:168},{m:575, mil:169},{m:580, mil:177},{m:585, mil:177},{m:590, mil:177},
  {m:595, mil:177},{m:600, mil:177}
];

const churchillIndirectTable = [
  {m:200, mil:356},{m:205, mil:354},{m:210, mil:352},{m:215, mil:349},{m:220, mil:347},
  {m:225, mil:345},{m:230, mil:343},{m:235, mil:340},{m:240, mil:338},{m:245, mil:336},
  {m:250, mil:333},{m:255, mil:331},{m:260, mil:329},{m:265, mil:327},{m:270, mil:324},
  {m:275, mil:322},{m:280, mil:320},{m:285, mil:318},{m:290, mil:316},{m:295, mil:313},
  {m:300, mil:311},{m:305, mil:309},{m:310, mil:307},{m:315, mil:304},{m:320, mil:302},
  {m:325, mil:300},{m:330, mil:297},{m:335, mil:295},{m:340, mil:293},{m:345, mil:291},
  {m:350, mil:288},{m:355, mil:286},{m:360, mil:284},{m:365, mil:282},{m:370, mil:280},
  {m:375, mil:278},{m:380, mil:276},{m:385, mil:274},{m:390, mil:272},{m:395, mil:269},
  {m:400, mil:267},{m:405, mil:265},{m:410, mil:262},{m:415, mil:260},{m:420, mil:258},
  {m:425, mil:256},{m:430, mil:253},{m:435, mil:251},{m:440, mil:249},{m:445, mil:247},
  {m:450, mil:245},{m:455, mil:242},{m:460, mil:240},{m:465, mil:238},{m:470, mil:236},
  {m:475, mil:233},{m:480, mil:231},{m:485, mil:229},{m:490, mil:226},{m:495, mil:224},
  {m:500, mil:222},{m:505, mil:220},{m:510, mil:217},{m:515, mil:215},{m:520, mil:213},
  {m:525, mil:211},{m:530, mil:209},{m:535, mil:206},{m:540, mil:204},{m:545, mil:202},
  {m:550, mil:200},{m:555, mil:198},{m:560, mil:196},{m:565, mil:193},{m:570, mil:191},
  {m:575, mil:189},{m:580, mil:187},{m:585, mil:185},{m:590, mil:182},{m:595, mil:180},
  {m:600, mil:178}
];

// Tabla especial para Bishop (solo indirecto)
const bishopIndirectTable = [
  {m:200, mil:133},{m:205, mil:135},{m:210, mil:136},{m:215, mil:138},{m:220, mil:140},
  {m:225, mil:141},{m:230, mil:143},{m:235, mil:145},{m:240, mil:147},{m:245, mil:148},
  {m:250, mil:150},{m:255, mil:152},{m:260, mil:153},{m:265, mil:155},{m:270, mil:157},
  {m:275, mil:158},{m:280, mil:160},{m:285, mil:162},{m:290, mil:163},{m:295, mil:165},
  {m:300, mil:167},{m:305, mil:168},{m:310, mil:170},{m:315, mil:172},{m:320, mil:174},
  {m:325, mil:175},{m:330, mil:177},{m:335, mil:179},{m:340, mil:180},{m:345, mil:182},
  {m:350, mil:184},{m:355, mil:185},{m:360, mil:187},{m:365, mil:189},{m:370, mil:190},
  {m:375, mil:192},{m:380, mil:194},{m:385, mil:195},{m:390, mil:197},{m:395, mil:198},
  {m:400, mil:200},{m:405, mil:202},{m:410, mil:203},{m:415, mil:205},{m:420, mil:206},
  {m:425, mil:208},{m:430, mil:210},{m:435, mil:211},{m:440, mil:213},{m:445, mil:215},
  {m:450, mil:216},{m:455, mil:218},{m:460, mil:220},{m:465, mil:221},{m:470, mil:223},
  {m:475, mil:225},{m:480, mil:227},{m:485, mil:228},{m:490, mil:230},{m:495, mil:232},
  {m:500, mil:233},{m:505, mil:235},{m:510, mil:237},{m:515, mil:238},{m:520, mil:240},
  {m:525, mil:242},{m:530, mil:243},{m:535, mil:245},{m:540, mil:247},{m:545, mil:248},
  {m:550, mil:250},{m:555, mil:252},{m:560, mil:254},{m:565, mil:255},{m:570, mil:257},
  {m:575, mil:259},{m:580, mil:260},{m:585, mil:262},{m:590, mil:264},{m:595, mil:265},
  {m:600, mil:267}
];

// ================================================
// CONVERSION TABLES OPTIMIZADO
// ================================================

const conversionTables = {
  // SPA con tablas comunes (4 SPA comparten los mismos valores)
  "KV-2": {
    directo: commonDirectTable,
    indirecto: commonIndirectTable
  },
  "Sherman M4A3 105": {
    directo: commonDirectTable,
    indirecto: commonIndirectTable
  },
  "Sturmpanzer IV Brummbär": {
    directo: commonDirectTable,
    indirecto: commonIndirectTable
  },
  "Panzer III Ausf.N": {
    directo: commonDirectTable,
    indirecto: commonIndirectTable
  },
  
  // SPA británicos con tablas especiales
  "Churchill Mk III A.V.R.E.": {
    directo: churchillDirectTable,
    indirecto: churchillIndirectTable
  },
  
  // Bishop solo tiene modo indirecto
  "Bishop SP 25pdr": {
    directo: null,  // No tiene modo directo
    indirecto: bishopIndirectTable
  }
};

// ================================================
// CLASE BALÍSTICA OPTIMIZADA CON CACHE
// ================================================

class BalisticsCalculator {
  /**
   * Interpolación con cache
   */
  static linearInterpolation(spaType, mode, distance, table) {
    if (!table || table.length === 0) return null;
    
    const cacheKey = `${spaType}_${mode}_${distance.toFixed(1)}`;
    
    // Verificar cache primero
    if (interpolationCache.has(cacheKey)) {
      return interpolationCache.get(cacheKey);
    }
    
    const sorted = [...table].sort((a, b) => a.m - b.m);
    
    // Si la distancia está fuera del rango, devolver el valor más cercano
    if (distance <= sorted[0].m) {
      const result = sorted[0].mil;
      interpolationCache.set(cacheKey, result);
      return result;
    }
    if (distance >= sorted[sorted.length - 1].m) {
      const result = sorted[sorted.length - 1].mil;
      interpolationCache.set(cacheKey, result);
      return result;
    }
    
    // Buscar el intervalo
    for (let i = 0; i < sorted.length - 1; i++) {
      if (distance >= sorted[i].m && distance <= sorted[i + 1].m) {
        const ratio = (distance - sorted[i].m) / (sorted[i + 1].m - sorted[i].m);
        const result = sorted[i].mil + ratio * (sorted[i + 1].mil - sorted[i].mil);
        interpolationCache.set(cacheKey, result);
        return result;
      }
    }
    
    return null;
  }
  
  /**
   * Interpolación cuadrática mejorada con cache
   */
  static quadraticInterpolation(spaType, mode, distance, table) {
    if (!table || table.length < 3) {
      return this.linearInterpolation(spaType, mode, distance, table);
    }
    
    const cacheKey = `${spaType}_${mode}_q_${distance.toFixed(1)}`;
    
    if (interpolationCache.has(cacheKey)) {
      return interpolationCache.get(cacheKey);
    }
    
    const sorted = [...table].sort((a, b) => a.m - b.m);
    
    if (distance <= sorted[0].m) {
      const result = sorted[0].mil;
      interpolationCache.set(cacheKey, result);
      return result;
    }
    if (distance >= sorted[sorted.length - 1].m) {
      const result = sorted[sorted.length - 1].mil;
      interpolationCache.set(cacheKey, result);
      return result;
    }
    
    // Encontrar índice del punto más cercano
    let idx = 0;
    while (idx < sorted.length - 1 && sorted[idx].m < distance) idx++;
    
    // Obtener 3 puntos alrededor
    const p0 = sorted[Math.max(0, idx - 1)];
    const p1 = sorted[idx];
    const p2 = sorted[Math.min(sorted.length - 1, idx + 1)];
    
    // Interpolación cuadrática de Lagrange
    const L0 = ((distance - p1.m) * (distance - p2.m)) / ((p0.m - p1.m) * (p0.m - p2.m));
    const L1 = ((distance - p0.m) * (distance - p2.m)) / ((p1.m - p0.m) * (p1.m - p2.m));
    const L2 = ((distance - p0.m) * (distance - p1.m)) / ((p2.m - p0.m) * (p2.m - p1.m));
    
    const result = L0 * p0.mil + L1 * p1.mil + L2 * p2.mil;
    interpolationCache.set(cacheKey, result);
    return result;
  }
  
  /**
   * Interpolación inteligente (elige el mejor método)
   */
  static smartInterpolation(spaType, mode, distance) {
    const table = conversionTables[spaType]?.[mode];
    if (!table || table.length === 0) return null;
    
    const cacheKey = `${spaType}_${mode}_s_${distance.toFixed(1)}`;
    
    if (interpolationCache.has(cacheKey)) {
      return interpolationCache.get(cacheKey);
    }
    
    // 1. Buscar valor exacto
    const exact = table.find(item => Math.abs(item.m - distance) < 0.001);
    if (exact) {
      interpolationCache.set(cacheKey, exact.mil);
      return exact.mil;
    }
    
    // 2. Usar interpolación cuadrática si hay suficientes puntos
    let result;
    if (table.length >= 3) {
      result = this.quadraticInterpolation(spaType, mode, distance, table);
    } else {
      result = this.linearInterpolation(spaType, mode, distance, table);
    }
    
    if (result !== null) {
      interpolationCache.set(cacheKey, result);
    }
    
    return result;
  }
  
  /**
   * Obtener rango válido de distancias
   */
  static getValidRange(spaType, mode) {
    const table = conversionTables[spaType]?.[mode];
    if (!table || table.length === 0) return { min: 0, max: 0 };
    
    const sorted = [...table].sort((a, b) => a.m - b.m);
    return {
      min: sorted[0].m,
      max: sorted[sorted.length - 1].m
    };
  }
  
  /**
   * Validar si una distancia es válida
   */
  static validateDistance(spaType, mode, distance) {
    const range = this.getValidRange(spaType, mode);
    return {
      isValid: distance >= range.min && distance <= range.max,
      min: range.min,
      max: range.max,
      message: distance < range.min 
        ? `⚠️ Distancia mínima: ${range.min}m` 
        : distance > range.max 
          ? `⚠️ Distancia máxima: ${range.max}m`
          : null
    };
  }
  
  /**
   * Limpiar cache
   */
  static clearCache() {
    interpolationCache.clear();
    console.log('🧹 Cache de interpolación limpiado');
  }
  
  /**
   * Obtener estadísticas del cache
   */
  static getCacheStats() {
    return {
      size: interpolationCache.size,
      keys: Array.from(interpolationCache.keys()).slice(0, 5) // Primeras 5 claves
    };
  }
  
  /**
   * Calcular estadísticas de error
   */
  static calculateError(spaType, mode) {
    const table = conversionTables[spaType]?.[mode];
    if (!table || table.length < 3) return null;
    
    let totalError = 0;
    let maxError = 0;
    let validPoints = 0;
    
    // Evaluar puntos intermedios
    for (let i = 1; i < table.length - 1; i++) {
      const point = table[i];
      const calculated = this.smartInterpolation(spaType, mode, point.m);
      
      if (calculated !== null) {
        const error = Math.abs(calculated - point.mil);
        totalError += error;
        if (error > maxError) maxError = error;
        validPoints++;
      }
    }
    
    if (validPoints === 0) return null;
    
    return {
      avgError: parseFloat((totalError / validPoints).toFixed(3)),
      maxError: parseFloat(maxError.toFixed(3)),
      points: validPoints
    };
  }
}

// ================================================
// FUNCIONES DE UTILIDAD (compatibles con tu script.js)
// ================================================

window.ballisticsUtils = {
  /**
   * Función principal de interpolación para tu script.js
   */
  interpolateMIL: function(distance) {
    const spaType = document.getElementById('selectorSPA')?.value;
    const mode = window.modoDisparo || 'indirecto';
    
    if (!spaType || !conversionTables[spaType]) {
      console.error('SPA no encontrado en tablas:', spaType);
      return null;
    }
    
    // Validar distancia
    const validation = BalisticsCalculator.validateDistance(spaType, mode, distance);
    
    // Calcular MIL
    const mil = BalisticsCalculator.smartInterpolation(spaType, mode, distance);
    
    if (mil === null) {
      console.error('No se pudo calcular MIL para:', { spaType, mode, distance });
      return null;
    }
    
    return { 
      mil: parseFloat(mil.toFixed(2)), 
      warning: validation.message,
      range: { min: validation.min, max: validation.max }
    };
  },
  
  /**
   * Obtener información del SPA
   */
  getSPAInfo: function(spaType) {
    const tables = conversionTables[spaType];
    if (!tables) return null;
    
    return {
      name: spaType,
      hasDirect: tables.directo && tables.directo.length > 0,
      hasIndirect: tables.indirecto && tables.indirecto.length > 0,
      directRange: tables.directo && tables.directo.length > 0 
        ? { min: tables.directo[0].m, max: tables.directo[tables.directo.length - 1].m }
        : null,
      indirectRange: tables.indirecto && tables.indirecto.length > 0
        ? { min: tables.indirecto[0].m, max: tables.indirecto[tables.indirecto.length - 1].m }
        : null
    };
  },
  
  /**
   * Generar tabla rápida para mostrar
   */
  generateQuickTable: function(spaType, mode, step = 50) {
    const table = conversionTables[spaType]?.[mode];
    if (!table) return [];
    
    const sorted = [...table].sort((a, b) => a.m - b.m);
    const min = sorted[0].m;
    const max = sorted[sorted.length - 1].m;
    
    const quickTable = [];
    for (let distance = min; distance <= max; distance += step) {
      const mil = BalisticsCalculator.smartInterpolation(spaType, mode, distance);
      if (mil !== null) {
        quickTable.push({ 
          distance, 
          mil: Math.round(mil * 10) / 10  // Redondear a 1 decimal
        });
      }
    }
    
    return quickTable;
  },
  
  /**
   * Limpiar cache
   */
  clearCache: function() {
    BalisticsCalculator.clearCache();
  },
  
  /**
   * Obtener estadísticas del cache
   */
  getCacheStats: function() {
    return BalisticsCalculator.getCacheStats();
  }
};

// ================================================
// EXPORTAR PARA USO GLOBAL
// ================================================

window.BalisticsCalculator = BalisticsCalculator;
window.conversionTables = conversionTables;

// ================================================
// INICIALIZACIÓN Y PRUEBAS
// ================================================

// Función para mostrar estadísticas en consola
window.showBallisticsStats = function() {
  console.log('📊 Estadísticas de Interpolación por SPA:');
  
  for (const spaType in conversionTables) {
    console.log(`\n${spaType}:`);
    
    for (const mode of ['directo', 'indirecto']) {
      const table = conversionTables[spaType]?.[mode];
      if (table && table.length > 0) {
        const stats = BalisticsCalculator.calculateError(spaType, mode);
        if (stats) {
          console.log(`  ${mode}: ${stats.points} puntos, Error: ${stats.avgError} mils (max: ${stats.maxError})`);
        }
      }
    }
  }
  
  // Mostrar estadísticas del cache
  const cacheStats = BalisticsCalculator.getCacheStats();
  console.log(`\n🧠 Cache: ${cacheStats.size} entradas`);
};

// Cargar al inicio
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Calculadora balística optimizada cargada');
  
  // Mostrar estadísticas en consola si está en modo debug
  if (localStorage.getItem('debug') === 'true') {
    setTimeout(() => {
      window.showBallisticsStats();
    }, 1000);
  }
});