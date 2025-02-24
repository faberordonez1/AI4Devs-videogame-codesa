document.addEventListener('DOMContentLoaded', () => {
    const configuracion = document.getElementById('configuracion');
    const juego = document.getElementById('juego');
    const modalFinal = document.getElementById('modalFinal');
    const formularioConfiguracion = document.getElementById('formularioConfiguracion');
    const turnoActual = document.getElementById('turnoActual');
    const partidasRestantes = document.getElementById('partidasRestantes');
    const marcador = document.getElementById('marcador');
    const siguientePartida = document.getElementById('siguientePartida');
    const ganadorFinal = document.getElementById('ganadorFinal');
    const reiniciarJuego = document.getElementById('reiniciarJuego');
    const celdas = document.querySelectorAll('.celda');

    let jugadorUno, jugadorDos, partidasTotales, partidasJugadas, partidasGanadasUno, partidasGanadasDos, turno, tablero;

    formularioConfiguracion.addEventListener('submit', (e) => {
        e.preventDefault();
        jugadorUno = document.getElementById('jugadorUno').value;
        jugadorDos = document.getElementById('jugadorDos').value;
        partidasTotales = parseInt(document.getElementById('partidas').value);
        partidasJugadas = 0;
        partidasGanadasUno = 0;
        partidasGanadasDos = 0;
        configuracion.classList.add('hidden');
        juego.classList.remove('hidden');
        iniciarPartida();
    });

    function iniciarPartida() {
        tablero = Array(9).fill(null);
        turno = 'X';
        actualizarInterfaz();
        celdas.forEach(celda => {
            celda.textContent = '';
            celda.classList.remove('bg-green-500');
            celda.addEventListener('click', manejarClickCelda, { once: true });
        });
    }

    function manejarClickCelda(e) {
        const celda = e.target;
        const index = celda.dataset.index;
        tablero[index] = turno;
        celda.textContent = turno;
        if (verificarGanador()) {
            finalizarPartida();
            return;
        }
        if (tablero.every(celda => celda !== null)) {
            finalizarPartida(true);
            return;
        }
        turno = turno === 'X' ? 'O' : 'X';
        actualizarInterfaz();
    }

    function verificarGanador() {
        const lineasGanadoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]             // Diagonales
        ];
        for (const linea of lineasGanadoras) {
            const [a, b, c] = linea;
            if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
                resaltarLineaGanadora(linea);
                return true;
            }
        }
        return false;
    }

    function resaltarLineaGanadora(linea) {
        linea.forEach(index => {
            celdas[index].classList.add('bg-green-500');
        });
    }

    function finalizarPartida(empate = false) {
        if (empate) {
            turnoActual.textContent = '¡Empate!';
        } else {
            const ganador = turno === 'X' ? jugadorUno : jugadorDos;
            turnoActual.textContent = `¡${ganador} gana la partida! 🏆`;
            if (turno === 'X') {
                partidasGanadasUno++;
            } else {
                partidasGanadasDos++;
            }
        }
        partidasJugadas++;
        actualizarInterfaz();
        siguientePartida.classList.remove('hidden');
    }

    function actualizarInterfaz() {
        const jugadorActual = turno === 'X' ? jugadorUno : jugadorDos;
        turnoActual.textContent = `Turno de: ${jugadorActual}`;
        partidasRestantes.textContent = `Partidas restantes: ${partidasTotales - partidasJugadas}`;
        marcador.textContent = `Marcador: ${jugadorUno} ${partidasGanadasUno} - ${partidasGanadasDos} ${jugadorDos}`;
    }

    siguientePartida.addEventListener('click', () => {
        if (partidasJugadas < partidasTotales) {
            iniciarPartida();
            siguientePartida.classList.add('hidden');
        } else {
            finalizarJuego();
        }
    });

    function finalizarJuego() {
        let ganador;
        if (partidasGanadasUno > partidasGanadasDos) {
            ganador = jugadorUno;
        } else if (partidasGanadasDos > partidasGanadasUno) {
            ganador = jugadorDos;
        } else {
            ganador = 'Empate';
        }
        ganadorFinal.textContent = ganador === 'Empate' ? '¡Empate!' : `¡${ganador} gana el juego! 🏆`;
        modalFinal.classList.remove('hidden');
    }

    reiniciarJuego.addEventListener('click', () => {
        modalFinal.classList.add('hidden');
        juego.classList.add('hidden');
        configuracion.classList.remove('hidden');
    });
});