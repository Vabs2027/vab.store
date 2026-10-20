

function SaleIcon() {
    return (
        <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Красный ценник */}
            <path
                d="M20 13L13 20L4 11V4H11L20 13Z"
                fill="#e53935"
                stroke="#e53935"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />

            {/* Отверстие в ценнике */}
            <circle
                cx="8"
                cy="8"
                r="1.2"
                fill="white"
            />

            {/* Знак процента */}
            <path
                d="M10 15L15 10"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            <circle
                cx="10.5"
                cy="10.5"
                r="1"
                fill="white"
            />

            <circle
                cx="14.5"
                cy="14.5"
                r="1"
                fill="white"
            />
        </svg>
    );
}

export default SaleIcon;

