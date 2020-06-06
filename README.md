# Muse REST API

## Before using

- Please make sure that you have:
 - node.js installed (https://nodejs.org/)
 - have mongodb installed and running locally (https://www.mongodb.com/)
   - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
 - run npm install in your root project folder
## Usage

To run the project, please use a command line the following:
 - npm start
    - It will run the server at port 3600.

    after started you can make unauthorized requests to create a user at POST localhost:3600/users
    {
    "firstName" : "Petko",
    "lastName" : "Gotsov",
    "email" : "petkogotsov.muse.com",
    "password" : "somePass"
    }
    after user is created store the userId from response and use the POST localhost:3600/auth
    {
    "email" : "petkogotsov.muse.com",
    "password" : "somePass"
    } to get a token
    after receiving token, set the Authorization Bearer {token} for all subsequent requests
    and create x2 bank accounts at POST localhost:3600/accounts
    {
	"balance" : 45000,
	"userId" : {userId created in step 1}
    }
    use POST localhost:3600/accounts/{accountIdToTransferFrom}/transfer
    {
	"receiverId": {accountIdToTransferTo},
	"sum": 15000
    }
    check out all accounts at GET localhost:3600/accounts
    account balance at GET localhost:3600/accounts/getBalance/{accountId}
    transaction history at GET localhost:3600/accounts/getTransactionHistory/{accountId}     

