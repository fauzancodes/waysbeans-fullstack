# WaysBeans - API

A clean structure for the API Endpoint of an e-commerce that sells coffee grounds, namely WaysBeans.

This Endpoint API is fully built using the [GO](https://go.dev/) programming language with the [Echo](https://echo.labstack.com/) framework, the [GORM](https://gorm.io/) ORM library, and [MySQL](https://www.mysql.com/) as the database.

This repository is very useful for someone who wants to learn backend web development by building API Endpoints.

### Available features:

1. API Endpoint to perform CRUD (Create, Read, Update, Delete) on User data.
2. API Endpoint to perform CRUD (Create, Read, Update, Delete) on Product data.
3. API Endpoint to perform CRUD (Create, Read, Update, Delete) on each User's Cart data.
4. API Endpoint to perform CRUD (Create, Read, Update, Delete) on each User's Transaction data.
5. API Endpoint for Login and Register.
6. Password Hashing Middleware for each User using [Bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt).
7. Middleware Upload File to upload files from user input files.
8. Middleware to authenticate by creating a Token from [JWT](https://jwt.io/).
