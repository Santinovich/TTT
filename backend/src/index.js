const express = require("express");
const { publicIpv4 } = require("public-ip");

const sociosRoutes = require("./routes/sociosRoutes");

const app = express();
const port = 3000;

app.use(express.json())
app.use("/api/v1/socios", sociosRoutes);

app.listen(port, async () => {
  console.log(
    `Servidor de TTT corriendo\n\nLocal:   http://localhost:${port}/`
  );
  try {
    const publicIp = await publicIpv4();
    console.log(
      `Público: http://${publicIp}:${port}/ (verificar puertos abiertos)`
    );
  } catch (error) {
    console.error(
      "No se pudo obtener la IP pública, servidor posiblemente sin acceso a internet"
    );
  }
});
