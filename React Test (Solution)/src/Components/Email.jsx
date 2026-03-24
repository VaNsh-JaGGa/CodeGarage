const Email = (props) => {
    return (
        <div className="relative h-[50px] mb-[20px]">

            <label
                htmlFor="ead"
                className="absolute top-[-25px] text-sm font-medium"
            >
                Email
            </label>

            <input
                type="email"
                id="ead"
                name="emailValue"
                placeholder=" "
                value={props.formData.emailValue}
                onChange={props.onChangeHandler}
                className={`peer w-full h-[40px] border-2 rounded-md pl-3 outline-none transition
                ${props.errors.emailValue
                        ? "border-red-500 "
                        : "border-[#A5B6CD]"
                    }`}
            />

            <label
                htmlFor="ead"
                className={`absolute left-3 px-1 transition-all pointer-events-none
                ${props.errors.emailValue
                ? "text-red-500"
                : "text-gray-500"}
    
                floating-label
                ${props.darkMode ? "bg-gray-700 text-white" : "bg-white"}
                `}
            >
                Email Address <span className="text-red-500">*</span>
            </label>

            {/* Error */}
            {props.errors.emailValue && (
                <span className="text-red-500 text-xs mt-1">
                    Invalid email address
                </span>
            )}

        </div>
    )
}

export default Email