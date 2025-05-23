# Jotter API

Server for Jotter web and Android app.

[Jotter web app](https://github.com/jchips/jotter)

[Jotter Android app](https://github.com/jchips/jotter-rn)

## Developer: Jelani R

## Architecture

- Language: JavaScript
- Server: Nodejs, Express
- Database: MySQL, Sequelize
- Auth: Bcrypt, Base-64, JsonWebToken

## API

### Endpoints

Auth

```javascript
GET /jotter // check auth - uses bearer auth
POST /jotter/signup
POST /jotter/login // uses basic auth
POST /jotter/logout
PATCH /jotter/update/:userId // uses bearer auth
POST /jotter/deleteuser/:userId // uses bearer auth
```

Folders (all endpoints use bearer auth)

```javascript
GET /jotter/folder // get folder
GET /jotter/folder/f/:parentId // get all folders in parent folder
GET /jotter/folder/all/:type/:folderId // get all folders that aren't current folder and that don't contain the current folder in the path (all outside folders)
POST /jotter/folder
PATCH /jotter/folder/:folderId
DELETE /jotter/folder/:folderId
```

Notes (all endpoints use bearer auth)

```javascript
GET /jotter/note/:noteId // get note
GET /jotter/note // get notes in root folder
GET /jotter/note/f/:folderId // get notes in folder
POST /jotter/note
PATCH /jotter/note/:noteId
DELETE /jotter/note/:noteId
```

Config (all endpoints use bearer auth)

```javascript
GET /jotter/config // get user's configs
PATCH /jotter/config
```

---

### Request examples

#### `/login` POST request example (basic auth)

```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

#### `/update` PATCH request example (bearer auth)

```json
{
  "email": "user@gmail.com",
  "password": "password123",
  "newPassword": "password246"
}
```

`newPassword` is an optional field (only required to change password).

#### `/deleteuser` POST request example (bearer auth)

```json
{
  "password": "password123",
}
```

---

#### `/note` POST request example (bearer auth)

if `folderId` is null, note will be added to root folder.

```json
{
  "title": "first-note",
  "content": "# header 1",
  "userId": 1,
  "folderId": 2
}
```

#### `/note` PATCH request example (bearer auth)

```json
{
  "title": "new-name",
  "updatedAt": 1735094126343,
}
```

`updatedAt` is of type DATETIME. This column is added to the database automatically when adding a folder or note.

---

#### `/folder` POST request example (bearer auth)

```json
{
  "title": "new-folder",
  "userId": 1,
  "parentId": 5,
  "path": [
    {
      "id": 5,
      "title": "shopping"
    }
  ]
},
```

`path` column automatically turns into type LONGTEXT in the database, so be sure to parse to JSON when grabbing path from database.

#### `/folder` PATCH request example (bearer auth)

```json
{
  "title": "new-name",
  "updatedAt": 1735094126343,
}
```

#### Another `/folder` PATCH request example (bearer auth)

```json
{
  "path": [
    {"id": 3, "title": "shopping"},
    {"id": 4, "title": "tasks"}
  ]
}
```

---

#### `/config` PATCH request example (bearer auth)

```json
{
  "sort": "1"
}
```

The request above will update the user's sort configuration.

## Changelog

- 1.2.1 (2025-04-27, 6:10pm) - Users can change email/password
- 1.2.0 (2025-04-16, 10:40pm) - Users can delete account, improved error handling
- 1.1.4 (2025-04-06, 3:40pm) - Added tests
- 1.1.3 (2025-04-01, 2:05am) - Added config route tests
- 1.1.2 (2025-03-29, 7:50pm) - Extended jwt time length
- 1.1.1 (2025-02-02, 5:05pm) - Security patch, added tests
- 1.1.0 (2025-01-23, 5:37am) - Added Config model and routes
- 1.0.1 (2025-01-20, 4:40pm) - Added auth and folder tests
- 1.0.0 (2024-12-24, 6:46pm) - Users can edit, move, and delete folders
- 0.0.4 (2024-12-21, 2:28am) - Users can add folders
- 0.0.3 (2024-12-18, 3:20pm) - Users can add and edit notes
- 0.0.1 (2024-12-15, 7:03pm) - First commit, working authentication
