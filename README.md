
# Personal Tech Portfolio Blog (Community)

This is a code bundle for Personal Tech Portfolio Blog (Community). The original project is available at [Figma](https://www.figma.com/design/vGsWTFg8pBClvaGv4ZF62Y/Personal-Tech-Portfolio-Blog--Community-).

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev:cms` to start the filesystem CMS API.

Run `npm run dev` to start the frontend app.

Or run both with `npm run dev:full`.

### Admin panel

Open `/admin` to create, edit, and delete subjects/posts.

- Default admin token: `admin`
- Override token with env var `CMS_ADMIN_TOKEN`
- CMS data is persisted in `content/subjects.json` and `content/posts.json`
  