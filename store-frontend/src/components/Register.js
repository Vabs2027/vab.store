import { useState } from 'react';
import axiosInstance from '../services/axiosInstance';

import { useNavigate } from 'react-router-dom';

import './Register.css'


// ||-если Django прислал конкретную ошибку username — покажи её, иначе покажи наше запасное сообщение.
                                                            //error — ошибка от Axios.
                                                            //response — ответ сервера.
                                                            //data — данные ошибки.
                                                            //username — ошибка именно поля логина.
                                                            //[0] — берём первое сообщение из массива.
                                                            //setErorMessage - меняет состояние.
                                                            //{errorMessage && <p>{errorMessage}</p>} берёт состояние и показывает его на экране.

//состояние
function Register() {
    const [username, setUsername] = useState('');//setUsername - функция, которую React дал нам для изменения username
                                                //username - текущее состояние, то есть значение логина.
                                                //useState('') — создаёт состояние с начальным значением '' (пустая строка).
                                        //username — что сейчас хранится
                                        //setUsername — как мы это меняем

    const [password, setPassword] = useState('');

    //состояния обработки ошибок РЕГИСТРАЦИИ
    const [errorMessage, setErrorMessage] = useState('');//сообщение об ошибке
    const [successMessage, setSuccessMessage] = useState('');//сообщение об успешной регистрации.

    // navigate — функция для программного перехода на другую страницу через React Router.
    //И важный момент: navigate('/login') не отправляет HTTP-запрос. Он просто говорит React Router: «перейди на маршрут /login».
    const navigate = useNavigate();


//обработчик отправки формы. Слово handle буквально означает «обработать».
//await axios.post POST-запросом отправь данные вот на этот адрес Django.
const handleRegister = async(e) => {
    e.preventDefault();

    try {
        const res = await axiosInstance.post(
            '/auth/register/',
            {
                username:username,
                password:password
            }
       );

        console.log('Ответ сервера:', res.data);

        setErrorMessage('');
        setSuccessMessage('Користувача успіщно зареєстрованно')

        setUsername('');//очистка полей после успешной регистрации
        setPassword('');

        navigate('/login');

        }catch (error) {
            console.log('Ошибка сервера:', error.response?.data);

            setSuccessMessage('');
            setErrorMessage(
                error.response?.data?.username?.[0] ||
                error.response?.data?.password?.[0] ||
                error.response?.data?.non_field_errors?.[0] ||
                'Не вдалося зареєструвати користувача'
            );
        }
    }

    return (
        <div className='register-page'>
            <div className='register-card'>
                <h2>Регістрація</h2>

            <form onSubmit={handleRegister}>
                <input
                    type='text'
                    placeholder='Логін'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type='password'
                    placeholder='Пароль'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type='submit'>
                    Зареєструватися
                </button>

            </form>

            {successMessage && (
                <p>{successMessage}</p>
            )}

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

        </div>
    </div>
    );
}

export default Register;