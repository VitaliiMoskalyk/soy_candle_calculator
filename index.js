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

// ===== Инициализация =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== Основной код =====
document.addEventListener("DOMContentLoaded", async () => {
  // === Загружаем header ===
  try {
    const res = await fetch("header.html");
    document.getElementById("header").innerHTML = await res.text();
  } catch (err) {
    console.warn("Не удалось загрузить header:", err);
  }

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
  });

  // === Выход ===
  logoutBtn?.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Ошибка выхода: " + err.message);
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

  function getCalculatedData() {
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

      document.getElementById("jar-value").textContent = `${V_c} мл * ${jarCount} шт`;
      document.getElementById("intense-value").textContent = `${(f * 100).toFixed(2)} %`;
      document.getElementById("s-value").textContent = rho_f.toFixed(3);
      document.getElementById("v-value").textContent = V_f_total.toFixed(2) + " мл";
      document.getElementById("m-value").textContent = m_f_total.toFixed(2) + " г";
      document.getElementById("wax-value").textContent = m_w_total.toFixed(2) + " г";
    }
  }

  // === Кнопка "Розрахувати" ===
  calculate?.addEventListener("click", () => {
    if (!validateForm()) return;

    if (!userLoggedIn) {
      console.dir(authToast)
      authToast._element.innerHTML='<div class="d-flex"><div class="toast-body">       Для виконання розрахунку потрібно увійти в систему.</div> <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>  </div>';
      authToast?.show()
    } else {
      getCalculatedData();
      const modalEl = document.getElementById("exampleModal");
      new bootstrap.Modal(modalEl).show();
    }
  });
});
