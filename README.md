# Server2

## Description

Server for Jotter.

## Author: Jelani R

## Architecture

Nodejs, MySQL, Express, JsonWebToken, Bcrypt, Base-64.

## Jotter API

### Endpoints

Auth

```javascript
GET /jotter // check auth - uses bearer auth
POST /jotter/signup
POST /jotter/login // uses basic auth
POST /jotter/logout
```

Folders (all endpoints use bearer auth)

```javascript
GET /jotter/folder
POST /jotter/folder
PATCH /jotter/folder/:folderId
DELETE /jotter/folder/:folderId
```

Notes (all endpoints use bearer auth)

```javascript
GET /jotter/note/:noteId // get note
GET /jotter/note // get notes in root folder
GET /jotter/note/:folderId // get notes in folder
POST /jotter/note
PATCH /jotter/note/:noteId
DELETE /jotter/note/:noteId
```

### `/login` POST request example (basic auth)

```json
{
  "email": "myEmail@gmail.com",
  "password": "password123"
}
```

### `/note` POST request example (bearer auth)

if `folderId` is null, that will add note to root folder.

```json
{
  "title": "first-note",
  "content": "# header 1",
  "userId": 1,
  "folderId": 2
}
```

### `/folder` POST request example (bearer auth)

```json
{
  "title": "new-folder",
  "userId": 1
  "parentId": 5,
  "path": {
    "id": 3,
    "title": "shopping"
},
```

### Jotter Changelog

- 0.0.3 (2024-12-18, 3:20pm) - Users can add and edits notes
- 0.0.1 (2024-12-15, 7:03pm) - First commit with working authentication
