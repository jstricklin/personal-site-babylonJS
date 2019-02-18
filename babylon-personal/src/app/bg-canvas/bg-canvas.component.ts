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
        // camera.attachControl(this.canvas.nativeElement, true);
        /*
        This is where we create the rendering pipeline and attach it to the camera.
        The pipeline accepts many parameters, but all of them are optional.
        Depending on what you set in your parameters array, some effects will be
        enabled or disabled. Here is a list of the possible parameters:
        {
               chromatic_aberration: number;       // from 0 to x (1 for realism)
               edge_blur: number;                  // from 0 to x (1 for realism)
               distortion: number;                 // from 0 to x (1 for realism)
               grain_amount: number;               // from 0 to 1
               grain_texture: BABYLON.Texture;     // texture to use for grain effect; if unset, use random B&W noise
               dof_focus_distance: number;         // depth-of-field: focus distance; unset to disable (disabled by default)
               dof_aperture: number;               // depth-of-field: focus blur bias (default: 1)
               dof_darken: number;                 // depth-of-field: darken that which is out of focus (from 0 to 1, disabled by default)
               dof_pentagon: boolean;              // depth-of-field: makes a pentagon-like "bokeh" effect
               dof_gain: number;                   // depth-of-field: highlights gain; unset to disable (disabled by default)
               dof_threshold: number;              // depth-of-field: highlights threshold (default: 1)
               blur_noise: boolean;                // add a little bit of noise to the blur (default: true)
        }
         */
        // const lensEffect = new BABYLON.LensRenderingPipeline('dof-lens', {
        //     edge_blur: 1.0,
        //     chromatic_aberration: 1.0,
        //     distortion: 1.0,
        //     dof_focus_distance: 50,
        //      dof_aperture: 6.0,
        //     grain_amount: 1.0,
        //     dof_pentagon: true,
        //     dof_gain: 1.0,
        //     dof_threshold: 1.0,
        //     dof_darken: 0.25,
        // }, scene, 1.0, [camera]);

        BABYLON.SceneLoader.Append(
            // '../../assets/scenes/grey-scene/',
            // 'scene.babylon',
            '../../assets/scenes/grey-scene/scene/',
            'scene.babylon',
            scene,
            (loadedScene: BABYLON.Scene) => {
                console.log(loadedScene.activeCamera);
                loadedScene.activeCamera.attachControl(this.canvas.nativeElement, true);
                const lensEffect = new BABYLON.LensRenderingPipeline('dof-lens', {
                    edge_blur: 1.0,
                    // chromatic_aberration: 1.0,
                    distortion: .25,
                    dof_focus_distance: 4,
                    dof_aperture: 4.0,
                    grain_amount: 1.0,
                    dof_pentagon: true,
                    dof_gain: 1.0,
                    dof_threshold: 1.0,
                    dof_darken: 0.2,
            }, scene, 1.0, [loadedScene.activeCamera]);
        // loadedScene.activeCamera.inputs.add(new BABYLON.FreeCameraKeyboardMoveInput());
        // camera.attachControl(this.canvas.nativeElement, true);
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
}

