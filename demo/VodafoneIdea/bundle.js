/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/client/jini/js/helper-components.js":
/*!**************************************************!*\
  !*** ./apps/client/jini/js/helper-components.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// DEBUG CODE FOR MATRIX MULTPILY ISSUE.
var multiplyMatrixCount = 0;

var countFunction = function countFunction(fn) {
  return function () {
    multiplyMatrixCount++;
    return fn.apply(this, arguments);
  };
};

AFRAME.THREE.Matrix4.prototype.multiplyMatrices = countFunction(AFRAME.THREE.Matrix4.prototype.multiplyMatrices); // Just overriding this code directly for maximum performance.

var updateMatrixWorldOnlyIfVisible = function updateMatrixWorldOnlyIfVisible(force) {
  if (!this.visible) return; // Copied source follows here.

  if (this.matrixAutoUpdate) this.updateMatrix();

  if (this.matrixWorldNeedsUpdate || force) {
    if (this.parent === null) {
      this.matrixWorld.copy(this.matrix);
    } else {
      this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
    }

    this.matrixWorldNeedsUpdate = false;
    force = true;
  } // update children


  var children = this.children;

  for (var i = 0, l = children.length; i < l; i++) {
    children[i].updateMatrixWorld(force);
  }
};

AFRAME.THREE.Object3D.prototype.updateMatrixWorld = updateMatrixWorldOnlyIfVisible;

window.c8_getWorldPosition = function (object) {
  var position = new THREE.Vector3();
  position.setFromMatrixPosition(object.matrixWorld);
  return position;
};

window.c8_getWorldQuaternion = function (object) {
  var position = new THREE.Vector3();
  var scale = new THREE.Vector3();
  var target = new THREE.Quaternion();
  object.matrixWorld.decompose(position, target, scale);
  return target;
};

window.c8_awaitLoadModels = function (models) {
  return Promise.all(models.map(function (model) {
    return new Promise(function (resolve, reject) {
      model.addEventListener('model-loaded', resolve);
      model.addEventListener('model-error', reject);
    });
  }));
};

AFRAME.registerComponent('matrix-multiply-counter', {
  schema: {
    el: {
      type: 'selector'
    },
    score: {
      type: 'int',
      default: 0
    }
  },
  init: function init() {
    var counter = document.querySelector('#matrixMultiplyCount');
    counter.value = multiplyMatrixCount;
    this.counter = counter;
  },
  tick: function tick() {
    this.counter.value = multiplyMatrixCount;
    multiplyMatrixCount = 0;
  }
});

AFRAME.registerComponent('scene-time-limit-ms', {
  schema: {
    length: {
      default: 600000
    } // 10 mintues

  },
  init: function init() {
    var _this = this;

    var scene = this.el.sceneEl;
    setTimeout(function () {
      scene.emit('hideCameraFeed', {});
      scene.emit('stopXr', {});
      scene.emit('showendcard', {
        collapse: false
      });

      _this.el.pause();

      var wo = document.querySelector('#whiteout');

      if (wo) {
        wo.classList.remove('hidden');
      }
    }, this.data.length);
  }
});


AFRAME.registerComponent('jini-opacity-color', {
  schema: {
    default: 0.0
  },
  init: function init() {
    this.el.addEventListener('model-loaded', this.update.bind(this));
    var originalcolor;
  },
  update: function update() {
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;

    if (!mesh) {
      return;
    }

    mesh.traverse(function (node) {
      if (node.isMesh) {
        //capture starting color
       node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});


AFRAME.registerComponent('rgb-opacity-updater', {
  schema: {
    red: {
      default: 0
    },
    green: {
      default: 0
    },
    blue: {
      default: 0
    },
    opacity: {
      default: 1
    }
  },
  init: function init() {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function update() {
    var data = this.data;
    var mesh = this.el.getObject3D('mesh');

    if (!mesh) {
      return;
    }

    mesh.traverse(function (node) {
      if (node.isMesh) {
        //   console.log('old color')
        //   console.log(node.material.color)
        // add color
        //   console.log('new color')
        var black = new THREE.Color(0, 0, 0);
        var newcolor = new THREE.Color(data.red, data.green, data.blue); //   console.log(newcolor)

        node.material.color = black;
        node.material.emissive = newcolor;
        node.material.emissiveIntensity = 1;
        node.material.opacity = data.opacity;
        node.material.transparent = data.opacity < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
}); // Defines a hemisphere that emits events when specified objects get sucked in

AFRAME.registerComponent('gravity-well', {
  schema: {
    position: {
      default: '0 0 0'
    },
    radius: {
      default: 1
    },
    duration: {
      default: 350
    },
    offset: {
      default: 0.5
    }
  },
  init: function init() {
    var data = this.data;
    this.internalData = {
      trackedObjects: [],
      position: new THREE.Vector3(),
      worldPosition: new THREE.Vector3()
    };
    this.internalData.position.copy(AFRAME.utils.coordinates.parse(data.position));
    var internalData = this.internalData;
    this.el.addEventListener('newobject', function (event) {
      internalData.trackedObjects.push(event.detail);
    });
  },
  tick: function tick() {
    var _this2 = this;

    this.internalData.worldPosition = this.el.object3D.localToWorld(this.internalData.position.clone());

    var _loop = function _loop(i) {
      var object = _this2.internalData.trackedObjects[i];
      var toObject = object.object3D.position.clone().sub(_this2.internalData.worldPosition);

      if (toObject.y > 0 && toObject.length() < _this2.data.radius) {
        _this2.internalData.trackedObjects.splice(i, 1); //Animate sucking


        object.removeAttribute('body');

        var endPosition = _this2.internalData.worldPosition.clone().sub(new THREE.Vector3(0, _this2.data.offset, 0));

        var endPositionString = "".concat(endPosition.x, " ").concat(endPosition.y, " ").concat(endPosition.z);
        object.setAttribute('animation__suckmove', {
          property: 'position',
          to: endPositionString,
          easing: 'easeInQuad',
          dur: _this2.data.duration
        });
        object.setAttribute('animation__suckshrink', {
          property: 'scale',
          to: '0.5 0.5 0.5',
          easing: 'linear',
          dur: _this2.data.duration
        });

        _this2.el.emit('sucked', object, false);

        setTimeout(function () {
          object.setAttribute('visible', false);
        }, _this2.data.duration);
      }
    };

    for (var i = this.internalData.trackedObjects.length - 1; i >= 0; i--) {
      _loop(i);
    }
  }
}); // Component that gets commands through events for how to move over time

AFRAME.registerComponent('move-controller', {
  schema: {
    moveY: {
      default: true
    }
  },
  init: function init() {
    this.internalData = {
      moving: false
    };
    var el = this.el;
    var internalData = this.internalData;
    this.el.addEventListener('move', function (event) {
      //Move command includes type, and duration
      var moveCommand = event.detail;
      internalData.moving = true;
      internalData.duration = moveCommand.duration;
      internalData.elapsed = 0;
      internalData.emitsarrival = moveCommand.emitsarrival;

      switch (moveCommand.type) {
        case 'lerp':
          var startPosition = el.object3D.position.clone();

          internalData.equation = function (p) {
            return startPosition.clone().lerp(moveCommand.endPosition, p);
          };

          break;

        case 'equation':
          internalData.equation = moveCommand.equation;
          break;
      }
    });
    this.el.addEventListener('stopmove', function (event) {
      internalData.moving = false;
    });
  },
  tick: function tick(_tick, timeDelta) {
    if (this.internalData.moving) {
      var internalData = this.internalData;
      var newPosition;

      if (internalData.elapsed >= internalData.duration) {
        newPosition = internalData.equation(1);
        internalData.moving = false;

        if (internalData.emitsarrival == true) {
          this.el.emit('arrived', '', false);
        }
      } else {
        newPosition = internalData.equation(internalData.elapsed / internalData.duration);
        internalData.elapsed += timeDelta;
      }

      if (!this.data.moveY) {
        newPosition.y = this.el.object3D.position.y;
      }

      this.el.object3D.position.copy(newPosition);
    }
  }
}); // Listens for ground clicks and notifies move-controller of trajectory

AFRAME.registerComponent('click-move', {
  init: function init() {
    var el = this.el;
    var buttonPushSnd = document.querySelector('#ButtonPush').components.sound;
    var ground = document.getElementById('groundObj');
    var jini = document.getElementById('jini');
    var lamp = document.getElementById('lamp');
    var anchor = document.getElementById('anchor');
    var timeout = null;
    this.tapRing = document.getElementById('tapRing');

    if (!this.tapRing) {
      var tapRingInner = document.createElement('a-ring');
      tapRingInner.setAttribute('color', '#0dd');
      tapRingInner.setAttribute('ring-inner', '0.5');
      tapRingInner.setAttribute('ring-outer', '0.75');
      tapRingInner.setAttribute('rotation', '-90 0 0');
      tapRingInner.setAttribute('position', '0 0.1 0');
      this.tapRing = document.createElement('a-entity');
      this.tapRing.id = 'tapRing';
      this.tapRing.setAttribute('visible', 'false');
      this.tapRing.appendChild(tapRingInner);
      this.el.sceneEl.appendChild(this.tapRing);
    }

    var tapRing = this.tapRing;
    var ringTimeout = null;
    var previousClip = null;

    this._recenterHandler = function (event) {
      setTimeout(function () {
        el.setAttribute('look-at-slerp', {
          target: 'camera',
          tilt: true,
          axis: '0 0 -1'
        });
        lamp.object3D.position.copy(anchor.object3D.position);
        el.object3D.position.x = anchor.object3D.position.x;
        el.object3D.position.z = anchor.object3D.position.z;
        el.emit('stopmove', '');
      });
    };

    el.sceneEl.addEventListener('recenterWithOrigin', this._recenterHandler);

    this._groundClickHandler = function (event) {
      console.log("moving to new position");
      var touchPosition = new THREE.Vector3(event.detail.intersection.point.x, 0, event.detail.intersection.point.z);
      var moveVector = touchPosition.clone().sub(el.object3D.position);
      var duration = moveVector.length() * 200;
      el.emit('move', {
        type: 'lerp',
        endPosition: touchPosition,
        duration: duration
      });
      buttonPushSnd.playSound();
      el.setAttribute('look-at-slerp', {
        target: touchPosition,
        tilt: false,
        axis: '0 0.2 -1'
      });
      moving = true;
      previousClip = jini.getAttribute('animation-mixer').clip;
      var crossFadeDuration = previousClip === 'idleFloat' ? '0.3' : '0';
      jini.setAttribute('animation-mixer', {
        clip: 'motionPose',
        loop: 'repeat',
        crossFadeDuration: crossFadeDuration
      });

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(function () {
        el.setAttribute('look-at-slerp', {
          target: 'camera',
          tilt: true,
          axis: '0 0 -1'
        });
        jini.setAttribute('animation-mixer', {
          clip: previousClip || 'idleFloat',
          loop: 'repeat',
          crossFadeDuration: crossFadeDuration
        });
      }, duration);
      tapRing.object3D.scale.copy({
        x: 0.001,
        y: 0.001,
        z: 0.001
      });
      tapRing.object3D.position.copy(touchPosition);
      tapRing.setAttribute('visible', 'true');
      tapRing.removeAttribute('animation__scale');
      tapRing.setAttribute('animation__scale', {
        property: 'scale',
        dur: 300,
        from: '0.001 0.001 0.001',
        to: '0.5 0.5 0.5',
        easing: 'easeOutQuad'
      });

      if (ringTimeout) {
        clearTimeout(ringTimeout);
      }

      ringTimeout = setTimeout(function () {
        tapRing.removeAttribute('animation__scale');
        tapRing.setAttribute('animation__scale', {
          property: 'scale',
          dur: 300,
          to: '0.001 0.001 0.001',
          easing: 'easeInQuad'
        });
        ringTimeout = setTimeout(function () {
          return tapRing.setAttribute('visible', 'false');
        }, 300);
      }, duration - 300);
    };

    ground.addEventListener('mousedown', this._groundClickHandler);
  },
  remove: function remove() {
    this.tapRing.setAttribute('visible', 'false');
    this.el.emit('stopmove', '');
    this.el.sceneEl.removeEventListener('recenterWithOrigin', this._recenterHandler);
    document.getElementById('groundObj').removeEventListener('mousedown', this._groundClickHandler);
    this.el.setAttribute('look-at-slerp', {
      target: 'camera',
      tilt: true,
      axis: '0 0 -1'
    });
    document.getElementById('jini').setAttribute('animation-mixer', {
      clip: 'idleFloat',
      loop: 'repeat',
      crossFadeDuration: '0.3'
    });
  }
});
AFRAME.registerComponent('animate-cone', {
  schema: {},
  tick: function tick(time, timeDelta) {
    this.el.object3D.rotation.y += 0.01 * timeDelta; //console.log(this.el.object3D.rotation.y)
  }
});
AFRAME.registerComponent('animate-counter', {
  schema: {
    counters: []
  },
  tick: function tick(time, timeDelta) {
    if (this.data.counters.length == 0) {
      this.el.removeAttribute('animate-counter');
    }

    for (var i = this.data.counters.length - 1; i >= 0; i--) {
      var counter = this.data.counters[i];

      if (counter.currentAmount === undefined) {
        counter.currentAmount = counter.startAmount;
        counter.direction = counter.startAmount < counter.endAmount ? 1 : -1;
        counter.delay = counter.delay || 0;
        counter.timePassed = 0;
      }

      if (counter.delay > 0) {
        counter.delay -= timeDelta;
        continue;
      }

      var percentPassed = Math.max(Math.min(counter.timePassed / counter.duration, 1), 0);
      var easeValue = 3 * (1 - percentPassed) * percentPassed * percentPassed + Math.pow(percentPassed, 3);
      counter.currentAmount = counter.startAmount + easeValue * (counter.endAmount - counter.startAmount);

      if (counter.timePassed > counter.duration) {
        // Current amount has gone past end amount
        counter.currentAmount = counter.endAmount; // Remove counter from list of counters

        this.data.counters.splice(i, 1);
      }

      counter.element.innerHTML = counter.prefix + String(counter.currentAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })) + counter.suffix;
      counter.timePassed += timeDelta;
    }
  }
});
AFRAME.registerComponent('look-at-slerp', {
  schema: {
    target: {
      default: ''
    },
    factor: {
      default: 0.008
    },
    tilt: {
      default: false
    },
    offset: {
      default: '0 0 0'
    },
    targetOffset: {
      default: '0 0 0'
    },
    axis: {
      default: '0 0 -1'
    },
    looking: {
      default: true
    }
  },
  init: function init() {
    var _this3 = this;

    this.internalData = {
      targetObject: undefined,
      updateLooking: this.data.looking,
      offsetVector: new THREE.Vector3(),
      targetOffsetVector: new THREE.Vector3(),
      axisVector: new THREE.Vector3(),
      lookRotation: new THREE.Quaternion(),
      desiredRotation: new THREE.Quaternion()
    };
    var data = this.data;
    this.el.addEventListener('lookstart', function () {
      return _this3.internalData.updateLooking = true;
    });
    this.el.addEventListener('lookstop', function () {
      return _this3.internalData.updateLooking = false;
    });
  },
  update: function update() {
    if (this.data.target) {
      var parsedTarget = AFRAME.utils.coordinates.parse(this.data.target);

      if (parsedTarget.x) {
        this.internalData.targetVector = parsedTarget;
        this.internalData.targetObject = null;
      } else {
        this.internalData.targetVector = null;
        var targetEntity = document.getElementById(this.data.target);

        if (targetEntity) {
          this.internalData.targetObject = targetEntity.object3D;
        } else {
          this.internalData.targetObject = null;
        }
      }
    } else {
      this.internalData.targetVector = null;
      this.internalData.targetObject = null;
    }

    this.internalData.hasTarget = this.internalData.targetVector != null || this.internalData.targetObject != null;
    this.internalData.offsetVector.copy(AFRAME.utils.coordinates.parse(this.data.offset));
    this.internalData.targetOffsetVector.copy(AFRAME.utils.coordinates.parse(this.data.targetOffset));
    this.internalData.axisVector.copy(AFRAME.utils.coordinates.parse(this.data.axis)).normalize();
    this.internalData.lookRotation.setFromUnitVectors(new THREE.Vector3(0, 0, -1), this.internalData.axisVector);
    this.internalData.updateLooking = this.data.looking;
  },
  tick: function tick(time, timeDelta) {
    if (this.internalData.updateLooking && this.internalData.hasTarget) {
      var offsetPosition = this.internalData.offsetVector.clone().add(window.c8_getWorldPosition(this.el.object3D));
      var targetPosition;

      if (this.internalData.targetObject) {
        targetPosition = this.internalData.targetOffsetVector.clone().applyQuaternion(window.c8_getWorldQuaternion(this.internalData.targetObject)).add(window.c8_getWorldPosition(this.internalData.targetObject));
      } else {
        targetPosition = this.internalData.targetVector.clone();
      }

      var toTarget = targetPosition.sub(offsetPosition);
      var yaw = Math.atan2(toTarget.x, toTarget.z);
      var pitch = 0;

      if (this.data.tilt) {
        var groundDistance = Math.pow(Math.pow(toTarget.x, 2) + Math.pow(toTarget.z, 2), 0.5);
        pitch = -Math.atan2(toTarget.y, groundDistance);
      }

      this.internalData.desiredRotation.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
      this.internalData.desiredRotation.multiply(this.internalData.lookRotation);
      this.el.object3D.quaternion.slerp(this.internalData.desiredRotation, Math.min(this.data.factor * timeDelta, 1));
    }
  }
});
AFRAME.registerComponent('force-pushable', {
  schema: {
    force: {
      default: 50
    }
  },
  init: function init() {
    this.sceneEl = document.querySelector('a-scene');
    this.pStart = new THREE.Vector3();
    this.sourceEl = this.sceneEl.querySelector('#camera');
    this.el.addEventListener('click', this.forcePush.bind(this));
    console.log(this.sourceEl.getAttribute('position'));
  },
  forcePush: function forcePush() {
    var force,
        el = this.el,
        pStart = this.pStart.copy(this.sourceEl.getAttribute('position')); // Compute direction of force, normalize, then scale.

    force = el.body.position.vsub(pStart);
    force.normalize();
    force.scale(this.data.force, force);
    el.body.applyImpulse(force, el.body.position);
    el.body.fixedRotation = true;
    el.body.updateMassProperties();
  }
});
AFRAME.registerComponent('swipe-to-throw', {
  schema: {
    model: {
      default: ''
    },
    velocity: {
      default: 5
    },
    loadDuration: {
      default: 400
    },
    loadDelay: {
      default: 0
    },
    scale: {
      default: '5 5 5'
    },
    startPosition: {
      default: '0 -0.5 -0.4'
    },
    startRotation: {
      default: '30 0 0'
    },
    class: {
      default: 'throwable'
    },
    shape: {
      default: {
        shape: 'box',
        halfExtents: '0.035 0.025 0.08'
      }
    },
    loadDistance: {
      default: 0.7
    },
    sound: {
      default: 'MoneyThrow'
    },
    reload: {
      default: true
    }
  },
  init: function init() {
    var _this4 = this;

    var element = this.el;
    var data = this.data;
    var scene = this.el.sceneEl;
    var swipePrompt = document.getElementById("swipePrompt");
    var throwSound = document.getElementById(data.sound);
    var throwPosition = new THREE.Vector3();
    throwPosition.copy(AFRAME.utils.coordinates.parse(data.startPosition));
    var rotationDegrees = AFRAME.utils.coordinates.parse(data.startRotation);
    var throwRotationEuler = new THREE.Euler(THREE.Math.degToRad(rotationDegrees.x), THREE.Math.degToRad(rotationDegrees.y), THREE.Math.degToRad(rotationDegrees.z));
    var throwRotation = new THREE.Quaternion();
    throwRotation.setFromEuler(throwRotationEuler);
    var model = data.model;

    var hideAttached = function hideAttached() {
      var loadDirection = new THREE.Vector3(0, 0, data.loadDistance);
      loadDirection.applyQuaternion(throwRotation);
      var loadPosition = throwPosition.clone();
      loadPosition.add(loadDirection);

      _this4.internalData.attachedThrowable.removeAttribute('animation__reload');

      _this4.internalData.attachedThrowable.object3D.position.copy(loadPosition);
    };

    var throwCurrent = function throwCurrent(swipeVelocity) {
      var currentThrowable = _this4.internalData.currentThrowable;
      _this4.internalData.currentThrowable = null;

      if (!currentThrowable) {
        return;
      } else if (loading) {
        queued = true;
        return;
      }

      queued = false;

      if (throwSound) {
        throwSound.components.sound.playSound();
      } // Hide swipe tutorial on swipe-to-throw


      swipePrompt.classList.add("hidden"); // Calculate rotation and position for thrown object

      var baseRotation = window.c8_getWorldQuaternion(_this4.el.object3D);
      var basePosition = window.c8_getWorldPosition(_this4.el.object3D);
      var position = throwPosition.clone();
      position.applyQuaternion(baseRotation);
      position.add(basePosition);
      var rotation = new THREE.Quaternion();
      rotation.multiplyQuaternions(baseRotation, throwRotation);
      currentThrowable.object3D.position.copy(position);
      currentThrowable.object3D.quaternion.copy(rotation);
      currentThrowable.setAttribute('body', {
        type: 'dynamic',
        mass: 0,
        linearDamping: 0.05,
        angularDamping: 0.3,
        shape: 'none'
      });
      currentThrowable.setAttribute('shape__main', data.shape);
      hideAttached();

      if (data.reload) {
        reload();
      } // Can't apply velocity during the same tick that attaches the body, because
      // it hasn't been fully synced to the physics sim. (bug)


      currentThrowable.addEventListener('body-loaded', function () {
        var clampedVelocity = Math.min(Math.max(0.5, swipeVelocity / 4), 2) * data.velocity;
        var velocity = new THREE.Vector3(0, 0, -clampedVelocity);
        velocity.applyQuaternion(window.c8_getWorldQuaternion(currentThrowable.object3D));
        currentThrowable.body.mass = 1;
        currentThrowable.body.updateMassProperties();
        currentThrowable.body.velocity = new CANNON.Vec3(velocity.x, velocity.y, velocity.z);
        element.emit('threw', currentThrowable);
      });
    };

    var createThrowable = function createThrowable() {
      var newThrowable = document.createElement('a-entity');
      newThrowable.setAttribute('gltf-model', model);
      newThrowable.classList.add(data.class);
      newThrowable.setAttribute('scale', data.scale);
      newThrowable.setAttribute('rotation', data.startRotation);
      return newThrowable;
    };

    var readyThrowable = function readyThrowable() {
      newThrowable = createThrowable();
      scene.appendChild(newThrowable);
      newThrowable.setAttribute('position', '0 1000 0');
      return newThrowable;
    };

    var reload = function reload() {
      loading = true;
      _this4.internalData.currentThrowable = readyThrowable();
      setTimeout(function () {
        loading = false;

        if (queued) {
          throwCurrent();
        } else {
          _this4.internalData.attachedThrowable.setAttribute('animation__reload', {
            property: 'position',
            to: data.startPosition,
            easing: 'easeOutQuad',
            dur: data.loadDuration
          });
        }
      }, data.loadDelay);
    };

    this.internalData = {
      currentThrowable: null,
      attachedThrowable: createThrowable()
    };
    element.appendChild(this.internalData.attachedThrowable);
    var queued = false;
    var loading = false;
    hideAttached();
    reload();

    this._swipeListener = function (event) {
      throwCurrent(event.detail.velocity);
    };

    this._reloadListener = function (event) {
      reload();
    };

    this._changeModelListener = function (event) {
      model = event.detail.model;

      if (_this4.internalData.attachedThrowable) {
        _this4.internalData.attachedThrowable.setAttribute('gltf-model', model);
      }

      if (_this4.internalData.currentThrowable) {
        _this4.internalData.currentThrowable.setAttribute('gltf-model', model);
      } // Update the throw sound for the model


      data.sound = event.detail.sound;
      throwSound = document.getElementById(data.sound);
    };

    scene.addEventListener('swipeup', this._swipeListener);
    element.addEventListener('reload', this._reloadListener);
    element.addEventListener('changethrowablemodel', this._changeModelListener);
  },
  remove: function remove() {
    this.el.sceneEl.removeEventListener('swipeup', this._swipeListener);
    this.el.removeEventListener('reload', this._reloadListener);
    this.el.removeEventListener('changethrowablemodel', this._changeModelListener);

    if (this.internalData.currentThrowable) {
      this.internalData.currentThrowable.setAttribute('visible', 'false');
    }

    if (this.internalData.attachedThrowable) {
      this.internalData.attachedThrowable.setAttribute('visible', 'false');
    }

    console.log('removed');
  }
});
AFRAME.registerComponent('swipe-detector', {
  schema: {
    element: {
      default: ""
    },
    deviationMax: {
      default: 0.5
    },
    velocityMin: {
      default: 1
    },
    distanceMin: {
      default: 0.15
    }
  },
  init: function init() {
    var el = this.el;
    var element = document.querySelector(this.data.element);

    if (!element) {
      return;
    }

    var data = this.data;
    var state = {
      hasPointer: false
    };
    element.addEventListener('touchmove', function (event) {
      if (state.hasPointer) {
        return;
      }

      if (!event.touches[0]) {
        return;
      }

      state.hasPointer = true;
      state.startLocation = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      };
      state.startTime = performance.now();
    });
    element.addEventListener('touchend', function (event) {
      if (!state.hasPointer || !event.changedTouches[0]) {
        return;
      }

      state.hasPointer = false;
      var moveX = event.changedTouches[0].pageX - state.startLocation.x;
      var moveY = event.changedTouches[0].pageY - state.startLocation.y;
      var distance = Math.pow(Math.pow(moveX, 2) + Math.pow(moveY, 2), 0.5);
      var scaledDistance = distance / (window.innerWidth + window.innerHeight) * 2;

      if (scaledDistance < data.distanceMin) {
        return;
      }

      var duration = performance.now() - state.startTime;
      var velocity = scaledDistance / (duration / 1000);

      if (velocity < data.velocityMin) {
        return;
      }

      var angle = Math.atan2(moveY, moveX);
      var angleScaled = angle / (Math.PI / 2);
      var angleRounded = Math.round(angleScaled); // Deviation is 0 at ex. 0, 90 deg, and 1 at ex. 45, 135 deg

      var angleDeviation = Math.abs(angleRounded - angleScaled) / (Math.PI / 4);
      var eventName = 'swipe';

      if (angleDeviation < data.deviationMax) {
        switch ((angleRounded + 4) % 4) {
          case 0:
            // Right swipe
            eventName = 'swiperight';
            break;

          case 1:
            // Down swipe
            eventName = 'swipedown';
            break;

          case 2:
            // Left swipe
            eventName = 'swipeleft';
            break;

          case 3:
            // Up swipe
            eventName = 'swipeup';
            break;
        }
      }

      el.emit(eventName, {
        angle: angle,
        velocity: velocity,
        duration: duration,
        distance: scaledDistance
      }, true);
    });
  }
});
AFRAME.registerComponent('fullscreen', {
  init: function init() {
    var fs = this.el;
    fs.addEventListener('click', function (evt) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    });
  }
});
AFRAME.registerComponent('recenter', {
  init: function init() {
    var scene = this.el.sceneEl;
    var anchor = document.getElementById("anchor");
    var recenterBtn = document.getElementById('recenterButtonContainer');
    var buttonPushSnd = document.querySelector('#ButtonPush').components.sound; // Calculates a new origin which is a short distance from the anchor position.

    var calculateOriginFromAnchor = function calculateOriginFromAnchor() {
      var anchorPosition = anchor.object3D.position;
      var anchorRotation = anchor.object3D.quaternion; // TODO (alvin): Figure out good "recenter anchor distance"

      var distanceVector = new THREE.Vector3(0, 0, 5);
      var rotationMat = new THREE.Matrix4();
      rotationMat.makeRotationFromQuaternion(anchorRotation);
      distanceVector.applyMatrix4(rotationMat);
      var origin = {
        x: anchorPosition.x + distanceVector.x,
        // TODO (alvin): figure out good "recenter height"
        y: 4,
        z: anchorPosition.z + distanceVector.z
      };
      return {
        origin: origin,
        facing: anchorRotation
      };
    };

    var handleClickEvent = function handleClickEvent(e) {
      // if (!e.touches || e.touches.length < 2) {
      //   console.log('two finger touch to recenter')
      //   return;
      // }
      if (!e.touches || e.touches.length < 2) {
        if (anchor) {
          scene.emit('recenterWithOrigin', calculateOriginFromAnchor());
          console.log('recentered with origin');
        } else {
          scene.emit('recenter', {});
          console.log('recentered');
        }

        recenterBtn.classList.add('pulse-once');
        buttonPushSnd.playSound();
        setTimeout(function () {
          recenterBtn.classList.remove('pulse-once');
        }, 500);
      }
    };

    var resetAnchor = function resetAnchor(e) {
      scene.emit('recenterWithOrigin', calculateOriginFromAnchor());
    }; // TODO(alvin): This should probably be set to a click event when we convert this to a button.


    recenterBtn.addEventListener('click', handleClickEvent, true);
    scene.addEventListener('recenterAction', resetAnchor, true);
  }
});
AFRAME.registerComponent('shadow-material', {
  init: function init() {
    this.material = new THREE.ShadowMaterial();
    this.el.getOrCreateObject3D('mesh').material = this.material;
    this.material.opacity = 0.4;
  }
});
AFRAME.registerComponent('sound-fade', {
  schema: {
    from: {
      default: 0.0
    },
    to: {
      default: 1.0
    },
    duration: {
      default: 1000
    }
  },
  init: function init() {
    if (this.el.getAttribute('sound')) {
      this.el.setAttribute('sound', 'volume', this.data.from);
      this.fadeEnded = false;
      this.diff = this.data.to - this.data.from;
    } else {
      this.fadeEnded = true;
    }
  },
  update: function update(oldData) {
    this.endTime = undefined;
    this.fadeEnded = false;
    this.diff = this.data.to - this.data.from;
  },
  tick: function tick(time, delta) {
    if (this.fadeEnded) {
      return;
    }

    if (this.endTime === undefined) {
      this.endTime = time + this.data.duration;
      return;
    }

    var ease = 1 - (this.endTime - time) / this.data.duration;
    ease = Math.max(0, Math.min(1, ease * ease)); //easeQuadIn

    var vol = this.data.from + this.diff * ease;
    this.el.setAttribute('sound', 'volume', vol);

    if (ease === 1) {
      this.fadeEnded = true;
    }
  }
}); // Component that positions elements in front of the camera for a short time before hiding them
// away in order to initialize them in the renderer

AFRAME.registerComponent('show-hide', {
  schema: {
    delay: {
      default: 0
    },
    last: {
      default: false
    },
    showDuration: {
      default: 5
    }
  },
  init: function init() {
    this.internalData = {
      framesPassed: 0
    };
  },
  tick: function tick() {
    if (this.internalData.framesPassed >= this.data.delay + this.data.showDuration) {
      this.el.setAttribute('visible', 'false');

      if (this.data.last) {
        this.el.sceneEl.emit('runreality', '');
      }

      this.el.removeAttribute(this.attrName);
      return;
    }

    if (this.internalData.framesPassed >= this.data.delay) {
      var cam = document.querySelector('#camera');
      var camLocation = cam.getAttribute('position');
      var camForward = cam.object3D.getWorldDirection();
      var newPosition = {
        x: camLocation.x - 5 * camForward.x,
        y: camLocation.y - 5 * camForward.y,
        z: camLocation.z - 5 * camForward.z
      };
      this.el.setAttribute('position', newPosition);
      this.el.setAttribute('visible', 'true');
    }

    this.internalData.framesPassed++;
  }
}); // Component that applies shadow only to its own model, not its children

AFRAME.registerComponent('self-shadow', {
  schema: {
    cast: {
      type: 'boolean',
      default: true
    },
    receive: {
      type: 'boolean',
      default: true
    }
  },
  multiple: false,
  //do not allow multiple instances of this component on this entity
  init: function init() {
    this.applyShadow();
    this.el.addEventListener('object3dset', this.applyShadow.bind(this));
  },
  applyShadow: function applyShadow() {
    var data = this.data;
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    mesh.traverse(function (node) {
      node.castShadow = data.cast;
      node.receiveShadow = data.receive;
      return;
    });
  },
  update: function update(oldData) {
    this.applyShadow.bind(this);
  }
});

AFRAME.registerComponent('stop-static', {
  tick: function tick() {
    if (this.el.body.velocity.almostZero(0.1) && this.el.object3D.position.y < 0.5) {
      this.el.removeAttribute('body');
      var newRotation = new THREE.Euler(0, this.el.object3D.rotation.y, 0);
      this.el.object3D.rotation.copy(newRotation);
      this.el.removeAttribute(this.attrName);
    }
  }
});
AFRAME.registerComponent('follow-roller', {
  schema: {
    ball: {
      default: ''
    },
    ballRadius: {
      default: 0.5
    },
    target: {
      default: ''
    },
    factor: {
      default: 5
    },
    // Increases speed as distance increases
    speedMinimum: {
      default: 0.2
    },
    speedMaximum: {
      default: 10
    },
    following: {
      default: true
    }
  },
  init: function init() {
    var internalData = {
      following: this.data.following
    };
    this.internalData = internalData;
    this.el.addEventListener('followstart', function () {
      return internalData.following = true;
    });
    this.el.addEventListener('followstop', function () {
      return internalData.following = false;
    });
  },
  update: function update() {
    this.internalData.ballObject = document.getElementById(this.data.ball).object3D;
    this.internalData.targetObject = document.getElementById(this.data.target).object3D;
  },
  tick: function tick(time, timeDelta) {
    if (this.internalData.following && this.internalData.ballObject && this.internalData.targetObject) {
      var toTarget = this.internalData.targetObject.position.clone().sub(this.el.object3D.position).setY(0);
      var distanceToTarget = toTarget.length();

      if (distanceToTarget < 1e-6) {
        return;
      } // Find perpindicular axis to move direction


      var rotationAxis = new THREE.Vector3();
      rotationAxis.setY(1);
      rotationAxis.cross(toTarget).normalize(); // Decide on best amount to move, within limits and not overshooting target

      var moveAmount = distanceToTarget * this.data.factor + this.data.speedMinimum;
      moveAmount = Math.min(moveAmount, this.data.speedMaximum) * (timeDelta / 1000);
      moveAmount = Math.min(moveAmount, distanceToTarget); // Find new rotation of ball

      var rollAngle = moveAmount / this.data.ballRadius;
      var rollRotation = new THREE.Quaternion();
      rollRotation.setFromAxisAngle(rotationAxis, rollAngle);
      rollRotation.multiply(this.internalData.ballObject.quaternion); // Update position and rotation

      this.internalData.ballObject.quaternion.copy(rollRotation);
      this.el.object3D.position.add(toTarget.setLength(moveAmount));
    }
  }
});
AFRAME.registerComponent('bob', {
  schema: {
    distance: {
      default: 0.06
    },
    duration: {
      default: 1000
    }
  },
  init: function init() {
    var el = this.el;
    var data = this.data;
    data.initialPosition = this.el.object3D.position.clone();
    data.downPosition = data.initialPosition.clone().setY(data.initialPosition.y - data.distance);
    data.upPosition = data.initialPosition.clone().setY(data.initialPosition.y + data.distance);

    var vectorToString = function vectorToString(v) {
      return "".concat(v.x, " ").concat(v.y, " ").concat(v.z);
    };

    data.initialPosition = vectorToString(data.initialPosition);
    data.downPosition = vectorToString(data.downPosition);
    data.upPosition = vectorToString(data.upPosition);
    data.timeout = null;

    var animatePosition = function animatePosition(position) {
      el.setAttribute('animation__bob', {
        property: 'position',
        to: position,
        dur: data.duration,
        easing: 'easeInOutQuad',
        loop: false
      });
    };

    var bobDown = function bobDown() {
      if (data.shouldStop) {
        animatePosition(data.initialPosition);
        data.stopped = true;
        return;
      }

      animatePosition(data.downPosition);
      data.timeout = setTimeout(bobUp, data.duration);
    };

    var bobUp = function bobUp() {
      if (data.shouldStop) {
        animatePosition(data.initialPosition);
        data.stopped = true;
        return;
      }

      animatePosition(data.upPosition);
      data.timeout = setTimeout(bobDown, data.duration);
    };

    var bobStop = function bobStop() {
      data.shouldStop = true;
    };

    var bobStart = function bobStart() {
      if (data.stopped) {
        data.shouldStop = false;
        data.stopped = false;
        bobUp();
      }
    };

    this.el.addEventListener('bobStart', bobStart);
    this.el.addEventListener('bobStop', bobStop);
    bobUp();
  }
}); // Copy the XR Demo URL into the clipboard.

window.c8_onCopyClickApple = function () {
  var copyButton = document.getElementById("apple_copy_button");
  var copyHint = document.getElementById("apple_copy_hint");

  if (copyButton.src.includes('copy')) {
    copyButton.src = "img/copied_button_complete.png";
    copyHint.innerHTML = "<span style='color:#7611B7'>" + copyHint.innerHTML + "</span>";
    var dummy = document.createElement('input');
    var text = "https://8thwall.com/web";
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
};

window.c8_onCopyClickAndroid = function () {
  var copyButton = document.getElementById("android_copy_button");
  var copyHint = document.getElementById("android_copy_hint");

  if (copyButton.src.includes('copy')) {
    copyButton.src = "img/copied_button_complete.png";
    copyHint.innerHTML = "<span style='color:#7611B7'>" + copyHint.innerHTML + "</span>";
    var dummy = document.createElement('input');
    var text = "https://8thwall.com/web";
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
};

function getInAppBrowserType(browser) {
  var safariShown = ['Apple News', 'Twitter', 'Tumblr'];

  if (safariShown.includes(browser)) {
    return 'Safari';
  }

  var ellipsisShown = ['Facebook Messenger'];

  if (ellipsisShown.includes(browser)) {
    return 'Ellipsis';
  }

  return undefined;
} // Show some messaging if we can't show XR experience.


function showUnsupportedMessage(detail) {
  if (!detail) {
    // Everything is ok.
    return;
  } // We have an XR Exception, so just show a generic error message.


  if (detail.error) {
    console.log("Reality error", detail.error);
    document.getElementById('error_msg_unknown').classList.remove('hidden');
    document.getElementById('error_unknown_detail').innerHTML = detail.error;
    return;
  } // This device / browser is not supported.


  if (!detail.isDeviceBrowserSupported) {
    console.log("Unsupported device / browser", detail.compatibility); // Check if on a mobile device.

    if (!detail.compatibility['has_device']) {
      document.getElementById('error_msg_device').classList.remove('hidden');
      return; // Check if using a problematic In-App Browser.
    } else if (detail.compatibility['browser']) {
      if (detail.compatibility['os'] == 'iOS') {
        var browserType = getInAppBrowserType(detail.compatibility['browser']);

        if (browserType) {
          document.getElementById('error_msg_open_in_safari').classList.remove('hidden');

          if (browserType == 'Safari') {
            document.getElementById('apple_open_safari_hint').classList.remove('hidden');
            return;
          } else if (browserType == 'Ellipsis') {
            document.getElementById('apple_tap_to_open_safari_hint').classList.remove('hidden');
            return;
          }
        }

        document.getElementById('error_msg_apple_almost_there').classList.remove('hidden');
        return;
      } else if (detail.compatibility['os'] == 'Android') {
        document.getElementById('error_msg_android_almost_there').classList.remove('hidden');
        return;
      } // Check if using a supported browser.

    } else if (!detail.compatibility['has_browser']) {
      if (detail.compatibility['os'] == 'iOS') {
        document.getElementById('error_msg_apple_almost_there').classList.remove('hidden');
        return;
      } else if (detail.compatibility['os'] == 'Android') {
        document.getElementById('error_msg_android_almost_there').classList.remove('hidden');
        return;
      } // Check if browser has camera access.

    } else if (!detail.compatibility['has_user_media']) {
      if (detail.compatibility['os'] == 'iOS') {
        document.getElementById('error_msg_apple_almost_there').classList.remove('hidden');
        return;
      } else if (detail.compatibility['os'] == 'Android') {
        document.getElementById('error_msg_android_almost_there').classList.remove('hidden');
        return;
      }
    }
  } // This shouldn't happen, but who knows so show a generic error here.


  document.getElementById('error_msg_unknown').classList.remove('hidden');
}

AFRAME.registerComponent('load-progress', {
  init: function init() {
    var _this5 = this;

    var aframeLoaded = false;
    var waitingOnReality = false;
    var loadBackground = document.querySelector('#loadBackground');
    var loadImageContainer = document.querySelector('#loadImageContainer');
    var tapPrompt = document.getElementById("tapPrompt");
    var scoreCount = document.getElementById("scoreCount");
    var camPermissionsRequest = document.getElementById("requestingCameraPermissions");
    var camPermissionsFailedAndroid = document.getElementById("cameraPermissionsErrorAndroid");
    var camPermissionsFailedApple = document.getElementById("cameraPermissionsErrorApple");
    var camPermissionsFailedSamsung = document.getElementById("cameraPermissionsErrorSamsung");

    var hideLoadingScreen = function hideLoadingScreen() {
      loadImageContainer.classList.add('fade-out');
      setTimeout(function () {
        loadBackground.classList.add('fade-out');
        setTimeout(function () {
          return loadBackground && loadBackground.parentNode && loadBackground.parentNode.removeChild(loadBackground);
        }, 1000);
      }, 1000);
    };

    var checkLoaded = function checkLoaded() {
      if (aframeLoaded && !waitingOnReality) {
        hideLoadingScreen();
      }
    };

    if (this.el.getAttribute('xrweb') !== null) {
      console.log("waiting on reality");
      waitingOnReality = true;
      this.el.addEventListener('camerastatuschange', function (event) {
        console.log('status change', event.detail.status);

        switch (event.detail.status) {
          case 'requesting':
            camPermissionsRequest.classList.remove('hidden');
            break;

          case 'hasStream':
            camPermissionsRequest.classList.add('fade-out');
            break;

          case 'failed':
            camPermissionsRequest.classList.add('hidden');
            var ua = navigator.userAgent;

            if (ua.includes('Linux')) {
              var instructionsToShow;

              if (navigator.userAgent.includes('SamsungBrowser')) {
                instructionsToShow = document.getElementsByClassName('samsung-instruction');
              } else {
                instructionsToShow = document.getElementsByClassName('chrome-instruction');
              }

              camPermissionsFailedAndroid.classList.remove('hidden');

              for (var i = 0; i < instructionsToShow.length; i++) {
                instructionsToShow[i].classList.remove('hidden');
              }
            } else {
              camPermissionsFailedApple.classList.remove('hidden');
            }

            _this5.el.emit('realityerror');

            break;
        }
      });
      this.el.addEventListener('realityready', function (event) {
        console.log("Reality ready");
        tapPrompt.classList.remove('hidden');
        waitingOnReality = false;
        checkLoaded();
      });
      this.el.addEventListener('realityerror', function (event) {
        _this5.el.classList.add('hidden');

        _this5.el.setAttribute('visible', 'false');

        _this5.el.pause();

        hideLoadingScreen();

        if (event.detail) {
          showUnsupportedMessage(event.detail);
        }
      });
    }

    this.el.addEventListener('loaded', function (e) {
      console.log('all assets loaded!');
      aframeLoaded = true;
      checkLoaded();
    });
  }
});
AFRAME.registerComponent('match-controller', {
  schema: {
    imageSourceLocation: {
      default: 'img/emoji/'
    },
    swipeDelay: {
      default: 500
    },
    swipeDuration: {
      default: 500
    }
  },
  init: function init() {
    var swipeSnd = document.querySelector('#Swipe').components.sound;
    var correctSnd = document.querySelector('#Correct').components.sound;
    var errorSnd = document.querySelector('#Error').components.sound;
    var el = this.el;
    var matchingModal = document.getElementById('matchModal');
    var currentCard = document.getElementById('matchCurrentCard');
    var swipedCard = document.getElementById('matchSwipedCard');
    var matchSwipePrompt = document.getElementById('matchSwipePrompt');
    var matchWrong = document.getElementById('matchWrong');
    var ret = document.getElementById('reticle');
    var bg2 = document.getElementById('matchBgCard2');
    var data = this.data;
    var canSwipe = false;
    var correctImage;
    var currentImage;
    var imagesSinceCorrect = 0;
    var streakLength = 0;
    var setImageTimeout = null;
    var wrongImages = [];

    for (var i = 0; i < 22; i++) {
      wrongImages.push("wrong-".concat(i, ".png"));
    }

    var getNextImage = function getNextImage() {
      // Always show correct next image after streak exceeds 3, and sometimes before
      var probabilityToShowCorrectNext = 1;

      switch (streakLength) {
        case 0:
          probabilityToShowCorrectNext = 0;
          break;

        case 1:
          probabilityToShowCorrectNext = 0.10;
          break;

        case 2:
          probabilityToShowCorrectNext = 0.35;
          break;
      }

      if (Math.random() < probabilityToShowCorrectNext) {
        // Show correct match next
        return correctImage;
      } // Show non-match that isn't the same as the current one


      var randomIndex = Math.floor(Math.random() * wrongImages.length);

      if (wrongImages[randomIndex] !== currentImage) {
        return wrongImages[randomIndex];
      } // Choose random offset such that we don't pick the same non-match again


      var offset = 1 + Math.floor(Math.random() * (wrongImages.length - 1));
      var finalIndex = (randomIndex + offset) % wrongImages.length;
      return wrongImages[finalIndex];
    };

    var setCardImage = function setCardImage(card, image) {
      card.firstElementChild.style.backgroundImage = "";
      card.firstElementChild.style.backgroundImage = "url('".concat(data.imageSourceLocation).concat(image, "')");
    };

    var show = function show(answerImage) {
      console.log('showing matchUI');
      correctImage = answerImage;
      imagesSinceCorrect = 0;
      streakLength = 0;
      matchModal.classList.remove('hidden');
      currentCard.classList.remove('hidden');
      bg2.classList.remove('hidden');
      matchModal.classList.remove('zoom-out');
      matchModal.classList.add('zoom-in');
      showNext();
      setCardImage(swipedCard, currentImage);
      canSwipe = true;
    };

    var hide = function hide() {
      canSwipe = false;
      currentCard.classList.add('hidden');
      bg2.classList.add('hidden');
      matchModal.classList.remove('zoom-in');
      setTimeout(function () {
        matchModal.classList.add('zoom-out');
      }, data.swipeDuration);
    };

    var showNext = function showNext() {
      canSwipe = false;
      setTimeout(function () {
        return bg2.classList.add('card-up');
      }, 200);
      setTimeout(function () {
        return currentCard.classList.add('card-up');
      }, 0);
      currentImage = getNextImage();
      setCardImage(currentCard, currentImage);
      setTimeout(function () {
        return canSwipe = true;
      }, data.swipeDelay);

      if (setImageTimeout) {
        clearTimeout(setImageTimeout);
      }

      var toSet = currentImage;
      setImageTimeout = setTimeout(function () {
        setCardImage(swipedCard, toSet);
      }, data.swipeDuration);
    };

    var reject = function reject() {
      if (!canSwipe) {
        return;
      }

      matchSwipePrompt.classList.add('hidden'); // play swipe sound

      swipeSnd.playSound(); // Reset streak length to 0 if rejected correct match, otherwise increment it

      streakLength = currentImage === correctImage ? 0 : streakLength + 1;
      currentCard.classList.remove('card-up');
      bg2.classList.remove('card-up');
      setCardImage(swipedCard, currentImage);
      showNext();
      swipedCard.classList.remove('swipe-left');
      swipedCard.classList.remove('swipe-right');
      setTimeout(function () {
        return swipedCard.classList.add('swipe-left');
      }, 0);
    };

    var accept = function accept() {
      if (!canSwipe) {
        return;
      }

      matchSwipePrompt.classList.add('hidden'); // play swipe sound

      swipeSnd.playSound(); // Reset streak length to 0 if accepted non match, otherwise increment it

      streakLength = currentImage !== correctImage ? 0 : streakLength + 1;
      currentCard.classList.remove('card-up');
      bg2.classList.remove('card-up');
      setCardImage(swipedCard, currentImage);
      swipedCard.classList.remove('swipe-left');
      swipedCard.classList.remove('swipe-right');
      setTimeout(function () {
        return swipedCard.classList.add('swipe-right');
      }, 0);

      if (currentImage === correctImage) {
        hide();
        el.emit('matchaccepted', '');
        correctSnd.playSound();
      } else {
        // TODO: show feedback for wrong swipe
        matchWrong.classList.remove('hidden');
        matchWrong.classList.remove('bounce-up');
        setTimeout(function () {
          return matchWrong.classList.add('bounce-up');
        }, 0);
        showNext();
        errorSnd.playSound();
      }
    };

    this.el.addEventListener('showmatch', function (e) {
      return show(e.detail);
    });
    this.el.sceneEl.addEventListener('swiperight', accept);
    this.el.sceneEl.addEventListener('swipeleft', reject);
  }
});
AFRAME.registerComponent('shake', {
  schema: {
    enabled: {
      default: true
    },
    amount: {
      default: 10
    },
    // Max rotation from initial rotation, in degrees
    speed: {
      default: 5
    },
    // Number of oscillations per second
    amountX: {
      default: -1
    },
    // Axis amount values take [amount] if unset
    amountY: {
      default: -1
    },
    amountZ: {
      default: -1
    },
    speedX: {
      default: -1
    },
    // Axis speed values take [speed] if unset
    speedY: {
      default: -1
    },
    speedZ: {
      default: -1
    }
  },
  init: function init() {
    this.internalData = {
      startRotation: this.el.object3D.rotation.clone()
    };
  },
  update: function update() {
    var data = this.data;
    this.internalData.enabled = data.enabled;

    if (data.enabled == false) {
      if (this.internalData.startRotation) {
        this.el.object3D.rotation.copy(this.internalData.startRotation);
      } else {
        this.el.object3D.quaternion.copy(new THREE.Quaternion());
      }
    } else {
      var internalData = this.internalData;
      internalData.amountX = data.amountX < 0 ? data.amount : data.amountX;
      internalData.amountY = data.amountY < 0 ? data.amount : data.amountY;
      internalData.amountZ = data.amountZ < 0 ? data.amount : data.amountZ;
      internalData.amountX *= THREE.Math.DEG2RAD;
      internalData.amountY *= THREE.Math.DEG2RAD;
      internalData.amountZ *= THREE.Math.DEG2RAD;
      internalData.speedX = data.speedX < 0 ? data.speed : data.speedX;
      internalData.speedY = data.speedY < 0 ? data.speed : data.speedY;
      internalData.speedZ = data.speedZ < 0 ? data.speed : data.speedZ;
      var twoPi = 2 * Math.PI;
      internalData.speedX *= twoPi;
      internalData.speedY *= twoPi;
      internalData.speedZ *= twoPi;
      internalData.passedX = Math.random() * twoPi;
      internalData.passedY = Math.random() * twoPi;
      internalData.passedZ = Math.random() * twoPi;
    }
  },
  tick: function tick(time, timeDelta) {
    var internalData = this.internalData;

    if (internalData.enabled) {
      var secondsPassed = timeDelta / 1000;
      internalData.passedX += internalData.speedX * secondsPassed;
      internalData.passedY += internalData.speedY * secondsPassed;
      internalData.passedZ += internalData.speedZ * secondsPassed;
      var scalarX = Math.sin(internalData.passedX);
      var scalarY = Math.sin(internalData.passedY);
      var scalarZ = Math.sin(internalData.passedZ);
      var rotationX = internalData.amountX * scalarX;
      var rotationY = internalData.amountY * scalarY;
      var rotationZ = internalData.amountZ * scalarZ;
      var rotation = new THREE.Euler(internalData.startRotation.x + rotationX, internalData.startRotation.y + rotationY, internalData.startRotation.z + rotationZ);
      this.el.object3D.rotation.copy(rotation);
    }
  }
});

AFRAME.registerComponent('scale-animator', {
  init: function init() {
    var el = this.el;
    var animating = false;
    var timeout = null;
    var currentStep = 0;
    var animationCommand = null;

    var clearAnimation = function clearAnimation() {
      if (animating) {
        if (timeout) {
          clearTimeout(timeout);
        }

        el.removeAttribute('animation__scaleanimator');
      }

      animating = false;
    };

    var doStep = function doStep() {
      if (currentStep >= animationCommand.sequence.length) {
        if (animationCommand.repeat) {
          currentStep = 0;
        } else {
          return;
        }
      }

      var step = animationCommand.sequence[currentStep];
      el.setAttribute('animation__scaleanimator', {
        property: 'scale',
        dur: step.dur,
        to: step.to,
        easing: step.easing
      });
      timeout = setTimeout(doStep, step.dur);
      currentStep++;
    };

    this.el.addEventListener('scaleanimationstart', function (event) {
      clearAnimation();
      animationCommand = event.detail;

      if (animationCommand.startScale) {
        el.setAttribute('scale', animationCommand.startScale);
      }

      if (animationCommand.sequence.length > 0) {
        animationCommand = animationCommand;
        currentStep = 0;
        animating = true;
        doStep();
      }
    });
    this.el.addEventListener('scaleanimationstop', clearAnimation);
  }
  });

  
AFRAME.registerComponent('rebound', {
  schema: {
    minVelocity: {
      default: 1e-3
    },
    minHeight: {
      default: 0.25
    }
  },
  tick: function tick() {
    console.log("rebound tick");

    if (!this.el.body) {
      this.el.removeAttribute(this.attrName);
      return;
    }

    if (this.el.body.velocity.almostZero(this.data.minVelocity) || this.el.object3D.position.y < this.data.minHeight) {
      console.log("rebound time!");
      this.el.emit('rebound', '', false);
      this.el.removeAttribute(this.attrName);
    }
  }
});
AFRAME.registerComponent('fullscreen-button', {
  init: function init() {
    var buttonPushSnd = document.querySelector('#ButtonPush').components.sound;
    var supportsFullscreen = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled || false;

    if (!supportsFullscreen) {
      return;
    }

    var getFullscreenElement = function getFullscreenElement() {
      return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
    };

    var getRequestFullscreenFunction = function getRequestFullscreenFunction(element) {
      return element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
    };

    var getExitFullscreenFunction = function getExitFullscreenFunction(element) {
      return element.exitFullscreen || element.mozCancelFullScreen || element.webkitExitFullscreen || element.msExitFullscreen;
    };

    var attachFullscreenEvent = function attachFullscreenEvent(callback) {
      if (document.onfullscreenchange !== undefined) {
        document.addEventListener("fullscreenchange", callback);
      } else if (document.onmozfullscreenchange !== undefined) {
        document.addEventListener("mozfullscreenchange", callback);
      } else if (document.onwebkitfullscreenchange !== undefined) {
        document.addEventListener("webkitfullscreenchange", callback);
      } else if (document.onmsfullscreenchange !== undefined) {
        document.addEventListener("MSFullscreenChange", callback);
      }
    };

    var goFullscreen = function goFullscreen() {
      if (fullscreenElement) {
        return;
      }

      var element = window.document.activeElement;
      getRequestFullscreenFunction(element).call(element);
    };

    var exitFullscreen = function exitFullscreen() {
      if (fullscreenElement != null) {
        getExitFullscreenFunction(document).call(document);
      }
    };

    var goFullscreenButton = document.getElementById('goFullscreenButton');
    var exitFullscreenButton = document.getElementById('exitFullscreenButton');
    var fullscreenElement = null;

    var fullscreenChangeHandler = function fullscreenChangeHandler(event) {
      buttonPushSnd.playSound();
      fullscreenElement = getFullscreenElement();

      if (fullscreenElement == null) {
        goFullscreenButton.classList.remove('hidden');
        exitFullscreenButton.classList.add('hidden');
      } else {
        goFullscreenButton.classList.add('hidden');
        exitFullscreenButton.classList.remove('hidden');
      }
    };

    attachFullscreenEvent(fullscreenChangeHandler);
    document.getElementById('goFullscreenButton').addEventListener("click", goFullscreen);
    document.getElementById('exitFullscreenButton').addEventListener("click", exitFullscreen);
    this.el.addEventListener('realityready', function () {
      fullscreenElement = getFullscreenElement();

      if (fullscreenElement == null) {
        goFullscreenButton.classList.remove('hidden');
      } else {
        exitFullscreenButton.classList.remove('hidden');
      }
    });
  }
});
AFRAME.registerComponent('jini-tap', {
  init: function init() {
    var jini = this.el;
    var canTap = true;
    var tappedAxis = '0 -0.4 -1';
    jini.addEventListener('click', function () {
      if (canTap && jini.getAttribute('look-at-slerp').target == 'camera') {
        var previousAxis = jini.getAttribute('look-at-slerp').axis;
        jini.setAttribute('look-at-slerp', {
          axis: tappedAxis
        });
        canTap = false;
        setTimeout(function () {
          canTap = true;

          if (jini.getAttribute('look-at-slerp').axis == tappedAxis) {
            jini.setAttribute('look-at-slerp', {
              axis: previousAxis
            });
          }
        }, 200);
      }
    });
  }
});
AFRAME.registerComponent('end-card', {
  init: function init() {
    var scene = this.el.sceneEl;
    var buttonPushSound = document.querySelector('#ButtonPush').components.sound;
    var popInSound = document.querySelector('#PopIn').components.sound;
    var slideCardSound = document.querySelector('#SlideCard').components.sound;
    var endCardContainer = document.getElementById('endCardContainer');
    var endCard = document.getElementById('endCard');
    var endCardLogo = document.getElementById('endCardLogo');
    var endCardModalBackground = document.getElementById('endCardModalBackground');
    var shareButton = document.getElementById('shareButton');
    var shareTray = document.getElementById('shareTray');
    var copyButton = document.getElementById('copyButton');
    var replayButton = document.getElementById('replayButton');
    var whiteOut = document.getElementById('whiteout');
    var linkToCopy = "8thwall.com/web";
    var endCardCollapsed = false;
    var shareTrayCollapsed = true;
    var canCollapse = true;
    var didHandleShowCard = false;

    var collapseEndCard = function collapseEndCard() {
      if (!canCollapse || endCardCollapsed || !didHandleShowCard) {
        return;
      }

      if (!shareTrayCollapsed) {
        toggleShareTray();
      }

      endCardCollapsed = true;
      endCardContainer.classList.add('endCardCollapsed');
      endCardModalBackground.classList.add('hidden');
      slideCardSound.playSound();
    };

    var hideEndCard = function hideEndCard() {
      if (!didHandleShowCard) {
        return;
      }

      endCardCollapsed = true;
      endCardContainer.classList.add('endCardHidden');
      endCardModalBackground.classList.add('hidden');
      slideCardSound.playSound();
    };

    var expandEndCard = function expandEndCard() {
      if (!endCardCollapsed || !didHandleShowCard) {
        return;
      }

      endCardCollapsed = false;
      endCardContainer.classList.remove('endCardHidden');
      endCardContainer.classList.remove('endCardCollapsed');
      endCardModalBackground.classList.remove('hidden');
      slideCardSound.playSound();
    };

    var toggleEndCard = function toggleEndCard() {
      if (endCardCollapsed) {
        expandEndCard();
      } else {
        collapseEndCard();
      }
    };

    var toggleShareTray = function toggleShareTray() {
      if (shareTrayCollapsed) {
        shareTray.classList.remove('shareTrayCollapsed');
      } else {
        shareTray.classList.add('shareTrayCollapsed');
      }

      shareTrayCollapsed = !shareTrayCollapsed;
      slideCardSound.playSound();
    };

    var handleShowCard = function handleShowCard(event) {
      canCollapse = event.detail.collapse;

      if (window._c8.referralId && !didHandleShowCard) {
        linkToCopy = linkToCopy + '?s=' + 'www.icarusinnovations.co/jini';
        var facebookShareLink = document.getElementById('facebookShareLink');
        facebookShareLink.href = facebookShareLink.href + '?s=' + 'www.icarusinnovations.co/jini';
        var mailShareLink = document.getElementById('mailShareLink');
        mailShareLink.href = mailShareLink.href + '?s=' + 'www.icarusinnovations.co/jini';
      }

      didHandleShowCard = true;

      if (!canCollapse) {
        endCard.classList.add('uncollapsable');
      } else {
        endCard.classList.remove('uncollapsable');
      }

      endCardContainer.classList.remove('hidden');
      endCardModalBackground.classList.remove('hidden');
      expandEndCard();
      popInSound.playSound();
    };

    var copyToClipboard = function copyToClipboard() {
      var el = document.createElement('textarea');
      el.value = linkToCopy;
      document.body.appendChild(el);
      Object.assign(el.style, {
        zIndex: '-99999',
        position: 'absolute'
      });
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        el.contentEditable = true;
        el.readOnly = false;
        var s = window.getSelection();
        s.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(el);
        s.addRange(range);
        el.setSelectionRange(0, 999999);
      } else {
        el.select();
      }

      document.execCommand('copy');
      document.body.removeChild(el);
      console.log("copied");
      copyButton.classList.add('copied');
      buttonPushSound.playSound();
    };

    var reload = function reload() {
      endCardContainer.style.zIndex = '5';
      whiteOut.classList.remove('hidden');
      whiteOut.classList.add('fade-in');
      setTimeout(function () {
        window.location.reload(false);
      }, 500);
    };

    endCardLogo.addEventListener('click', toggleEndCard);
    endCardModalBackground.addEventListener('click', collapseEndCard);
    shareButton.addEventListener('click', toggleShareTray);
    copyButton.addEventListener('click', copyToClipboard);
    replayButton.addEventListener('click', reload);
    scene.addEventListener('showendcard', handleShowCard);
    scene.addEventListener('photoModeCollapsed', expandEndCard);
    scene.addEventListener('photoModeCapture', hideEndCard);
  }
});


AFRAME.registerComponent('photo-mode', {
  init: function init() {
    var scene = this.el.sceneEl;
    var container = document.getElementById('photoModeContainer');
    var toggleButton = document.getElementById('photoModeToggleButton');
    var shutterButton = document.getElementById('photoModeShutterButton');
    var imageContainer = document.getElementById('photoModeImageContainer');
    var image = document.getElementById('photoModeImage');
    var imageBackground = document.getElementById('photoModeImageBackground');
    var savePrompt = document.getElementById('photoModeSavePrompt');
    var holdFeedback = document.getElementById('photoModeHoldFeedback');
    var flash = document.getElementById('photoModeFlash');
    var state = 'photoModeCollapsed';
    var resetSavePromptTimeout = null;
    var savePromptText = 'Touch and hold to save\xa0💾';

    var setState = function setState(newState) {
      endHold();
      container.classList.remove(state);
      container.classList.add(newState);
      state = newState;
      scene.emit(newState, '');
    };

    var startHold = function startHold(event) {
      holdFeedback.classList.add('holding-image');
      holdFeedback.style.left = event.touches[0].clientX + 'px';
      holdFeedback.style.top = event.touches[0].clientY + 'px';
    };

    var endHold = function endHold() {
      holdFeedback.classList.remove('holding-image');
    };

    image.addEventListener('touchstart', startHold);
    image.addEventListener('touchend', endHold);
    image.addEventListener('touchcancel', endHold); // Prevents force touching the image

    window.addEventListener('touchforcechange', function (event) {
      var force = event.changedTouches[0].force;
      var id = event.changedTouches[0].target.id;

      if (id === 'photoModeImage' && force > 0.14) {
        savePrompt.textContent = "Too hard! Try pressing more lightly\xa0☁️";
        clearTimeout(resetSavePromptTimeout);
        resetSavePromptTimeout = setTimeout(function () {
          return savePrompt.textContent = savePromptText;
        }, 1000);
        endHold();
        event.preventDefault();
      }
    });
    toggleButton.addEventListener('click', function () {
      if (state === 'photoModeCollapsed') {
        setState('photoModeCapture');
      } else {
        setState('photoModeCollapsed');
      }
    });
    shutterButton.addEventListener('click', function () {
      image.src = "";
      scene.emit('screenshotRequest', '');
      shutterButton.classList.add('photo-mode-shutter-click');
      setTimeout(function () {
        return shutterButton.classList.remove('photo-mode-shutter-click');
      }, 200);
      flash.classList.remove('hidden');
    });
    scene.addEventListener('screenshotReady', function (event) {
      image.src = 'data:image/jpeg;base64,' + event.detail;
      savePrompt.textContent = savePromptText;
      setState('photoModeSave');
      flash.style.opacity = '0';
      setTimeout(function () {
        flash.classList.add('hidden');
        flash.style.opacity = '1';
      }, 500);
    });
    scene.addEventListener('swipeleft', function () {
      if (state === 'photoModeSave') {
        setState('photoModeCapture');
      }
    });
    imageBackground.addEventListener('click', function () {
      setState('photoModeCapture');
    });
  }
});
AFRAME.registerComponent('attach', {
  schema: {
    target: {
      default: ''
    }
  },
  update: function update() {
    var targetElement = document.getElementById(this.data.target);

    if (!targetElement) {
      return;
    }

    this.target = targetElement.object3D;
  },
  tick: function tick() {
    if (this.target) {
      this.el.object3D.position.copy(this.target.position);
    }
  }
});

/***/ }),

/***/ "./apps/client/jini/js/index.js":
/*!**************************************!*\
  !*** ./apps/client/jini/js/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./jini */ "./apps/client/jini/js/jini.js");

__webpack_require__(/*! ./wish1 */ "./apps/client/jini/js/wish1.js");

__webpack_require__(/*! ./wish2 */ "./apps/client/jini/js/wish2.js");

__webpack_require__(/*! ./wish3 */ "./apps/client/jini/js/wish3.js");

__webpack_require__(/*! ./helper-components */ "./apps/client/jini/js/helper-components.js");

/***/ }),

/***/ "./apps/client/jini/js/jini.js":
/*!*************************************!*\
  !*** ./apps/client/jini/js/jini.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// TODO (IM) Comment out or remove this variable before shipping final version
// For fast debugging and jumping directly into wishes
var skipIntroDebug = false; // true

AFRAME.registerComponent('ground-strike', {
  init: function init() {
    var voda1 = document.querySelector('#FastWoosh').components.sound;
    var buttonPushSnd = document.querySelector('#ButtonPush').components.sound;
    var ground = this.el;
    var scene = this.el.sceneEl;
    var cam = document.querySelector('#camera');
    var lamp = document.getElementById("lamp");
	var voda = document.getElementById("voda");
    var tapPrompt = document.getElementById("tapPrompt");
    var anchor = document.getElementById("anchor");
    var directionalLightBase = document.getElementById('directionalLightBase');
    var recenterBtn = document.getElementById("recenterButtonContainer"); //Lights
	var journeyPrompt = document.getElementById("journeyPrompt");

    var dirLight = document.querySelector('#dirLight');
    var pLight = document.querySelector('#pLight');
    var didStrike = false;
	
	
    ground.addEventListener('mousedown', function (e) {
      if (didStrike) {
        return;
      }

      didStrike = true;
      console.log("Ground strike");
      buttonPushSnd.playSound();
      recenterBtn.classList.remove('hidden');
      recenterBtn.classList.add('fade-in');
      tapPrompt.parentNode.removeChild(tapPrompt);
      var anchorPosition = new THREE.Vector3(e.detail.intersection.point.x, 0, e.detail.intersection.point.z);
      var lampStartPosition = anchorPosition.clone().add(new THREE.Vector3(0, 15, 0));
      var cameraPosition = cam.object3D.position;
      var cameraAngle = Math.atan2(cameraPosition.x - anchorPosition.x, cameraPosition.z - anchorPosition.z);
      anchor.object3D.position.copy(anchorPosition);
      var cameraAngleEuler = new THREE.Euler(0, cameraAngle, 0);
      anchor.object3D.setRotationFromEuler(cameraAngleEuler);
      directionalLightBase.object3D.setRotationFromEuler(cameraAngleEuler);
	  
	  voda1.playSound();
	  
      setTimeout(function () {
        lamp.object3D.position.copy(lampStartPosition);
        lamp.setAttribute('visible', 'true'); // Stretch the lamp vertically as it falls
		
		
        voda.setAttribute('jini-opacity-color', 0);
       
        lamp.setAttribute('animation__landing', {
          property: 'position',
          dur: 100,
          loop: false,
          to: "".concat(anchorPosition.x, " ").concat(anchorPosition.y, " ").concat(anchorPosition.z, " ") //correction for x length
        });
		
		
      }, 500);
	  
      setTimeout(function () {
        recenterBtn.classList.remove('fade-in');
      }, 1000);
    });
	
	//Very Impo
    lamp.addEventListener('animationcomplete', function (e) {
      if (e.detail.name == 'animation__landing') {

        voda.setAttribute('animation__opacity', {
          property: 'jini-opacity-color',
          dur: 5000,
          easing: 'easeInOutQuad',
          loop: false,
          to: '1'
        });
		

        /*lamp.emit('landed', {
          value: 'islanded'
        }, true);*/
        console.log(e.detail.name);
      }
    });
	
	journeyPrompt.addEventListener('click',function(){
		journeyPrompt.parentNode.removeChild(journeyPrompt);
		setTimeout(function () {
			lamp.emit('landed', {
				value: 'islanded'
				}, true)
			lamp.parentNode.removeChild(lamp);
		}, 100);
	});
		
	voda.addEventListener('animationcomplete', function (e) {
      if (e.detail.name == 'animation__opacity') {
		
	
		voda.setAttribute('self-shadow');
		setTimeout(function () {
		journeyPrompt.classList.remove('hidden');
		journeyPrompt.classList.add('fade-in');
        journeyPrompt.classList.remove('fade-in');
		}, 1000);
	 } 
    });
	
  }
  
});

AFRAME.registerComponent('model-opacity', {
  schema: {default: 0.0},
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;
    if (!mesh) { return; }
    mesh.traverse(function (node) {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});

AFRAME.registerComponent('jini-logic', {
  init: function init() {
    //Brand guideline red adjusted for renderer
    var redringcolor = '#DD0033';
	//Brand guideline green adjusted for renderer
    var greenringcolor = '#00ED5A';
    var jini = this.el;
	var scene = this.el.sceneEl;
    var jiniBase = document.getElementById('jiniBase');
    var cam = document.querySelector('#camera');
    var lamp = document.getElementById("lamp");
    var wishes = this.el.sceneEl.querySelector('#wishes');
    var soundon = document.getElementById("soundon");
    var wish1btn = document.getElementById("wish1btn");
    var wish2btn = document.getElementById("wish2btn");
    var wish3btn = document.getElementById("wish3btn");
    var firstWishRing = document.querySelector('#wish1-ring');
    var secWishRing = document.querySelector('#wish2-ring');
    var thirdWishRing = document.querySelector('#wish3-ring');
    var makeWishSnd = document.querySelector('#MakeYourWish').components.sound; //19607

	var AssistantSnd = document.querySelector('#Assistant').components.sound;
    var beamInSnd = document.querySelector('#JiniBeamIn');
    var buttonSpawnSnd = document.querySelector('#ButtonSpawn');
    var highlightWishSnd = document.querySelector('#HighlightWish');
    var dingSnd = document.querySelector('#Ding');
    var endSnd = document.querySelector('#EndLine').components.sound;
    var buttonPushSnd = document.querySelector('#ButtonPush');
    var audioAsset = document.querySelector('#EndLineSrc');
	
    console.log(audioAsset.duration); //      JINI Model Landing sequence

    scene.addEventListener('landed', function (event) {
      var camForward = cam.object3D.getWorldDirection();
      var camTheta = THREE.Math.radToDeg(Math.atan2(camForward.x, camForward.z));
      var lampPos = lamp.getAttribute('position');
      var startPos = String(lampPos.x + ' ' + (lampPos.y) + ' ' + lampPos.z);
      jiniBase.setAttribute('look-at-slerp', 'target: camera; offset: 0 2.5 0; tilt: true');
     
      setTimeout(function () {
		
        jini.setAttribute('jini-opacity-color', 0);
        jiniBase.setAttribute('position', startPos);
        jiniBase.setAttribute('visible', 'true');
        jiniBase.setAttribute('rotation', String(0 + ' ' + camTheta + ' ' + 0));
        jini.setAttribute('animation__jiniFadeIn', {
          property: 'jini-opacity-color',
          dur: 600,
          easing: 'easeInOutQuad',
          loop: false,
          to: '1'
        });
		
		//start with bjp 
        jini.emit('presentchoices', {
          value: 'present choices'
        });

        console.log('jini emerges at ' + startPos);
      }, 2000);
    }); 
	
	
	//reneter jini wish with all wishes activeElement
	scene.addEventListener('showWishes', function(event){	
	   console.log("Wishes Shown Again");
	   // Disable click to move, recenter anchor, show wish panel;
       var newAnchorPosition = anchor.object3D.position.clone();
       newAnchorPosition.y = 0;
       jiniBase.object3D.position.copy(newAnchorPosition);
       
       jini.setAttribute('visible','true');
       wishes.setAttribute('visible', 'true');
       setTimeout(function () {
		console.log("in timeout");
         wishes.setAttribute('animation', {
            property: 'scale',
            dur: '500',
            to: '5 5 5',
            easing: 'easeOutElastic'
          });
		 	
		jini.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '500',
          to: '20 20 20',
          easing: 'easeInElastic'
        });
		
       },10);

		wishes.addEventListener('animationcomplete', function (e) {
			if (e.detail.name == 'animation') {
				wishes.removeAttribute('animation');
				wishes.removeEventListener('animationcomplete',this);
			}
		});
		
		jini.addEventListener('animationcomplete', function (e) {
			if (e.detail.name == 'animation__popIn') {
				jini.removeAttribute('animation__popIn');
				jini.removeEventListener('animationcomplete',this);
			}
		});
		
	});
	
	// JINI presents wish
    scene.addEventListener('presentchoices', function (event) {
		
	  
      console.log(event.detail.value); //Jini has already faded in, so remove this property which modulates his opacity

      jini.removeAttribute('jini-opacity-color'); // let modelPos = model.getAttribute('position');
      // let lampPos = lamp.getAttribute('position');
      // let floatPos = String((modelPos.x) + ' ' + (lampPos.y + 0.5) + ' ' + (modelPos.z));
      // TODO (IM) Remove this entire section for shipping

	  AssistantSnd.playSound();
	  
      if (skipIntroDebug == true) {
        scene.emit('makechoice', '');
        soundon.setAttribute('visible', 'false');
        wishes.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '500',
          to: '5 5 5',
          easing: 'easeOutElastic'
        });
		
		console.log("wishes " + wishes.getAttribute('position'));
        firstWishRing.setAttribute('material', {
          color: 'black',
          emissive: greenringcolor,
          emissiveIntensity: '1'
        });
        wish1btn.setAttribute('class', 'cantap');
        highlightWishSnd.components.sound.playSound();
        secWishRing.setAttribute('material', {
          color: 'black',
          emissive: greenringcolor,
          emissiveIntensity: '1'
        });
        wish2btn.setAttribute('class', 'cantap');
        thirdWishRing.setAttribute('material', {
          color: 'black',
          emissive: greenringcolor,
          emissiveIntensity: '1'
        });
        wish3btn.setAttribute('class', 'cantap');
      } else {
        setTimeout(function () {
		  soundon.setAttribute('visible', 'true');
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
        }, 3000);
        setTimeout(function () {
          //fade out
          soundon.setAttribute('animation__opacity', {
            property: 'material.opacity',
            to: '0',
            dur: '800'
          });
          buttonSpawnSnd.components.sound.playSound();
		  console.log("wishes " + wishes.getAttribute('position').x +" "+wishes.getAttribute('position').y +" "+ wishes.getAttribute('position').z);
          wishes.setAttribute('animation__popIn', {
            property: 'scale',
            dur: '500',
            to: '5 5 5',
            easing: 'easeOutElastic'
          });
        }, 4500);
        setTimeout(function () {
          //first wish highlight
          soundon.setAttribute('visible', 'false');
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: 'white',
            emissiveIntensity: '1'
          });
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          dingSnd.components.sound.playSound();
        }, 9250);
        setTimeout(function () {
          //second wish highlight
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: 'white',
            emissiveIntensity: '1'
          });
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          dingSnd.components.sound.playSound();
        }, 11750);
        setTimeout(function () {
          //third wish highlight
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: 'white',
            emissiveIntensity: '1'
          });
          dingSnd.components.sound.playSound();
        }, 14250);
        setTimeout(function () {
          //reset wish highlight
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: redringcolor,
            emissiveIntensity: '1'
          });
        }, 18000); // TEMPORARY FIX: TODO (IM or RB) - Reset to zero
        //reset to idle

        //enable wish buttons 1-3

        setTimeout(function () {
          scene.emit('makechoice', '');
          firstWishRing.setAttribute('material', {
            color: 'black',
            emissive: greenringcolor,
            emissiveIntensity: '1'
          });
          wish1btn.setAttribute('class', 'cantap');
          highlightWishSnd.components.sound.playSound();
          secWishRing.setAttribute('material', {
            color: 'black',
            emissive: greenringcolor,
            emissiveIntensity: '1'
          });
          wish2btn.setAttribute('class', 'cantap');
          thirdWishRing.setAttribute('material', {
            color: 'black',
            emissive: greenringcolor,
            emissiveIntensity: '1'
          });
          wish3btn.setAttribute('class', 'cantap');
        }, 19000); //21500
      }

      console.log('jini floats');
    });
	
	//final showdown to show card
    scene.addEventListener('endScene', function (event) {
      console.log(event.detail.value);
      setTimeout(function () {
        endSnd.playSound();
        jini.setAttribute('animation-mixer', {
          clip: 'goodbye',
          loop: 'once',
          crossFadeDuration: '0.3'
        });
      }, 1500);
      setTimeout(function () {
        jini.setAttribute('animation-mixer', {
          clip: 'idleFloat',
          loop: 'repeat',
          crossFadeDuration: '0.3'
        }); // put up the end card

        jini.sceneEl.emit('showendcard', {
          collapse: true
        });
        jiniBase.setAttribute('click-move', '');
      }, 7000);
    });
  }
});


//for different photo poses
AFRAME.registerComponent('jini-photo-mode', {
  init: function init() {
    var scene = this.el.sceneEl;
    var jini = this.el;
    var jiniBase = document.getElementById('jiniBase');
    var anchor = document.getElementById('anchor');
    var wishes = document.getElementById('wishes');
    var camera = document.getElementById('camera');
    var jiniPoseList = document.getElementById('jiniPoseList');
    var container = document.getElementById('photoModeContainer');
    var toggleButton = document.getElementById('photoModeToggleButton');
    var tutorial = document.getElementById('photoModeTutorial');
    var wishButtons = [document.getElementById('wish1btn'), document.getElementById('wish2btn'), document.getElementById('wish3btn')];
    var photoModeEnabled = false;
    var beforeWish = true;
    var showedTutorial = false;
    var poses = [{
      clip: 'idleFloat',
      image: 'idle.png'
    }, {
      clip: 'poseDance',
      image: 'dancing.png'
    }, {
      clip: 'poseDisappointed',
      image: 'disappointed.png'
    }, {
      clip: 'posePresent',
      image: 'presenting.png'
    }, {
      clip: 'poseSad',
      image: 'sad.png'
    }, {
      clip: 'poseUpset',
      image: 'upset.png'
    }, {
      clip: 'poseWave',
      image: 'wave.png'
    }, {
      clip: 'poseYay',
      image: 'yay.png'
    }];
    var selectedPoseIndex = 0;
    poses.forEach(function (pose, index) {
      pose.button = document.createElement('div');
      pose.button.classList.add('jini-pose-button');
      var imageElement = document.createElement('img');
      imageElement.src = 'img/emoji/' + pose.image;
      pose.button.appendChild(imageElement);
      pose.button.addEventListener('click', function () {
        poses[selectedPoseIndex].button.classList.remove('jini-pose-button-selected');
        pose.button.classList.add('jini-pose-button-selected');
        selectedPoseIndex = index;
        jini.removeAttribute('animation__spin');
        jini.setAttribute('animation__spin', {
          property: 'rotation',
          dur: '500',
          from: '0 0 0',
          to: '0 360 0',
          easing: 'easeInOutQuad'
        });
        setTimeout(function () {
          jini.setAttribute('animation-mixer', {
            clip: pose.clip,
            loop: 'repeat',
            crossFadeDuration: '0'
          });
        }, 250);
        pose.button.style.transform = 'scale(0.8)';
        setTimeout(function () {
          pose.button.style.transform = 'scale(1)';
        }, 200);
      });
      jiniPoseList.appendChild(pose.button);
    });
    poses[0].button.classList.add('jini-pose-button-selected');
    container.style.opacity = '0';

    var enablePhotoMode = function enablePhotoMode() {
      container.classList.remove('hidden');
      container.style.opacity = '1';
    };

    var disablePhotoMode = function disablePhotoMode() {
      container.style.opacity = '0';
      setTimeout(function () {
        return container.classList.add('hidden');
      }, 500);
    };

    scene.addEventListener('makechoice', enablePhotoMode);
    scene.addEventListener('wishstart', disablePhotoMode);
    scene.addEventListener('showendcard', function (event) {
      if (!event.detail.collapse) {
        // This is coming from a timeout to end the current scene
        container.classList.add('hidden');
        return;
      }

      container.style.bottom = "8vmin";
      beforeWish = false;
      enablePhotoMode();
    });
    scene.addEventListener('click', function () {
      if (showedTutorial) {
        container.classList.remove('photoModeTutorial');
      }
    });
    toggleButton.addEventListener('click', function () {
      if (photoModeEnabled) {
        poses[selectedPoseIndex].button.classList.remove('jini-pose-button-selected');
        poses[0].button.classList.add('jini-pose-button-selected');
        selectedPoseIndex = 0;
        jini.setAttribute('animation-mixer', {
          clip: 'idleFloat',
          loop: 'repeat',
          crossFadeDuration: '0'
        });
        container.classList.remove('photoModeTutorial');
        setTimeout(function () {
          return tutorial.classList.add('hidden');
        }, 500);
      }

      if (!photoModeEnabled && !showedTutorial) {
        showedTutorial = true;
        container.classList.add('photoModeTutorial');
      }

      if (!beforeWish) {
        photoModeEnabled = !photoModeEnabled;
        return;
      }

      if (!photoModeEnabled) {
        // Add click to move, hide wish panel
        jiniBase.setAttribute('click-move', '');
        wishes.setAttribute('animation', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
        setTimeout(function () {
          wishes.setAttribute('visible', 'false');
        }, 500);
        wishButtons.forEach(function (b) {
          return b.classList.remove('cantap');
        });
      } else {
        // Disable click to move, recenter anchor, show wish panel
        jiniBase.removeAttribute('click-move');
        var newAnchorPosition = jiniBase.object3D.position.clone();
        newAnchorPosition.y = 0;
        anchor.object3D.position.copy(newAnchorPosition);
        var anchorRotationY = Math.atan2(camera.object3D.position.x - jiniBase.object3D.position.x, camera.object3D.position.z - jiniBase.object3D.position.z);
        anchor.object3D.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), anchorRotationY);
        wishes.setAttribute('visible', 'true');
        wishButtons.forEach(function (b) {
          return b.classList.add('cantap');
        });
        setTimeout(function () {
          wishes.setAttribute('animation', {
            property: 'scale',
            dur: '500',
            to: '5 5 5',
            easing: 'easeOutElastic'
          });
        });
      }

      photoModeEnabled = !photoModeEnabled;
    });
  }
});

/***/ }),

/***/ "./apps/client/jini/js/wish1.js":
/*!**************************************!*\
  !*** ./apps/client/jini/js/wish1.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

AFRAME.registerComponent('wish1', {
  schema: {
    type: 'array',
    default: []
  },
  init: function init() {
    var thisElement = this.el;
    var scene = this.el.sceneEl;
    var jini = document.querySelector('#jini');
    var jiniBase = document.querySelector('#jiniBase');
    var anchor = document.getElementById("anchor");
    var btn = this.el;
	var videoPrompt = document.getElementById("videoPrompt");
	
	//for button press
    var btnPos = btn.getAttribute('position');
    var btnEndPos = String(btnPos.x + ' ' + (btnPos.y - 0.015) + ' ' + btnPos.z);
	
    var wishes = document.querySelector('#wishes');
    var wishesPos = wishes.getAttribute('position'); // let moneyRain = document.createElement('a-entity')

    var pilePos = String(wishesPos.x + ' ' + wishesPos.y + ' ' + (wishesPos.z + 3)); //Audio Assets

    var buttonSpawnSnd = document.querySelector('#ButtonSpawn').components.sound;

    var popOutSound = document.querySelector('#PopOut').components.sound;
    var vanishSnd = document.querySelector('#Vanish').components.sound;
    var excellentWishSnd = document.querySelector('#ExcellentWish').components.sound;
    var youKnowSnd = document.querySelector('#YouKnowWhat').components.sound;
    var cashConversion = document.querySelector('#CashConversion');
    var cashLost = document.querySelector('#CashLost');
    var cashIncoming = document.querySelector('#CashIncoming');
    var alertNotification = document.querySelector('#AlertNotification');
    var believeMeSnd = document.querySelector('#BelieveMe').components.sound; //4829
	
    //new objects
    var dollarPile = document.createElement('a-entity');
    var dollarPileS = document.createElement('a-entity');
    var dollarPileA = document.createElement('a-entity');
	var dollarPileB = document.createElement('a-entity');
	var dollarPileC = document.createElement('a-entity');
	var pitchVideo = document.querySelector("#pitchVideo");

    dollarPile.setAttribute('gltf-model', '#vodaRep');
    dollarPile.setAttribute('position', '-1 0 2.3');
    dollarPile.setAttribute('rotation', '0 0 0');
    dollarPile.setAttribute('scale', '0 0 0'); //create cash pile object at position between user/jini

    dollarPileS.setAttribute('gltf-model', '#vodaRep');
    dollarPileS.setAttribute('position', '1 0 2.3');
    dollarPileS.setAttribute('rotation', '0 0 0');
    dollarPileS.setAttribute('scale', '0 0 0'); //create cash pile object at position between user/jini

    dollarPileB.setAttribute('gltf-model', '#vodaRep');
    dollarPileB.setAttribute('position', '0.4 0 2.3');
    dollarPileB.setAttribute('rotation', '0 0 0');
    dollarPileB.setAttribute('scale', '0 0 0'); // add tutorial
	
	dollarPileA.setAttribute('gltf-model', '#vodaRep');
    dollarPileA.setAttribute('position', '-0.4 0 2.3');
    dollarPileA.setAttribute('rotation', '0 0 0');
    dollarPileA.setAttribute('scale', '0 0 0'); // add tutorial
	
	
	dollarPileC.setAttribute('gltf-model', '#vodaRep');
    dollarPileC.setAttribute('position', '0 0 2.3');
    dollarPileC.setAttribute('rotation', '0 0 0');
    dollarPileC.setAttribute('scale', '0 0 0'); // add tutorial
	
	
	 btn.addEventListener('click', function (evt) {
		 
	  btn.setAttribute('class', '');

      // Timings (milliseconds)
      var hideWishPanelDelay = 1100;
      var addDollarPilesDelay = 2000;
      var showDollarPilesDelay = 2300;
	  var showPitchVideo = 2600;
	  
	  //disable photo mode
      scene.emit('wishstart', ''); 
	  
	  //animate wishes down, then disappear
	  //press button
      btn.setAttribute('animation__wish1', {
        property: 'position',
        dur: '500',
        easing: 'easeOutElastic',
        loop: false,
        to: btnEndPos
      });

	//hide wish panel
    setTimeout(function () {
        wishes.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeOutElastic'
        });
		
      }, hideWishPanelDelay);
	  
	//hide modi
    setTimeout(function () {
        jini.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeOutElastic'
        });
      }, hideWishPanelDelay);
	  
	  //sound for hiding
      setTimeout(function () {
        vanishSnd.playSound();
      }, hideWishPanelDelay + 300); 
	  
	  
	  // Add lotus piles to scene
      setTimeout(function () {

        anchor.appendChild(dollarPile);
        anchor.appendChild(dollarPileS);
        anchor.appendChild(dollarPileA);
		anchor.appendChild(dollarPileB);
		anchor.appendChild(dollarPileC);
	  
        wishes.setAttribute('visible', 'false');
		jini.setAttribute('visible', 'false');
        console.log('faded out');
      }, addDollarPilesDelay); 
	  
	  // Show dollar piles
      setTimeout(function () {
		console.log("show piles");
        dollarPile.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '800',
          to: '12 12 12',
          easing: 'easeOutElastic'
        });
        dollarPileS.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '800',
          to: '12 12 12',
          easing: 'easeOutElastic'
        });
		  dollarPileA.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '800',
          to: '12 12 12',
          easing: 'easeOutElastic'
        });
		  dollarPileB.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '800',
          to: '12 12 12',
          easing: 'easeOutElastic'
        });
        dollarPileC.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '800',
          to: '12 12 12',
          easing: 'easeOutElastic'
        });
	
      }, showDollarPilesDelay);
	  
	  setTimeout(function(){
		  console.log("show Video");
		 pitchVideo.setAttribute('pitchVideo','');
	  }, showPitchVideo);
    });
	
	//hide flowers
	scene.addEventListener('hideWish1',function(e){
	     dollarPile.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
        dollarPileA.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
		 dollarPileB.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
		 dollarPileC.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
        dollarPileS.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        }); 
		
		
		setTimeout(function () {
        vanishSnd.playSound();
		},  300);
	});

  }
});


var videoP = null;
var scene = null;
var videoTexture = null;
AFRAME.registerComponent('pitchVideo', {
	schema: {
		updateFcts: {
			type: 'array',
			default: []
		}
	},
	
	init: function(){

		this.lastTimeMsec = null; 
		scene = this.el.sceneEl;
	},

	update: function() {
			
	// create the videoTexture
	videoTexture= new THREEx.VideoTexture('mPesaAdd.mp4');
	videoP	= videoTexture.video;
	
	videoP.addEventListener('ended',function(){
		console.log("Ended in event");
		videoP.pause();
		videoP = null;
		videoTexture = null;
		document.querySelector("#pitchVideo").removeAttribute(document.querySelector("#pitchVideo"));
		document.querySelector("#pitchVideo").parentNode.removeChild(document.querySelector("#pitchVideo"));
		scene.emit('hideWish1','');
		scene.emit('showWishes','');
	});
	
	this.data.updateFcts.push(function(delta, now){
		videoTexture.update(delta, now)
	});
	
	// use the texture in a THREE.Mesh
	var geometry	= new THREE.PlaneGeometry(4, 4);
	var materialP	= new THREE.MeshBasicMaterial({
		map	: videoTexture.texture
	});
	
	this.el.setObject3D('mesh', new THREE.Mesh(geometry, materialP));
	
	},

	remove: function() {
    this.el.removeObject3D('mesh');
	},
	
	tick: function(t){
		this.lastTimeMsec	= this.lastTimeMsec || t-1000/60;
		var deltaMsec	= Math.min(200, t - this.lastTimeMsec);
		this.lastTimeMsec	= t;
		// call each update function
		this.data.updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, t/1000);
		})
	}
 });

/***/ }),

/***/ "./apps/client/jini/js/wish2.js":
/*!**************************************!*\
  !*** ./apps/client/jini/js/wish2.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

AFRAME.registerComponent('wish2', {
  init: function init() {
    var scene = this.el.sceneEl;
    var btn = this.el;
    var btnPos = btn.getAttribute('position');
    var btnEndPos = String(btnPos.x + ' ' + (btnPos.y - 0.015) + ' ' + btnPos.z);
    var anchor = document.getElementById("anchor");
    var wishes = document.querySelector('#wishes');
    var jini = document.querySelector('#jini');
    var jiniBase = document.querySelector('#jiniBase');
	var info = document.querySelector("#infographics");
	var light = document.querySelector("#dirLight");
	var camera = document.getElementById('camera');
	var showModal = document.getElementById("matchModal");
	var cancelButton = document.getElementById("backPrompt");
	var rights = 0;

    btn.addEventListener('click', function (e) {
      console.log('wish2 begin');
      scene.emit('wishstart', ''); // play button press sound

      btn.setAttribute('class', '');

      btn.setAttribute('animation__wish1', {
        property: 'position',
        dur: 500,
        easing: 'easeOutElastic',
        loop: false,
        to: btnEndPos
      });
      
      setTimeout(function () {
        wishes.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.01 0.01 0.01',
          easing: 'easeInElastic'
        });
		
		 jini.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '500',
          to: '0.01 0.01 0.01',
          easing: 'easeInElastic'
        });
        setTimeout(function () {
          wishes.setAttribute('visible', 'false');
		  jini.setAttribute('visible', 'false');
        }, 500);
      }, 1100);
	
	  //bring ui to front
	  setTimeout(function(){
		light.setAttribute("intensity",0.5); //change back to 1
		info.setAttribute("visible",'true');
		info.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '1500',
		  from:"0.01 0.01 0.01",
          to: '4 4 0.1',
          easing: 'easeOutElastic'
        });
		},1600);
		
	  //add swipe prompt
	  setTimeout(function(){
		showModal.classList.remove('hidden');
	  },1500);
	
		setTimeout(function(){
			console.log("in hidden propmt for swipe");
			showModal.classList.add('hidden');
			scene.addEventListener('swiperight', changeToRight);
			//cancelButton.classList.remove("hidden");
		},5000);
	
	var changeToRight = function(){
		console.log("right");
		rights = rights + 1;
		if( rights == 1){
			info.setAttribute('material', {
			shader: 'flat',
			src: '#infoS'
			});
		}
		else if( rights == 2)
		{
			info.setAttribute('material', {
			shader: 'flat',
			src: '#infoT'
			});
			
			cancelButton.classList.remove("hidden");
		}
		
	};
	
	  });


	  	
    cancelButton.addEventListener('click', function () {
		light.setAttribute("intensity",1.0);
		cancelButton.classList.add('hidden');
		console.log("back wish 2");
		info.setAttribute('animation__popIn', {
          property: 'scale',
          dur: '100',
		  to:"0.01 0.01 0.01",
          easing: 'easeInElastic'
        });
		
		info.setAttribute("visible",'false');
		
		scene.emit('showWishes','');
	
		

    });
	
  } // end init

});

/***/ }),

/***/ "./apps/client/jini/js/wish3.js":
/*!**************************************!*\
  !*** ./apps/client/jini/js/wish3.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

AFRAME.registerComponent('wish3', {
  init: function init() {
    var btn = this.el;
    var scene = this.el.sceneEl;
    var btnPos = btn.getAttribute('position');
    var btnEndPos = String(btnPos.x + ' ' + (btnPos.y - 0.015) + ' ' + btnPos.z);
    var anchor = document.getElementById("anchor");
    var wishes = document.querySelector('#wishes');
    var jini = document.querySelector('#jini'); //Audio Effects
	var shakePrompt = document.getElementById("shakePrompt");
	var offer = document.getElementById("offerBox");
	
	var myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
});
	
	btn.addEventListener('click',function(){
    btn.setAttribute('animation__wish3', {
        property: 'position',
        dur: 500,
        easing: 'easeOutElastic',
        loop: false,
        to: btnEndPos
      });
	  
      setTimeout(function () {
        wishes.setAttribute('animation__end', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
		
		jini.setAttribute('animation__last', {
          property: 'scale',
          dur: '500',
          to: '0.001 0.001 0.001',
          easing: 'easeInElastic'
        });
      }, 1100);

      travelBackTimeout = setTimeout(function () {
        wishes.setAttribute('visible', 'false');
		jini.setAttribute('visible', 'false');
      }, 1200);
	  
	  	//add swipe prompt
	  setTimeout(function(){
		shakePrompt.classList.remove('hidden');
		
		// start listening to device motion
		myShakeEvent.start();
		
		// register a shake event
		window.addEventListener('shake', shakeEventDidOccur, false);
		//shake event callback
		
		console.log("in");
		function shakeEventDidOccur () {
			//put your own code here etc.
			
		shakePrompt.classList.add('hidden');

		window.removeEventListener('shake', shakeEventDidOccur, false);
		
		myShakeEvent.stop();
		
		 anchor.emit('startmoneyrain', {
          value: 'it should start the money rain animation'
        });
		
		offer.setAttribute('visible',true);
		
		offer.setAttribute('animation__popOut', {
          property: 'scale',
          dur: '4000',
          to: '4 4 0.01',
          easing: 'easeInElastic'
        });
		
	  }
	  
	  },1400);
	  

	
	/* scene.emit('showendcard', {
        collapse: false
      }); */
  });
}

});

/***/ }),

/***/ 0:
/*!********************************************!*\
  !*** multi ./apps/client/jini/js/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/nb/repo/code8/apps/client/jini/js/index.js */"./apps/client/jini/js/index.js");


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map