
  # Adventist Community Service

  This is a code bundle for Adventist Community Service. The original project is available at https://www.figma.com/design/cPLjnZgHc74WS3g1BEYUSK/Adventist-Community-Service.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## API access in development

  The backend ([acs-backend](https://github.com/South-NSW-Conference-Office/acs-backend)) only
  allows CORS from `communityservices.org.au` when running in production, so the browser cannot
  call it directly from `localhost`. `npm run dev` therefore proxies `/api` through Vite to the
  live API, which works because server-side requests send no `Origin` header.

  That target is **production data**, so the proxy rejects anything other than `GET`/`HEAD`/
  `OPTIONS` with a 403. To make writes — or to work against your own data — run acs-backend
  locally and point the app at it:

  ```
  # .env.local
  VITE_API_URL=http://localhost:5000
  ```

  `VITE_API_URL` is also set in the Vercel project, which is what production builds use.
  