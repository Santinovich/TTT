const express = require("express");
const cors = require("cors");
const { publicIpv4 } = require("public-ip");
const sociosRoutes = require("./routes/sociosRoutes");
const ubicacionRoutes = require("./routes/ubicacionRoutes");

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())
app.use("/api/v1/socios", sociosRoutes);
app.use("/api/v1/ubicacion", ubicacionRoutes);

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
