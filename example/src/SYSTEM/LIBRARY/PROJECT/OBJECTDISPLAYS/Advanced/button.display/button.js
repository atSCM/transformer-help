var strokeNormal = 'none';
var strokePressed = webMI.query['strokePressed'];
var extraBorderColor = webMI.query['extraBorderColor'];
var focusStrokeColor = webMI.query['focusStrokeColor'];
var fillColor = webMI.query['fillColor'];
var fillColorInactive = webMI.query['fillColorInactive'];
var display = webMI.query['display'];
var consistencyGroup = webMI.query['consistencyGroup'];
var consistencyFunction = webMI.query['consistencyFunction'];

if (consistencyGroup)
  var consistencyHandler = webMI.callExtension(
    'SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Consistency Handler'
  );

var tabHandler = webMI.callExtension('SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tab Handler');
var tabIndex = webMI.query['tabIndex'] == undefined ? '' : webMI.query['tabIndex'];
var tooltip = webMI.query['tooltip'] == undefined ? '' : webMI.query['tooltip'];

var right = webMI.query['right'] == undefined ? '' : webMI.query['right'];
if (right.search(/SYSTEM\.SECURITY\.RIGHTS\./) != -1) {
  right = right.substring(23, right.length); //remove "prefix" SYSTEM.SECURITY.RIGHTS.
}

var active = false;
var hasRight = false;

if (right != '') {
  webMI.addEvent(webMI.data, 'clientvariableschange', function(e) {
    hasRight = false;
    if ('username' in e && e.username != '') {
      hasRight = webMI.hasRight(right);
    }
    deActivate();
  });
}

var activeValue = webMI.query['activeValue'] == undefined ? '' : webMI.query['activeValue'];
var activeNode = webMI.query['activeNode'] == undefined ? '' : webMI.query['activeNode'];
var nodeIsActive = false;

if (activeNode != '' && String(activeValue) != '') {
  webMI.data.subscribe(activeNode, function(e) {
    var nodeActiveValue = e.value;
    if (typeof nodeActiveValue == 'boolean') {
      nodeIsActive = String(nodeActiveValue) == activeValue;
    } else if (typeof nodeActiveValue == 'number') {
      try {
        var temp = parseFloat(activeValue);
        nodeIsActive = nodeActiveValue == temp;
      } catch (e) {
        nodeIsActive = false;
      }
    } else {
      nodeIsActive = nodeActiveValue == activeValue;
    }
    deActivate();
  });
} else {
  deActivate();
}

if (extraBorderColor != 'none' && extraBorderColor != '') {
  webMI.gfx.setStroke('button_stroke', extraBorderColor);
}

function deActivate(forceDeActivate) {
  if (typeof forceDeActivate !== 'undefined' && forceDeActivate) {
    active = false;
  } else if (right != '') {
    if (String(activeValue) != '' && activeNode != '') {
      active = nodeIsActive && hasRight;
    } else {
      active = hasRight;
    }
  } else {
    if (String(activeValue) != '' && activeNode != '') {
      active = nodeIsActive;
    } else {
      active = true;
    }
  }
  if (active) {
    webMI.gfx.setFill('button_bg', fillColor);
    webMI.gfx.setVisible('button_stroke', null);
  } else {
    webMI.gfx.setFill('button_bg', fillColorInactive);
    webMI.gfx.setVisible('button_stroke', false);
  }
}

function release() {
  if (active) {
    webMI.gfx.setFill('button_stroke', 'url(#linear_1)');
  }
  if (extraBorderColor == 'none' || extraBorderColor == '') {
    webMI.gfx.setStroke('button_stroke', strokeNormal);
  } else {
    webMI.gfx.setStroke('button_stroke', extraBorderColor);
    webMI.gfx.setStrokeWidth('button_stroke', 1);
  }
}

function focusTH() {
  if (active) {
    webMI.gfx.setStroke('button_stroke', focusStrokeColor);
    if (extraBorderColor != 'none' && extraBorderColor != '') {
      webMI.gfx.setStrokeWidth('button_stroke', 2);
    }
  }
}
function applyTH() {
  if (active) {
    webMI.trigger.fire('clicked', true, '');
  }
  if (consistencyGroup)
    consistencyFunction == 'write'
      ? consistencyHandler.write(consistencyGroup)
      : consistencyHandler.read(consistencyGroup);
}
function backTH() {}
function arrowTH(dir) {}
function keyHandler(keyTH, param2) {
  if (keyTH == 'focus') {
    focusTH();
  } else if (keyTH == 'blur') {
    release();
  } else if (keyTH == 'apply') {
    webMI.gfx.setFill('button_stroke', 'url(#linear_2)');
    applyTH();
  } else if (keyTH == 'releaseClick') {
    webMI.gfx.setFill('button_stroke', 'url(#linear_1)');
  } else if (keyTH == 'back') {
    backTH();
  } else if (keyTH == 'arrow') {
    arrowTH(param2);
  } else if (keyTH == 'isActive') {
    return active && param2(document.getElementById('button_clickarea').parentNode);
  }
}

webMI.addEvent('button_clickarea', 'mousedown', function(e) {
  var id = 'button_clickarea';
  var value = true;
  return (function(value) {
    if (active) {
      webMI.gfx.setFill('button_stroke', 'url(#linear_2)');
      webMI.gfx.setStroke('button_stroke', strokePressed);
    }
  })(value);
});

webMI.addEvent('button_clickarea', 'mouseup', function(e) {
  var id = 'button_clickarea';
  var value = true;
  return (function(value) {
    release();
  })(value);
});

webMI.addEvent('button_clickarea', 'mouseout', function(e) {
  var id = 'button_clickarea';
  var value = true;
  return (function(value) {
    release();
  })(value);
});

webMI.addEvent('button_clickarea', 'click', function(e) {
  if (active) {
    tabHandler.setCurrentIndex(keyHandler, function() {
      webMI.trigger.fire('clicked', true, '');
    });
    //webMI.trigger.fire("clicked", true, "");
  }
  if (consistencyGroup)
    consistencyFunction == 'write'
      ? consistencyHandler.write(consistencyGroup)
      : consistencyHandler.read(consistencyGroup);
});

webMI.addEvent('button_clickarea', 'dragstart', function(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
});
webMI.addOnload(function() {
  var doc = document.getElementById('button_clickarea').ownerDocument;
  tabHandler.register(tabIndex, keyHandler, doc);
});

webMI.trigger.connect('com.atvise.setActive', function(e) {
  if (e.value) {
    deActivate();
  } else {
    deActivate(true);
  }
});

if (tooltip != '') {
  webMI.callExtension('SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tooltip', {
    auto: 'true',
    id: 'button_clickarea',
    text: tooltip,
  });
}
