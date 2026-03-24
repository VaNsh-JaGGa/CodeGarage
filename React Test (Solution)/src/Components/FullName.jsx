const FullName = (props) => {
    return (
        <div className="relative h-[52px] mb-[20px]">

            <label
                htmlFor="full"
                className="absolute top-[-25px] text-sm font-medium"
            >
                Full Name
            </label>

            <input
                type="text"
                id="full"
                name="fullNameValue"
                placeholder=" "
                value={props.formData.fullNameValue}
                onChange={props.onChangeHandler}
                className={`peer w-full h-[40px] border-2 rounded-md pl-3 outline-none transition
                ${props.errors.fullNameValue
                ? "border-red-500 focus:border-red-500"
                : "border-[#A5B6CD]  focus:border-blue-500"
                }`}
            />

            <label
                htmlFor="full"
                className={`absolute left-3 px-1 transition-all pointer-events-none
                ${props.errors.fullNameValue ? "text-red-500" : "text-gray-500"}
                floating-label
                ${props.darkMode ? "bg-gray-700 text-white" : "bg-white"}
                `}
            >
                Full Name <span className="text-red-500">*</span>
            </label>

            {props.errors.fullNameValue && (
                <span className="text-red-500 text-xs mt-1">
                    Full Name is Wrong
                </span>
            )}

        </div>
    )
}

export default FullName