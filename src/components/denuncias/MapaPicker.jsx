import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapaPicker.module.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

/**
 * MapaPicker - Componente para seleccionar ubicación en mapa interactivo
 * @param {Object} props
 * @param {Object} props.ubicacion - {lat, lng} ubicación actual
 * @param {Function} props.onChange - Callback cuando cambia la ubicación
 * @param {number} props.zoom - Nivel de zoom inicial (default: 13)
 * @param {string} props.className - Clase CSS adicional
 */
function MapaPicker({ ubicacion, onChange, zoom = 13, className = '' }) {
  const [position, setPosition] = useState(ubicacion || { lat: -12.0464, lng: -77.0428 }); // Lima, Perú por defecto
  const [obteniendo, setObteniendo] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const mapRef = useRef(null);

  // Actualizar posición cuando cambia la prop ubicacion
  useEffect(() => {
    if (ubicacion && (ubicacion.lat !== position.lat || ubicacion.lng !== position.lng)) {
      setPosition(ubicacion);
    }
  }, [ubicacion]);

  // Obtener ubicación actual del usuario
  const obtenerUbicacionActual = () => {
    setObteniendo(true);
    setErrorUbicacion(null);

    if (!navigator.geolocation) {
      setErrorUbicacion('La geolocalización no está soportada en tu navegador');
      setObteniendo(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPos);
        onChange(newPos);
        setObteniendo(false);

        // Centrar el mapa en la nueva posición
        if (mapRef.current) {
          mapRef.current.setView([newPos.lat, newPos.lng], zoom);
        }
      },
      (error) => {
        let mensaje = 'Error al obtener ubicación';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = 'Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            mensaje = 'Tiempo de espera agotado al obtener ubicación';
            break;
        }
        setErrorUbicacion(mensaje);
        setObteniendo(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Manejar selección de ubicación en el mapa
  const handleLocationSelect = (latlng) => {
    const newPos = { lat: latlng.lat, lng: latlng.lng };
    setPosition(newPos);
    onChange(newPos);
  };

  // Manejar arrastre del marcador
  const handleMarkerDrag = (e) => {
    const marker = e.target;
    const newPos = marker.getLatLng();
    const pos = { lat: newPos.lat, lng: newPos.lng };
    setPosition(pos);
    onChange(pos);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ubicación de la denuncia</h3>
        <button
          type="button"
          onClick={obtenerUbicacionActual}
          disabled={obteniendo}
          className={styles.btnUbicacion}
          title="Obtener mi ubicación actual"
        >
          {obteniendo ? '🔄 Obteniendo...' : '📍 Mi ubicación'}
        </button>
      </div>

      {errorUbicacion && (
        <div className={styles.error}>
          {errorUbicacion}
        </div>
      )}

      <div className={styles.coordenadas}>
        <span className={styles.coordLabel}>Coordenadas:</span>
        <span className={styles.coordValue}>
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        </span>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={zoom}
          className={styles.map}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <Marker
            position={[position.lat, position.lng]}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          />
        </MapContainer>
      </div>

      <p className={styles.instrucciones}>
        💡 <strong>Tip:</strong> Haz clic en el mapa o arrastra el marcador para ajustar la ubicación exacta de tu denuncia.
      </p>
    </div>
  );
}

export default MapaPicker;
