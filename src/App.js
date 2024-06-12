
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import LogIn from './Pages/Login';
import Register from './Pages/Register';
import './style.scss';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


function App() {
  const currentUser = useContext(AuthContext)
  // console.log(currentUser);

  const ProtectedRoute = ({children})=>{
    if(!currentUser){
      return<Navigate to='login'/>
    }
    return children;
  }

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={
          <ProtectedRoute>
            <Home />
            </ProtectedRoute>}/>
          <Route path='login' element={<LogIn />}/>
          <Route path='register' element={<Register/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;


