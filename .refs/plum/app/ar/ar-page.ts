import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { EventData } from 'tns-core-modules/data/observable';
import { isIOS } from 'tns-core-modules/ui/page';
import { NavigatedData, Page } from 'tns-core-modules/ui/page';
import {
  AR,
  ARLoadedEventData,
  ARNodeInteraction,
  ARPlaneDetectedEventData,
  ARPlaneTappedEventData,
  ARSceneTappedEventData,
  ARTrackingFaceEventData,
  ARTrackingImageDetectedEventData
} from 'nativescript-ar';

import { ARViewModel } from './ar-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new ARViewModel();

  const model = new ARViewModel();
  model.ar = ar;
  model.screenshot = page.getViewById('screenshot');
  page.bindingContext = model;

  if (isIOS && flashlight.isAvailable()) {
    const flashlightSwitch = page.getViewById('flashlightSwitch');
    flashlightSwitch.on('checkedChange', (args: any) => {
      args.value ? flashlight.on() : flashlight.off();
    });
  }
}

export function onDrawerButtonTap(args: EventData) {
  const sideDrawer = <RadSideDrawer>app.getRootView();
  sideDrawer.showDrawer();
}

const flashlight = require('nativescript-flashlight');
declare const NSBundle: any;
let ar: AR;

export function arLoaded(args: ARLoadedEventData): void {
  ar = args.object;
  // add some stuff to the scene
  console.log('>> arLoaded, object: ' + args.object);
  /*
  setTimeout(() => {
    args.object.addModel({
      name: "Models.scnassets/Car.dae",
      position: {
        x: 0,
        y: 0,
        z: -1
      },
      rotation: {
        x: 0,
        y: 180, // face towards camera
        z: 0
      },
      scale: 0.1,
      onTap: node => console.log("model tapped: " + node.id)
    });
  }, 1000);
  args.object.addBox({
    position: {
      x: -0.5,
      y: -0.5,
      z: -1
    },
    dimensions: {
      x: 0.25,
      y: 0.25,
      z: 0.52
    },
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "ClampToBorder"
      }
    }],
    onTap: node => console.log("box tapped: " + node.id),
    // onLongPress: node => console.log("box longpressed: " + node.id),
    draggingEnabled: true,
    rotatingEnabled: true
    // onPan: node => console.log("box panned: " + node.id),
  }).then(node => console.log("box added: " + node.id));
  args.object.addText({
    text: "NativeScript",
    position: {
      x: 2.7,
      y: -0.2,
      z: -4
    },
    scale: 0.1,
    depth: 1,
    materials: [new Color("blue")],
    rotation: {
      x: 5,
      y: 5,
      z: 5
    },
    onTap: node => console.log("text tapped: " + node.id),
    // onPan: node => console.log("text panned: " + node.id),
  }).then(node => console.log("text added: " + node.id));
  args.object.addText({
    text: "is COOL",
    position: {
      x: 2.7,
      y: -1,
      z: -5
    },
    scale: 0.1,
    depth: 1,
    materials: [new Color("blue")],
    rotation: {
      x: 5,
      y: 5,
      z: 5
    },
    onTap: node => console.log("text tapped: " + node.id),
  }).then(node => console.log("text added: " + node.id));
  args.object.addTube({
    position: {
      x: 0.3,
      y: 0.3,
      z: -1.2
    },
    innerRadius: 0.1,
    outerRadius: 0.15,
    height: 0.2,
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "Repeat" // which is the default
      },
      roughness: "Assets.scnassets/Materials/tnsgranite/tnsgranite-roughness.png",
      transparency: 1 // solid (which is the default)
    }],
    rotation: {
      x: 20,
      y: 0,
      z: 0
    },
    onTap: node => console.log("tube tapped: " + node.id),
  }).then(node => console.log("tube added: " + node.id));
  */
}

export function trackingFaceDetected(args: ARTrackingFaceEventData): void {
  console.log('Tracking face (event): ' + args.eventType);
  if (args.properties) {
    console.log(JSON.stringify(args.properties));
  }
}

export function trackingImageDetected(args: ARTrackingImageDetectedEventData): void {
  console.log('Tracked image detected (name).. ' + args.imageName);

  if (args.imageName === 'nativescripting') {
    // note that you really want to use locally stored videos, like so:
    if (isIOS) {
      const videoUrl = NSBundle.mainBundle.URLForResourceWithExtensionSubdirectory(
        'homer video',
        'mov',
        'art.scnassets'
      );
      if (!videoUrl) {
        console.log('Could not find video file');
        return;
      }
      args.imageTrackingActions.playVideo(videoUrl);
      // args.imageTrackingActions.playVideo(NSURL.URLWithString("http://techslides.com/demos/samples/sample.mov"));
    }
  } else if (args.imageName === 'ship') {
    console.log('Adding model');
    args.imageTrackingActions.addModel({
      name: 'art.scnassets/ship.scn',
      childNodeName: 'shipMesh',
      position: {
        x: 0,
        y: 0,
        z: 0.03
      },
      onTap: (interaction: ARNodeInteraction) => {
        // let's move the plane out of the image a bit
        interaction.node.moveBy({
          x: 0,
          y: 0,
          z: 0.01
        });
      },
      onLongPress: (interaction: ARNodeInteraction) => {
        // let's move the plane into the image a bit
        interaction.node.moveBy({
          x: 0,
          y: 0,
          z: -0.01
        });
      }
    });
  } else if (
    args.imageName === 'nativescript nl' ||
    args.imageName === 'nativescripting alt' ||
    args.imageName === 'hertogjan' ||
    args.imageName === 'latrappe' ||
    args.imageName === 'thatconference'
  ) {
    console.log('Adding box');
    args.imageTrackingActions
      .addBox({
        position: {
          x: args.position.x,
          y: args.position.y,
          z: args.position.z + 0.8
        },
        dimensions: 1.6,
        chamferRadius: 0.1,
        materials: [
          {
            diffuse: {
              contents: 'Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png',
              wrapMode: 'ClampToBorder'
            }
          }
        ],
        onTap: (interaction: ARNodeInteraction) => {
          console.log('box tapped: ' + interaction.node.id + ' at ' + interaction.touchPosition);
          // let's rotate the box 5 degrees to the right
          interaction.node.rotateBy({
            x: 0,
            y: 0,
            z: -5
          });
        },
        onLongPress: (interaction: ARNodeInteraction) => {
          console.log('box longpressed: ' + interaction.node.id + ' at ' + interaction.touchPosition);
          // let's rotate the box 5 degrees to the left
          interaction.node.rotateBy({
            x: 0,
            y: 0,
            z: 5
          });
        }
      })
      .then(node => console.log('box added to image, id: ' + node.id));
  }
}

export function planeDetected(args: ARPlaneDetectedEventData): void {
  console.log('Plane detected (id): ' + args.plane.id);
}

export function planeTapped(args: ARPlaneTappedEventData): void {
  console.log('Plane tapped @ x coordinate: ' + args.position.x);

  args.object.addModel({
    name: 'Models.scnassets/Ball.dae',
    //name: 'Models.scnassets/Campfire/campfire_v2.dae',
    position: {
      x: args.position.x,
      y: args.position.y,
      z: args.position.z - 0.5
    },
    rotation: {
      x: 0,
      y: 0, // 180 = face towards camera
      z: 0
    },
    scale: 0.5,
    mass: 0,
    onTap: (interaction: ARNodeInteraction) => {
      console.log('tapped model id: ' + interaction.node.id);
      console.log('tapped model position: ' + interaction.node.position);
      console.log('tapped model: ' + JSON.stringify(interaction.node));
      interaction.node.rotateBy({
        x: args.position.x,
        y: args.position.y,
        z: args.position.z - 5
      });
    },
    onLongPress: (interaction: ARNodeInteraction) => {
      console.log('model longpressed: ' + interaction.node.id);
      interaction.node.remove();
    }
  });

  /*
  const boxDimensions = 0.11;
  args.object.addBox({
    position: {
      x: args.position.x,
      y: args.position.y + (boxDimensions / 2), // want to drop the box from a meter high (when mass > 0)? add +1
      z: args.position.z
    },
    // scale: 0.5, // this messes up positioning
    dimensions: boxDimensions,
    chamferRadius: 0.01,
    materials: [{
      diffuse: {
        contents: "Assets.scnassets/Materials/tnsgranite/tnsgranite-diffuse.png",
        wrapMode: "ClampToBorder"
      }
    }],
    // mass: 0.3,
    onTap: model => {
      console.log(`Box tapped: ${model.id}, gonna move it`);
      // model.rotateBy({
      //   x: 0,
      //   y: 0,
      //   z: -5
      // })
      model.moveTo({
        x: model.position.x,
        y: model.position.y + 0.01, // moves the box up a little
        z: model.position.z
      })
    },
    onLongPress: model => model.remove()
  }).then(arNode => {
    console.log("Box successfully added");
    if (arNode.ios) {
      // do something iOS specific here if you like
    }
  });
  */
}

export function sceneTapped(args: ARSceneTappedEventData): void {
  console.log(`Scene tapped @ x / y coordinate: ${args.position.x} / ${args.position.y}`);
}
