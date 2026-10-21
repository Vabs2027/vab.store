
function DeliveryTruck() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Кузов грузовика */}
            <path d="M1.5 5.5h13v12h-13z" />

            {/* Кабина и лобовое стекло */}
            <path d="M14.5 10h4l4 4v3.5h-8z" />
            <path d="M17 10v4h5.5" />

            {/* Колёса */}
            <circle cx="5.5" cy="18" r="2" />
            <circle cx="18.5" cy="18" r="2" />
        </svg>
    );
}

export default DeliveryTruck;
