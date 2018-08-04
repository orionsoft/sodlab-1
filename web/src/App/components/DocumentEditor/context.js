import React from 'react'
const ClientContext = React.createContext('clientData')
const ClientProvider = ClientContext.Provider
const ClientConsumer = ClientContext.Consumer
export {ClientProvider, ClientConsumer}
