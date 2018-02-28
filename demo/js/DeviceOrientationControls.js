/**
 * Created by jiangqian on 2018/2/9.
 */
THREE.DeviceOrientationControls = function(object) {
    var scope = this;
    this.object = object;
    this.object.rotation.reorder("YXZ");
    this.enabled = true;
    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.alpha = 0;
    this.alphaOffsetAngle = 0;
    var onDeviceOrientationChangeEvent = function(event) {
        scope.deviceOrientation = event
    };
    var onScreenOrientationChangeEvent = function() {
        scope.screenOrientation = window.orientation || 0
    };
    var setObjectQuaternion = function() {
        var zee = new THREE.Vector3(0, 0, 1);
        var euler = new THREE.Euler();
        var q0 = new THREE.Quaternion();
        var q1 = new THREE.Quaternion( - Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
        return function(quaternion, alpha, beta, gamma, orient) {
            euler.set(beta, alpha, -gamma, 'YXZ');
            quaternion.setFromEuler(euler);
            quaternion.multiply(q1);
            quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
        }
    } ();
    this.connect = function() {
        onScreenOrientationChangeEvent();
        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        scope.enabled = true
    };
    this.disconnect = function() {
        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        scope.enabled = false
    };
    this.update = function() {
        if (scope.enabled === false) {
            return
        }
        var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) + this.alphaOffsetAngle: 0;
        var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0;
        var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0;
        var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0;
        setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
        this.alpha = alpha
    };
    this.updateAlphaOffsetAngle = function(angle) {
        this.alphaOffsetAngle = angle;
        this.update()
    };
    this.dispose = function() {
        this.disconnect()
    };
    this.connect()
};