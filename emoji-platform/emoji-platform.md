# 🎮 Juego de Plataformas 2D — *Emoji Platformer*

## 📌 Descripción General
"Emoji Platformer" es un **juego de plataformas 2D** donde el jugador controla a un personaje usando **teclas de dirección** para moverse y saltar a través de niveles hechos con **emojis**.  
El objetivo es **llegar a la meta** evitando enemigos, cayendo de plataformas o agotando vidas.

Los elementos visuales se representan exclusivamente con **emojis**, lo cual simplifica gráficos y permite un estilo carismático, liviano y único.

---

# 🚀 Características Principales

## 🎯 Objetivo del Jugador
- Avanzar de izquierda a derecha en el nivel.
- Recoger monedas.
- Esquivar enemigos.
- Llegar a la bandera final 🏁.

## 🕹️ Controles
- **← Flecha izquierda:** mover a la izquierda.
- **→ Flecha derecha:** mover a la derecha.
- **↑ Flecha arriba o Espacio:** saltar.
- **R:** reiniciar nivel (opcional).

---

# 🧩 Elementos del Juego (Emojis)

| Elemento | Emoji | Descripción |
|---------|--------|-------------|
| Personaje | 🧍‍♂️ / 🧍‍♀️ | Controlado por el jugador. |
| Bloque piso | 🟫 | Plataforma donde se puede caminar. |
| Plataforma flotante | 🟦 | Bloque suspendido para saltar. |
| Moneda | 🪙 | Recolectable que aumenta puntaje. |
| Enemigo | 👾 / 🐍 / 🐞 | Se mueven en patrones simples. |
| Meta / Bandera | 🏁 | Final del nivel. |
| Huecos | ⬛ | Si el jugador cae, pierde una vida. |

---

# 🌄 Mecánicas del Juego

## 1️⃣ Movimiento del Personaje
- Movimiento horizontal suave.
- Velocidad constante.
- Saltos con gravedad simulada.
- Detección de colisión con plataformas y paredes.

## 2️⃣ Gravedad y Física
- El jugador cae hacia abajo siempre que no esté sobre un bloque.
- Salto con parábola natural.
- Altura del salto configurable.

## 3️⃣ Colisiones
### Contra el entorno:
- El jugador no atraviesa plataformas.
- Puedes pararte encima de bloques, pero no atravesarlos por abajo.

### Contra enemigos:
- Si tocas un enemigo lateralmente → pierdes una vida.
- Si caes encima (desde salto) → aplastas enemigo (desaparece).

## 4️⃣ Monedas y Puntaje
- Cada moneda 🪙 suma +10 puntos.
- Contador visible en pantalla.
- Monedas desaparecen al tomarlas.

## 5️⃣ Vidas
- El jugador inicia con **3 vidas ❤️❤️❤️**.
- Pierde vida al:
  - Caer en un hueco.
  - Chocar con enemigo.
- Al perder todas → **Game Over**.

## 6️⃣ Enemigos
- Se mueven en un rango definido (ida y vuelta).
- Velocidad moderada.
- Diferentes tipos, pero mismo comportamiento base.

## 7️⃣ Meta Final 🏁
- Cuando el jugador toca la bandera → **Nivel completado**.
- Puede mostrar animación simple o mensaje de victoria.

---

# 🗺️ Diseño del Nivel (Matriz de Emojis)

El mapa se representa como **un arreglo de strings**, donde cada fila contiene emojis que indican elementos del nivel:

```plaintext
"                        ",
"                        ",
"        🪙              ",
"      🟦🟦              ",
"   👾                🏁 ",
"🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫"
```

Cada símbolo tiene su significado y colisión asociada.

---

# 🧠 Lógica del Juego

## Estados:
- `playing`
- `paused`
- `gameover`
- `levelCompleted`

## Bucle de juego (`requestAnimationFrame`)
- Actualiza la física.
- Mueve enemigos.
- Detecta colisiones.
- Renderiza pantalla con emojis usando *grid layout* o *CSS monospace font*.

## Actualización del Jugador
- `velX`, `velY`
- `onGround` (boolean)
- `jumpForce`
- `applyGravity()`
- `movePlayer()`
- `detectCollisions()`

---

# 🎨 Estilo Visual
- Fondo degradado (CSS linear-gradient).
- Pantalla en modo oscuro por defecto.
- Emojis en tamaño grande (32–48px).
- Contador de vidas y puntaje fijo en la parte superior.

---

# 🔊 Sonidos
- Salto.
- Moneda.
- Enemigo aplastado.
- Game Over.
- Meta alcanzada.

---

# 📱 Responsividad
- Escala automática para pantallas pequeñas.
- Controles táctiles opcionales:
  - Botones para mover y saltar.

---

# 🧪 Funcionalidades adicionales opcionales
- **Múltiples niveles**.
- **Timer** para medir velocidad del jugador.
- **Power-ups** como:
  - Estrella ⭐ = invencibilidad temporal.
  - Setas 🍄 = salto más alto.
- **Modo noche** 🌙 / día ☀️.
- **Minimapa** del nivel.
- **Guardar progreso** en `localStorage`.

---

# 🏁 Conclusión
Este diseño funcional te permite crear un **juego de plataformas completo**, con una estética ligera basada en **emojis**, sin necesidad de gráficos externos ni canvas avanzados.  
Es perfecto para aprender lógica de juegos, colisiones, físicas básicas y rendering con JavaScript.
