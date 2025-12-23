import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import denunciaService from '../../services/denunciaService';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import { ArrowLeft, Filter } from 'lucide-react';
import styles from './MapaDenunciasPage.module.css';

// Configurar íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapaDenunciasPage = () => {
    const [denuncias, setDenuncias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const navigate = useNavigate();

    // Cusco, Perú como centro por defecto
    const defaultCenter = [-13.5319, -71.9675];
    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
        cargarDenuncias();

        // Obtener ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log('No se pudo obtener la ubicación:', error);
                }
            );
        }
    }, []);

    const cargarDenuncias = async () => {
        try {
            const response = await denunciaService.obtenerDenuncias({
                limite: 1000
            });

            if (response.success) {
                // Filtrar solo denuncias con coordenadas válidas
                const denunciasConCoordenadas = response.data.denuncias.filter(
                    d => d.latitud && d.longitud
                );

                setDenuncias(denunciasConCoordenadas);
            }
        } catch (error) {
            console.error('Error al cargar denuncias:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMarkerColor = (estado) => {
        const colores = {
            'Registrada': '#ef4444',
            'En Revisión': '#f59e0b',
            'Asignada': '#3b82f6',
            'En Proceso': '#8b5cf6',
            'Resuelta': '#10b981',
            'Cerrada': '#6b7280',
            'Rechazada': '#dc2626'
        };
        return colores[estado] || '#6b7280';
    };

    const createCustomIcon = (color) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
    };

    const denunciasFiltradas = filtroEstado === 'todos'
        ? denuncias
        : denuncias.filter(d => d.estado?.nombre === filtroEstado);

    const estadosUnicos = [...new Set(denuncias.map(d => d.estado?.nombre))].filter(Boolean);

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando mapa de denuncias...</p>
                    </div>
                </div>
                <BottomNavigation userType="ciudadano" />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/home')}
                            aria-label="Volver"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className={styles.headerInfo}>
                            <h1>Mapa de Denuncias</h1>
                            <p>{denunciasFiltradas.length} de {denuncias.length} denuncias</p>
                        </div>
                        <button
                            className={styles.filterButton}
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            aria-label="Filtros"
                        >
                            <Filter size={24} />
                        </button>
                    </div>

                    {mostrarFiltros && (
                        <div className={styles.filtrosContainer}>
                            <button
                                className={`${styles.filtroChip} ${filtroEstado === 'todos' ? styles.chipActivo : ''}`}
                                onClick={() => setFiltroEstado('todos')}
                            >
                                Todas ({denuncias.length})
                            </button>
                            {estadosUnicos.map(estado => (
                                <button
                                    key={estado}
                                    className={`${styles.filtroChip} ${filtroEstado === estado ? styles.chipActivo : ''}`}
                                    onClick={() => setFiltroEstado(estado)}
                                    style={{
                                        borderColor: filtroEstado === estado ? getMarkerColor(estado) : '#e5e7eb',
                                        backgroundColor: filtroEstado === estado ? `${getMarkerColor(estado)}15` : 'white'
                                    }}
                                >
                                    {estado} ({denuncias.filter(d => d.estado?.nombre === estado).length})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.mapWrapper}>
                    <MapContainer
                        center={center}
                        zoom={13}
                        className={styles.map}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {denunciasFiltradas.map((denuncia) => (
                            <Marker
                                key={denuncia._id}
                                position={[denuncia.latitud, denuncia.longitud]}
                                icon={createCustomIcon(getMarkerColor(denuncia.estado?.nombre))}
                            >
                                <Popup className={styles.popup}>
                                    <div className={styles.popupContent}>
                                        <h3>{denuncia.titulo}</h3>
                                        <p className={styles.categoria}>
                                            <strong>Categoría:</strong> {denuncia.categoria?.nombre}
                                        </p>
                                        <p className={styles.estado}>
                                            <span
                                                className={styles.estadoBadge}
                                                style={{ backgroundColor: getMarkerColor(denuncia.estado?.nombre) }}
                                            >
                                                {denuncia.estado?.nombre}
                                            </span>
                                        </p>
                                        <p className={styles.fecha}>
                                            {new Date(denuncia.fecha_registro).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <button
                                            className={styles.verDetalleBtn}
                                            onClick={() => navigate(`/denuncias/${denuncia._id}`)}
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className={styles.legend}>
                    <h3>Leyenda</h3>
                    <div className={styles.legendItems}>
                        {Object.entries({
                            'Registrada': '#ef4444',
                            'En Revisión': '#f59e0b',
                            'Asignada': '#3b82f6',
                            'En Proceso': '#8b5cf6',
                            'Resuelta': '#10b981',
                            'Cerrada': '#6b7280'
                        }).map(([estado, color]) => (
                            <div key={estado} className={styles.legendItem}>
                                <div
                                    className={styles.legendColor}
                                    style={{ backgroundColor: color }}
                                ></div>
                                <span>{estado}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNavigation userType="ciudadano" />
        </>
    );
};

export default MapaDenunciasPage;
