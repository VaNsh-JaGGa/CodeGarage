export const Validationform = (name , value) =>{

    let errors= {};
    if(name == "Email"){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            errors.Email = true;
        } else {
            errors.Email = false;
        }
    }

    if (name === "Password") {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(value)) {
            errors.Password = true;
        } else {
            errors.Password = false;
        }
    }

    if(name === "Name"){
        const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
        if (value.length === 0 || !regex.test(value) || value.endsWith(" ")) {
            errors.Name = true;
        } else {
            errors.Name = false;
        }
    }

    console.log(errors);
    return errors;
}
