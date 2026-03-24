const BirthDate = (props) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const selectedDay = Number(props.formData.day);
  const selectedMonth = Number(props.formData.month);
  const selectedYear = Number(props.formData.year);

  const daysInMonth = new Date(
    selectedYear || currentYear,
    selectedMonth || 1,
    0,
  ).getDate();

  return (
    <div className="flex flex-col gap-1 mb-[20px]">
      <label className="text-sm font-medium">Birthdate</label>

      <div className="flex gap-3">
        <select
          name="day"
          value={props.formData.day}
          onChange={props.onChangeHandler}
          className={`${
            props.errors.day
              ? "border-red-500 focus:border-red-500"
              : "border-[#A5B6CD] focus:border-blue-500"
          } 
                    w-1/3 h-[40px] border-2 rounded-md px-2`}
        >
          <option value="">Day *</option>

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;

            const isFutureDate =
              new Date(
                selectedYear || currentYear,
                (selectedMonth || 1) - 1,
                day,
              ) > today;

            return (
              <option key={i} value={day} disabled={isFutureDate}>
                {day}
              </option>
            );
          })}
        </select>

        <select
          name="month"
          value={props.formData.month}
          onChange={props.onChangeHandler}
          className={`${
            props.errors.month
              ? "border-red-500 focus:border-red-500"
              : "border-[#A5B6CD] focus:border-blue-500"
          } 
                    w-1/3 h-[40px] border-2 rounded-md px-2`}
        >
          <option value="">Month *</option>

          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m, i) => {
            const monthValue = i + 1;

            const isFutureMonth =
              selectedYear === currentYear && monthValue > currentMonth;

            return (
              <option key={i} value={monthValue} disabled={isFutureMonth}>
                {m}
              </option>
            );
          })}
        </select>

        <select
          name="year"
          value={props.formData.year}
          onChange={props.onChangeHandler}
          className={`${
            props.errors.year
              ? "border-red-500 focus:border-red-500"
              : "border-[#A5B6CD]  focus:border-blue-500"
          } 
                    w-1/3 h-[40px] border-2 rounded-md px-2`}
        >
          <option value="">Year *</option>

          {[...Array(50)].map((_, i) => {
            const year = currentYear - i;

            return (
              <option
                key={i}
                value={year}
                disabled={
                  year > currentYear ||
                  (year === currentYear &&
                    props.formData.month >= currentMonth &&
                    props.formData.day > currentDay)
                }
              >
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default BirthDate;
