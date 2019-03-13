let map = null;
let position = null;

mapboxgl.accessToken = "pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ";
map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/brianhouse/cj3yywx4y0dgx2rpmyjfgnixx",
    center: [-73.96024, 40.80877],
    zoom: 16
});

map.addControl(new mapboxgl.NavigationControl({
    showCompass: false
}), "top-left");

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
}), "bottom-right");
