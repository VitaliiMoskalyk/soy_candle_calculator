export function getCalculatedData() {
    const jar = document.getElementById("jar");
    const jar_amount = document.getElementById("jar-amount");
    const intense = document.getElementById("intense");
    const s = document.getElementById("s");
    const waxGravity = document.getElementById("floatingSelectGrid");

    const isInRange = (el) =>
      parseFloat(el.value) >= parseFloat(el.min) && parseFloat(el.value) <= parseFloat(el.max);

    if ([jar, jar_amount, intense, s].every(isInRange)) {
      const V_c = parseFloat(jar.value);
      const jarCount = parseFloat(jar_amount.value);
      const f = parseFloat(intense.value) / 100;
      const rho_w = parseFloat(waxGravity.value);
      const rho_f = parseFloat(s.value);

      const V_total = V_c * jarCount;
      const m_w_total = V_total / ((1 / rho_w) + (f / rho_f));
      const m_f_total = f * m_w_total;
      const V_f_total = m_f_total / rho_f;

      return{
        waxType:waxGravity.selectedOptions[0].innerText,
        jarValue:V_c,
        jarAmount:jarCount,
        intense:(f * 100).toFixed(2),
        gravity:rho_f.toFixed(3),
        scentValue:V_f_total.toFixed(2),
        scentWeight:m_f_total.toFixed(2),
        waxWeight:m_w_total.toFixed(2)
      }


    }
    return null;
  }


  //   function getCalculatedData() {
  //     const jar = document.getElementById("jar");
  //     const jar_amount = document.getElementById("jar-amount");
  //     const intense = document.getElementById("intense");
  //     const s = document.getElementById("s");
  //     const waxGravity = document.getElementById("floatingSelectGrid");
  
  //     const isInRange = (el) =>
  //       parseFloat(el.value) >= parseFloat(el.min) && parseFloat(el.value) <= parseFloat(el.max);
  
  //     if ([jar, jar_amount, intense, s].every(isInRange)) {
  //       const V_c = parseFloat(jar.value);
  //       const jarCount = parseFloat(jar_amount.value);
  //       const f = parseFloat(intense.value) / 100;
  //       const rho_w = parseFloat(waxGravity.value);
  //       const rho_f = parseFloat(s.value);
  
  //       const V_total = V_c * jarCount;
  //       const m_w_total = V_total / ((1 / rho_w) + (f / rho_f));
  //       const m_f_total = f * m_w_total;
  //       const V_f_total = m_f_total / rho_f;
  
  //       document.getElementById("jar-value").textContent = `${V_c} мл * ${jarCount} шт`;
  //       document.getElementById("intense-value").textContent = `${(f * 100).toFixed(2)} %`;
  //       document.getElementById("s-value").textContent = rho_f.toFixed(3);
  //       document.getElementById("v-value").textContent = V_f_total.toFixed(2) + " мл";
  //       document.getElementById("m-value").textContent = m_f_total.toFixed(2) + " г";
  //       document.getElementById("wax-value").textContent = m_w_total.toFixed(2) + " г";
  //     }
  //   }