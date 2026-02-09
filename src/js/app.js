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
import {getCurrentLang} from "./modules/getCurrentLang.js";
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
  const toastText=document.getElementById('toast-body')
  const authToast = authToastEl ? new bootstrap.Toast(authToastEl) : null;
  const tableBody = document.querySelector("#historyTable tbody");
  const userInfoBlocks = document.querySelectorAll(".user-info");
const authButtonsBlocks = document.querySelectorAll(".auth-buttons");
const userEmailSpans = document.querySelectorAll(".user-email");

// mobile dropdown logout
document.querySelectorAll(".logout-btn").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault(); // обязательно, иначе кнопка ведет себя как submit
    await signOut(auth);
    // скрываем dropdown после выхода
    const dropdown = bootstrap.Dropdown.getInstance(btn.closest('.dropdown-toggle'));
    if (dropdown) dropdown.hide();
  });
});

  let userLoggedIn = false;
  const currentLang = getCurrentLang();

  // === Слежение за авторизацией ===
// === Слежение за авторизацией ===
onAuthStateChanged(auth, async (user) => {
  userLoggedIn = !!user;

  if (user) {
    // desktop
    userInfo.style.display = "flex";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    userEmailSpan.textContent = user.email;

    // mobile
    userInfoBlocks.forEach(el => el.style.display = "flex");
    authButtonsBlocks.forEach(el => el.style.display = "none");
    userEmailSpans.forEach(el => el.textContent = user.email);

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    if (Array.isArray(data.history) && tableBody) {
      renderTable(data.history);
    }

  } else {
    // desktop
    userInfo.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userEmailSpan.textContent = "";

    // mobile
    userInfoBlocks.forEach(el => el.style.display = "none");
    authButtonsBlocks.forEach(el => el.style.display = "flex");
    userEmailSpans.forEach(el => el.textContent = "");

    // вставляем сообщение + кнопку в таблицу
    if (tableBody) {
      tableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;">
          <p>${currentLang === "en" ? "Please log in to see your calculation history." : "Будь ласка, увійдіть, щоб побачити історію ваших розрахунків."}</p>
          <button id="loginTableBtn" class="btn btn-primary btn-sm">
            ${currentLang === "en" ? "Log In / Register" : "Вхід / Реєстрація"}
          </button>
        </td>
      </tr>
      `;

      // Вешаем обработчик сразу после вставки кнопки
      const loginTableBtn = document.getElementById("loginTableBtn");
      if (loginTableBtn) {
        loginTableBtn.addEventListener("click", () => {
          loginBtn.click(); // триггерим существующую кнопку модалки
        });
      }
    }
  }

  document.body.classList.remove("auth-loading");
});


//   onAuthStateChanged(auth, async (user) => {
//   if (!user) return;

//   const ref = doc(db, "users", user.uid);
//   const snap = await getDoc(ref);

//   if (!snap.exists()) return;

//   const data = snap.data();

//   if (Array.isArray(data.history)&&tableBody) {
//     renderTable(data.history);
//   }
// });

  // === Универсальная функция входа/регистрации ===
async function handleAuth(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Пользователь зарегистрирован");

    const user = cred.user;

    await setDoc(
      doc(db, "users", user.uid),
      { name: user.email },
      { merge: true }
    );

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {

      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Вход успешен");
      toastText.textContent=currentLang==='en' ? `Sign in successful.` : `Вхід успішний.`;
          authToast?.show();

      const user = cred.user;

      await setDoc(
        doc(db, "users", user.uid),
        { name: user.email },
        { merge: true }
      );

    } else {
       toastText.textContent=currentLang==='en' ? `Error: ${err.message}` : `Помилка: ${err.message}`;
          authToast?.show();
      throw err;
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
      toastText.textContent=currentLang==='en' ? `Error: ${err.message}` : `Помилка: ${err.message}`;
          authToast?.show();
    }
    finally{
      if (window.location.pathname.endsWith("/profile.html")) {location.reload();}
    }
  });

  // === Выход ===
// ===== Logout для desktop + mobile =====
function setupLogout() {
  // Desktop logout
  logoutBtn?.addEventListener("click", async () => {
    await handleSignOut();
  });

  // Mobile logout (dropdown)
  document.querySelectorAll(".logout-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      await handleSignOut(btn);
    });
  });
}

async function handleSignOut(mobileBtn) {
  try {
    // Выход из Firebase
    await signOut(auth);

    // Очистка всех пользовательских данных
    if (userEmailSpan) userEmailSpan.textContent = "";
    userEmailSpans.forEach(el => el.textContent = "");
    if (tableBody) tableBody.innerHTML = "";

    // Закрываем dropdown на мобильной версии
    if (mobileBtn) {
      const dropdownToggle = mobileBtn.closest(".dropdown")?.querySelector(".dropdown-toggle");
      const dropdownInstance = dropdownToggle ? bootstrap.Dropdown.getInstance(dropdownToggle) : null;
      if (dropdownInstance) dropdownInstance.hide();
    }

    // Перезагрузка страницы, чтобы синхронизировать состояние
    if (window.location.pathname.endsWith("/profile.html")) {location.reload();}
    

  } catch (err) {
    toastText.textContent=currentLang==='en' ? `Error: ${err.message}` : `Помилка: ${err.message}`;
          authToast?.show();
  }
}

// ===== Инициализация logout =====
setupLogout();


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



  // === Кнопка "Розрахувати" ===
 let resultData = null;
  calculate?.addEventListener("click",() => {
     
    if (!validateForm()) return;

    else {
      
       resultData=getCalculatedData();
   
    
      document.getElementById("intense-value").textContent = `${resultData.intense} %`;
      document.getElementById("s-value").textContent = resultData.gravity;
      document.getElementById("v-value").textContent = resultData.scentValue + (currentLang === "en" ? " ml" : " мл");
      document.getElementById("m-value").textContent = resultData.scentWeight + (currentLang === "en" ? " g" : " г");
      document.getElementById("wax-value").textContent = resultData.waxWeight + (currentLang === "en" ? " g" : " г");
      document.getElementById("jar-value").textContent = `${resultData.jarValue} ${currentLang === "en" ? "ml" : "мл"} * ${resultData.jarAmount} ${currentLang === "en" ? "pcs" : "шт"}`;

      const modalEl = document.getElementById("exampleModal");
      new bootstrap.Modal(modalEl).show();
  console.log(resultData)
            return resultData;
        }
  });

    const dataSubmit = document.getElementById('dataSubmit');

        dataSubmit?.addEventListener('click', async () => {
        const user = auth.currentUser;

        if (!userLoggedIn) {
          toastText.textContent=currentLang==='en' ? `For saving the calculation, you need to log in.` : `Для збереження розрахунку потрібно увійти в систему.`;
          authToast?.show();
        loginBtn.click();
          return};
        
        if (!user) return;

        else{    
                  await setDoc(
            doc(db, "users", user.uid),
            { history: arrayUnion({

            result: resultData
        })},
            { merge: true }
        );

      toastText.textContent=currentLang==='en' ? `Calculation saved` : `Розрахунок збережено`;
      authToast?.show();
      
        }

        });



  



function renderTable(history) {
  tableBody.innerHTML = ""; // очищаем

  history.forEach((item, index) => {
    const r = item.result;

    const row = document.createElement("tr");
  
    row.innerHTML = `
      <td>${index + 1}</td>
      <td  data-field="jarValue">${r.jarValue} ${currentLang === "en" ? "ml" : "мл"}\n${r.jarAmount} ${currentLang === "en" ? "pcs" : "шт"}</td>
      <td  data-field="waxType">${r.waxType}</td>
      <td  data-field="intense">${r.intense}%</td>
      <td contenteditable="true" data-field="scent">${r.scent?r.scent:r.intense}</td>
      <td  data-field="scentValue">${r.scentValue} ${currentLang === "en" ? "ml" : "мл"}</td>
      <td  data-field="scentWeight">${r.scentWeight} ${currentLang === "en" ? "g" : "г"}</td>
      <td  data-field="waxWeight">${r.waxWeight} ${currentLang === "en" ? "g" : "г"}</td>
      <td contenteditable="true" data-field="review">${r.review?r.review:'-'}</td>
      <td><button class="deleteRow btn btn-sm" data-index="${index}">
          <svg class="icon"> 
          <use href="/img/icons/icons.svg#delete"></use>
        </svg>
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
  const index = Number(e.currentTarget.dataset.index);
  const user = auth.currentUser;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  data.history.splice(index, 1);

  await updateDoc(ref, { history: data.history });
  renderTable(data.history);
      toastText.textContent= currentLang==='en' ? `Row ${index+1} deleted` : `Рядок ${index+1} видалено`;
      authToast?.show()
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


