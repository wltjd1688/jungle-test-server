"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { 
  addPropertyControls, 
  ControlType, 
  Color, 
  RenderTarget 
} from "framer";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useSpring } from "framer-motion";

/**
 * GLOBE FOR FRAMER
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 300
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
const Globe = (props)=> {
  // Destructuring props for cleaner code
  const { 
    background, 
    baseColor, 
    glowColor, 
    isDraggable, 
    dragOptions, 
    speed, 
    theta, 
    phi, 
    dark, 
    diffuse, 
    maxSamples, 
    mapBrightness, 
    markerSize, 
    markerArray, 
    markerColor, 
    scale, 
    alignment, 
    maxWidth, 
    offset 
  } = props;

  const { offsetX, offsetY } = offset;
  const { stiffness, damping, mass } = dragOptions;

  // Ref for the canvas element
  const canvasRef = useRef();
  
  // Refs for pointer interaction
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

  // Check if the render target is canvas
  const isCanvas = RenderTarget.current() === RenderTarget.canvas;

  // Spring animation for rotation
  const r = useSpring(0, { 
    stiffness: stiffness, 
    damping: damping, 
    mass: mass, 
    restDelta: 1e-4, 
    restSpeed: 1e-4 
  });

  // Gradient mask for fading
  const fadeMask = "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0)70%)";

  useEffect(() => {
    let phiValue = phi;
    let width = 0;

    // Resize event listener
    const onResize = () => {
      if (canvasRef.current && (width = canvasRef.current.offsetWidth)) {
        window.addEventListener("resize", onResize);
      }
    };

    onResize();

    const baseConvert = convertRGB(baseColor);
    const glowConvert = convertRGB(glowColor);
    const markerConvert = convertRGB(markerColor);

    // Create globe using the cobe library
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: phi,
      theta: theta,
      dark: dark,
      diffuse: diffuse,
      mapSamples: maxSamples,
      mapBrightness: mapBrightness,
      baseColor: [baseConvert.r, baseConvert.g, baseConvert.b],
      glowColor: [glowConvert.r, glowConvert.g, glowConvert.b],
      markerColor: [markerConvert.r, markerConvert.g, markerConvert.b],
      markers: markerArray.map(marker => {
        return {
          location: [marker.latitude, marker.longitude],
          size: markerSize
        };
      }),
      scale: scale,
      offset: [offsetX, offsetY],
      onRender: state => {
        if (!isCanvas) {
          state.phi = phiValue + r.get();
        }
        state.width = width * 2;
        state.height = width * 2;
        if (!isCanvas) {
          state.phi = phiValue + r.get();
          phiValue += speed / 200;
        }
      }
    });

    return () => {
      globe.destroy();
    };
  }, [props]);

  // JSX structure for the Globe component
  return /*#__PURE__*/ _jsx("div", {
    style: { 
      ...flexStyles, 
      placeItems: alignment, 
      background: background 
    },
    children: /*#__PURE__*/ _jsx("div", {
      style: { 
        width: "100%", 
        aspectRatio: "1/1", 
        maxWidth: maxWidth, 
        WebkitMaskImage: fadeMask, 
        MozMaskImage: fadeMask, 
        maskImage: fadeMask 
      },
      children: /*#__PURE__*/ _jsx("canvas", {
        ref: canvasRef,
        style: { 
          width: "100%", 
          height: "100%", 
          contain: "layout paint size", 
          cursor: "auto", 
          userSelect: "none" 
        },
        onPointerDown: e => {
          if (isDraggable) {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            canvasRef.current.style.cursor = "grabbing";
          }
        },
        onPointerUp: () => {
          if (isDraggable) {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "grab";
          }
        },
        onPointerOver: () => {
          if (isDraggable) {
            canvasRef.current.style.cursor = "grab";
          }
        },
        onPointerOut: () => {
          if (isDraggable) {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "auto";
          }
        },
        onMouseMove: e => {
          if (isDraggable) {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              r.set(delta / 100);
            }
          }
        },
        onTouchMove: e => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 100);
          }
        }
      })
    })
  });
}

/* Default properties */
Globe.defaultProps = { 
  background: "#000000", 
  baseColor: "#333333", 
  glowColor: "#ffffff", 
  markerColor: "#ffffff", 
  isDraggable: true, 
  dragOptions: { 
    stiffness: 200, 
    damping: 40, 
    mass: 1 
  }, 
  speed: 0.5, 
  phi: 0, 
  theta: .3, 
  dark: 1, 
  diffuse: 2, 
  mapBrightness: 20, 
  maxSamples: 2e4, 
  markerSize: .1, 
  markerArray: [{ latitude: 52.3676, longitude: 4.9041 }], 
  scale: 1, 
  alignment: "center", 
  maxWidth: 800, 
  offset: { offsetX: 0, offsetY: 0 } 
};

Globe.displayName = "Globe";

const dp = Globe.defaultProps;
const dpOffset = Globe.defaultProps.offset;
const dpDrag = Globe.defaultProps.dragOptions;

// Property controls for Framer
addPropertyControls(Globe, {
  background: { 
    type: ControlType.Color, 
    title: "Backdrop", 
    defaultValue: dp.background 
  },
  // ... (other property controls)
});

/* Styles */
const flexStyles = { 
  width: "100%", 
  height: "100%", 
  display: "flex", 
  placeItems: "center", 
  placeContent: "center", 
  overflow: "visible" 
};

/* Functions */
const convertRGB = color => { 
  return { 
    r: Color(color).r / 255, 
    g: Color(color).g / 255, 
    b: Color(color).b / 255 
  }; 
};

export const __FramerMetadata__ = { 
  "exports": { 
    "default": { 
      "type": "reactComponent", 
      "name": "Globe", 
      "slots": [], 
      "annotations": { 
        "framerContractVersion": "1", 
        "framerSupportedLayoutHeight": "fixed", 
        "framerSupportedLayoutWidth": "fixed", 
        "framerDisableUnlink": "*", 
        "framerIntrinsicWidth": "300", 
        "framerIntrinsicHeight": "300" 
      } 
    }, 
    "__FramerMetadata__": { 
      "type": "variable" 
    } 
  } 
};

export default Globe;