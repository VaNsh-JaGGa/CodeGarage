
const Submit = (props) => {
    return (
        <>
            <button
                onClick={props.onSubmit}
                className="w-full md:w-[140px] h-[45px] bg-[#127C95] text-white rounded-sm"
            >
                Submit
            </button>
        </>
    )
}

export default Submit
