import axios from "axios";


//:3000 → React
//:8000 → Django API
//порт определяет, к какой программе на компьютере мы обращаемся:

//для ПК + команда в Джанго runserver
//💻 ПК
//│
//├── React → http://localhost:3000
//│
//└── Django → http://127.0.0.1:8000

//Для твоего vab.store запомни простое правило: когда тестируешь сайт на телефоне, компьютер и телефон должны быть в одной Wi-Fi-сети,
                                                //а в ALLOWED_HOSTS должен быть разрешён актуальный IP компьютера.

//приложение само определяло адрес компьютера.
const API_BASE =
    `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;

//для проверки на моб телефоне - адрес ПК (ipconfig в cmd) доллжен совпалать с адресом ввода на телеф + ПОРТ 3000/8000
// + команда для запуска Джанго для телеф - python manage.py runserver 0.0.0.0:8000

//const API_BASE = "http://192.168.0.102:8000/api/v1";


//созд собственный экземпляр axios

const axiosInstance = axios.create({
    baseURL: API_BASE,
});

// interceptor для автоматической вставки токена

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Token ${token}`;
    }
    return config
});

export default axiosInstance;