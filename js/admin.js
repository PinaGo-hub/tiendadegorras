let carrito = [];

// Cargar carrito desde localStorage
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  actualizarCarrito();
}

// Lista de productos (ejemplo)
const productos = [
  { id: 1, nombre: "Gorra Nike pro", precios: { "Única": 800 }, imagen: "img/card1.png" },
  { id: 2, nombre: "Gorra Adidas", precios: { "Única": 750 }, imagen: "img/card2.png" },
  { id: 3, nombre: "Gorra Puma", precios: { "Única": 600 }, imagen: "img/card3.png" },
  { id: 4, nombre: "Gorra Jordan", precios: { "Única": 900 }, imagen: "img/card4.png" },
  { id: 1, nombre: "Gorra Nike pro", precios: { "Única": 800 }, imagen: "img/card5.png" },
  { id: 2, nombre: "Gorra Adidas", precios: { "Única": 750 }, imagen: "img/card6.png" },
  { id: 3, nombre: "Gorra Puma", precios: { "Única": 600 }, imagen: "img/card1.png" },
  { id: 4, nombre: "Gorra Jordan", precios: { "Única": 900 }, imagen: "img/card2.png" },
];

const contenedor = document.getElementById("productos-container");

// Renderizar cards de productos
productos.forEach(producto => {
  const col = document.createElement("div");
  col.className = "col s6 m4";
  col.setAttribute("data-aos", "fade-up");
  
  // Precio principal: el más alto
  const preciosArray = Object.values(producto.precios);
  const precioMayor = Math.max(...preciosArray);

  col.innerHTML = `
    <div class="card hoverable" style="border-radius:10px;">
      <div class="card-image">
        <img src="${producto.imagen}" style="height:auto; border-radius:10px; object-fit:cover;">
      </div>
      <div class="card-content center-align">
        <span class="card-title">${producto.nombre}</span>
        <p>
          L.${precioMayor}
        </p>
      </div>
      <div class="card-action center teal darken-1" style="border-radius:10px;">
        <a href="#!" class="white-text" onclick="agregarDirecto(${producto.id})">Agregar al carrito</a>
      </div>
    </div>`;
  contenedor.appendChild(col);
});

// 🔸 Agregar directo al carrito
function agregarDirecto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // Si hay varias presentaciones, tomamos la primera por defecto
  const presentaciones = Object.keys(producto.precios);
  const presentacion = presentaciones[0];
  const precioSeleccionado = producto.precios[presentacion];
  const cantidad = 1;

  // Ver si ya existe en el carrito
  const existente = carrito.find(item => item.id === producto.id && item.presentacion === presentacion);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: precioSeleccionado,
      imagen: producto.imagen,
      presentacion,
      cantidad
    });
  }

  actualizarCarrito();

  Swal.fire({
    icon: 'success',
    title: '¡Agregado!',
    text: `${producto.nombre} (${presentacion})`,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#28a745',
    color: 'white'
  });
}

// 🔸 Actualizar carrito
function actualizarCarrito() {
  const cont = document.getElementById("carrito-items");
  cont.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    cont.innerHTML += `
      <div class="carrito-item" style="
        display:flex; 
        align-items:center; 
        gap:12px; 
        background:#f9f9f9; 
        border-radius:12px; 
        padding:10px 15px; 
        margin-bottom:10px; 
        box-shadow:0 2px 6px rgba(0,0,0,0.1);
      ">
        <img src="${item.imagen}" alt="${item.nombre}" style="
          width:60px; 
          height:60px; 
          object-fit:cover; 
          border-radius:8px;
        ">
        <div style="flex:1; font-size:14px; color:#333;">
          <strong style="font-size:15px;">${item.nombre}</strong><br>
          <span style="color:#555;">${item.presentacion} | Cantidad: ${item.cantidad}</span><br>
          <span style="color:#777;">L.${item.precio} c/u</span><br>
          <span style="font-weight:bold; color:#222;">Subtotal: L.${subtotal}</span>
        </div>
        <button onclick="eliminarDelCarrito(${i})" style="
          background:#ff4d4d; 
          border:none; 
          color:white; 
          border-radius:50%; 
          width:28px; 
          height:28px; 
          cursor:pointer; 
          font-weight:bold; 
          font-size:14px;
        ">×</button>
      </div>`;
  });

  document.getElementById("cartTotal").innerHTML = `<div style="margin-top:10px; padding:10px; text-align:right; font-size:16px; font-weight:bold; color:#222;">Total: L.${total}</div>`;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Eliminar item
function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
}

// Modal Carrito
function abrirCarrito() {
  document.getElementById("cartModal").style.display = "block";
}
function cerrarCarrito() {
  document.getElementById("cartModal").style.display = "none";
}

// Cotizar por WhatsApp
function cotizarWhatsApp() {
  if (carrito.length === 0) {
    Swal.fire({icon:'info',title:'Carrito vacío',text:'Agrega productos antes de cotizar',timer:1500,showConfirmButton:false,toast:true,position:'top-end'});
    return;
  }

  let mensaje = "¡Hola! Me interesa cotizar las siguientes gorras:%0A%0A";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} | ${item.presentacion} | Cantidad: ${item.cantidad} | Precio: L.${item.precio} c/u | Subtotal: L.${item.precio * item.cantidad}%0A`;
  });
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  mensaje += `%0ATotal: L.${total}`;
  window.open(`https://wa.me/50498174113?text=${mensaje}`, "_blank");
}

// Inicializar Materialize y AOS
document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  AOS.init({ duration: 1000, once: true });
});
