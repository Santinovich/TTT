import express from "express";
import multer from "multer";
import fs from "fs";
import { TTTError } from "../utils/ttt-error";
import DocumentoService from "../service/DocumentoService";
import { DocumentoTipo } from "ttt-shared/enum/documento-tipo.enum";
import {
    CreateDocumentoDto,
    GetDocumentoDto,
    GetDocumentosDto,
} from "ttt-shared/dto/documento.dto";

const documentosPath = "uploads/documentos";

if (!fs.existsSync(documentosPath)) {
    fs.mkdirSync(documentosPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentosPath);
    },
    filename: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|jpg|png)$/)) {
            cb(new TTTError("Tipo de archivo no permitido. Solo se permiten PDF, JPG o PNG."), "");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            // 5 MB
            cb(new TTTError("El archivo es demasiado grande. El tamaño máximo permitido es de 5 MB."), "");
            return;
        }
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}-doc`;
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

const documentosRouter = express.Router();
const documentoService = new DocumentoService();

documentosRouter.get("/:idDocumento", async (req, res) => {
    const idDocumento = !isNaN(parseInt(req.params.idDocumento))
        ? parseInt(req.params.idDocumento)
        : null;
    if (!idDocumento) {
        res.status(400).json({ error: "ID de documento inválido" });
        return;
    }
    try {
        const documento = await documentoService.getDocumentoById(idDocumento);
        if (!documento) {
            res.status(404).json({ error: "Documento no encontrado" });
            return;
        }
        const dto: GetDocumentoDto = {
            documento: {
                id: documento.id,
                tipo: documento.tipo,
                nombreArchivo: documento.nombreArchivo,
            },
        };
        res.json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al obtener el documento" });
    }
});

documentosRouter.get("/", async (req, res) => {
    const idSocio = !isNaN(parseInt(req.query.idSocio as string))
        ? parseInt(req.query.idSocio as string)
        : null;
    if (!idSocio) {
        res.status(400).json({ error: "ID de socio inválido" });
        return;
    }
    try {
        const documentos = await documentoService.getDocumentosBySocioId(idSocio);

        const dto: GetDocumentosDto = {
            documentos: documentos.map((doc) => {
                return {
                    id: doc.id,
                    tipo: doc.tipo,
                    nombreArchivo: doc.nombreArchivo,
                };
            }),
        };

        res.json(documentos);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al obtener los documentos" });
    }
});

documentosRouter.post("/", upload.single("documento"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No se ha subido ningún archivo" });
        return;
    }
    const idSocio = !isNaN(parseInt(req.query.idSocio as string))
        ? parseInt(req.query.idSocio as string)
        : null;
    if (!idSocio) {
        res.status(400).json({ error: "ID de socio inválido" });
        return;
    }

    const body = req.body as CreateDocumentoDto;
    if (!DocumentoTipo[body.tipo]) {
        res.status(400).json({ error: "Tipo de documento inválido" });
        return;
    }

    const newDocumento = await documentoService.createDocumento(idSocio, {
        tipo: body.tipo,
        nombreArchivo: req.file.filename,
    });

    const dto: GetDocumentoDto = {
        documento: {
            id: newDocumento.id,
            tipo: newDocumento.tipo,
            nombreArchivo: newDocumento.nombreArchivo,
        },
    };

    res.status(201).json(dto);
});

documentosRouter.delete("/:idDocumento", async (req, res) => {
    const idDocumento = !isNaN(parseInt(req.params.idDocumento))
        ? parseInt(req.params.idDocumento)
        : null;
    if (!idDocumento) {
        res.status(400).json({ error: "ID de documento inválido" });
        return;
    }
    try {
        const documento = await documentoService.getDocumentoById(idDocumento);
        if (!documento) {
            res.status(404).json({ error: "Documento no encontrado" });
            return;
        }
        const filePath = `${documentosPath}/${documento.nombreArchivo}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await documentoService.deleteDocumento(idDocumento);
        res.status(200).send(
            { message: "Documento eliminado correctamente" }
        );
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
});

export default documentosRouter;
