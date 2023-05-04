package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	db *mongo.Database
)

type Product struct {
	Name string `bson:"name"`
	Category string `bson:"category"`
	SKU string `bson:"sku"`
	Created int64 `bson:"created"`
}

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	productList := db.Collection("products")
	fmt.Println("GET params were:", r.URL.Query())
	query := r.URL.Query().Get("filter")
	filter := bson.M{}
	if query != "" {
		filter = bson.M{"$text":bson.M{"$search":query,"$caseSensitive":false}}
	}
	fmt.Println(filter)
	cursor, err := productList.Find(context.TODO(), filter)
	if err != nil {
		fmt.Println(err)
	}
	products := make([]bson.M, 0)
	if err = cursor.All(context.TODO(), &products); err != nil {
		fmt.Println(err)
	}
	fmt.Println(products)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(products)
}

func PostProductHandler(w http.ResponseWriter, r *http.Request) {
	var p Product

	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println(time.Now().Unix())
	p.Created = time.Now().Unix()
	productList := db.Collection("products")
	result, err := productList.InsertOne(context.TODO(), p)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
		
	}
	fmt.Printf("inserted document with ID %v\n", result.InsertedID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

func AddIndex(client *mongo.Client, dbName string, collection string, indexKeys interface{}) error {

    serviceCollection := client.Database(dbName).Collection(collection)
    indexName, err := serviceCollection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
        Keys: indexKeys,
		Options: options.Index().SetDefaultLanguage("none"),
    })
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(indexName)
    return nil
}

func main() {
	// Define the mongodb client URL
	var uri = "mongodb://localhost:27017"

	// Establish the connection
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Create go routine to defer the closure
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	db = client.Database("testDB")
	coll := db.Collection("products")
	opts := options.EstimatedDocumentCount().SetMaxTime(2 * time.Second)
	count, err := coll.EstimatedDocumentCount(context.TODO(), opts)
	if err != nil {
		fmt.Println(err)
	}
	//Dummy data
	if (count == 0) {
		var dummyProducts []interface{}
		configFile, err := os.Open("initialData.json")
		if err != nil {
			fmt.Println(err)
		}
		jsonParser := json.NewDecoder(configFile)
		if err = jsonParser.Decode(&dummyProducts); err != nil {
			fmt.Println(err)
		}

		_, insertErr := coll.InsertMany(context.TODO(), dummyProducts)
		if insertErr != nil {
			panic(insertErr)
		}

	}

	// Index Data
	AddIndex(client, "testDB", "products", bson.D{{"name", "text"},{"category", "text"},{"sku", "text"}})
	
	r:= mux.NewRouter()

	r.HandleFunc("/api/products", GetProductsHandler).Methods("GET")
	r.HandleFunc("/api/product", PostProductHandler).Methods("POST")

	err = http.ListenAndServe(":8000", r)
	if err != nil {
		fmt.Println("Cannot start the server", err)
		os.Exit(1)
	}
}