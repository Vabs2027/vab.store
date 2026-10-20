import axiosInstance from "../services/axiosInstance";
import {useState} from 'react';

import {useNavigate} from 'react-router-dom';

import './Login.css'

//Login.js — компонент интерфейса, Он отвечает за то, что пользователь видит:
//function Login() {
    // состояния
    // обработчик
    // логика

    //return (
        // форма
        // input
        // button


//function login - функц API запроса, API-функция отвечает за общение с Django
//export function login(username, password) {
  //  const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/token/", {
    //    username,
      //  password
   // });

    //localStorage.setItem("token", res.data.token);
//}

//e.target.value — это то, что сейчас находится в input.
//const handleLogin - подкл кнопку Увійти к функции
//e.preventDefault(); - «Не выполняй стандартное действие браузера, я сам обработаю форму через React».
//<form onSubmit={handleLogin}> - «Когда отправляется вся форма, вызови handleLogin», То есть у нас один обработчик формы, а не отдельный обработчик для каждого поля.

//function login - компонент UI
//setIsAuthenticated - передаем из App.js из element={<Login setIsAuthenticated={setIsAuthenticated}/>}

//для работы на ПК: 'http://127.0.0.1:8000/api/v1/auth/token/',
//для работы на телеф: 'http://192.168.0.102:8000/api/v1/auth/token/',
//{/*navigate - функция кот выполняет переход на какйто то адрес*/}

function Login({ setIsAuthenticated }) {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post(
                '/auth/token/',
                {
                    username,
                    password
                }
            );
            console.log('Ответ сервера:', res.data)

            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);

            navigate('/catalog');

        }catch (error) {
           console.log('Ошибка сервера:', error.response?.data);
        }
    };

    return (
        <div className='login-page'>
            <div className='login-card'>
                <h2>Вхід</h2>

        <form onSubmit={handleLogin}>

            <input
                type="text"
                placeholder="Логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}
            >
            Увійти
            </button>

        </form>
        </div>
     </div>
    );
}

export default Login;