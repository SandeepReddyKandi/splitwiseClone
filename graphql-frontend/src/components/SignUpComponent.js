import {useEffect, useState} from "react";
import letter from "../letter.webp";
import "./signup.css";
import {Link, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import NavigationBarComponent from "./NavigationBarComponent";
import LoadingComponent from "./LoadingComponent";
import {useMutation} from "@apollo/client";
import {SIGNUP_USER} from "../graphql/Mutations";

const PhoneRegex = new RegExp('^[(]?\\d{3}[)]?[(\\s)?.-]\\d{3}[\\s.-]\\d{4}$')

const SignUpComponent = () => {
  const [state, setState] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
  });

  const history = useHistory();
  let [signupUser, {loading}] = useMutation(SIGNUP_USER)

  const {user} = useSelector(state => {
    return {
      user: state.userState.user,
    }
  });

  useEffect(() => {
    if (user && user.name) {
      history.push('/user/home');
    }
  }, [])

  const signUpUser = (e) => {
    e.preventDefault();
    const phoneNumberValid = PhoneRegex.test(state.phone);
    if (!(state.name && state.email && state.phone && state.password)) {
      toast.error('Please fill in all the fields!');
      return;
    } else if (!phoneNumberValid) {
      toast.error('Please add correct phone number, for example: 111-222-3333!');
      return;
    }

    signupUser({
      variables: {
        userBody: state
      }
    }).then(({data}) => {
      if (data.signUpUser.success) {
        toast.success("You have successfully signed in !");
        history.push('/login');
      } else {
        toast.error(data.signUpUser.message);
      }
    }).catch((e) => {
      console.log(e)
      toast.error("Something went wrong, Please try again!");
    });
  }

  const handleChange = (e) => {
    const [id, value] = [e.target.id, e.target.value];
    if (id === 'phone' && value && /^[A-Za-z]+$/.test(value.split('').reverse()[0])) {
      toast.error(`Please add numeric values only`);
      return;
    }
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  }
  return (
      <>
        <NavigationBarComponent/>
        <div className="container box1">
          <div className="signUpArea">
            <div className="row signUpBay center">
              <div className="col s6 right-align">
                <Link to="/">
                  <img className="responsive-img" alt="letter" src={letter}/>
                </Link>
              </div>
              <div className="col s6 left-align">
                <h5 className="grey-text">INTRODUCE YOURSELF</h5>
                <div className="signUpDetails">
                  <form className="signUpForm">
                    <div className="inputBox">
                      <div className="input-field inputBar">
                        <input id="name" type="text" className="validate" onChange={handleChange}
                               value={state.name}/>
                        <label htmlFor="name">username</label>
                      </div>
                      <div className="input-field inputBar">
                        <input id="password" type="password" className="validate" onChange={handleChange}
                               value={state.password}/>
                        <label htmlFor="password">password</label>
                      </div>
                      <div className="input-field inputBar">
                        <input id="email" type="email" className="validate" onChange={handleChange}
                               value={state.email}/>
                        <label htmlFor="email">email id</label>
                      </div>
                      <div className="input-field inputBar">
                        <input id="phone" type="tel" className="validate" onChange={handleChange}
                               value={state.phone}/>
                        <label htmlFor="phone">Phone Number</label>
                      </div>
                    </div>
                    <button className="btn-large orange darken-4 submitBtn" onClick={signUpUser}>
                      Sign me up!
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          loading && <LoadingComponent/>
        }
      </>
  )
}

export default SignUpComponent;
