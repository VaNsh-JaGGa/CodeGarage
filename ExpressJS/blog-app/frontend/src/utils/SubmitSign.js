export const SubmitSign = (form) => {

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

    const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
    if (form.Name.length === 0 || !regex.test(form.Name) || form.Name.endsWith(" ")) {
        errors.Name = true;
    }
    if (form.Name === "") {
        errors.Name = true;
    }

    console.log(errors);
    return errors;
}