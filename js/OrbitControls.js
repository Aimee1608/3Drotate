/**
 * Created by jiangqian on 2018/2/9.
 */
THREE.OrbitControls = function(object, domElement) {
    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement: document;
    this.enabled = true;
    this.target = new THREE.Vector3();
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minZoom = 0;
    this.maxZoom = Infinity;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.minAzimuthAngle = -Infinity;
    this.maxAzimuthAngle = Infinity;
    this.enableDamping = false;
    this.dampingFactor = 0.25;
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    this.enableRotate = true;
    this.rotateSpeed = 1.0;
    this.enablePan = true;
    this.keyPanSpeed = 7.0;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;
    this.enableKeys = true;
    this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    };
    this.mouseButtons = {
        ORBIT: THREE.MOUSE.LEFT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.RIGHT
    };
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;
    this.getPolarAngle = function() {
        return phi
    };
    this.getAzimuthalAngle = function() {
        return theta
    };
    this.reset = function() {
        scope.target.copy(scope.target0);
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;
        scope.object.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);
        scope.update();
        state = STATE.NONE
    };
    this.update = function() {
        var offset = new THREE.Vector3();
        var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();
        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();
        return function() {
            var position = scope.object.position;
            offset.copy(position).sub(scope.target);
            offset.applyQuaternion(quat);
            spherical.setFromVector3(offset);
            if (scope.autoRotate && state === STATE.NONE) {
                rotateLeft(getAutoRotationAngle())
            }
            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
            spherical.makeSafe();
            spherical.radius *= scale;
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
            scope.target.add(panOffset);
            offset.setFromSpherical(spherical);
            offset.applyQuaternion(quatInverse);
            position.copy(scope.target).add(offset);
            scope.object.lookAt(scope.target);
            if (scope.enableDamping === true) {
                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor)
            } else {
                sphericalDelta.set(0, 0, 0)
            }
            scale = 1;
            panOffset.set(0, 0, 0);
            if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
                scope.dispatchEvent(changeEvent);
                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;
                return true
            }
            return false
        }
    } ();
    this.dispose = function() {
        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('mousewheel', onMouseWheel, false);
        scope.domElement.removeEventListener('MozMousePixelScroll', onMouseWheel, false);
        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        document.removeEventListener('mouseout', onMouseUp, false);
        window.removeEventListener('keydown', onKeyDown, false);
    };
    var scope = this;
    var changeEvent = {
        type: 'change'
    };
    var startEvent = {
        type: 'start'
    };
    var endEvent = {
        type: 'end'
    };
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_DOLLY: 4,
        TOUCH_PAN: 5
    };
    var state = STATE.NONE;
    var EPS = 0.000001;
    var spherical = new THREE.Spherical();
    var sphericalDelta = new THREE.Spherical();
    var scale = 1;
    var panOffset = new THREE.Vector3();
    var zoomChanged = false;
    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();
    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();
    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed
    }
    function getZoomScale() {
        return Math.pow(0.95, scope.zoomSpeed)
    }
    function rotateLeft(angle) {
        sphericalDelta.theta -= angle
    }
    function rotateUp(angle) {
        sphericalDelta.phi -= angle
    }
    var panLeft = function() {
        var v = new THREE.Vector3();
        return function panLeft(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 0);
            v.multiplyScalar( - distance);
            panOffset.add(v)
        }
    } ();
    var panUp = function() {
        var v = new THREE.Vector3();
        return function panUp(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 1);
            v.multiplyScalar(distance);
            panOffset.add(v)
        }
    } ();
    var pan = function() {
        var offset = new THREE.Vector3();
        return function(deltaX, deltaY) {
            var element = scope.domElement === document ? scope.domElement.body: scope.domElement;
            if (scope.object instanceof THREE.PerspectiveCamera) {
                var position = scope.object.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();
                targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix)
            } else if (scope.object instanceof THREE.OrthographicCamera) {
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix)
            } else {
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false
            }
        }
    } ();
    function dollyIn(dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
            scale /= dollyScale
        } else if (scope.object instanceof THREE.OrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false
        }
    }
    function dollyOut(dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
            scale *= dollyScale
        } else if (scope.object instanceof THREE.OrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false
        }
    }
    function handleMouseDownRotate(event) {
        rotateStart.set(event.clientX, event.clientY)
    }
    function handleMouseDownDolly(event) {
        dollyStart.set(event.clientX, event.clientY)
    }
    function handleMouseDownPan(event) {
        panStart.set(event.clientX, event.clientY)
    }
    function handleMouseMoveRotate(event) {
        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body: scope.domElement;
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update()
    }
    function handleMouseMoveDolly(event) {
        dollyEnd.set(event.clientX, event.clientY);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyIn(getZoomScale())
        } else if (dollyDelta.y < 0) {
            dollyOut(getZoomScale())
        }
        dollyStart.copy(dollyEnd);
        scope.update()
    }
    function handleMouseMovePan(event) {
        panEnd.set(event.clientX, event.clientY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update()
    }
    function handleMouseUp(event) {}
    function handleMouseWheel(event) {
        var delta = 0;
        if (event.wheelDelta !== undefined) {
            delta = event.wheelDelta
        } else if (event.detail !== undefined) {
            delta = -event.detail
        }
        if (delta > 0) {
            dollyOut(getZoomScale())
        } else if (delta < 0) {
            dollyIn(getZoomScale())
        }
        scope.update()
    }
    function handleKeyDown(event) {
        switch (event.keyCode) {
            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;
            case scope.keys.RIGHT:
                pan( - scope.keyPanSpeed, 0);
                scope.update();
                break
        }
    }
    function handleTouchStartRotate(event) {
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY)
    }
    function handleTouchStartDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyStart.set(0, distance)
    }
    function handleTouchStartPan(event) {
        panStart.set(event.touches[0].pageX, event.touches[0].pageY)
    }
    function handleTouchMoveRotate(event) {
        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body: scope.domElement;
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update()
    }
    function handleTouchMoveDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyEnd.set(0, distance);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyOut(getZoomScale())
        } else if (dollyDelta.y < 0) {
            dollyIn(getZoomScale())
        }
        dollyStart.copy(dollyEnd);
        scope.update()
    }
    function handleTouchMovePan(event) {
        panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update()
    }
    function handleTouchEnd(event) {}
    function onMouseDown(event) {
        if (scope.enabled === false) {
            return
        }
        event.preventDefault();
        if (event.button === scope.mouseButtons.ORBIT) {
            if (scope.enableRotate === false) {
                return
            }
            handleMouseDownRotate(event);
            state = STATE.ROTATE
        } else if (event.button === scope.mouseButtons.ZOOM) {
            if (scope.enableZoom === false) {
                return
            }
            handleMouseDownDolly(event);
            state = STATE.DOLLY
        } else if (event.button === scope.mouseButtons.PAN) {
            if (scope.enablePan === false) {
                return
            }
            handleMouseDownPan(event);
            state = STATE.PAN
        }
        if (state !== STATE.NONE) {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
            document.addEventListener('mouseout', onMouseUp, false);
            scope.dispatchEvent(startEvent)
        }
    }
    function onMouseMove(event) {
        if (scope.enabled === false) {
            return
        }
        event.preventDefault();
        if (state === STATE.ROTATE) {
            if (scope.enableRotate === false) {
                return
            }
            handleMouseMoveRotate(event)
        } else if (state === STATE.DOLLY) {
            if (scope.enableZoom === false) {
                return
            }
            handleMouseMoveDolly(event)
        } else if (state === STATE.PAN) {
            if (scope.enablePan === false) {
                return
            }
            handleMouseMovePan(event)
        }
    }
    function onMouseUp(event) {
        if (scope.enabled === false) {
            return
        }
        handleMouseUp(event);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        document.removeEventListener('mouseout', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE
    }
    function onMouseWheel(event) {
        if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) {
            return
        }
        event.preventDefault();
        event.stopPropagation();
        handleMouseWheel(event);
        scope.dispatchEvent(startEvent);
        scope.dispatchEvent(endEvent)
    }
    function onKeyDown(event) {
        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) {
            return
        }
        handleKeyDown(event)
    }
    function onTouchStart(event) {
        if (scope.enabled === false) {
            return
        }
        switch (event.touches.length) {
            case 1:
                if (scope.enableRotate === false) {
                    return
                }
                handleTouchStartRotate(event);
                state = STATE.TOUCH_ROTATE;
                break;
            case 2:
                if (scope.enableZoom === false) {
                    return
                }
                handleTouchStartDolly(event);
                state = STATE.TOUCH_DOLLY;
                break;
            case 3:
                if (scope.enablePan === false) {
                    return
                }
                handleTouchStartPan(event);
                state = STATE.TOUCH_PAN;
                break;
            default:
                state = STATE.NONE
        }
        if (state !== STATE.NONE) {
            scope.dispatchEvent(startEvent)
        }
    }
    function onTouchMove(event) {
        if (scope.enabled === false) {
            return
        }
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1:
                if (scope.enableRotate === false) {
                    return
                }
                if (state !== STATE.TOUCH_ROTATE) {
                    return;
                }
                handleTouchMoveRotate(event);
                break;
            case 2:
                if (scope.enableZoom === false) {
                    return
                }
                if (state !== STATE.TOUCH_DOLLY) {
                    return;
                }
                handleTouchMoveDolly(event);
                break;
            case 3:
                if (scope.enablePan === false) {
                    return
                }
                if (state !== STATE.TOUCH_PAN) {
                    return;
                }
                handleTouchMovePan(event);
                break;
            default:
                state = STATE.NONE
        }
    }
    function onTouchEnd(event) {
        if (scope.enabled === false) {
            return
        }
        handleTouchEnd(event);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE
    }
    function onContextMenu(event) {
        event.preventDefault()
    }
    scope.domElement.addEventListener('contextmenu', onContextMenu, false);
    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('mousewheel', onMouseWheel, false);
    scope.domElement.addEventListener('MozMousePixelScroll', onMouseWheel, false);
    scope.domElement.addEventListener('touchstart', onTouchStart, false);
    scope.domElement.addEventListener('touchend', onTouchEnd, false);
    scope.domElement.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('keydown', onKeyDown, false);
    this.update()
};
THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
Object.defineProperties(THREE.OrbitControls.prototype, {
    center: {
        get: function() {
            console.warn('THREE.OrbitControls: .center has been renamed to .target');
            return this.target
        }
    },
    noZoom: {
        get: function() {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            return ! this.enableZoom
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            this.enableZoom = !value
        }
    },
    noRotate: {
        get: function() {
            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            return ! this.enableRotate
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            this.enableRotate = !value
        }
    },
    noPan: {
        get: function() {
            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            return ! this.enablePan
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            this.enablePan = !value
        }
    },
    noKeys: {
        get: function() {
            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            return ! this.enableKeys
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            this.enableKeys = !value
        }
    },
    staticMoving: {
        get: function() {
            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            return ! this.constraint.enableDamping
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            this.constraint.enableDamping = !value
        }
    },
    dynamicDampingFactor: {
        get: function() {
            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            return this.constraint.dampingFactor
        },
        set: function(value) {
            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            this.constraint.dampingFactor = value
        }
    }
});