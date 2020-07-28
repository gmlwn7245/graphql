var express = require("express");
var graphqlHTTP = require("express-graphql").graphqlHTTP;
var Graphql = require("graphql");
var { makeExecutableSchema } = require("graphql-tools");

var fakeDatabase = require("./fakedata.js");

// 타입 정의
const typeDefs = `
type geo{
  lat:Float,
  lng:Float
}
type company{
  name:String
  catchPhrase:String
  bs:String
}
type address{
  street:String
  suite:String
  city:String
  zipcode:String
  geo:geo
}
type user{
  id:Int
  name:String
  username:String
  email:String
  address:address
  phone:String
  website:String
  company:company
}
type Query{
  users(id:Int!):user
  username(name:String!):user
  allUser:[user]
  finduser(id:Int!, name:String):user
  findcity(city:String!):address
}
`;

const resolvers = {
  Query: {
    users(_,{ id }) {
      const data = Object.keys(fakeDatabase).filter(element => {
        if (fakeDatabase[element].id == id) {
          return element;
        }
      }); 
      return fakeDatabase[data];
    },
    username(_,{name}) {
      const data = Object.keys(fakeDatabase).filter(element => {
        if (fakeDatabase[element].name == name) {
          return element;
        }
      }); 
      return fakeDatabase[data];
    },
    allUser() {
      return fakeDatabase;
    },
    finduser(_,{id,name}){
      const data = Object.keys(fakeDatabase).filter(element => {
        if (fakeDatabase[element].name == name && fakeDatabase[element].id == id) {
          return element;
        }
      }); 
      return fakeDatabase[data];
    },
    findcity(_,{city}){
      const data = Object.keys(fakeDatabase).filter(element => {
        if(fakeDatabase[element].address.city == city){
          return element;
        }
      });
      return fakeDatabase[data];
    }
  }
};



const schema = makeExecutableSchema({ 
  typeDefs,
  resolvers
});

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL server");