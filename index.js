import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyAZnJkd50MA6alle1sAACLL3Gp_KZ6SB08",
  authDomain: "candles-982d2.firebaseapp.com",
  projectId: "candles-982d2",
  storageBucket: "candles-982d2.appspot.com",
  messagingSenderId: "221424626307",
  appId: "1:221424626307:web:yourappid"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", async () => {
  // ===== Загружаем header =====
  const headerHTML = await fetch("header.html").then(r => r.text());
  document.getElementById("header").innerHTML = headerHTML;

  // ===== DOM элементы =====
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const userInfo = document.getElementById("user-info");
  const userEmailSpan = document.getElementById("user-email");

  const form = document.getElementById('form');
  const calculate = document.getElementById('calculate');
  const authToastEl = document.getElementById('authToast');
  const authToast = new bootstrap.Toast(authToastEl);

  let userLoggedIn = false;

  // ===== Слежение за авторизацией =====
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userLoggedIn = true;
      userInfo.style.display = "flex";
      loginBtn.style.display = "none";
      userEmailSpan.textContent = user.email;
      logoutBtn.style.display="block";
    } else {
      userLoggedIn = false;
      userInfo.style.display = "none";
      loginBtn.style.display = "inline-block";
      userEmailSpan.textContent = "";
      logoutBtn.style.display="none";
    }
  });

  // ===== Вход / регистрация =====
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      // Создаем пользователя
      await createUserWithEmailAndPassword(auth, email, password);
      bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
      console.log("Пользователь зарегистрирован и вошел");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        // Если уже существует — пробуем войти
        try {
          await signInWithEmailAndPassword(auth, email, password);
          bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
          console.log("Вход успешен");
        } catch (loginErr) {
          alert("Ошибка входа: " + loginErr.message);
        }
      } else {
        alert("Ошибка регистрации: " + err.message);
      }
    }
  });

  // ===== Выход =====
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Ошибка выхода: " + err.message);
    }
  });

  // ===== Кнопка "Розрахувати" =====
  Array.from(form).forEach(f => f.addEventListener('input', () => {
    calculate.disabled = !Array.from(form).every(r => r.validity.valid);
  }));

  calculate.addEventListener('click', () => {
    const formValid = Array.from(form).every(f => f.validity.valid);
    if (!formValid) return;

    if (!userLoggedIn) {
      authToast.show(); // показываем тост
    } else {
      getCalculatedData(); // выполняем расчет
      const modalEl = document.getElementById('exampleModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  });
});

// ===== Калькулятор =====
const jar = document.getElementById("jar");
const jar_amount = document.getElementById("jar-amount");
const intense = document.getElementById("intense");
const s = document.getElementById("s");
const waxGravity = document.getElementById("floatingSelectGrid");

const getCalculatedData = () => {
  const isInRange = (el) => parseFloat(el.value) >= parseFloat(el.min) && parseFloat(el.value) <= parseFloat(el.max);

  if (isInRange(jar) && isInRange(intense) && isInRange(s) && isInRange(jar_amount)) {
    const V_c = parseFloat(jar.value);
    const jarCount = parseFloat(jar_amount.value);
    const f = parseFloat(intense.value) / 100;
    const rho_w = parseFloat(waxGravity.value);
    const rho_f = parseFloat(s.value);

    const V_total = V_c * jarCount;
    const m_w_total = V_total / ((1 / rho_w) + (f / rho_f));
    const m_f_total = f * m_w_total;
    const V_f_total = m_f_total / rho_f;

    document.getElementById('jar-value').textContent = `${V_c} мл * ${jarCount} шт`;
    document.getElementById('intense-value').textContent = `${(f * 100).toFixed(2)} %`;
    document.getElementById('s-value').textContent = rho_f.toFixed(3);
    document.getElementById('v-value').textContent = V_f_total.toFixed(2) + " мл";
    document.getElementById('m-value').textContent = m_f_total.toFixed(2) + " г";
    document.getElementById('wax-value').textContent = m_w_total.toFixed(2) + " г";
  }
};


// const overlay = document.getElementById('unauthorizedOverlay');

// onAuthStateChanged(auth, (user) => {
//   userLoggedIn = !!user;

//   if (userLoggedIn) {
//     overlay.style.display = "none";
//     document.body.classList.remove("blurred");
//   } else {
//     overlay.style.display = "block";
//     document.body.classList.add("blurred");
//   }
// });
