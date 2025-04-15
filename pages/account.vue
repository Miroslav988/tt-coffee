<template>
  <div class="account-container">
    <h1>Страница товаров</h1>
    <button @click="handleLogout" class="logout-button">Выход</button>

    <div class="filters">
      <div class="filter-group">
        <label for="searchName">Поиск по названию:</label>
        <input
          id="searchName"
          type="text"
          v-model="searchText"
          placeholder="Введите название"
        />
      </div>
      <div class="filter-group">
        <label>Наличие:</label>
        <div>
          <label>
            <input type="radio" value="Доступно" v-model="availabilityFilter" />
            Доступно
          </label>
          <label>
            <input
              type="radio"
              value="Нет в наличии"
              v-model="availabilityFilter"
            />
            Нет в наличии
          </label>
          <label>
            <input type="radio" value="Все" v-model="availabilityFilter" />
            Все
          </label>
        </div>
      </div>
      <div class="filter-group">
        <label>Сортировка по дате:</label>
        <button @click="toggleSortOrder">
          {{ sortAscending ? "По возрастанию" : "По убыванию" }}
        </button>
      </div>
    </div>

    <h2>Продукты</h2>
    <table v-if="filteredProducts.length">
      <thead>
        <tr>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>Статус</th>
          <th>Дата создания</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.status }}</td>
          <td>{{ formatDate(product.date_created) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "~/composables/useUser";

const router = useRouter();
const { isAuthenticated, logout, restoreSession, getAuthHeaders } = useUser();

const productList = ref([]);
const availabilityFilter = ref("Все");
const searchText = ref("");
const sortAscending = ref(true);

onMounted(async () => {
  restoreSession();
  if (!isAuthenticated.value) {
    router.push("/");
  } else {
    await fetchProductData();
  }
});

async function fetchProductData() {
  try {
    const response = await fetch("http://localhost:8080/api/data/tableData", {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных продуктов");
    }
    const data = await response.json();
    productList.value = data;
  } catch (error) {
    console.error(error);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function handleLogout() {
  logout();
  router.push("/");
}

function toggleSortOrder() {
  sortAscending.value = !sortAscending.value;
}

const filteredProducts = computed(() => {
  let filtered = productList.value;

  if (availabilityFilter.value && availabilityFilter.value !== "Все") {
    filtered = filtered.filter(
      (product) => product.status === availabilityFilter.value
    );
  }

  if (searchText.value.trim() !== "") {
    const searchLower = searchText.value.toLowerCase();
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    );
  }

  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.date_created);
    const dateB = new Date(b.date_created);
    return sortAscending.value ? dateA - dateB : dateB - dateA;
  });

  return filtered;
});
</script>

<style lang="scss" scoped>
.account-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #2c2f33;
  color: #cbd5e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease, color 0.3s ease;

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #a3bffa;
    text-shadow: 0 0 5px #7289da;
  }

  .logout-button {
    display: block;
    margin: 0 0 20px auto;
    padding: 8px 16px;
    background-color: #ff6b6b;
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.6);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      background-color: #ff4c4c;
      box-shadow: 0 4px 12px rgba(255, 76, 76, 0.8);
      transform: scale(1.05);
    }
  }

  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .filter-group {
      display: flex;
      flex-direction: column;

      label {
        font-weight: bold;
        margin-bottom: 5px;
        color: #a3bffa;
        text-shadow: 0 0 3px #7289da;
      }

      input[type="text"] {
        padding: 6px;
        border-radius: 6px;
        border: 1px solid #7289da;
        background-color: #40444b;
        color: #cbd5e1;
        transition: border-color 0.3s ease, background-color 0.3s ease;

        &:focus {
          outline: none;
          border-color: #a3bffa;
          background-color: #2c2f33;
          box-shadow: 0 0 8px #7289da;
        }
      }

      div {
        display: flex;
        gap: 12px;

        label {
          font-weight: normal;
          cursor: pointer;
          color: #cbd5e1;
          transition: color 0.3s ease;

          input {
            margin-right: 6px;
            cursor: pointer;
          }

          &:hover {
            color: #a3bffa;
          }
        }
      }

      button {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #7289da;
        background-color: #40444b;
        color: #cbd5e1;
        cursor: pointer;
        transition: background-color 0.3s ease, box-shadow 0.3s ease,
          transform 0.3s ease;

        &:hover {
          background-color: #5865f2;
          box-shadow: 0 0 10px #5865f2;
          transform: scale(1.05);
          color: white;
        }
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #23272a;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
    transition: box-shadow 0.3s ease;

    th,
    td {
      border: none;
      padding: 12px 16px;
      text-align: left;
      color: #cbd5e1;
      transition: background-color 0.3s ease;
    }

    th {
      background-color: #2c2f33;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a3bffa;
      text-shadow: 0 0 3px #7289da;
    }

    tbody tr {
      border-bottom: 1px solid #40444b;
      transition: background-color 0.3s ease, transform 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #5865f2;
        color: white;
        transform: scale(1.02);
        box-shadow: 0 0 8px #5865f2;
      }
    }
  }
}
</style>
