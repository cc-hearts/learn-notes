/**
 * @author cc-heart
 * @description
 * @Date 2022-12-7
 */

import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/index.js";
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // 开启图形查询的模式
  })
);

app.listen(4000);

console.log("123");
