//тут принцип тот же
//CartIcon.js
    //↓
//CartIcon
   // ↓
//<svg>
  //  ↓
//export default CartIcon


function CartIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 4H5L7.5 16H19L21 8H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle
                cx="9"
                cy="20"
                r="1.5"
                fill="currentColor"
            />

            <circle
                cx="17"
                cy="20"
                r="1.5"
                fill="currentColor"
            />
        </svg>
    );
}

export default CartIcon;