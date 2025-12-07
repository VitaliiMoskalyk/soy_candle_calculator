// import * as flsFunctions from "./modules/functions.js";

// flsFunctions.isWebp();

/*
import Swiper, { Navigation, Pagination } from 'swiper';
const swiper = new Swiper();
*/

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc,  arrayUnion, updateDoc  } from "firebase/firestore";
import  {getCalculatedData}  from "./modules/getCalculatedData.js";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyAZnJkd50MA6alle1sAACLL3Gp_KZ6SB08",
  authDomain: "candles-982d2.firebaseapp.com",
  projectId: "candles-982d2",
  storageBucket: "candles-982d2.appspot.com",
  messagingSenderId: "221424626307",
  appId: "1:221424626307:web:yourappid"
};

// ===== Инициализация =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

// ===== Основной код =====

  // === DOM элементы ===
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const userInfo = document.getElementById("user-info");
  const userEmailSpan = document.getElementById("user-email");
  const form = document.getElementById("form");
  const calculate = document.getElementById("calculate");
  const authToastEl = document.getElementById("authToast");
  const authToast = authToastEl ? new bootstrap.Toast(authToastEl) : null;

  let userLoggedIn = false;

  // === Слежение за авторизацией ===
  onAuthStateChanged(auth, (user) => {
    userLoggedIn = !!user;
    if (user) {
      userInfo.style.display = "flex";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      userEmailSpan.textContent = user.email;
    } else {
      userInfo.style.display = "none";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      userEmailSpan.textContent = "";
    }
  });

  // === Универсальная функция входа/регистрации ===
  async function handleAuth(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Пользователь зарегистрирован");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Вход успешен");
        const user = auth.currentUser;

await setDoc(doc(db, "users", user.uid), {
  name: user.email,
}, { merge: true });



      } else {
        alert("Ошибка: " + err.message);
      }
    }
  }

  // === Обработчик формы входа ===
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    try {
      await handleAuth(email, password);
      bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
    finally{
      location.reload();
    }
  });

  // === Выход ===
  logoutBtn?.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Ошибка выхода: " + err.message);
    } finally{
      location.reload();
    }
  });

  // === Калькулятор ===
  const inputs = form ? form.querySelectorAll("input, select") : [];

  function validateForm() {
    return Array.from(inputs).every(i => i.validity.valid);
  }

  inputs.forEach(input =>
    input.addEventListener("input", () => {
      calculate.disabled = !validateForm();
    })
  );

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

  // === Кнопка "Розрахувати" ===
 
  calculate?.addEventListener("click",() => {
     let result = null;
    if (!validateForm()) return;

    if (!userLoggedIn) {
      console.dir(authToast)
      authToast._element.innerHTML='<div class="d-flex"><div class="toast-body">       Для виконання розрахунку потрібно увійти в систему.</div> <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>  </div>';
      authToast?.show()
    } else {
       result=getCalculatedData();
    
      document.getElementById("intense-value").textContent = `${result.intense} %`;
      document.getElementById("s-value").textContent = result.gravity;
      document.getElementById("v-value").textContent = result.scentValue + " мл";
      document.getElementById("m-value").textContent = result.scentWeight + " г";
      document.getElementById("wax-value").textContent = result.waxWeight + " г";
      document.getElementById("jar-value").textContent = `${result.jarValue} мл * ${result.jarAmount} шт`;

      const modalEl = document.getElementById("exampleModal");
      new bootstrap.Modal(modalEl).show();
      const dataSubmit = document.getElementById('dataSubmit');

        dataSubmit.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;

        if (!result) return;

        await setDoc(
            doc(db, "users", user.uid),
            { history: arrayUnion({

            result: result
        })},
            { merge: true }
        );

        authToast._element.innerHTML='<div class="d-flex"><div class="toast-body">       Розрахунок збережено в профілі. </div> <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>  </div>';
      authToast?.show()
        });
            
        }
  });





  const tableBody = document.querySelector("#historyTable tbody");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  if (Array.isArray(data.history)&&tableBody) {
    renderTable(data.history);
  }
});

function renderTable(history) {
  tableBody.innerHTML = ""; // очищаем

  history.forEach((item, index) => {
    const r = item.result;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td  data-field="jarValue">${r.jarValue}мл,${r.jarAmount}шт</td>
      <td  data-field="waxType">${r.waxType}</td>
      <td  data-field="intense">${r.intense}%</td>
      <td contenteditable="true" data-field="scent">${r.scent?r.scent:r.intense}</td>
      <td  data-field="scentValue">${r.scentValue}мл</td>
      <td  data-field="scentWeight">${r.scentWeight}г</td>
      <td  data-field="waxWeight">${r.waxWeight}г</td>
      <td contenteditable="true" data-field="review">${r.review?r.review:'-'}</td>
      <td><button class="deleteRow btn btn-danger btn-sm" data-index="${index}">
          Видалити
        </button></td>
    `;

    tableBody.appendChild(row);
  });

  // навешиваем обработчики удаления
  document.querySelectorAll(".deleteRow").forEach(btn =>
    btn.addEventListener("click", deleteRow)
  );

  // навешиваем обработчики редактирования
  document.querySelectorAll("[contenteditable]").forEach(cell =>
    cell.addEventListener("blur", saveEditedCell)
  );
}


async function deleteRow(e) {
  const index = Number(e.target.dataset.index);
  const user = auth.currentUser;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  data.history.splice(index, 1);

  await updateDoc(ref, { history: data.history });
  renderTable(data.history);
}

async function saveEditedCell(e) {
  const cell = e.target;
  const row = cell.parentElement;
  const index = row.rowIndex - 1;

  const field = cell.dataset.field;
  const newValue = cell.textContent.trim();

  const user = auth.currentUser;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  data.history[index].result[field] = newValue;

  await updateDoc(ref, { history: data.history });
}
