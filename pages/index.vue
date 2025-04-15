<template>
  <div class="login-container">
    <h1>Вход в систему</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Логин</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Войти</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "~/composables/useUser";

const username = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();
const { isAuthenticated, login, restoreSession } = useUser();

onMounted(() => {
  restoreSession();
  if (isAuthenticated.value) {
    router.push("/account");
  }
});

async function handleLogin() {
  const success = await login(username.value, password.value);
  if (success) {
    error.value = "";
    router.push("/account");
  } else {
    error.value = "Введены неверные данные авторизации. Попробуйте ещё раз";
  }
}
</script>

<style lang="scss" scoped>
:global(html, body) {
  background-color: #000000 !important;
  margin: 0;
  padding: 0;
  height: 100%;
  color: #cbd5e1;
  font-family: "Helvetica Neue";
}

.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px 25px;
  background-color: #000000;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
  color: #cbd5e1;
  transition: background-color 0.3s ease, color 0.3s ease;

  h1 {
    text-align: center;
    margin-bottom: 25px;
    color: #a3bffa;
    text-shadow: 0 0 5px #7289da;
    font-weight: 700;
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      color: #a3bffa;
      text-shadow: 0 0 3px #7289da;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 6px;
      border: 1px solid #7289da;
      background-color: #40444b;
      color: #cbd5e1;
      font-size: 1rem;
      transition: border-color 0.3s ease, background-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #a3bffa;
        background-color: #2c2f33;
        box-shadow: 0 0 8px #7289da;
      }
    }
  }

  button {
    width: 100%;
    padding: 12px;
    background-color: #5865f2;
    border: none;
    color: white;
    font-weight: 700;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 3px 8px rgba(88, 101, 242, 0.7);
    transition: background-color 0.3s ease, box-shadow 0.3s ease,
      transform 0.3s ease;

    &:hover {
      background-color: #4752c4;
      box-shadow: 0 6px 15px rgba(71, 82, 196, 0.9);
      transform: scale(1.05);
    }
  }

  .error-message {
    margin-top: 15px;
    color: #ff6b6b;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 0 3px #ff6b6b;
  }
}
</style>
