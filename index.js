const jar=document.getElementById("jar");
const jar_amount=document.getElementById("jar-amount");
const intense=document.getElementById("intense");
const s=document.getElementById("s");
const calculate=document.getElementById("calculate");
const table=document.getElementById('table');


const isInAverage=(el)=>{
    let toNumber=parseFloat(el.value);
    return (toNumber<=el.max&&toNumber>=el.min)?el.value:false;
}

 calculate.addEventListener('click',()=>getCalculatedData());

 const getCalculatedData=()=>{
if(isInAverage(jar)&&isInAverage(intense)&&isInAverage(s)&&isInAverage(jar_amount)){
    table.style.visibility='visible';
    document.getElementById('jar-value').textContent=parseFloat(jar.value).toFixed(1)+" мл"+" * "+jar_amount.value+" шт";
    document.getElementById('intense-value').textContent=parseFloat(intense.value).toFixed(2) +" %";
    document.getElementById('s-value').textContent=parseFloat(s.value).toFixed(3);

    document.getElementById('v-value').textContent=(((jar.value*jar_amount.value*(1-intense.value/100))*0.86*intense.value/100/s.value)).toFixed(2) + " мл";
    document.getElementById('m-value').textContent=(((jar.value*(1-intense.value/100))*0.86*intense.value/100)*jar_amount.value).toFixed(2)+" г";
    document.getElementById('wax-value').textContent=(((jar.value*(1-intense.value/100))*0.86)*jar_amount.value).toFixed(2)+" г";
}
else{
table.style.visibility='hidden'
}
}
