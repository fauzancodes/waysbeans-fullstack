# WaysBeans

A E-Commerce called WaysBeans which provides products in the form of quality coffee powder.

This project demonstrates in full how to create a fullstack E-Commerce using [React](https://reactjs.org/) and [Bootstrap](https://getbootstrap.com/) for the frontend, [GO](https://go.dev/) programming language with the [Echo](https://echo.labstack.com/) framework for the backend, the [GORM](https://gorm.io/) ORM library to handle database query, [PostgreSQL](https://www.postgresql.org/) as the database, and [Cloudinary](https://cloudinary.com/) as as the file storage.

## Available features

- Login and register forms that function properly.
- Filter login as customer or admin.
- Well-functioning logout button.
- Shopping basket for customers.
- Home page that displays products for sale if logged in as a customer and will display a transaction trail if logged in as an admin.
- Product detail page that displays product details and also a button to add the product to the customer's shopping cart.
- Customer profile page that displays customer identity and customer transaction history.
- Well functioning Add Product page for admin to add product.
- Product list page that displays a list of products and delete and update buttons that can be used by admins to delete and update products.
- API Endpoint to perform CRUD (Create, Read, Update, Delete) on User data.
- API Endpoint to perform CRUD (Create, Read, Update, Delete) on Product data.
- API Endpoint to perform CRUD (Create, Read, Update, Delete) on each User's Cart data.
- API Endpoint to perform CRUD (Create, Read, Update, Delete) on each User's Transaction data.
- API Endpoint for Login and Register.
- Password Hashing Middleware for each User using [Bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt).
- Middleware Upload File to upload files from user input files.
- Middleware to authenticate by creating a Token from [JWT](https://jwt.io/).
- Payment Gateways using [Midtrans](midtrans.com).
