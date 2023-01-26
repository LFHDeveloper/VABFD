//let virginia = { lat: 37.720772, lng: -78.78919 };
var addresses = [];
var locations = addresses;
/**
 * The RestoreControl adds a control to the map that resets the zoom,
 * and recenters the map on Barcelona.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */

function RestoreControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to reset the map";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Helvetic Light,sans-serif";
    controlText.style.fontSize = "12px";
    controlText.style.lineHeight = "20px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Restore Map";
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", function () {
        map.setCenter({ lat: 37.720772, lng: -78.78919 });
        //map.setZoom(9);
    });
}

function initMap() {
    var locations = addresses;
    console.log("addresses " + addresses);

    if (locations === null) {
        // if no locations, let page know
        window.parent.postMessage("hello", "*");
        console.log("locations are null");
    }
    else{

        let infowindow = new google.maps.InfoWindow();

        let map = new google.maps.Map(document.getElementById("map"), {
            zoom: 7,
            streetViewControl: false,
            center: { lat: 37.720772, lng: -78.78919 },
        });

        map.data.loadGeoJson(
            "https://raw.githubusercontent.com/LFHDeveloper/VABFD/main/newgeojson.json"
        );

        map.data.setStyle((feature) => {
            //let color = feature.getProperty("color");
            let color = "green";

            return /** @type {!google.maps.Data.StyleOptions} */ {
                fillColor: color,
                strokeColor: color,
                strokeWeight: 1,
            };
        });

        map.data.addListener("mouseover", (event) => {
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, { strokeWeight: 4 });
            //console.log(event.feature);
            //console.log("("+event.feature.getProperty("labellat")+","+event.feature.getProperty("labellng")+")");

            //var labelcoordinates = {lat: 36.9, lng: -81.9}}

            //console.log(southwest);
            var position = new google.maps.LatLng(
                event.feature.getProperty("labellat"),
                event.feature.getProperty("labellng")
            );
            //infowindow.setPosition({lat: event.feature.getProperty("labellat"), lng: event.feature.getProperty("labellng")});

            infowindow.setPosition(position);
            //infowindow.setPosition(event.feature.getProperty("labellat"));
            //console.log("test southwest");
            infowindow.setContent(
                event.feature.getProperty("name") + " Region"
            );
            //var latLng = event.latLng;
            //console.log(event.feature.getProperty("labelcords"));

            //console.log(infowindow);
            //console.log(infowindow.getPosition());

            infowindow.open({
                map,
                shouldFocus: false,
            });
            //*/
        });

        map.data.addListener("mouseout", (event) => {
            map.data.revertStyle();
            infowindow.close();
        });

        const icons = {
            farm: {
                icon: "https://static.wixstatic.com/media/95203b_b24c8f1874324d8081f0243af2d564db~mv2.png",
            },
            market: {
                icon: "https://static.wixstatic.com/media/95203b_cd894f80b652412fa570082e9c854017~mv2.png",
            },
        };

        // Add the markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        var markers = locations.map(function (location) {
            var icon = {
                url: location.icon, // url
                scaledSize: new google.maps.Size(40, 40) // scaled size
                //origin: new google.maps.Point(0,0), // origin
                //anchor: new google.maps.Point(0, 0) // anchor
            };
        
            console.log(location.position);
            let marker = new google.maps.Marker({
                position: location.position,
                icon: icon,
                map: map,
            });
        
            google.maps.event.addListener(
                marker,
                "mouseover",
                (function (marker) {
                    return function () {
                        let content =
                            "<strong style='font-size:18px;'>" +
                            location.name +
                            "</strong><br>";
                        if (location.name) {
                            content =
                                "<strong style='font-size:18px; '>" +
                                location.name +
                                "</strong><br>";
                        }
                        if (location.address) {
                            content +=
                                "<strong>Address: </strong>" +
                                location.address +
                                "<br>";
                        }
                        if (location.hours) {
                            content +=
                                "<strong>Hours: </strong>" +
                                "<i>" +
                                location.hours +
                                "</i><br>";
                        }
                        //console.log(location.website);

                        if (location.website) {
                            content +=
                                "<div style='display:flex;'><a style='text-decoration: none !important; color: white !important;' href=../farmers/" +
                                location.slug +
                                " target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:75px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Profile</i></strong><strong style='color: white !important;'> </strong></div></a>" +
                                "<a style='text-decoration: none !important; color: white !important;' href='" +
                                location.website +
                                "' target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:75px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Website</i></strong><strong style='color: white !important;'> </strong></div></a></div>";

                            //content += "<strong>Wesbite: </strong><i> Click marker to visit website </i><br>"
                        } else {
                            content +=
                                "<a style='text-decoration: none !important; color: white !important;' href=https://www.virginiablackfarmerdirectory.com" +
                                location.name +
                                " target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:75px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Profile</i></strong><strong style='color: white !important;'></strong></div></a>";
                        }

                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                    };
                })(marker)
            );
            google.maps.event.addListener(
                marker,
                "click",
                (function (marker) {
                    return function () {
                        let content =
                            "<strong style='font-size:14px;'>" +
                            location.title +
                            "</strong><br>";
                        if (location.name) {
                            content =
                                "<strong style='font-size:14px;'>" +
                                location.title +
                                "</strong><br>";
                        }
                        if (location.address) {
                            content +=
                                "<strong>Address: </strong>" +
                                location.address +
                                "<br>";
                        }
                        if (location.hours) {
                            content +=
                                "<strong>Hours: </strong>" +
                                "<i>" +
                                location.hours +
                                "</i><br>";
                        }
                        //console.log(location.website);
                        if (location.website) {
                            content +=
                                "<div style='display:flex;'><a style='text-decoration: none !important; color: white !important; font-size:10px;' href=https://www.virginiablackfarmerdirectory.com" +
                                location.name +
                                " target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:50px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Profile </i></strong><strong style='color: white !important;'></strong></div></a>" +
                                "<a style='text-decoration: none !important; color: white !important; font-size:10px;' href='" +
                                location.website +
                                "' target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:50px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Website </i></strong><strong style='color: white !important;'></strong></div></a></div>";

                            //content += "<strong>Wesbite: </strong><i> Click marker to visit website </i><br>"
                        } else {
                            content +=
                                "<a style='text-decoration: none !important; color: white !important;' href=https://www.virginiablackfarmerdirectory.com" +
                                location.name +
                                " target='_blank'><div style='display:inline-block; margin-top:5px; margin-right:5px; padding:7px 12px; background-color:#DBB89A; color: white !important; text-align:center; width:75px; display:flex; justify-content:space-between;'>" +
                                "<strong><i>Profile </i></strong><strong style='color: white !important;'></strong></div></a>";
                        }
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                    };
                })(marker)
            );
            return marker;
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers, {
            gridSize: 20,
            maxZoom: 3,
            imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var restoreControlDiv = document.createElement("div");
        var restoreControl = new RestoreControl(restoreControlDiv, map);

        restoreControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(
            restoreControlDiv
        );

        if (window.innerWidth < 600) {
            //console.log("reset zoom");
            map.setZoom(6);
        }
    }
    //}
}
