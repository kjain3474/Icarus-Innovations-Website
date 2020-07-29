var hasProperty = function(prop) {
  var propParts = prop.split('.')
  var curObj = window
  do {
    var curProp = propParts.shift()
    if (curProp in curObj) {
      curObj = curObj[curProp]
    } else {
      return false
    }
  } while (propParts.length > 0)
  return true
}

var getMissingRequirements = function(reqs) {
  var missing = []
  for (var i = 0; i < reqs.length; ++i) {
    if (!hasProperty(reqs[i])) {
      missing.push(reqs[i])
    }
  }
  return missing
}

var checkRequirements = function(reqs) {
  var missing = getMissingRequirements(reqs)
  if (missing.length > 0) {
    console.log("Missing requirements:", missing)
    window.location.href = "/requirements.html"
  }
}

var REQUIREMENTS_LIST = [
  "DeviceOrientationEvent",
  "WebAssembly",
  // "navigator.mediaDevices.getUserMedia",
]
checkRequirements(REQUIREMENTS_LIST)
