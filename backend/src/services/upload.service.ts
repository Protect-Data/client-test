import AWS, { Endpoint } from "aws-sdk";
import dayjs from "dayjs";

const s3Client = new AWS.S3({
  endpoint: new Endpoint(process.env.DO_SPACE_URL || ""),
  region: process.env.DO_SPACE_REGION || "NYC3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ID || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || ""
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export async function handlerUpload(
  base64: string,
  filename: string,
  mimetype: string
) {
  try {
    const base64Data = base64.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const newFilename = `${dayjs().unix()}_${filename}`;
    const fileUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env
      .DO_SPACE_REGION || "nyc3"}.digitaloceanspaces.com/${newFilename}`;
    await s3Client.putObject(
      {
        Bucket: process.env.DO_SPACES_BUCKET || "",
        Key: newFilename,
        Body: buffer,
        ACL: "public-read",
        ContentType: mimetype
      },
      async (err, data: any) => {
        if (err) {
          console.log("s3Client.putObject", err);
          throw new Error("Falha ao enviar o arquivo");
        }
      }
    );
    return { fileUrl, message: "O arquivo foi enviado com sucesso" };
  } catch (error) {
    console.log("s3Client.putObject", error);
    throw new Error("Falha ao enviar o arquivo");
  }
}

export async function handlerDelete(filename: string) {
  if (!filename) {
    return { error: "Nome do arquivo não foi fornecido." };
  }
  try {
    await s3Client.deleteObject(
      {
        Bucket: process.env.DO_SPACES_BUCKET || "",
        Key: filename
      },
      (err, data) => {
        if (err) {
          console.log("Erro ao excluir o arquivo:", err);
          throw new Error("Erro ao excluir o arquivo");
        }
        return { message: "Arquivo excluído com sucesso", data };
      }
    );
  } catch (error) {
    console.log("Erro ao excluir o arquivo", error);
    throw new Error("Erro ao processar a exclusão");
  }
}
