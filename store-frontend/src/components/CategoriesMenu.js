
// CategoriesMenu — отдельный компонент для меню категорий.
// Здесь показываем:
// 1. "Всі товари"
// 2. список категорий из Django
// 3. выбранную категорию
// При нажатии передаём выбранную категорию обратно в Catalog.

//CategoriesMenu.js → показывает категории и сообщает Catalog, что выбрали
//category => category.parent === null - оставь только те категории у кот нет родителя

//получаем подкатегории categotry => category.parent === selectedMainCategory

//categoryPath — это массив, в котором мы будем хранить путь пользователя по категориям
//const currentCategories = categories.filter(category => category.parent === currentCategoryId);
                                                //означает: «Покажи мне категории, у которых parent равен текущей категории».

//categoryPath.length === 0 — мы ещё не вошли ни в одну категорию?
//onClick={() => setCategoryPath([...categoryPath, category.id])} - Возьми текущий путь и добавь в его конец ID нажатой категории

//mainCategories.map  Это список категорий самого верхнего уровня.

//Сбросить выбранную категорию: setSelectedCategory(null) - в кнопке button - Всі товари
//Вернуть categoryPath в самое начало: setCategoryPath([])

import { useState } from 'react';

import BackIcon from './icons/BackIcon';

import './CategoriesMenu.css';

function CategoriesMenu({
    categories,
    selectedCategory,
    setSelectedCategory
}) {
    const [categoryPath, setCategoryPath] = useState([]);/*запоминаем путь пользователя*/

    /*получаем главные категории*/
    /*category.parent === null — у неё нет родителя, значит, это главная категория.*/
    const mainCategories = categories.filter(
        category => category.parent === null
    );

    /*текущая выбраная категория, тернарный операторт тут , если массив categoryPath пустой, вернуть null;
                                                            иначе взять последний ID в массиве.*/
    const currentCategoryId =
        categoryPath.length === 0
            ? null
            : categoryPath[categoryPath.length - 1];

    /*получам ПОДкатегории*/
    const currentCategories = categories.filter(
        category => category.parent === currentCategoryId
    );

    /*что происходит при нажатии
    проверяем, есть ли у категории дочерние элементы через const haschildren = categories.some(....
    .some() возвращает true, если хотя бы один элемент удовлетворяет условию.
    Три точки ... копируют элементы старого массива, а category.id добавляет новый.
    */
    const handleCategoryClick = (category) => {
        const hasChildren = categories.some(
            item => item.parent === category.id
        );

        if (hasChildren) {
            setCategoryPath([...categoryPath, category.id]);
        } else {
            setSelectedCategory(category.id);
        }
    };

    /*возвращение НАЗАД*/
    const handleBack = () => {
        setCategoryPath(categoryPath.slice(0, -1));
    };

    /*сбрасыва выбор то есть ВСЕ ТОВАРЫ
        1. setSelectedCategory(null) — сообщаем каталогу, что фильтр по конкретной категории не выбран.
        2. setCategoryPath([]) — возвращаем меню к началу.
            То есть пользователь снова может видеть все товары и список главных категорий.
    */
    const handleAllProducts = () => {
        setSelectedCategory(null);
        setCategoryPath([]);
    };

    return (
        <div className="categories">

            <div className="categories-main">

                <div className="all-products">
                    <button onClick={handleAllProducts}>
                        Всі товари
                    </button>
                </div>

                {mainCategories.map((category) => (
                    <button
                        key={category.id}
                        className={
                            categoryPath[0] === category.id
                                ? 'active-category'
                                : ''
                        }
                        onClick={() => {
                            setCategoryPath([category.id]);
                        }}
                    >
                        {category.name}
                    </button>
                ))}

            </div>

            {/* Подкатегории — справа на компьютере */}
            {categoryPath.length > 0 && (
                <div className="categories-submenu">

                    <button
                        className="back-category-btn"
                        onClick={handleBack}
                    >
                        <BackIcon />
                        Назад
                    </button>

                    {currentCategories.map((category) => (
                        <button
                            key={category.id}
                            className={
                                selectedCategory === category.id
                                    ? 'active-category'
                                    : ''
                            }
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
}

export default CategoriesMenu;
