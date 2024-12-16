# Server2

## Description

Server for Jotter.

## Author: Jelani R

## Architecture

Nodejs, MySQL, Express, JsonWebToken, Bcrypt, Base-64.

## Jotter API

### login request example

```json
'email': 'myEmail@gmail.com',
'password': 'password123'
```

### folder request example

```json
'title': 'new-folder',
'userId': '1'
'parentId': 5,
'path': {
  'id': '3',
  'title': 'shopping'
},
```

## Changelog

- 0.0.1 (2024-12-15, 7:03pm) - First commit with working authentication
