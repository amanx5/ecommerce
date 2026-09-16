# ecommerce

A simple full-stack ecommerce app with a React frontend and Node/Express backend.

## Overview

This reposistory consists of two main packages:

- **server/** – a Node/Express backend providing REST APIs and data persistence.
- **ui/** – a React frontend built using Vite and TypeScript.

## Getting Started

Follow these steps to run the application locally:

1. Change the current directory to the repository root:
    ```bash
   cd ecommerce
   ```  
2. Install dependencies:
   ```bash
   npm run install
   ```
3. Create `.env.dev` file in `server/` folder. Example environment file can be found [here](server/.env.example).
4. Start backend server
   ```bash
   npm run dev:server
   ```
5. Start UI server
   ```bash
   npm run dev:ui
   ```
6. Navigate to http://localhost:5173 to access the UI.


## License & Credits

Created as an educational project under the SuperSimpleDev React course.

YouTube link: [SuperSimpleDev React course](https://www.youtube.com/watch?v=TtPXvEcE11E)

Full course:  [SuperSimpleDev React course](https://courses.supersimple.dev/courses/react)

---

Feel free to explore and adapt the code for learning purposes.
