import AFRAME from 'aframe';
import 'aframe-extras';

window.addEventListener('load', initScene);

const audio = document.querySelector('#background-music');
window.addEventListener('click', () => {
  audio.play();
});

const burbujas = Array.from({ length: 30 }, () => createRandomPosition());
let score = 0;
const burbujasReventadasParaNuevaGeneracion = 3; // Bursting limit for new generation
let reventadas = 0;

const peces = [
    { id: "pez1", scale: "0.4 0.4 0.4" },
    { id: "pez2", scale: "5 5 5" },
    { id: "pez3", scale: "0.04 0.04 0.04" },
    { id: "pez4", scale: "0.01 0.01 0.01" }
];

const corales = [
    { id: 'coral1' },
    { id: 'coral2' },
    { id: 'coral3' },
    { id: 'alga1' },
    { id: 'alga2' }
];

function initScene() {
    const scene = document.querySelector('a-scene');
    generateBubbles(scene, burbujas);
    generateFish(scene, peces);
    generateCorals(scene, corales);
}

// Generar posición aleatoria dentro de un rango amplio
function createRandomPosition() {
    return {
        x: (Math.random() * 150) - 75,
        y: Math.random() * 20 + 1,
        z: (Math.random() * 150) - 75
    };
}

// Generar burbujas con movimiento amplio
function generateBubbles(scene, positions) {
    positions.forEach(pos => {
        const burbuja = document.createElement('a-entity');
        burbuja.setAttribute('geometry', {
            primitive: 'sphere',
            radius: Math.random() * 0.5 + 0.5
        });
        burbuja.setAttribute('material', {
            shader: 'flat',
            src: '#burbuja'
        });
        burbuja.setAttribute('class', 'burbuja');
        burbuja.object3D.position.set(pos.x, pos.y, pos.z);

        // Animaciones de las burbujas
        burbuja.setAttribute('animation__float', {
            property: 'object3D.position.y',
            to: pos.y + Math.random() * 6,
            dur: Math.random() * 2000 + 3000,
            loop: true,
            dir: 'alternate',
            easing: 'easeInOutSine'
        });
        burbuja.setAttribute('animation__sway_x', {
            property: 'object3D.position.x',
            to: pos.x + Math.random() * 20 - 10, // Más movimiento lateral
            dur: Math.random() * 3000 + 4000,
            loop: true,
            dir: 'alternate',
            easing: 'easeInOutSine'
        });
        burbuja.setAttribute('shootable', '');
        scene.appendChild(burbuja);
    });
}

// Generar peces con mayor amplitud de movimiento y velocidad
function generateFish(scene, fishData) {
    fishData.forEach(fish => {
        const numFish = Math.floor(Math.random() * 10) + 1;
        for (let i = 0; i < numFish; i++) {
            const position = createRandomPosition();
            const pez = document.createElement('a-entity');
            pez.setAttribute('gltf-model', `#${fish.id}`);
            pez.setAttribute('scale', fish.scale);
            pez.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
            pez.setAttribute('animation-mixer', 'loop: repeat');

            // Movimiento dinámico con mayor alcance y velocidad
            pez.setAttribute('animation__float', {
                property: 'object3D.position.y',
                to: position.y + Math.random() * 12 - 2, // Aumentar el rango de movimiento en y (más lejos)
                dur: Math.random() * 3000 + 3000, // Reducción de duración (más rápido)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });
            pez.setAttribute('animation__sway_x', {
                property: 'object3D.position.x',
                to: position.x + Math.random() * 60 - 30, // Aumentar el rango de movimiento en x (más lejos)
                dur: Math.random() * 4000 + 4000, // Reducción de duración (más rápido)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });
            pez.setAttribute('animation__sway_z', {
                property: 'object3D.position.z',
                to: position.z + Math.random() * 60 - 30, // Aumentar el rango de movimiento en z (más lejos)
                dur: Math.random() * 4000 + 4000, // Reducción de duración (más rápido)
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });

            scene.appendChild(pez);
        }
    });
}


// Generar corales en posiciones específicas
function generateCorals(scene, coralesData) {
    coralesData.forEach(coral => {
        const numCorales = Math.floor(Math.random() * 15) + 5; // Ajusta el rango si necesitas más corales
        for (let i = 0; i < numCorales; i++) {
            const position = {
                x: (Math.random() * 140) - 70,
                y: 0,
                z: (Math.random() * 140) - 70
            };
            const coralEntity = document.createElement('a-entity');
            coralEntity.setAttribute('gltf-model', `#${coral.id}`);
            coralEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
            coralEntity.setAttribute('scale', '2 2 2');
            scene.appendChild(coralEntity);
        }
    });
}

// Componente para burbujas reventadas
AFRAME.registerComponent('shootable', {
    init: function () {
        const el = this.el;

        el.addEventListener('click', () => {
            el.setAttribute('animation', {
                property: 'scale',
                to: '1.5 1.5 1.5',
                dur: 200,
                easing: 'easeOutQuad',
                loop: 'false'
            });
            setTimeout(() => {
                el.parentNode.removeChild(el);
                updateScore();
            }, 200);
        });
    }
});

function updateScore() {
    score++;
    reventadas++;
    const scoreText = document.querySelector('[text]');
    if (scoreText) {
        scoreText.setAttribute('value', `${score} burst bubbles`);
    }
    if (reventadas >= burbujasReventadasParaNuevaGeneracion) {
        reventadas = 0;
        const scene = document.querySelector('a-scene');
        const nuevasBurbujas = Array.from({ length: 20 }, () => createRandomPosition()); // Generar más burbujas
        generateBubbles(scene, nuevasBurbujas);
    }
}
