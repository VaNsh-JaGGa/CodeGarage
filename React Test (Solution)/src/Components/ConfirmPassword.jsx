const ConfirmPassword = (props) => {
    return (
        <div className="relative">

            <label
                htmlFor="cpp"
                className="absolute top-[-25px] text-sm font-medium"
            >
                Confirm Password
            </label>

            <input
                type="password"
                id="cpp"
                name="confirmPasswordValue"
                placeholder=" "
                value={props.formData.confirmPasswordValue}
                onChange={props.onChangeHandler}
                className={`peer w-full h-[40px] border-2 rounded-md pl-3 outline-none transition
                ${props.errors.confirmPasswordValue
                        ? "border-red-500 "
                        : "border-[#A5B6CD]"
                    }`}
            />

            <label
                htmlFor="cpp"
                className={`absolute left-3 px-1 transition-all pointer-events-none
                ${props.errors.confirmPasswordValue
                ? "text-red-500"
                : "text-gray-500"}
    
                floating-label
                ${props.darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            >
                Confirm Password <span className="text-red-500">*</span>
            </label>

            {props.errors.confirmPasswordValue && (
                <span className="text-red-500 text-xs mt-1">
                    Passwords do not match
                </span>
            )}

        </div>
    )
}

export default ConfirmPassword