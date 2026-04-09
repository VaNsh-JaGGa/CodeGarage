export const SubmitUtils = (form) => {

    // Email Checking
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.Email)) {
        errors.Email = true;
    }
    if (form.Email == "") {
        errors.Email = true;
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.Password)) {
        errors.Password = true;
    }
    if (form.Password == "") {
        errors.Password = true;
    }

    console.log(errors);
    return errors;
}