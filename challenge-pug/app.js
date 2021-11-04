const express = require("express");
const app = express();



app.set("views", "./views");
app.set("view engine", "pug");

// settings
app.use("/static", express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/productos");

const fakeApi = [
  {
    id: 1,
    title: "Aspiradora sin bolsa",
    price: "5000"
  },
  { id: 2, title: "Tomate kg", price: "280" },
  { id: 3, title: "Coca Cola 3lt", price: "400" },
  { id: 4, title: "Huevos 12", price: "450" },
];

app.get("/listOfProducts", (request, response) => {

  response.render("main", { lisfOfProductsData:fakeApi });
});
app.use("/productos", productsRouter);
app.use("/", indexRouter);

const server = app.listen(8080, () => {
  console.log("Servidor web iniciado");
});
server.on("error", (error) => console.log("Error en el servidor", error));
