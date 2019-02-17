import { Component, ViewChild, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';

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
        const scene = this.createScene();
        this.engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    createScene() {
        // Create the scene space
        const scene = new BABYLON.Scene(this.engine);

        // Add a camera to the scene and attach it to the canvas
        const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
        // camera.attachControl(this.canvas.nativeElement, true);

        // Add lights to the scene
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
        const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);

        light1.intensity = 0.7;
        light2.intensity = 0.7;

        // This is where you create and manipulate meshes
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {  }, scene);
        // texture sphere below
        const sphereMat = new BABYLON.StandardMaterial('sphereMat', scene);
        sphereMat.diffuseColor = new BABYLON.Color3(.4, .3, .6);
        sphere.material = sphereMat;
        // const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 4 }, scene);

        return scene;

    }

}

