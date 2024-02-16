# Chat2Chat V2

## Tech Stack

- Nextjs 14
- Supabase Auth
- Firebase 
  - Firestore
  - Storage
- Tailwindcss

## Feacures

- theme is persist on server side so when page gets refreshed we won't see a flicker/flash or a blank screen, next-themes package is applied to achieve server side render

- Supabase auth is implemented on server side, before enter each route supabase checks the login user on server side to redirect to desired page for better user experiences.