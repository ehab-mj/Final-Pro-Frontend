import React, { createContext, useState } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([])

    // Existed user:
    const [currentUser, setCurrentUser] = useState(
        () => {
            const savedUser = localStorage.getItem('currentUser')
            return savedUser ? JSON.parse(savedUser) : null
        }
    )

    const addUser = (user) => {
        setUsers((prev) => [...prev, user])
    }

    // Post exited user in 
    const login = (user) => {
        setCurrentUser(user)
        // saving loggin user after refresh 
        localStorage.setItem('currentUser', JSON.stringify(user))
    }

    // exited user out
    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <AppContext.Provider value={{ users, addUser, login, logout, currentUser }}>
            {children}
        </AppContext.Provider>
    )
}