# COPYFAN BACKEND PROJECT

COPYFAN is a project designed to manage print orders initiated by sending files or requesting already available materials. It offers digital conveniences to speed up the process, such as integrated payment and order management for the print shop.

## Requirements

- [Node.js](https://nodejs.org/pt/download) (LTS recommended)  
- [PostgreSql](https://www.postgresql.org/download) (installed and running)

## Installation

Check if Node.js is installed using the command:

```bash
node -v
```

If it is not installed, download it directly from the official website: [Node.js](https://nodejs.org/pt/download)

After verifying that it is installed, using the command above, open the project folder and then a terminal in the project directory to install the dependencies:

```bash
npm install
```

To confirm the installation was successful, a folder named node_modules will be created, and in package.json you will find the dependencies: express, cors, dotenv, and others.

This project uses PostgreSql, so make sure to install and configure it later in the project folder.

To configure the port and the database address, create a .env file in the project folder and add the port and the database address. Example:

## Configuration .env

```javascript
APP_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=NAMEOFUSER
DB_PASSWORD=NAMEOFPASSWORD
DB_NAME=NAMEOFDB

JWT_SECRET="SUA SENHA DEVE SER COLOCADA"
```
## Running the Project

After installing the dependencies and configuring the .env file, you can start the project using:

```bash
node server.js
```

## API Endpoints

1. User Registration

Endpoint: /api/v1/users/register

Method: POST

Description: Creates a new user account.

Request Body (JSON):
{
    "name" : "joa",
    "email": "joaozinho23@hotmail.com",
    "password": "12345678aA",
    "course_id": "0bb6cd65-8dbb-4989-a497-3e1f9087a634"
}


Success Response (Status: 201 Created):
{
    "id": "6f14c401-d275-41df-ba60-30b7b7e65a4d",
    "name": "joa",
    "email": "joaozinho23@hotmail.com",
    "password": "$2b$10$EpcuwuMhuM3aJnN2Ilgf1uK03e0jZi6BvxWVhW/NmDXjY.sXZt7B2",
    "role": "user",
    "course_id": "0bb6cd65-8dbb-4989-a497-3e1f9087a634",
    "updatedAt": "2025-10-22T13:28:14.627Z",
    "createdAt": "2025-10-22T13:28:14.627Z"
}


Error Response (Status: 400 Bad Request):
{
    "error": "Name contains invalid characters. Only letters, accented letters, and spaces are allowed."
}

2. Get Orders by User

Endpoint: /api/v1/orders/me

Method: GET

Description: Get Orders by the user authenticated


Success Response (Status: 200 Ok):
[
    {
        "id": "7033b085-c880-4493-86e6-638e8e9d526a",
        "status": "waiting_payment",
        "user_id": "2b8d747d-6dc9-499c-bcb5-dd966a450c70",
        "payment_id": "8137ad69-0d50-4939-9777-7329f3409266",
        "createdAt": "2025-10-22T01:46:05.881Z",
        "updatedAt": "2025-10-22T01:46:05.985Z",
        "payment": {
            "statusPayment": "pending",
            "totalValue": "0.19"
        },
        "materials": [
            {
                "name": "testando backend2",
                "classPeriod": "5 periodo",
                "total_pages": 19,
                "MaterialsOrders": {
                    "start_page": 1,
                    "end_page": 1,
                    "quantity": 1
                }
            }
        ]
    }
]

3. Create a order
   Endpoint: /api/v1/orders/

Method: POST

Description: Create a order


Success Response (Status: 201 Created):
{
    "message": "Order created successfully",
    "order": "58d97195-ccd5-401f-8153-db422db79c23",
    "status": "waiting_payment"
}
Error Response (Status: 400 Bad Request):
{
    "error": "sintaxe de entrada é inválida para tipo uuid: \"5aadfd0-ef27-4f0a-af33-108cc1f56392\""
}

## Contributing

Pull requests are welcome. Feel free to make contributions to the project!

## License

[ISC](License.md)