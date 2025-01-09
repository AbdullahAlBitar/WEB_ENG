const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleError(err, res, req) {
  let error_message = "";
  let error_code = "";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error_code = err.code;
    if (err.code === "P2003") {
      error_message = `Foreign key constraint failed on the field ${err.meta.field_name}.`;
    } else if (err.code === "P2002") {
      error_message = `${err.meta.modelName} Unique constraint failed on the fields, fields: ${err.meta.target}.`;
    }else if (err.code === "P2025"){
      error_message = `${err.meta.modelName}, ${err.meta.cause}`;
    }
  }else if (err.meta) {
    error_message = err.meta.error;
    error_code = err.meta.code;
  } else {
    error_message = "An unknown error occurred.";
    error_code = "505"
    console.log("Unknown error:", err); 
  }
  console.log(error_message === ""? err : error_message);
  
  res.status(400).json({ error: error_message, code: error_code });

}


module.exports = { handleError };