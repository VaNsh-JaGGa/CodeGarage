
const ResetBtn = (props) => {
    return (
        <>
            <button
                type="button"
                onClick={props.onReset}
                className="w-full md:w-[140px] h-[45px] border border-[#4790A1] text-[#4790A1] rounded-sm"
            >
                Reset
            </button>
        </>
    )
}

export default ResetBtn
