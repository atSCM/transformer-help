// This Quick Dynamic moves the applied graphical element in X- and/or Y-direction depending on the value of the defined node and the ranged defined by "minValue" and "maxValue", i.e. the
// range defined by "minValue" and "maxValue" will be translated to the range defined by "startPositionX" and "stopPositionX" and/or to the range defined by "startPositionY" and
// "stopPositionY".
// The movement in X-direction will only be done if both "startPositionX" and "stopPositionX" are defined.
// The movement in Y-direction will only be done if both "startPositionY" and "stopPositionY" are defined.
// e.g.: the defined range of the value from 0 (=minValue) to 100 (=maxValue) will be translated to 0 (=startPositionX) to 10 (=stopPositionX) pixels in X-direction
// Parameters:
//	nodeId:			this node triggers this Quick Dynamic
//	minValue:		lower bound of the range where the node's value should lie in
//	maxValue:		upper bound of the range where the node's value should lie in
//	startPositionX:	start position for X-direction where "minValue" will be translated to
//	stopPositionX:	stop position for X-direction where "maxValue" will be translated to
//	startPositionY:	start position for Y-direction where "minValue" will be translated to
//	stopPositionY:	stop position for Y-direction where "maxValue" will be translated to

webMI.data.subscribe(base.nodeId, function(e) {
  var value = e.value;
  if (base.startPositionX != '' && base.stopPositionX != '') {
    webMI.gfx.setMoveX(
      base.id,
      webMI.translate(value, base.minValue, base.maxValue, base.startPositionX, base.stopPositionX)
    );
  }
  if (base.startPositionY != '' && base.stopPositionY != '') {
    webMI.gfx.setMoveY(
      base.id,
      webMI.translate(value, base.minValue, base.maxValue, base.startPositionY, base.stopPositionY)
    );
  }
});
