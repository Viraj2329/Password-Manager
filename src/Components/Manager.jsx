import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();

  const [form, setFrom] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPassword = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    console.log(passwords);
    setPasswordArray(passwords);
  };
  useEffect(() => {
    getPassword()
  }, []);

  const copyText = (text) => {
    toast("Text Copied", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("/eye-crossed.png")) {
      ref.current.src = "/eye.png";
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
      ref.current.src = "/eye-crossed.png";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      
      //If any ID exists in the db, delete it...
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id: form.id}),
      });
      setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: uuidv4() })
      });
      // localStorage.getItem(
      //   "passwords",
      //   JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
      // );
      // console.log(...passwordArray, form);
      setFrom({ site: "", username: "", password: "" });
      toast("Password saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("Enter password atlist 4 character!");
    }
  };

  const deletePassword = async (id) => {
    console.log("deleted", id);
    let c = confirm("Do you really want to delete this password!");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      // localStorage.getItem(
      //   "passwords",
      //   JSON.stringify(passwordArray.filter((item) => item.id !== id))
      // );
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id}),
      });
      toast("Password deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    console.log("edited", id);
    setFrom({...passwordArray.filter((item) => item.id === id)[0],id: id});
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    
    setFrom({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-green-100 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      <div className="p-2 md:p-0 md:mycontainer">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-800 text-lg text-center">
          Your own password manager
        </p>
        <div className=" flex flex-col p-4 text-black gap-3 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            type="text"
            name="site"
            id="site"
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full px-4 py-1"
          />
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <input
              value={form.username}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full px-4 py-1"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full px-4 py-1"
              />
              <span
                className="absolute right-[1px] top-[1.5px] cursor-pointer"
                onClick={showPassword}
              >
                <img ref={ref} src="/eye.png" className="p-1" width={30} />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 
          rounded-full px-8 py-2 w-fit mt-10 border-2 border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Add Password
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your passwords</h2>
          {passwordArray.length === 0 && <div>No password to save</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Website URL</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-200">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" py-2 border border-white text-center w-32">
                        <a href={item.site} target="_blank">
                          {item.site}
                        </a>
                        <button
                          className="ml-4"
                          onClick={() => {
                            copyText(item.site);
                          }}
                        >
                          <i className="fa-solid fa-copy"></i>
                        </button>
                      </td>
                      <td className="py-2 border border-white text-center w-32">
                        {item.username}
                        <button
                          className="ml-4"
                          onClick={() => {
                            copyText(item.username);
                          }}
                        >
                          <i className="fa-solid fa-copy"></i>
                        </button>
                      </td>
                      <td
                        className=" py-2 border border-white text-center w-32"
                        onClick={() => {
                          copyText(item.password);
                        }}
                      >
                        {item.password}
                        <button className="ml-4">
                          <i className="fa-solid fa-copy"></i>
                        </button>
                      </td>
                      <td className=" py-2 border border-white text-center w-32">
                        <button
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          className="ml-6"
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
