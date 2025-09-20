import validator from "validator"

export const validateRegisterInput = ({ name, email, password }) => {
    if (!name || !email || !password) return "All fields are required";
    if (!validator.isEmail(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return null;
};


export const validateLoginInput = ({ email, password }) => {
    if (!email || !password) return "Email and password are required";
    if (!validator.isEmail(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
}