//тут мы сделали Компонент который получает 2 пропса search, setSearch
//То есть Search.jsx не хранит своё состояние. Он использует состояние из App.js.

import './Search.css'

function Search({ search, setSearch }) {

    return (

        <div className="search-container">

            <input
                type="text"
                placeholder="🔍 Пошук товару..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
                <button
                    className="clear-search-btn"
                    onClick={() => setSearch('')}
                >
                    Очистити
                </button>
            )}

        </div>
    );
}

export default Search;