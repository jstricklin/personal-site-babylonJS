import { Component, ViewChild, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
// import BABYLON from 'babylonjs';
import { Extensions } from 'babylonjs-editor';

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
            scene
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
    // createScene() {
    //     // Create the scene space
    //     const scene = new BABYLON.Scene(this.engine);

    //     // Add a camera to the scene and attach it to the canvas
    //     const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2.6, 6, BABYLON.Vector3.Zero(), scene);
    //     // camera.attachControl(this.canvas.nativeElement, true);

    //     // Add lights to the scene
    //     const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(3, 3, 0), scene);
    //     const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(-2, 3, 1), scene);

    //     light1.intensity = 0.7;
    //     light2.intensity = 0.7;

    //     // create shadowmap below
    //     const shadowGen1 = new BABYLON.ShadowGenerator(1024, light2);

    //     // This is where you create and manipulate meshes
    //     const cube = BABYLON.MeshBuilder.CreateBox('cube', {  }, scene);
    //     shadowGen1.getShadowMap().renderList.push(cube);
    //     cube.rotation = new BABYLON.Vector3(45, 45, 45);
    //     cube.position = new BABYLON.Vector3(0, 0, 0);
    //     // texture sphere below
    //     const objMat = new BABYLON.StandardMaterial('cubeMat', scene);
    //     objMat.diffuseColor = new BABYLON.Color3(.4, .3, .6);
    //     cube.material = objMat;
    //     this.rotator(cube);

    //     const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 4 }, scene);
    //     ground.position = new BABYLON.Vector3(0, -2, 0);
    //     ground.receiveShadows = true;
    //     return scene;
    // }
    // rotator(obj: BABYLON.Mesh) {
    //     obj.rotate( new BABYLON.Vector3(0, 1, 0), .005, BABYLON.Space.WORLD);
    //     setTimeout(() => {
    //         this.rotator(obj);
    //     }, 1);
    // }
}

