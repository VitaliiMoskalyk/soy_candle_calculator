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
        let V_c = parseFloat(jar.value); // Обʼєм одиниці тари (мл)
        let jarCount = parseFloat(jar_amount.value); // Кількість тари
        let f = parseFloat(intense.value) / 100; // Частка аромату (у відсотках)
        let rho_w = parseFloat(waxGravity.value); // Щільність воску (г/мл)
        let rho_f = parseFloat(s.value); // Щільність аромату (г/мл)

            // Загальний обʼєм для всіх одиниць тари
        let V_total = V_c * jarCount;

        // === Класична формула ===
        // Масса воску на весь обʼєм
        let m_w_total = V_total / ( (1 / rho_w) + (f / rho_f) );

        // Масса аромату
        let m_f_total = f * m_w_total;

        // Обʼєм аромату
        let V_f_total = m_f_total / rho_f;


        // === Вивід у таблицю ===
        document.getElementById('jar-value').textContent = V_c.toFixed(1) + " мл" + " * " + jarCount + " шт";
        document.getElementById('intense-value').textContent = (f * 100).toFixed(2) + " %";
        document.getElementById('s-value').textContent = rho_f.toFixed(3);

        document.getElementById('v-value').textContent = V_f_total.toFixed(2) + " мл";
        document.getElementById('m-value').textContent = m_f_total.toFixed(2) + " г";
        document.getElementById('wax-value').textContent = m_w_total.toFixed(2) + " г";

    
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

