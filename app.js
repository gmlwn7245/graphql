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
  user(id:Int!):user
  username(name:String!):user
  allUser:[user]
  finduser(id:Int!, name:String):user
  findcity(city:String!):address
}
`;

const resolvers = {
  Query: {
    user(_,{ id }) {
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
    finduser({id},{name}){
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

//typeDefs와 resolvers를 결합해서 하나의 스키마로 만들어 줍니다. 이때 중복되는 Type의 경우에는 한번만 실행됩니다.

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