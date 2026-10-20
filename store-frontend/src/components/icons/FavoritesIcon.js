
function FavoritesIcon({ active = false, size = 24 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M20.84 4.61C20.35 4.12 19.77 3.73 19.13 3.47C18.49 3.21 17.8 3.08 17.11 3.08C16.42 3.08 15.73 3.21 15.09 3.47C14.45 3.73 13.87 4.12 13.38 4.61L12 5.99L10.62 4.61C9.63 3.62 8.29 3.07 6.89 3.07C5.49 3.07 4.15 3.62 3.16 4.61C2.17 5.6 1.62 6.94 1.62 8.34C1.62 9.74 2.17 11.08 3.16 12.07L4.54 13.45L12 20.91L19.46 13.45L20.84 12.07C21.83 11.08 22.38 9.74 22.38 8.34C22.38 6.94 21.83 5.6 20.84 4.61Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default FavoritesIcon;
