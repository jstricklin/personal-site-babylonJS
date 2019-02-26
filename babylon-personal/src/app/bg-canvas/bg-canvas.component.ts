import { Component, ViewChild, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Extensions } from 'babylonjs-editor';

const dendriteNrmlMap = '../../assets/scenes/grey-scene/scene/dendrite_bw_bake_01_nrm.png';
const dendriteGrey = '../../assets/blender-babylon/dendrite_bw_bake_01.png';
const dendriteColor = '../../assets/scenes/color-scene/dendrite-color-bake.png';
const dendriteEmit = '../../assets/scenes/color-scene/dendrite-color-bake.png';

@Component({
    selector: 'app-bg-canvas',
    templateUrl: './bg-canvas.component.html',
    styleUrls: ['./bg-canvas.component.scss']
})
export class BgCanvasComponent implements OnInit {
    @ViewChild('canvas') canvas;
    engine;


    constructor() { }

    ngOnInit() {
        // console.log(this.canvas.nativeElement);
        this.engine = new BABYLON.Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
        // const scene = this.createScene();
        const scene = new BABYLON.Scene(this.engine);
        // Add a camera to the scene and attach it to the canvas
        const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2.5, Math.PI / 6, 12, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(this.canvas.nativeElement, true);

        BABYLON.SceneLoader.Append(
            // '../../assets/scenes/grey-scene/',
            // 'scene.babylon',
            '../../assets/scenes/grey-scene/scene/',
            'scene.babylon',
            scene,
            (loadedScene: BABYLON.Scene) => {
                this.particleInit(loadedScene);
                // loadedScene.activeCamera.attachControl(this.canvas.nativeElement, true);
                this.dofInit(loadedScene);
                console.log('pre clear', loadedScene.activeCamera);
                loadedScene.activeCamera.inputs.clear();
                // loadedScene.activeCamera.inputs.addKeyboard(
                loadedScene.activeCamera.attachControl(this.canvas.nativeElement, true);
                loadedScene.activeCamera.inputs.add(new BABYLON.FlyCameraKeyboardInput());
                loadedScene.activeCamera.inputs.add(new BABYLON.FreeCameraMouseInput());
                // loadedScene.activeCamera.inputs.camera.speed = 0.1;
                // console.log('post clear', loadedScene.activeCamera.inputs, loadedScene.activeCamera.speed);
                // camera.attachControl(this.canvas.nativeElement, true);
                // get dendrites and update textures below
                // console.log(loadedScene);
                loadedScene.ambientColor = new BABYLON.Color3(.3, .3, .5);
                const dendrites = loadedScene.meshes.filter(mesh => mesh.name.includes('dendrite'));
                // const color = new BABYLON.Color3( .3, .3, .3 );
                const dendriteMat = new BABYLON.PBRMaterial('dendriteMatS', loadedScene);
                console.log(dendriteMat);
                dendriteMat.usePhysicalLightFalloff = false;
                dendriteMat.useMicroSurfaceFromReflectivityMapAlpha = true;
                dendriteMat.albedoTexture = new BABYLON.Texture(dendriteColor, loadedScene);
                dendriteMat.reflectivityColor = new BABYLON.Color3( .3, .2, 1 );
                dendriteMat.albedoColor = new BABYLON.Color3( .9, .2, 1 );
                dendriteMat.bumpTexture = new BABYLON.Texture(dendriteNrmlMap, loadedScene);
                dendriteMat.reflectivityTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
                dendriteMat.microSurface = .75;
                dendriteMat.emissiveTexture = new BABYLON.Texture(dendriteEmit, loadedScene);
                dendriteMat.emissiveIntensity = 5000;
                dendrites[0].material = dendriteMat;
                console.log(dendriteMat);
                // console.log('dendrite mat', dendrites[0].material.ambientColor);
            }
        );
        // BABYLON.Tools.LoadFile('../../assets/scenes/grey-scene/scene/scenea7af9e4e-df35-4baa-91bc-29652ed697eb.editorproject',
        //     (data: string) => {
        //     Extensions.RoolUrl = '../../assets/scenes/';
        //     Extensions.ApplyExtensions(scene, JSON.parse(data));
        // });
        // BABYLON.Tools.LoadFile('../../assets/scenes/scene/project.editorproject', (data: string) => {
        //     Extensions.RoolUrl = '../../assets/scenes/scene/';
        //     Extensions.ApplyExtensions(scene, JSON.parse(data));
        // });
        this.engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    particleInit(scene: BABYLON.Scene) {
        const motes = new BABYLON.ParticleSystem('motes', 500, scene);
        motes.emitter = new BABYLON.Vector3(0, 0, 0);
        motes.minEmitBox = new BABYLON.Vector3(-5, -5, -5);
        motes.maxEmitBox = new BABYLON.Vector3(5, 5, 5);
        motes.particleTexture = new BABYLON.Texture('../../assets/scenes/grey-scene/scene/mote-texture-blur.png', scene);
        // motes.color1 = new BABYLON.Color4(0, 0, 0, 0);
        // motes.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.1);
        // motes.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        motes.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
        motes.addColorGradient(0.5, new BABYLON.Color4(0.4, 0.4, 0.4, 1));
        motes.addColorGradient(1, new BABYLON.Color4(0.1, 0.1, 0.1, 0.0));
        // motes.color1 = new BABYLON.Color4(0.3, 0.3, 1, 0.6);
        motes.maxLifeTime = 30;
        motes.minLifeTime = 5;

        motes.direction1 = new BABYLON.Vector3(-7, 8, 3);
        motes.direction2 = new BABYLON.Vector3(7, -8, -3);

        motes.emitRate = 10;

        // angular speed
        motes.minAngularSpeed = 0;
        motes.maxAngularSpeed = 0.5;

        motes.minSize = 0.05;
        motes.maxSize = 0.5;
        motes.minEmitPower = .01;
        motes.maxEmitPower = .1;
        motes.preWarmCycles = 1000;
        motes.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        motes.start();

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

