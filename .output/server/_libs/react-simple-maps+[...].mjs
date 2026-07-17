import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { t as require_prop_types } from "./prop-types.mjs";
import { n as path_default, r as graticule, t as src_exports } from "./d3-geo.mjs";
import { r as select_default } from "./d3-drag+d3-selection.mjs";
import { n as identity, t as zoom_default } from "./d3-zoom.mjs";
//#region node_modules/topojson-client/src/identity.js
function identity_default(x) {
	return x;
}
//#endregion
//#region node_modules/topojson-client/src/transform.js
function transform_default(transform) {
	if (transform == null) return identity_default;
	var x0, y0, kx = transform.scale[0], ky = transform.scale[1], dx = transform.translate[0], dy = transform.translate[1];
	return function(input, i) {
		if (!i) x0 = y0 = 0;
		var j = 2, n = input.length, output = new Array(n);
		output[0] = (x0 += input[0]) * kx + dx;
		output[1] = (y0 += input[1]) * ky + dy;
		while (j < n) output[j] = input[j], ++j;
		return output;
	};
}
//#endregion
//#region node_modules/topojson-client/src/reverse.js
function reverse_default(array, n) {
	var t, j = array.length, i = j - n;
	while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
}
//#endregion
//#region node_modules/topojson-client/src/feature.js
function feature_default(topology, o) {
	if (typeof o === "string") o = topology.objects[o];
	return o.type === "GeometryCollection" ? {
		type: "FeatureCollection",
		features: o.geometries.map(function(o) {
			return feature(topology, o);
		})
	} : feature(topology, o);
}
function feature(topology, o) {
	var id = o.id, bbox = o.bbox, properties = o.properties == null ? {} : o.properties, geometry = object(topology, o);
	return id == null && bbox == null ? {
		type: "Feature",
		properties,
		geometry
	} : bbox == null ? {
		type: "Feature",
		id,
		properties,
		geometry
	} : {
		type: "Feature",
		id,
		bbox,
		properties,
		geometry
	};
}
function object(topology, o) {
	var transformPoint = transform_default(topology.transform), arcs = topology.arcs;
	function arc(i, points) {
		if (points.length) points.pop();
		for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) points.push(transformPoint(a[k], k));
		if (i < 0) reverse_default(points, n);
	}
	function point(p) {
		return transformPoint(p);
	}
	function line(arcs) {
		var points = [];
		for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
		if (points.length < 2) points.push(points[0]);
		return points;
	}
	function ring(arcs) {
		var points = line(arcs);
		while (points.length < 4) points.push(points[0]);
		return points;
	}
	function polygon(arcs) {
		return arcs.map(ring);
	}
	function geometry(o) {
		var type = o.type, coordinates;
		switch (type) {
			case "GeometryCollection": return {
				type,
				geometries: o.geometries.map(geometry)
			};
			case "Point":
				coordinates = point(o.coordinates);
				break;
			case "MultiPoint":
				coordinates = o.coordinates.map(point);
				break;
			case "LineString":
				coordinates = line(o.arcs);
				break;
			case "MultiLineString":
				coordinates = o.arcs.map(line);
				break;
			case "Polygon":
				coordinates = polygon(o.arcs);
				break;
			case "MultiPolygon":
				coordinates = o.arcs.map(polygon);
				break;
			default: return null;
		}
		return {
			type,
			coordinates
		};
	}
	return geometry(o);
}
//#endregion
//#region node_modules/topojson-client/src/stitch.js
function stitch_default(topology, arcs) {
	var stitchedArcs = {}, fragmentByStart = {}, fragmentByEnd = {}, fragments = [], emptyIndex = -1;
	arcs.forEach(function(i, j) {
		var arc = topology.arcs[i < 0 ? ~i : i], t;
		if (arc.length < 3 && !arc[1][0] && !arc[1][1]) t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
	});
	arcs.forEach(function(i) {
		var e = ends(i), start = e[0], end = e[1], f, g;
		if (f = fragmentByEnd[start]) {
			delete fragmentByEnd[f.end];
			f.push(i);
			f.end = end;
			if (g = fragmentByStart[end]) {
				delete fragmentByStart[g.start];
				var fg = g === f ? f : f.concat(g);
				fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
			} else fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
		} else if (f = fragmentByStart[end]) {
			delete fragmentByStart[f.start];
			f.unshift(i);
			f.start = start;
			if (g = fragmentByEnd[start]) {
				delete fragmentByEnd[g.end];
				var gf = g === f ? f : g.concat(f);
				fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
			} else fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
		} else {
			f = [i];
			fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
		}
	});
	function ends(i) {
		var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
		if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) {
			p1[0] += dp[0], p1[1] += dp[1];
		});
		else p1 = arc[arc.length - 1];
		return i < 0 ? [p1, p0] : [p0, p1];
	}
	function flush(fragmentByEnd, fragmentByStart) {
		for (var k in fragmentByEnd) {
			var f = fragmentByEnd[k];
			delete fragmentByStart[f.start];
			delete f.start;
			delete f.end;
			f.forEach(function(i) {
				stitchedArcs[i < 0 ? ~i : i] = 1;
			});
			fragments.push(f);
		}
	}
	flush(fragmentByEnd, fragmentByStart);
	flush(fragmentByStart, fragmentByEnd);
	arcs.forEach(function(i) {
		if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]);
	});
	return fragments;
}
//#endregion
//#region node_modules/topojson-client/src/mesh.js
function mesh_default(topology) {
	return object(topology, meshArcs.apply(this, arguments));
}
function meshArcs(topology, object, filter) {
	var arcs, i, n;
	if (arguments.length > 1) arcs = extractArcs(topology, object, filter);
	else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
	return {
		type: "MultiLineString",
		arcs: stitch_default(topology, arcs)
	};
}
function extractArcs(topology, object, filter) {
	var arcs = [], geomsByArc = [], geom;
	function extract0(i) {
		var j = i < 0 ? ~i : i;
		(geomsByArc[j] || (geomsByArc[j] = [])).push({
			i,
			g: geom
		});
	}
	function extract1(arcs) {
		arcs.forEach(extract0);
	}
	function extract2(arcs) {
		arcs.forEach(extract1);
	}
	function extract3(arcs) {
		arcs.forEach(extract2);
	}
	function geometry(o) {
		switch (geom = o, o.type) {
			case "GeometryCollection":
				o.geometries.forEach(geometry);
				break;
			case "LineString":
				extract1(o.arcs);
				break;
			case "MultiLineString":
			case "Polygon":
				extract2(o.arcs);
				break;
			case "MultiPolygon":
				extract3(o.arcs);
				break;
		}
	}
	geometry(object);
	geomsByArc.forEach(filter == null ? function(geoms) {
		arcs.push(geoms[0].i);
	} : function(geoms) {
		if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i);
	});
	return arcs;
}
//#endregion
//#region node_modules/react-simple-maps/dist/index.es.js
var index_es_exports = /* @__PURE__ */ __exportAll({
	Annotation: () => Annotation,
	ComposableMap: () => ComposableMap,
	Geographies: () => Geographies,
	Geography: () => Geography$1,
	Graticule: () => Graticule$1,
	Line: () => Line,
	MapContext: () => MapContext,
	MapProvider: () => MapProvider,
	Marker: () => Marker,
	Sphere: () => Sphere$1,
	ZoomPanContext: () => ZoomPanContext,
	ZoomPanProvider: () => ZoomPanProvider,
	ZoomableGroup: () => ZoomableGroup,
	useGeographies: () => useGeographies,
	useMapContext: () => useMapContext,
	useZoomPan: () => useZoomPan,
	useZoomPanContext: () => useZoomPanContext
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types());
function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly && (symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		})), keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread2(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = null != arguments[i] ? arguments[i] : {};
		i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _typeof(obj) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	}, _typeof(obj);
}
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
	var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
	if (_i == null) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _s, _e;
	try {
		for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var _excluded$a = [
	"width",
	"height",
	"projection",
	"projectionConfig"
];
var geoPath = path_default, projections = _objectWithoutProperties(src_exports, ["geoPath"]);
var MapContext = (0, import_react.createContext)();
var makeProjection = function makeProjection(_ref) {
	var _ref$projectionConfig = _ref.projectionConfig, projectionConfig = _ref$projectionConfig === void 0 ? {} : _ref$projectionConfig, _ref$projection = _ref.projection, projection = _ref$projection === void 0 ? "geoEqualEarth" : _ref$projection, _ref$width = _ref.width, width = _ref$width === void 0 ? 800 : _ref$width, _ref$height = _ref.height, height = _ref$height === void 0 ? 600 : _ref$height;
	if (typeof projection === "function") return projection;
	var proj = projections[projection]().translate([width / 2, height / 2]);
	[
		proj.center ? "center" : null,
		proj.rotate ? "rotate" : null,
		proj.scale ? "scale" : null,
		proj.parallels ? "parallels" : null
	].forEach(function(d) {
		if (!d) return;
		proj = proj[d](projectionConfig[d] || proj[d]());
	});
	return proj;
};
var MapProvider = function MapProvider(_ref2) {
	var width = _ref2.width, height = _ref2.height, projection = _ref2.projection, projectionConfig = _ref2.projectionConfig, restProps = _objectWithoutProperties(_ref2, _excluded$a);
	var _ref4 = _slicedToArray(projectionConfig.center || [], 2), cx = _ref4[0], cy = _ref4[1];
	var _ref6 = _slicedToArray(projectionConfig.rotate || [], 3), rx = _ref6[0], ry = _ref6[1], rz = _ref6[2];
	var _ref8 = _slicedToArray(projectionConfig.parallels || [], 2), p1 = _ref8[0], p2 = _ref8[1];
	var s = projectionConfig.scale || null;
	var projMemo = (0, import_react.useMemo)(function() {
		return makeProjection({
			projectionConfig: {
				center: cx || cx === 0 || cy || cy === 0 ? [cx, cy] : null,
				rotate: rx || rx === 0 || ry || ry === 0 ? [
					rx,
					ry,
					rz
				] : null,
				parallels: p1 || p1 === 0 || p2 || p2 === 0 ? [p1, p2] : null,
				scale: s
			},
			projection,
			width,
			height
		});
	}, [
		width,
		height,
		projection,
		cx,
		cy,
		rx,
		ry,
		rz,
		p1,
		p2,
		s
	]);
	var proj = (0, import_react.useCallback)(projMemo, [projMemo]);
	var value = (0, import_react.useMemo)(function() {
		return {
			width,
			height,
			projection: proj,
			path: geoPath().projection(proj)
		};
	}, [
		width,
		height,
		proj
	]);
	return /*#__PURE__*/ import_react.createElement(MapContext.Provider, _extends({ value }, restProps));
};
MapProvider.propTypes = {
	width: import_prop_types.default.number,
	height: import_prop_types.default.number,
	projection: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	projectionConfig: import_prop_types.default.object
};
var useMapContext = function useMapContext() {
	return (0, import_react.useContext)(MapContext);
};
var _excluded$9 = [
	"width",
	"height",
	"projection",
	"projectionConfig",
	"className"
];
var ComposableMap = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$width = _ref.width, width = _ref$width === void 0 ? 800 : _ref$width, _ref$height = _ref.height, height = _ref$height === void 0 ? 600 : _ref$height, _ref$projection = _ref.projection, projection = _ref$projection === void 0 ? "geoEqualEarth" : _ref$projection, _ref$projectionConfig = _ref.projectionConfig, projectionConfig = _ref$projectionConfig === void 0 ? {} : _ref$projectionConfig, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$9);
	return /*#__PURE__*/ import_react.createElement(MapProvider, {
		width,
		height,
		projection,
		projectionConfig
	}, /*#__PURE__*/ import_react.createElement("svg", _extends({
		ref,
		viewBox: "0 0 ".concat(width, " ").concat(height),
		className: "rsm-svg ".concat(className)
	}, restProps)));
});
ComposableMap.displayName = "ComposableMap";
ComposableMap.propTypes = {
	width: import_prop_types.default.number,
	height: import_prop_types.default.number,
	projection: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	projectionConfig: import_prop_types.default.object,
	className: import_prop_types.default.string
};
function getCoords(w, h, t) {
	var xOffset = (w * t.k - w) / 2;
	var yOffset = (h * t.k - h) / 2;
	return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}
function fetchGeographies(url) {
	return fetch(url).then(function(res) {
		if (!res.ok) throw Error(res.statusText);
		return res.json();
	})["catch"](function(error) {
		console.log("There was a problem when fetching the data: ", error);
	});
}
function getFeatures(geographies, parseGeographies) {
	if (!(geographies.type === "Topology")) return parseGeographies ? parseGeographies(geographies.features || geographies) : geographies.features || geographies;
	var feats = feature_default(geographies, geographies.objects[Object.keys(geographies.objects)[0]]).features;
	return parseGeographies ? parseGeographies(feats) : feats;
}
function getMesh(geographies) {
	if (!(geographies.type === "Topology")) return null;
	return {
		outline: mesh_default(geographies, geographies.objects[Object.keys(geographies.objects)[0]], function(a, b) {
			return a === b;
		}),
		borders: mesh_default(geographies, geographies.objects[Object.keys(geographies.objects)[0]], function(a, b) {
			return a !== b;
		})
	};
}
function prepareMesh(outline, borders, path) {
	return outline && borders ? {
		outline: _objectSpread2(_objectSpread2({}, outline), {}, {
			rsmKey: "outline",
			svgPath: path(outline)
		}),
		borders: _objectSpread2(_objectSpread2({}, borders), {}, {
			rsmKey: "borders",
			svgPath: path(borders)
		})
	} : {};
}
function prepareFeatures(geographies, path) {
	return geographies ? geographies.map(function(d, i) {
		return _objectSpread2(_objectSpread2({}, d), {}, {
			rsmKey: "geo-".concat(i),
			svgPath: path(d)
		});
	}) : [];
}
function createConnectorPath() {
	var dx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 30;
	var dy = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 30;
	var curve = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : .5;
	var curvature = Array.isArray(curve) ? curve : [curve, curve];
	var curveX = dx / 2 * curvature[0];
	var curveY = dy / 2 * curvature[1];
	return "M".concat(0, ",", 0, " Q", -dx / 2 - curveX, ",").concat(-dy / 2 + curveY, " ").concat(-dx, ",").concat(-dy);
}
function isString(geo) {
	return typeof geo === "string";
}
function useGeographies(_ref) {
	var geography = _ref.geography, parseGeographies = _ref.parseGeographies;
	var path = (0, import_react.useContext)(MapContext).path;
	var _useState2 = _slicedToArray((0, import_react.useState)({}), 2), output = _useState2[0], setOutput = _useState2[1];
	(0, import_react.useEffect)(function() {
		if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "undefined") return;
		if (!geography) return;
		if (isString(geography)) fetchGeographies(geography).then(function(geos) {
			if (geos) setOutput({
				geographies: getFeatures(geos, parseGeographies),
				mesh: getMesh(geos)
			});
		});
		else setOutput({
			geographies: getFeatures(geography, parseGeographies),
			mesh: getMesh(geography)
		});
	}, [geography, parseGeographies]);
	var _useMemo = (0, import_react.useMemo)(function() {
		var mesh = output.mesh || {};
		var preparedMesh = prepareMesh(mesh.outline, mesh.borders, path);
		return {
			geographies: prepareFeatures(output.geographies, path),
			outline: preparedMesh.outline,
			borders: preparedMesh.borders
		};
	}, [output, path]);
	return {
		geographies: _useMemo.geographies,
		outline: _useMemo.outline,
		borders: _useMemo.borders
	};
}
var _excluded$8 = [
	"geography",
	"children",
	"parseGeographies",
	"className"
];
var Geographies = (0, import_react.forwardRef)(function(_ref, ref) {
	var geography = _ref.geography, children = _ref.children, parseGeographies = _ref.parseGeographies, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$8);
	var _useContext = (0, import_react.useContext)(MapContext), path = _useContext.path, projection = _useContext.projection;
	var _useGeographies = useGeographies({
		geography,
		parseGeographies
	}), geographies = _useGeographies.geographies, outline = _useGeographies.outline, borders = _useGeographies.borders;
	return /*#__PURE__*/ import_react.createElement("g", _extends({
		ref,
		className: "rsm-geographies ".concat(className)
	}, restProps), geographies && geographies.length > 0 && children({
		geographies,
		outline,
		borders,
		path,
		projection
	}));
});
Geographies.displayName = "Geographies";
Geographies.propTypes = {
	geography: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.object,
		import_prop_types.default.array
	]),
	children: import_prop_types.default.func,
	parseGeographies: import_prop_types.default.func,
	className: import_prop_types.default.string
};
var _excluded$7 = [
	"geography",
	"onMouseEnter",
	"onMouseLeave",
	"onMouseDown",
	"onMouseUp",
	"onFocus",
	"onBlur",
	"style",
	"className"
];
var Geography = (0, import_react.forwardRef)(function(_ref, ref) {
	var geography = _ref.geography, onMouseEnter = _ref.onMouseEnter, onMouseLeave = _ref.onMouseLeave, onMouseDown = _ref.onMouseDown, onMouseUp = _ref.onMouseUp, onFocus = _ref.onFocus, onBlur = _ref.onBlur, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$7);
	var _useState2 = _slicedToArray((0, import_react.useState)(false), 2), isPressed = _useState2[0], setPressed = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(false), 2), isFocused = _useState4[0], setFocus = _useState4[1];
	function handleMouseEnter(evt) {
		setFocus(true);
		if (onMouseEnter) onMouseEnter(evt);
	}
	function handleMouseLeave(evt) {
		setFocus(false);
		if (isPressed) setPressed(false);
		if (onMouseLeave) onMouseLeave(evt);
	}
	function handleFocus(evt) {
		setFocus(true);
		if (onFocus) onFocus(evt);
	}
	function handleBlur(evt) {
		setFocus(false);
		if (isPressed) setPressed(false);
		if (onBlur) onBlur(evt);
	}
	function handleMouseDown(evt) {
		setPressed(true);
		if (onMouseDown) onMouseDown(evt);
	}
	function handleMouseUp(evt) {
		setPressed(false);
		if (onMouseUp) onMouseUp(evt);
	}
	return /*#__PURE__*/ import_react.createElement("path", _extends({
		ref,
		tabIndex: "0",
		className: "rsm-geography ".concat(className),
		d: geography.svgPath,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseDown: handleMouseDown,
		onMouseUp: handleMouseUp,
		style: style[isPressed || isFocused ? isPressed ? "pressed" : "hover" : "default"]
	}, restProps));
});
Geography.displayName = "Geography";
Geography.propTypes = {
	geography: import_prop_types.default.object,
	onMouseEnter: import_prop_types.default.func,
	onMouseLeave: import_prop_types.default.func,
	onMouseDown: import_prop_types.default.func,
	onMouseUp: import_prop_types.default.func,
	onFocus: import_prop_types.default.func,
	onBlur: import_prop_types.default.func,
	style: import_prop_types.default.object,
	className: import_prop_types.default.string
};
var Geography$1 = (0, import_react.memo)(Geography);
var _excluded$6 = [
	"fill",
	"stroke",
	"step",
	"className"
];
var Graticule = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$fill = _ref.fill, fill = _ref$fill === void 0 ? "transparent" : _ref$fill, _ref$stroke = _ref.stroke, stroke = _ref$stroke === void 0 ? "currentcolor" : _ref$stroke, _ref$step = _ref.step, step = _ref$step === void 0 ? [10, 10] : _ref$step, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$6);
	var path = (0, import_react.useContext)(MapContext).path;
	return /*#__PURE__*/ import_react.createElement("path", _extends({
		ref,
		d: path(graticule().step(step)()),
		fill,
		stroke,
		className: "rsm-graticule ".concat(className)
	}, restProps));
});
Graticule.displayName = "Graticule";
Graticule.propTypes = {
	fill: import_prop_types.default.string,
	stroke: import_prop_types.default.string,
	step: import_prop_types.default.array,
	className: import_prop_types.default.string
};
var Graticule$1 = (0, import_react.memo)(Graticule);
var _excluded$5 = ["value"];
var ZoomPanContext = (0, import_react.createContext)();
var defaultValue = {
	x: 0,
	y: 0,
	k: 1,
	transformString: "translate(0 0) scale(1)"
};
var ZoomPanProvider = function ZoomPanProvider(_ref) {
	var _ref$value = _ref.value, value = _ref$value === void 0 ? defaultValue : _ref$value, restProps = _objectWithoutProperties(_ref, _excluded$5);
	return /*#__PURE__*/ import_react.createElement(ZoomPanContext.Provider, _extends({ value }, restProps));
};
ZoomPanProvider.propTypes = {
	x: import_prop_types.default.number,
	y: import_prop_types.default.number,
	k: import_prop_types.default.number,
	transformString: import_prop_types.default.string
};
var useZoomPanContext = function useZoomPanContext() {
	return (0, import_react.useContext)(ZoomPanContext);
};
function useZoomPan(_ref) {
	var center = _ref.center, filterZoomEvent = _ref.filterZoomEvent, onMoveStart = _ref.onMoveStart, onMoveEnd = _ref.onMoveEnd, onMove = _ref.onMove, _ref$translateExtent = _ref.translateExtent, translateExtent = _ref$translateExtent === void 0 ? [[-Infinity, -Infinity], [Infinity, Infinity]] : _ref$translateExtent, _ref$scaleExtent = _ref.scaleExtent, scaleExtent = _ref$scaleExtent === void 0 ? [1, 8] : _ref$scaleExtent, _ref$zoom = _ref.zoom, zoom$1 = _ref$zoom === void 0 ? 1 : _ref$zoom;
	var _useContext = (0, import_react.useContext)(MapContext), width = _useContext.width, height = _useContext.height, projection = _useContext.projection;
	var _center = _slicedToArray(center, 2), lon = _center[0], lat = _center[1];
	var _useState2 = _slicedToArray((0, import_react.useState)({
		x: 0,
		y: 0,
		k: 1
	}), 2), position = _useState2[0], setPosition = _useState2[1];
	var lastPosition = (0, import_react.useRef)({
		x: 0,
		y: 0,
		k: 1
	});
	var mapRef = (0, import_react.useRef)();
	var zoomRef = (0, import_react.useRef)();
	var bypassEvents = (0, import_react.useRef)(false);
	var _translateExtent = _slicedToArray(translateExtent, 2), a = _translateExtent[0], b = _translateExtent[1];
	var _a = _slicedToArray(a, 2), a1 = _a[0], a2 = _a[1];
	var _b = _slicedToArray(b, 2), b1 = _b[0], b2 = _b[1];
	var _scaleExtent = _slicedToArray(scaleExtent, 2), minZoom = _scaleExtent[0], maxZoom = _scaleExtent[1];
	(0, import_react.useEffect)(function() {
		var svg = select_default(mapRef.current);
		function handleZoomStart(d3Event) {
			if (!onMoveStart || bypassEvents.current) return;
			onMoveStart({
				coordinates: projection.invert(getCoords(width, height, d3Event.transform)),
				zoom: d3Event.transform.k
			}, d3Event);
		}
		function handleZoom(d3Event) {
			if (bypassEvents.current) return;
			var transform = d3Event.transform, sourceEvent = d3Event.sourceEvent;
			setPosition({
				x: transform.x,
				y: transform.y,
				k: transform.k,
				dragging: sourceEvent
			});
			if (!onMove) return;
			onMove({
				x: transform.x,
				y: transform.y,
				zoom: transform.k,
				dragging: sourceEvent
			}, d3Event);
		}
		function handleZoomEnd(d3Event) {
			if (bypassEvents.current) {
				bypassEvents.current = false;
				return;
			}
			var _projection$invert2 = _slicedToArray(projection.invert(getCoords(width, height, d3Event.transform)), 2), x = _projection$invert2[0], y = _projection$invert2[1];
			lastPosition.current = {
				x,
				y,
				k: d3Event.transform.k
			};
			if (!onMoveEnd) return;
			onMoveEnd({
				coordinates: [x, y],
				zoom: d3Event.transform.k
			}, d3Event);
		}
		function filterFunc(d3Event) {
			if (filterZoomEvent) return filterZoomEvent(d3Event);
			return d3Event ? !d3Event.ctrlKey && !d3Event.button : false;
		}
		var zoom$1 = zoom_default().filter(filterFunc).scaleExtent([minZoom, maxZoom]).translateExtent([[a1, a2], [b1, b2]]).on("start", handleZoomStart).on("zoom", handleZoom).on("end", handleZoomEnd);
		zoomRef.current = zoom$1;
		svg.call(zoom$1);
	}, [
		width,
		height,
		a1,
		a2,
		b1,
		b2,
		minZoom,
		maxZoom,
		projection,
		onMoveStart,
		onMove,
		onMoveEnd,
		filterZoomEvent
	]);
	(0, import_react.useEffect)(function() {
		if (lon === lastPosition.current.x && lat === lastPosition.current.y && zoom$1 === lastPosition.current.k) return;
		var coords = projection([lon, lat]);
		var x = coords[0] * zoom$1;
		var y = coords[1] * zoom$1;
		var svg = select_default(mapRef.current);
		bypassEvents.current = true;
		svg.call(zoomRef.current.transform, identity.translate(width / 2 - x, height / 2 - y).scale(zoom$1));
		setPosition({
			x: width / 2 - x,
			y: height / 2 - y,
			k: zoom$1
		});
		lastPosition.current = {
			x: lon,
			y: lat,
			k: zoom$1
		};
	}, [
		lon,
		lat,
		zoom$1,
		width,
		height,
		projection
	]);
	return {
		mapRef,
		position,
		transformString: "translate(".concat(position.x, " ").concat(position.y, ") scale(").concat(position.k, ")")
	};
}
var _excluded$4 = [
	"center",
	"zoom",
	"minZoom",
	"maxZoom",
	"translateExtent",
	"filterZoomEvent",
	"onMoveStart",
	"onMove",
	"onMoveEnd",
	"className"
];
var ZoomableGroup = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$center = _ref.center, center = _ref$center === void 0 ? [0, 0] : _ref$center, _ref$zoom = _ref.zoom, zoom = _ref$zoom === void 0 ? 1 : _ref$zoom, _ref$minZoom = _ref.minZoom, minZoom = _ref$minZoom === void 0 ? 1 : _ref$minZoom, _ref$maxZoom = _ref.maxZoom, maxZoom = _ref$maxZoom === void 0 ? 8 : _ref$maxZoom, translateExtent = _ref.translateExtent, filterZoomEvent = _ref.filterZoomEvent, onMoveStart = _ref.onMoveStart, onMove = _ref.onMove, onMoveEnd = _ref.onMoveEnd, className = _ref.className, restProps = _objectWithoutProperties(_ref, _excluded$4);
	var _useContext = (0, import_react.useContext)(MapContext), width = _useContext.width, height = _useContext.height;
	var _useZoomPan = useZoomPan({
		center,
		filterZoomEvent,
		onMoveStart,
		onMove,
		onMoveEnd,
		scaleExtent: [minZoom, maxZoom],
		translateExtent,
		zoom
	}), mapRef = _useZoomPan.mapRef, transformString = _useZoomPan.transformString, position = _useZoomPan.position;
	return /*#__PURE__*/ import_react.createElement(ZoomPanProvider, { value: {
		x: position.x,
		y: position.y,
		k: position.k,
		transformString
	} }, /*#__PURE__*/ import_react.createElement("g", { ref: mapRef }, /*#__PURE__*/ import_react.createElement("rect", {
		width,
		height,
		fill: "transparent"
	}), /*#__PURE__*/ import_react.createElement("g", _extends({
		ref,
		transform: transformString,
		className: "rsm-zoomable-group ".concat(className)
	}, restProps))));
});
ZoomableGroup.displayName = "ZoomableGroup";
ZoomableGroup.propTypes = {
	center: import_prop_types.default.array,
	zoom: import_prop_types.default.number,
	minZoom: import_prop_types.default.number,
	maxZoom: import_prop_types.default.number,
	translateExtent: import_prop_types.default.arrayOf(import_prop_types.default.array),
	onMoveStart: import_prop_types.default.func,
	onMove: import_prop_types.default.func,
	onMoveEnd: import_prop_types.default.func,
	className: import_prop_types.default.string
};
var _excluded$3 = [
	"id",
	"fill",
	"stroke",
	"strokeWidth",
	"className"
];
var Sphere = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$id = _ref.id, id = _ref$id === void 0 ? "rsm-sphere" : _ref$id, _ref$fill = _ref.fill, fill = _ref$fill === void 0 ? "transparent" : _ref$fill, _ref$stroke = _ref.stroke, stroke = _ref$stroke === void 0 ? "currentcolor" : _ref$stroke, _ref$strokeWidth = _ref.strokeWidth, strokeWidth = _ref$strokeWidth === void 0 ? .5 : _ref$strokeWidth, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$3);
	var path = (0, import_react.useContext)(MapContext).path;
	var spherePath = (0, import_react.useMemo)(function() {
		return path({ type: "Sphere" });
	}, [path]);
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id }, /*#__PURE__*/ import_react.createElement("path", { d: spherePath }))), /*#__PURE__*/ import_react.createElement("path", _extends({
		ref,
		d: spherePath,
		fill,
		stroke,
		strokeWidth,
		style: { pointerEvents: "none" },
		className: "rsm-sphere ".concat(className)
	}, restProps)));
});
Sphere.displayName = "Sphere";
Sphere.propTypes = {
	id: import_prop_types.default.string,
	fill: import_prop_types.default.string,
	stroke: import_prop_types.default.string,
	strokeWidth: import_prop_types.default.number,
	className: import_prop_types.default.string
};
var Sphere$1 = (0, import_react.memo)(Sphere);
var _excluded$2 = [
	"coordinates",
	"children",
	"onMouseEnter",
	"onMouseLeave",
	"onMouseDown",
	"onMouseUp",
	"onFocus",
	"onBlur",
	"style",
	"className"
];
var Marker = (0, import_react.forwardRef)(function(_ref, ref) {
	var coordinates = _ref.coordinates, children = _ref.children, onMouseEnter = _ref.onMouseEnter, onMouseLeave = _ref.onMouseLeave, onMouseDown = _ref.onMouseDown, onMouseUp = _ref.onMouseUp, onFocus = _ref.onFocus, onBlur = _ref.onBlur, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$2);
	var projection = (0, import_react.useContext)(MapContext).projection;
	var _useState2 = _slicedToArray((0, import_react.useState)(false), 2), isPressed = _useState2[0], setPressed = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(false), 2), isFocused = _useState4[0], setFocus = _useState4[1];
	var _projection2 = _slicedToArray(projection(coordinates), 2), x = _projection2[0], y = _projection2[1];
	function handleMouseEnter(evt) {
		setFocus(true);
		if (onMouseEnter) onMouseEnter(evt);
	}
	function handleMouseLeave(evt) {
		setFocus(false);
		if (isPressed) setPressed(false);
		if (onMouseLeave) onMouseLeave(evt);
	}
	function handleFocus(evt) {
		setFocus(true);
		if (onFocus) onFocus(evt);
	}
	function handleBlur(evt) {
		setFocus(false);
		if (isPressed) setPressed(false);
		if (onBlur) onBlur(evt);
	}
	function handleMouseDown(evt) {
		setPressed(true);
		if (onMouseDown) onMouseDown(evt);
	}
	function handleMouseUp(evt) {
		setPressed(false);
		if (onMouseUp) onMouseUp(evt);
	}
	return /*#__PURE__*/ import_react.createElement("g", _extends({
		ref,
		transform: "translate(".concat(x, ", ").concat(y, ")"),
		className: "rsm-marker ".concat(className),
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseDown: handleMouseDown,
		onMouseUp: handleMouseUp,
		style: style[isPressed || isFocused ? isPressed ? "pressed" : "hover" : "default"]
	}, restProps), children);
});
Marker.displayName = "Marker";
Marker.propTypes = {
	coordinates: import_prop_types.default.array,
	children: import_prop_types.default.oneOfType([import_prop_types.default.node, import_prop_types.default.arrayOf(import_prop_types.default.node)]),
	onMouseEnter: import_prop_types.default.func,
	onMouseLeave: import_prop_types.default.func,
	onMouseDown: import_prop_types.default.func,
	onMouseUp: import_prop_types.default.func,
	onFocus: import_prop_types.default.func,
	onBlur: import_prop_types.default.func,
	style: import_prop_types.default.object,
	className: import_prop_types.default.string
};
var _excluded$1 = [
	"from",
	"to",
	"coordinates",
	"stroke",
	"strokeWidth",
	"fill",
	"className"
];
var Line = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$from = _ref.from, from = _ref$from === void 0 ? [0, 0] : _ref$from, _ref$to = _ref.to, to = _ref$to === void 0 ? [0, 0] : _ref$to, coordinates = _ref.coordinates, _ref$stroke = _ref.stroke, stroke = _ref$stroke === void 0 ? "currentcolor" : _ref$stroke, _ref$strokeWidth = _ref.strokeWidth, strokeWidth = _ref$strokeWidth === void 0 ? 3 : _ref$strokeWidth, _ref$fill = _ref.fill, fill = _ref$fill === void 0 ? "transparent" : _ref$fill, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded$1);
	var path = (0, import_react.useContext)(MapContext).path;
	var lineData = {
		type: "LineString",
		coordinates: coordinates || [from, to]
	};
	return /*#__PURE__*/ import_react.createElement("path", _extends({
		ref,
		d: path(lineData),
		className: "rsm-line ".concat(className),
		stroke,
		strokeWidth,
		fill
	}, restProps));
});
Line.displayName = "Line";
Line.propTypes = {
	from: import_prop_types.default.array,
	to: import_prop_types.default.array,
	coordinates: import_prop_types.default.array,
	stroke: import_prop_types.default.string,
	strokeWidth: import_prop_types.default.number,
	fill: import_prop_types.default.string,
	className: import_prop_types.default.string
};
var _excluded = [
	"subject",
	"children",
	"connectorProps",
	"dx",
	"dy",
	"curve",
	"className"
];
var Annotation = (0, import_react.forwardRef)(function(_ref, ref) {
	var subject = _ref.subject, children = _ref.children, connectorProps = _ref.connectorProps, _ref$dx = _ref.dx, dx = _ref$dx === void 0 ? 30 : _ref$dx, _ref$dy = _ref.dy, dy = _ref$dy === void 0 ? 30 : _ref$dy, _ref$curve = _ref.curve, curve = _ref$curve === void 0 ? 0 : _ref$curve, _ref$className = _ref.className, className = _ref$className === void 0 ? "" : _ref$className, restProps = _objectWithoutProperties(_ref, _excluded);
	var projection = (0, import_react.useContext)(MapContext).projection;
	var _projection2 = _slicedToArray(projection(subject), 2), x = _projection2[0], y = _projection2[1];
	var connectorPath = createConnectorPath(dx, dy, curve);
	return /*#__PURE__*/ import_react.createElement("g", _extends({
		ref,
		transform: "translate(".concat(x + dx, ", ").concat(y + dy, ")"),
		className: "rsm-annotation ".concat(className)
	}, restProps), /*#__PURE__*/ import_react.createElement("path", _extends({
		d: connectorPath,
		fill: "transparent",
		stroke: "#000"
	}, connectorProps)), children);
});
Annotation.displayName = "Annotation";
Annotation.propTypes = {
	subject: import_prop_types.default.array,
	children: import_prop_types.default.oneOfType([import_prop_types.default.node, import_prop_types.default.arrayOf(import_prop_types.default.node)]),
	dx: import_prop_types.default.number,
	dy: import_prop_types.default.number,
	curve: import_prop_types.default.number,
	connectorProps: import_prop_types.default.object,
	className: import_prop_types.default.string
};
//#endregion
export { index_es_exports as t };
