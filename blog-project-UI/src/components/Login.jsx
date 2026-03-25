import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {Validationform} from "../utils/Validationform"

const Login = () => {

  const [Error, SetError] = useState({});
  const [form, setform] = useState(
    {
      Email: "",
      Password: ""
    }
  );

  const HandleOnChange = (e) => {
    let newErrors = {};
    let name = e.target.name;
    let value = e.target.value;

    setform((prev) => {
      return { ...prev, [name]: value }
    });
    console.log(name, value);
    newErrors = Validationform(name, value, {
      ...form,
      [name]: value,
    })

    

  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">

      <form
        className="flex flex-col gap-4 bg-white p-8 rounded-lg w-80"
      >

        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Your Email"
            name="Email"
            className="border p-2 rounded"
            value={form.Email}
            onChange={(e) => HandleOnChange(e)}
          />
        </div>

        <div className="flex flex-col">
          <label>Password</label>
          <input
            placeholder="Enter Your Password"
            name="Password"
            type="password"
            className="border p-2 rounded"
            value={form.Password}
            onChange={(e) => HandleOnChange(e)}
          />
        </div>


        <button className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;