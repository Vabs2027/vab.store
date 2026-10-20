

function ProfileIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
        >
            <circle
                cx="12"
                cy="8"
                r="3.5"
                stroke="currentColor"
                strokeWidth="2"
            />

            <path
                d="M5 20C5.8 16.5 8.2 14.5 12 14.5C15.8 14.5 18.2 16.5 19 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default ProfileIcon;