const Contact = (props) => {
  return (
    <div className="relative h-[50px]">

      {/* Top Label */}
      <label
        htmlFor="cn"
        className="absolute top-[-25px] text-sm font-medium"
      >
        Contact Number
      </label>

      {/* Input */}
      <input
        type="tel"
        id="cn"
        name="contactNumberValue"
        placeholder=" "
        value={props.formData.contactNumberValue}
        onChange={props.onChangeHandler}
        className={`peer w-full h-[40px] border-2 rounded-md pl-3 outline-none transition
        ${props.errors.contactNumberValue
            ? "border-red-500 focus:border-red-500"
            : "border-[#A5B6CD]  focus:border-blue-500"
          }`}
      />

      {/* Floating Label */}
      <label
        htmlFor="cn"
        className={`absolute left-3 px-1 transition-all pointer-events-none
        ${props.errors.contactNumberValue
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
        Contact Number <span className="text-red-500">*</span>
      </label>

      {/* Error */}
      {props.errors.contactNumberValue && (
        <span className="text-red-500 text-xs mt-1">
          Enter a valid Number
        </span>
      )}

    </div>
  )
}

export default Contact