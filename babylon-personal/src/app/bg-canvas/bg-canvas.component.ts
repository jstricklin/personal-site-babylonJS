import { Component, ViewChild, OnInit, OnChanges, Input } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Extensions } from 'babylonjs-editor';

const dendriteNrmlMap = '../../assets/scenes/grey-scene/scene/dendrite_bw_bake_01_nrm.png';
const dendriteGrey = '../../assets/blender-babylon/dendrite_bw_bake_01.png';
const dendriteColor = '../../assets/scenes/color-scene/dendrite-color-bake.png';
const dendriteEmit = '../../assets/scenes/color-scene/dendrite-emit-bake-03.png';
const particleTexture = '../../assets/scenes/grey-scene/scene/mote-texture-blur.png';
let t = 0.01;
const pulse = (a, b) => Math.sin(t) * Math.cos(t) * Math.cos(t) * a + b;
@Component({
    selector: 'app-bg-canvas',
    templateUrl: './bg-canvas.component.html',
    styleUrls: ['./bg-canvas.component.scss']
})
export class BgCanvasComponent implements OnInit, OnChanges {
    @ViewChild('canvas') canvas;
    engine;
    glow: BABYLON.GlowLayer;
    dendriteGreyMat: BABYLON.Material;
    dendriteColorMat: BABYLON.PBRMaterial;
    dendriteStandardMat: BABYLON.StandardMaterial;
    dendrites: BABYLON.AbstractMesh[];
    loadedScene: BABYLON.Scene;
    motes: BABYLON.ParticleSystem;
    lights: BABYLON.Light[];
    hemi: BABYLON.HemisphericLight;
    @Input() selectedTheme;

    constructor() { }

    ngOnChanges() {
        this.setTheme(this.selectedTheme);
    }

    ngOnInit() {
        this.selectedTheme = 'color';
        // console.log(this.canvas.nativeElement);
        this.engine = new BABYLON.Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
        // const scene = this.createScene();
        const scene = new BABYLON.Scene(this.engine);
        // Add a camera to the scene and attach it to the canvas
        const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2.5, Math.PI / 6, 12, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(this.canvas.nativeElement, true);

        BABYLON.SceneLoader.Append(
            '../../assets/scenes/grey-scene/scene/',
            'scene.babylon',
            scene,
            (loadedScene: BABYLON.Scene) => {
                this.loadedScene = loadedScene;
                const gl = new BABYLON.GlowLayer('glow', this.loadedScene, {
                    mainTextureFixedSize: 256,
                    blurKernelSize: 12
                });
                gl.intensity = 5;
                this.glow = gl;
                loadedScene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
                this.particleInit(loadedScene);
                // console.log(floor.position);
                // loadedScene.activeCamera.attachControl(this.canvas.nativeElement, true);
                // console.log('pre clear', loadedScene.activeCamera);
                // loadedScene.ambientColor = new BABYLON.Color3(.3, .3, 1);
                // loadedScene.cameras[1].speed = 0.1;
                const flyCam = new BABYLON.FlyCamera('fly-cam', loadedScene.activeCamera.position, loadedScene);
                flyCam.fov = 0.75;
                flyCam.rotation =  new BABYLON.Vector3(0, 5.35, 0);
                flyCam.speed = .1;
                flyCam.angularSensibility = 250;
                flyCam.rollCorrect = 25;
                // console.log('flycam input', flyCam.inputs);
                // console.log('main-cam', loadedScene.activeCamera);
                loadedScene.activeCamera = flyCam;
                loadedScene.activeCamera.attachControl(this.canvas.nativeElement, true);
                // console.log('fly-cam', loadedScene.activeCamera);
                this.dendrites = loadedScene.meshes.filter(mesh => mesh.name.includes('dendrite'));
                this.materialsInit(loadedScene);
                this.dofInit(loadedScene);
                this.lightsInit();
                this.setTheme(this.selectedTheme);
                this.startPulse();
            }
        );
        this.engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    startPulse() {
        this.loadedScene.onBeforeRenderObservable.add(() => {
            t += 0.001;
            this.glow.intensity = pulse(6, 3);
            this.glow.blurKernelSize = pulse(16, 6);
            this.hemi.intensity = pulse(5, 3);
            this.dendriteColorMat.emissiveIntensity = pulse(1000, 500);
        });

    }
    lightsInit() {
        this.lights = this.loadedScene.lights;
        this.lights.map(light => {
            light.intensity = 0;
            console.log('light', light);
            light.intensityMode = BABYLON.Light.INTENSITYMODE_LUMINOUSPOWER;
            light.setEnabled(false);
        });
        const hemi = new BABYLON.HemisphericLight( 'hemiLight', new BABYLON.Vector3( 0, 1, 0 ), this.loadedScene );
        hemi.diffuse = new BABYLON.Color3( .4, .3, 1 );
        hemi.specular = new BABYLON.Color3( .4, .3, 1 );
        hemi.groundColor = new BABYLON.Color3( .4, .3, 1 );
        hemi.intensityMode = BABYLON.Light.INTENSITYMODE_AUTOMATIC;
        hemi.falloffType = BABYLON.Light.FALLOFF_DEFAULT;
        hemi.intensity = 3;
        hemi.radius = 0.1;
        this.hemi = hemi;
        console.log('scene lights', this.loadedScene.lights);
    }
    setTheme(theme: string) {
        if ( theme === 'grey' ) {
            this.motes.stop();
            this.motes.particleTexture = new BABYLON.Texture(particleTexture, this.loadedScene);
            this.motes.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
            this.motes.addColorGradient(0.5, new BABYLON.Color4(0.4, 0.4, 0.4, 1));
            this.motes.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0.0));
            this.motes.start();
            this.dendrites.map(dendrite => dendrite.material = this.dendriteGreyMat);
            // this.lights.map(light => {
                // this.loadedScene.clearColor = new BABYLON.Color4( .1, .1, .1, 1 );
                // light.diffuse = new BABYLON.Color3(1, 1, 1);
                // light.intensity = 100;
                // light.intensityMode = BABYLON.Light.INTENSITYMODE_AUTOMATIC;
            // });
        } else if ( theme === 'color' ) {
            this.motes.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
            // this.motes.addColorGradient(0.5, new BABYLON.Color4(0.3, 0.2, 1, 1));
            this.motes.addColorGradient(0.5, new BABYLON.Color4(0.4, 0.4, 0.4, 1));
            this.motes.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
            // this.dendrites.map(dendrite => dendrite.material = this.dendriteColorMat);
            this.dendrites.map(dendrite => dendrite.material = this.dendriteStandardMat);
            // this.lights.map(light => {
                // light.intensity = 100;
                // light.diffuse = new BABYLON.Color3(0.3, 0.2, 1);
                // light.intensityMode = BABYLON.Light.INTENSITYMODE_LUMINOUSINTENSITY;
                // this.loadedScene.onBeforeRenderObservable.add(function() {
                // t += 0.001;
                // light.intensity = Math.cos(t) * 900 + 1000;
                // light.intensity = pulse(900, 1000);
                // });
            // });
        }
    }
    materialsInit(loadedScene: BABYLON.Scene) {
        // const color = new BABYLON.Color3( .3, .3, .3 );
        this.dendriteGreyMat = this.dendrites[0].material;
        const dendriteColorMat = new BABYLON.PBRMaterial('dendriteMatC', loadedScene);
        // console.log(dendriteColorMat);
        dendriteColorMat.usePhysicalLightFalloff = true;
        dendriteColorMat.useRadianceOverAlpha = true;
        dendriteColorMat.useMicroSurfaceFromReflectivityMapAlpha = true;
        dendriteColorMat.albedoTexture = new BABYLON.Texture(dendriteGrey, loadedScene);
        dendriteColorMat.albedoColor = new BABYLON.Color3( .5, .2, 1 );
        dendriteColorMat.reflectivityColor = new BABYLON.Color3( 1, 1, 1 );
        dendriteColorMat.bumpTexture = new BABYLON.Texture(dendriteNrmlMap, loadedScene);
        dendriteColorMat.reflectivityTexture = new BABYLON.Texture(dendriteColor, loadedScene);
        // dendriteColorMat.ambientTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
        // dendriteColorMat.ambientTextureStrength = 1000;
        dendriteColorMat.microSurface = .85;
        // dendriteColorMat.environmentBRDFTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
        // dendriteColorMat.useAlphaFresnel = true;
        // dendriteColorMat.useAlphaFromAlbedoTexture = true;
        dendriteColorMat.emissiveTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
        dendriteColorMat.emissiveIntensity = 1000;
        dendriteColorMat.emissiveColor = new BABYLON.Color3( .5, .2, 1 );
        dendriteColorMat.specularIntensity = 3;
        // dendriteColorMat.transparencyMode = 1;
        // dendriteColorMat.alpha = .5;
        // dendriteColorMat.forceIrradianceInFragment = true;
        // dendriteColorMat.useSpecularOverAlpha = true;
        // dendriteColorMat.useAlphaFromAlbedoTexture = true;
        // console.log(dendriteColorMat);
        this.dendriteColorMat = dendriteColorMat;
        // stard standard mat below
        const dendriteStanMat = new BABYLON.StandardMaterial('dendriteMatS', loadedScene);
        dendriteStanMat.useGlossinessFromSpecularMapAlpha = true;
        dendriteStanMat.emissiveTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
        dendriteStanMat.emissiveColor = new BABYLON.Color3(.4, .2, 1);
        dendriteStanMat.diffuseFresnelParameters = new BABYLON.FresnelParameters();
        dendriteStanMat.diffuseFresnelParameters.bias = 0.6;
        dendriteStanMat.diffuseFresnelParameters.power = 60;
        dendriteStanMat.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        dendriteStanMat.emissiveFresnelParameters.bias = 0.6;
        dendriteStanMat.emissiveFresnelParameters.power = 40;
        // dendriteStanMat.emissiveIntensity = 10;
        dendriteStanMat.diffuseTexture = new BABYLON.Texture(dendriteGrey, loadedScene);
        dendriteStanMat.diffuseColor = new BABYLON.Color3(.4, .2, 1);
        dendriteStanMat.specularTexture = new BABYLON.Texture(dendriteGrey, loadedScene);
        dendriteStanMat.specularPower = 32;
        dendriteStanMat.specularColor = new BABYLON.Color3(.4, .2, 1);
        dendriteStanMat.ambientColor = new BABYLON.Color3(.4, .2, 1);
        dendriteStanMat.bumpTexture = new BABYLON.Texture(dendriteNrmlMap, loadedScene);
        this.dendriteStandardMat = dendriteStanMat;

    }
    particleInit(scene: BABYLON.Scene) {
        this.motes = new BABYLON.ParticleSystem('motes', 500, scene);
        this.motes.emitter = new BABYLON.Vector3(0, 0, 0);
        this.motes.minEmitBox = new BABYLON.Vector3(-5, -5, -5);
        this.motes.maxEmitBox = new BABYLON.Vector3(5, 5, 5);
        this.motes.particleTexture = new BABYLON.Texture(particleTexture, scene);
        this.motes.maxLifeTime = 30;
        this.motes.minLifeTime = 5;

        this.motes.direction1 = new BABYLON.Vector3(-7, 8, 3);
        this.motes.direction2 = new BABYLON.Vector3(7, -8, -3);

        this.motes.emitRate = 10;

        // angular speed
        this.motes.minAngularSpeed = 0;
        this.motes.maxAngularSpeed = 0.5;

        this.motes.minSize = 0.05;
        this.motes.maxSize = 0.5;
        this.motes.minEmitPower = .01;
        this.motes.maxEmitPower = .1;
        this.motes.preWarmCycles = 1000;
        this.motes.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.motes.start();

    }
    dofInit(loadedScene: BABYLON.Scene) {
        const lensEffect = new BABYLON.LensRenderingPipeline('dof-lens', {
            edge_blur: 1.0,
            chromatic_aberration: 0.75,
            distortion: 0.25,
            dof_focus_distance: 4,
            dof_aperture: 2.0,
            grain_amount: 1.0,
            dof_pentagon: true,
            dof_gain: 1.0,
            dof_threshold: 1.0,
            dof_darken: 0.3,
        }, loadedScene, 1.0, [loadedScene.activeCamera]);

    }
}

