// Variables globales
let tablero = ["", "", "", "", "", "", "", "", ""]; // Representa el estado del tablero
let jugadorActual = "X"; // Jugador 1 usa 'X', Jugador 2 usa 'O'
let juegoActivo = true; // Controla si el juego está en curso

// Combinaciones ganadoras
const combinacionesGanadoras = [
  [0, 1, 2], // Fila superior
  [3, 4, 5], // Fila media
  [6, 7, 8], // Fila inferior
  [0, 3, 6], // Columna izquierda
  [1, 4, 7], // Columna central
  [2, 5, 8], // Columna derecha
  [0, 4, 8], // Diagonal principal
  [2, 4, 6]  // Diagonal secundaria
];

// Elementos del DOM
const tableroHTML = document.getElementById("tablero");
const mensajeHTML = document.getElementById("mensaje");
const reiniciarHTML = document.getElementById("reiniciar");

// Función para inicializar el juego
function iniciarJuego() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  jugadorActual = "X";
  juegoActivo = true;
  mensajeHTML.textContent = `Turno del Jugador ${jugadorActual}`;
  renderizarTablero();
}

// Función para renderizar el tablero
function renderizarTablero() {
  tableroHTML.innerHTML = ""; // Limpiar el tablero
  tablero.forEach((celda, indice) => {
    const divCelda = document.createElement("div");
    divCelda.classList.add(
      "w-20",
      "h-20",
      "flex",
      "items-center",
      "justify-center",
      "text-3xl",
      "font-bold",
      "bg-gray-800",
      "cursor-pointer",
      "hover:bg-gray-700",
      "rounded"
    );
    divCelda.textContent = celda;
    divCelda.addEventListener("click", () => manejarClic(indice));
    tableroHTML.appendChild(divCelda);
  });
}

// Función para manejar el clic en una celda
function manejarClic(indice) {
  if (tablero[indice] !== "" || !juegoActivo) return;

  // Marcar la celda con el símbolo del jugador actual
  tablero[indice] = jugadorActual;
  renderizarTablero();

  // Verificar si hay un ganador o empate
  if (verificarGanador()) {
    mensajeHTML.textContent = `¡Jugador ${jugadorActual} ha ganado!`;
    juegoActivo = false;
    return;
  }

  if (tablero.every((celda) => celda !== "")) {
    mensajeHTML.textContent = "¡Es un empate!";
    juegoActivo = false;
    return;
  }

  // Cambiar al siguiente jugador
  jugadorActual = jugadorActual === "X" ? "O" : "X";
  mensajeHTML.textContent = `Turno del Jugador ${jugadorActual}`;
}

// Función para verificar si hay un ganador
function verificarGanador() {
  return combinacionesGanadoras.some((combinacion) => {
    const [a, b, c] = combinacion;
    return tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c];
  });
}

// Evento para reiniciar el juego
reiniciarHTML.addEventListener("click", iniciarJuego);

// Iniciar el juego al cargar la página
iniciarJuego();