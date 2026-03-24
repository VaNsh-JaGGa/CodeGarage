import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const Password = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;
    const isTooShort = props.formData.passwordValue.length < 8;
    const isInvalidPattern = !passwordValidation.test(props.formData.passwordValue);

    return (
        <div className="relative h-[50px] mb-[20px]">

            <label
                htmlFor="pp"
                className="absolute top-[-25px] text-sm font-medium "
            >
                Password
            </label>

            <input
                type={showPassword ? "text" : "password"}
                id="pp"
                name="passwordValue"
                placeholder=" "
                autoComplete="new-password"
                value={props.formData.passwordValue}
                onChange={props.onChangeHandler}
                className={`peer w-full h-[40px] border-2 rounded-md pl-3 pr-10 outline-none transition
                ${props.errors.passwordValue
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#A5B6CD] focus:border-blue-500"
                    }
                    
                    
                    `}
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>

            <label
                htmlFor="pp"
                className={`absolute left-3 px-1 transition-all pointer-events-none 
                ${props.errors.passwordValue
                ? "text-red-500"
                : "text-gray-500"}
    
                top-[10px] text-base
                peer-placeholder-shown:top-[10px]
                peer-placeholder-shown:text-base
    
                peer-focus:top-[-8px]
                peer-focus:text-xs
    
                peer-not-placeholder-shown:top-[-8px]
                peer-not-placeholder-shown:text-xs
                ${props.darkMode ? "bg-gray-700 text-white" : "bg-white"}
                `}
            >
                Password <span className="text-red-500">*</span>
            </label>

            {props.errors.passwordValue && (
                isTooShort ? (
                    <span className="text-red-500 text-xs mt-1">
                        Minimum 8 characters required
                    </span>
                ) : isInvalidPattern ? (
                    <span className="text-red-500 text-xs mt-1">
                        Include uppercase, lowercase, and number
                    </span>
                ) : null
            )}

        </div>
    );
};

export default Password;