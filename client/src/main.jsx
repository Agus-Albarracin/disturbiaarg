import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_REACT_APP_GOOGLECLIENTID || ''



ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter warning={false}>
    <App/>
    </BrowserRouter>
    </GoogleOAuthProvider>
)
