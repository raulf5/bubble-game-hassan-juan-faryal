import AFRAME from 'aframe';
import 'aframe-extras';

window.addEventListener('load', initScene);

const burbujas = Array.from({ length: 30 }, () => createRandomPosition());
let score = 0;
const burbujasReventadasParaNuevaGeneracion = 5; // Cantidad de burbujas reventadas para generar más
let reventadas = 0;

const peces = [
    { id: "pez1", scale: "0.4 0.4 0.4" },
    { id: "pez2", scale: "5 5 5" },
    { id: "pez3", scale: "0.04 0.04 0.04" },
    { id: "pez4", scale: "0.01 0.01 0.01" }
];

const corales = [
    { id: "coral1" },
    { id: "coral2" },
    { id: "coral3" },
    { id: "alga1" },
    { id: "alga2" }
    

];

function initScene() {
    const scene = document.querySelector('a-scene');
    generateBubbles(scene, burbujas);
    generateFish(scene, peces); // Generar y mover los peces
    generateCorals(scene, corales); // Generar corales aleatorios
}

function createRandomPosition() {
    return {
        x: (Math.random() * 150) - 70, // Rango entre -125 y 125
        y: Math.random() * 20 + 1,     // Altura entre 1 y 21
        z: (Math.random() * 150) - 60  // Rango entre -125 y 125
    };
}

function generateBubbles(scene, positions) {
    positions.forEach(pos => {
        const burbuja = document.createElement('a-entity');
        burbuja.setAttribute('geometry', {
            primitive: 'sphere',
            radius: Math.random() * 0.1 + 0.5 // Tamaño aleatorio entre 0.5 y 1.5
        });
        burbuja.setAttribute('material', {
            shader: 'flat',
            src: '#burbuja'
        });
        burbuja.setAttribute('class', 'burbuja');
        burbuja.object3D.position.set(pos.x, pos.y, pos.z);
        burbuja.setAttribute('animation__float', {
            property: 'object3D.position.y',
            to: pos.y + Math.random() * 4,
            dur: (4000 + Math.random() * 3000) / 2, // Duración entre 2 y 3 segundos
            loop: true,
            dir: 'alternate',
            easing: 'easeInOutSine'
        });

        burbuja.setAttribute('animation__sway_x', {
            property: 'object3D.position.x',
            to: pos.x + (Math.random() * 10 - 5),
            dur: (5000 + Math.random() * 4000) / 2, // Duración entre 2.5 y 4 segundos
            loop: true,
            dir: 'alternate',
            easing: 'easeInOutSine'
        });

        burbuja.setAttribute('animation__sway_z', {
            property: 'object3D.position.z',
            to: pos.z + (Math.random() * 10 - 5),
            dur: (4500 + Math.random() * 4500) / 2, // Duración entre 2.25 y 3.5 segundos
            loop: true,
            dir: 'alternate',
            easing: 'easeInOutSine'
        });

        burbuja.setAttribute('shootable', '');
        scene.appendChild(burbuja);
    });
}

function generateFish(scene, fishData) {
    fishData.forEach(fish => {
        const numFish = Math.floor(Math.random() * 10) + 1; // Crear entre 1 y 10 peces por tipo
        for (let i = 0; i < numFish; i++) {
            const position = createRandomPosition();
            const pez = document.createElement('a-entity');
            pez.setAttribute('gltf-model', `#${fish.id}`);
            pez.setAttribute('scale', fish.scale);
            pez.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
            pez.setAttribute('animation-mixer', 'loop: repeat'); // Usar animación integrada del modelo

            // Movimiento vertical aleatorio similar al de las burbujas (eje Y)
            pez.setAttribute('animation__float', {
                property: 'object3D.position.y',
                to: position.y + Math.random() * 4 - 2, // Aleatorio entre -2 y 2
                dur: (4000 + Math.random() * 3000) / 3, // Duración más corta (triplicando la velocidad)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });

            // Movimiento lateral aleatorio (eje X)
            pez.setAttribute('animation__sway_x', {
                property: 'object3D.position.x',
                to: position.x + (Math.random() * 10 - 5), // Movimiento lateral aleatorio
                dur: (5000 + Math.random() * 4000) / 3, // Duración más corta (triplicando la velocidad)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });

            // Movimiento hacia adelante/atrás aleatorio (eje Z)
            pez.setAttribute('animation__sway_z', {
                property: 'object3D.position.z',
                to: position.z + (Math.random() * 10 - 5), // Movimiento hacia adelante/atrás aleatorio
                dur: (4500 + Math.random() * 4500) / 3, // Duración más corta (triplicando la velocidad)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });

            scene.appendChild(pez);
        }
    });
}

// Variable para ajustar la altura de los corales
let coralHeight = 0;  // Cambia este valor para ajustar la altura de los corales

function generateCorals(scene, coralesData) {
    coralesData.forEach(coral => {
        const numCorales = Math.floor(Math.random() * 20) + 1; // Crear entre 1 y 5 corales por tipo
        for (let i = 0; i < numCorales; i++) {
            // Genera una posición aleatoria alrededor de (0, 0, 0), pero usa `coralHeight` para el valor de `y`
            const position = {
                x: (Math.random() * 140) - 70, // Rango entre -70 y 70
                y: 0,                          // Establecer la altura de los corales en 0
                z: (Math.random() * 140) - 60  // Rango entre -60 y 60
            };
            

            const coralEntity = document.createElement('a-entity');
            coralEntity.setAttribute('gltf-model', `#${coral.id}`);
            coralEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
            coralEntity.setAttribute('scale', '2 2 2'); // Tamaño de los corales

            scene.appendChild(coralEntity);
        }
    });
}

// Ejemplo de cómo cambiar la altura de los corales
function setCoralHeight(newHeight) {
    coralHeight = newHeight;
    const scene = document.querySelector('a-scene');
    generateCorals(scene, [
        { id: 'coral1' },
        { id: 'coral2' },
        { id: 'coral3' }
    ]);
}

// Puedes llamar a esta función para cambiar la altura de los corales
setCoralHeight(5);  // Establecer la altura en 5 unidades


AFRAME.registerComponent('shootable', {
    init: function () {
        const el = this.el;

        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            // Añadimos la animación de explosión
            el.setAttribute('animation', {
                property: 'scale',
                to: '1.5 1.5 1.5',
                dur: 200,
                easing: 'easeOutQuad',
                loop: 'false'
            });

            // Esperamos a que la animación termine antes de eliminar el elemento
            setTimeout(() => {
                // Elimina la burbuja del DOM
                el.parentNode.removeChild(el);

                // Incrementa el contador de burbujas reventadas
                const scoreText = document.querySelector('[text]');
                if (scoreText) {
                    scoreText.setAttribute('value', `${++score} burst bubbles`);
                }

                reventadas++; // Aumenta el contador de burbujas reventadas

                // Si hemos reventado suficientes burbujas, genera nuevas
                if (reventadas >= burbujasReventadasParaNuevaGeneracion) {
                    reventadas = 0; // Reinicia el contador de burbujas reventadas
                    const scene = document.querySelector('a-scene');
                    const nuevasBurbujas = Array.from({ length: 10 }, () => createRandomPosition());
                    generateBubbles(scene, nuevasBurbujas); // Genera nuevas burbujas
                }
            }, 200); // Duración de la animación
        });
    }
});
