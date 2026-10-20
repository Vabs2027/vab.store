import { Navigate } from 'react-router-dom';


//Компонент получает два props:

//isAuthenticated — авторизован пользователь или нет;
//children — то, что мы положим внутрь ProtectedRoute
    //children — это содержимое, которое находится между открывающим и закрывающим тегом компонента.
        //<ProtectedRoute isAuthenticated={isAuthenticated}> из App - в Cart/
                //<Cart />
        //</ProtectedRoute>
        //Здесь:
        //children = <Cart />

//return <Navigate to='/login' replace />; - если пользователь не авторизован — React Router переводит его на /login.
//return children - если авторизован — покажи то, что было внутри ProtectedRoute.
function ProtectedRoute({ isAuthenticated, children }) {
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return children
}

export default ProtectedRoute;