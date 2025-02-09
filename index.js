const jar=document.getElementById("jar");
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
if(isInAverage(jar)&&isInAverage(intense)&&isInAverage(s)){
    table.style.visibility='visible';
    document.getElementById('jar-value').textContent=parseFloat(jar.value).toFixed(2);
    document.getElementById('intense-value').textContent=parseFloat(intense.value).toFixed(2);
    document.getElementById('s-value').textContent=parseFloat(s.value).toFixed(3);

    document.getElementById('v-value').textContent=((jar.value*(1-intense.value/100))*0.86*intense.value/100/s.value).toFixed(2);
    document.getElementById('m-value').textContent=((jar.value*(1-intense.value/100))*0.86*intense.value/100).toFixed(2);
    document.getElementById('wax-value').textContent=((jar.value*(1-intense.value/100))*0.86).toFixed(2);
}
else{
table.style.visibility='hidden'
}
}
