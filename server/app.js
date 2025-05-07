import express from 'express'
import path from 'path'
import cors from 'cors'
import { createRequire } from 'module'

// Create a require function
const require = createRequire(import.meta.url)
// Use require to import JSON as a template
const defaultUser = require('./user.json')

import { addRoutes } from './api/looker_routes.js'

const app = express()
app.use(cors())
app.use(express.json())

// Global variable to store the current user
let currentUser = {...defaultUser}

// Endpoint to receive Google auth data from frontend
app.post('/api/set-user', (req, res) => {
  const { sub, given_name, family_name } = req.body
  
  // Update the user object with Google data
  currentUser = {
    ...defaultUser,
    external_user_id: sub || defaultUser.external_user_id,
    first_name: given_name || defaultUser.first_name,
    last_name: family_name || defaultUser.last_name
  }
  
  res.json({ success: true })
})

// Serve all Looker routes behind a `/api` prefix
// Use a function that always references the current user
addRoutes(app, () => currentUser, '/api')

// Serve the built app at the root URL
app.use(express.static('../build'))
app.get('*', (req, res) =>
  res.sendFile(path.resolve('..', 'build', 'index.html'))
)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
