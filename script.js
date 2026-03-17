// Simple catalog of products per service
const serviceCatalog = {
  'Impresiones': ['Fotocopia A4 (blanco/negro)', 'Impresión A4 (color)', 'Escaneo 1 página', 'Fotocopia a color', 'Impresión a blanco y negro'],
  'Trámites': [
    'Apostilla (antecedentes judiciales, Cartas, cartas notarias, defunción)',
    'Certificados varios',
    'Certificado de traición y libertad',
    'Certificado de traición y libertad con pin',
    'Certificado de N° propiedad',
    'Certificado de tradición y libertad consulta con la cedula',
    'Certificado de REDAM',
    'Cámara de Comercio Con Cedula',
    'Cámara de comercio Con NIT',
    'Certificado de Caja de compensación',
    'Colpensiones historia laboral',
    'Colpensiones Certificado de devengado y No devengado (Colilla De Pago)',
    'Colpensiones Certificado de N° Pensión',
    'Colpensiones registro de Nuevo usuario',
    'Colpensiones Certificado de ingreso y Retención',
    'Descarga de Factura EPM',
    'Eticket',
    'PQRS',
    'Pasa bordo o Check in'
  ],
  'EPS y Salud': [
    'Autorizaciones medicas',
    'Agregar Beneficiario a sura',
    'Cita médica cualquier EPS',
    'Cita Nueva EPS Punto de la oriental',
    'Cambio de IPS',
    'Descarga de orden médica o autorización EPS',
    'Descarga de Resultados Médicos',
    'Registro de cualquier eps',
    'Renovación de formula medica sura por WhatsApp',
    'Renovación de formula medica sura',
    'Transcripción de incapacidad',
    'Traslado de eps (Pag Mi seguridad social)'
  ],
  'Tránsito': [
    'Cita Transito con Registro',
    'Descarga del soat',
    'Historial vehicular',
    'Runt consulta',
    'Semaforización',
    'Simit consulta'
  ],
  'Programas Sociales': [
    'Cita para SISBÉN',
    'Comfama Matricula Para Preescolar',
    'Comfama Mecanismo de Protección al Cesante',
    'Colpensiones Recibo de pago de Colombia mayor',
    'Postulación de desempleo Comfama',
    'Sisbén encuesta, registro, solicitud'
  ],
  'Bancos': [
    'Apertura de cuenta Bancolombia',
    'Consulta MI DATA CREDITO',
    'Certificado tributario de Bancolombia',
    'Extractos Bancarios',
    'Pagos PSE'
  ],
  'Creación Web': ['Sitio Landing', 'Tienda básica', 'Hosting y dominio'],
  'Mantenimiento Web': ['Actualización CMS', 'Backup mensual', 'Soporte 4 horas']
};

// Se agrega nuevo catálogo para Gobierno y documentos
serviceCatalog['Gobierno y documentos'] = [
  'Certificado de AGUSTIN CODAZI',
  'Cedula Digital',
  'Cita registraduría por primera vez',
  'Cita registraduría con pin',
  'Check Migratorio',
  'Denuncia en la fiscalía',
  'Ficha catastral',
  'Impuesto predial o paz y salvo con registro',
  'Impuesto predial o paz y salvo sin registro',
  'PQRS Migración Colombia',
  'Paz y salvo valorización',
  'RUT por primera vez',
  'Rut cita',
  'Rut actualización sin firma',
  'Rut actualización con firma',
  'Rut copia cuando cliente tiene contraseña',
  'Rut copia cuando cliente no tiene contraseña',
  'Registro de cedula para votar',
  'Registro rumv',
  'Registro civil en línea (página registraduría)'
];

function showServices(name){
  const modal = document.getElementById('serviceModal');
  const title = document.getElementById('serviceModalTitle');
  const content = document.getElementById('serviceModalContent');
  title.innerText = name;
  content.innerHTML = '';

  const items = serviceCatalog[name] || ['Servicio no disponible'];
  const grid = document.createElement('div');
  grid.className = 'service-grid';

  items.forEach((it, idx)=>{
    const card = document.createElement('div');
    card.className = 'service-card';

    const span = document.createElement('div');
    span.className = 'service-title';
    span.innerText = it;

    const btn = document.createElement('button');
    // Use dataset to avoid manual escaping in onclick
    btn.innerText = 'Agregar';
    btn.addEventListener('click', ()=>{
      addToCart(`${name} - ${it}`);
      // pequeña retroalimentacion visual
      btn.innerText = 'Añadido';
      setTimeout(()=>btn.innerText='Agregar',900);
    });

    card.appendChild(span);
    card.appendChild(btn);
    grid.appendChild(card);
  });

  content.appendChild(grid);

  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}

function closeServicesModal(){
  const modal = document.getElementById('serviceModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

// Always open chat: if cart has items, include the message; otherwise open direct chat
document.getElementById('whatsappFloat').addEventListener('click', function(){
  const telefono='573134546255';
  try{
    // build message only from cart array if exists
    const cartExists = Array.isArray(window.cart) && window.cart.length>0;
    if(cartExists){
      let mensaje = 'Hola, quiero solicitar estos servicios:%0A';
      window.cart.forEach(item=>{ mensaje += '- '+item+'%0A'; });
      const url = `https://wa.me/${telefono}?text=${mensaje}`;
      window.open(url,'_blank');
      return;
    }
    // cart empty: open direct chat without message
    const url = `https://wa.me/${telefono}`;
    window.open(url,'_blank');
  }catch(err){
    // fallback: open direct chat
    window.open(`https://wa.me/${telefono}`,'_blank');
  }
});

// Manage visibility of floating button: hide when cart opens or on small screens at top
(function(){
  const floatBtn = document.getElementById('whatsappFloat');
  const cartPanel = document.getElementById('cartPanel');
  if(!floatBtn) return;

  // Hide when cart is active
  if(cartPanel){
    const mo = new MutationObserver(()=>{
      if(cartPanel.classList.contains('active')) floatBtn.classList.add('hidden');
      else floatBtn.classList.remove('hidden');
    });
    mo.observe(cartPanel, { attributes: true, attributeFilter: ['class'] });
  }

  // On very small screens, hide until user scrolls
  function handleSmall(){
    if(window.matchMedia('(max-width:480px)').matches){
      if(window.scrollY < 120) floatBtn.classList.add('hidden-on-small');
      else floatBtn.classList.remove('hidden-on-small');
    } else {
      floatBtn.classList.remove('hidden-on-small');
    }
  }

  window.addEventListener('scroll', handleSmall, {passive:true});
  window.addEventListener('resize', handleSmall);
  handleSmall();
})();

function toggleDark(){
 document.body.classList.toggle('dark');
}

function buscarServicio(){
 const input=document.getElementById("searchInput").value.toLowerCase();
 const cards=document.querySelectorAll("#servicesGrid .card");

 cards.forEach(card=>{
   const text=card.innerText.toLowerCase();
   card.style.display=text.includes(input)?"block":"none";
 });
}

/* CARRITO */

let cart=[];

function toggleCart(){
 document.getElementById("cartPanel").classList.toggle("active");
}

function closeCart(){
 document.getElementById("cartPanel").classList.remove("active");
}

function addToCart(service){
 cart.push(service);

 // animacion contador
 const count=document.getElementById("cart-count");
 count.style.transform="scale(1.4)";
 setTimeout(()=>count.style.transform="scale(1)",200);

 updateCart();
}

function removeItem(index){
 cart.splice(index,1);
 updateCart();
}

function vaciarCarrito(){
 cart=[];
 updateCart();
}

function enviarWhatsApp(){
 if(cart.length===0){
  alert("El carrito está vacío");
  return;
 }

 let mensaje="Hola, quiero solicitar estos servicios:%0A";

 cart.forEach(item=>{
  mensaje+="- "+item+"%0A";
 });

 const telefono="573134546255";
 const url=`https://wa.me/${telefono}?text=${mensaje}`;
 window.open(url,"_blank");
}

function updateCart(){
 const container=document.getElementById("cartItems");
 container.innerHTML="";

 cart.forEach((item,index)=>{
  const div=document.createElement("div");
  div.className="cart-item";

  div.innerHTML=`
  <span>${item}</span>
  <button class="remove-btn" onclick="removeItem(${index})">X</button>
  `;

  container.appendChild(div);
 });

 document.getElementById("cart-count").innerText=cart.length;
}

// cerrar carrito haciendo click fuera
window.addEventListener("click",function(e){
 const cartPanel=document.getElementById("cartPanel");
 const cartBtn=document.querySelector(".cart-btn");

 if(cartPanel.classList.contains("active") && !cartPanel.contains(e.target) && !cartBtn.contains(e.target)){
  cartPanel.classList.remove("active");
 }
});