import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import  {createContext} from "react"


export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <QueryClientProvider client={queryClient}>
    <App />
   </QueryClientProvider>
  </BrowserRouter>,
)