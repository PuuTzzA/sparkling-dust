import * as THREE from 'three';

export class Canvas {
    constructor() {
        this.container = document.getElementById("meta-container");
        this.loadShaders();
    }

    async loadShaders() {
        const responseVertex = await fetch("./src/shaders/vertex.glsl");
        const responseFragment = await fetch("./src/shaders/fragment.glsl");

        this.vertex = await responseVertex.text();
        this.fragment = await responseFragment.text();

        this.setupThree();
    }

    setupThree() {
        this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();
        this.geometry = new THREE.PlaneGeometry(1, 1);

        const uniforms = {
            resolution: { type: "vec2", value: new THREE.Vector2() },
            time: { type: "float", value: 0 },
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
            uniforms: uniforms,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.start = undefined;
        this.render();
    }

    render(timeStamp) {
        if (this.start == undefined) {
            this.start = timeStamp;
        }
        const elapsed = timeStamp - this.start;

        this.material.uniforms.time.value = elapsed;
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        this.renderer.setSize(width, height);

        this.material.uniforms.resolution.value.x = width;
        this.material.uniforms.resolution.value.y = height;
    }

}

const c = new Canvas();