// ========================================
// 🎮 EMOJI PLATFORMER - LÓGICA DEL JUEGO
// ========================================

// Configuración del Juego
const CONFIGURACION = {
    TAMANO_CELDA: 40,
    GRAVEDAD: 0.6,
    FUERZA_SALTO: -12,
    VELOCIDAD_MOVIMIENTO: 4,
    VELOCIDAD_CAIDA_MAXIMA: 15
};

// Mapeo de Emojis - cada caracter se mapea a un emoji
const MAPA_EMOJIS = {
    'P': '🧍‍♂️',  // Jugador
    '#': '🟫',    // Plataforma del piso
    'B': '🟦',    // Plataforma flotante
    'C': '🪙',    // Moneda
    'F': '🏁',    // Bandera/Meta
    ' ': ' '      // Espacio vacío
};

// Estado del Juego
const estadoJuego = {
    estado: 'jugando',
    puntaje: 0,
    vidas: 3,
    jugadorSeMovio: false,
    jugador: {
        x: 0,
        y: 0,
        velX: 0,
        velY: 0,
        enSuelo: false
    },
    nivel: [],
    monedas: [],
    meta: { x: 0, y: 0 }
};

// Diseño del Nivel usando caracteres simples (nivel más largo)
const mapaNivel = [
    "                                                            ",
    "                                                            ",
    "        C         C              C                        F ",
    "      BB        BBBB           BBBB                      ###",
    "P                                                           ",
    "############################################################"
];

// Estado de las Teclas
const teclas = {
    izquierda: false,
    derecha: false,
    arriba: false,
    espacio: false
};

// ========================================
// 🎯 INICIALIZACIÓN
// ========================================

function inicializarJuego() {
    analizarNivel();
    configurarEventos();
    
    // Asegurar que las pantallas de overlay estén ocultas al inicio
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('game-over').classList.remove('flex');
    document.getElementById('level-complete').classList.add('hidden');
    document.getElementById('level-complete').classList.remove('flex');
    
    actualizarHUD();
    bucleJuego();
}

function analizarNivel() {
    estadoJuego.nivel = [];
    estadoJuego.monedas = [];
    
    for (let y = 0; y < mapaNivel.length; y++) {
        const fila = [];
        for (let x = 0; x < mapaNivel[y].length; x++) {
            const caracter = mapaNivel[y][x];
            
            // Analizar elementos especiales
            if (caracter === 'P') {
                estadoJuego.jugador.x = x;
                estadoJuego.jugador.y = y;
                fila.push(' '); // Espacio vacío donde inicia el jugador
            } else if (caracter === 'C') {
                estadoJuego.monedas.push({ x, y, recolectada: false });
                fila.push(' '); // Espacio vacío donde está la moneda
            } else if (caracter === 'F') {
                estadoJuego.meta = { x, y };
                fila.push(' '); // Espacio vacío donde está la bandera
            } else {
                fila.push(caracter); // Guardar plataforma o espacio vacío
            }
        }
        estadoJuego.nivel.push(fila);
    }
    
    console.log('Nivel analizado:', estadoJuego.nivel);
    console.log('Posición del jugador:', estadoJuego.jugador);
}

function configurarEventos() {
    document.addEventListener('keydown', (e) => {
        if (estadoJuego.estado !== 'jugando') return;
        
        if (e.key === 'ArrowLeft') teclas.izquierda = true;
        if (e.key === 'ArrowRight') teclas.derecha = true;
        if (e.key === 'ArrowUp') teclas.arriba = true;
        if (e.key === ' ') {
            e.preventDefault();
            teclas.espacio = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') teclas.izquierda = false;
        if (e.key === 'ArrowRight') teclas.derecha = false;
        if (e.key === 'ArrowUp') teclas.arriba = false;
        if (e.key === ' ') teclas.espacio = false;
    });
}

// ========================================
// 🎮 BUCLE DEL JUEGO
// ========================================

function bucleJuego() {
    if (estadoJuego.estado === 'jugando') {
        actualizarJugador();
        verificarColisiones();
        verificarMonedas();
        verificarMeta();
    }
    
    renderizar();
    requestAnimationFrame(bucleJuego);
}

// ========================================
// 👤 FÍSICA Y MOVIMIENTO DEL JUGADOR
// ========================================

function actualizarJugador() {
    const jugador = estadoJuego.jugador;
    
    // Movimiento horizontal
    jugador.velX = 0;
    if (teclas.izquierda) {
        jugador.velX = -CONFIGURACION.VELOCIDAD_MOVIMIENTO;
        estadoJuego.jugadorSeMovio = true;
    }
    if (teclas.derecha) {
        jugador.velX = CONFIGURACION.VELOCIDAD_MOVIMIENTO;
        estadoJuego.jugadorSeMovio = true;
    }
    
    // Salto
    if ((teclas.arriba || teclas.espacio) && jugador.enSuelo) {
        jugador.velY = CONFIGURACION.FUERZA_SALTO;
        jugador.enSuelo = false;
        estadoJuego.jugadorSeMovio = true;
    }
    
    // Aplicar gravedad
    if (!jugador.enSuelo) {
        jugador.velY += CONFIGURACION.GRAVEDAD;
        if (jugador.velY > CONFIGURACION.VELOCIDAD_CAIDA_MAXIMA) {
            jugador.velY = CONFIGURACION.VELOCIDAD_CAIDA_MAXIMA;
        }
    }
    
    // Actualizar posición
    jugador.x += jugador.velX / CONFIGURACION.TAMANO_CELDA;
    jugador.y += jugador.velY / CONFIGURACION.TAMANO_CELDA;
    
    // Resetear estado del suelo
    jugador.enSuelo = false;
}

// ========================================
// 💥 DETECCIÓN DE COLISIONES
// ========================================

function verificarColisiones() {
    const jugador = estadoJuego.jugador;
    
    // Verificar si el jugador cayó del mapa
    if (jugador.y >= estadoJuego.nivel.length) {
        perderVida();
        return;
    }
    
    // Verificar colisión con plataformas
    verificarColisionPlataforma();
    
    // Mantener al jugador dentro de los límites horizontales
    if (jugador.x < 0) jugador.x = 0;
    if (jugador.x >= mapaNivel[0].length - 1) {
        jugador.x = mapaNivel[0].length - 1;
    }
}

function verificarColisionPlataforma() {
    const jugador = estadoJuego.jugador;
    const px = Math.floor(jugador.x);
    const py = Math.floor(jugador.y);
    
    // Verificar colisión con techo (cabeza)
    // Si la velocidad es negativa (subiendo) y entramos en una celda sólida
    if (jugador.velY < 0) {
        if (esSolido(obtenerCeldaEn(px, py))) {
            jugador.velY = 0;
            jugador.y = py + 1; // Forzar posición justo debajo del bloque
        }
    }

    // Verificar colisión con suelo (pies)
    // Verificamos la celda hacia la que nos movemos o en la que estamos cayendo
    if (jugador.velY >= 0) {
        // Miramos un poco más abajo del centro para detectar el suelo correctamente
        const piesY = Math.floor(jugador.y + 0.9);
        const celdaAbajo = obtenerCeldaEn(px, piesY);
        
        // Si la celda de abajo es sólida y estamos cayendo hacia ella
        if (esSolido(celdaAbajo)) {
            // Ajustar posición solo si estamos entrando en el bloque
            if (jugador.y + 1 > piesY) {
                jugador.enSuelo = true;
                jugador.velY = 0;
                jugador.y = piesY - 1; // Posición justo encima del bloque
            }
        }
    }
    
    // Verificar colisiones horizontales
    const siguienteX = Math.floor(jugador.x + jugador.velX / CONFIGURACION.TAMANO_CELDA);
    const celdaFrente = obtenerCeldaEn(siguienteX, py);
    if (esSolido(celdaFrente)) {
        jugador.x = px;
        jugador.velX = 0;
    }
}

function obtenerCeldaEn(x, y) {
    if (y < 0 || y >= estadoJuego.nivel.length) return ' ';
    if (x < 0 || x >= estadoJuego.nivel[y].length) return ' ';
    return estadoJuego.nivel[y][x];
}

function esSolido(celda) {
    return celda === '#' || celda === 'B';
}

// ========================================
// 🪙 RECOLECCIÓN DE MONEDAS
// ========================================

function verificarMonedas() {
    const jugador = estadoJuego.jugador;
    const px = Math.floor(jugador.x);
    const py = Math.floor(jugador.y);
    
    estadoJuego.monedas.forEach(moneda => {
        if (!moneda.recolectada && moneda.x === px && moneda.y === py) {
            moneda.recolectada = true;
            estadoJuego.puntaje += 10;
            actualizarHUD();
        }
    });
}

// ========================================
// 🏁 VERIFICACIÓN DE META
// ========================================

function verificarMeta() {
    if (!estadoJuego.jugadorSeMovio) return;
    
    const jugador = estadoJuego.jugador;
    const px = Math.floor(jugador.x);
    const py = Math.floor(jugador.y);
    
    if (px === estadoJuego.meta.x && py === estadoJuego.meta.y) {
        nivelCompletado();
    }
}

// ========================================
// 💔 VIDAS Y GAME OVER
// ========================================

function perderVida() {
    estadoJuego.vidas--;
    actualizarHUD();
    
    if (estadoJuego.vidas <= 0) {
        juegoTerminado();
    } else {
        // Reiniciar posición del jugador
        estadoJuego.jugadorSeMovio = false;
        analizarNivel();
    }
}

function juegoTerminado() {
    estadoJuego.estado = 'terminado';
    document.getElementById('final-score').textContent = estadoJuego.puntaje;
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over').classList.add('flex');
}

function nivelCompletado() {
    estadoJuego.estado = 'completado';
    document.getElementById('level-score').textContent = estadoJuego.puntaje;
    document.getElementById('level-complete').classList.remove('hidden');
    document.getElementById('level-complete').classList.add('flex');
}

// ========================================
// 🎨 RENDERIZADO
// ========================================

function renderizar() {
    const cuadricula = document.getElementById('game-grid');
    cuadricula.innerHTML = '';
    
    for (let y = 0; y < estadoJuego.nivel.length; y++) {
        const filaDiv = document.createElement('div');
        filaDiv.className = 'game-row';
        
        for (let x = 0; x < estadoJuego.nivel[y].length; x++) {
            const celda = document.createElement('span');
            celda.className = 'game-cell';
            
            const px = Math.floor(estadoJuego.jugador.x);
            const py = Math.floor(estadoJuego.jugador.y);
            
            // Renderizar jugador
            if (px === x && py === y) {
                celda.textContent = MAPA_EMOJIS['P'];
            }
            // Renderizar monedas
            else if (estadoJuego.monedas.some(c => c.x === x && c.y === y && !c.recolectada)) {
                celda.textContent = MAPA_EMOJIS['C'];
            }
            // Renderizar meta
            else if (estadoJuego.meta.x === x && estadoJuego.meta.y === y) {
                celda.textContent = MAPA_EMOJIS['F'];
            }
            // Renderizar plataformas
            else {
                const caracterNivel = estadoJuego.nivel[y][x];
                celda.textContent = MAPA_EMOJIS[caracterNivel] || caracterNivel;
            }
            
            filaDiv.appendChild(celda);
        }
        
        cuadricula.appendChild(filaDiv);
    }
    
    // Actualizar scroll de la cámara para seguir al jugador
    actualizarCamara();
}

function actualizarCamara() {
    const viewport = document.getElementById('game-viewport');
    const grid = document.getElementById('game-grid');
    const jugador = estadoJuego.jugador;
    
    // Calcular la posición del jugador en píxeles
    const jugadorX = jugador.x * CONFIGURACION.TAMANO_CELDA;
    
    // Ancho del viewport
    const anchoViewport = viewport.clientWidth;
    
    // Calcular el desplazamiento para mantener al jugador centrado
    const desplazamiento = jugadorX - (anchoViewport / 2);
    
    // Aplicar transformación al grid para mover la cámara
    // Limitamos el desplazamiento para no mostrar áreas vacías
    const anchoTotal = mapaNivel[0].length * CONFIGURACION.TAMANO_CELDA;
    const desplazamientoMax = Math.max(0, anchoTotal - anchoViewport);
    const desplazamientoFinal = Math.max(0, Math.min(desplazamiento, desplazamientoMax));
    
    grid.style.transform = `translateX(-${desplazamientoFinal}px)`;
}

function actualizarHUD() {
    document.getElementById('score').textContent = estadoJuego.puntaje;
    
    const corazones = Array(estadoJuego.vidas).fill('❤️');
    document.getElementById('lives').textContent = corazones.join('');
}

// ========================================
// 🚀 INICIAR JUEGO
// ========================================

inicializarJuego();
