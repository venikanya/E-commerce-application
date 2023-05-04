# E-commerce Application

Help building material suppliers like paint stores and hardware stores that sell to businesses and retail customers alike

## Run Environment

### Server
1. Golang Server: go1.20.3 darwin/amd64
2. Mongod: v5.0.15 

### Client
1. React: 18.2.0
2. React-dom: 18.2.0
3. styled-components: 5.3.9

pre-requisites
```Download & install go1.20.3.darwin-amd64.pkg```
```brew install mongodb-community@5.0```

To run the project locally
1. create a folder which acts as a path for starting mongodb instance locally. ```Create folder mongo-db-path in server directory```
2. In terminal go to server folder. Run ```mongod --dbpath mongo-db-path```
3. Open another tab in the terminal. Navigate to server folder. Run ```go run main.go```
4. Open another tab in the terminal. Navigate to client folder. Run ```npm install``` and then ```npm run dev```
5. In the browser, navigate to http://localhost:5173/

Implementation Details:
1. Persisting data using local Mongo DB 
2. Building mutiple text key index to enable search on three properties at once
3. Page is responsive to support multiple devices
4. Add Product brings up a modal which takes in name, category and sku. On Submit, the form gets submitted. Upon success the modal gets closed. Upon error, the error is dispalyed in the modal for user action. List is refreshed upon success. The new item gets added to end of the list.

Limitations:
1. This special index search does not support fuzzy/stem words. So user has to search for exact words. It does support case insensitive.
eg: If the name is "Eggshell Paint", user has to search eggshell instead of egg to find it
2. The order of the get products call need to be maintained consistent. One options is to use Created property on the product to sort the results
