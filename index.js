const jar=document.getElementById("jar");
const jar_amount=document.getElementById("jar-amount");
const intense=document.getElementById("intense");
const s=document.getElementById("s");
const calculate=document.getElementById("calculate");
const table=document.getElementById('table');
const waxGravity=document.getElementById('floatingSelectGrid');

document.addEventListener("DOMContentLoaded", function () {
  fetch("/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      // Підсвічування активної сторінки
      const current = location.pathname.split("/").pop();
      const navLinks = document.querySelectorAll(".nav-link");

      navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === current) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => console.error("Помилка завантаження header:", err));
});
const isInAverage=(el)=>{
    let toNumber=parseFloat(el.value);
    return (toNumber<=el.max&&toNumber>=el.min)?el.value:false;
}

 calculate.addEventListener('click',()=>getCalculatedData());

 const getCalculatedData=()=>{
    
if(isInAverage(jar)&&isInAverage(intense)&&isInAverage(s)&&isInAverage(jar_amount)){
    // table.style.visibility='visible';
    // myModal.addEventListener('shown.bs.modal', () => {
    //     myInput.focus()
    //   })
    document.getElementById('jar-value').textContent=parseFloat(jar.value).toFixed(1)+" мл"+" * "+jar_amount.value+" шт";
    document.getElementById('intense-value').textContent=parseFloat(intense.value).toFixed(2) +" %";
    document.getElementById('s-value').textContent=parseFloat(s.value).toFixed(3);

    document.getElementById('v-value').textContent=(((jar.value*jar_amount.value*(1-intense.value/100))*waxGravity.value*intense.value/100/s.value)).toFixed(2) + " мл";
    document.getElementById('m-value').textContent=(((jar.value*(1-intense.value/100))*waxGravity.value*intense.value/100)*jar_amount.value).toFixed(2)+" г";
    document.getElementById('wax-value').textContent=(((jar.value*(1-intense.value/100))*waxGravity.value)*jar_amount.value).toFixed(2)+" г";
}
else{

}
}

const form=document.getElementById('form');


Array.from(form).forEach(f=>f.addEventListener('input',event=>{
   
    
    if(f.validity.valid&&Array.from(form).every(r=>r.validity.valid)){
        calculate.disabled=false;
       
    }
    else{
        calculate.disabled=true;
    }
}))

