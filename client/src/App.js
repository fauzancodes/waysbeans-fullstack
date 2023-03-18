import "./App.css";
import NavbarSection from "./components/Navbar";
import { useEffect, useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from 'react-query';
import { UserContext } from './context/userContext';

import { API, setAuthToken } from './config/api';

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import ListProduct from "./pages/ListProduct";
import PageNotFound from "./pages/PageNotFound";
import UpdateProfilePage from "./pages/UpdateProfilePage";

import SuccessAddProductModal from "./components/SuccessAddProductModal";
import SuccessUpdateProfileModal from "./components/SuccessUpdateProfileModal";
import SuccessUpdateProductModal from "./components/SuccessUpdateProductModal";
import SuccessTransactionModal from "./components/SuccessTransactionModal";
import SuccessAddCartModal from "./components/SuccessAddCartModal";
import SuccessRegisterModal from "./components/SuccessRegisterModal";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import CustomerRoute from "./components/CustomerRoute";
import AdminRoute from "./components/AdminRoute";
import UnregisteredEmailModal from "./components/UnregisteredEmailModal";
import RegisteredEmailModal from "./components/RegisteredEmailModal";
import WrongPasswordModal from "./components/WrongPasswordModal";
import SuccessLoginToast from "./components/SuccessLoginToast";
import SuccessLogoutToast from "./components/SuccessLogoutToast";
import OutOfStockModal from './components/OutOfStockModal';

function App() {
  const navigate = useNavigate();
  useEffect(() => window.scroll({top: 0, behavior: "smooth"}),[]);
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate('/');
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      let payload = response.data.data;
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
      return
    }
  };

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const darkModeStorage = localStorage.getItem("WaysBeansDarkMode");
    if (darkModeStorage === "true") setDarkMode(true);
    else setDarkMode(false);
  }, []);
  const toggleDarkMode = () => {
    if (darkMode === true) {
      setDarkMode(false);
      localStorage.setItem("WaysBeansDarkMode", false);
    }
    else {
      setDarkMode(true);
      localStorage.setItem("WaysBeansDarkMode", true);
    }
  };

  const [ProductsList, SetProductsList] = useState([]);
  const [UserCarts, SetUserCarts] = useState([]);
  const [UserProfiles, SetUserProfiles] = useState([]);
  const [TransactionsList, SetTransactionsList] = useState([]);
  
  useQuery('productsCache', async () => {
    try {
      const response = await API.get('/products');
      SetProductsList(response.data.data);
    }
    catch (error) {
      return
    }
  });
  useQuery('usercartsCache', async () => {
    try {
      const response = await API.get('/carts');
      SetUserCarts(response.data.data);
    }
    catch (error) {
      return
    }
  });
  useQuery('userprofilesCache', async () => {
    try {
      const response = await API.get('/profiles');
      SetUserProfiles(response.data.data);
    }
    catch (error) {
      return
    }
  });
  useQuery('transactionsCache', async () => {
    try {
      const response = await API.get('/transactions');
      SetTransactionsList(response.data.data);
    }
    catch (error) {
      return
    }
  });

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: ""
  });
  const formLoginHandleOnChange = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };
  const formLoginHandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      
      const responseLogin = await API.post('/login', formLogin);
      const responseUser = await API.get('/user/' + responseLogin.data.data.id);
      responseUser.data.data.token = responseLogin.data.data.token;
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: responseUser.data.data,
      });
      setAuthToken(responseUser.data.data.token);
      settoastSuccessLogin(true);

      setFormLogin((formLogin) => ({
        ...formLogin,
        email: "",
        password: ""
      }));
  
      setModalLoginShow(false);
    } catch (error) {
      if (error.response.data.message === "record not found")  setModalUnregisteredEmail(true);
      else if (error.response.data.message === "wrong password") setModalWrongPassword(true);
      setFormLogin((formLogin) => ({
        ...formLogin,
        email: "",
        password: ""
      }));
  
      setModalLoginShow(false);
    }
  });

  const [formRegister, setFormRegister] = useState({
    is_admin: false,
    name: "",
    email: "",
    password: "",
  });
  const formRegisterHandleOnChange = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };
  const formRegisterHandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      try {
        await API.post('/register', formRegister);
      }
      catch (error) {
        return
      }

      setFormRegister({
        name: "",
        email: "",
        password: "",
      });
      setModalRegisterShow(false);
      setmodalSuccessRegister(true);
    } catch (error) {
      if (error.response.data.message === "This email is already registered") setModalRegisteredEmail(true);
      setFormRegister({
        name: "",
        email: "",
        password: "",
      });
      setModalRegisterShow(false);
    }
  });

  const [photoPreview, setPhotoPreview] = useState("/images/product-placeholder.webp");
  const [formAddProduct, setformAddProduct] = useState({
    name: "",
    description: "",
    price: "",
    photo: "",
    stock: "",
  });
  const formAddProductHandleOnChange = (e) => {
    setformAddProduct({
      ...formAddProduct,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    }
  };
  const formAddProductHandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
  
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set('name', formAddProduct.name);
      formData.set('description', formAddProduct.description);
      formData.set('price', formAddProduct.price);
      formData.set('photo', formAddProduct.photo[0], formAddProduct.photo[0].name);
      formData.set('stock', formAddProduct.stock);
      try {
        await API.post('/product', formData, config);
      }
      catch (error) {
        return
      }
  
      setformAddProduct((formAddProduct) => ({
        ...formAddProduct,
        name: "",
        description: "",
        price: "",
        photo: "",
        stock: "",
      }));
      setPhotoPreview("/images/product-placeholder.webp");
      setmodalSuccessAddProduct(true);
      navigate("/list-product");
    } catch (error) {
      return
    }
  });

  const [formUpdateProduct, setformUpdateProduct] = useState({
    id:0,
    name: "",
    stock: "",
    price: "",
    description: "",
    photo: "",
  });
  const formUpdateProductHandleOnChange = (e) => {
    setformUpdateProduct({
      ...formUpdateProduct,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    }
  };
  const formUpdateProductHandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      if (formUpdateProduct.photo) {
        formData.set('photo', formUpdateProduct?.photo[0], formUpdateProduct?.photo[0]?.name);
      }
      formData.set('name', formUpdateProduct.name);
      formData.set('description', formUpdateProduct.description);
      formData.set('price', formUpdateProduct.price);
      formData.set('stock', formUpdateProduct.stock);
      try {
        await API.patch('/product/' + formUpdateProduct.id, formData, config);
      }
      catch (error) {
        return
      }
      setformUpdateProduct((formUpdateProduct) => ({
        ...formUpdateProduct,
        name: "",
        stock: "",
        price: "",
        description: "",
        photo: "",
      }));
      setPhotoPreview("/images/product-placeholder.webp");
      setmodalSuccessUpdateProduct(true);
      navigate("/list-product");
    } catch (error) {
      return
    }
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState("/images/profile-picture-placeholder.webp");
  const [formUpdateProfile, setformUpdateProfile] = useState({
    id:0,
    photo: "",
    phone: "",
    address: "",
  });
  const formUpdateProfileHandleOnChange = (e) => {
    setformUpdateProfile({
      ...formUpdateProfile,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    });
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setProfilePhotoPreview(url);
    }
  };
  const formUpdateProfileHandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      if (formUpdateProfile.photo) {
        formData.set('photo', formUpdateProfile?.photo[0], formUpdateProfile?.photo[0]?.name);
      }
      formData.set('phone', formUpdateProfile.phone);
      formData.set('address', formUpdateProfile.address);
      try {
        await API.patch('/profile/' + formUpdateProfile.id, formData, config);
      }
      catch (error) {
        return
      }
      const updatedProfile = UserProfiles.map((profile) => {
        if (profile.id === formUpdateProfile.id) {
          return { 
            ...profile, 
            id: formUpdateProfile.id, 
            photo: profilePhotoPreview,
            phone: formUpdateProfile.phone,
            address: formUpdateProfile.address,
          };
        }
        return profile;
      });
      SetUserProfiles(updatedProfile);

      setformUpdateProfile((formUpdateProfile) => ({
        ...formUpdateProfile,
        id:0,
        photo: "",
        phone: "",
        address: "",
      }));
      setModalSuccessUpdateProfile(true);
      navigate("/profile");
    } catch (error) {
      return
    }
  });

  const [modalSuccessUpdateProduct, setmodalSuccessUpdateProduct] = useState(false);
  const [modalSuccessAddProduct, setmodalSuccessAddProduct] = useState(false);
  const [modalSuccessTransaction, setmodalSuccessTransaction] = useState(false);
  const [modalSuccessAddCart, setmodalSuccessAddCart] = useState(false);
  const [modalSuccessRegister, setmodalSuccessRegister] = useState(false);
  const [modalLoginShow, setModalLoginShow] = useState(false);
  const [modalRegisterShow, setModalRegisterShow] = useState(false);
  const [modalUnregisteredEmail, setModalUnregisteredEmail] = useState(false);
  const [modalRegisteredEmail, setModalRegisteredEmail] = useState(false);
  const [modalWrongPassword, setModalWrongPassword] = useState(false);
  const [toastSuccessLogin, settoastSuccessLogin] = useState(false);
  const [toastSuccessLogout, settoastSuccessLogout] = useState(false);
  const [modalOutOfStockShow, setModalOutOfStockShow] = useState(false);
  const [modalSuccessUpdateProfile, setModalSuccessUpdateProfile] = useState(false);

  return (
    <>
      {isLoading ? (
          <>
            <style>{`body { background-color: ${darkMode ? "#333333" : "#ffffff"}; color: ${darkMode ? "#ffffff" : "#000000"}; }`}</style>
            <div id="loader-container" className="d-flex justify-content-center align-items-center" style={{width:"100vw",height:"100vh"}}>
              {
                darkMode ? (
                  <>
                    <img id="loader" src="/images/icon-logo-dark-mode.webp" alt="WaysBeans" className="position-absolute"/>
                    <img src="/images/icon-logo-dark-mode.webp" alt="WaysBeans" className="position-relative"/>
                  </>
                ) : (
                  <>
                    <img id="loader" src="/images/icon-logo.webp" alt="WaysBeans" className="position-absolute"/>
                    <img src="/images/icon-logo.webp" alt="WaysBeans" className="position-relative"/>
                  </>
                )
              }
            </div>
          </>
        ) :
        <>
          <style>{`body { background-color: ${darkMode ? "#333333" : "#ffffff"}; color: ${darkMode ? "#ffffff" : "#000000"}; }`}</style>
          <svg onClick={() => window.scroll({top: 0, behavior: "smooth"})} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="position-fixed" style={{ bottom:"1rem", right: "1rem", width:"2.5rem", cursor:"pointer", zIndex:"5", filter: `drop-shadow(1px 1px 0 ${darkMode ? "#613D2B" : "#F6E6DA"}) drop-shadow(-1px -1px 0 ${darkMode ? "#613D2B" : "#F6E6DA"}) drop-shadow(1px -1px 0 ${darkMode ? "#613D2B" : "#F6E6DA"}) drop-shadow(-1px 1px 0 ${darkMode ? "#613D2B" : "#F6E6DA"})`, backgroundColor:`${darkMode ? "#613D2B" : "#F6E6DA"}`, borderRadius:"50%" }}>
            <path fill={darkMode ? "#F6E6DA" : "#613D2B"} d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4l107.1-99.9c3.8-3.5 8.7-5.5 13.8-5.5s10.1 2 13.8 5.5l107.1 99.9c4.5 4.2 7.1 10.1 7.1 16.3c0 12.3-10 22.3-22.3 22.3H304v96c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256H150.3C138 256 128 246 128 233.7c0-6.2 2.6-12.1 7.1-16.3z"/>
          </svg>
          <SuccessUpdateProfileModal
              show={modalSuccessUpdateProfile} 
              onHide={() => setModalSuccessUpdateProfile(false)} 
          />
          <OutOfStockModal 
            show={modalOutOfStockShow} 
            onHide={() => setModalOutOfStockShow(false)} 
          />
          <SuccessLoginToast 
            show={toastSuccessLogin} 
            onClose={() => settoastSuccessLogin(false)} 
          />
          <SuccessLogoutToast 
            show={toastSuccessLogout} 
            onClose={() => settoastSuccessLogout(false)} 
          />
          <SuccessTransactionModal 
              show={modalSuccessTransaction} 
              onHide={() => setmodalSuccessTransaction(false)} 
          />
          <SuccessRegisterModal  
              show={modalSuccessRegister} 
              onHide={() => {
                setmodalSuccessRegister(false);
                setModalLoginShow(true);
              }} 
          />
          <SuccessAddProductModal
              show={modalSuccessAddProduct} 
              onHide={() => setmodalSuccessAddProduct(false)} 
          />
          <SuccessUpdateProductModal 
              show={modalSuccessUpdateProduct} 
              onHide={() => setmodalSuccessUpdateProduct(false)} 
          />
          <SuccessAddCartModal 
              show={modalSuccessAddCart} 
              onHide={() => setmodalSuccessAddCart(false)} 
          />
          <LoginModal 
            show={modalLoginShow} 
            onHide={() => {
              setModalLoginShow(false);
              setFormLogin((formLogin) => ({
                ...formLogin,
                email: "",
                password: "",
              }));
            }} 
            changeModal={() => {
              setModalLoginShow(false);
              setModalRegisterShow(true);
              setFormLogin((formLogin) => ({
                ...formLogin,
                email: "",
                password: "",
              }));
            }} 
            formLogin={formLogin} 
            loginOnChange={(e) => formLoginHandleOnChange(e)}
            loginOnSubmit={(e) => formLoginHandleOnSubmit.mutate(e)}
          />
          <RegisterModal 
            show={modalRegisterShow} 
            onHide={() => {
              setModalRegisterShow(false);
              setFormRegister((formRegister) => ({
                ...formRegister,
                email: "",
                password: "",
                name: "",
              }));
            }} 
            changeModal={() => {
              setModalRegisterShow(false);
              setModalLoginShow(true);
              setFormRegister((formRegister) => ({
                ...formRegister,
                email: "",
                password: "",
                name: "",
              }));
            }}
            formRegister={formRegister} 
            registerOnChange={(e) => formRegisterHandleOnChange(e)}
            registerOnSubmit={(e) => formRegisterHandleOnSubmit.mutate(e)}
          />
          <UnregisteredEmailModal 
            show={modalUnregisteredEmail} 
            onHide={() => {
              setModalUnregisteredEmail(false);
              setModalRegisterShow(true);
            }} 
          />
          <RegisteredEmailModal 
            show={modalRegisteredEmail} 
            onHide={() => {
              setModalRegisteredEmail(false);
              setModalLoginShow(true);
            }} 
          />
          <WrongPasswordModal 
            show={modalWrongPassword} 
            onHide={() => {
              setModalWrongPassword(false);
              setModalLoginShow(true);
            }} 
          />
          <NavbarSection 
            LoggedInUserId={state.user.id} 
            User={state.user} 
            UserCarts={UserCarts} 
            SetUserCarts={SetUserCarts} 
            Profiles={UserProfiles} 
            showModalLogin={() => setModalLoginShow(true)} 
            showModalRegister={() => setModalRegisterShow(true)} 
            isLogin={state.isLogin} 
            isAdmin={state.user.is_admin} 
            logout={() => {
              dispatch({
                type: "LOGOUT"
              });
              settoastSuccessLogout(true);
            }} 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
          />
          <Routes>
            <Route path="/" element={state.user.is_admin ? <AdminDashboard Transactions={TransactionsList} darkMode={darkMode} /> : <Home Products={ProductsList} />} />
            <Route path="/product-details/:id" element={<ProductDetails 
              isLogin={state.isLogin} 
              showModalLogin={() => setModalLoginShow(true)} 
              Products={ProductsList} 
              User={state.user} 
              UserCarts={UserCarts} 
              SetUserCarts={SetUserCarts} 
              LoggedInUserId={state.user.id} 
              setmodalSuccessAddCart={() => setmodalSuccessAddCart(true)}
              setModalOutOfStockShow={() => setModalOutOfStockShow(true)} 
              darkMode={darkMode} 
            />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<CustomerRoute isLogin={state.isLogin} />}>
              <Route path="/cart" element={<Cart 
                User={state.user} 
                Profiles={UserProfiles} 
                UserCarts={UserCarts} 
                SetUserCarts={SetUserCarts} 
                LoggedInUserId={state.user.id} 
                Products={ProductsList} 
                SetProducts={SetProductsList} 
                Transactions={TransactionsList} 
                SetTransactions={SetTransactionsList} 
                showModalSuccessTransaction={() => setmodalSuccessTransaction(true)} 
                darkMode={darkMode} 
              />} />
              <Route path="/profile" element={<Profile 
                User={state.user} 
                Profiles={UserProfiles} 
                SetProfiles={SetUserProfiles} 
                LoggedInUserId={state.user.id} 
                Transactions={TransactionsList} 
                SetTransactions={SetTransactionsList}
                setImageUrl={setProfilePhotoPreview} 
                formUpdateProfile={formUpdateProfile} 
                setformUpdateProfile={setformUpdateProfile} 
                darkMode={darkMode} 
              />} />
              <Route path="/update-profile" element={<UpdateProfilePage 
                formUpdateProfile={formUpdateProfile} 
                UpdateProfileOnChange={(e) => formUpdateProfileHandleOnChange(e)} 
                UpdateProfileOnSubmit={(e) => formUpdateProfileHandleOnSubmit.mutate(e)} 
                imageUrl={profilePhotoPreview} 
                darkMode={darkMode} 
              />} />
            </Route>
            <Route path="/" element={<AdminRoute isLogin={state.isLogin} isAdmin={state.user.is_admin} />}>
              <Route path="/add-product-page" element={<AddProductPage 
                formAddProduct={formAddProduct} 
                AddProductOnChange={(e) => formAddProductHandleOnChange(e)} 
                AddProductOnSubmit={(e) => formAddProductHandleOnSubmit.mutate(e)} 
                imageUrl={photoPreview} 
                darkMode={darkMode} 
              />} />
              <Route path="/update-product-page/:id" element={<UpdateProductPage 
                formUpdateProduct={formUpdateProduct} 
                UpdateProductOnChange={(e) => formUpdateProductHandleOnChange(e)} 
                UpdateProductOnSubmit={(e) => formUpdateProductHandleOnSubmit.mutate(e)} 
                Products={ProductsList} 
                imageUrl={photoPreview} 
                darkMode={darkMode} 
              />} />
              <Route path="/list-product" element={<ListProduct 
                Products={ProductsList} 
                SetProductsList={SetProductsList}
                formUpdateProduct={formUpdateProduct} 
                setformUpdateProduct={setformUpdateProduct} 
                setImageUrl={setPhotoPreview} 
                darkMode={darkMode} 
              />} />
            </Route>
          </Routes>
          <footer className="w-100 text-center p-2 text-light" style={{ backgroundColor:"#613D2B" }}>&copy; {new Date().getFullYear()}. <a href="/" className="text-decoration-none text-light">WaysBeans</a>. Best quality coffee beans.</footer>
        </>
      }
    </>
  );
}

export default App;
