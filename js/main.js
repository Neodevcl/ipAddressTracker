const apiKey = 'at_1fvi9Nh9A3WjUDoQTgsqZGfH1JsiR';
const url = `https://geo.ipify.org/api/v1?apiKey=${ apiKey }`;
const validarIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const map = L.map('miMapa', { scrollWheelZoom: false });
let marker;

const myIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [50, 60],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

const tileLayer = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';

document.addEventListener('DOMContentLoaded', () => {
    
    obtenerInfo('');
});

const formulario = document.querySelector('#formulario');

formulario.addEventListener('submit', e => {
    
    e.preventDefault();

    const query = e.target.elements[0].value;
    
    map.off();

    ( validarIP.test(query) ) ? obtenerInfo( query ) : obtenerInfo( query ); 
});

const crearMapa = ( data ) => {

    const mediaQ = window.matchMedia("(min-width: 1440px)");
    const lat = ( mediaQ.matches ) ? data.location.lat + 0.002 : data.location.lat + 0.004;
    const lng = data.location.lng;

    if (L.Browser.mobile) {
        map.zoomControl.remove();
    }

    map.setView([lat, lng], 15);

    const basemap = L.tileLayer(tileLayer, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    
    basemap.on('load', function (event) {
        marker = L.marker([data.location.lat, data.location.lng], { icon: myIcon } ).addTo(map)       
    });

}

const mostrarInfo = ( data ) => {
    document.querySelector('#ip').innerText = data.ip;
    document.querySelector('#city').innerText = `${data.location.city},`;
    document.querySelector('#region').innerText = data.location.region;
    document.querySelector('#postalCode').innerText = data.location.postalCode;
    document.querySelector('#timezone').innerText = data.location.timezone;
    document.querySelector('#isp').innerText = data.isp;
}

const obtenerInfo = ( ipDominio ) => {

    const urlFinal = ( ipDominio === '' ) ? `${ url }&ipAddress=${ ipDominio }` : `${ url }&domain=${ ipDominio }`;  

    fetch(urlFinal).then( resp => {
        return resp.json()
    })
    .then( data => {

        if( !data?.code ) {

            map.eachLayer(function (layer) {
                map.removeLayer(marker)
            }); 

            crearMapa( data );
            mostrarInfo( data );
        }
    
    });
}