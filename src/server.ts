import { Container } from "inversify";
import { AppConfig } from "@config";
import {config} from 'dotenv';
import * as process from "process";

config({
  path: '.env.development'
})

const appContainer = new Container({
  defaultScope: "Singleton"
});

console.log(process.env.PORT)
export default appContainer;