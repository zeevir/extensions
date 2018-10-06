import * as React from 'react'
import * as D3 from 'd3'
import D3ChartScriptRendererBase from '../ChartRenderer';
import * as ChartClient from '../ChartClient';
import * as ChartUtils from '../Templates/ChartUtils';
import { getClickKeys, translate, scale, rotate, skewX, skewY, matrix, scaleFor, rule, ellipsis } from '../Templates/ChartUtils';


export default class BarsChartScriptRendererBase extends D3ChartScriptRendererBase {

    drawChart(data: ChartClient.ChartTable, chart: D3.Selection<SVGElement, {}, HTMLDivElement, unknown >) {
            
    		//var urlCdnClusterJs = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
    		var urlCdnClusterJs = "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js";
    		var urlCdnClusterImages = "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m";
    
    
    		if (!(typeof google === 'object' && typeof google.maps === 'object')) {
    
    				if (window.__google_api_key == null)
    						throw Error("You need to set window.__google_api_key to use this map");
    
    				var oldFunction = window.googleMapsCallback;
    				window.googleMapsCallback = function () {
    						if (oldFunction)
    								oldFunction();
    
    						loadMarkerCluster();
    				};
    
    				ChartUtils.getScript("https://maps.googleapis.com/maps/api/js?key=" + window.__google_api_key + "&libraries=visualization&callback=window.googleMapsCallback");
    		} else {
    				loadMarkerCluster();
    		}
    
    
    		function loadMarkerCluster() {
    				if (!window.MarkerClusterer) {
    						ChartUtils.getScript(urlCdnClusterJs, function () {
    								drawMap();
    						});
    				}
    				else {
    						drawMap();
    				}
    		}
    
    
    
    		function drawMap() {
    
    				var color = null;
    				if (data.columns.c6.token != null) {
    						var scaleFunc = scaleFor(data.columns.c6, data.rows.map(function (r) { return r.c6; }), 0, 100, data.parameters["ColorScale"]);
    						var colorInterpolator = ChartUtils.getColorInterpolation(data.parameters["ColorSet"]);
    						color = function (v) { return colorInterpolator(scaleFunc(v.c6)); }
    				}
    				else if (data.columns.c7.token != null) {
    						var scheme = ChartUtils.getColorScheme(data.parameters["ColorCategory"]);
    						var categoryColor = d3.scaleOrdinal(scheme).domain(data.rows.map(function (v) { return v.c7; }));
    						color = function (v) { return v.c7.color || categoryColor(v.c7); };
    				}
    
    
    				var parentDiv = chart._groups[0][0].parentElement;
    
    				var mapType = data.parameters["MapType"] == "Roadmap" ? google.maps.MapTypeId.ROADMAP : google.maps.MapTypeId.SATELLITE;
    
    				var centerMap = new google.maps.LatLng(data.rows.length > 0 ? data.rows[0].c0.key : 0,
    						data.rows.length > 0 ? data.rows[0].c1.key : 0)
    
    				var mapOptions = {
    						center: centerMap,
    						zoom: 2,
    						mapTypeControlOptions: {
    								mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain",
    										"styled_map"]
    						},
    						mapTypeId: mapType
    				}
    
    				var map = new google.maps.Map(parentDiv, mapOptions);
    
    				if (data.parameters["MapStyle"] != null &&
    						data.parameters["MapStyle"] != "Standard") {
    
    						var json = ChartUtils.getMapStyles()[data.parameters["MapStyle"]];
    
    						if (json != null) {
    								map.mapTypes.set("styled_map", new google.maps.StyledMapType(json, { name: 'Styled Map' }));
    								map.setMapTypeId("styled_map");
    						}
    				}
    
    				var bounds = new google.maps.LatLngBounds();
    
    				var hasLabel = data.columns.c2.token != null;
    				var hasIcon = data.columns.c3.token != null;
    				var hasTitle = data.columns.c4.token != null;
    				var hasInfo = data.columns.c5.token != null;
    
    				var clusterMap = data.parameters["ClusterMap"] == "Yes";
    
    				var animateOnClick = data.parameters["AnimateOnClick"] == "Yes" && !clusterMap;
    
    				var markers = [];
    
    				function toggleBounce(marker) {
    						if (marker.getAnimation() !== null && marker.getAnimation() != undefined) {
    								marker.setAnimation(null);
    						} else {
    								marker.setAnimation(google.maps.Animation.BOUNCE);
    						}
    				}
    
    				data.rows.forEach(function (e) {
    						if (e.c0.key != null && e.c1.key != null) {
    								var position = new google.maps.LatLng(e.c0.key, e.c1.key);
    								bounds.extend(position);
    								var marker = new google.maps.Marker({
    										position: position,
    										label: hasLabel && e.c2.key != null ? e.c2.key.toString().charAt(0) : null,
    										icon: hasIcon && e.c3.key != null ? e.c3.key.toString() : color ?
    												{
    														anchor: new google.maps.Point(16, 16),
    														url: 'data:image/svg+xml;utf-8, \
    																<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> \
    																<circle cx="8" cy="8" r="8" fill="'  + color(e) + '" /> \
    																</svg>'
    												} : null,
    										title: hasTitle && e.c4.key != null ? e.c4.key.toString() : null
    								});
    
    								if (hasInfo && e.c5.key != null) {									
    										var infow = new google.maps.InfoWindow({
    												content: "<div>" + e.c5.key.toString() +
    														(data.parameters["InfoLinkPosition"] == "Below" ? "<br/>" : "") + 
    														"<a href='" + 
    																ChartUtils.getNavigateRoute(e.entity.key) + 
    																"' target='_blank'" + 
    																(data.parameters["InfoLinkPosition"] == "Inline" ? " style='margin-left: 10px;'" : "") +
    																"><svg aria-hidden='true' data-prefix='fas' data-icon='external-link-alt' class='svg-inline--fa fa-external-link-alt fa-w-18 ' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' style='shape-rendering: auto;'><path fill='currentColor' d='M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z'></path></svg></a></div>"
    										});
    
    										marker.addListener("click", function () {
    												infow.open(map, marker);
    										});
    								}
    								else {
    										marker.addListener("click", function () {
    												ChartUtils.navigateEntity(e.entity.key);
    										});
    								}
    								
    
    								if (animateOnClick) {
    										marker.addListener("click", function () {
    												toggleBounce(marker);
    										});
    								}
    
    								markers.push(marker);
    						}
    				});
    
    				map.fitBounds(bounds);
    				map.panToBounds(bounds);
    
    				if (!clusterMap) {
    						if (data.parameters["AnimateDrop"] == "Yes" && markers.length <= 25) {
    								function addMarkerDropTimeout(marker, timeout) {
    										window.setTimeout(function () {
    												marker.setAnimation(google.maps.Animation.DROP);
    												marker.setMap(map);
    										}, timeout);
    								}
    
    								for (var i = 0; i < markers.length; i++) {
    										addMarkerDropTimeout(markers[i], i * 200);
    								}
    						}
    						else {
    								markers.forEach(function (marker) {
    										marker.setMap(map);
    								})
    						}
    				}
    				else {
    						//debugger;
    						var markerCluster = new MarkerClusterer(map, markers,
    								{ imagePath: urlCdnClusterImages });
    				}
    		}
    }
    }
}
