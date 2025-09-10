// Configuración
const CONFIG = {
    whatsappNumber: "50765745975", // Cambia por tu número de WhatsApp
    currency: "$"
};

// Base de datos de perfumes para caballeros
const PERFUMES_DATABASE = [
    {
        id: 1,
        name: "Born in Roma Intense",
        brand: "Valentino",
        description: "Una fragancia cautivadora y moderna que combina la elegancia italiana con un toque seductor y urbano. Perfecta para el hombre que vive intensamente y deja huella donde pasa.",
        image_url: "images/Valentino BIR intense.avif",
        available: true,
        bestseller: true,
        prices: {
            "5ml": 8.00,
            "10ml": 14.00
        },
        notes: {
            top: "Vainilla Bourbon",
            heart: "Lavanda",
            base: "Vetiver"
        }
    },
    {
        id: 2,
        name: "Eros Flame",
        brand: "Versace",
        description: "Una fragancia ardiente y apasionada que mezcla frescura cítrica con especias intensas y maderas cálidas. Ideal para el hombre carismático y enérgico que conquista con confianza.",
        image_url: "images/eros flame.avif",
        available: true,
        bestseller: false,
        prices: {
            "5ml": 5.50,
            "10ml": 10.00
        },
        notes: {
            top: "Mandarina, Limón, Pimienta negra",
            heart: "Geranio, Rosa, Pimienta",
            base: "Cedro, Pachulí, Sándalo, Haba tonka, Vainilla"
        }
    },
    {
        id: 3,
        name: "Invictus Victory EDP",
        brand: "Paco Rabanne",
        description: "Una fragancia intensa y adictiva que enfrenta la frescura vibrante con la sensualidad oriental. Perfecta para quienes buscan un aroma que transmita poder y triunfo.",
        image_url: "images/Invictus Victory.avif",
        available: true,
        bestseller: false,
        prices: {
            "5ml": 7.00,
            "10ml": 13.00
        },
        notes: {
            top: "Limón, Pimienta rosa",
            heart: "Lavanda, Incienso",
            base: "Vainilla, Haba tonka, Ámbar"
        }
    },
    {
        id: 4,
        name: "Le Male Elixir Absolu",
        brand: "Jean Paul Gaultier",
        description: "Un elixir hipnótico y sofisticado que intensifica la icónica firma de Le Male con un toque dulce y oriental. Para el hombre magnético que no pasa desapercibido.",
        image_url: "images/JPG elixir absolu.avif",
        available: true,
        bestseller: true,
        prices: {
            "5ml": 7.50,
            "10ml": 14.00
        },
        notes: {
            top: "Ciruela, Canela, Cardamomo, bergamota",
            heart: "Lavanda, Davana, Abrotamo",
            base: "Haba tonka, Benjuí, almizcle, Pachulí, Ládano"
        }
    },
    {
         id: 5,
        name: "The Most Wanted Intense",
        brand: "Azzaro",
        description: "Una fragancia audaz y sensual que juega entre la calidez especiada y la profundidad amaderada. Diseñada para el hombre seguro que busca destacar con estilo y misterio.",
        image_url: "images/azzaro intense.avif",
        available: true,
        bestseller: true,
        prices: {
            "5ml": 7.00,
            "10ml": 13.00
        },
        notes: {
            top: "Cardamomo",
            heart: "Toffee, Lavanda",
            base: "Ámbar, Maderas intensas"
        }
    },
    {
        id: 6,
        name: "Yves Saint Laurent Y EDP",
        brand: "Yves Saint Laurent",
        description: "Una fragancia moderna y magnética que combina la frescura aromática con una poderosa base amaderada. Ideal para el hombre creativo y visionario que siempre va un paso adelante.",
        image_url: "images/Y EDP.avif",
        available: true,
        bestseller: true,
        prices: {
            "5ml": 7.50,
            "10ml": 14.00
        },
        notes: {
            top: "Bergamota, Jengibre, Manzana",
            heart: "Salvia, Enebro, Geranio",
            base: "Cedro, Vetiver, Haba tonka, Incienso, Ámbar gris"
        }
    },
];
// Variables globales
let currentFilter = 'bestsellers';
let perfumesData = [...PERFUMES_DATABASE];

// --- Carrusel de Calidad Variables ---
const carouselTrack = document.getElementById('qualityCarousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const carouselDotsContainer = document.getElementById('carouselDots');
let currentIndex = 0;
let autoSlideInterval;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    renderProducts(getFilteredProducts(currentFilter));
    setupQualityCarousel(); // Inicializar carrusel
    setupDecantCards(); // Inicializar tarjetas de decant
}

function setupEventListeners() {
    // Event listeners para los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // Event listeners para el modal
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('productModal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function handleFilterClick(event) {
    const clickedBtn = event.currentTarget;
    const filter = clickedBtn.dataset.filter;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
    
    // Actualizar filtro actual y renderizar
    currentFilter = filter;
    renderProducts(getFilteredProducts(filter));
}

function getFilteredProducts(filter) {
    switch (filter) {
        case 'bestsellers':
            return perfumesData.filter(p => p.bestseller);
        case 'available':
            return perfumesData.filter(p => p.available);
        default:
            return perfumesData;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="loading">
                <p>No hay productos disponibles en esta categoría</p>
            </div>
        `;
        return;
    }
    
    // Mostrar loading brevemente para mejor UX
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    setTimeout(() => {
        grid.innerHTML = products.map(createProductCard).join('');
    }, 300);
}

function createProductCard(perfume) {
    const statusInfo = getStatusInfo(perfume);
    
    return `
        <div class="product-card" data-id="${perfume.id}" onclick="showProductDetails(${perfume.id})">
            <div class="product-image-container">
                <img src="${perfume.image_url}" alt="${perfume.name} - ${perfume.brand}" class="product-image">
            </div>
            <div class="product-header">
                <div class="product-info">
                    <h3>${perfume.name}</h3>
                    <p class="product-brand">${perfume.brand}</p>
                </div>
                <div class="product-status ${statusInfo.class}">
                    <span class="status-dot"></span>
                    ${statusInfo.text}
                </div>
            </div>
            
            <p class="product-description">${perfume.description}</p>
            
            <div class="product-pricing">
                <div class="price-option">
                    <div class="price-volume">Decant 5ml</div>
                    <div class="price-amount">${CONFIG.currency}${perfume.prices['5ml']}</div>
                </div>
                <div class="price-option">
                    <div class="price-volume">Decant 10ml</div>
                    <div class="price-amount">${CONFIG.currency}${perfume.prices['10ml']}</div>
                </div>
            </div>
        </div>
    `;
}

function showProductDetails(id) {
    const perfume = PERFUMES_DATABASE.find(p => p.id === id);
    if (!perfume) return;

    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = perfume.image_url;
    document.getElementById('modalImage').alt = `${perfume.name} - ${perfume.brand}`;
    document.getElementById('modalName').textContent = perfume.name;
    document.getElementById('modalBrand').textContent = perfume.brand;
    document.getElementById('modalDescription').textContent = perfume.description;
    document.getElementById('modalPrice5ml').textContent = `${CONFIG.currency}${perfume.prices['5ml']}`;
    document.getElementById('modalPrice10ml').textContent = `${CONFIG.currency}${perfume.prices['10ml']}`;
    
    // Rellenar las notas dinámicamente
    const notesHTML = `
        <h4>Notas Aromáticas</h4>
        <p><strong>Notas de Salida:</strong> ${perfume.notes.top}</p>
        <p><strong>Notas de Corazón:</strong> ${perfume.notes.heart}</p>
        <p><strong>Notas de Fondo:</strong> ${perfume.notes.base}</p>
    `;
    document.getElementById('modalNotes').innerHTML = notesHTML;

    const statusInfo = getStatusInfo(perfume);
    const modalStatus = document.getElementById('modalStatus');
    modalStatus.textContent = statusInfo.text;
    modalStatus.className = `modal-status ${statusInfo.class}`;
    
    const modalOrderBtn = document.getElementById('modalOrderBtn');
    modalOrderBtn.disabled = !perfume.available;
    modalOrderBtn.onclick = () => orderPerfume(perfume.name, perfume.brand, perfume.prices['5ml'], perfume.prices['10ml'], perfume.available);
    
    modal.style.display = 'flex';
}

function getStatusInfo(perfume) {
    if (!perfume.available) {
        return {
            class: 'status-unavailable',
            text: 'Agotado'
        };
    } else if (perfume.bestseller) {
        return {
            class: 'status-bestseller',
            text: 'Más Vendido'
        };
    } else {
        return {
            class: 'status-available',
            text: 'Disponible'
        };
    }
}

function orderPerfume(name, brand, price5ml, price10ml, available) {
    if (!available) {
        return;
    }
    
    const message = ` *CONCEP PARFUMS* ¡Hola! Me interesa el siguiente perfume:
 *${name}*
Marca: *${brand}*

*Precios disponibles:*
▫️ Decant 5ml → ${CONFIG.currency}${price5ml}
▫️ Decant 10ml → ${CONFIG.currency}${price10ml}

¿Podrías confirmarme la disponibilidad y cómo proceder con el pedido?

¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir en nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');
}

// Funciones de utilidad
function showNotification(message, type = 'info') {
    // Crear notificación simple
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#2c3e50'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// --- Lógica del Carrusel de Calidad ---
function setupQualityCarousel() {
    if (!carouselTrack || carouselItems.length === 0) return;

    // Crear puntos de navegación
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        carouselDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dots .dot');

    function moveToSlide(index) {
        if (index < 0) {
            index = carouselItems.length - 1;
        } else if (index >= carouselItems.length) {
            index = 0;
        }
        currentIndex = index;
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000); // Cambia de imagen cada 5 segundos
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide(); // Iniciar el carrusel automático
}


// --- Lógica de Tarjetas de Decants Interactivas ---
function setupDecantCards() {
    const decantCards = document.querySelectorAll('.interactive-card');
    decantCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        // Para accesibilidad con teclado
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });
}


// Event listeners adicionales para mejorar la UX
document.addEventListener('click', function(e) {
    // Agregar efectos de click en botones
    if (e.target.classList.contains('filter-btn') || e.target.classList.contains('order-btn')) {
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Detectar si la página se carga desde el caché
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Re-renderizar si es necesario
        renderProducts(getFilteredProducts(currentFilter));
        resetAutoSlide(); // Reiniciar carrusel si la página se recupera del caché
    }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

// Exportar funciones para uso global si es necesario
window.ConcepParfums = { // Cambié el nombre del objeto global a ConcepParfums
    orderPerfume,
    getFilteredProducts,
    renderProducts,
    perfumesData: PERFUMES_DATABASE
};
